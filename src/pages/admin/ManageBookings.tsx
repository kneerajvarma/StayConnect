import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import { Search, Calendar, CheckCircle, Clock, XCircle, ArrowRight, ClipboardCheck } from 'lucide-react';

export const ManageBookings: React.FC = () => {
  const { bookings, updateBookingStatus, toast, currencySymbol } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.homestayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.roomNumber.includes(searchQuery);

    const matchesFilter = filter === 'all' || b.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 leading-none capitalize">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Confirmed</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 leading-none capitalize animate-pulse">
            <Clock className="h-3.5 w-3.5" />
            <span>Pending</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 leading-none capitalize">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Completed</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 leading-none capitalize">
            <XCircle className="h-3.5 w-3.5" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div id="manage-bookings" className="p-6 md:p-8 space-y-6 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manage Reservations</h1>
        <p className="text-gray-500 mt-1 font-medium font-sans">Approve booking requests, cancel active reserves, or sign-out completed customer stays.</p>
      </div>

      {/* Filter and Search Layout */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-4 border-b border-gray-100">
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search className="h-4 w-4" />
          </span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer, homestay, room..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-hidden text-sm bg-white"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl capitalize transition-all cursor-pointer
                ${filter === tab 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              {tab === 'pending' ? 'Pending Payment' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            No reservations found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 font-bold uppercase bg-gray-50/50">
                  <th className="p-4 font-semibold">Booking ID</th>
                  <th className="p-4 font-semibold">Traveler Guest</th>
                  <th className="p-4 font-semibold">Homestay Complex</th>
                  <th className="p-4 font-semibold">Check-in / Check-out</th>
                  <th className="p-4 font-semibold">Total Bill</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/30">
                    <td className="p-4 font-mono text-xs font-semibold text-gray-500">#{b.id.toUpperCase()}</td>
                    <td className="p-4 font-bold text-gray-900">{b.customerName}</td>
                    <td className="p-4">
                      <div>
                        <div className="font-semibold text-gray-700">{b.homestayName}</div>
                        <span className="text-xxs text-gray-400 font-bold">Room #{b.roomNumber}</span>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-medium text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        <span>{b.checkIn} <ArrowRight className="h-3 w-3 inline text-gray-400" /> {b.checkOut}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-gray-900">{currencySymbol}{b.amount}</td>
                    <td className="p-4">{getStatusBadge(b.status)}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {b.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateBookingStatus(b.id, 'confirmed')}
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateBookingStatus(b.id, 'cancelled')}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'completed')}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <ClipboardCheck className="h-3.5 w-3.5" />
                            <span>Complete Stay</span>
                          </button>
                        )}
                        {b.status === 'completed' && (
                          <span className="text-xs text-gray-400 font-medium">Archived</span>
                        )}
                        {b.status === 'cancelled' && (
                          <span className="text-xs text-rose-400 font-semibold">Cancelled</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
