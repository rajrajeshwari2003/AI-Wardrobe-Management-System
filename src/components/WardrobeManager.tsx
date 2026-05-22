import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Upload, Trash2, Shirt, Palmtree, Footprints, ShoppingBag, Watch, Sparkles } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { WardrobeItem } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface WardrobeManagerProps {
  items: WardrobeItem[];
  onAddItem: (item: WardrobeItem) => void;
  onDeleteItem: (id: string) => void;
}

export function WardrobeManager({ items, onAddItem, onDeleteItem }: WardrobeManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | WardrobeItem['category']>('all');
  const [newItem, setNewItem] = useState({
    category: 'top' as WardrobeItem['category'],
    name: '',
    brand: '',
    color: '',
    style: '',
    season: [] as string[],
    occasions: [] as string[],
  });
  const [selectedImage, setSelectedImage] = useState<string>('');

  const categories = [
    { value: 'all', label: 'All Items', icon: null },
    { value: 'top', label: 'Tops', icon: Shirt },
    { value: 'bottom', label: 'Bottoms', icon: Palmtree },
    { value: 'traditional', label: 'Traditional Wear', icon: Sparkles },
    { value: 'footwear', label: 'Footwear', icon: Footprints },
    { value: 'bags', label: 'Bags', icon: ShoppingBag },
    { value: 'watch', label: 'Watches', icon: Watch },
    { value: 'shoes', label: 'Shoes', icon: Footprints },
    { value: 'accessories', label: 'Accessories', icon: Sparkles },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = () => {
    if (!newItem.name || !selectedImage) {
      toast.error('Please provide item name and image');
      return;
    }

    const item: WardrobeItem = {
      id: Date.now().toString(),
      category: newItem.category,
      image: selectedImage,
      name: newItem.name,
      color: newItem.color,
      style: newItem.style,
      season: newItem.season,
      occasions: newItem.occasions,
    };

    onAddItem(item);
    toast.success('Item added to wardrobe!');
    setIsAddDialogOpen(false);
    setNewItem({
      category: 'top',
      name: '',
      brand: '',
      color: '',
      style: '',
      season: [],
      occasions: [],
    });
    setSelectedImage('');
  };

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1>Your Wardrobe</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-black/90 text-white rounded-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
              <DialogDescription>Upload and categorize your clothing item</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Item Image</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-500 transition-colors">
                        {selectedImage ? (
                          <ImageWithFallback src={selectedImage} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-12 h-12 mx-auto text-gray-400" />
                            <p className="text-sm text-gray-600">Click to upload image</p>
                          </div>
                        )}
                      </div>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={newItem.category} onValueChange={(value: WardrobeItem['category']) => setNewItem({ ...newItem, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(cat => cat.value !== 'all').map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Item Name */}
              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input
                  placeholder="e.g., Blue Denim Jacket"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
              </div>

              {/* Brand */}
              <div className="space-y-2">
                <Label>Brand (Optional)</Label>
                <Input
                  placeholder="e.g., Levi's, H&M, Uniqlo"
                  value={newItem.brand}
                  onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
                />
              </div>

              {/* Color */}
              <div className="space-y-2">
                <Label>Color</Label>
                <Input
                  placeholder="e.g., Blue, Red, Multicolor"
                  value={newItem.color}
                  onChange={(e) => setNewItem({ ...newItem, color: e.target.value })}
                />
              </div>

              {/* Style */}
              <div className="space-y-2">
                <Label>Style</Label>
                <Select value={newItem.style} onValueChange={(value) => setNewItem({ ...newItem, style: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="traditional">Traditional</SelectItem>
                    <SelectItem value="sporty">Sporty</SelectItem>
                    <SelectItem value="party">Party</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleAddItem} className="w-full bg-black hover:bg-black/90 rounded-full">
                Add to Wardrobe
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                isActive 
                  ? 'bg-black text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Items Grid */}
      <div className="bg-white rounded-lg p-6 min-h-[400px]">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Shirt className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-gray-900 mb-2">No items yet</h3>
            <p className="text-gray-600 mb-4">Start building your digital wardrobe</p>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-black hover:bg-black/90 rounded-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Item
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredItems.map(item => (
              <div key={item.id} className="group">
                <div className="bg-gray-50 rounded-xl overflow-hidden mb-3 aspect-square relative">
                  <ImageWithFallback 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover" 
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                    onClick={() => {
                      onDeleteItem(item.id);
                      toast.success('Item removed');
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  <p className="truncate">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.style || categories.find(c => c.value === item.category)?.label}
                  </p>
                  {item.color && (
                    <p className="text-sm text-gray-500">{item.color}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
