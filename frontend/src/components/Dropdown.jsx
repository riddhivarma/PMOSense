// frontend/src/components/Dropdown.jsx
import React from 'react';

export default function Dropdown({
  label,
  name,
  options = [], // [{ value, label }] or simple array of strings
  value,
  onChange,
  error,
  required = false,
  className = '',
  disabled = false,
  register = () => ({}),
  ...props
}) {
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`form-input text-sm cursor-pointer ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''} ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-75' : ''}`}
        {...register(name)}
        {...props}
      >
        {options.map((opt, i) => {
          const isObject = typeof opt === 'object' && opt !== null;
          const val = isObject ? opt.value : opt;
          const lbl = isObject ? opt.label : opt;
          
          return (
            <option key={i} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      
      {error && (
        <p className="text-xs text-red-550 font-semibold pl-1 animate-fadeIn">
          {error.message || error}
        </p>
      )}
    </div>
  );
}
