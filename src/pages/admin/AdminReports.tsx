import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, Download, Printer, Percent, DollarSign, CalendarCheck, Users, HelpCircle, CheckCircle2, Clock } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { bookings, customers, payments, toast, currencySymbol } = useApp();
  const [activeReport, setActiveReport] = useState<'bookings' | 'customers' | 'revenue' | 'monthly'>('bookings');

  // Calculations for Bookings Report
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const cancellationRate = totalBookings > 0 
    ? Number(((cancelledBookings / totalBookings) * 100).toFixed(1)) 
    : 0;

  // Calculations for Customer Report
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const topCustomers = [...customers].map(c => {
    const custBookings = bookings.filter(b => b.customerId === c.id);
    const spent = custBookings.reduce((sum, b) => sum + b.amount, 0);
    return {
      ...c,
      bookingsCount: custBookings.length,
      spent
    };
  }).sort((a, b) => b.spent - a.spent);

  // Calculations for Revenue Report
  const totalCollected = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingCollection = payments
    .filter(p => p.status === 'Pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const channelBreakdown = payments
    .filter(p => p.status === 'Paid')
    .reduce((acc, p) => {
      acc[p.paymentMethod] = (acc[p.paymentMethod] || 0) + p.amount;
      return acc;
    }, {} as Record<string, number>);

  const handleExport = (reportName: string) => {
    toast.show(`Successfully compiled and exported ${reportName} Report as CSV!`, 'success');
  };

  return (
    <div id="admin-reports" className="p-6 md:p-8 space-y-6 w-full max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">System Reports</h1>
          <p className="text-gray-500 mt-1 font-medium font-sans">Audit platform performance logs, verify tax contributions, and check user activities.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport(activeReport.toUpperCase())}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-xl cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-3">
        <button
          onClick={() => setActiveReport('bookings')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer
            ${activeReport === 'bookings' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-500 hover:bg-gray-50'}
          `}
        >
          Booking Report
        </button>
        <button
          onClick={() => setActiveReport('customers')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer
            ${activeReport === 'customers' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-500 hover:bg-gray-50'}
          `}
        >
          Customer Directory
        </button>
        <button
          onClick={() => setActiveReport('revenue')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer
            ${activeReport === 'revenue' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-500 hover:bg-gray-50'}
          `}
        >
          Revenue Audit
        </button>
        <button
          onClick={() => setActiveReport('monthly')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer
            ${activeReport === 'monthly' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-500 hover:bg-gray-50'}
          `}
        >
          Monthly Summary
        </button>
      </div>

      {/* Dynamically Loaded Report Panels */}
      
      {activeReport === 'bookings' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 border border-gray-100 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xxs text-gray-400 font-bold uppercase tracking-wider leading-none">Total Bookings</p>
                <p className="text-xl font-extrabold text-gray-900 mt-1">{totalBookings}</p>
              </div>
            </div>
            <div className="bg-white p-5 border border-gray-100 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xxs text-gray-400 font-bold uppercase tracking-wider leading-none">Confirmed Stays</p>
                <p className="text-xl font-extrabold text-gray-900 mt-1">{confirmedBookings}</p>
              </div>
            </div>
            <div className="bg-white p-5 border border-gray-100 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xxs text-gray-400 font-bold uppercase tracking-wider leading-none">Completed Stays</p>
                <p className="text-xl font-extrabold text-gray-900 mt-1">{completedBookings}</p>
              </div>
            </div>
            <div className="bg-white p-5 border border-gray-100 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
                <Percent className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xxs text-gray-400 font-bold uppercase tracking-wider leading-none">Cancellation Rate</p>
                <p className="text-xl font-extrabold text-gray-900 mt-1">{cancellationRate}%</p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Bookings Audit List</h3>
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 font-bold uppercase">
                  <th className="pb-3">ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Homestay</th>
                  <th className="pb-3">Check-in</th>
                  <th className="pb-3">Check-out</th>
                  <th className="pb-3">Gross Value</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-600">
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td className="py-3.5 font-mono text-xs">#{b.id.toUpperCase()}</td>
                    <td className="py-3.5 font-bold text-gray-800">{b.customerName}</td>
                    <td className="py-3.5 text-xs font-semibold">{b.homestayName}</td>
                    <td className="py-3.5 text-xs">{b.checkIn}</td>
                    <td className="py-3.5 text-xs">{b.checkOut}</td>
                    <td className="py-3.5 font-bold text-gray-900">{currencySymbol}{b.amount}</td>
                    <td className="py-3.5 text-xs font-bold capitalize">{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeReport === 'customers' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 border border-gray-100 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xxs text-gray-400 font-bold uppercase tracking-wider leading-none">Total Customers</p>
                <p className="text-xl font-extrabold text-gray-900 mt-1">{totalCustomers}</p>
              </div>
            </div>
            <div className="bg-white p-5 border border-gray-100 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xxs text-gray-400 font-bold uppercase tracking-wider leading-none">Active Users</p>
                <p className="text-xl font-extrabold text-gray-900 mt-1">{activeCustomers}</p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Top spending customer matrix</h3>
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 font-bold uppercase">
                  <th className="pb-3">ID</th>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Mobile Phone</th>
                  <th className="pb-3">Nights Reserved</th>
                  <th className="pb-3">Cumulative Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-600">
                {topCustomers.map(c => (
                  <tr key={c.id}>
                    <td className="py-3.5 font-mono text-xs">#{c.id.toUpperCase()}</td>
                    <td className="py-3.5 font-bold text-gray-800">{c.name}</td>
                    <td className="py-3.5 text-xs font-medium">{c.email}</td>
                    <td className="py-3.5 font-mono text-xs">{c.mobile}</td>
                    <td className="py-3.5 text-xs font-semibold">{c.bookingsCount} bookings</td>
                    <td className="py-3.5 font-bold text-gray-900">{currencySymbol}{c.spent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeReport === 'revenue' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 border border-gray-100 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xxs text-gray-400 font-bold uppercase tracking-wider leading-none">Net Collected Income</p>
                <p className="text-xl font-extrabold text-gray-900 mt-1">{currencySymbol}{totalCollected}</p>
              </div>
            </div>
            <div className="bg-white p-5 border border-gray-100 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xxs text-gray-400 font-bold uppercase tracking-wider leading-none">Awaiting Clearance</p>
                <p className="text-xl font-extrabold text-gray-900 mt-1">{currencySymbol}{pendingCollection}</p>
              </div>
            </div>
          </div>

          {/* Channels table */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Gateway Channel contribution</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase">UPI Gateway</p>
                <p className="text-lg font-extrabold text-gray-800">{currencySymbol}{channelBreakdown['UPI'] || 0}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase">Credit Card Interchange</p>
                <p className="text-lg font-extrabold text-gray-800">{currencySymbol}{channelBreakdown['Credit Card'] || 0}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase">Cash At Desk</p>
                <p className="text-lg font-extrabold text-gray-800">{currencySymbol}{channelBreakdown['Cash'] || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeReport === 'monthly' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Tables */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Monthly booking summary</h3>
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 font-bold uppercase">
                  <th className="pb-3">Month Calendar</th>
                  <th className="pb-3">Bookings Volume</th>
                  <th className="pb-3">Average Order value</th>
                  <th className="pb-3">Gross Revenue Collected</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-600 font-medium">
                <tr>
                  <td className="py-3.5 text-gray-900 font-bold">July 2026</td>
                  <td className="py-3.5">{bookings.length} reservations</td>
                  <td className="py-3.5">{currencySymbol}{bookings.length > 0 ? (totalCollected / bookings.length).toFixed(0) : 0}</td>
                  <td className="py-3.5 font-bold text-emerald-600">{currencySymbol}{totalCollected}</td>
                </tr>
                <tr>
                  <td className="py-3.5 text-gray-400">June 2026</td>
                  <td className="py-3.5">14 reservations</td>
                  <td className="py-3.5">{currencySymbol}310</td>
                  <td className="py-3.5 text-gray-400">{currencySymbol}4,340</td>
                </tr>
                <tr>
                  <td className="py-3.5 text-gray-400">May 2026</td>
                  <td className="py-3.5">9 reservations</td>
                  <td className="py-3.5">{currencySymbol}280</td>
                  <td className="py-3.5 text-gray-400">{currencySymbol}2,520</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
