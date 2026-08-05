// frontend/src/components/Loader.jsx
import React from 'react';
import { Activity } from 'lucide-react';

export default function Loader({ 
  fullPage = false, 
  size = 'md', // sm, md, lg
  text = 'Loading...' 
}) {
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base'
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32
  };

  const content = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="relative flex items-center justify-center">
        {/* Glow */}
        <div className="absolute inset-0 bg-brand-pink-400 rounded-full blur-md opacity-20 animate-ping"></div>
        {/* Spinner */}
        <div className="animate-spin rounded-full border-4 border-slate-100 border-t-brand-pink-500 h-10 w-10 flex items-center justify-center">
          <Activity size={iconSizes[size]} className="text-brand-pink-500 animate-pulse" />
        </div>
      </div>
      {text && (
        <span className="text-xs sm:text-sm font-bold text-slate-450 uppercase tracking-widest animate-pulse">
          {text}
        </span>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
        <div className="bg-white/95 p-8 rounded-2xl shadow-xl border border-slate-100">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8 w-full min-h-[200px]">
      {content}
    </div>
  );
}
