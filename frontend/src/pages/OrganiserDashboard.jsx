import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StadiumMap from '../components/StadiumMap';
import OccupancyChart from '../components/OccupancyChart';
import AgentTerminal from '../components/AgentTerminal';
import AgentPipeline from '../components/AgentPipeline';
import { Activity, Database, Settings, X, Save, LogOut } from 'lucide-react';

export default function OrganiserDashboard() {
  const navigate = useNavigate();

  const [zoneStates, setZoneStates] = useState({});
  const [chartData, setChartData] = useState([]);
  const [logs, setLogs] = useState([]);
  
  const [wsStatus, setWsStatus] = useState('Connecting...');
  const [mockMode, setMockMode] = useState(false);
  
  const [isDataSourcesOpen, setIsDataSourcesOpen] = useState(false);
  const [isRulesEngineOpen, setIsRulesEngineOpen] = useState(false);

  const [activeAgentIndex, setActiveAgentIndex] = useState(-1);
  const [pipelineMessages, setPipelineMessages] = useState(['', '', '', '']);

  const ZONE_META = {
    'A': 'North Entrance',
    'B': 'Main Concourse',
    'C': 'South Pavilion',
    'D': 'VIP West Wing'
  };

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
        const areaName = ZONE_META[targetZone];
        
        let action = "None";
        if (targetCap > 85) {
          action = `CRITICAL: Zone ${targetZone} (${areaName}, Rajiv Gandhi Stadium, Uppal) has exceeded ${Math.round(targetCap)}% capacity. Rerouting foot traffic to Exit ${targetZone}.`;
        } else if (targetCap >= 70) {
          action = `WARNING: Zone ${targetZone} (${areaName}) density rising to ${Math.round(targetCap)}%. Pre-positioning staff.`;
        } else {
          action = `Zone ${targetZone} (${areaName}) Normal`;
        }

        setActiveAgentIndex(-1);
        setPipelineMessages(['', '', '', '']);

        setTimeout(() => {
          setActiveAgentIndex(0);
          setPipelineMessages([`Ingested Z-${targetZone}: ${Math.round(targetCap)}%`, '', '', '']);
        }, 100);

        setTimeout(() => {
          setActiveAgentIndex(1);
          setPipelineMessages([`Ingested Z-${targetZone}: ${Math.round(targetCap)}%`, `Forecasting Z-${targetZone}: ${Math.round(predictedCap)}%`, '', '']);
        }, 500);

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

        setTimeout(() => {
          setActiveAgentIndex(3);
          setPipelineMessages([
            `Ingested Z-${targetZone}: ${Math.round(targetCap)}%`, 
            `Forecasting Z-${targetZone}: ${Math.round(predictedCap)}%`, 
            `Threshold check pass`, 
            `Publishing state...`
          ]);

          setZoneStates(prev => {
             const newStates = { ...prev };
             zones.forEach(z => {
               newStates[z] = {
                 current_capacity_pct: currentCapacities[z],
                 predicted_capacity_pct_5m: currentCapacities[z] + 5,
                 meta_area: ZONE_META[z]
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
        
      }, 2500);
    }

    return () => {
      if (mockInterval) clearInterval(mockInterval);
    };
  }, [mockMode]);

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
        
        data.meta_area = data.meta_area || ZONE_META[data.zone_id] || `Zone ${data.zone_id}`;

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
      
      <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-800 bg-[#111827]/80 backdrop-blur-md shrink-0 shadow-md z-[100]">
        <div className="flex items-center space-x-3 w-1/4">
          <Activity className="text-neon-cyan animate-pulse" size={26} />
          <h1 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-blue-500 uppercase">
            OptiFlow
          </h1>
        </div>

        <div className="flex-1 flex justify-center space-x-8">
           <button className="text-sm font-medium text-neon-cyan transition-colors">Organiser Dashboard</button>
           <button className="text-sm font-medium text-gray-400 transition-colors hover:text-white">Documentation</button>
           <button className="text-sm font-medium text-gray-400 transition-colors hover:text-white">Support</button>
        </div>
        
        <div className="flex items-center justify-end space-x-4 w-1/4">
          <button 
            onClick={() => navigate('/auth')}
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-md text-sm transition-all"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      <div className="flex justify-between items-center px-8 py-2 shrink-0 bg-[#030712]/80 border-b border-gray-900 z-40 relative">
         <div className="flex items-center space-x-6">
            <h2 className="text-gray-500 font-light text-xs uppercase tracking-widest">Command Center</h2>
            <div className="flex items-center space-x-2 text-xs font-mono bg-[#111827] border border-gray-800 px-3 py-1 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]">
              <div className={`w-2 h-2 rounded-full ${wsStatus.includes('Connected') || mockMode ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`}></div>
              <span className="text-gray-400">STREAM: <span className="text-white">{wsStatus}</span></span>
            </div>
         </div>
         
         <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700">
              <span className="text-xs font-mono text-gray-400">Mock Data</span>
              <button 
                onClick={() => setMockMode(!mockMode)}
                className={`w-8 h-4 rounded-full transition-colors relative ${mockMode ? 'bg-neon-cyan' : 'bg-gray-600'}`}
              >
                <div className={`absolute top-[2px] left-[2px] w-3 h-3 bg-white rounded-full transition-transform ${mockMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </button>
            </div>
            <div className="h-4 w-px bg-gray-800"></div>
            <button onClick={() => setIsDataSourcesOpen(true)} className="flex items-center space-x-2 text-xs text-gray-400 hover:text-white transition-colors"><Database size={14} /><span>Data Sources</span></button>
            <button onClick={() => setIsRulesEngineOpen(true)} className="flex items-center space-x-2 text-xs text-gray-400 hover:text-white transition-colors"><Settings size={14} /><span>Rules Engine</span></button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 p-6 pt-4 pb-4 z-30 relative overflow-hidden">
        <div className="lg:col-span-7 flex flex-col gap-4 h-full min-h-0">
          <div className="flex-[3] min-h-0">
             <StadiumMap zoneStates={zoneStates} />
          </div>
          <div className="flex-[1] min-h-0">
            <OccupancyChart chartData={chartData} />
          </div>
        </div>
        <div className="lg:col-span-5 flex flex-col gap-4 h-full min-h-0">
          <div className="shrink-0">
            <AgentPipeline activeIndex={activeAgentIndex} messages={pipelineMessages} />
          </div>
          <div className="flex-1 min-h-0">
            <AgentTerminal logs={logs} />
          </div>
        </div>
      </div>

      <footer className="flex justify-between items-center px-8 py-3 bg-[#0a0f1c] border-t border-gray-800 shrink-0 text-xs text-gray-500 z-40">
        <div>&copy; 2026 OptiFlow Systems. All rights reserved.</div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
        </div>
        <div className="flex items-center text-gray-400 font-mono">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e] mr-2"></div>
          System Status: All Systems Operational
        </div>
      </footer>

      {/* Modals */}
      {isDataSourcesOpen && (
        <div className="absolute inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#111827] border border-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-lg relative overflow-hidden">
             <button onClick={() => setIsDataSourcesOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
             <h2 className="text-xl font-bold text-white mb-6">Data Sources</h2>
             <button onClick={() => setIsDataSourcesOpen(false)} className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-md transition-colors"><Save size={16} className="mr-2 inline" /> SAVE CONFIGURATION</button>
          </div>
        </div>
      )}
      {isRulesEngineOpen && (
        <div className="absolute inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#111827] border border-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-lg relative overflow-hidden">
             <button onClick={() => setIsRulesEngineOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
             <h2 className="text-xl font-bold text-white mb-6">Rules Engine</h2>
             <button onClick={() => setIsRulesEngineOpen(false)} className="w-full mt-4 bg-neon-amber hover:bg-neon-amber/80 text-gray-950 font-bold py-2 rounded-md transition-colors"><Save size={16} className="mr-2 inline" /> APPLY RULES</button>
          </div>
        </div>
      )}
    </div>
  );
}
