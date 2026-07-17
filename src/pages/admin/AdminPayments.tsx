import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Payment } from '../../types';
import { Search, CreditCard, DollarSign, Wallet, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';

export const AdminPayments: React.FC = () => {
  const { payments, bookings, processPayment, currencySymbol } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPayments = payments.filter(p => 
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusLabel = (status: Payment['status']) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Paid</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 animate-pulse">
            <Clock className="h-3.5 w-3.5" />
            <span>Pending Verification</span>
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700">
            <XCircle className="h-3.5 w-3.5" />
            <span>Failed</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'UPI':
        return <Wallet className="h-4 w-4 text-blue-500" />;
      case 'Credit Card':
        return <CreditCard className="h-4 w-4 text-purple-500" />;
      case 'Cash':
        return <DollarSign className="h-4 w-4 text-emerald-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div id="admin-payments" className="p-6 md:p-8 space-y-6 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manage Payments</h1>
        <p className="text-gray-500 mt-1 font-medium font-sans">Supervise financial invoice streams, verify instant UPI captures, or override cash payments.</p>
      </div>

      {/* Filter panel */}
      <div className="relative max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <Search className="h-4 w-4" />
        </span>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter invoice by payment ID, booking ID, method..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-hidden text-sm bg-white"
        />
      </div>

      {/* Payments table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            No payments found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 font-bold uppercase bg-gray-50/50">
                  <th className="p-4 font-semibold">Payment Token</th>
                  <th className="p-4 font-semibold">Booking Referral</th>
                  <th className="p-4 font-semibold">Captured Amount</th>
                  <th className="p-4 font-semibold">Payment Channel</th>
                  <th className="p-4 font-semibold">Capture Timestamp</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Overrides</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPayments.map((p) => {
                  const booking = bookings.find(b => b.id === p.bookingId);
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/30">
                      <td className="p-4 font-mono text-xs font-semibold text-gray-500">#{p.id.toUpperCase()}</td>
                      <td className="p-4 font-mono text-xs font-semibold text-blue-600">#{p.bookingId.toUpperCase()}</td>
                      <td className="p-4 font-bold text-gray-900">{currencySymbol}{p.amount}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                          {getMethodIcon(p.paymentMethod)}
                          <span>{p.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-medium text-gray-500">{p.paymentDate.replace('T', ' ').substring(0, 16)}</td>
                      <td className="p-4">{getStatusLabel(p.status)}</td>
                      <td className="p-4 text-right">
                        {p.status === 'Pending' && booking?.status !== 'cancelled' ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => processPayment(p.id, 'Paid')}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                            >
                              Approve Pay
                            </button>
                            <button
                              onClick={() => processPayment(p.id, 'Failed')}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                            >
                              Reject Pay
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium">Locked Ledger</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
