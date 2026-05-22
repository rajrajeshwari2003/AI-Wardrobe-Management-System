import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';
import heroImage from 'figma:asset/6a8ac061a008d633730eb1b802b91073cefce764.png';

interface HomePageProps {
  onGetStarted: () => void;
}

export function HomePage({ onGetStarted }: HomePageProps) {
  return (
    <div className="min-h-screen bg-[#f5f2ed]">
      {/* Header */}
      <header className="px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <span className="tracking-tight font-bold text-[20px]">The Style Guide</span>
        </div>
        <Button 
          onClick={onGetStarted}
          className="bg-black text-white hover:bg-black/90 rounded-full px-6"
        >
          Get Started
        </Button>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 max-w-xl">
            <h1 className="text-5xl lg:text-6xl tracking-tight leading-tight">
              Your Smart Wardrobe Assistant
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Digitize your wardrobe, get AI-powered outfit recommendations based on weather, occasions, and your personal style. Never wonder what to wear again.
            </p>
            <Button 
              onClick={onGetStarted}
              className="bg-black text-white hover:bg-black/90 rounded-full px-8 py-6 text-base"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Start Your Journey
            </Button>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="bg-[#e8e4dc] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1562008088-e8fe0711f7e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd2FyZHJvYmUlMjBjbG9zZXQlMjBmYXNoaW9ufGVufDF8fHx8MTc2MzM3NjM0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                alt="Elegant wardrobe with blazers, bag and accessories" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto bg-[rgba(187,6,6,0)]">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-3">
            <h3 className="tracking-tight">Digital Wardrobe</h3>
            <p className="text-gray-600 leading-relaxed">
              Capture and organize your entire wardrobe digitally. Categorize by type, color, season, and occasion for easy access.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="tracking-tight">AI Recommendations</h3>
            <p className="text-gray-600 leading-relaxed">
              Get personalized outfit suggestions based on weather forecasts, calendar events, and trending fashion styles.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="tracking-tight">Smart Shopping</h3>
            <p className="text-gray-600 leading-relaxed">
              Discover missing pieces for your wardrobe with integrated shopping suggestions from top fashion retailers.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center mb-16 tracking-tight">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto">
                1
              </div>
              <h3 className="tracking-tight">Upload</h3>
              <p className="text-gray-600 leading-relaxed">
                Photograph or upload images of your clothing items and accessories.
              </p>
            </div>
            
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto">
                2
              </div>
              <h3 className="tracking-tight">Organize</h3>
              <p className="text-gray-600 leading-relaxed">
                Categorize items and set preferences for style, occasions, and seasons.
              </p>
            </div>
            
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto">
                3
              </div>
              <h3 className="tracking-tight">Discover</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive AI-powered outfit recommendations tailored to your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto text-center">
        <div className="space-y-6 max-w-2xl mx-auto">
          <h2 className="tracking-tight">Ready to Transform Your Style?</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Join users who've simplified their fashion choices with AI-powered wardrobe management.
          </p>
          <Button 
            onClick={onGetStarted}
            className="bg-black text-white hover:bg-black/90 rounded-full px-8 py-6 text-base"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-6 py-8">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
          <p>© 2025 The Style Guide. AI-Powered Fashion Assistant.</p>
        </div>
      </footer>
    </div>
  );
}
