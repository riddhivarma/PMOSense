// frontend/src/components/DashboardCard.jsx
import React from 'react';

export default function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  color = 'pink', // pink, purple, indigo, red, green, amber
  onClick,
  className = ''
}) {
  const colorThemes = {
    pink: {
      border: 'border-l-4 border-l-brand-pink-500',
      iconBg: 'bg-brand-pink-50 text-brand-pink-600',
      value: 'text-brand-pink-600'
    },
    purple: {
      border: 'border-l-4 border-l-brand-purple-500',
      iconBg: 'bg-brand-purple-50 text-brand-purple-650',
      value: 'text-brand-purple-700'
    },
    indigo: {
      border: 'border-l-4 border-l-brand-indigo-500',
      iconBg: 'bg-brand-indigo-50 text-brand-indigo-650',
      value: 'text-brand-indigo-600'
    },
    red: {
      border: 'border-l-4 border-l-red-500',
      iconBg: 'bg-red-50 text-red-650',
      value: 'text-red-700'
    },
    green: {
      border: 'border-l-4 border-l-emerald-500',
      iconBg: 'bg-emerald-50 text-emerald-650',
      value: 'text-emerald-700'
    },
    amber: {
      border: 'border-l-4 border-l-amber-500',
      iconBg: 'bg-amber-50 text-amber-650',
      value: 'text-amber-700'
    }
  };

  const theme = colorThemes[color] || colorThemes.pink;

  return (
    <div
      onClick={onClick}
      className={`glass-card p-6 flex items-center justify-between ${theme.border} ${onClick ? 'cursor-pointer hover:shadow-glass-hover hover:bg-white/85 transition-all duration-300' : ''} ${className}`}
    >
      <div className="space-y-1">
        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <span className={`block text-2xl sm:text-3xl font-extrabold tracking-tight ${theme.value}`}>
          {value}
        </span>
        {subtitle && (
          <span className="block text-[10px] sm:text-xs text-slate-405 font-medium leading-none">
            {subtitle}
          </span>
        )}
      </div>
      
      {icon && (
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${theme.iconBg}`}>
          {icon}
        </div>
      )}
    </div>
  );
}
