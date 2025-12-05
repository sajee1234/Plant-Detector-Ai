
import React, { useState } from 'react';
import { MapPin, Search, CheckCircle, AlertOctagon, Navigation as NavIcon, Thermometer, Droplets, Sprout, Wind, Loader2, ExternalLink } from 'lucide-react';
import { analyzeFarmingLocation } from '../services/geminiService';
import { LocationAnalysis } from '../types';

export const MapView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [locationData, setLocationData] = useState<LocationAnalysis | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setLocationData(null); // Clear previous results

    try {
      const data = await analyzeFarmingLocation(searchQuery);
      setLocationData(data);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze location. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const openGoogleMaps = () => {
    if (!searchQuery) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-stone-50 pb-24 animate-fade-in relative">
      {/* Search Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 pt-8 bg-gradient-to-b from-stone-50 via-stone-50/90 to-transparent">
        <form onSubmit={handleSearch} className="relative shadow-sm">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search farm location (e.g. Napa Valley, CA)"
            className="w-full bg-white border border-stone-200 text-stone-800 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          {isSearching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Loader2 className="animate-spin text-emerald-600" size={20} />
            </div>
          )}
        </form>
      </div>

      {/* Map Background (Simulated) */}
      <div className="flex-1 relative overflow-hidden bg-stone-100 flex items-center justify-center">
        {/* Subtle Grid Pattern to replace image */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        {!locationData && !isSearching && (
           <div className="text-center p-8 opacity-40">
              <div className="w-24 h-24 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-4">
                 <MapPin size={40} className="text-stone-400" />
              </div>
              <p className="text-stone-500 font-medium">Search a location to view farming insights</p>
           </div>
        )}

        {/* Animated Radar Effect if Searching */}
        {isSearching && (
           <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-20">
              <div className="flex flex-col items-center">
                 <div className="relative">
                   <div className="w-24 h-24 border-4 border-emerald-500 rounded-full animate-ping opacity-75 absolute top-0 left-0"></div>
                   <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center backdrop-blur-md border border-emerald-500">
                      <MapPin size={40} className="text-emerald-500" />
                   </div>
                 </div>
                 <p className="mt-8 text-emerald-800 font-bold text-lg">Analyzing Terrain & Climate...</p>
              </div>
           </div>
        )}

        {/* Location Data Card (Results) */}
        {locationData && !isSearching && (
          <div className="absolute bottom-4 left-4 right-4 z-20 animate-slide-up">
            <div className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden">
              {/* Card Header */}
              <div className={`p-4 ${locationData.isSuitableForPlanting ? 'bg-emerald-600' : 'bg-red-500'} text-white flex justify-between items-center`}>
                <div>
                  <h2 className="text-lg font-bold flex items-center">
                    <MapPin size={18} className="mr-1" />
                    {locationData.locationName}
                  </h2>
                  <p className="text-xs opacity-90 font-medium">
                    Suitability Score: {locationData.suitabilityScore}/100
                  </p>
                </div>
                <div className="bg-white/20 p-2 rounded-full">
                  {locationData.isSuitableForPlanting ? <CheckCircle size={24} /> : <AlertOctagon size={24} />}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <p className="text-stone-600 text-sm mb-4 leading-relaxed font-medium">
                  {locationData.reasoning}
                </p>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                    <div className="flex items-center space-x-2 mb-1">
                      <Thermometer size={14} className="text-orange-500" />
                      <span className="text-[10px] text-stone-400 font-bold uppercase">Climate Zone</span>
                    </div>
                    <p className="text-sm font-bold text-stone-800 truncate">{locationData.climateZone}</p>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                    <div className="flex items-center space-x-2 mb-1">
                      <Layers size={14} className="text-stone-500" />
                      <span className="text-[10px] text-stone-400 font-bold uppercase">Soil Type</span>
                    </div>
                    <p className="text-sm font-bold text-stone-800 truncate">{locationData.soilType}</p>
                  </div>
                </div>

                {/* Best Crops */}
                <div className="mb-5">
                   <h3 className="text-xs font-bold text-stone-400 uppercase mb-2 flex items-center">
                     <Sprout size={12} className="mr-1" /> Best to Plant Now
                   </h3>
                   <div className="flex flex-wrap gap-2">
                     {locationData.bestCrops.map((crop, idx) => (
                       <span key={idx} className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-100">
                         {crop}
                       </span>
                     ))}
                   </div>
                </div>

                {/* Actions */}
                <button 
                  onClick={openGoogleMaps}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center"
                >
                  <NavIcon size={16} className="mr-2" />
                  Open in Google Maps
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper icon
const Layers = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);
    