// frontend/src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';

export default function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto pt-20 text-center space-y-6 animate-fadeIn">
      <div className="flex justify-center">
        <div className="h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 shadow-md border border-red-100">
          <ShieldAlert size={36} />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="font-outfit text-6xl font-extrabold text-slate-900 leading-none">404</h1>
        <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
        <p className="text-sm text-slate-400">The link you followed may be broken or the page has been moved.</p>
      </div>

      <div className="pt-4">
        <Link to="/">
          <Button icon={<ArrowLeft size={16} />}>
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
