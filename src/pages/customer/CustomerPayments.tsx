import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { CreditCard, CheckCircle, Clock, XCircle, DollarSign, Wallet, ShieldCheck, ShieldAlert } from 'lucide-react';

export const CustomerPayments: React.FC = () => {
  const { currentUser, bookings, payments, processPayment, toast, currencySymbol } = useApp();
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState<'UPI' | 'Credit Card' | 'Cash'>('UPI');

  if (!currentUser) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-gray-100 max-w-sm mx-auto mt-12 shadow-sm">
        <ShieldAlert className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900">Access Denied</h3>
        <p className="text-gray-500 mt-2">Please login as a customer to manage billing.</p>
        <Link to="/login" className="inline-block mt-4 text-blue-600 font-semibold hover:underline">Log In</Link>
      </div>
    );
  }

  // Filter payments for this customer
  const customerPayments = payments.filter(p => {
    const booking = bookings.find(b => b.id === p.bookingId);
    return booking && booking.customerId === currentUser.id;
  });

  const handlePayNow = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
  };

  const handleProcessPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPaymentId) {
      processPayment(selectedPaymentId, 'Paid');
      setSelectedPaymentId(null);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
            <CheckCircle className="h-3 w-3" />
            <span>Paid</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 animate-pulse">
            <Clock className="h-3 w-3" />
            <span>Pending</span>
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700">
            <XCircle className="h-3 w-3" />
            <span>Failed</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div id="customer-payments-page" className="p-6 md:p-8 space-y-8 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Billing & Payments</h1>
        <p className="text-gray-500 mt-1">Review lodging invoice items, complete transactions, or export receipt details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Payments List (Left side - 7 or 8 cols depending on if pay selected) */}
        <div className={`${selectedPaymentId ? 'lg:col-span-7' : 'lg:col-span-12'} bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4`}>
          <h3 className="font-bold text-gray-900 text-lg">Invoice History</h3>

          {customerPayments.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              You do not have any invoices registered.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-400 font-bold uppercase">
                    <th className="pb-3 font-semibold">Payment ID</th>
                    <th className="pb-3 font-semibold">Booking ID</th>
                    <th className="pb-3 font-semibold">Billing Amount</th>
                    <th className="pb-3 font-semibold">Method</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {customerPayments.map((p) => {
                    const booking = bookings.find(b => b.id === p.bookingId);
                    return (
                      <tr key={p.id}>
                        <td className="py-4 font-mono text-xs font-semibold text-gray-500">#{p.id.toUpperCase()}</td>
                        <td className="py-4 font-mono text-xs font-semibold text-blue-600 hover:underline">
                          <Link to="/customer/bookings">#{p.bookingId.toUpperCase()}</Link>
                        </td>
                        <td className="py-4 font-bold text-gray-900">{currencySymbol}{p.amount}</td>
                        <td className="py-4 font-semibold text-gray-600 text-xs">{p.paymentMethod}</td>
                        <td className="py-4">{getStatusLabel(p.status)}</td>
                        <td className="py-4 text-right">
                          {p.status === 'Pending' && booking?.status !== 'cancelled' ? (
                            <button
                              onClick={() => handlePayNow(p.id)}
                              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                            >
                              Pay Now
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400 font-medium">Completed</span>
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

        {/* Dynamic Payment Gate (Right side - 5 cols, shown only when selected) */}
        {selectedPaymentId && (
          <form 
            onSubmit={handleProcessPaymentSubmit}
            className="lg:col-span-5 bg-white rounded-3xl border border-gray-100 p-6 shadow-xl space-y-6 animate-fadeIn"
          >
            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
              <h3 className="font-bold text-gray-900 text-base">Instant Payment Gate</h3>
              <button 
                type="button" 
                onClick={() => setSelectedPaymentId(null)}
                className="text-xs text-gray-400 font-semibold hover:text-gray-600 cursor-pointer"
              >
                Dismiss
              </button>
            </div>

            <div className="bg-blue-50/50 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <p className="text-xxs font-bold text-gray-400 uppercase leading-none">Selected Payment</p>
                <p className="font-mono text-sm font-semibold text-gray-600 mt-1">ID: #{selectedPaymentId.toUpperCase()}</p>
              </div>
              <p className="text-xl font-extrabold text-blue-600">{currencySymbol}{payments.find(p => p.id === selectedPaymentId)?.amount}</p>
            </div>

            {/* Choose payment channels */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Select Gateway Channel</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPayMethod('UPI')}
                  className={`p-3 rounded-xl border flex items-center gap-2 font-semibold text-xs cursor-pointer
                    ${payMethod === 'UPI' ? 'border-blue-600 bg-blue-50/20 text-blue-700' : 'border-gray-200 text-gray-600'}
                  `}
                >
                  <Wallet className="h-4 w-4" />
                  <span>UPI Wallet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPayMethod('Credit Card')}
                  className={`p-3 rounded-xl border flex items-center gap-2 font-semibold text-xs cursor-pointer
                    ${payMethod === 'Credit Card' ? 'border-blue-600 bg-blue-50/20 text-blue-700' : 'border-gray-200 text-gray-600'}
                  `}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Credit Card</span>
                </button>
              </div>
            </div>

            {payMethod === 'UPI' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 uppercase">Enter UPI ID</label>
                <input 
                  type="text" 
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-hidden"
                  placeholder="name@upi" 
                  required
                />
              </div>
            )}

            {payMethod === 'Credit Card' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase">Card Number</label>
                  <input 
                    type="text" 
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-hidden"
                    placeholder="4000 1234 5678 9010" 
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase">Expiry (MM/YY)</label>
                    <input 
                      type="text" 
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-hidden"
                      placeholder="12/28" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase">CVV</label>
                    <input 
                      type="password" 
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-hidden"
                      placeholder="•••" 
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-md transition-all cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Complete Transaction</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
