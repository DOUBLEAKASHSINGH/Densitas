import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Activity, User } from 'lucide-react';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show header/footer on Auth Wall
  const isAuthPage = location.pathname === '/' || location.pathname === '/auth';

  if (isAuthPage) {
    return (
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-50">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-50 font-sans text-slate-800 selection:bg-indigo-100">
      
      {/* Global Header (Fixed Height) */}
      <header className="flex-none bg-white border-b border-slate-200 z-50 shadow-sm h-16">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <Activity className="text-indigo-600" size={24} />
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">OptiFlow</h1>
          </div>
          
          {/* Nav Links */}
          <nav className="hidden md:flex space-x-8">
            <button onClick={() => navigate('/dashboard')} className={`text-sm font-medium ${location.pathname.includes('/dashboard') ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'} transition-colors`}>Dashboard</button>
            <button onClick={() => navigate('/about')} className={`text-sm font-medium ${location.pathname === '/about' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'} transition-colors`}>About Us</button>
            <button onClick={() => navigate('/docs')} className={`text-sm font-medium ${location.pathname === '/docs' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'} transition-colors`}>Documentation</button>
          </nav>
          
          {/* Profile */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-200 cursor-pointer" title="Profile Settings" onClick={() => navigate('/')}>
              <User size={16} />
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Area (Fills remaining height perfectly) */}
      <main className="flex-1 min-h-0 overflow-hidden relative">
        <Outlet />
      </main>

      {/* Global Footer (Fixed Height) */}
      <footer className="flex-none bg-white border-t border-slate-200 py-3 h-12">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-row justify-between items-center text-xs text-slate-500">
          <div>&copy; 2026 OptiFlow Systems. All rights reserved.</div>
          <div className="flex items-center space-x-6">
             <div className="flex items-center space-x-2">
               <span className="w-2 h-2 rounded-full bg-green-500"></span>
               <span>Status: Operational</span>
             </div>
             <a href="#" className="hover:text-slate-800 transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-slate-800 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
