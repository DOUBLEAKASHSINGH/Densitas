import React from 'react';
import { Cpu, BrainCircuit, Scale, RadioTower, ChevronRight } from 'lucide-react';

export default function AgentPipeline({ activeIndex, messages }) {
  const agents = [
    { name: 'DensityAgent', icon: <Cpu size={16} /> },
    { name: 'PredictionAgent', icon: <BrainCircuit size={16} /> },
    { name: 'DecisionAgent', icon: <Scale size={16} /> },
    { name: 'AlertAgent', icon: <RadioTower size={16} /> }
  ];

  return (
    <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3 border border-slate-200">
      {agents.map((agent, i) => {
        const isActive = activeIndex === i;
        const isPast = activeIndex > i;
        
        // Colors
        let borderClass = 'border-slate-200';
        let bgClass = 'bg-white';
        let textClass = 'text-slate-400';
        let shadowClass = '';

        if (isActive) {
          borderClass = 'border-indigo-500';
          bgClass = 'bg-indigo-50';
          textClass = 'text-indigo-600 font-bold';
          shadowClass = 'shadow-sm';
        } else if (isPast) {
          borderClass = 'border-slate-300';
          textClass = 'text-slate-600';
        }

        return (
          <React.Fragment key={agent.name}>
            <div className={`flex flex-col items-center justify-center p-2 rounded-lg border ${borderClass} ${bgClass} ${shadowClass} transition-all duration-300 w-1/4 max-w-[120px] text-center`}>
              <div className={`mb-1 ${textClass} ${isActive ? 'animate-pulse' : ''}`}>
                {agent.icon}
              </div>
              <div className={`text-[10px] uppercase tracking-wider ${textClass}`}>
                {agent.name}
              </div>
              <div className="h-4 mt-1 overflow-hidden flex items-center justify-center">
                <span className={`text-[9px] font-mono whitespace-nowrap opacity-80 ${isActive ? 'text-indigo-900' : 'text-transparent'}`}>
                  {messages[i] || '...'}
                </span>
              </div>
            </div>
            
            {i < agents.length - 1 && (
              <div className="px-1">
                <ChevronRight size={14} className={isPast ? 'text-indigo-600' : 'text-slate-300'} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
