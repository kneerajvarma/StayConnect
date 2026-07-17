import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, ShieldAlert, CheckCircle, Save, Lock, Camera } from 'lucide-react';

export const CustomerProfile: React.FC = () => {
  const { currentUser, updateProfile, toast } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [mobile, setMobile] = useState(currentUser?.mobile || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(
    (currentUser?.gender as any) || 'Male'
  );
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');

  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  if (!currentUser) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-gray-100 max-w-sm mx-auto mt-12 shadow-sm">
        <ShieldAlert className="h-12 w-12 text-rose-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900">Session Invalid</h3>
        <p className="text-gray-500 mt-2">Please log in to edit profile details.</p>
      </div>
    );
  }

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile || !address) {
      toast.show('Please fill in all details', 'error');
      return;
    }

    updateProfile({
      name,
      mobile,
      address,
      gender,
      avatar: avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.show('Please fill in both password fields', 'error');
      return;
    }
    toast.show('Password changed successfully!', 'success');
    setOldPassword('');
    setNewPassword('');
  };

  return (
    <div id="customer-profile-page" className="p-6 md:p-8 space-y-8 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Account Profile</h1>
        <p className="text-gray-500 mt-1">Review contact numbers, home addresses, or change passwords.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Profile Card Form (Left side - 7 cols) */}
        <form onSubmit={handleProfileSubmit} className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            <span>Profile Details</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-gray-50">
            <div className="relative shrink-0">
              <img 
                src={avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`} 
                alt="profile avatar"
                className="w-20 h-20 rounded-full border border-gray-100 object-cover" 
              />
              <span className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full border-2 border-white shadow-md">
                <Camera className="h-3 w-3" />
              </span>
            </div>
            <div className="text-center sm:text-left space-y-2 w-full">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Avatar Image URL</label>
              <input 
                type="text" 
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="Paste direct Unsplash/Dicebear URL"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-hidden text-sm font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email (Immutable)</label>
              <input 
                type="email" 
                value={currentUser.email}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 text-sm cursor-not-allowed"
                disabled
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mobile Contact</label>
              <input 
                type="tel" 
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-hidden text-sm font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-hidden text-sm font-medium"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Home Address</label>
            <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-hidden text-sm font-medium"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-xs cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Save Profile Details</span>
            </button>
          </div>
        </form>

        {/* Change Password Card (Right side - 5 cols) */}
        <form onSubmit={handlePasswordSubmit} className="lg:col-span-5 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <Lock className="h-5 w-5 text-amber-500" />
            <span>Change Password</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Old Password</label>
              <input 
                type="password" 
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-hidden text-sm"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-hidden text-sm"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl text-sm cursor-pointer"
          >
            <Lock className="h-4 w-4" />
            <span>Update Password</span>
          </button>
        </form>

      </div>
    </div>
  );
};
