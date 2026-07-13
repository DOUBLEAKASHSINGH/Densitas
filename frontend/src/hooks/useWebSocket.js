import { useEffect, useState, useRef } from 'react';

/**
 * @typedef {Object} TelemetryPacket
 * @property {string} zone_id - Target zone (A, B, C, D)
 * @property {number} current_capacity - Real-time occupancy percentage (0-100)
 * @property {number} predicted_capacity - Machine learning forecasted capacity (0-100)
 * @property {string} [agent_log] - Optional specific agent action taken
 * @property {string} timestamp - ISO timestamp of the packet
 */

/**
 * Custom hook managing WebSocket connection and localized ML simulation.
 * @param {Object} eventData - Active event data payload
 * @param {function(TelemetryPacket): void} onPacketReceived - Callback fired instantaneously upon new packet ingestion
 * @returns {string} The active connection status ('Connecting...', 'Connected (Local Live)', 'Simulated')
 */
export function useWebSocket(eventData, onPacketReceived) {
  const [wsStatus, setWsStatus] = useState('Connecting...');
  
  // Keep the latest callback in a ref to avoid recreating loops on every render
  const callbackRef = useRef(onPacketReceived);
  useEffect(() => {
    callbackRef.current = onPacketReceived;
  }, [onPacketReceived]);

  // Phase 1: Real WebSocket
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
          callbackRef.current(data);
        } catch (err) {
          console.error("Failed to parse websocket message", err);
        }
      };

      ws.onclose = () => setWsStatus('Simulated');
      ws.onerror = () => setWsStatus('Simulated');
    } catch (e) {
      setWsStatus('Simulated');
    }

    return () => {
      if (ws) ws.close();
    };
  }, [eventData]);

  // Phase 2: Simulation Fallback
  useEffect(() => {
    if (!eventData || wsStatus !== 'Simulated') return;

    const fallbackInterval = setInterval(() => {
      const nowMs = Date.now();
      const zones = ['A', 'B', 'C', 'D'];
      const offsets = { 'A': 0, 'B': Math.PI / 2, 'C': Math.PI, 'D': 3 * Math.PI / 2 };
      const targetZone = zones[Math.floor(Math.random() * zones.length)];
      
      const freq = (2 * Math.PI) / 60000;
      let targetCap = 67.5 + 27.5 * Math.sin(nowMs * freq + offsets[targetZone]);
      targetCap += (Math.random() - 0.5) * 4;
      targetCap = Math.max(0, Math.min(100, targetCap));
      const predictedCap = Math.min(100, targetCap + (Math.random() * 10 - 2)); 

      callbackRef.current({
        zone_id: targetZone,
        current_capacity: targetCap,
        predicted_capacity: predictedCap,
        timestamp: new Date(nowMs).toISOString(),
        agent_log: 'None'
      });
    }, 1000);

    return () => clearInterval(fallbackInterval);
  }, [wsStatus, eventData]);

  return wsStatus;
}
