import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { 
  Calendar, CreditCard, Heart, ArrowRight, ShieldAlert, CheckCircle, Clock, XCircle 
} from 'lucide-react';
import { motion } from 'motion/react';
import { Modal } from '../../components/Modal';

export const CustomerDashboard: React.FC = () => {
  const { currentUser, bookings, payments, updateBookingStatus, currencySymbol } = useApp();
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-gray-100">
        <ShieldAlert className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900">Access Denied</h3>
        <p className="text-gray-500 mt-2">Please login as a customer to view this panel.</p>
        <Link to="/login" className="inline-block mt-4 text-blue-600 font-semibold hover:underline">Log In</Link>
      </div>
    );
  }

  // Filter current customer data
  const myBookings = bookings.filter(b => b.customerId === currentUser.id);
  const activeBookings = myBookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const pastBookings = myBookings.filter(b => b.status === 'completed');
  const myPayments = payments.filter(p => {
    const booking = bookings.find(b => b.id === p.bookingId);
    return booking && booking.customerId === currentUser.id;
  });

  const upcomingBookingsCount = activeBookings.length;
  const previousBookingsCount = pastBookings.length;

  const handleCancelBooking = () => {
    if (selectedBookingId) {
      updateBookingStatus(selectedBookingId, 'cancelled');
      setSelectedBookingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-rose-500" />;
      default:
        return null;
    }
  };

  return (
    <div id="customer-dashboard" className="p-6 md:p-8 space-y-8 w-full max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="space-y-2 relative">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Hello, {currentUser.name}!
          </h1>
          <p className="text-blue-100 text-sm md:text-base max-w-md">
            Welcome to your customer portal. Search homestays, check reservation timelines, or download billing transactions.
          </p>
        </div>
        <Link 
          to="/customer/search"
          className="relative px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center gap-1.5 shrink-0"
        >
          <span>Find Homestays</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{upcomingBookingsCount}</div>
            <div className="text-sm text-gray-500 font-medium">Upcoming Bookings</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{previousBookingsCount}</div>
            <div className="text-sm text-gray-500 font-medium">Completed Bookings</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <Heart className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">4</div>
            <div className="text-sm text-gray-500 font-medium">Favorite Spots</div>
          </div>
        </div>
      </div>

      {/* Active Reservations Table */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">Active Reservations</h3>
          <Link to="/customer/bookings" className="text-xs font-semibold text-blue-600 hover:underline">View All</Link>
        </div>

        {activeBookings.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            You don't have any upcoming or active bookings right now.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 font-bold uppercase">
                  <th className="pb-3 font-semibold">Homestay & Room</th>
                  <th className="pb-3 font-semibold">Check-in</th>
                  <th className="pb-3 font-semibold">Check-out</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {activeBookings.map((b) => (
                  <tr key={b.id} className="group">
                    <td className="py-4">
                      <div>
                        <div className="font-bold text-gray-800">{b.homestayName}</div>
                        <div className="text-xs text-gray-400">Room #{b.roomNumber}</div>
                      </div>
                    </td>
                    <td className="py-4 text-gray-600 font-medium">{b.checkIn}</td>
                    <td className="py-4 text-gray-600 font-medium">{b.checkOut}</td>
                    <td className="py-4 font-bold text-gray-800">{currencySymbol}{b.amount}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold leading-none capitalize
                        ${b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}
                      `}>
                        {getStatusIcon(b.status)}
                        <span>{b.status}</span>
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {b.status === 'pending' && (
                        <button
                          onClick={() => setSelectedBookingId(b.id)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                      {b.status === 'confirmed' && (
                        <span className="text-xs text-gray-400 font-medium">Non-cancelable</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={selectedBookingId !== null}
        onClose={() => setSelectedBookingId(null)}
        title="Cancel Booking"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to cancel this booking? This action will set your booking status to Cancelled and mark the associated room as available for other travelers.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setSelectedBookingId(null)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleCancelBooking}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-rose-100 cursor-pointer"
            >
              Cancel Reservation
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
