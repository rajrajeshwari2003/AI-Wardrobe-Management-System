import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ShoppingBag, ExternalLink, TrendingUp, Sparkles, Search } from 'lucide-react';
import { Input } from './ui/input';
import type { WardrobeItem } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ShoppingRecommendationsProps {
  wardrobeItems: WardrobeItem[];
}

interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  store: string;
  link: string;
  trending: boolean;
}

export function ShoppingRecommendations({ wardrobeItems }: ShoppingRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<ShoppingItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateRecommendations();
  }, [wardrobeItems]);

  const generateRecommendations = () => {
    // Analyze wardrobe gaps
    const categories = ['top', 'bottom', 'traditional', 'footwear', 'bags', 'watch', 'shoes', 'accessories'];
    const wardrobeCategories = new Set(wardrobeItems.map(item => item.category));
    const missingCategories = categories.filter(cat => !wardrobeCategories.has(cat as any));

    // Generate mock shopping recommendations based on gaps and trends
    const mockRecommendations: ShoppingItem[] = [
      {
        id: '1',
        name: 'Classic White Shirt',
        category: 'top',
        price: '$29.99',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
        store: 'Fashion Store',
        link: '#',
        trending: true
      },
      {
        id: '2',
        name: 'Designer Handbag',
        category: 'bags',
        price: '$89.99',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
        store: 'Luxury Boutique',
        link: '#',
        trending: true
      },
      {
        id: '3',
        name: 'Leather Sneakers',
        category: 'shoes',
        price: '$69.99',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
        store: 'Shoe Palace',
        link: '#',
        trending: false
      },
      {
        id: '4',
        name: 'Silk Scarf',
        category: 'accessories',
        price: '$24.99',
        image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400',
        store: 'Accessory Hub',
        link: '#',
        trending: true
      },
      {
        id: '5',
        name: 'Denim Jeans',
        category: 'bottom',
        price: '$49.99',
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
        store: 'Denim Co',
        link: '#',
        trending: false
      },
      {
        id: '6',
        name: 'Traditional Kurta',
        category: 'traditional',
        price: '$59.99',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
        store: 'Ethnic Wear',
        link: '#',
        trending: true
      },
      {
        id: '7',
        name: 'Smart Watch',
        category: 'watch',
        price: '$199.99',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        store: 'Tech Store',
        link: '#',
        trending: true
      },
      {
        id: '8',
        name: 'Chelsea Boots',
        category: 'footwear',
        price: '$79.99',
        image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400',
        store: 'Boot Emporium',
        link: '#',
        trending: false
      },
      {
        id: '9',
        name: 'Blazer Jacket',
        category: 'top',
        price: '$99.99',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400',
        store: 'Business Attire',
        link: '#',
        trending: true
      },
      {
        id: '10',
        name: 'Gold Necklace',
        category: 'accessories',
        price: '$149.99',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
        store: 'Jewelry Gallery',
        link: '#',
        trending: false
      }
    ];

    // Prioritize recommendations for missing categories
    const prioritized = mockRecommendations.sort((a, b) => {
      const aIsMissing = missingCategories.includes(a.category) ? 1 : 0;
      const bIsMissing = missingCategories.includes(b.category) ? 1 : 0;
      return bIsMissing - aIsMissing;
    });

    setRecommendations(prioritized);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    // Simulate search
    setTimeout(() => {
      setLoading(false);
      // In real implementation, this would search Google Shopping API
      window.open(`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(searchQuery)}`, '_blank');
    }, 500);
  };

  const trendingItems = recommendations.filter(item => item.trending);
  const gapFillers = recommendations.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingBag className="w-8 h-8" />
            <div>
              <h2>Smart Shopping</h2>
              <p className="text-sm opacity-90">
                AI-powered recommendations to complete your wardrobe
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Search for items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-white/90 text-gray-900 border-0"
            />
            <Button 
              variant="secondary" 
              onClick={handleSearch}
              disabled={loading}
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Tabs */}
      <Tabs defaultValue="gaps" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gaps">
            <Sparkles className="w-4 h-4 mr-2" />
            Fill Your Gaps
          </TabsTrigger>
          <TabsTrigger value="trending">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending Now
          </TabsTrigger>
        </TabsList>

        {/* Gap Fillers */}
        <TabsContent value="gaps" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recommended for Your Wardrobe</CardTitle>
              <CardDescription>
                Complete your wardrobe with these AI-selected items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {gapFillers.map(item => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square relative">
                      <ImageWithFallback 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      {item.trending && (
                        <Badge className="absolute top-2 right-2 bg-orange-500">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h4 className="text-sm mb-1">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">{item.store}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-purple-700">{item.price}</span>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {item.category}
                        </Badge>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                        onClick={() => window.open(`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(item.name)}`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Shop Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trending Items */}
        <TabsContent value="trending" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Trending Fashion Items</CardTitle>
              <CardDescription>
                Popular items based on current fashion trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendingItems.map(item => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square relative">
                      <ImageWithFallback 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-orange-500">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h4 className="text-sm mb-1">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">{item.store}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-purple-700">{item.price}</span>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {item.category}
                        </Badge>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                        onClick={() => window.open(`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(item.name)}`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Shop Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Shopping Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h4 className="text-sm text-blue-900 mb-3">💡 Smart Shopping Tips</h4>
          <ul className="text-sm text-blue-700 space-y-2">
            <li>• Build a versatile wardrobe with basic essentials first</li>
            <li>• Invest in quality pieces for formal and traditional wear</li>
            <li>• Mix and match items to create more outfit combinations</li>
            <li>• Consider seasonal weather when shopping for new items</li>
            <li>• Check reviews and ratings before making purchases</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
