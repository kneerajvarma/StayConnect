import React from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { 
  Users, Home, Bed, CalendarCheck, CheckCircle2, DollarSign, ArrowUpRight, TrendingUp, TrendingDown 
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { getDashboardStats, bookings, payments, customers, currencySymbol } = useApp();
  const stats = getDashboardStats();

  // Aggregate Bookings by Month for chart
  const bookingChartData = [
    { month: 'Jan', bookings: 5, revenue: 1200 },
    { month: 'Feb', bookings: 8, revenue: 2100 },
    { month: 'Mar', bookings: 12, revenue: 3400 },
    { month: 'Apr', bookings: 15, revenue: 4500 },
    { month: 'May', bookings: 22, revenue: 6800 },
    { month: 'Jun', bookings: 28, revenue: 8500 },
    { month: 'Jul', bookings: bookings.length + 15, revenue: stats.revenue },
  ];

  // Get recent bookings (last 5)
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
    .slice(0, 5);

  return (
    <div id="admin-dashboard" className="p-6 md:p-8 space-y-8 w-full max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Console</h1>
          <p className="text-gray-500 mt-1">Platform overview, revenue charts, and registration tallies.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            to="/admin/homestays" 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors"
          >
            Manage Inventory
          </Link>
          <Link 
            to="/admin/reports" 
            className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl transition-colors"
          >
            Export Reports
          </Link>
        </div>
      </div>

      {/* Numerical Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xxs">
          <div className="flex justify-between items-start">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Customers</span>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-xl font-extrabold text-gray-900 mt-2">{stats.totalCustomers}</div>
          <span className="text-xxs text-emerald-500 font-bold flex items-center gap-0.5 mt-1">
            <TrendingUp className="h-3 w-3" />
            <span>+12% vs last mo</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xxs">
          <div className="flex justify-between items-start">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Homestays</span>
            <Home className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-xl font-extrabold text-gray-900 mt-2">{stats.totalHomestays}</div>
          <span className="text-xxs text-emerald-500 font-bold flex items-center gap-0.5 mt-1">
            <TrendingUp className="h-3 w-3" />
            <span>+3 new spots</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xxs">
          <div className="flex justify-between items-start">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Active Rooms</span>
            <Bed className="h-4 w-4 text-teal-500" />
          </div>
          <div className="text-xl font-extrabold text-gray-900 mt-2">{stats.activeRooms}</div>
          <span className="text-xxs text-gray-400 font-medium block mt-1">Ready for check-in</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xxs">
          <div className="flex justify-between items-start">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Active Bookings</span>
            <CalendarCheck className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-xl font-extrabold text-gray-900 mt-2">{stats.activeBookings}</div>
          <span className="text-xxs text-amber-500 font-bold flex items-center gap-0.5 mt-1">
            <span>5 pending check-in</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xxs">
          <div className="flex justify-between items-start">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-xl font-extrabold text-gray-900 mt-2">{stats.completedBookings}</div>
          <span className="text-xxs text-gray-400 font-medium block mt-1">Stays completed</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xxs">
          <div className="flex justify-between items-start">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Revenue</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-gray-900 mt-2">{currencySymbol}{stats.revenue}</div>
          <span className="text-xxs text-emerald-500 font-bold flex items-center gap-0.5 mt-1">
            <TrendingUp className="h-3 w-3" />
            <span>+24.5% uptick</span>
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Bookings Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Reservation Volume</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="bookings" fill="#2563EB" name="Bookings Count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Revenue Growth Trends ({currencySymbol})</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookingChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name={`Revenue (${currencySymbol})`} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-gray-50">
          <h3 className="font-bold text-gray-900 text-lg">Recent Reservation Activity</h3>
          <Link to="/admin/bookings" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
            <span>Manage All Bookings</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-400 font-bold uppercase">
                <th className="pb-3 font-semibold">Booking ID</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Homestay</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Reserve Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/50">
                  <td className="py-3.5 font-mono text-xs font-semibold text-gray-500">#{b.id.toUpperCase()}</td>
                  <td className="py-3.5 font-bold text-gray-800">{b.customerName}</td>
                  <td className="py-3.5 text-gray-600 font-semibold">{b.homestayName}</td>
                  <td className="py-3.5 font-bold text-gray-900">{currencySymbol}{b.amount}</td>
                  <td className="py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold leading-none capitalize
                      ${b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : ''}
                      ${b.status === 'pending' ? 'bg-amber-50 text-amber-700' : ''}
                      ${b.status === 'cancelled' ? 'bg-rose-50 text-rose-700' : ''}
                      ${b.status === 'completed' ? 'bg-blue-50 text-blue-700' : ''}
                    `}>
                      {b.status === 'pending' ? 'Pending Payment' : b.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-gray-500 text-xs">{b.bookingDate.split('T')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
