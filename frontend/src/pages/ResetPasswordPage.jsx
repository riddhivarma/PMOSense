// frontend/src/pages/ResetPasswordPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Input from '../components/Input';
import Button from '../components/Button';
import { Lock, Check } from 'lucide-react';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password.length < 6) {
      Swal.fire({ icon: 'warning', title: 'Weak Password', text: 'Password must be at least 6 characters.', confirmButtonColor: '#db2777' });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({ icon: 'warning', title: 'Mismatch', text: 'Passwords do not match.', confirmButtonColor: '#db2777' });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      Swal.fire({
        icon: 'success',
        title: 'Credentials Updated',
        text: 'Your password has been successfully reset. Log in with your new credentials.',
        confirmButtonColor: '#4f46e5'
      }).then(() => {
        navigate('/login');
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto pt-16 px-4 animate-fadeIn">
      <div className="glass-card p-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="font-outfit text-2xl font-extrabold text-slate-900">Reset Password</h2>
          <p className="text-xs sm:text-sm text-slate-405">Enter a strong, secure new password for your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="New Password"
            name="password"
            type="password"
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={16} />}
            required
          />

          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<Lock size={16} />}
            required
          />

          <Button
            type="submit"
            loading={loading}
            icon={<Check size={15} />}
            className="w-full pt-3 pb-3 mt-4"
          >
            Update Password
          </Button>
        </form>

        <div className="border-t border-slate-100 pt-4 text-center">
          <Link to="/login" className="text-xs text-brand-pink-600 hover:underline font-bold">
            Sign In instead
          </Link>
        </div>
      </div>
    </div>
  );
}
