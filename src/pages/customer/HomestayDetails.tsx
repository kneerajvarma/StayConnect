import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, Star, MapPin, CheckCircle, Wifi, ShieldAlert, Users, Calendar, PenTool, ClipboardList, Flame, Send
} from 'lucide-react';
import { motion } from 'motion/react';

export const HomestayDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { homestays, rooms, reviews, addReview, currentUser, toast, currencySymbol } = useApp();

  const [activeImage, setActiveImage] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const homestay = homestays.find(h => h.id === id);

  if (!homestay) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-gray-100 max-w-lg mx-auto mt-12 shadow-sm">
        <ShieldAlert className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900">Homestay Not Found</h3>
        <p className="text-gray-500 mt-2">The homestay you are trying to view does not exist or has been removed.</p>
        <button onClick={() => navigate('/')} className="mt-6 px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-sm">Return Home</button>
      </div>
    );
  }

  // Filter children resources
  const homestayRooms = rooms.filter(r => r.homestayId === homestay.id);
  const homestayReviews = reviews.filter(r => r.homestayId === homestay.id);

  // Stats
  const avgRating = homestayReviews.length === 0 
    ? 4.5 
    : Number((homestayReviews.reduce((sum, r) => sum + r.rating, 0) / homestayReviews.length).toFixed(1));

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.show('Please enter your review comments', 'error');
      return;
    }
    addReview(homestay.id, rating, comment);
    setComment('');
    setRating(5);
  };

  const handleBookRoom = (roomId: string) => {
    if (!currentUser) {
      toast.show('Please login to book a room', 'info');
      navigate('/login', { state: { from: `/customer/book/${roomId}` } });
      return;
    }
    navigate(`/customer/book/${roomId}`);
  };

  return (
    <div id="homestay-details-page" className="min-h-screen bg-gray-50 py-8 px-4 max-w-7xl mx-auto w-full space-y-8">
      {/* Back navigation */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to listings</span>
      </button>

      {/* Main Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Images & About (Left side - 7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Images Section */}
          <div className="bg-white rounded-3xl overflow-hidden p-3 border border-gray-100 shadow-xs">
            <div className="h-80 md:h-110 rounded-2xl overflow-hidden bg-gray-100">
              <img 
                src={homestay.images[activeImage] || homestay.images[0]} 
                alt={homestay.name} 
                className="w-full h-full object-cover"
              />
            </div>
            {homestay.images.length > 1 && (
              <div className="flex gap-3 mt-3 px-1">
                {homestay.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${activeImage === idx ? 'border-blue-600 scale-105 shadow-sm' : 'border-transparent opacity-75'}`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* About Section */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <div className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{homestay.city}, {homestay.state}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-2 tracking-tight">
                  {homestay.name}
                </h1>
                <p className="text-sm text-gray-400 mt-1 font-medium">{homestay.address}</p>
              </div>

              <div className="bg-blue-50/60 px-4 py-2.5 rounded-2xl flex items-center gap-2 shrink-0">
                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                <div className="text-left">
                  <div className="text-sm font-bold text-gray-900 leading-none">{avgRating} Rating</div>
                  <div className="text-xs text-gray-400 font-medium">{homestayReviews.length} verified reviews</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 text-lg">About this homestay</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {homestay.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-4 pt-4 border-t border-gray-50">
              <h3 className="font-bold text-gray-900 text-lg">Offered Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {homestay.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 text-gray-700 text-sm font-medium">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rooms & Booking Form (Right side - 5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Rooms List Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-50">
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-blue-600" />
                <span>Available Rooms</span>
              </h3>
              <span className="text-xs font-bold text-gray-400 uppercase bg-gray-50 px-2.5 py-1 rounded-md">
                {homestayRooms.length} Total
              </span>
            </div>

            {homestayRooms.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm bg-gray-50 rounded-2xl">
                There are no rooms cataloged in this homestay yet.
              </div>
            ) : (
              <div className="space-y-4">
                {homestayRooms.map((room) => (
                  <div 
                    key={room.id} 
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-4 
                      ${room.availability 
                        ? 'border-gray-100 bg-white hover:border-blue-100 hover:shadow-xs' 
                        : 'border-gray-100 bg-gray-50/50 opacity-75'}
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">Room #{room.roomNumber}</span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-600">{room.roomType}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          <span>Max Capacity: {room.capacity} Guests</span>
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-base font-extrabold text-gray-900">{currencySymbol}{room.price}</div>
                        <div className="text-xxs text-gray-400 uppercase tracking-wider font-semibold">Per Night</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold leading-none
                        ${room.availability ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full ${room.availability ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                        <span>{room.availability ? 'Available' : 'Occupied'}</span>
                      </span>

                      {room.availability ? (
                        <button
                          onClick={() => handleBookRoom(room.id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          Book Room
                        </button>
                      ) : (
                        <span className="text-xs font-medium text-gray-400">Reserved</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Write a Review Block */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <PenTool className="h-5 w-5 text-amber-500" />
              <span>Leave a Review</span>
            </h3>

            {currentUser ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star className={`h-6 w-6 ${rating >= star ? 'fill-amber-500' : 'text-gray-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Comments & Experience</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-hidden text-sm"
                    placeholder="Tell us about the hospitality, surroundings, rooms..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>Submit Review</span>
                </button>
              </form>
            ) : (
              <div className="p-4 bg-gray-50 rounded-2xl text-center text-sm">
                <p className="text-gray-500">Only registered customers can leave reviews.</p>
                <Link to="/login" className="inline-block text-blue-600 font-bold hover:underline mt-2">Log in here</Link>
              </div>
            )}
          </div>

          {/* Display Guest Reviews */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4 max-h-80 overflow-y-auto">
            <h3 className="font-bold text-gray-900 text-base">Guest Feedback ({homestayReviews.length})</h3>
            
            {homestayReviews.length === 0 ? (
              <p className="text-sm text-gray-400">No reviews yet. Be the first to write one!</p>
            ) : (
              <div className="space-y-4 divide-y divide-gray-50">
                {homestayReviews.map((review) => (
                  <div key={review.id} className="pt-3 first:pt-0 space-y-1.5 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800">{review.customerName}</span>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    <div className="flex text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-amber-500' : 'text-gray-100'}`} />
                      ))}
                    </div>
                    <p className="text-gray-600 text-xs italic">
                      "{review.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
