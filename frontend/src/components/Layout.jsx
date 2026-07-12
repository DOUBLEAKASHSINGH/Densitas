import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Activity, User, LogOut, Trash2, Settings } from 'lucide-react';
import { auth } from '../firebase';
import { signOut, deleteUser } from 'firebase/auth';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Don't show header/footer on Auth Wall
  const isAuthPage = location.pathname === '/' || location.pathname === '/auth';

  const handleLogout = async () => {
    setIsProfileOpen(false);
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if(window.confirm("Are you sure you want to delete your account? All venue telemetry and settings will be permanently lost.")) {
      setIsProfileOpen(false);
      try {
        if (auth.currentUser) {
           await deleteUser(auth.currentUser);
        }
        navigate('/');
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Security protocol: Please sign out and sign back in to verify your credentials before deleting your account.");
      }
    }
  };

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
        <div className="w-full px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          
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
          
          {/* Profile Dropdown Container */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-colors ring-2 ring-transparent focus:ring-indigo-200"
            >
              <User size={20} />
            </button>

            {/* The Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 shadow-xl rounded-lg overflow-hidden flex flex-col z-50">
                {/* User Info Header */}
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-800">
                     {auth.currentUser?.displayName || 'Admin User'}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                     {auth.currentUser?.email || 'admin@optiflow.com'}
                  </p>
                  <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-700">
                    System Organiser
                  </div>
                </div>

                {/* Actions */}
                <div className="p-2 flex flex-col gap-1">
                  <button 
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate('/dashboard');
                    }}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <Settings size={16} />
                    Profile Settings
                  </button>

                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>

                  <div className="h-px bg-slate-100 my-1"></div>

                  <button 
                    onClick={handleDeleteAccount}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Main Content Area (Fills remaining height perfectly) */}
      <main className="flex-1 min-h-0 overflow-hidden relative">
        <Outlet />
      </main>

      {/* Global Footer (Fixed Height) */}
      <footer className="flex-none bg-white border-t border-slate-200 py-3 h-12">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-full flex flex-row justify-between items-center text-xs text-slate-500">
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
