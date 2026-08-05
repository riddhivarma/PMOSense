// frontend/src/pages/AdminLoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { Mail, Lock, Key, ArrowLeft, Shield } from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      Swal.fire({ icon: 'warning', title: 'Input Error', text: 'Please fill in both fields.', confirmButtonColor: '#db2777' });
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({ icon: 'warning', title: 'Validation Mismatch', text: 'Enter a valid email structure.', confirmButtonColor: '#db2777' });
      return;
    }

    setLoading(true);
    
    try {
      // Enforce role === 'admin'
      const loggedUser = await login(email, password, 'admin');
      
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      });

      Toast.fire({
        icon: 'success',
        title: `Access Granted!`,
        text: `Welcome back, Administrator.`
      });

      navigate('/admin-dashboard');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: err.message || 'Check email or admin security keys.',
        confirmButtonColor: '#e11d48'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto pt-10 px-4 animate-fadeIn">
      <div className="flex justify-start mb-4">
        <Link 
          to="/" 
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-rose-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Go to Home</span>
        </Link>
      </div>
      
      <div className="glass-card p-6 sm:p-8 space-y-6 border border-rose-200/50 shadow-lg relative overflow-hidden">
        {/* Decorative background shield watermark */}
        <div className="absolute -right-4 -bottom-4 text-rose-50/60 pointer-events-none">
          <Shield size={120} className="stroke-[1.5]" />
        </div>

        <div className="text-center space-y-2 relative z-10">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-sm">
            <Shield size={24} />
          </div>
          <h2 className="font-outfit text-2xl font-extrabold text-slate-900">Admin Portal</h2>
          <p className="text-xs sm:text-sm text-slate-400">Restricted administrative sign in</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 relative z-10">
          <Input
            label="Security Email"
            name="email"
            type="email"
            placeholder="admin@pmosense.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={16} />}
            required
          />

          <Input
            label="Security Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={16} />}
            required
          />

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-2.5 rounded-xl shadow-md shadow-rose-500/20"
              loading={loading}
              icon={<Key size={16} />}
            >
              Authorize Access
            </Button>
          </div>
        </form>

        <div className="text-center pt-2 text-[10px] sm:text-xs text-rose-500 font-semibold leading-relaxed flex items-center justify-center space-x-1.5 relative z-10">
          <span>🛡️ Restricted System: Administrative Use Only</span>
        </div>
      </div>
    </div>
  );
}
