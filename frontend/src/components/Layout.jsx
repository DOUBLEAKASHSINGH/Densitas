import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Activity, User, LogOut, Trash2, Settings, Bell, X } from 'lucide-react';
import { auth } from '../firebase';
import { signOut, deleteUser } from 'firebase/auth';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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
    <div className="h-screen w-screen flex flex-col bg-slate-50 font-sans text-slate-800 selection:bg-indigo-100">
      
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
            <button className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Solutions ▾</button>
            <button onClick={() => navigate('/about')} className={`text-sm font-medium ${location.pathname === '/about' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'} transition-colors`}>About Us</button>
            <button onClick={() => navigate('/docs')} className={`text-sm font-medium ${location.pathname === '/docs' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'} transition-colors`}>Documentation</button>
            <button className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Resources</button>
          </nav>
          
          {/* Profile & Notifications Container */}
          <div className="flex items-center space-x-4">
            
            <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

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
                      setIsProfileModalOpen(true);
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

        </div>
      </header>

      {/* Main Content Area */}
      <main className={`flex-1 overflow-y-auto relative ${location.pathname.includes('/dashboard') ? 'p-0' : 'p-4 sm:p-8'}`}>
        <Outlet />
      </main>

      {/* Global Footer */}
      <footer className="flex-none bg-white border-t border-slate-200 py-8">
          <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
            {/* Column 1 */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Activity className="text-indigo-600" size={20} />
                <span className="font-bold text-slate-900">OptiFlow</span>
              </div>
              <p className="text-slate-500 text-xs mb-4">Spatial intelligence and crowd orchestration for high-density environments.</p>
              <div className="flex items-center space-x-2 text-xs">
                 <span className="w-2 h-2 rounded-full bg-green-500"></span>
                 <span className="text-slate-600">Status: Operational</span>
              </div>
            </div>
            
            {/* Column 2 */}
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-2 text-slate-500 text-xs">
                <li><button onClick={(e) => { e.preventDefault(); navigate('/about'); }} className="hover:text-indigo-600 transition-colors">Features</button></li>
                <li><button onClick={(e) => { e.preventDefault(); navigate('/docs'); }} className="hover:text-indigo-600 transition-colors">Integrations</button></li>
                <li><button onClick={(e) => { e.preventDefault(); navigate('/about'); }} className="hover:text-indigo-600 transition-colors">Pricing</button></li>
              </ul>
            </div>
            
            {/* Column 3 */}
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-2 text-slate-500 text-xs">
                <li><button onClick={() => navigate('/about')} className="hover:text-indigo-600 transition-colors">About Us</button></li>
                <li><button onClick={(e) => { e.preventDefault(); navigate('/about'); }} className="hover:text-indigo-600 transition-colors">Careers</button></li>
                <li><button onClick={(e) => { e.preventDefault(); navigate('/about'); }} className="hover:text-indigo-600 transition-colors">Blog</button></li>
              </ul>
            </div>
            
            {/* Column 4 */}
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-500 text-xs">
                <li><button onClick={(e) => { e.preventDefault(); navigate('/docs'); }} className="hover:text-indigo-600 transition-colors">Privacy Policy</button></li>
                <li><button onClick={(e) => { e.preventDefault(); navigate('/docs'); }} className="hover:text-indigo-600 transition-colors">Terms of Service</button></li>
                <li><button onClick={(e) => { e.preventDefault(); navigate('/docs'); }} className="hover:text-indigo-600 transition-colors">Security</button></li>
              </ul>
            </div>
          </div>
          <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-8 pt-8 border-t border-slate-100 text-xs text-slate-400 text-center">
            &copy; 2026 OptiFlow Systems. All rights reserved.
          </div>
        </footer>

      {/* Profile Settings Modal Overlay */}
      {isProfileModalOpen && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 flex flex-col">
            
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Settings size={20} className="text-indigo-600" />
                Profile Settings
              </h3>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                <input type="text" defaultValue={auth.currentUser?.displayName || 'Admin User'} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                <input type="email" disabled defaultValue={auth.currentUser?.email || 'admin@optiflow.com'} className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">Notification Preferences</label>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                  SMS Alerts on Critical Congestion
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer mt-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                  Weekly Analytical Email Reports
                </label>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setIsProfileModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors">
                Cancel
              </button>
              <button onClick={() => setIsProfileModalOpen(false)} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors">
                Save Preferences
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
