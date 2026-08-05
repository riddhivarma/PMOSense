// frontend/src/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Input from '../components/Input';
import Button from '../components/Button';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      Swal.fire({
        icon: 'success',
        title: 'Recovery Link Sent',
        text: 'A password recovery link has been dispatched to your email address (mock action).',
        confirmButtonColor: '#4f46e5'
      });
      setEmail('');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto pt-16 px-4 animate-fadeIn">
      <div className="glass-card p-8 space-y-6">
        
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-xl bg-brand-pink-50 flex items-center justify-center text-brand-pink-600 border border-brand-pink-100">
            <KeyRound size={24} />
          </div>
        </div>

        <div className="text-center space-y-1">
          <h2 className="font-outfit text-2xl font-extrabold text-slate-900">Recover Password</h2>
          <p className="text-xs sm:text-sm text-slate-405">Enter your email and we'll dispatch a link to reset your credentials.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="jane@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={16} />}
            required
          />

          <Button
            type="submit"
            loading={loading}
            className="w-full pt-3 pb-3 mt-4"
          >
            Send Recovery Link
          </Button>
        </form>

        <div className="border-t border-slate-100 pt-4 flex items-center justify-center">
          <Link to="/login" className="flex items-center space-x-1.5 text-xs text-slate-550 hover:text-brand-pink-600 font-bold transition-colors">
            <ArrowLeft size={14} />
            <span>Return to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
