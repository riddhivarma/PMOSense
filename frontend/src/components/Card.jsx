import React from 'react';

export default function Card({ title, subtitle, icon, children, className = '', hoverEffect = true, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`glass-card p-6 ${hoverEffect ? 'glass-card-hover' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Title / Header */}
      {(title || icon) && (
        <div className="flex items-center space-x-3 mb-4">
          {icon && (
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-pink-100 to-brand-indigo-100 flex items-center justify-center text-brand-pink-600 shadow-sm shrink-0">
              {icon}
            </div>
          )}
          {title && (
            <div>
              <h3 className="text-base font-bold text-slate-800 tracking-tight leading-tight">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-slate-400 font-medium">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Card Content */}
      <div className="text-slate-600 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}
