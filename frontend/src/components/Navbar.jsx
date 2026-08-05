// frontend/src/components/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import { HeartPulse, LogOut, User, LayoutDashboard, Stethoscope, ShieldCheck, Bell } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const isPublicRoute = ['/', '/about', '/contact'].includes(location.pathname);
  const isDashboardLayout = user && !isPublicRoute;

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-pink-200/40 shadow-sm transition-all">
      <div className={`w-full px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between ${isDashboardLayout ? 'max-w-none' : 'max-w-7xl mx-auto'}`}>
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-pink-500/25 group-hover:scale-105 transition-transform">
            <HeartPulse size={20} className="animate-pulse" />
          </div>
          <span className="font-outfit text-2xl font-extrabold tracking-tight text-slate-800">
            PMO<span className="text-pink-500 font-serif italic">Sense</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold">
          {(!user || isPublicRoute) && (
            <>
              <Link 
                to="/education" 
                className={`transition-colors hover:text-pink-500 relative py-1 ${isActive('/education') ? 'text-pink-600 font-bold' : 'text-slate-600'}`}
              >
                PMOS Education
                {isActive('/education') && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 rounded-full animate-fadeIn"></span>}
              </Link>

              <Link 
                to="/assessment" 
                className={`transition-colors hover:text-pink-500 relative py-1 ${isActive('/assessment') ? 'text-pink-600 font-bold' : 'text-slate-600'}`}
              >
                Risk Screener
                {isActive('/assessment') && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 rounded-full animate-fadeIn"></span>}
              </Link>
            </>
          )}

        </nav>

        {/* User Status / Action Buttons */}
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              <button 
                className="p-2 rounded-full text-slate-400 hover:text-pink-600 hover:bg-pink-50 transition-colors cursor-pointer relative focus:outline-none"
                title="Notifications"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-pink-500 ring-2 ring-white"></span>
              </button>

              <Link 
                to="/profile" 
                className="flex items-center space-x-2 text-xs font-bold text-slate-700 bg-pink-50 border border-pink-150 px-3 py-1.5 rounded-full hover:bg-pink-100 transition-colors"
              >
                <User size={14} className="text-pink-500" />
                <span className="max-w-[120px] truncate">
                  {user.role === 'admin' ? 'Administrator' : user.name}
                </span>
              </Link>
              
              <button 
                onClick={logout}
                title="Sign Out"
                className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
