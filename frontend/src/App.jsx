import React, { useState, useEffect } from 'react';
import StadiumMap from './components/StadiumMap';
import OccupancyChart from './components/OccupancyChart';
import AgentTerminal from './components/AgentTerminal';
import { Activity } from 'lucide-react';

function App() {
  const [zoneStates, setZoneStates] = useState({});
  const [chartData, setChartData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [wsStatus, setWsStatus] = useState('Connecting...');

  useEffect(() => {
    // Connect to FastAPI WebSocket (use env var for cloud deployment, fallback to localhost)
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/dashboard';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setWsStatus('Connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const timeStr = data.timestamp.split('T')[1]?.substring(0, 8) || '00:00:00';

        // 1. Update Map State (latest for each zone)
        setZoneStates(prev => ({
          ...prev,
          [data.zone_id]: data
        }));

        // 2. Update Chart Data
        setChartData(prev => {
          const newData = [...prev, {
            time: timeStr,
            current: data.current_capacity_pct,
            predicted: data.predicted_capacity_pct_5m,
            zone: data.zone_id
          }];
          // Keep last 30 ticks
          return newData.slice(-30);
        });

        // 3. Update Terminal Logs
        setLogs(prev => {
          const newLogs = [...prev, {
            timestamp: data.timestamp,
            zone_id: data.zone_id,
            action: data.action_required,
            cap: data.current_capacity_pct
          }];
          return newLogs.slice(-50); // Keep last 50 logs
        });

      } catch (err) {
        console.error("Failed to parse WS message", err);
      }
    };

    ws.onclose = () => {
      setWsStatus('Disconnected');
      // Simple reconnect logic for hackathon robustness
      setTimeout(() => setWsStatus('Reconnecting...'), 3000);
    };

    return () => ws.close();
  }, [wsStatus]);

  return (
    <div className="h-screen bg-gray-950 text-gray-100 p-4 font-sans selection:bg-neon-cyan/30 overflow-hidden flex flex-col">
      
      {/* Header */}
      <header className="flex justify-between items-center mb-4 px-2 shrink-0">
        <div className="flex items-center space-x-3">
          <Activity className="text-neon-cyan animate-pulse" size={28} />
          <h1 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-blue-500 uppercase">
            OptiFlow <span className="text-gray-500 font-light text-xl">Command Center</span>
          </h1>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]">
          <div className={`w-2 h-2 rounded-full ${wsStatus === 'Connected' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`}></div>
          <span className="text-gray-400">DATA STREAM: <span className="text-white">{wsStatus}</span></span>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 pb-2">
        
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
    </div>
  );
}

export default App;
