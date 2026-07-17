import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'motion/react';

export const Contact: React.FC = () => {
  const { toast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.show('Please fill in all required fields', 'error');
      return;
    }
    
    toast.show('Your message has been sent successfully! Our team will contact you soon.', 'success');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div id="contact-page" className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Info Sidebar */}
        <div className="md:col-span-5 bg-blue-600 rounded-2xl p-8 text-white space-y-8 flex flex-col justify-between shadow-lg">
          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold tracking-tight">Get in Touch</h1>
            <p className="text-blue-100 text-sm">
              Have questions about listing your homestay or managing your booking? Contact our dedicated 24/7 lodging support team.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-xl">
                <MapPin className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Headquarters</h4>
                <p className="text-xs text-blue-100">100 Pine Street, Suite 1200<br />San Francisco, CA 94111</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-xl">
                <Phone className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Phone Assistance</h4>
                <p className="text-xs text-blue-100">+1 (555) STAY-CONNECT</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-xl">
                <Mail className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Email Address</h4>
                <p className="text-xs text-blue-100">support@stayconnect.com</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-blue-200">
            Typically responds within 2 hours.
          </p>
        </div>

        {/* Contact Form Card */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name *</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-hidden text-sm transition-colors"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address *</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-hidden text-sm transition-colors"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subject</label>
              <input 
                type="text" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-hidden text-sm transition-colors"
                placeholder="Booking inquiry, support ticket..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">How can we help? *</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-hidden text-sm transition-colors"
                placeholder="Describe your inquiry..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-200 transition-all cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
