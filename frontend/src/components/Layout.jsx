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
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  // Footer state removed for standard document flow

  const { currentUser } = useAuth();
  const { clearEventData, eventData } = useLocationContext();

  // Don't show header/footer on Auth Wall
  const isAuthPage = location.pathname === '/' || location.pathname === '/auth' || location.pathname === '/profile';

  if (isAuthPage) {
    return (
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-50">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50 font-sans text-slate-800 selection:bg-indigo-100">
      
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
            {eventData && (
              <button
                onClick={() => {
                  clearEventData();
                  navigate('/select-location');
                }}
                className="flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors mr-2 cursor-pointer"
              >
                <MapPin size={16} className="mr-1" />
                Change Event
              </button>
            )}

            <div className="relative">
              <button 
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
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
                onClick={() => navigate('/profile')}
                className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-colors ring-2 ring-transparent focus:ring-indigo-200 cursor-pointer overflow-hidden"
              >
                {currentUser?.photoURL ? (
                  <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={20} />
                )}
              </button>
            </div>
            
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col w-full ${location.pathname.includes('/dashboard') ? 'p-0' : 'p-4 sm:p-8'}`}>
        <Outlet />
      </main>

      <footer className="w-full mt-auto bg-white border-t border-slate-200/50 py-8">
          <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 text-sm">
            
            {/* Column 1: About OptiFlow */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Activity className="text-indigo-600" size={20} />
                <span className="font-bold text-slate-900">OptiFlow</span>
              </div>
              <p className="text-slate-500 text-xs mb-4 leading-relaxed">
                OptiFlow is an enterprise crowd management platform that leverages live spatial telemetry and predictive AI to prevent critical congestion before it occurs. Built for absolute safety at scale.
              </p>
              <div className="flex items-center space-x-2 text-xs">
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                 <span className="text-slate-600 font-semibold">Status: Operational</span>
              </div>
            </div>
            
            {/* Column 2: Platform */}
            <div>
              <h4 className="font-bold text-slate-900 mb-4 uppercase text-[10px] tracking-wider text-slate-400">Platform</h4>
              <ul className="space-y-2 text-slate-600 text-xs font-medium">
                <li><span className="cursor-pointer hover:text-indigo-600 transition-colors">Dashboard</span></li>
                <li><span className="cursor-pointer hover:text-indigo-600 transition-colors">Incident Monitoring</span></li>
                <li><span className="cursor-pointer hover:text-indigo-600 transition-colors">Predictive Analytics</span></li>
                <li><span className="cursor-pointer hover:text-indigo-600 transition-colors">Crowd Flow Insights</span></li>
                <li><span className="cursor-pointer hover:text-indigo-600 transition-colors">Reports</span></li>
              </ul>
            </div>

            {/* Column 3: Support */}
            <div>
              <h4 className="font-bold text-slate-900 mb-4 uppercase text-[10px] tracking-wider text-slate-400">Support</h4>
              <ul className="space-y-2 text-slate-600 text-xs font-medium">
                <li><span className="cursor-pointer hover:text-indigo-600 transition-colors">Documentation</span></li>
                <li><span className="cursor-pointer hover:text-indigo-600 transition-colors">Deployment Guide</span></li>
                <li><span className="cursor-pointer hover:text-indigo-600 transition-colors">Contact Support</span></li>
                <li><span className="cursor-pointer hover:text-indigo-600 transition-colors">FAQs</span></li>
                <li><span className="cursor-pointer hover:text-indigo-600 transition-colors">Community</span></li>
              </ul>
            </div>
            
            {/* Column 4: Technology */}
            <div>
              <h4 className="font-bold text-slate-900 mb-4 uppercase text-[10px] tracking-wider text-slate-400">Technology</h4>
              <ul className="space-y-2 text-slate-600 text-xs font-medium">
                <li><span className="cursor-pointer hover:text-indigo-600 transition-colors">React</span></li>
                <li><span className="cursor-pointer hover:text-indigo-600 transition-colors">FastAPI</span></li>
                <li><span className="cursor-pointer hover:text-indigo-600 transition-colors">WebSockets</span></li>
                <li><span className="cursor-pointer hover:text-indigo-600 transition-colors">Leaflet Maps</span></li>
                <li><span className="cursor-pointer hover:text-indigo-600 transition-colors">Machine Learning</span></li>
                <li><span className="cursor-pointer hover:text-indigo-600 transition-colors">Edge Computing</span></li>
              </ul>
            </div>
            
            {/* Column 5: Company & Legal */}
            <div>
              <h4 className="font-bold text-slate-900 mb-4 uppercase text-[10px] tracking-wider text-slate-400">Company</h4>
              <ul className="space-y-2 text-slate-600 text-xs font-medium mb-6">
                <li><span className="cursor-pointer hover:text-indigo-600 transition-colors">Project Vision</span></li>
                <li><span className="cursor-pointer hover:text-indigo-600 transition-colors">Architecture</span></li>
                <li><span className="cursor-pointer hover:text-indigo-600 transition-colors">GitHub Repository</span></li>
                <li><span className="cursor-pointer hover:text-indigo-600 transition-colors">Hackathon Project</span></li>
                <li><span className="cursor-pointer hover:text-indigo-600 transition-colors">Team</span></li>
              </ul>
              <h4 className="font-bold text-slate-900 mb-4 uppercase text-[10px] tracking-wider text-slate-400">Legal</h4>
              <ul className="space-y-2 text-slate-600 text-xs font-medium flex gap-3">
                <li><span className="cursor-pointer hover:text-indigo-600 transition-colors">Privacy</span></li>
                <li><span className="cursor-pointer hover:text-indigo-600 transition-colors">Terms</span></li>
                <li><span className="cursor-pointer hover:text-indigo-600 transition-colors">License</span></li>
              </ul>
            </div>

          </div>
          <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-100 text-[10px] text-slate-400 text-center font-medium">
            &copy; 2026 OptiFlow Systems &bull; Disclaimer: This platform is a hackathon prototype. Do not use for actual life-safety environments without certification.
          </div>
        </footer>

    </div>
  );
}
