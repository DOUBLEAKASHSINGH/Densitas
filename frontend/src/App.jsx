import React, { useState, useEffect, useRef } from 'react';
import StadiumMap from './components/StadiumMap';
import OccupancyChart from './components/OccupancyChart';
import AgentTerminal from './components/AgentTerminal';
import { Activity, Database, User, LogIn, Settings } from 'lucide-react';

function App() {
  const [zoneStates, setZoneStates] = useState({});
  const [chartData, setChartData] = useState([]);
  const [logs, setLogs] = useState([]);
  
  const [wsStatus, setWsStatus] = useState('Connecting...');
  const [mockMode, setMockMode] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // MOCK DATA ENGINE
  useEffect(() => {
    let mockInterval;
    if (mockMode) {
      setWsStatus('MOCKED (Local)');
      // Generate some seed state for zones A, B, C, D
      const zones = ['A', 'B', 'C', 'D'];
      let capacities = { 'A': 40, 'B': 60, 'C': 85, 'D': 30 };
      
      mockInterval = setInterval(() => {
        const now = new Date().toISOString();
        const timeStr = now.split('T')[1].substring(0, 8);
        
        // Pick a random zone to update heavily, others drift
        const targetZone = zones[Math.floor(Math.random() * zones.length)];
        
        zones.forEach(z => {
          let drift = (Math.random() - 0.5) * 5; // -2.5 to 2.5
          if (z === targetZone) drift += (Math.random() * 10); // Spikes
          
          capacities[z] = Math.max(0, Math.min(100, capacities[z] + drift));
        });

        const targetCap = capacities[targetZone];
        const predictedCap = Math.min(100, targetCap + (Math.random() * 15));
        
        let action = "None";
        if (targetCap > 90) action = "CRITICAL: Open Emergency Exits and Dispatch 5 Guards";
        else if (targetCap > 75) action = "WARNING: Rerouting traffic from Zone " + targetZone;
        
        const data = {
          timestamp: now,
          zone_id: targetZone,
          current_capacity_pct: targetCap,
          predicted_capacity_pct_5m: predictedCap,
          action_required: action
        };

        // 1. Map State
        setZoneStates(prev => {
           const newStates = { ...prev };
           zones.forEach(z => {
             newStates[z] = {
               current_capacity_pct: capacities[z],
               predicted_capacity_pct_5m: capacities[z] + 5,
             }
           });
           return newStates;
        });

        // 2. Chart Data
        setChartData(prev => {
          const newData = [...prev, {
            time: timeStr,
            current: targetCap,
            predicted: predictedCap,
            zone: targetZone
          }];
          return newData.slice(-30);
        });

        // 3. Logs
        setLogs(prev => {
          const newLogs = [...prev, {
            timestamp: data.timestamp,
            zone_id: data.zone_id,
            action: data.action_required,
            cap: Math.round(data.current_capacity_pct)
          }];
          return newLogs.slice(-50);
        });
        
      }, 2000);
    }

    return () => {
      if (mockInterval) clearInterval(mockInterval);
    };
  }, [mockMode]);

  // WEBSOCKET ENGINE
  useEffect(() => {
    if (mockMode) return; // Ignore WS if mocking

    setWsStatus('Connecting...');
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/dashboard';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setWsStatus('Connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const timeStr = data.timestamp.split('T')[1]?.substring(0, 8) || '00:00:00';

        setZoneStates(prev => ({
          ...prev,
          [data.zone_id]: data
        }));

        setChartData(prev => {
          const newData = [...prev, {
            time: timeStr,
            current: data.current_capacity_pct,
            predicted: data.predicted_capacity_pct_5m,
            zone: data.zone_id
          }];
          return newData.slice(-30);
        });

        setLogs(prev => {
          const newLogs = [...prev, {
            timestamp: data.timestamp,
            zone_id: data.zone_id,
            action: data.action_required,
            cap: data.current_capacity_pct
          }];
          return newLogs.slice(-50);
        });

      } catch (err) {
        console.error("Failed to parse WS message", err);
      }
    };

    ws.onclose = () => {
      if (!mockMode) {
        setWsStatus('Disconnected');
        setTimeout(() => {
          if (!mockMode) setWsStatus('Reconnecting...');
        }, 3000);
      }
    };

    return () => ws.close();
  }, [mockMode, wsStatus === 'Reconnecting...']); // re-trigger on reconnect if not mocked


  return (
    <div className="h-screen bg-[#030712] text-gray-100 font-sans selection:bg-neon-cyan/30 overflow-hidden flex flex-col">
      
      {/* Top SaaS Navigation Bar */}
      <nav className="flex justify-between items-center px-6 py-3 border-b border-gray-800 bg-[#111827]/50 shrink-0 shadow-md z-50">
        <div className="flex items-center space-x-3">
          <Activity className="text-neon-cyan animate-pulse" size={24} />
          <h1 className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-blue-500 uppercase">
            OptiFlow <span className="text-gray-500 font-light text-lg">Platform</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Mock Toggle */}
          <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700">
            <span className="text-xs font-mono text-gray-400">Mock Data</span>
            <button 
              onClick={() => setMockMode(!mockMode)}
              className={`w-10 h-5 rounded-full transition-colors relative ${mockMode ? 'bg-neon-cyan' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${mockMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </button>
          </div>

          <div className="h-6 w-px bg-gray-800"></div>

          {/* Database Settings (Visual only) */}
          <button className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors">
            <Database size={16} />
            <span>Data Sources</span>
          </button>
          
          <button className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors">
            <Settings size={16} />
            <span>Rules Engine</span>
          </button>

          <div className="h-6 w-px bg-gray-800"></div>

          {/* Auth Button */}
          <button 
            onClick={() => setAuthModalOpen(true)}
            className="flex items-center space-x-2 bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 px-4 py-1.5 rounded-md text-sm font-semibold transition-all shadow-[0_0_10px_rgba(0,243,255,0.1)] hover:shadow-[0_0_15px_rgba(0,243,255,0.3)]"
          >
            <User size={16} />
            <span>Admin Sign In</span>
          </button>
        </div>
      </nav>

      {/* Sub Header (Status) */}
      <div className="flex justify-between items-center px-4 py-2 shrink-0 bg-[#030712]/50">
         <h2 className="text-gray-500 font-light text-sm uppercase tracking-wider">Live Command Center</h2>
         <div className="flex items-center space-x-2 text-xs font-mono bg-[#111827] border border-gray-800 px-3 py-1 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]">
          <div className={`w-2 h-2 rounded-full ${wsStatus.includes('Connected') || mockMode ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`}></div>
          <span className="text-gray-400">STREAM: <span className="text-white">{wsStatus}</span></span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 p-4 pt-0">
        
        {/* Left Column: Map & Chart */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full min-h-0">
          <div className="flex-[2] min-h-0">
             <StadiumMap zoneStates={zoneStates} />
          </div>
          
          <div className="flex-[1] min-h-0">
            <OccupancyChart chartData={chartData} />
          </div>
        </div>

        {/* Right Column: Terminal */}
        <div className="h-full w-full min-h-0">
          <AgentTerminal logs={logs} />
        </div>

      </div>

      {/* Auth Modal Placeholder */}
      {authModalOpen && (
        <div className="absolute inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#111827] border border-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden">
             {/* Neon Top Border */}
             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-cyan via-blue-500 to-neon-amber"></div>
             
             <div className="flex items-center justify-center mb-8">
               <Activity className="text-neon-cyan mr-2" size={32} />
               <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-blue-500 uppercase">
                 OptiFlow Auth
               </h2>
             </div>

             <div className="space-y-4">
               <div>
                 <label className="block text-xs font-mono text-gray-400 mb-1">ENTERPRISE EMAIL</label>
                 <input type="email" placeholder="admin@optiflow.io" className="w-full bg-[#030712] border border-gray-700 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:border-neon-cyan transition-colors" />
               </div>
               <div>
                 <label className="block text-xs font-mono text-gray-400 mb-1">ENCRYPTED CREDENTIAL</label>
                 <input type="password" placeholder="••••••••" className="w-full bg-[#030712] border border-gray-700 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:border-neon-cyan transition-colors" />
               </div>
               
               <button onClick={() => setAuthModalOpen(false)} className="w-full mt-6 bg-neon-cyan hover:bg-neon-cyan/80 text-gray-950 font-bold py-2.5 rounded-md flex justify-center items-center transition-colors shadow-[0_0_15px_rgba(0,243,255,0.4)]">
                 <LogIn size={18} className="mr-2" />
                 AUTHENTICATE
               </button>

               <button onClick={() => setAuthModalOpen(false)} className="w-full mt-2 text-xs text-gray-500 hover:text-gray-300 transition-colors">
                 Cancel / Close
               </button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
