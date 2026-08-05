// frontend/src/pages/UnderConstructionPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

export default function UnderConstructionPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-md mx-auto pt-20 text-center space-y-6 animate-fadeIn px-4">
      <div className="flex justify-center">
        <div className="h-16 w-16 rounded-2xl bg-brand-pink-50 flex items-center justify-center text-brand-pink-500 shadow-md border border-brand-pink-100">
          <Compass size={36} className="animate-spin" style={{ animationDuration: '6s' }} />
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="font-outfit text-4xl font-extrabold text-slate-900 leading-tight">Page Not Found</h1>
        <h2 className="text-md font-bold text-slate-500">Under Construction</h2>
        <p className="text-xs sm:text-sm text-slate-450 leading-relaxed max-w-sm mx-auto">
          The module you are looking for has not been fully implemented in this version of the application yet. Please check back later!
        </p>
      </div>

      {!user && (
        <div className="pt-4">
          <Link to="/">
            <Button icon={<Home size={15} />} size="md" className="mx-auto">
              Go to homepage
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
