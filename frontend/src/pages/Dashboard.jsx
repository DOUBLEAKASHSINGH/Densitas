import React, { useState, useEffect } from 'react';
import StadiumMap from '../components/StadiumMap';
import OccupancyChart from '../components/OccupancyChart';
import AgentTerminal from '../components/AgentTerminal';
import AgentPipeline from '../components/AgentPipeline';
import { ActivitySquare, MonitorPlay, ShieldAlert } from 'lucide-react';

export default function Dashboard() {
  const [zoneStates, setZoneStates] = useState({});
  const [chartData, setChartData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [wsStatus, setWsStatus] = useState('Connected (Mock)');
  
  const [activeAgentIndex, setActiveAgentIndex] = useState(-1);
  const [pipelineMessages, setPipelineMessages] = useState(['', '', '', '']);

  const [warningThreshold, setWarningThreshold] = useState(70);
  const [criticalThreshold, setCriticalThreshold] = useState(85);
  const [activeSignage, setActiveSignage] = useState("WELCOME TO HITEX");
  const [dispatchRoster, setDispatchRoster] = useState([
    { id: 'T-Alpha', status: 'Standby', zone: 'None' },
    { id: 'T-Bravo', status: 'Standby', zone: 'None' }
  ]);

  const ZONE_META = {
    'A': 'Hall 1',
    'B': 'Hall 2',
    'C': 'Hall 3',
    'D': 'Open Arena'
  };

  useEffect(() => {
    const zones = ['A', 'B', 'C', 'D'];
    const offsets = { 'A': 0, 'B': Math.PI / 2, 'C': Math.PI, 'D': 3 * Math.PI / 2 };
    
    const mockInterval = setInterval(() => {
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
        action = `CRITICAL: ${areaName} > ${criticalThreshold}%. Rerouting traffic.`;
        newSignage = `WARNING: ${areaName.toUpperCase()} CONGESTED. USE ALTERNATE ROUTES.`;
        setDispatchRoster(prev => [
          { id: 'T-Alpha', status: 'Deployed (Code Red)', zone: areaName },
          { id: 'T-Bravo', status: prev[1].status, zone: prev[1].zone }
        ]);
      } else if (targetCap >= warningThreshold) {
        action = `WARNING: ${areaName} density rising. Pre-positioning staff.`;
        newSignage = `PLEASE PROCEED CAREFULLY NEAR ${areaName.toUpperCase()}.`;
        setDispatchRoster(prev => [
          { id: 'T-Alpha', status: 'Monitoring', zone: areaName },
          { id: 'T-Bravo', status: 'Standby', zone: 'None' }
        ]);
      } else {
        action = `${areaName} Normal`;
        setDispatchRoster([
          { id: 'T-Alpha', status: 'Patrolling', zone: 'General' },
          { id: 'T-Bravo', status: 'Standby', zone: 'HQ' }
        ]);
      }

      setActiveAgentIndex(-1);
      setPipelineMessages(['', '', '', '']);

      setTimeout(() => { setActiveAgentIndex(0); setPipelineMessages([`Ingested ${targetZone}: ${Math.round(targetCap)}%`, '', '', '']); }, 100);
      setTimeout(() => { setActiveAgentIndex(1); setPipelineMessages([`Ingested ${targetZone}: ${Math.round(targetCap)}%`, `Forecasting ${targetZone}: ${Math.round(predictedCap)}%`, '', '']); }, 500);
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

    return () => clearInterval(mockInterval);
  }, [warningThreshold, criticalThreshold]);


  return (
    <div className="flex-1 flex flex-col relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header Info */}
      <div className="flex justify-between items-center mb-6">
         <div>
            <h2 className="text-2xl font-bold text-slate-900">Operational Dashboard</h2>
            <p className="text-sm text-slate-500">Pharma Pro & Pack Expo (Jul 9-11, 2026) - HITEX Exhibition Centre</p>
         </div>
         <div className="flex items-center space-x-2 text-xs font-medium bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
           <div className="w-2 h-2 rounded-full bg-green-500"></div>
           <span className="text-slate-600">STREAM: <span className="text-slate-900">{wsStatus}</span></span>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[600px]">
        
        {/* Left Column: Map & ML Diagnostics */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="h-96 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-2">
             <StadiumMap zoneStates={zoneStates} />
          </div>
          
          <div className="flex-1 flex gap-6 min-h-[200px]">
            <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm p-4">
              <OccupancyChart chartData={chartData} />
            </div>
            {/* ML Diagnostics Panel */}
            <div className="w-48 bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col justify-center">
              <div className="flex items-center space-x-2 mb-6">
                <ActivitySquare size={16} className="text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-500 tracking-wider">XGBOOST ML</h3>
              </div>
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold tracking-wide">MEAN ABS ERROR</p>
                  <p className="text-lg font-bold text-green-600">1.24%</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold tracking-wide">ROOT MEAN SQ</p>
                  <p className="text-lg font-bold text-green-600">2.11%</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold tracking-wide">INFERENCE LATENCY</p>
                  <p className="text-sm font-bold text-slate-800">14ms</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tactical Widgets */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Agent Control Panel */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col gap-4">
             <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800">Agent Core Pipeline</h3>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2 text-[11px] font-semibold">
                    <span className="text-amber-500">WARN:</span>
                    <input type="number" value={warningThreshold} onChange={(e) => setWarningThreshold(Number(e.target.value))} className="w-14 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700" />
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] font-semibold">
                    <span className="text-red-500">CRIT:</span>
                    <input type="number" value={criticalThreshold} onChange={(e) => setCriticalThreshold(Number(e.target.value))} className="w-14 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700" />
                  </div>
                </div>
             </div>
             <AgentPipeline activeIndex={activeAgentIndex} messages={pipelineMessages} />
          </div>

          {/* Dispatch & Signage */}
          <div className="flex gap-4 h-32">
            <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex flex-col">
              <div className="flex items-center space-x-2 mb-3 text-slate-500">
                <MonitorPlay size={14} />
                <h3 className="text-xs font-bold tracking-wider">SIGNAGE HUB</h3>
              </div>
              <div className="flex-1 bg-slate-900 rounded-lg p-2 flex items-center justify-center">
                <p className="text-amber-400 font-mono text-center font-bold text-xs uppercase animate-pulse">
                  {activeSignage}
                </p>
              </div>
            </div>

            <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex flex-col">
              <div className="flex items-center space-x-2 mb-3 text-slate-500">
                <ShieldAlert size={14} />
                <h3 className="text-xs font-bold tracking-wider">DISPATCH</h3>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto">
                {dispatchRoster.map(unit => (
                  <div key={unit.id} className="bg-slate-50 border border-slate-100 rounded p-2 flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-700">{unit.id}</span>
                    <div className="text-right">
                      <div className={`text-[10px] font-semibold ${unit.status.includes('Red') ? 'text-red-600' : 'text-indigo-600'}`}>{unit.status}</div>
                      <div className="text-[9px] text-slate-500">{unit.zone}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Terminal */}
          <div className="flex-1 bg-slate-900 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[200px]">
             <AgentTerminal logs={logs} />
          </div>

        </div>
      </div>
    </div>
  );
}
