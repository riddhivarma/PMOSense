// frontend/src/components/Modal.jsx
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md', // sm, md, lg
  closeOnOutsideClick = true
}) {
  
  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl"
  };

  const handleOutsideClick = (e) => {
    if (closeOnOutsideClick && e.target.id === 'modal-backdrop') {
      onClose();
    }
  };

  return (
    <div
      id="modal-backdrop"
      onClick={handleOutsideClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900 bg-opacity-50 backdrop-blur-sm animate-fadeIn"
    >
      <div className={`w-full bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden ${sizes[size]} transform transition-transform duration-300 animate-slideUp`}>
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-outfit text-base sm:text-lg font-bold text-slate-800">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer focus:outline-none"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Body Content */}
        <div className="px-6 py-5 max-h-[75vh] overflow-y-auto text-slate-600 text-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
