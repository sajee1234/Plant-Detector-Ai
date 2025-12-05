
import React, { useState, useRef } from 'react';
import { Search, Filter, Plus, MapPin, Star, ShoppingCart, ArrowLeft, Camera, Upload, X, Check } from 'lucide-react';
import { MarketItem } from '../types';

const INITIAL_ITEMS: MarketItem[] = [
  {
    id: '1',
    name: 'Organic Tomato Seeds',
    price: '$5.00',
    category: 'Seeds',
    image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=200',
    location: 'Green Valley',
    seller: 'Sarah Jenkins',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Heavy Duty Garden Shovel',
    price: '$24.50',
    category: 'Tools',
    image: 'https://images.unsplash.com/photo-1530268578403-ade528997a31?auto=format&fit=crop&q=80&w=200',
    location: 'Uptown Hardware',
    seller: 'Mike Tools',
    rating: 4.5
  },
  {
    id: '3',
    name: 'Natural NPK Fertilizer (5kg)',
    price: '$18.00',
    category: 'Fertilizer',
    image: 'https://images.unsplash.com/photo-1628186177579-2a9009804c8f?auto=format&fit=crop&q=80&w=200',
    location: 'Farm Depot',
    seller: 'Green Earth Co',
    rating: 4.9
  },
  {
    id: '4',
    name: 'Grafted Mango Sapling',
    price: '$12.00',
    category: 'Plants',
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=200',
    location: 'Sunny Nursery',
    seller: 'Plant Pros',
    rating: 4.7
  }
];

const CATEGORIES = ['All', 'Seeds', 'Plants', 'Tools', 'Fertilizer'];
const SELL_CATEGORIES = ['Seeds', 'Plants', 'Tools', 'Fertilizer'];

export const Marketplace: React.FC = () => {
  const [items, setItems] = useState<MarketItem[]>(INITIAL_ITEMS);
  const [isSelling, setIsSelling] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Sell Form State
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Seeds');
  const [newItemLocation, setNewItemLocation] = useState('');
  const [newItemImage, setNewItemImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItemImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItemName || !newItemPrice || !newItemLocation) {
        alert("Please fill in all required fields.");
        return;
    }

    const newItem: MarketItem = {
      id: Date.now().toString(),
      name: newItemName,
      price: newItemPrice.startsWith('$') ? newItemPrice : `$${newItemPrice}`,
      category: newItemCategory as any,
      image: newItemImage || 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=200', // Fallback image
      location: newItemLocation,
      seller: 'You',
      rating: 5.0 // New items start with 5 stars
    };

    setItems([newItem, ...items]);
    
    // Reset form and view
    setNewItemName('');
    setNewItemPrice('');
    setNewItemCategory('Seeds');
    setNewItemLocation('');
    setNewItemImage(null);
    setIsSelling(false);
    setActiveCategory('All'); // Show all so user sees their new item
  };

  if (isSelling) {
    return (
      <div className="flex flex-col h-full bg-white pb-24 animate-fade-in">
        <div className="bg-white px-6 pt-12 pb-4 border-b border-stone-100 sticky top-0 z-10 flex items-center">
            <button 
                onClick={() => setIsSelling(false)}
                className="mr-4 p-2 -ml-2 rounded-full hover:bg-stone-100 transition-colors"
            >
                <ArrowLeft size={24} className="text-stone-600" />
            </button>
            <h1 className="text-2xl font-bold text-stone-800">List an Item</h1>
        </div>

        <form onSubmit={handlePostItem} className="p-6 space-y-6 overflow-y-auto">
            {/* Image Upload */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700">Item Photo</label>
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                        newItemImage ? 'border-emerald-500 bg-stone-50' : 'border-stone-300 bg-stone-50 hover:bg-stone-100'
                    }`}
                >
                    {newItemImage ? (
                         <div className="relative w-full h-full">
                            <img src={newItemImage} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                             <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <span className="text-white font-medium bg-black/50 px-3 py-1 rounded-full">Change Photo</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2">
                                <Camera size={24} />
                            </div>
                            <span className="text-sm text-stone-500 font-medium">Tap to upload photo</span>
                        </>
                    )}
                </div>
                <input 
                    type="file" 
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                />
            </div>

            {/* Inputs */}
            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-sm font-bold text-stone-700">Item Name</label>
                    <input 
                        type="text" 
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="e.g., Organic Tomato Seeds"
                        className="w-full bg-stone-100 border-none rounded-xl py-3 px-4 text-stone-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-sm font-bold text-stone-700">Price</label>
                        <input 
                            type="text" 
                            value={newItemPrice}
                            onChange={(e) => setNewItemPrice(e.target.value)}
                            placeholder="$0.00"
                            className="w-full bg-stone-100 border-none rounded-xl py-3 px-4 text-stone-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                         <label className="text-sm font-bold text-stone-700">Category</label>
                         <div className="relative">
                            <select 
                                value={newItemCategory}
                                onChange={(e) => setNewItemCategory(e.target.value)}
                                className="w-full bg-stone-100 border-none rounded-xl py-3 px-4 text-stone-800 focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
                            >
                                {SELL_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                             <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                         </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-bold text-stone-700">Location</label>
                     <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                        <input 
                            type="text" 
                            value={newItemLocation}
                            onChange={(e) => setNewItemLocation(e.target.value)}
                            placeholder="e.g., Green Valley"
                            className="w-full bg-stone-100 border-none rounded-xl py-3 pl-10 pr-4 text-stone-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            <button 
                type="submit"
                className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-transform active:scale-95 flex items-center justify-center"
            >
                <Check size={20} className="mr-2" />
                Post Listing
            </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-stone-50 pb-24 animate-fade-in">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 shadow-sm sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Marketplace</h1>
            <p className="text-xs text-stone-500">Buy & Sell Local Farm Goods</p>
          </div>
          <button 
            onClick={() => setIsSelling(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all"
          >
            <Plus size={16} className="mr-1" />
            Sell Item
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input
            type="text"
            placeholder="Search seeds, tools, plants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-100 border-none rounded-xl py-3 pl-10 pr-4 text-stone-700 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        {/* Categories */}
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-stone-800 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="p-6 grid grid-cols-2 gap-4 overflow-y-auto">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-stone-100">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-lg flex items-center shadow-sm">
                <Star size={10} className="text-yellow-400 fill-yellow-400 mr-0.5" />
                <span className="text-[10px] font-bold text-stone-800">{item.rating}</span>
              </div>
            </div>
            
            <div className="flex flex-col flex-1">
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-1">{item.category}</span>
              <h3 className="text-sm font-bold text-stone-800 leading-tight mb-1 line-clamp-2">{item.name}</h3>
              <div className="flex items-center text-stone-400 text-[10px] mb-2">
                <MapPin size={10} className="mr-0.5" />
                {item.location}
              </div>
              
              <div className="mt-auto flex items-center justify-between">
                <span className="text-lg font-bold text-stone-900">{item.price}</span>
                <button className="bg-emerald-50 p-2 rounded-full text-emerald-600 hover:bg-emerald-100 transition-colors">
                  <ShoppingCart size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="col-span-2 flex flex-col items-center justify-center py-12 text-stone-400">
            <Filter size={48} className="mb-4 opacity-20" />
            <p className="text-sm font-medium">No items found.</p>
            <p className="text-xs">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};
