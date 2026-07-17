import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  return (
    <AnimatePresence>
      {toast.message && (
        <motion.div
          id="toast-notification"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-xl md:max-w-md"
        >
          {toast.type === 'success' && (
            <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
          )}
          {toast.type === 'error' && (
            <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
          )}
          {toast.type === 'info' && (
            <Info className="h-5 w-5 text-blue-500 shrink-0" />
          )}
          
          <div className="text-sm font-medium text-gray-800 pr-4">
            {toast.message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
