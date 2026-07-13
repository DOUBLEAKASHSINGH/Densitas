import React, { memo } from 'react';
import { MonitorPlay, Shield } from 'lucide-react';

/**
 * @typedef {Object} RosterUnit
 * @property {string} id
 * @property {string} status
 * @property {string} zone
 */

/**
 * @param {Object} props
 * @param {string} props.activeSignage
 * @param {RosterUnit[]} props.dispatchRoster
 */
const DispatchPanel = memo(function DispatchPanel({ activeSignage, dispatchRoster }) {
  return (
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
  );
});

export default DispatchPanel;
