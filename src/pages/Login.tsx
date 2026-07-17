import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Home, Shield, Users, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const Login: React.FC = () => {
  const { login, toast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    if (!email || !password) return;

    // Validate email or general username format (at least 2 characters)
    const trimmedInput = email.trim();
    if (trimmedInput.length < 2) {
      setEmailError('Please enter a valid email address or username (at least 2 characters)');
      toast.show('Input too short', 'error');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        const from = location.state?.from || '/customer/dashboard';
        navigate(from);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div id="login-page" className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        
        {/* Header Branding */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white shadow-lg">
              <Home className="h-6 w-6" />
            </div>
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to manage your reservations or update homestays.
          </p>
        </div>

        {/* Credentials Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xl space-y-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email or Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${emailError ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-gray-200 focus:border-blue-500'} focus:outline-hidden text-sm transition-colors`}
                  placeholder="Email or username"
                  required
                />
              </div>
              {emailError && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{emailError}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-gray-500 uppercase">Password</label>
                <span className="text-xs text-blue-600 hover:underline cursor-pointer">Forgot?</span>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-hidden text-sm transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-100 transition-all cursor-pointer"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Credentials Information */}
          <div className="border-t border-gray-100 pt-6 space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase text-center">Sign In Credentials</p>
            <div className="space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 rounded-2xl bg-amber-50/50 border border-amber-100/60 text-xs">
                <span className="font-semibold text-amber-900 flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-amber-600" />
                  Admin Account
                </span>
                <span className="font-mono text-gray-600 select-all">admin@stayconnect.com</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 rounded-2xl bg-blue-50/50 border border-blue-100/60 text-xs">
                <span className="font-semibold text-blue-900 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-blue-600" />
                  Customer Account
                </span>
                <span className="font-mono text-gray-600 select-all">user@gmail.com</span>
              </div>
            </div>
            <p className="text-[11px] text-center text-gray-400 leading-normal">
              Type any name or email and any password to sign in or sign up on the fly.
            </p>
          </div>

          <p className="text-xs text-center text-gray-400">
            Don't have a customer account?{' '}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">
              Register here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
