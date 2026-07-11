import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StadiumMap from '../components/StadiumMap';
import OccupancyChart from '../components/OccupancyChart';
import AgentTerminal from '../components/AgentTerminal';
import AgentPipeline from '../components/AgentPipeline';
import { Activity, Database, Settings, X, Save, LogOut, ShieldAlert, MonitorPlay, ActivitySquare } from 'lucide-react';

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

  // Tactical Command States
  const [warningThreshold, setWarningThreshold] = useState(70);
  const [criticalThreshold, setCriticalThreshold] = useState(85);
  const [activeSignage, setActiveSignage] = useState("WELCOME TO RAJIV GANDHI STADIUM");
  const [dispatchRoster, setDispatchRoster] = useState([
    { id: 'T-Alpha', status: 'Standby', zone: 'None' },
    { id: 'T-Bravo', status: 'Standby', zone: 'None' }
  ]);

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
        let newSignage = "ENJOY THE EVENT";

        if (targetCap > criticalThreshold) {
          action = `CRITICAL: Zone ${targetZone} (${areaName}) > ${criticalThreshold}%. Rerouting traffic.`;
          newSignage = `WARNING: ZONE ${targetZone} CONGESTED. USE ALTERNATE ROUTES.`;
          setDispatchRoster(prev => [
            { id: 'T-Alpha', status: 'Deployed (Code Red)', zone: targetZone },
            { id: 'T-Bravo', status: prev[1].status, zone: prev[1].zone }
          ]);
        } else if (targetCap >= warningThreshold) {
          action = `WARNING: Zone ${targetZone} density rising. Pre-positioning staff.`;
          newSignage = `PLEASE PROCEED CAREFULLY IN ZONE ${targetZone}.`;
          setDispatchRoster(prev => [
            { id: 'T-Alpha', status: 'Monitoring', zone: targetZone },
            { id: 'T-Bravo', status: 'Standby', zone: 'None' }
          ]);
        } else {
          action = `Zone ${targetZone} (${areaName}) Normal`;
          setDispatchRoster([
            { id: 'T-Alpha', status: 'Patrolling', zone: 'General' },
            { id: 'T-Bravo', status: 'Standby', zone: 'HQ' }
          ]);
        }

        setActiveAgentIndex(-1);
        setPipelineMessages(['', '', '', '']);

        setTimeout(() => { setActiveAgentIndex(0); setPipelineMessages([`Ingested Z-${targetZone}: ${Math.round(targetCap)}%`, '', '', '']); }, 100);
        setTimeout(() => { setActiveAgentIndex(1); setPipelineMessages([`Ingested Z-${targetZone}: ${Math.round(targetCap)}%`, `Forecasting Z-${targetZone}: ${Math.round(predictedCap)}%`, '', '']); }, 500);
        setTimeout(() => {
          setActiveAgentIndex(2);
          const decisionText = targetCap > criticalThreshold ? 'EVAC ROUTE' : (targetCap >= warningThreshold ? 'PRE-WARN' : 'NOMINAL');
          setPipelineMessages([`Ingested...`, `Forecasting...`, `Threshold: ${decisionText}`, '']);
        }, 900);
        setTimeout(() => {
          setActiveAgentIndex(3);
          setPipelineMessages([`Ingested...`, `Forecasting...`, `Threshold pass`, `Publishing...`]);
          setActiveSignage(newSignage);

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
            const newData = [...prev, { time: timeStr, current: targetCap, predicted: predictedCap, zone: targetZone }];
            return newData.slice(-20);
          });

          setLogs(prev => {
            const newLogs = [...prev, { timestamp: now, zone_id: targetZone, action: action, cap: Math.round(targetCap) }];
            return newLogs.slice(-20);
          });
        }, 1300);
      }, 2500);
    }

    return () => { if (mockInterval) clearInterval(mockInterval); };
  }, [mockMode, warningThreshold, criticalThreshold]);


  return (
    <div className="h-screen bg-[#030712] text-gray-100 font-sans selection:bg-neon-cyan/30 overflow-hidden flex flex-col relative">
      <nav className="flex justify-between items-center px-8 py-3 border-b border-gray-800 bg-[#111827]/80 backdrop-blur-md shrink-0 shadow-md z-[100]">
        <div className="flex items-center space-x-3 w-1/4">
          <Activity className="text-neon-cyan animate-pulse" size={26} />
          <h1 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-blue-500 uppercase">OptiFlow</h1>
        </div>
        <div className="flex-1 flex justify-center space-x-8">
           <button className="text-sm font-medium text-neon-cyan transition-colors">Tactical Command Center</button>
        </div>
        <div className="flex items-center justify-end space-x-4 w-1/4">
          <button onClick={() => navigate('/select')} className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-md text-sm transition-all"><LogOut size={16} /><span>Exit Context</span></button>
        </div>
      </nav>

      <div className="flex justify-between items-center px-8 py-2 shrink-0 bg-[#030712]/80 border-b border-gray-900 z-40 relative">
         <div className="flex items-center space-x-6">
            <h2 className="text-gray-500 font-light text-xs uppercase tracking-widest">Global Overview</h2>
            <div className="flex items-center space-x-2 text-xs font-mono bg-[#111827] border border-gray-800 px-3 py-1 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]">
              <div className={`w-2 h-2 rounded-full ${wsStatus.includes('Connected') || mockMode ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`}></div>
              <span className="text-gray-400">STREAM: <span className="text-white">{wsStatus}</span></span>
            </div>
         </div>
         <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700">
              <span className="text-xs font-mono text-gray-400">Mock Engine</span>
              <button onClick={() => setMockMode(!mockMode)} className={`w-8 h-4 rounded-full transition-colors relative ${mockMode ? 'bg-neon-cyan' : 'bg-gray-600'}`}>
                <div className={`absolute top-[2px] left-[2px] w-3 h-3 bg-white rounded-full transition-transform ${mockMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0 p-4 z-30 relative overflow-hidden">
        
        {/* Left Column: Map & ML Diagnostics */}
        <div className="lg:col-span-7 flex flex-col gap-4 h-full min-h-0">
          <div className="flex-[5] min-h-0">
             <StadiumMap zoneStates={zoneStates} />
          </div>
          
          <div className="flex-[3] min-h-0 flex gap-4">
            <div className="flex-1">
              <OccupancyChart chartData={chartData} />
            </div>
            {/* ML Diagnostics Panel */}
            <div className="w-48 bg-[#111827] border border-gray-800 rounded-xl p-4 flex flex-col justify-center">
              <div className="flex items-center space-x-2 mb-4">
                <ActivitySquare size={16} className="text-neon-cyan" />
                <h3 className="text-xs font-bold text-gray-400 tracking-wider">XGBOOST ML</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-gray-500 font-mono">MEAN ABS ERROR (MAE)</p>
                  <p className="text-lg font-bold text-green-400 font-mono">1.24%</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-mono">ROOT MEAN SQ (RMSE)</p>
                  <p className="text-lg font-bold text-green-400 font-mono">2.11%</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-mono">LATENCY / INFERENCE</p>
                  <p className="text-sm font-bold text-white font-mono">14ms</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tactical Widgets */}
        <div className="lg:col-span-5 flex flex-col gap-4 h-full min-h-0">
          
          {/* 1. Agent Control Panel */}
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 shrink-0 flex flex-col gap-3">
             <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                <h3 className="text-sm font-bold text-gray-300">Agent Core Pipeline</h3>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2 text-[10px] font-mono">
                    <span className="text-neon-amber">WARN:</span>
                    <input type="number" value={warningThreshold} onChange={(e) => setWarningThreshold(Number(e.target.value))} className="w-12 bg-gray-900 border border-gray-700 rounded px-1 py-0.5 text-white" />
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] font-mono">
                    <span className="text-red-500">CRIT:</span>
                    <input type="number" value={criticalThreshold} onChange={(e) => setCriticalThreshold(Number(e.target.value))} className="w-12 bg-gray-900 border border-gray-700 rounded px-1 py-0.5 text-white" />
                  </div>
                </div>
             </div>
             <AgentPipeline activeIndex={activeAgentIndex} messages={pipelineMessages} />
          </div>

          {/* 2. Dispatch & Signage Row */}
          <div className="flex gap-4 shrink-0 h-32">
            {/* Signage Hub */}
            <div className="flex-1 bg-[#111827] border border-gray-800 rounded-xl p-3 flex flex-col">
              <div className="flex items-center space-x-2 mb-2 text-gray-400">
                <MonitorPlay size={14} />
                <h3 className="text-xs font-bold tracking-wider">PUBLIC SIGNAGE HUB</h3>
              </div>
              <div className="flex-1 bg-gray-950 border border-gray-700 rounded-lg p-2 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <p className="text-neon-amber font-mono text-center font-bold text-sm z-10 animate-pulse uppercase">
                  {activeSignage}
                </p>
              </div>
            </div>

            {/* Dispatch Console */}
            <div className="w-1/2 bg-[#111827] border border-gray-800 rounded-xl p-3 flex flex-col">
              <div className="flex items-center space-x-2 mb-2 text-gray-400">
                <ShieldAlert size={14} />
                <h3 className="text-xs font-bold tracking-wider">DISPATCH</h3>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
                {dispatchRoster.map(unit => (
                  <div key={unit.id} className="bg-gray-900 border border-gray-800 rounded p-2 flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{unit.id}</span>
                    <div className="text-right">
                      <div className={`text-[9px] font-mono ${unit.status.includes('Red') ? 'text-red-500' : 'text-neon-cyan'}`}>{unit.status}</div>
                      <div className="text-[9px] text-gray-500">Loc: {unit.zone}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Terminal */}
          <div className="flex-1 min-h-0">
            <AgentTerminal logs={logs} />
          </div>

        </div>
      </div>
    </div>
  );
}
