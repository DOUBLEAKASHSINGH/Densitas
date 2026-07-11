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
    <div className="h-full flex flex-col bg-gray-950 rounded-xl border border-gray-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] font-mono text-xs">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900/80 rounded-t-xl">
        <div className="flex items-center space-x-2 text-gray-400">
          <Terminal size={14} />
          <span className="uppercase tracking-widest text-[10px]">Deterministic Agent Log</span>
        </div>
        <div className="flex space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-700"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-gray-700"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-gray-700"></div>
        </div>
      </div>

      {/* Terminal Body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {logs.length === 0 ? (
          <div className="text-gray-600 italic text-center mt-10">Awaiting telemetry stream...</div>
        ) : (
          logs.map((log, i) => {
            const isWarning = log.action.includes('WARNING') || log.action.includes('ALERT');
            const isCritical = log.action.includes('CRITICAL');
            const isNominal = log.action === 'None';

            let textColor = 'text-gray-400';
            let icon = null;

            if (isCritical) {
              textColor = 'text-neon-red font-bold';
              icon = <ShieldAlert size={14} className="inline mr-2 text-neon-red animate-pulse" />;
            } else if (isWarning) {
              textColor = 'text-neon-amber';
              icon = <AlertTriangle size={14} className="inline mr-2 text-neon-amber" />;
            } else {
              textColor = 'text-neon-cyan/70';
            }

            return (
              <div key={i} className={`flex flex-col ${isCritical ? 'bg-neon-red/10 p-2 rounded border border-neon-red/20' : ''} transition-all duration-300`}>
                <span className="text-gray-500 text-[10px] mb-1">
                  [{log.timestamp.split('T')[1]?.split('.')[0] || log.timestamp}] ZONE {log.zone_id}
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
