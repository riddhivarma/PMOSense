// frontend/src/layouts/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { ArrowUp } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function MainLayout({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const isPublicRoute = ['/', '/about', '/contact'].includes(location.pathname);
  const showSidebar = user && !isPublicRoute;

  // Monitor scroll height to toggle the 'Scroll to Top' button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen relative bg-slate-50/50">
      {/* 1. Header Navigation */}
      <Navbar />
      
      {/* 2. Core Body Layout */}
      <div className={`flex flex-1 w-full transition-all duration-300 ease-in-out ${showSidebar ? (isCollapsed ? 'md:pl-16 max-w-none' : 'md:pl-64 max-w-none') : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
        {/* Render Sidebar only for logged-in panels */}
        {showSidebar && <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />}
        
        {/* Main Content Pane */}
        <main className="flex-1 min-h-[calc(100vh-10rem)] p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* 3. Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 h-10 w-10 rounded-full bg-brand-pink-500 hover:bg-brand-pink-600 text-white flex items-center justify-center shadow-lg hover:-translate-y-1 active:scale-95 transition-all cursor-pointer focus:outline-none"
          title="Scroll to Top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
