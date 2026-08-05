// frontend/src/components/Button.jsx
import React from 'react';

export default function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', // primary (pink), secondary (indigo), outline, danger, text
  size = 'md', // sm, md, lg
  disabled = false, 
  loading = false,
  className = '',
  icon
}) {
  const baseStyle = "inline-flex items-center justify-center font-semibold rounded-xl active:scale-95 transition-all duration-250 focus:outline-none cursor-pointer border";
  
  const variants = {
    primary: "bg-gradient-to-r from-brand-pink-500 to-brand-pink-600 hover:from-brand-pink-600 hover:to-brand-pink-700 text-white border-transparent shadow-md shadow-brand-pink-550/10 hover:shadow-lg hover:shadow-brand-pink-550/20",
    secondary: "bg-gradient-to-r from-brand-indigo-500 to-brand-indigo-600 hover:from-brand-indigo-600 hover:to-brand-indigo-700 text-white border-transparent shadow-md shadow-brand-indigo-550/10 hover:shadow-lg hover:shadow-brand-indigo-550/20",
    purple: "bg-gradient-to-r from-brand-purple-500 to-brand-purple-600 hover:from-brand-purple-600 hover:to-brand-purple-700 text-white border-transparent shadow-md",
    outline: "bg-white bg-opacity-80 border-slate-200 text-slate-700 hover:border-brand-pink-400 hover:text-brand-pink-500 hover:shadow-sm",
    danger: "bg-red-500 hover:bg-red-600 text-white border-transparent shadow-sm",
    text: "bg-transparent border-transparent text-slate-550 hover:text-brand-pink-500 active:scale-100"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed active:scale-100' : ''} ${className}`}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : icon ? (
        <span className="mr-2 shrink-0">{icon}</span>
      ) : null}
      <span>{loading ? 'Processing...' : children}</span>
    </button>
  );
}
