import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, XCircle, Search, ShieldAlert } from 'lucide-react';
import { Modal } from '../../components/Modal';

export const MyBookings: React.FC = () => {
  const { currentUser, bookings, updateBookingStatus, currencySymbol } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-gray-100 max-w-sm mx-auto mt-12 shadow-sm">
        <ShieldAlert className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900">Access Denied</h3>
        <p className="text-gray-500 mt-2">Please login as a customer to view reservations.</p>
        <Link to="/login" className="inline-block mt-4 text-blue-600 font-semibold hover:underline">Log In</Link>
      </div>
    );
  }

  const myBookings = bookings.filter(b => b.customerId === currentUser.id);

  const filteredBookings = myBookings.filter(b => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  const handleCancelBooking = () => {
    if (selectedBookingId) {
      updateBookingStatus(selectedBookingId, 'cancelled');
      setSelectedBookingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold leading-none capitalize bg-emerald-50 text-emerald-700">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Confirmed</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold leading-none capitalize bg-amber-50 text-amber-700">
            <Clock className="h-3.5 w-3.5" />
            <span>Pending Payment</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold leading-none capitalize bg-blue-50 text-blue-700">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Completed</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold leading-none capitalize bg-rose-50 text-rose-700">
            <XCircle className="h-3.5 w-3.5" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div id="my-bookings-page" className="p-6 md:p-8 space-y-6 w-full max-w-7xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Reservations</h1>
        <p className="text-gray-500 mt-1">Track stay summaries, pending transactions, and lodging timelines.</p>
      </div>

      {/* Tabs / Filter Controls */}
      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-3">
        {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-xs font-bold rounded-xl capitalize transition-all cursor-pointer
              ${filter === tab 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
            `}
          >
            {tab === 'pending' ? 'Pending Payment' : tab}
          </button>
        ))}
      </div>

      {/* Booking list */}
      {filteredBookings.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-2xl border border-gray-100 shadow-xs">
          <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No reservations found matching this status.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBookings.map((b) => (
            <div 
              key={b.id}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs flex flex-col justify-between gap-5 hover:border-blue-100 transition-all"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-bold text-gray-800 text-base leading-none">{b.homestayName}</h3>
                  <p className="text-xs text-gray-400 mt-1.5 font-medium">Room Number: {b.roomNumber}</p>
                </div>
                {getStatusBadge(b.status)}
              </div>

              {/* Grid of details */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4 text-xs font-semibold text-gray-600">
                <div>
                  <p className="text-gray-400 uppercase tracking-wider text-xxs font-bold mb-0.5">Check-In</p>
                  <p className="text-gray-700 text-sm">{b.checkIn}</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase tracking-wider text-xxs font-bold mb-0.5">Check-Out</p>
                  <p className="text-gray-700 text-sm">{b.checkOut}</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase tracking-wider text-xxs font-bold mb-0.5">Date Reserved</p>
                  <p className="text-gray-700">{b.bookingDate.split('T')[0]}</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase tracking-wider text-xxs font-bold mb-0.5">Total Bill</p>
                  <p className="text-gray-900 font-bold text-sm">{currencySymbol}{b.amount}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-1">
                <span className="text-xxs font-mono text-gray-400">ID: {b.id.toUpperCase()}</span>
                
                <div className="flex gap-2">
                  {b.status === 'pending' && (
                    <>
                      <button
                        onClick={() => setSelectedBookingId(b.id)}
                        className="px-4 py-2 border border-rose-100 text-rose-600 bg-rose-50 hover:bg-rose-100 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <Link
                        to="/customer/payments"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                      >
                        Pay Bill Now
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={selectedBookingId !== null}
        onClose={() => setSelectedBookingId(null)}
        title="Cancel Booking"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to cancel this booking? This action will release the room block immediately and mark your invoice as cancelled.
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
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold shadow-md cursor-pointer"
            >
              Cancel Reservation
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
