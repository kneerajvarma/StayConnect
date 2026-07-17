import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Search, MapPin, Calendar, Star, Compass, Award, ShieldCheck, Heart, Users } from 'lucide-react';
import { motion } from 'motion/react';

export const Home: React.FC = () => {
  const { homestays, reviews, currencySymbol } = useApp();
  const navigate = useNavigate();
  
  const [searchCity, setSearchCity] = useState('');
  const [searchGuests, setSearchGuests] = useState('2');

  // Filter out unique cities
  const uniqueCities = Array.from(new Set(homestays.map(h => h.city)));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchCity) queryParams.set('city', searchCity);
    queryParams.set('guests', searchGuests);
    navigate(`/customer/search?${queryParams.toString()}`);
  };

  // Get average rating for a homestay
  const getAvgRating = (homestayId: string) => {
    const hsReviews = reviews.filter(r => r.homestayId === homestayId);
    if (hsReviews.length === 0) return 4.5; // default if no reviews
    return Number((hsReviews.reduce((acc, r) => acc + r.rating, 0) / hsReviews.length).toFixed(1));
  };

  return (
    <div id="home-page" className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section with Search Banner */}
      <section className="relative bg-gray-900 text-white py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-multiply" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80')" }}></div>
        
        {/* Ambient colored blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight"
          >
            Find Your Perfect <span className="text-amber-400">Cozy Homestay</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Explore vetted, authentic homestays and book rooms directly with local hosts. Clean spaces, warm welcomes, and memories that stay.
          </motion.p>

          {/* Elegant Search Widget */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSearch}
            className="mt-12 bg-white rounded-2xl md:rounded-full p-4 md:p-2 shadow-2xl flex flex-col md:flex-row gap-3 items-center text-gray-800 max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-3 w-full px-4 border-b md:border-b-0 md:border-r border-gray-100 py-3 md:py-0">
              <MapPin className="text-blue-600 h-5 w-5 shrink-0" />
              <div className="text-left w-full">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Destination</label>
                <select 
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full text-sm font-semibold bg-transparent border-none p-0 focus:outline-hidden text-gray-700"
                >
                  <option value="">Any city/destination</option>
                  {uniqueCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full px-4 border-b md:border-b-0 md:border-r border-gray-100 py-3 md:py-0">
              <Calendar className="text-blue-600 h-5 w-5 shrink-0" />
              <div className="text-left w-full">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Check-in Date</label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full text-sm font-semibold bg-transparent border-none p-0 focus:outline-hidden text-gray-700"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 w-full px-4 py-3 md:py-0">
              <Users className="text-blue-600 h-5 w-5 shrink-0" />
              <div className="text-left w-full">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Capacity</label>
                <select 
                  value={searchGuests}
                  onChange={(e) => setSearchGuests(e.target.value)}
                  className="w-full text-sm font-semibold bg-transparent border-none p-0 focus:outline-hidden text-gray-700"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="6">6+ Guests</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 md:py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl md:rounded-full shadow-md shadow-blue-200 hover:shadow-lg transition-all shrink-0 cursor-pointer"
            >
              <Search className="h-5 w-5" />
              <span>Search</span>
            </button>
          </motion.form>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-8 border-b border-gray-100 shrink-0">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">100% Verified Homes</h4>
              <p className="text-sm text-gray-500">Every homestay is personally checked for safety and comfort.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Local Warm Hospitality</h4>
              <p className="text-sm text-gray-500">Stay with hosts who love to share their culture and tips.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Flexible Reservations</h4>
              <p className="text-sm text-gray-500">Easy changes, instant booking confirmations, and direct chat.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Homestays */}
      <section className="py-16 px-4 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Our Popular Homestays</h2>
            <p className="text-gray-500 mt-2">Handpicked destinations with the highest reviews this week.</p>
          </div>
          <button 
            onClick={() => navigate('/customer/search')}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 hover:underline"
          >
            <span>View All</span>
            <Compass className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {homestays.slice(0, 4).map((hs) => (
            <motion.div
              key={hs.id}
              whileHover={{ y: -6 }}
              onClick={() => navigate(`/homestay/${hs.id}`)}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col h-full group"
            >
              {/* Image Block */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <img 
                  src={hs.images[0]} 
                  alt={hs.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-gray-800">
                  <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                  <span>{getAvgRating(hs.id)}</span>
                </div>
              </div>

              {/* Text Block */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                    {hs.city}, {hs.state}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mt-1.5 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {hs.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {hs.description}
                  </p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-extrabold text-gray-900">{currencySymbol}{hs.pricePerNight}</span>
                    <span className="text-xs text-gray-400"> / night</span>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                    Book Room
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Customer Testimonial Slider */}
      <section className="bg-blue-600 text-white py-16 shrink-0">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Loved by Travelers Worldwide</h2>
          
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-8 md:p-10 border border-white/10">
            <p className="text-lg md:text-xl italic font-medium leading-relaxed">
              "StayConnect made my family holiday in Goa feel like we never left home. The Goan Heritage Beach Villa was fully stocked, and our host was so generous with local travel guides. We booked the room, made our UPI payment, and received immediate support."
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <img 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" 
                alt="John"
                className="w-12 h-12 rounded-full border-2 border-white/50 object-cover"
              />
              <div className="text-left">
                <h4 className="font-bold text-sm">John</h4>
                <p className="text-xs text-blue-200">Verified Customer • Booked Goan Heritage Beach Villa</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
