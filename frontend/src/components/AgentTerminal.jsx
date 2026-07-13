import React, { useEffect, useRef } from 'react';
import { Terminal, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function AgentTerminal({ logs }) {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-xl shadow-inner font-mono text-xs">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/50">
        <div className="flex items-center space-x-2 text-slate-400">
          <Terminal size={14} />
          <span className="uppercase tracking-widest text-[10px] font-bold">Live Event Activity</span>
        </div>
        <div className="flex space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
        </div>
      </div>

      {/* Terminal Body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {logs.length === 0 ? (
          <div className="text-slate-600 italic text-center mt-10">Awaiting telemetry stream...</div>
        ) : (
          logs.map((log, i) => {
            const isWarning = log.action.includes('WARNING') || log.action.includes('ALERT');
            const isCritical = log.action.includes('CRITICAL');
            const isNominal = log.action === 'None';

            let textColor = 'text-slate-300';
            let icon = null;

            if (isCritical) {
              textColor = 'text-red-400 font-bold';
              icon = <ShieldAlert size={14} className="inline mr-2 text-red-500 animate-pulse" />;
            } else if (isWarning) {
              textColor = 'text-amber-400';
              icon = <AlertTriangle size={14} className="inline mr-2 text-amber-500" />;
            } else {
              textColor = 'text-indigo-300';
            }

            return (
              <div key={i} className={`flex flex-col ${isCritical ? 'bg-red-900/20 p-2 rounded border border-red-500/20' : ''} transition-all duration-300`}>
                <span className="text-slate-500 text-[10px] mb-1">
                  [{log.timestamp.split('T')[1]?.split('.')[0] || log.timestamp}] ZONE: {log.zone_id}
                </span>
                <span className={`${textColor} break-words`}>
                  {icon} {isNominal ? `> Traffic nominal (Cap: ${log.cap}%)` : `> DECISION_AGENT: ${log.action}`}
                </span>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
}
