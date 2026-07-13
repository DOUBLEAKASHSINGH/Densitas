import React from 'react';
import { DoorOpen, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

export default function GateMonitor({ gates, gateMetrics }) {
  if (!gates || gates.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5 flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center">
          <DoorOpen size={16} className="mr-2 text-indigo-500" /> Venue Entry Monitoring
        </h3>
        <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold bg-slate-50 px-2 py-1 rounded">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>LIVE TELEMETRY</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto min-h-0 pr-1">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {gates.map((gate, idx) => {
            // Read simulated metrics or fallback to defaults
            const metrics = gateMetrics[gate.id] || { flowRate: 45, congestion: 20, trend: 'up' };
            const isCongested = metrics.congestion > 75;

            return (
              <div 
                key={gate.id} 
                className={`flex flex-col border rounded-lg p-3 transition-colors ${
                  isCongested ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-slate-50 hover:border-indigo-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-slate-700 truncate pr-2" title={gate.id}>{gate.id}</span>
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    gate.type === 'primary' ? 'bg-indigo-100 text-indigo-700' :
                    gate.type === 'freight' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {gate.type}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <div>
                    <span className="block text-[9px] text-slate-500 font-semibold uppercase tracking-wider">Flow/Min</span>
                    <div className="flex items-center mt-0.5">
                      <span className={`text-sm font-bold ${isCongested ? 'text-red-700' : 'text-slate-900'}`}>{metrics.flowRate}</span>
                      {metrics.trend === 'up' 
                        ? <ArrowUpRight size={12} className="ml-1 text-amber-500" />
                        : <ArrowDownRight size={12} className="ml-1 text-green-500" />
                      }
                    </div>
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-500 font-semibold uppercase tracking-wider">Index</span>
                    <div className="flex items-center mt-0.5">
                      <span className={`text-sm font-bold ${isCongested ? 'text-red-700' : 'text-slate-900'}`}>{metrics.congestion}%</span>
                      {isCongested && <Activity size={12} className="ml-1 text-red-500 animate-pulse" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
