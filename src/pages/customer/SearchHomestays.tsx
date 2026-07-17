import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, SlidersHorizontal, Star, ShieldAlert, Wifi, Tv, Coffee } from 'lucide-react';
import { motion } from 'motion/react';

export const SearchHomestays: React.FC = () => {
  const { homestays, reviews, currencySymbol } = useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Sync state from query parameters on load
  useEffect(() => {
    const cityParam = searchParams.get('city');
    if (cityParam) setSelectedCity(cityParam);
  }, [searchParams]);

  // Extract metadata
  const cities = Array.from(new Set(homestays.map(h => h.city)));
  const allAmenities = Array.from(new Set(homestays.flatMap(h => h.amenities)));

  // Filter logic
  const filteredHomestays = homestays.filter(hs => {
    if (hs.status !== 'active') return false;

    const matchesQuery = 
      hs.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hs.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hs.state.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCity = selectedCity === '' || hs.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesPrice = hs.pricePerNight <= maxPrice;
    
    const matchesAmenities = selectedAmenities.every(amenity => 
      hs.amenities.includes(amenity)
    );

    return matchesQuery && matchesCity && matchesPrice && matchesAmenities;
  });

  const getAvgRating = (homestayId: string) => {
    const hsReviews = reviews.filter(r => r.homestayId === homestayId);
    if (hsReviews.length === 0) return 4.5;
    return Number((hsReviews.reduce((acc, r) => acc + r.rating, 0) / hsReviews.length).toFixed(1));
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity) 
        : [...prev, amenity]
    );
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCity('');
    setMaxPrice(10000);
    setSelectedAmenities([]);
    setSearchParams({});
  };

  return (
    <div id="search-homestays-page" className="min-h-screen bg-[#F8FAFC] p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Homestays</h1>
        <p className="text-slate-500 mt-1">Discover verified boutique homestays with custom amenities.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <div className={`lg:block bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 h-fit ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="flex justify-between items-center pb-4 border-b border-slate-50">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-blue-600" />
              <span>Filter Options</span>
            </h3>
            <button 
              onClick={handleReset}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Reset All
            </button>
          </div>

          {/* Search Text */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Search Keyword</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="h-3.5 w-3.5" />
              </span>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name, forest, beachfront..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-hidden text-sm text-slate-800"
              />
            </div>
          </div>

          {/* City Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">City Location</label>
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setSearchParams(e.target.value ? { city: e.target.value } : {});
              }}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-hidden text-sm font-medium text-gray-700 bg-white"
            >
              <option value="">All Cities</option>
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
              <span>Max Price</span>
              <span className="text-blue-600 font-extrabold font-mono">{currencySymbol}{maxPrice}/night</span>
            </div>
            <input 
              type="range" 
              min={1000}
              max={10000}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-gray-100 rounded-lg cursor-pointer"
            />
          </div>

          {/* Amenities Checklist */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Amenities Included</label>
            <div className="space-y-2">
              {allAmenities.map(amenity => {
                const checked = selectedAmenities.includes(amenity);
                return (
                  <label key={amenity} className="flex items-center gap-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={checked}
                      onChange={() => handleAmenityToggle(amenity as string)}
                      className="rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{amenity}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Block */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full py-3 bg-white border border-slate-100 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm text-slate-700 shadow-sm lg:hidden cursor-pointer"
          >
            <SlidersHorizontal className="h-4 w-4 text-blue-600" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filter Panel'}</span>
          </button>

          {filteredHomestays.length === 0 ? (
            <div className="text-center bg-white p-12 rounded-2xl border border-slate-100 shadow-sm">
              <ShieldAlert className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900">No Homestays Found</h3>
              <p className="text-slate-500 mt-1 max-w-sm mx-auto">We couldn't find any listings matching your active filters. Try loosening your keywords or reset all options.</p>
              <button 
                onClick={handleReset}
                className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredHomestays.map((hs) => (
                <motion.div
                  key={hs.id}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/homestay/${hs.id}`)}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col h-full group"
                >
                  <div className="relative h-48 bg-slate-100 shrink-0">
                    <img 
                      src={hs.images[0]} 
                      alt={hs.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1 text-xs font-bold text-slate-800">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                      <span>{getAvgRating(hs.id)}</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{hs.city}, {hs.state}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {hs.name}
                      </h3>
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {hs.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-extrabold text-slate-900">{currencySymbol}{hs.pricePerNight}</span>
                        <span className="text-xs text-slate-400"> / night</span>
                      </div>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                        View Rooms
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
