// frontend/src/components/Input.jsx
import React from 'react';

export default function Input({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  required = false,
  className = '',
  disabled = false,
  register = () => ({}), // Fallback for React Hook Form integration
  ...props
}) {
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            {icon}
          </span>
        )}
        
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`form-input text-sm ${icon ? 'pl-10' : ''} ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''} ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-75' : ''}`}
          {...register(name)}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-xs text-red-550 font-semibold pl-1 animate-fadeIn">
          {error.message || error}
        </p>
      )}
    </div>
  );
}
