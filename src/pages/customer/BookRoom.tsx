import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, Calendar, ShieldCheck, CreditCard, DollarSign, Wallet, Percent, ShieldAlert 
} from 'lucide-react';
import { motion } from 'motion/react';

export const BookRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { rooms, homestays, settings, currentUser, createBooking, toast, currencySymbol } = useApp();

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'Credit Card'>('UPI');
  const [days, setDays] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [taxesAmount, setTaxesAmount] = useState(0);
  const [total, setTotal] = useState(0);

  const room = rooms.find(r => r.id === roomId);
  const homestay = room ? homestays.find(h => h.id === room.homestayId) : null;

  // Calculate reservation nights and pricing
  useEffect(() => {
    if (checkIn && checkOut && room) {
      const d1 = new Date(checkIn);
      const d2 = new Date(checkOut);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        setDays(diffDays);
        const sub = room.price * diffDays;
        const tax = sub * (settings.taxes / 100);
        setSubtotal(sub);
        setTaxesAmount(Number(tax.toFixed(2)));
        setTotal(Number((sub + tax).toFixed(2)));
      } else {
        setDays(0);
        setSubtotal(0);
        setTaxesAmount(0);
        setTotal(0);
      }
    }
  }, [checkIn, checkOut, room, settings.taxes]);

  if (!currentUser) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-gray-100 max-w-md mx-auto mt-12 shadow-sm">
        <ShieldAlert className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900">Sign In Required</h3>
        <p className="text-gray-500 mt-2">You must be logged in as a registered customer to book rooms.</p>
        <button onClick={() => navigate('/login')} className="mt-6 px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-sm">Log In Now</button>
      </div>
    );
  }

  if (!room || !homestay) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-gray-100 max-w-md mx-auto mt-12 shadow-sm">
        <ShieldAlert className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900">Room Details Missing</h3>
        <p className="text-gray-500 mt-2">This room or associated homestay cannot be resolved in our database.</p>
        <button onClick={() => navigate('/')} className="mt-6 px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-sm">Return Home</button>
      </div>
    );
  }

  const handleBookingConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (days <= 0) {
      toast.show('Check-out date must be after check-in date', 'error');
      return;
    }

    // Call context to create booking and pending payment
    createBooking({
      customerId: currentUser.id,
      customerName: currentUser.name,
      homestayId: homestay.id,
      homestayName: homestay.name,
      roomId: room.id,
      roomNumber: room.roomNumber,
      checkIn,
      checkOut,
      amount: total
    }, paymentMethod);

    navigate('/customer/dashboard');
  };

  const tomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  return (
    <div id="book-room-page" className="min-h-screen bg-gray-50 py-8 px-4 max-w-4xl mx-auto w-full space-y-8">
      {/* Back link */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to homestay details</span>
      </button>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Reserve Room</h1>
        <p className="text-gray-500 mt-1">Review check-in slots and select payment preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Dates & Payment Selection Form (Left side - 7 cols) */}
        <form onSubmit={handleBookingConfirm} className="md:col-span-7 space-y-6 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 text-lg">Reservation Period</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-blue-600" />
                <span>Check-in *</span>
              </label>
              <input 
                type="date" 
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-hidden text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-blue-600" />
                <span>Check-out *</span>
              </label>
              <input 
                type="date" 
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || tomorrowStr()}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-hidden text-sm"
                required
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3 pt-4 border-t border-gray-50">
            <h3 className="font-bold text-gray-900 text-base">Select Payment Method</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 cursor-pointer
                  ${paymentMethod === 'UPI' 
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700' 
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'}
                `}
              >
                <Wallet className="h-5 w-5" />
                <span className="text-xs font-bold">UPI / Instant</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Credit Card')}
                className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 cursor-pointer
                  ${paymentMethod === 'Credit Card' 
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700' 
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'}
                `}
              >
                <CreditCard className="h-5 w-5" />
                <span className="text-xs font-bold">Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Cash')}
                className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 cursor-pointer
                  ${paymentMethod === 'Cash' 
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700' 
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'}
                `}
              >
                <DollarSign className="h-5 w-5" />
                <span className="text-xs font-bold">Pay At Desk</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-50">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-100 transition-all cursor-pointer"
            >
              <ShieldCheck className="h-5 w-5" />
              <span>Confirm Reservation</span>
            </button>
          </div>
        </form>

        {/* Pricing Summary Card (Right side - 5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-900 text-lg">Billing Breakdown</h3>
            
            <div className="space-y-4">
              {/* Short summary */}
              <div>
                <h4 className="text-sm font-bold text-gray-800 leading-none">{homestay.name}</h4>
                <p className="text-xs text-gray-400 mt-1">{homestay.address}</p>
                <div className="mt-2.5 inline-block text-xxs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  Room #{room.roomNumber} • {room.roomType}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="divide-y divide-gray-50 pt-4 border-t border-gray-50 space-y-3.5 text-sm">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Room Price</span>
                  <span className="font-semibold">{currencySymbol}{room.price} / night</span>
                </div>
                
                <div className="flex justify-between items-center text-gray-600 pt-3.5">
                  <span>Nights Booked</span>
                  <span className="font-semibold">{days} Nights</span>
                </div>

                <div className="flex justify-between items-center text-gray-600 pt-3.5">
                  <span>Subtotal</span>
                  <span className="font-semibold">{currencySymbol}{subtotal}</span>
                </div>

                <div className="flex justify-between items-center text-gray-600 pt-3.5">
                  <span className="flex items-center gap-1">
                    <span>Sales Taxes</span>
                    <Percent className="h-3 w-3 text-gray-400" />
                    <span className="text-xs">({settings.taxes}%)</span>
                  </span>
                  <span className="font-semibold">{currencySymbol}{taxesAmount}</span>
                </div>

                <div className="flex justify-between items-center pt-3.5 text-base font-extrabold text-gray-900">
                  <span>Grand Total</span>
                  <span className="font-mono text-blue-600">{currencySymbol}{total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Rules Banner */}
          <div className="bg-amber-50/60 rounded-3xl p-5 border border-amber-100 space-y-2 text-xs">
            <h4 className="font-bold text-amber-800">Lodging & Check-in Rules:</h4>
            <p className="text-amber-700 leading-relaxed">
              {settings.bookingRules}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
