import React, { useState, useEffect, useRef } from 'react';
import StadiumMap from './components/StadiumMap';
import OccupancyChart from './components/OccupancyChart';
import AgentTerminal from './components/AgentTerminal';
import AgentPipeline from './components/AgentPipeline';
import { Activity, Database, User, LogIn, Settings, X, Save } from 'lucide-react';

function App() {
  const [zoneStates, setZoneStates] = useState({});
  const [chartData, setChartData] = useState([]);
  const [logs, setLogs] = useState([]);
  
  const [wsStatus, setWsStatus] = useState('Connecting...');
  const [mockMode, setMockMode] = useState(false);
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDataSourcesOpen, setIsDataSourcesOpen] = useState(false);
  const [isRulesEngineOpen, setIsRulesEngineOpen] = useState(false);

  // Agent Pipeline States
  const [activeAgentIndex, setActiveAgentIndex] = useState(-1);
  const [pipelineMessages, setPipelineMessages] = useState(['', '', '', '']);

  // MOCK DATA ENGINE (Math.sin implementation with Pipeline Vis)
  useEffect(() => {
    let mockInterval;
    if (mockMode) {
      setWsStatus('MOCKED (Local)');
      const zones = ['A', 'B', 'C', 'D'];
      const offsets = { 'A': 0, 'B': Math.PI / 2, 'C': Math.PI, 'D': 3 * Math.PI / 2 };
      
      mockInterval = setInterval(() => {
        const nowMs = Date.now();
        const now = new Date(nowMs).toISOString();
        const timeStr = now.split('T')[1].substring(0, 8);
        const targetZone = zones[Math.floor(Math.random() * zones.length)];
        const currentCapacities = {};
        
        zones.forEach(z => {
          const freq = (2 * Math.PI) / 60000;
          let cap = 67.5 + 27.5 * Math.sin(nowMs * freq + offsets[z]);
          cap += (Math.random() - 0.5) * 4;
          currentCapacities[z] = Math.max(0, Math.min(100, cap));
        });

        const targetCap = currentCapacities[targetZone];
        const predictedCap = Math.min(100, targetCap + (Math.random() * 10 - 2)); 
        
        let action = "None";
        if (targetCap > 85) {
          action = `CRITICAL: Zone ${targetZone} capacity at ${Math.round(targetCap)}%. Rerouting traffic.`;
        } else if (targetCap >= 70) {
          action = `WARNING: Zone ${targetZone} density rising. Pre-positioning staff.`;
        } else {
          action = `Zone ${targetZone} Normal`;
        }

        // --- PIPELINE SIMULATION (Staggered updates over 1.2s) ---
        
        // Reset pipeline
        setActiveAgentIndex(-1);
        setPipelineMessages(['', '', '', '']);

        // 1. DensityAgent
        setTimeout(() => {
          setActiveAgentIndex(0);
          setPipelineMessages([`Ingested Z-${targetZone}: ${Math.round(targetCap)}%`, '', '', '']);
        }, 100);

        // 2. PredictionAgent
        setTimeout(() => {
          setActiveAgentIndex(1);
          setPipelineMessages([`Ingested Z-${targetZone}: ${Math.round(targetCap)}%`, `Forecasting Z-${targetZone}: ${Math.round(predictedCap)}%`, '', '']);
        }, 500);

        // 3. DecisionAgent
        setTimeout(() => {
          setActiveAgentIndex(2);
          const decisionText = targetCap > 85 ? 'EVAC ROUTE' : (targetCap >= 70 ? 'PRE-WARN' : 'NOMINAL');
          setPipelineMessages([
            `Ingested Z-${targetZone}: ${Math.round(targetCap)}%`, 
            `Forecasting Z-${targetZone}: ${Math.round(predictedCap)}%`, 
            `Threshold check: ${decisionText}`, 
            ''
          ]);
        }, 900);

        // 4. AlertAgent & State Commit
        setTimeout(() => {
          setActiveAgentIndex(3);
          setPipelineMessages([
            `Ingested Z-${targetZone}: ${Math.round(targetCap)}%`, 
            `Forecasting Z-${targetZone}: ${Math.round(predictedCap)}%`, 
            `Threshold check pass`, 
            `Publishing state...`
          ]);

          // Commit UI state updates at the end of the pipeline
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

          setChartData(prev => {
            const newData = [...prev, {
              time: timeStr,
              current: targetCap,
              predicted: predictedCap,
              zone: targetZone
            }];
            return newData.slice(-30);
          });

          setLogs(prev => {
            const newLogs = [...prev, {
              timestamp: now,
              zone_id: targetZone,
              action: action,
              cap: Math.round(targetCap)
            }];
            return newLogs.slice(-50);
          });

        }, 1300);
        
      }, 2500); // Trigger pipeline every 2.5s
    }

    return () => {
      if (mockInterval) clearInterval(mockInterval);
    };
  }, [mockMode]);

  // WEBSOCKET ENGINE (Original implementation retained, unchanged)
  useEffect(() => {
    if (mockMode) return; 

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
  }, [mockMode, wsStatus === 'Reconnecting...']);


  return (
    <div className="h-screen bg-[#030712] text-gray-100 font-sans selection:bg-neon-cyan/30 overflow-hidden flex flex-col relative">
      
      {/* Top SaaS Navigation Bar */}
      <nav className="flex justify-between items-center px-6 py-3 border-b border-gray-800 bg-[#111827]/50 shrink-0 shadow-md z-[100]">
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

          <button 
            onClick={() => setIsDataSourcesOpen(true)}
            className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Database size={16} />
            <span>Data Sources</span>
          </button>
          
          <button 
            onClick={() => setIsRulesEngineOpen(true)}
            className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Settings size={16} />
            <span>Rules Engine</span>
          </button>

          <div className="h-6 w-px bg-gray-800"></div>

          <button 
            onClick={() => setIsLoginOpen(true)}
            className="flex items-center space-x-2 bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 px-4 py-1.5 rounded-md text-sm font-semibold transition-all shadow-[0_0_10px_rgba(0,243,255,0.1)] hover:shadow-[0_0_15px_rgba(0,243,255,0.3)]"
          >
            <User size={16} />
            <span>Admin Sign In</span>
          </button>
        </div>
      </nav>

      {/* Sub Header (Status) */}
      <div className="flex justify-between items-center px-4 py-2 shrink-0 bg-[#030712]/50 z-40 relative">
         <h2 className="text-gray-500 font-light text-sm uppercase tracking-wider">Live Command Center</h2>
         <div className="flex items-center space-x-2 text-xs font-mono bg-[#111827] border border-gray-800 px-3 py-1 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]">
          <div className={`w-2 h-2 rounded-full ${wsStatus.includes('Connected') || mockMode ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`}></div>
          <span className="text-gray-400">STREAM: <span className="text-white">{wsStatus}</span></span>
        </div>
      </div>

      {/* Main Grid: Layout adjusted for Pipeline visibility */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 p-4 pt-0 z-30 relative">
        
        {/* Left Column: Map & Chart (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4 h-full min-h-0">
          <div className="flex-[3] min-h-0">
             <StadiumMap zoneStates={zoneStates} />
          </div>
          
          <div className="flex-[1] min-h-0">
            <OccupancyChart chartData={chartData} />
          </div>
        </div>

        {/* Right Column: Pipeline & Terminal (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 h-full min-h-0">
          <div className="shrink-0">
            <AgentPipeline activeIndex={activeAgentIndex} messages={pipelineMessages} />
          </div>
          <div className="flex-1 min-h-0">
            <AgentTerminal logs={logs} />
          </div>
        </div>

      </div>

      {/* MODALS */}
      {/* 1. Admin Sign In Modal */}
      {isLoginOpen && (
        <div className="absolute inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#111827] border border-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden">
             <button onClick={() => setIsLoginOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
               <X size={20} />
             </button>
             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-cyan via-blue-500 to-neon-amber"></div>
             
             <div className="flex items-center justify-center mb-8 mt-2">
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
               
               <button onClick={() => setIsLoginOpen(false)} className="w-full mt-6 bg-neon-cyan hover:bg-neon-cyan/80 text-gray-950 font-bold py-2.5 rounded-md flex justify-center items-center transition-colors shadow-[0_0_15px_rgba(0,243,255,0.4)]">
                 <LogIn size={18} className="mr-2" />
                 AUTHENTICATE
               </button>
             </div>
          </div>
        </div>
      )}

      {/* 2. Data Sources Modal */}
      {isDataSourcesOpen && (
        <div className="absolute inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#111827] border border-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-lg relative overflow-hidden">
             <button onClick={() => setIsDataSourcesOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
               <X size={20} />
             </button>
             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
             
             <div className="flex items-center mb-6 mt-2">
               <Database className="text-blue-500 mr-3" size={28} />
               <h2 className="text-xl font-bold text-white uppercase">Data Sources</h2>
             </div>

             <div className="space-y-4">
               <div>
                 <label className="block text-xs font-mono text-gray-400 mb-1">SUPABASE TIMESCALEDB CONNECTION STRING</label>
                 <input type="text" defaultValue="postgres://postgres.vjfk...:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres" className="w-full bg-[#030712] border border-gray-700 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:border-blue-500 transition-colors font-mono text-xs" />
               </div>
               <div>
                 <label className="block text-xs font-mono text-gray-400 mb-1">RABBITMQ EVENT BUS URL</label>
                 <input type="text" defaultValue="amqp://guest:guest@localhost:5672/" className="w-full bg-[#030712] border border-gray-700 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:border-blue-500 transition-colors font-mono text-xs" />
               </div>
               
               <button onClick={() => setIsDataSourcesOpen(false)} className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-md flex justify-center items-center transition-colors">
                 <Save size={16} className="mr-2" />
                 SAVE CONFIGURATION
               </button>
             </div>
          </div>
        </div>
      )}

      {/* 3. Rules Engine Modal */}
      {isRulesEngineOpen && (
        <div className="absolute inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#111827] border border-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-lg relative overflow-hidden">
             <button onClick={() => setIsRulesEngineOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
               <X size={20} />
             </button>
             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-amber to-red-500"></div>
             
             <div className="flex items-center mb-6 mt-2">
               <Settings className="text-neon-amber mr-3" size={28} />
               <h2 className="text-xl font-bold text-white uppercase">Rules Engine</h2>
             </div>

             <div className="space-y-6">
               <div>
                 <div className="flex justify-between mb-1">
                   <label className="text-xs font-mono text-gray-400">WARNING THRESHOLD</label>
                   <span className="text-neon-amber text-xs font-bold">70%</span>
                 </div>
                 <input type="range" min="50" max="100" defaultValue="70" className="w-full accent-neon-amber" />
               </div>
               
               <div>
                 <div className="flex justify-between mb-1">
                   <label className="text-xs font-mono text-gray-400">CRITICAL ACTION THRESHOLD</label>
                   <span className="text-red-500 text-xs font-bold">85%</span>
                 </div>
                 <input type="range" min="50" max="100" defaultValue="85" className="w-full accent-red-500" />
               </div>

               <div>
                 <label className="block text-xs font-mono text-gray-400 mb-1">PREDICTION WINDOW (MINUTES)</label>
                 <select className="w-full bg-[#030712] border border-gray-700 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:border-neon-amber">
                   <option>5 Minutes</option>
                   <option>15 Minutes</option>
                   <option>30 Minutes</option>
                   <option>60 Minutes</option>
                 </select>
               </div>
               
               <button onClick={() => setIsRulesEngineOpen(false)} className="w-full mt-4 bg-neon-amber hover:bg-neon-amber/80 text-gray-950 font-bold py-2 rounded-md flex justify-center items-center transition-colors">
                 <Save size={16} className="mr-2" />
                 APPLY RULES
               </button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
