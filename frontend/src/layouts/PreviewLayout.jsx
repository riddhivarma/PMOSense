// frontend/src/layouts/PreviewLayout.jsx
import React, { useState } from 'react';
import { HeartPulse, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '../components/Footer';

export default function PreviewLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex flex-col min-h-screen relative bg-slate-50/50">
      {/* Empty Navbar */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-pink-200/40 shadow-sm transition-all">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between max-w-none">
          {/* Brand Logo */}
          <div className="flex items-center space-x-2.5">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-pink-500/25">
              <HeartPulse size={20} className="animate-pulse" />
            </div>
            <span className="font-outfit text-2xl font-extrabold tracking-tight text-slate-800">
              PMO<span className="text-pink-500 font-serif italic">Sense</span>
            </span>
          </div>
        </div>
      </header>

      {/* Core Body Layout with Sidebar */}
      <div className={`flex flex-1 w-full transition-all duration-300 ease-in-out ${isCollapsed ? 'md:pl-16' : 'md:pl-64'} max-w-none`}>
        {/* User Preview Sidebar */}
        <aside className={`${isCollapsed ? 'w-16 px-2' : 'w-64 p-4'} bg-white border-r border-slate-100 h-[calc(100vh-5rem)] fixed left-0 top-20 hidden md:flex flex-col justify-between shadow-sm z-30 transition-all duration-300`}>
          {/* Toggle button */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute top-4 -right-3 bg-white border border-slate-150 shadow-md rounded-full h-6 w-6 flex items-center justify-center z-50 hover:text-brand-pink-650 transition-colors focus:outline-none cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          {/* Menu links - Only Educational Hub */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                User Navigation
              </div>
            )}
            
            {/* Active Educational Hub link */}
            <div 
              className={`flex items-center ${isCollapsed ? 'justify-center py-3' : 'space-x-3 px-4 py-3'} rounded-xl text-sm font-bold bg-brand-pink-50 text-brand-pink-600 shadow-sm border border-brand-pink-100/50 transition-all cursor-pointer`}
              title="Educational Hub"
            >
              <BookOpen size={18} />
              {!isCollapsed && <span>Educational Hub</span>}
            </div>
          </div>

          {/* Bottom container is empty: no profile summary, no logout button */}
          <div></div>
        </aside>

        {/* Main Content Pane */}
        <main className="flex-1 min-h-[calc(100vh-10rem)] p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
