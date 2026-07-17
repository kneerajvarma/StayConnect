import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Home } from './pages/Home';
import { HomestayDetails } from './pages/customer/HomestayDetails';
import { BookRoom } from './pages/customer/BookRoom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Customer Pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { MyBookings } from './pages/customer/MyBookings';
import { CustomerPayments } from './pages/customer/CustomerPayments';
import { CustomerProfile } from './pages/customer/CustomerProfile';
import { SearchHomestays } from './pages/customer/SearchHomestays';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageHomestays } from './pages/admin/ManageHomestays';
import { ManageRooms } from './pages/admin/ManageRooms';
import { ManageCustomers } from './pages/admin/ManageCustomers';
import { ManageBookings } from './pages/admin/ManageBookings';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminSettings } from './pages/admin/AdminSettings';

// Icons
import { 
  Home as HomeIcon, LayoutDashboard, Calendar, CreditCard, User, 
  Settings, LogOut, LogIn, Menu, X, Users, Bed, BarChart3, Database, ShieldCheck
} from 'lucide-react';

const GlobalHeader: React.FC = () => {
  const { currentUser, logout, settings } = useApp();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 py-3.5 flex justify-between items-center">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-100">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <span className="font-extrabold text-lg text-gray-900 tracking-tight">{settings.systemName}</span>
      </Link>

      {/* Desktop navigation */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600">
        <Link to="/" className="hover:text-blue-600 transition-colors">Browse Homestays</Link>
        {currentUser && currentUser.role === 'customer' && (
          <Link to="/customer/dashboard" className="hover:text-blue-600 transition-colors">Customer Portal</Link>
        )}
        {currentUser && currentUser.role === 'admin' && (
          <Link to="/admin/dashboard" className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <span>Admin Console</span>
            <span className="text-[10px] font-extrabold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md uppercase">Root</span>
          </Link>
        )}
      </nav>

      {/* Right menu action */}
      <div className="hidden md:flex items-center gap-4">
        {currentUser ? (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-bold text-gray-900">{currentUser.name}</p>
              <p className="text-[10px] font-semibold text-gray-400 capitalize">{currentUser.role}</p>
            </div>
            <img 
              src={currentUser.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser.name}`} 
              alt="avatar" 
              className="w-9 h-9 rounded-full border border-gray-100 bg-gray-50 object-cover cursor-pointer"
              onClick={() => {
                if (currentUser.role === 'admin') navigate('/admin/settings');
                else navigate('/customer/profile');
              }}
            />
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        ) : (
          <Link 
            to="/login"
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="p-2 md:hidden text-gray-500 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
      >
        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-4 flex flex-col gap-3 shadow-xl md:hidden z-50">
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="p-2.5 font-bold text-gray-700 hover:bg-gray-50 rounded-xl text-sm transition-colors"
          >
            Browse Homestays
          </Link>
          {currentUser && currentUser.role === 'customer' && (
            <Link 
              to="/customer/dashboard" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 font-bold text-gray-700 hover:bg-gray-50 rounded-xl text-sm transition-colors"
            >
              Customer Portal
            </Link>
          )}
          {currentUser && currentUser.role === 'admin' && (
            <Link 
              to="/admin/dashboard" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 font-bold text-gray-700 hover:bg-gray-50 rounded-xl text-sm transition-colors"
            >
              Admin Console
            </Link>
          )}
          
          <div className="border-t border-gray-50 pt-3 flex justify-between items-center px-2">
            {currentUser ? (
              <>
                <div>
                  <p className="text-xs font-extrabold text-gray-900">{currentUser.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{currentUser.role}</p>
                </div>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 border border-rose-100 text-rose-600 bg-rose-50 font-bold text-xs rounded-xl"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link 
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-gray-900 text-white font-bold text-xs rounded-xl"
              >
                Sign In Now
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

// Guard wrapper for Customer Routes
const CustomerGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useApp();
  const location = useLocation();
  if (!currentUser) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (currentUser.role !== 'customer') return <Navigate to="/" replace />;
  return <>{children}</>;
};

// Guard wrapper for Admin Routes
const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
};

// Customer Layout wrapping Sidebar/Subnav
const CustomerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/customer/dashboard', icon: LayoutDashboard },
    { name: 'My Bookings', path: '/customer/bookings', icon: Calendar },
    { name: 'My Invoices', path: '/customer/payments', icon: CreditCard },
    { name: 'Profile Details', path: '/customer/profile', icon: User },
  ];

  return (
    <div className="min-h-[calc(100vh-69px)] bg-[#F8FAFC] flex flex-col md:flex-row">
      {/* Side submenu */}
      <aside className="w-full md:w-60 bg-slate-900 p-4 md:p-6 flex flex-row md:flex-col gap-1 overflow-x-auto shrink-0 md:sticky md:top-[69px] md:h-[calc(100vh-69px)]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-4 py-3 text-xs font-semibold transition-all text-left shrink-0 cursor-pointer w-full
                ${isActive 
                  ? 'bg-blue-600/10 text-blue-400 border-l-4 border-blue-600' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-md'}
              `}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </aside>

      {/* Main workspace */}
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
};

// Admin Layout wrapping Sidebar/Subnav
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Homestays', path: '/admin/homestays', icon: HomeIcon },
    { name: 'Rooms Portfolio', path: '/admin/rooms', icon: Bed },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Reservations', path: '/admin/bookings', icon: Calendar },
    { name: 'Invoices & Fees', path: '/admin/payments', icon: CreditCard },
    { name: 'Business Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Global Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-[calc(100vh-69px)] bg-[#F8FAFC] flex flex-col md:flex-row">
      {/* Side submenu */}
      <aside className="w-full md:w-60 bg-slate-900 p-4 md:p-6 flex flex-row md:flex-col gap-1 overflow-x-auto shrink-0 md:sticky md:top-[69px] md:h-[calc(100vh-69px)]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-4 py-3 text-xs font-semibold transition-all text-left shrink-0 cursor-pointer w-full
                ${isActive 
                  ? 'bg-blue-600/10 text-blue-400 border-l-4 border-blue-600' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-md'}
              `}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </aside>

      {/* Main workspace */}
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
          <GlobalHeader />
          
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/homestay/:id" element={<HomestayDetails />} />
            <Route path="/customer/homestay/:id" element={<HomestayDetails />} />
            <Route path="/customer/search" element={<SearchHomestays />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Guarded customer routes */}
            <Route path="/room/:roomId/book" element={
              <CustomerGuard>
                <BookRoom />
              </CustomerGuard>
            } />
            <Route path="/customer/book/:roomId" element={
              <CustomerGuard>
                <BookRoom />
              </CustomerGuard>
            } />

            <Route path="/customer/dashboard" element={
              <CustomerGuard>
                <CustomerLayout>
                  <CustomerDashboard />
                </CustomerLayout>
              </CustomerGuard>
            } />
            <Route path="/customer/bookings" element={
              <CustomerGuard>
                <CustomerLayout>
                  <MyBookings />
                </CustomerLayout>
              </CustomerGuard>
            } />
            <Route path="/customer/payments" element={
              <CustomerGuard>
                <CustomerLayout>
                  <CustomerPayments />
                </CustomerLayout>
              </CustomerGuard>
            } />
            <Route path="/customer/profile" element={
              <CustomerGuard>
                <CustomerLayout>
                  <CustomerProfile />
                </CustomerLayout>
              </CustomerGuard>
            } />

            {/* Guarded administrative routes */}
            <Route path="/admin/dashboard" element={
              <AdminGuard>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminGuard>
            } />
            <Route path="/admin/homestays" element={
              <AdminGuard>
                <AdminLayout>
                  <ManageHomestays />
                </AdminLayout>
              </AdminGuard>
            } />
            <Route path="/admin/rooms" element={
              <AdminGuard>
                <AdminLayout>
                  <ManageRooms />
                </AdminLayout>
              </AdminGuard>
            } />
            <Route path="/admin/customers" element={
              <AdminGuard>
                <AdminLayout>
                  <ManageCustomers />
                </AdminLayout>
              </AdminGuard>
            } />
            <Route path="/admin/bookings" element={
              <AdminGuard>
                <AdminLayout>
                  <ManageBookings />
                </AdminLayout>
              </AdminGuard>
            } />
            <Route path="/admin/payments" element={
              <AdminGuard>
                <AdminLayout>
                  <AdminPayments />
                </AdminLayout>
              </AdminGuard>
            } />
            <Route path="/admin/reports" element={
              <AdminGuard>
                <AdminLayout>
                  <AdminReports />
                </AdminLayout>
              </AdminGuard>
            } />
            <Route path="/admin/settings" element={
              <AdminGuard>
                <AdminLayout>
                  <AdminSettings />
                </AdminLayout>
              </AdminGuard>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
