import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StadiumMap from '../components/StadiumMap';
import { Activity, LogOut, MapPin, Coffee, Bath, Shirt, Bell } from 'lucide-react';

export default function AttendeeDashboard() {
  const navigate = useNavigate();
  const [zoneStates, setZoneStates] = useState({});
  const [toast, setToast] = useState(null);

  // Facility wait times (in minutes)
  const [facilities, setFacilities] = useState({
    food: 12,
    restroom: 5,
    merch: 25
  });

  // Simulated GPS Location for the Attendee (Zone A / North Entrance)
  const USER_LOCATION = [17.4070, 78.5538];

  useEffect(() => {
    const zones = ['A', 'B', 'C', 'D'];
    const offsets = { 'A': 0, 'B': Math.PI / 2, 'C': Math.PI, 'D': 3 * Math.PI / 2 };
    
    let lastAlertedZone = null;

    const interval = setInterval(() => {
      const nowMs = Date.now();
      const currentCapacities = {};
      
      zones.forEach(z => {
        const freq = (2 * Math.PI) / 60000;
        let cap = 67.5 + 27.5 * Math.sin(nowMs * freq + offsets[z]);
        cap += (Math.random() - 0.5) * 4;
        currentCapacities[z] = Math.max(0, Math.min(100, cap));
        
        // Push Notification Logic
        if (currentCapacities[z] > 80 && lastAlertedZone !== z) {
          lastAlertedZone = z;
          setToast(`Avoid Zone ${z}! High congestion detected.`);
          setTimeout(() => setToast(null), 5000);
        }
      });

      // Fluctuate wait times organically
      setFacilities(prev => ({
        food: Math.max(2, prev.food + Math.floor((Math.random() - 0.5) * 4)),
        restroom: Math.max(1, prev.restroom + Math.floor((Math.random() - 0.5) * 2)),
        merch: Math.max(5, prev.merch + Math.floor((Math.random() - 0.5) * 6))
      }));

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
      
      {/* Crowd Push Alert Toast */}
      {toast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[9999] animate-bounce">
          <div className="bg-red-500/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3 border border-red-400">
            <Bell size={18} className="animate-pulse" />
            <span className="font-bold tracking-wide text-sm">{toast}</span>
          </div>
        </div>
      )}

      <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-800 bg-[#111827]/80 backdrop-blur-md shrink-0 shadow-md z-[100]">
        <div className="flex items-center space-x-3 w-1/3">
          <Activity className="text-blue-500 animate-pulse" size={26} />
          <h1 className="text-2xl font-bold tracking-widest text-white uppercase">
            OptiFlow
          </h1>
          <span className="bg-blue-500/10 text-blue-500 border border-blue-500 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-widest ml-2">ATTENDEE</span>
        </div>

        <div className="flex-1 flex justify-center space-x-8">
           <button className="text-sm font-medium text-blue-500 transition-colors">Live Map</button>
           <button onClick={() => navigate('/about')} className="text-sm font-medium text-gray-400 transition-colors hover:text-white">Event Info</button>
           <button onClick={() => navigate('/docs')} className="text-sm font-medium text-gray-400 transition-colors hover:text-white">Help</button>
        </div>

        <div className="flex items-center justify-end space-x-4 w-1/3">
          <button 
            onClick={() => navigate('/select')}
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-md text-sm transition-all"
          >
            <LogOut size={16} />
            <span>Leave Event</span>
          </button>
        </div>
      </nav>

      <div className="flex-1 p-6 z-30 relative overflow-hidden flex gap-6">
        
        {/* Left Side: Smart Facility Tickers */}
        <div className="w-1/4 flex flex-col gap-4">
          <div className="bg-[#111827] border border-gray-800 p-4 rounded-xl flex items-center space-x-3">
             <div className="bg-gray-800 p-3 rounded-full">
               <MapPin className="text-blue-500" size={24} />
             </div>
             <div>
               <p className="text-xs text-gray-500 font-bold tracking-wider">YOUR LOCATION</p>
               <p className="text-white font-bold text-lg">North Pavilion</p>
             </div>
          </div>

          <div className="bg-[#111827] border border-gray-800 p-4 rounded-xl flex-1 flex flex-col">
             <h3 className="text-gray-400 font-bold text-sm tracking-wider mb-6 border-b border-gray-800 pb-2">NEARBY AMENITIES</h3>
             
             <div className="flex-1 flex flex-col justify-around">
               {/* Food */}
               <div className="flex flex-col mb-4">
                 <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center space-x-3">
                     <Coffee className="text-gray-400" size={20} />
                     <span className="text-gray-300">Food Court A</span>
                   </div>
                   <div className={`font-bold font-mono text-sm ${facilities.food > 15 ? 'text-red-500' : 'text-green-500'}`}>
                     {facilities.food}m wait
                   </div>
                 </div>
                 <div className="w-full bg-gray-900 rounded-full h-2">
                   <div className={`h-2 rounded-full transition-all duration-1000 ${facilities.food > 15 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: \`\${Math.min(100, (facilities.food / 30) * 100)}%\` }}></div>
                 </div>
               </div>

               {/* Restroom */}
               <div className="flex flex-col mb-4">
                 <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center space-x-3">
                     <Bath className="text-gray-400" size={20} />
                     <span className="text-gray-300">Restroom (North)</span>
                   </div>
                   <div className={`font-bold font-mono text-sm ${facilities.restroom > 10 ? 'text-red-500' : 'text-green-500'}`}>
                     {facilities.restroom}m wait
                   </div>
                 </div>
                 <div className="w-full bg-gray-900 rounded-full h-2">
                   <div className={`h-2 rounded-full transition-all duration-1000 ${facilities.restroom > 10 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: \`\${Math.min(100, (facilities.restroom / 15) * 100)}%\` }}></div>
                 </div>
               </div>

               {/* Merch */}
               <div className="flex flex-col">
                 <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center space-x-3">
                     <Shirt className="text-gray-400" size={20} />
                     <span className="text-gray-300">Official Merch</span>
                   </div>
                   <div className={`font-bold font-mono text-sm ${facilities.merch > 20 ? 'text-red-500' : 'text-yellow-500'}`}>
                     {facilities.merch}m wait
                   </div>
                 </div>
                 <div className="w-full bg-gray-900 rounded-full h-2">
                   <div className={`h-2 rounded-full transition-all duration-1000 ${facilities.merch > 20 ? 'bg-red-500' : 'bg-yellow-500'}`} style={{ width: \`\${Math.min(100, (facilities.merch / 40) * 100)}%\` }}></div>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Right Side: Localized Map */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#111827] border border-gray-800 rounded-xl p-4">
          <div className="mb-4">
              <h2 className="text-xl font-bold text-white">Live Evacuation & Capacity Map</h2>
              <p className="text-gray-400 text-sm">Follow the blue routing line to safety if your area turns red.</p>
          </div>
          <div className="flex-1 min-h-0">
              <StadiumMap zoneStates={zoneStates} userLocation={USER_LOCATION} customZoom={18} />
          </div>
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
