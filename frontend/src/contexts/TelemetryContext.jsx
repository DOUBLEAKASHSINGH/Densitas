import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useLocationContext } from './LocationContext';
import { useWebSocket } from '../hooks/useWebSocket';

const TelemetryContext = createContext();

/**
 * Hook to consume active spatial telemetry streams and component state.
 * @returns {Object} Extracted dashboard telemetry context variables
 */
export function useTelemetryContext() {
  return useContext(TelemetryContext);
}

const ZONE_META = {
  'A': 'Hall 1',
  'B': 'Hall 2',
  'C': 'Hall 3',
  'D': 'Open Arena'
};

/**
 * Provider that aggregates raw WebSocket data into UI-ready state buffers.
 */
export function TelemetryProvider({ children }) {
  const { eventData } = useLocationContext();

  const [zoneStates, setZoneStates] = useState({});
  const [chartData, setChartData] = useState([]);
  const chartBufferRef = useRef([]);
  const [logs, setLogs] = useState([]);
  
  const [activeAgentIndex, setActiveAgentIndex] = useState(-1);
  const [pipelineMessages, setPipelineMessages] = useState(['', '', '', '']);

  const [warningThreshold, setWarningThreshold] = useState(70);
  const [criticalThreshold, setCriticalThreshold] = useState(85);
  const [activeSignage, setActiveSignage] = useState("WELCOME TO THE EVENT");
  const [dispatchRoster, setDispatchRoster] = useState([
    { id: 'Guard Unit Alpha', status: 'Standby', zone: 'None' },
    { id: 'Crowd Control Team B', status: 'Standby', zone: 'None' },
    { id: 'Perimeter Squad C', status: 'Patrolling', zone: 'Outer Perimeter' }
  ]);
  
  const [gateMetrics, setGateMetrics] = useState({});

  /**
   * Main telemetry pipeline. Converts raw packets into dispatch logic and array buffers.
   */
  const handleIncomingPacket = useCallback((data) => {
    const zoneMap = { 'Hall 1': 'A', 'Hall 2': 'B', 'Hall 3': 'C', 'Open Arena': 'D', 'HITEX-H1': 'A', 'HITEX-H3': 'C', 'BH-OA': 'D' };
    const targetZone = zoneMap[data.zone_id] || data.zone_id;
    
    const targetCap = data.current_capacity;
    const predictedCap = data.predicted_capacity;
    const action = data.agent_log || 'None';
    const timestamp = data.timestamp || new Date().toISOString();
    const timeStr = timestamp.includes('T') ? timestamp.split('T')[1].substring(0, 8) : timestamp;
    const areaName = ZONE_META[targetZone] || `Zone ${targetZone}`;

    let newSignage = "ENJOY THE EVENT";
    let internalAction = action;

    if (targetCap > criticalThreshold || action.includes('CRITICAL')) {
      newSignage = `WARNING: ${areaName.toUpperCase()} CONGESTED. USE ALTERNATE ROUTES.`;
      internalAction = `CRITICAL: ${areaName} > ${criticalThreshold}%. Rerouting traffic.`;
      setDispatchRoster(prev => [
        { id: 'Guard Unit Alpha', status: 'Deployed', zone: areaName },
        { id: 'Crowd Control Team B', status: prev[1].status, zone: prev[1].zone },
        { id: 'Perimeter Squad C', status: prev[2].status, zone: prev[2].zone }
      ]);
    } else if (targetCap >= warningThreshold || action.includes('WARNING')) {
      newSignage = `PLEASE PROCEED CAREFULLY NEAR ${areaName.toUpperCase()}.`;
      internalAction = `WARNING: ${areaName} density rising. Pre-positioning staff.`;
      setDispatchRoster(prev => [
        { id: 'Guard Unit Alpha', status: 'Monitoring', zone: areaName },
        { id: 'Crowd Control Team B', status: 'Standby', zone: 'None' },
        { id: 'Perimeter Squad C', status: prev[2].status, zone: prev[2].zone }
      ]);
    } else {
      internalAction = `${areaName} Normal`;
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

    chartBufferRef.current.push({ time: timeStr, current: targetCap, predicted: predictedCap, zone: targetZone });

    setLogs(prev => {
      const newLogs = [...prev, { timestamp, zone_id: targetZone, action: internalAction, cap: Math.round(targetCap) }];
      return newLogs.slice(-50);
    });

    // Accelerated visual pipeline steps to fit within 1 second tick
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

  }, [criticalThreshold, warningThreshold]);

  // Hook handles connection state independently
  const wsStatus = useWebSocket(eventData, handleIncomingPacket);

  // 3-Second Graph Buffering Interval
  useEffect(() => {
    const chartInterval = setInterval(() => {
      if (chartBufferRef.current.length > 0) {
        const buffer = chartBufferRef.current;
        const avgCurrent = buffer.reduce((sum, p) => sum + p.current, 0) / buffer.length;
        const avgPredicted = buffer.reduce((sum, p) => sum + p.predicted, 0) / buffer.length;
        const latest = buffer[buffer.length - 1];
        
        setChartData(prevData => {
          const newPoint = { 
            time: latest.time, 
            current: avgCurrent, 
            predicted: avgPredicted, 
            zone: latest.zone 
          };
          return [...prevData, newPoint].slice(-50);
        });
        
        chartBufferRef.current = [];
      }
    }, 3000);

    return () => clearInterval(chartInterval);
  }, []);

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
