// frontend/src/components/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, Scale, ShieldAlert, Award, FileText, User, Stethoscope, 
  BookOpen, LogOut, LayoutDashboard, History, MessageSquare, ShieldCheck, ClipboardCheck,
  ChevronLeft, ChevronRight
} from 'lucide-react';

export default function Sidebar({ isCollapsed, onToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // NavLink active styles
  const activeClass = `flex items-center ${isCollapsed ? 'justify-center py-3' : 'space-x-3 px-4 py-3'} rounded-xl text-sm font-bold bg-brand-pink-50 text-brand-pink-600 shadow-sm border border-brand-pink-100/50 transition-all`;
  const inactiveClass = `flex items-center ${isCollapsed ? 'justify-center py-3' : 'space-x-3 px-4 py-3'} rounded-xl text-sm font-bold text-slate-550 hover:bg-slate-50 hover:text-slate-800 border border-transparent transition-all`;

  const renderMenuItems = () => {
    switch (user.role) {
      case 'user':
        return (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? activeClass : inactiveClass} title="My Dashboard">
              <LayoutDashboard size={18} />
              {!isCollapsed && <span>My Dashboard</span>}
            </NavLink>
            <NavLink to="/assessment" className={({ isActive }) => isActive ? activeClass : inactiveClass} title="PMOS Assessment">
              <ClipboardCheck size={18} />
              {!isCollapsed && <span>PMOS Assessment</span>}
            </NavLink>
            <NavLink to="/recommendations" className={({ isActive }) => isActive ? activeClass : inactiveClass} title="Guidelines Advice">
              <Award size={18} />
              {!isCollapsed && <span>Guidelines Advice</span>}
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => isActive ? activeClass : inactiveClass} title="Screening History">
              <History size={18} />
              {!isCollapsed && <span>Screening History</span>}
            </NavLink>
            <NavLink to="/doctor" className={({ isActive }) => isActive ? activeClass : inactiveClass} title="Consult Doctor">
              <Stethoscope size={18} />
              {!isCollapsed && <span>Consult Doctor</span>}
            </NavLink>
            <NavLink to="/education" className={({ isActive }) => isActive ? activeClass : inactiveClass} title="Educational Hub">
              <BookOpen size={18} />
              {!isCollapsed && <span>Educational Hub</span>}
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? activeClass : inactiveClass} title="My Profile Settings">
              <User size={18} />
              {!isCollapsed && <span>My Profile Settings</span>}
            </NavLink>
          </>
        );
      case 'doctor':
        return (
          <>
            <NavLink to="/doctor-dashboard" className={({ isActive }) => isActive ? activeClass : inactiveClass} title="My Dashboard">
              <LayoutDashboard size={18} />
              {!isCollapsed && <span>My Dashboard</span>}
            </NavLink>
            <NavLink to="/education" className={({ isActive }) => isActive ? activeClass : inactiveClass} title="Educational Hub">
              <BookOpen size={18} />
              {!isCollapsed && <span>Educational Hub</span>}
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? activeClass : inactiveClass} title="My Profile Settings">
              <User size={18} />
              {!isCollapsed && <span>My Profile Settings</span>}
            </NavLink>
          </>
        );
      case 'admin':
        return (
          <>
            <NavLink to="/admin-dashboard" className={({ isActive }) => isActive ? activeClass : inactiveClass} title="My Dashboard">
              <LayoutDashboard size={18} />
              {!isCollapsed && <span>My Dashboard</span>}
            </NavLink>
            <NavLink to="/education" className={({ isActive }) => isActive ? activeClass : inactiveClass} title="Educational Hub">
              <BookOpen size={18} />
              {!isCollapsed && <span>Educational Hub</span>}
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? activeClass : inactiveClass} title="My Profile Settings">
              <User size={18} />
              {!isCollapsed && <span>My Profile Settings</span>}
            </NavLink>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <aside className={`${isCollapsed ? 'w-16 px-2' : 'w-64 p-4'} bg-white border-r border-slate-100 h-[calc(100vh-5rem)] fixed left-0 top-20 hidden md:flex flex-col justify-between shadow-sm z-30 transition-all duration-300`}>
      {/* Toggle button */}
      <button 
        onClick={onToggle}
        className="absolute top-4 -right-3 bg-white border border-slate-150 shadow-md rounded-full h-6 w-6 flex items-center justify-center z-50 hover:text-brand-pink-650 transition-colors focus:outline-none cursor-pointer"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Menu links */}
      <div className="space-y-1">
        {!isCollapsed && (
          <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {user.role} Navigation
          </div>
        )}
        {renderMenuItems()}
      </div>

      {/* Profile summary & Logout */}
      <div className={`space-y-4 pt-4 border-t border-slate-100 ${isCollapsed ? 'px-1' : ''}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 px-2'}`}>
          <div className="h-9 w-9 rounded-lg bg-brand-pink-50 border border-brand-pink-100/50 flex items-center justify-center text-brand-pink-650 font-bold text-sm overflow-hidden shrink-0">
            {user.role === 'doctor' && user.profile_picture ? (
              <img src={user.profile_picture} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              user.name?.charAt(0).toUpperCase()
            )}
          </div>
          {!isCollapsed && (
            <div className="truncate">
              {user.role === 'admin' && (
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Administrator</span>
              )}
              <span className="block text-xs font-bold text-slate-800 leading-none truncate">{user.name}</span>
              <span className="text-[10px] text-slate-400 capitalize font-semibold">{user.role} Portal</span>
            </div>
          )}
        </div>
        
        <button
          onClick={handleLogout}
          className={`flex items-center rounded-xl text-sm font-bold text-red-550 hover:bg-red-50 transition-all cursor-pointer focus:outline-none w-full ${isCollapsed ? 'justify-center py-3' : 'space-x-3 px-4 py-3'}`}
          title="Sign Out"
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
