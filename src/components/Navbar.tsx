import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Menu, X, LogOut, User as UserIcon, Home, Compass, UserCheck, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav id="app-navbar" className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-200 group-hover:scale-105 transition-transform">
                <Home className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Stay<span className="text-amber-500">Connect</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium transition-colors ${isActive('/about') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`text-sm font-medium transition-colors ${isActive('/contact') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Contact
            </Link>

            {/* Role-Based Links */}
            {currentUser && currentUser.role === 'customer' && (
              <Link 
                to="/customer/dashboard" 
                className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${location.pathname.startsWith('/customer') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                <Compass className="h-4 w-4" />
                Portal
              </Link>
            )}

            {currentUser && currentUser.role === 'admin' && (
              <Link 
                to="/admin/dashboard" 
                className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${location.pathname.startsWith('/admin') ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                <Shield className="h-4 w-4" />
                Admin Console
              </Link>
            )}

            {/* Profile Dropdown / Auth Buttons */}
            <div className="border-l border-gray-100 pl-6 flex items-center gap-4">
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <Link to={currentUser.role === 'admin' ? '/admin/dashboard' : '/customer/profile'} className="flex items-center gap-2 group">
                    <img 
                      src={currentUser.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser.name}`}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full border border-gray-200 object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="text-left leading-none">
                      <div className="text-xs text-gray-400 capitalize font-medium">{currentUser.role}</div>
                      <div className="text-sm font-semibold text-gray-800">{currentUser.name.split(' ')[0]}</div>
                    </div>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link 
                    to="/login" 
                    className="text-sm font-semibold text-gray-700 hover:text-blue-600 px-3 py-1.5 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link 
                    to="/register" 
                    className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow px-4 py-2 rounded-xl transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-hidden"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-gray-100 bg-white px-4 pt-2 pb-4 space-y-2">
          <Link 
            to="/" 
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2 rounded-xl text-base font-medium ${isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2 rounded-xl text-base font-medium ${isActive('/about') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2 rounded-xl text-base font-medium ${isActive('/contact') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Contact
          </Link>

          {currentUser && currentUser.role === 'customer' && (
            <Link 
              to="/customer/dashboard" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-medium bg-blue-50 text-blue-600"
            >
              My Dashboard
            </Link>
          )}

          {currentUser && currentUser.role === 'admin' && (
            <Link 
              to="/admin/dashboard" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-medium bg-amber-50 text-amber-600"
            >
              Admin Dashboard
            </Link>
          )}

          <div className="pt-4 border-t border-gray-100">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <img 
                    src={currentUser.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser.name}`}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{currentUser.name}</div>
                    <div className="text-xs text-gray-500">{currentUser.email}</div>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-base font-medium transition-colors"
                >
                  <LogOut className="h-5 w-5" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 p-2">
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
