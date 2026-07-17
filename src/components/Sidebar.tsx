import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Home, Bed, Users, Calendar, 
  CreditCard, BarChart3, Settings, UserSquare2, Compass 
} from 'lucide-react';

interface SidebarProps {
  id?: string;
  role: 'admin' | 'customer';
}

export const Sidebar: React.FC<SidebarProps> = ({ id, role }) => {
  const location = useLocation();

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/homestays', label: 'Manage Homestays', icon: Home },
    { to: '/admin/rooms', label: 'Manage Rooms', icon: Bed },
    { to: '/admin/customers', label: 'Manage Customers', icon: Users },
    { to: '/admin/bookings', label: 'Manage Bookings', icon: Calendar },
    { to: '/admin/payments', label: 'Manage Payments', icon: CreditCard },
    { to: '/admin/reports', label: 'View Reports', icon: BarChart3 },
    { to: '/admin/settings', label: 'System Settings', icon: Settings },
  ];

  const customerLinks = [
    { to: '/customer/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/customer/search', label: 'Search Homestays', icon: Compass },
    { to: '/customer/bookings', label: 'My Bookings', icon: Calendar },
    { to: '/customer/payments', label: 'My Payments', icon: CreditCard },
    { to: '/customer/profile', label: 'My Profile', icon: UserSquare2 },
  ];

  const links = role === 'admin' ? adminLinks : customerLinks;

  return (
    <aside 
      id={id || `${role}-sidebar`} 
      className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col shrink-0 min-h-[calc(100vh-4rem)] p-4 space-y-1.5"
    >
      <div className="px-3 mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest leading-none">
          {role === 'admin' ? 'Administration' : 'Customer Account'}
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;

          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive 
                  ? role === 'admin' 
                    ? 'bg-amber-500/10 text-amber-700 shadow-xs' 
                    : 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
