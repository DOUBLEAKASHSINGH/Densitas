import React, { memo } from 'react';
import { ActivitySquare } from 'lucide-react';

/**
 * Diagnostics panel displaying simulated ML telemetry stats.
 */
const MLDiagnostics = memo(function MLDiagnostics() {
  return (
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
  );
});

export default MLDiagnostics;
