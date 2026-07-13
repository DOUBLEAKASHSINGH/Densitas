import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StadiumMap from '../components/StadiumMap';
import OccupancyChart from '../components/OccupancyChart';
import AgentTerminal from '../components/AgentTerminal';
import AgentPipeline from '../components/AgentPipeline';
import GateMonitor from '../components/GateMonitor';
import { ActivitySquare, MonitorPlay, ShieldAlert, ArrowLeft, Shield } from 'lucide-react';
import { useLocationContext } from '../components/LocationContext';
import { useTelemetryContext } from '../components/TelemetryContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { eventData } = useLocationContext();

  useEffect(() => {
    if (!eventData) {
      navigate('/select-location');
    }
  }, [eventData, navigate]);

  if (!eventData) return null;

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
    <div className="min-h-screen w-full flex flex-col p-4 gap-4">
      
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
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
        
        {/* Left Column (7/12) */}
        <div className="lg:col-span-7 flex flex-col gap-4 h-full">
          
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
                  <p className="text-sm sm:text-lg font-bold text-green-600">14.79</p>
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 font-semibold tracking-wide">R² SCORE</p>
                  <p className="text-sm sm:text-lg font-bold text-green-600">0.9987</p>
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
        <div className="lg:col-span-5 flex flex-col gap-4 h-full">
          
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
          <div className="flex-1 min-h-[250px] bg-slate-900 rounded-xl shadow-sm overflow-hidden flex flex-col">
             <AgentTerminal logs={logs} />
          </div>

        </div>
      </div>
    </div>
  );
}
