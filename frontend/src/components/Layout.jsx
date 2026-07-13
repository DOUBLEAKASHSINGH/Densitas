import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Activity, User, LogOut, Trash2, Settings, Bell, X, MapPin } from 'lucide-react';
import { auth } from '../config/firebase';
import { signOut, deleteUser } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import { useLocationContext } from '../contexts/LocationContext';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  // Footer Overlay State
  const [showFooter, setShowFooter] = useState(true);
  const lastScrollY = useRef(0);

  const handleScroll = (e) => {
    const currentScrollY = e.target.scrollTop;
    // Buffer of 10px to avoid micro-scroll jitters
    if (currentScrollY > lastScrollY.current + 10) {
      setShowFooter(false);
      lastScrollY.current = currentScrollY;
    } else if (currentScrollY < lastScrollY.current - 10) {
      setShowFooter(true);
      lastScrollY.current = currentScrollY;
    }
  };

  const { currentUser } = useAuth();
  const { clearEventData } = useLocationContext();

  // Don't show header/footer on Auth Wall
  const isAuthPage = location.pathname === '/' || location.pathname === '/auth';

  const handleLogout = async () => {
    setIsProfileOpen(false);
    clearEventData();
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
            
            {/* Solutions Dropdown */}
            <div className="relative group h-full flex items-center">
              <button className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">Solutions ▾</button>
              <div className="absolute top-full left-0 pt-2 w-52 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                <div className="bg-white border border-slate-200 shadow-xl rounded-lg overflow-hidden flex flex-col">
                  <button onClick={() => navigate('/stadiums')} className="text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors border-b border-slate-100 cursor-pointer">Stadiums & Arenas</button>
                  <button onClick={() => navigate('/transit')} className="text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors border-b border-slate-100 cursor-pointer">Transit Hubs</button>
                  <button onClick={() => navigate('/convention')} className="text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors cursor-pointer">Convention Centers</button>
                </div>
              </div>
            </div>

            <button onClick={() => navigate('/about')} className={`text-sm font-medium ${location.pathname === '/about' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'} transition-colors cursor-pointer`}>About Us</button>
            <button onClick={() => navigate('/docs')} className={`text-sm font-medium ${location.pathname === '/docs' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'} transition-colors cursor-pointer`}>Documentation</button>
            
            {/* Resources Dropdown */}
            <div className="relative group h-full flex items-center">
              <button className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">Resources ▾</button>
              <div className="absolute top-full left-0 pt-2 w-52 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                <div className="bg-white border border-slate-200 shadow-xl rounded-lg overflow-hidden flex flex-col">
                  <button onClick={() => navigate('/api-docs')} className="text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors border-b border-slate-100 cursor-pointer">API Documentation</button>
                  <button onClick={() => navigate('/case-studies')} className="text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors border-b border-slate-100 cursor-pointer">Case Studies</button>
                  <button onClick={() => navigate('/status')} className="text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors cursor-pointer">System Status</button>
                </div>
              </div>
            </div>
          </nav>
          
          {/* Profile & Notifications Container */}
          <div className="flex items-center space-x-4">
            
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors relative cursor-pointer"
              >
                <Bell size={20} />
                {hasUnreadNotifications && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">3</span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-4 w-80 bg-white border border-slate-200 shadow-xl rounded-lg overflow-hidden flex flex-col z-50">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <p className="text-sm font-bold text-slate-800">System Alerts</p>
                    <button 
                      onClick={() => setHasUnreadNotifications(false)}
                      className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 transition-colors cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="flex flex-col max-h-64 overflow-y-auto">
                    <div className="px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                      <p className="text-xs font-semibold text-slate-800 mb-1">Status: NORMAL</p>
                      <p className="text-xs text-slate-600">Zone C (South Pavilion) capacity normalized. Guard units returning to standby.</p>
                      <p className="text-[10px] text-slate-400 mt-1">2 mins ago</p>
                    </div>
                    <div className="px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                      <p className="text-xs font-semibold text-slate-800 mb-1">System Update</p>
                      <p className="text-xs text-slate-600">XGBoost model weights refreshed. Accuracy drift corrected.</p>
                      <p className="text-[10px] text-slate-400 mt-1">15 mins ago</p>
                    </div>
                    <div className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer">
                      <p className="text-xs font-semibold text-slate-800 mb-1">Configuration</p>
                      <p className="text-xs text-slate-600">New Venue Added: Wankhede Stadium, Mumbai.</p>
                      <p className="text-[10px] text-slate-400 mt-1">1 hour ago</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button 
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationsOpen(false);
              }}
              className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-colors ring-2 ring-transparent focus:ring-indigo-200 cursor-pointer"
            >
              <User size={20} />
            </button>

            {/* The Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 shadow-xl rounded-lg overflow-hidden flex flex-col z-50">
                {/* User Info Header */}
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-800">
                     {currentUser?.name || "Anonymous User"}
                  </p>
                  <p className="text-xs text-slate-500 font-medium truncate">
                     {currentUser?.email || "No email available"}
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
                      navigate('/select-location');
                    }}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <MapPin size={16} />
                    Change Location
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
      <main 
        onScroll={handleScroll}
        className={`flex-1 overflow-y-auto relative ${location.pathname.includes('/dashboard') ? 'p-0' : 'p-4 sm:p-8 pb-32 sm:pb-32'}`}
      >
        <Outlet />
      </main>

      {/* Global Footer Overlay */}
      <footer className={`fixed bottom-0 left-0 w-full z-40 bg-white/80 backdrop-blur-md border-t border-slate-200/50 py-6 transition-transform duration-300 ease-in-out ${showFooter ? 'translate-y-0' : 'translate-y-[100%]'}`}>
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
                <li><span onClick={() => navigate('/features')} className="cursor-pointer hover:text-indigo-600 transition-colors">Features</span></li>
                <li><span onClick={() => navigate('/integrations')} className="cursor-pointer hover:text-indigo-600 transition-colors">Integrations</span></li>
                <li><span onClick={() => navigate('/pricing')} className="cursor-pointer hover:text-indigo-600 transition-colors">Pricing</span></li>
              </ul>
            </div>
            
            {/* Column 3 */}
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-2 text-slate-500 text-xs">
                <li><span onClick={() => navigate('/about')} className="cursor-pointer hover:text-indigo-600 transition-colors">About Us</span></li>
                <li><span onClick={() => navigate('/careers')} className="cursor-pointer hover:text-indigo-600 transition-colors">Careers</span></li>
                <li><span onClick={() => navigate('/blog')} className="cursor-pointer hover:text-indigo-600 transition-colors">Blog</span></li>
              </ul>
            </div>
            
            {/* Column 4 */}
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-500 text-xs">
                <li><span onClick={() => navigate('/privacy')} className="cursor-pointer hover:text-indigo-600 transition-colors">Privacy Policy</span></li>
                <li><span onClick={() => navigate('/terms')} className="cursor-pointer hover:text-indigo-600 transition-colors">Terms of Service</span></li>
                <li><span onClick={() => navigate('/security')} className="cursor-pointer hover:text-indigo-600 transition-colors">Security</span></li>
              </ul>
            </div>
          </div>
          <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-8 pt-8 border-t border-slate-100 text-xs text-slate-400 text-center">
            &copy; 2026 OptiFlow Systems. All rights reserved.
          </div>
        </footer>

    </div>
  );
}
