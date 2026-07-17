import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Save, Settings, Percent, HelpCircle, ShieldCheck } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, toast } = useApp();

  const [systemName, setSystemName] = useState(settings.systemName);
  const [taxes, setTaxes] = useState(settings.taxes);
  const [bookingRules, setBookingRules] = useState(settings.bookingRules);
  const [currency, setCurrency] = useState(settings.currency || 'INR');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!systemName || !bookingRules) {
      toast.show('Please complete all configuration cells', 'error');
      return;
    }

    updateSettings({
      ...settings,
      systemName,
      taxes,
      bookingRules,
      currency
    });
  };

  return (
    <div id="admin-settings" className="p-6 md:p-8 space-y-6 w-full max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <Settings className="h-7 w-7 text-blue-600" />
          <span>System Settings</span>
        </h1>
        <p className="text-gray-500 mt-1 font-medium font-sans">Configure platform metadata, tax compliance, and general lodging policy templates.</p>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
        <h3 className="font-bold text-gray-900 text-lg">General Parameters</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Platform Brand Name</label>
            <input 
              type="text" 
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-hidden font-semibold text-gray-800"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 flex items-center gap-1">
                <Percent className="h-3.5 w-3.5 text-blue-600" />
                <span>Service / Room Tax (%)</span>
              </label>
              <input 
                type="number" 
                value={taxes}
                onChange={(e) => setTaxes(Number(e.target.value))}
                min={0}
                max={30}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-hidden font-medium text-gray-800"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Currency Code</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-hidden bg-white font-medium"
              >
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="INR">INR (₹) - Indian Rupee</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Default Booking Policy & Rules</label>
            <textarea
              value={bookingRules}
              onChange={(e) => setBookingRules(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-hidden text-gray-700 leading-relaxed"
              required
            ></textarea>
          </div>
        </div>

        {/* Save CTA */}
        <div className="pt-4 border-t border-gray-50">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-md transition-all cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Apply Global Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
