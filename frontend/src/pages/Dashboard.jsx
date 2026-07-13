import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StadiumMap from '../components/StadiumMap';
import OccupancyChart from '../components/OccupancyChart';
import AgentTerminal from '../components/AgentTerminal';
import AgentPipeline from '../components/AgentPipeline';
import GateMonitor from '../components/GateMonitor';
import DispatchPanel from '../components/DispatchPanel';
import { useLocationContext } from '../contexts/LocationContext';
import { useTelemetryContext } from '../contexts/TelemetryContext';
import { ArrowLeft, Users, TrendingUp, AlertTriangle, ShieldCheck, DoorOpen, Radio } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { eventData } = useLocationContext();

  useEffect(() => {
    if (!eventData) {
      navigate('/select-location');
    }
  }, [eventData, navigate]);

  const {
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
  } = useTelemetryContext();

  // --- KPI Aggregation Logic ---
  const { currentVisitors, predictedVisitors, riskLevel, activeAlerts } = useMemo(() => {
    let currentSum = 0;
    let predictedSum = 0;
    let maxCap = 0;
    const zones = Object.values(zoneStates);
    
    if (zones.length > 0) {
      zones.forEach(z => {
        currentSum += (z.current_capacity_pct * 125); // Mock physical conversion
        predictedSum += (z.predicted_capacity_pct_5m * 125);
        if (z.current_capacity_pct > maxCap) maxCap = z.current_capacity_pct;
      });
    }

    let risk = { label: "Normal", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
    if (maxCap > 85) risk = { label: "Critical", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
    else if (maxCap >= 70) risk = { label: "Elevated", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" };

    const alerts = pipelineMessages.filter(m => m.type === 'critical' || m.type === 'warning').length;

    return {
      currentVisitors: Math.round(currentSum).toLocaleString(),
      predictedVisitors: Math.round(predictedSum).toLocaleString(),
      riskLevel: risk,
      activeAlerts: alerts
    };
  }, [zoneStates, pipelineMessages]);

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

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50/50 pb-20">
      
      {/* 1. Dashboard Header */}
      <div className="w-full px-6 py-6 bg-white border-b border-slate-200 sticky top-0 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Enterprise Command Center</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">{eventData.name} &bull; {eventData.city} &bull; {eventData.date}</p>
        </div>
        <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
          <Radio size={16} className={(wsStatus.includes('Connected') || wsStatus.includes('Simulated')) ? 'text-green-500 animate-pulse' : 'text-red-500'} />
          <span className="text-xs font-bold text-slate-700 tracking-wider uppercase">Telemetry: <span className={(wsStatus.includes('Connected') || wsStatus.includes('Simulated')) ? 'text-green-600' : 'text-red-600'}>{wsStatus}</span></span>
        </div>
      </div>

      {/* Main Content Wrapper */}
      <div className="w-full max-w-[1800px] mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">

        {/* 2. Live KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:border-indigo-200 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-slate-500">Total Density</span>
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Users size={16} /></div>
            </div>
            <div className="text-2xl font-black text-slate-900">{currentVisitors}</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">Live physical count</div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:border-indigo-200 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-slate-500">Predicted (5m)</span>
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600"><TrendingUp size={16} /></div>
            </div>
            <div className="text-2xl font-black text-slate-900">{predictedVisitors}</div>
            <div className="text-xs font-semibold text-indigo-500 mt-1">XGBoost forecasted</div>
          </div>

          <div className={`rounded-2xl shadow-sm border p-5 transition-colors ${riskLevel.bg} ${riskLevel.border}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-bold ${riskLevel.color}`}>Risk Level</span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white ${riskLevel.color}`}><AlertTriangle size={16} /></div>
            </div>
            <div className={`text-2xl font-black ${riskLevel.color}`}>{riskLevel.label}</div>
            <div className={`text-xs font-semibold mt-1 opacity-80 ${riskLevel.color}`}>Spatial saturation</div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:border-indigo-200 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-slate-500">Active Gates</span>
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><DoorOpen size={16} /></div>
            </div>
            <div className="text-2xl font-black text-slate-900">{eventData.gates?.length || 0}</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">Processing checkpoints</div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:border-indigo-200 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-slate-500">System Alerts</span>
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600"><AlertTriangle size={16} /></div>
            </div>
            <div className="text-2xl font-black text-slate-900">{activeAlerts}</div>
            <div className="text-xs font-semibold text-amber-600 mt-1">Unresolved warnings</div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:border-indigo-200 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-slate-500">Security Units</span>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700"><ShieldCheck size={16} /></div>
            </div>
            <div className="text-2xl font-black text-slate-900">{dispatchRoster.length}</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">Active guard patrols</div>
          </div>

        </div>

        {/* 3. Interactive Venue Map & 4. Occupancy Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-2 overflow-hidden flex flex-col h-[500px]">
            <div className="px-4 pt-3 pb-2 flex justify-between items-center bg-white z-10">
              <h3 className="text-sm font-bold text-slate-800">Geospatial Intelligence Map</h3>
              <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded uppercase tracking-wider">Live View</span>
            </div>
            <div className="flex-1 relative rounded-xl overflow-hidden border border-slate-100">
               <StadiumMap zoneStates={zoneStates} />
            </div>
          </div>

          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col h-[500px]">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Saturation Timelines</h3>
            <div className="flex-1 min-h-0">
               <OccupancyChart chartData={chartData} />
            </div>
          </div>
        </div>

        {/* 5. Gate Monitoring & Security Deployment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col h-[400px]">
            <GateMonitor gates={eventData.gates} gateMetrics={gateMetrics} />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col h-[400px]">
            <DispatchPanel activeSignage={activeSignage} dispatchRoster={dispatchRoster} />
          </div>
        </div>

        {/* 6. Agent Logic & Event Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col h-[450px]">
             <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800">Automated Mitigation Agent</h3>
                <div className="flex space-x-3">
                  <div className="flex items-center space-x-2 text-xs font-semibold">
                    <span className="text-orange-500 uppercase">Warn:</span>
                    <input type="number" value={warningThreshold} onChange={(e) => setWarningThreshold(Number(e.target.value))} className="w-14 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-semibold">
                    <span className="text-red-500 uppercase">Crit:</span>
                    <input type="number" value={criticalThreshold} onChange={(e) => setCriticalThreshold(Number(e.target.value))} className="w-14 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                </div>
             </div>
             <div className="flex-1 overflow-hidden">
               <AgentPipeline activeIndex={activeAgentIndex} messages={pipelineMessages} />
             </div>
          </div>

          <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 flex flex-col h-[450px] overflow-hidden">
             <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
               <h3 className="text-sm font-bold text-slate-300 flex items-center"><Radio size={14} className="mr-2 text-emerald-400" /> Raw Telemetry Firehose</h3>
             </div>
             <div className="flex-1 min-h-0">
               <AgentTerminal logs={logs} />
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
