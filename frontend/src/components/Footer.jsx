// frontend/src/components/Footer.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartPulse, AlertTriangle, ExternalLink } from 'lucide-react';

export default function Footer() {
  const { user } = useAuth();
  const location = useLocation();

  // Paths that should display the large footer
  const showBigFooterPaths = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/about', '/contact'];
  const isBigFooter = showBigFooterPaths.includes(location.pathname);

  const isPublicRoute = ['/', '/about', '/contact'].includes(location.pathname);
  const showSidebar = user && !isPublicRoute;

  if (!isBigFooter) {
    // Return small footer
    return (
      <footer className={`bg-white/90 border-t border-pink-200/50 mt-16 py-6 transition-all ${showSidebar ? 'md:pl-64 w-full' : ''}`}>
        <div className={`px-4 sm:px-6 lg:px-8 ${showSidebar ? 'max-w-none' : 'max-w-7xl mx-auto'}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-semibold gap-2">
            <p>&copy; 2026 PMOSense. All rights reserved.</p>
            <p>Designed for awareness and health education.</p>
          </div>
        </div>
      </footer>
    );
  }

  // Return big footer
  return (
    <footer className="bg-white/90 border-t border-pink-200/50 mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand & Description */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-pink-500/25">
                <HeartPulse size={18} />
              </div>
              <span className="font-outfit text-2xl font-extrabold tracking-tight text-slate-800">
                PMO<span className="text-pink-500 font-serif italic">Sense</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-550 leading-relaxed font-medium">
              Intelligent technology supporting awareness, screening, and dietary management of Polyendocrine Metabolic Ovarian Syndrome (PMOS).
            </p>

            {/* Medical Alert Disclaimer Box */}
            <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-150 text-pink-900 text-xs flex items-start space-x-3">
              <AlertTriangle className="text-pink-600 shrink-0 mt-0.5" size={18} />
              <div className="leading-relaxed font-medium">
                <strong>Medical Disclaimer:</strong> PMOSense does not provide formal medical diagnoses. All information, scores, and dietary recommendations are for informational and educational purposes. Always consult a licensed medical professional for diagnoses, treatment, and hormone panel testing.
              </div>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-outfit font-extrabold text-slate-900 text-sm tracking-wider uppercase">Navigation</h4>
            <ul className="space-y-2 text-xs font-bold text-slate-500">
              <li>
                <Link to="/" className="hover:text-pink-600 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/education" className="hover:text-pink-600 transition-colors">PMOS Education Pathways</Link>
              </li>
              <li>
                <Link to="/assessment" className="hover:text-pink-600 transition-colors">Risk Screener</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-pink-600 transition-colors">User & Doctor Sign In</Link>
              </li>
            </ul>
          </div>

          {/* External Clinical Resources */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-outfit font-extrabold text-slate-900 text-sm tracking-wider uppercase">Clinical Resources</h4>
            <ul className="space-y-2.5 text-xs font-bold text-slate-500">
              <li>
                <a 
                  href="https://www.womenshealth.gov/a-z-topics/polycystic-ovary-syndrome" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-pink-600 transition-colors inline-flex items-center space-x-1.5"
                >
                  <span>HHS Women's Health Guidelines</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.endocrine.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-pink-600 transition-colors inline-flex items-center space-x-1.5"
                >
                  <span>Endocrine Society Research</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.jeanhailes.org.au/health-a-z/pmos" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-pink-600 transition-colors inline-flex items-center space-x-1.5"
                >
                  <span>Jean Hailes PMOS Support</span>
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Admin Login Link - Homepage Only */}
        {location.pathname === '/' && (
          <div className="flex justify-center text-xs text-slate-550 font-medium pt-2">
            <Link 
              to="/admin-login" 
              className="inline-flex items-center space-x-1.5 hover:text-rose-600 transition-colors bg-slate-50/80 border border-slate-150/80 px-4 py-2 rounded-full shadow-sm hover:shadow-md"
            >
              <span>🛡️ Are you an Administrator?</span>
              <span className="font-extrabold text-rose-500 hover:underline">Login here</span>
            </Link>
          </div>
        )}

        {/* Bottom Disclaimer */}
        <div className="border-t border-slate-150 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-semibold gap-2">
          <p>&copy; 2026 PMOSense. All rights reserved.</p>
          <p>Designed for awareness and health education.</p>
        </div>

      </div>
    </footer>
  );
}
