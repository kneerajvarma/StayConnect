import React from 'react';
import { ShieldCheck, Heart, Sparkles, Building2, Globe } from 'lucide-react';
import { motion } from 'motion/react';

export const About: React.FC = () => {
  return (
    <div id="about-page" className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Intro */}
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-gray-900 tracking-tight"
          >
            About StayConnect
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg text-gray-500 max-w-2xl mx-auto"
          >
            Connecting travelers seeking warm, authentic lodgings with passionate local hosts since 2026.
          </motion.p>
        </div>

        {/* Visual Block */}
        <div className="rounded-2xl overflow-hidden h-72 md:h-96 relative shadow-lg">
          <img 
            src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80" 
            alt="Kitchen hospitality" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-900/10 backdrop-contrast-125"></div>
        </div>

        {/* Story */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Our Story</h2>
          <p className="text-gray-600 leading-relaxed">
            StayConnect was born out of a simple realization: travelers want more than a standard, sterile hotel room. They want connection, culture, and localized comfort. At the same time, homestay hosts require a professional, safe, and robust tool to list rooms, receive reservations, manage customer histories, and process billing.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our platform provides a clean, elegant full-stack interface where customers can explore destinations, filter by amenities, book individual rooms with live cost calculations, and complete instant transactions. Administrative portals enable hosts to handle bookings, review revenue, add items, and export monthly business performance summaries.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mx-auto">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-gray-900">Safety First</h3>
            <p className="text-sm text-gray-500">Rigorous vetting, secure encryption, and trusted payment processes keep you perfectly safe.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mx-auto">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-gray-900">Hospitality Mindset</h3>
            <p className="text-sm text-gray-500">We nurture relationships between guests and hosts, fostering global mutual respect.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 mx-auto">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-gray-900">Modern Ease</h3>
            <p className="text-sm text-gray-500">An intuitive visual platform built with the latest reactive frameworks for zero friction.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
