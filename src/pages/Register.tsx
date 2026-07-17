import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Home, User, Mail, Phone, MapPin, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const Register: React.FC = () => {
  const { register, toast } = useApp();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    if (!name || !email || !password || !mobile || !address) return;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address (e.g. name@example.com)');
      toast.show('Please enter a valid email address', 'error');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, mobile, address, gender);
      navigate('/customer/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="register-page" className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        
        {/* Header Branding */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white shadow-lg">
              <Home className="h-6 w-6" />
            </div>
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create an account</h2>
          <p className="mt-2 text-sm text-gray-500">
            Sign up to start exploring and reserving premium homestays.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xl">
          <form onSubmit={handleRegister} className="space-y-4">
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <User className="h-4 w-4" />
                </span>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-hidden text-sm"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${emailError ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-gray-200 focus:border-blue-500'} focus:outline-hidden text-sm transition-colors`}
                  placeholder="john@example.com"
                  required
                />
              </div>
              {emailError && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{emailError}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mobile Number *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <Phone className="h-4 w-4" />
                </span>
                <input 
                  type="tel" 
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-hidden text-sm"
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Residential Address *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <MapPin className="h-4 w-4" />
                </span>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-hidden text-sm"
                  placeholder="City, State, Country"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gender *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-hidden text-sm"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-hidden text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-100 transition-all mt-4 cursor-pointer"
            >
              <span>{loading ? 'Creating account...' : 'Register'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="text-xs text-center text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Log in here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
