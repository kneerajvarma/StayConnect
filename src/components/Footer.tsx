import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="app-footer" className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800 shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white">
                <Home className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Stay<span className="text-amber-500">Connect</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400">
              Your modern destination for premium, authenticated homestay reservations worldwide. Comfortable stays, verified hosts, and absolute reliability.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">Partner Log In</Link>
              </li>
            </ul>
          </div>

          {/* Customer Portal */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Customer Care</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/customer/dashboard" className="hover:text-white transition-colors">My Portal</Link>
              </li>
              <li>
                <Link to="/customer/profile" className="hover:text-white transition-colors">Edit Profile</Link>
              </li>
              <li>
                <Link to="/customer/bookings" className="hover:text-white transition-colors">Reservations</Link>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">Cancellation Terms</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 text-sm">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Get In Touch</h4>
            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
              <span>100 Pine Street, Suite 1200<br />San Francisco, CA 94111</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-blue-500 shrink-0" />
              <span>+1 (555) STAY-CONNECT</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-blue-500 shrink-0" />
              <span>support@stayconnect.com</span>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} StayConnect Inc. All rights reserved.</p>
          <p className="flex items-center gap-1.5 justify-center">
            Crafted with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> for complete lodging solutions.
          </p>
        </div>
      </div>
    </footer>
  );
};
