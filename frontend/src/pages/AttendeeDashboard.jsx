import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StadiumMap from '../components/StadiumMap';
import { Activity, LogOut } from 'lucide-react';

export default function AttendeeDashboard() {
  const navigate = useNavigate();
  const [zoneStates, setZoneStates] = useState({});

  useEffect(() => {
    // Simple mock data for attendees (no complex pipeline needed)
    const zones = ['A', 'B', 'C', 'D'];
    const offsets = { 'A': 0, 'B': Math.PI / 2, 'C': Math.PI, 'D': 3 * Math.PI / 2 };
    
    const interval = setInterval(() => {
      const nowMs = Date.now();
      const currentCapacities = {};
      
      zones.forEach(z => {
        const freq = (2 * Math.PI) / 60000;
        let cap = 67.5 + 27.5 * Math.sin(nowMs * freq + offsets[z]);
        cap += (Math.random() - 0.5) * 4;
        currentCapacities[z] = Math.max(0, Math.min(100, cap));
      });

      setZoneStates(prev => {
         const newStates = { ...prev };
         zones.forEach(z => {
           newStates[z] = {
             current_capacity_pct: currentCapacities[z],
             predicted_capacity_pct_5m: currentCapacities[z] + 5,
           }
         });
         return newStates;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen bg-[#030712] text-gray-100 font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col relative">
      
      <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-800 bg-[#111827]/80 backdrop-blur-md shrink-0 shadow-md z-[100]">
        <div className="flex items-center space-x-3 w-1/4">
          <Activity className="text-blue-500 animate-pulse" size={26} />
          <h1 className="text-2xl font-bold tracking-widest text-white uppercase">
            OptiFlow <span className="text-gray-500 font-light text-lg">Public</span>
          </h1>
        </div>

        <div className="flex-1 flex justify-center space-x-8">
           <button className="text-sm font-medium text-blue-500 transition-colors">Live Map</button>
           <button className="text-sm font-medium text-gray-400 transition-colors hover:text-white">Event Info</button>
           <button className="text-sm font-medium text-gray-400 transition-colors hover:text-white">Help</button>
        </div>
        
        <div className="flex items-center justify-end space-x-4 w-1/4">
          <button 
            onClick={() => navigate('/select')}
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-md text-sm transition-all"
          >
            <LogOut size={16} />
            <span>Leave Event</span>
          </button>
        </div>
      </nav>

      <div className="flex-1 p-6 z-30 relative overflow-hidden flex flex-col">
        <div className="mb-4">
            <h2 className="text-xl font-bold text-white">Live Evacuation & Capacity Map</h2>
            <p className="text-gray-400 text-sm">Follow the cyan routing lines if your zone turns red.</p>
        </div>
        <div className="flex-1 min-h-0">
             <StadiumMap zoneStates={zoneStates} />
        </div>
      </div>

      <footer className="flex justify-between items-center px-8 py-3 bg-[#0a0f1c] border-t border-gray-800 shrink-0 text-xs text-gray-500 z-40">
        <div>&copy; 2026 OptiFlow Systems. Public View.</div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}
