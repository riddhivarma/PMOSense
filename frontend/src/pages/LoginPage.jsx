// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { Mail, Lock, LogIn, Eye, EyeOff, ShieldAlert, Key, ArrowLeft, User, Stethoscope } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [roleTab, setRoleTab] = useState('user'); // 'user', 'doctor'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Core Validations
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
      const loggedUser = await login(email, password, roleTab);
      
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      });

      Toast.fire({
        icon: 'success',
        title: `Welcome, ${loggedUser.name || 'User'}!`,
        text: `Signed in as ${loggedUser.role}`
      });

      // Redirect based on role
      if (loggedUser.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (loggedUser.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Auth Failed',
        text: err.message || 'Check email or credentials.',
        confirmButtonColor: '#db2777'
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
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-brand-pink-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Go to Home</span>
        </Link>
      </div>
      <div className="glass-card p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="font-outfit text-2xl font-extrabold text-slate-900">Welcome Back</h2>
          <p className="text-xs sm:text-sm text-slate-400">Authenticate session details to continue</p>
        </div>

        {/* Tab Role selection toggle */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setRoleTab('user')}
            className={`flex items-center justify-center space-x-2 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer ${roleTab === 'user' ? 'bg-white text-brand-pink-600 shadow-sm' : 'text-slate-550 hover:text-slate-700'}`}
          >
            <User size={14} className={roleTab === 'user' ? 'text-brand-pink-500' : 'text-slate-400'} />
            <span>User / Patient</span>
          </button>
          <button
            type="button"
            onClick={() => setRoleTab('doctor')}
            className={`flex items-center justify-center space-x-2 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer ${roleTab === 'doctor' ? 'bg-white text-brand-indigo-600 shadow-sm' : 'text-slate-550 hover:text-slate-700'}`}
          >
            <Stethoscope size={14} className={roleTab === 'doctor' ? 'text-brand-indigo-500' : 'text-slate-400'} />
            <span>Medical Doctor</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="e.g. user@pmosense.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={16} />}
            required
          />

          <div className="space-y-1.5">
            <div className="flex justify-between items-center mb-1.5">
              <label className="form-label mb-0">Password</label>
              <Link to="/forgot-password" className="text-xs text-brand-pink-600 hover:underline font-bold">
                Forgot Password?
              </Link>
            </div>
            <div className="relative flex items-center">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Lock size={16} />
              </span>
              
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input text-sm pl-10 pr-10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-650 cursor-pointer focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            loading={loading}
            icon={<LogIn size={15} />}
            className="w-full mt-6"
          >
            Sign In
          </Button>
        </form>

        <div className="border-t border-slate-100 pt-4 text-center">
          <p className="text-xs text-slate-550">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-pink-600 hover:underline font-bold">
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
