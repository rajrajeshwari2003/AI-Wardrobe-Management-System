import { useState, useEffect } from 'react';
import { WardrobeManager } from './components/WardrobeManager';
import { OutfitGenerator } from './components/OutfitGenerator';
import { EventCalendar } from './components/EventCalendar';
import { ShoppingRecommendations } from './components/ShoppingRecommendations';
import { HomePage } from './components/HomePage';
import { AuthPage } from './components/AuthPage';
import { Button } from './components/ui/button';
import { Sparkles, LogOut, User } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { wardrobeAPI, eventsAPI } from './utils/api';
import { authService, type AuthSession } from './utils/auth';
import { toast } from 'sonner@2.0.3';

export interface WardrobeItem {
  id: string;
  category: 'top' | 'bottom' | 'traditional' | 'footwear' | 'bags' | 'watch' | 'shoes' | 'accessories';
  image: string;
  name: string;
  color: string;
  style: string;
  season: string[];
  occasions: string[];
}

export interface Event {
  id: string;
  title: string;
  date: Date;
  type: 'casual' | 'formal' | 'party' | 'festival' | 'work' | 'sport';
  description?: string;
}

export interface OutfitRecommendation {
  id: string;
  items: WardrobeItem[];
  score: number;
  occasion: string;
  weather: string;
  missingItems?: string[];
}

export default function App() {
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [view, setView] = useState<'home' | 'auth' | 'app'>('home');
  const [activeTab, setActiveTab] = useState<'wardrobe' | 'outfits' | 'calendar' | 'shopping'>('wardrobe');

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    const authSession = await authService.getSession();
    if (authSession) {
      setSession(authSession);
      setView('app');
      await loadData(authSession);
    } else {
      setView('home');
      setLoading(false);
    }
  };

  // Load data from Supabase
  const loadData = async (authSession: AuthSession) => {
    setLoading(true);
    const [wardrobeData, eventsData] = await Promise.all([
      wardrobeAPI.getAll(),
      eventsAPI.getAll(),
    ]);
    setWardrobeItems(wardrobeData);
    
    // If no events, add default ones
    if (eventsData.length === 0) {
      const defaultEvents = [
        {
          id: '1',
          title: 'Diwali Celebration',
          date: new Date(2025, 10, 20),
          type: 'festival' as const,
          description: 'Traditional festival celebration'
        },
        {
          id: '2',
          title: 'Office Meeting',
          date: new Date(2025, 10, 18),
          type: 'work' as const,
          description: 'Quarterly review meeting'
        },
        {
          id: '3',
          title: 'Birthday Party',
          date: new Date(2025, 10, 22),
          type: 'party' as const,
          description: 'Friend\'s birthday celebration'
        }
      ];
      setEvents(defaultEvents);
      // Save default events to backend
      for (const event of defaultEvents) {
        await eventsAPI.add(event);
      }
    } else {
      setEvents(eventsData);
    }
    setLoading(false);
  };

  const addWardrobeItem = async (item: WardrobeItem) => {
    const addedItem = await wardrobeAPI.add(item);
    if (addedItem) {
      setWardrobeItems([...wardrobeItems, addedItem]);
    }
  };

  const deleteWardrobeItem = async (id: string) => {
    const success = await wardrobeAPI.delete(id);
    if (success) {
      setWardrobeItems(wardrobeItems.filter(item => item.id !== id));
    }
  };

  const addEvent = async (event: Event) => {
    const addedEvent = await eventsAPI.add(event);
    if (addedEvent) {
      setEvents([...events, addedEvent]);
    }
  };

  const handleAuthSuccess = async () => {
    await checkAuth();
  };

  const handleLogout = async () => {
    await authService.logout();
    setSession(null);
    setView('home');
    setWardrobeItems([]);
    setEvents([]);
    toast.success('Logged out successfully');
  };

  // Show loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f2ed] flex items-center justify-center">
        <Toaster />
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show home page
  if (view === 'home') {
    return (
      <>
        <Toaster />
        <HomePage onGetStarted={() => setView('auth')} />
      </>
    );
  }

  // Show auth page
  if (view === 'auth') {
    return (
      <>
        <Toaster />
        <AuthPage 
          onSuccess={handleAuthSuccess}
          onBack={() => setView('home')}
        />
      </>
    );
  }

  // Show main app (authenticated)
  return (
    <div className="min-h-screen bg-[#f5f2ed]">
      <Toaster />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span className="tracking-tight">The Style Guide</span>
              <span className="ml-4 font-semibold">Welcome, {session?.user.name}!</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant={activeTab === 'wardrobe' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('wardrobe')}
                className={activeTab === 'wardrobe' ? 'bg-black text-white hover:bg-black/90 rounded-full' : 'rounded-full'}
              >
                My Wardrobe
              </Button>
              <Button
                variant={activeTab === 'outfits' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('outfits')}
                className={activeTab === 'outfits' ? 'bg-black text-white hover:bg-black/90 rounded-full' : 'rounded-full'}
              >
                Generate Outfits
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="rounded-full"
                title={session?.user.name}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {activeTab === 'wardrobe' && (
          <WardrobeManager 
            items={wardrobeItems}
            onAddItem={addWardrobeItem}
            onDeleteItem={deleteWardrobeItem}
          />
        )}

        {activeTab === 'outfits' && (
          <OutfitGenerator 
            wardrobeItems={wardrobeItems} 
            events={events}
          />
        )}

        {activeTab === 'calendar' && (
          <EventCalendar 
            events={events}
            onAddEvent={addEvent}
          />
        )}

        {activeTab === 'shopping' && (
          <ShoppingRecommendations wardrobeItems={wardrobeItems} />
        )}
      </main>
    </div>
  );
}
