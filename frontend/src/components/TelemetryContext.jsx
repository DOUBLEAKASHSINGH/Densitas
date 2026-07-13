import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocationContext } from './LocationContext';

const TelemetryContext = createContext();

export function useTelemetryContext() {
  return useContext(TelemetryContext);
}

const ZONE_META = {
  'A': 'Hall 1',
  'B': 'Hall 2',
  'C': 'Hall 3',
  'D': 'Open Arena'
};

export function TelemetryProvider({ children }) {
  const { eventData } = useLocationContext();

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
  
  const [gateMetrics, setGateMetrics] = useState({});

  // WebSocket Connection
  useEffect(() => {
    if (!eventData) return;

    let ws;
    try {
      ws = new WebSocket('wss://optiflow-backend-v0x3.onrender.com/ws/dashboard');
      
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

          setChartData(prevData => {
            const newIncomingPacket = { time: timeStr, current: targetCap, predicted: predictedCap, zone: targetZone };
            return [...prevData, newIncomingPacket].slice(-50);
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
  useEffect(() => {
    if (!eventData) return;
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
      targetCap += (Math.random() - 0.5) * 4;
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
        return newData.slice(-50);
      });

      setLogs(prev => {
        const newLogs = [...prev, { timestamp: now, zone_id: targetZone, action: action, cap: Math.round(targetCap) }];
        return newLogs.slice(-50);
      });

      setActiveAgentIndex(-1);
      setPipelineMessages(['', '', '', '']);

      setTimeout(() => { setActiveAgentIndex(0); setPipelineMessages([`Ingested ${targetZone}: ${Math.round(targetCap)}%`, '', '', '']); }, 50);
      setTimeout(() => { setActiveAgentIndex(1); setPipelineMessages([`Ingested ${targetZone}: ${Math.round(targetCap)}%`, `Forecasting ${targetZone}: ${Math.round(predictedCap)}%`, '', '']); }, 250);
      setTimeout(() => {
        setActiveAgentIndex(2);
        const decisionText = targetCap > criticalThreshold ? 'EVAC ROUTE' : (targetCap >= warningThreshold ? 'PRE-WARN' : 'NOMINAL');
        setPipelineMessages([`Ingested...`, `Forecasting...`, `Threshold: ${decisionText}`, '']);
      }, 500);
      setTimeout(() => {
        setActiveAgentIndex(3);
        setPipelineMessages([`Ingested...`, `Forecasting...`, `Threshold pass`, `Publishing...`]);
      }, 750);

    }, 1000);

    return () => clearInterval(fallbackInterval);
  }, [wsStatus, eventData, criticalThreshold, warningThreshold]);

  // Simulate purely localized gate telemetry for the GateMonitor visualization
  useEffect(() => {
    if (!eventData || !eventData.gates) return;
    
    const gateInterval = setInterval(() => {
      setGateMetrics(prev => {
        const newMetrics = { ...prev };
        eventData.gates.forEach(gate => {
          const oldFlow = newMetrics[gate.id]?.flowRate || 40;
          const delta = Math.floor(Math.random() * 11) - 5;
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

  const value = {
    zoneStates,
    chartData,
    logs,
    wsStatus,
    activeAgentIndex,
    pipelineMessages,
    warningThreshold,
    setWarningThreshold,
    criticalThreshold,
    setCriticalThreshold,
    activeSignage,
    dispatchRoster,
    gateMetrics
  };

  return (
    <TelemetryContext.Provider value={value}>
      {children}
    </TelemetryContext.Provider>
  );
}
