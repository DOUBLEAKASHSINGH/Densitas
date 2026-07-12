import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StadiumMap from '../components/StadiumMap';
import OccupancyChart from '../components/OccupancyChart';
import AgentTerminal from '../components/AgentTerminal';
import AgentPipeline from '../components/AgentPipeline';
import GateMonitor from '../components/GateMonitor';
import { ActivitySquare, MonitorPlay, ShieldAlert, ArrowLeft, Shield } from 'lucide-react';

export default function Dashboard() {
  const routerLocation = useLocation();
  const navigate = useNavigate();
  
  const getEventData = () => {
    if (routerLocation.state?.eventData) return routerLocation.state.eventData;
    try {
      const stored = sessionStorage.getItem('selectedEvent');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  };
  
  const eventData = getEventData();

  const [zoneStates, setZoneStates] = useState({});
  const [chartData, setChartData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [wsStatus, setWsStatus] = useState('Connecting...');
  
  const [activeAgentIndex, setActiveAgentIndex] = useState(-1);
  const [pipelineMessages, setPipelineMessages] = useState(['', '', '', '']);

  const [warningThreshold, setWarningThreshold] = useState(70);
  const [criticalThreshold, setCriticalThreshold] = useState(85);
  const [activeSignage, setActiveSignage] = useState("WELCOME TO THE EVENT");
  const [dispatchRoster, setDispatchRoster] = useState([
    { id: 'Guard Unit', status: 'Standby', zone: 'None' },
    { id: 'Crowd Control Team', status: 'Standby', zone: 'None' },
    { id: 'Perimeter Squad', status: 'Patrolling', zone: 'Outer Perimeter' }
  ]);
  
  // Gate metrics state specifically for the GateMonitor component
  const [gateMetrics, setGateMetrics] = useState({});

  const ZONE_META = {
    'A': 'Hall 1',
    'B': 'Hall 2',
    'C': 'Hall 3',
    'D': 'Open Arena'
  };

  // WebSocket Connection
  useEffect(() => {
    if (!eventData) return;

    let ws;
    try {
      ws = new WebSocket('ws://localhost:8000/ws/dashboard');
      
      ws.onopen = () => {
        setWsStatus('Connected (Local Live)');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          const zoneMap = { 'Hall 1': 'A', 'Hall 2': 'B', 'Hall 3': 'C', 'Open Arena': 'D', 'HITEX-H1': 'A', 'HITEX-H3': 'C', 'BH-OA': 'D' };
          const targetZone = zoneMap[data.zone_id] || 'A';
          
          const targetCap = data.current_capacity;
          const predictedCap = data.predicted_capacity;
          const action = data.agent_log || 'None';
          const timestamp = data.timestamp || new Date().toISOString();
          const timeStr = timestamp;
          const areaName = ZONE_META[targetZone] || `Zone ${targetZone}`;

          setActiveAgentIndex(3); 
          setPipelineMessages([`Ingested ${targetCap}%`, `Predicted ${predictedCap}%`, `Decision applied`, `Published`]);

          let newSignage = "ENJOY THE EVENT";

          if (targetCap > criticalThreshold || action.includes('CRITICAL')) {
            newSignage = `WARNING: ${areaName.toUpperCase()} CONGESTED. USE ALTERNATE ROUTES.`;
            setDispatchRoster(prev => [
              { id: 'Guard Unit Alpha', status: 'Deployed', zone: areaName },
              { id: 'Crowd Control Team B', status: prev[1].status, zone: prev[1].zone },
              { id: 'Perimeter Squad C', status: prev[2].status, zone: prev[2].zone }
            ]);
          } else if (targetCap >= warningThreshold || action.includes('WARNING')) {
            newSignage = `PLEASE PROCEED CAREFULLY NEAR ${areaName.toUpperCase()}.`;
            setDispatchRoster(prev => [
              { id: 'Guard Unit Alpha', status: 'Monitoring', zone: areaName },
              { id: 'Crowd Control Team B', status: 'Standby', zone: 'None' },
              { id: 'Perimeter Squad C', status: prev[2].status, zone: prev[2].zone }
            ]);
          } else {
            setDispatchRoster([
              { id: 'Guard Unit Alpha', status: 'Standby', zone: 'None' },
              { id: 'Crowd Control Team B', status: 'Standby', zone: 'None' },
              { id: 'Perimeter Squad C', status: 'Patrolling', zone: 'Outer Perimeter' }
            ]);
          }

          setActiveSignage(newSignage);

          setZoneStates(prev => ({
            ...prev,
            [targetZone]: {
              current_capacity_pct: targetCap,
              predicted_capacity_pct_5m: predictedCap,
              meta_area: areaName
            }
          }));

          setChartData(prev => {
            const newData = [...prev, { time: timeStr, current: targetCap, predicted: predictedCap, zone: targetZone }];
            return newData.slice(-20);
          });

          setLogs(prev => {
            const newLogs = [...prev, { timestamp: timestamp, zone_id: targetZone, action: action, cap: Math.round(targetCap) }];
            return newLogs.slice(-20);
          });

        } catch (err) {
          console.error("Failed to parse websocket message", err);
        }
      };

      ws.onclose = () => {
        setWsStatus('Simulated');
      };
      ws.onerror = () => {
        setWsStatus('Simulated');
      };
    } catch (e) {
      setWsStatus('Simulated');
    }

    return () => {
      if (ws) ws.close();
    };
  }, [warningThreshold, criticalThreshold, eventData]);

  // Automatic Active Data Fallback Loop
  // If WS is disconnected, run the fallback simulation
  useEffect(() => {
    if (!eventData) return;
    
    // Only run if the socket explicitly failed or closed
    if (wsStatus !== 'Simulated') return;

    const fallbackInterval = setInterval(() => {
      const nowMs = Date.now();
      const now = new Date(nowMs).toISOString();
      const timeStr = now.split('T')[1].substring(0, 8);
      
      const zones = ['A', 'B', 'C', 'D'];
      const offsets = { 'A': 0, 'B': Math.PI / 2, 'C': Math.PI, 'D': 3 * Math.PI / 2 };
      const targetZone = zones[Math.floor(Math.random() * zones.length)];
      
      const freq = (2 * Math.PI) / 60000;
      let targetCap = 67.5 + 27.5 * Math.sin(nowMs * freq + offsets[targetZone]);
      targetCap += (Math.random() - 0.5) * 4; // Add noise
      targetCap = Math.max(0, Math.min(100, targetCap));
      
      const predictedCap = Math.min(100, targetCap + (Math.random() * 10 - 2)); 
      const areaName = ZONE_META[targetZone];
      
      let action = "None";
      let newSignage = "ENJOY THE EVENT";

      if (targetCap > criticalThreshold) {
        action = `CRITICAL: ${areaName} > ${criticalThreshold}%. Rerouting traffic.`;
        newSignage = `WARNING: ${areaName.toUpperCase()} CONGESTED. USE ALTERNATE ROUTES.`;
        setDispatchRoster(prev => [
          { id: 'Guard Unit Alpha', status: 'Deployed', zone: areaName },
          { id: 'Crowd Control Team B', status: prev[1].status, zone: prev[1].zone },
          { id: 'Perimeter Squad C', status: prev[2].status, zone: prev[2].zone }
        ]);
      } else if (targetCap >= warningThreshold) {
        action = `WARNING: ${areaName} density rising. Pre-positioning staff.`;
        newSignage = `PLEASE PROCEED CAREFULLY NEAR ${areaName.toUpperCase()}.`;
        setDispatchRoster(prev => [
          { id: 'Guard Unit Alpha', status: 'Monitoring', zone: areaName },
          { id: 'Crowd Control Team B', status: 'Standby', zone: 'None' },
          { id: 'Perimeter Squad C', status: prev[2].status, zone: prev[2].zone }
        ]);
      } else {
        action = `${areaName} Normal`;
        setDispatchRoster([
          { id: 'Guard Unit Alpha', status: 'Standby', zone: 'None' },
          { id: 'Crowd Control Team B', status: 'Standby', zone: 'None' },
          { id: 'Perimeter Squad C', status: 'Patrolling', zone: 'Outer Perimeter' }
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

        setZoneStates(prev => ({
          ...prev,
          [targetZone]: {
            current_capacity_pct: targetCap,
            predicted_capacity_pct_5m: predictedCap,
            meta_area: areaName
          }
        }));

        setChartData(prev => {
          const newData = [...prev, { time: timeStr, current: targetCap, predicted: predictedCap, zone: targetZone }];
          return newData.slice(-20);
        });

        setLogs(prev => {
          const newLogs = [...prev, { timestamp: now, zone_id: targetZone, action: action, cap: Math.round(targetCap) }];
          return newLogs.slice(-20);
        });
      }, 1300);

    }, 3500); // Run every 3.5 seconds

    return () => clearInterval(fallbackInterval);
  }, [wsStatus, eventData, criticalThreshold, warningThreshold]);

  // Simulate purely localized gate telemetry for the GateMonitor visualization
  // Runs faster (every 1s) and independently for visual flair
  useEffect(() => {
    if (!eventData || !eventData.gates) return;
    
    const gateInterval = setInterval(() => {
      setGateMetrics(prev => {
        const newMetrics = { ...prev };
        eventData.gates.forEach(gate => {
          const oldFlow = newMetrics[gate.id]?.flowRate || 40;
          const delta = Math.floor(Math.random() * 11) - 5; // -5 to +5
          const newFlow = Math.max(10, Math.min(150, oldFlow + delta));
          const newCongestion = Math.min(100, Math.max(0, Math.round((newFlow / 120) * 100)));
          
          newMetrics[gate.id] = {
            flowRate: newFlow,
            congestion: newCongestion,
            trend: newFlow > oldFlow ? 'up' : 'down'
          };
        });
        return newMetrics;
      });
    }, 1000);

    return () => clearInterval(gateInterval);
  }, [eventData]);

  if (!eventData) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50">
        <p className="text-slate-500 mb-4">No event selected.</p>
        <button onClick={() => navigate('/select-location')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center">
          <ArrowLeft size={16} className="mr-2" /> Return to Location Selector
        </button>
      </div>
    );
  }

  // True Edge-to-Edge full screen class for the main wrapper (removed max-w-[1600px] and mx-auto)
  return (
    <div className="h-full w-full flex flex-col overflow-hidden p-4 gap-4">
      
      {/* Header Info - Fixed Height */}
      <div className="flex-none flex justify-between items-center">
         <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Operational Dashboard</h2>
            <p className="text-xs sm:text-sm text-slate-500">{eventData.name} ({eventData.date})</p>
         </div>
         <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-medium bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
           <div className={`w-2 h-2 rounded-full ${(wsStatus.includes('Connected') || wsStatus.includes('Simulated')) ? 'bg-green-500' : 'bg-red-500'}`}></div>
           <span className="text-slate-600">STREAM: <span className="text-slate-900 block sm:inline">{wsStatus}</span></span>
         </div>
      </div>

      {/* Main Grid - Remaining Height, No Scroll on Container */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden w-full">
        
        {/* Left Column (7/12) */}
        <div className="lg:col-span-7 flex flex-col gap-4 overflow-hidden h-full">
          
          {/* Map (50% of column height) */}
          <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-1 min-h-0 relative z-0">
             <StadiumMap 
                zoneStates={zoneStates} 
                dynamicCenter={[eventData.centerLat, eventData.centerLng]} 
             />
          </div>
          
          {/* Chart & Diagnostics (50% of column height) */}
          <div className="flex-1 flex gap-4 min-h-0">
            <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm p-3 min-h-0 overflow-hidden">
              <OccupancyChart chartData={chartData} />
            </div>
            {/* ML Diagnostics Panel */}
            <div className="w-40 sm:w-48 bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex flex-col justify-center flex-none">
              <div className="flex items-center space-x-2 mb-4">
                <ActivitySquare size={16} className="text-indigo-600" />
                <h3 className="text-[10px] sm:text-xs font-bold text-slate-500 tracking-wider">XGBOOST ML</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 font-semibold tracking-wide">MEAN ABS ERROR</p>
                  <p className="text-sm sm:text-lg font-bold text-green-600">1.24%</p>
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 font-semibold tracking-wide">ROOT MEAN SQ</p>
                  <p className="text-sm sm:text-lg font-bold text-green-600">2.11%</p>
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 font-semibold tracking-wide">INFERENCE LATENCY</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800">14ms</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5/12) */}
        <div className="lg:col-span-5 flex flex-col gap-4 overflow-hidden h-full">
          
          {/* Agent Control Pipeline (Fixed Height) */}
          <div className="flex-none bg-white border border-slate-200 rounded-xl shadow-sm p-4">
             <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800">Agent Core Pipeline</h3>
                <div className="flex space-x-3">
                  <div className="flex items-center space-x-1.5 text-[10px] font-semibold">
                    <span className="text-amber-500">WARN:</span>
                    <input type="number" value={warningThreshold} onChange={(e) => setWarningThreshold(Number(e.target.value))} className="w-12 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 focus:outline-none focus:border-indigo-300" />
                  </div>
                  <div className="flex items-center space-x-1.5 text-[10px] font-semibold">
                    <span className="text-red-500">CRIT:</span>
                    <input type="number" value={criticalThreshold} onChange={(e) => setCriticalThreshold(Number(e.target.value))} className="w-12 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 focus:outline-none focus:border-indigo-300" />
                  </div>
                </div>
             </div>
             <AgentPipeline activeIndex={activeAgentIndex} messages={pipelineMessages} />
          </div>

          {/* New GateMonitor Widget */}
          <div className="flex-none max-h-[220px]">
             <GateMonitor gates={eventData.gates} gateMetrics={gateMetrics} />
          </div>

          {/* Dispatch & Signage (Fixed Height) */}
          <div className="flex-none flex gap-4 h-32">
            <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm p-3 flex flex-col min-w-0">
              <div className="flex items-center space-x-2 mb-2 text-slate-500">
                <MonitorPlay size={12} />
                <h3 className="text-[10px] font-bold tracking-wider">SIGNAGE</h3>
              </div>
              <div className="flex-1 border-4 border-slate-900 bg-black rounded p-2 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
                <p className={`text-amber-500 font-mono text-center font-bold text-xs uppercase tracking-widest leading-tight z-10 ${(activeSignage.includes('WARNING') || activeSignage.includes('ALERT')) ? 'animate-pulse' : ''}`}>
                  {activeSignage}
                </p>
              </div>
            </div>

            <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm p-3 flex flex-col min-w-0">
              <div className="flex items-center space-x-2 mb-2 text-slate-500">
                <Shield size={12} />
                <h3 className="text-[10px] font-bold tracking-wider">SECURITY PERSONNEL DISPATCH</h3>
              </div>
              <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
                {dispatchRoster.map(unit => (
                  <div key={unit.id} className="bg-slate-50 border border-slate-100 rounded p-1.5 flex justify-between items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-700 truncate max-w-[120px] flex-shrink-0">{unit.id}</span>
                    <div className="text-right flex-1 min-w-0 flex flex-col items-end">
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${unit.status.includes('Deployed') ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-slate-200 text-slate-600 border border-slate-300'}`}>
                        {unit.status.includes('Deployed') ? `Deployed to ${unit.zone}` : unit.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Terminal (Fills remaining height) */}
          <div className="flex-1 min-h-[150px] bg-slate-900 rounded-xl shadow-sm overflow-hidden flex flex-col">
             <AgentTerminal logs={logs} />
          </div>

        </div>
      </div>
    </div>
  );
}
