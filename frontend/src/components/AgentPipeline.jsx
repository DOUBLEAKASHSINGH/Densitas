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
    <div className="flex items-center justify-between bg-gray-900/50 rounded-xl p-3 border border-gray-800 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]">
      {agents.map((agent, i) => {
        const isActive = activeIndex === i;
        const isPast = activeIndex > i;
        
        // Colors
        let borderClass = 'border-gray-700';
        let bgClass = 'bg-gray-950';
        let textClass = 'text-gray-500';
        let glowClass = '';

        if (isActive) {
          borderClass = 'border-neon-cyan';
          bgClass = 'bg-neon-cyan/10';
          textClass = 'text-neon-cyan font-bold';
          glowClass = 'shadow-[0_0_10px_rgba(0,243,255,0.4)]';
        } else if (isPast) {
          borderClass = 'border-gray-600';
          textClass = 'text-gray-300';
        }

        return (
          <React.Fragment key={agent.name}>
            <div className={`flex flex-col items-center justify-center p-2 rounded-lg border ${borderClass} ${bgClass} ${glowClass} transition-all duration-300 w-1/4 max-w-[120px] text-center`}>
              <div className={`mb-1 ${textClass} ${isActive ? 'animate-pulse' : ''}`}>
                {agent.icon}
              </div>
              <div className={`text-[10px] uppercase tracking-wider ${textClass}`}>
                {agent.name}
              </div>
              <div className="h-4 mt-1 overflow-hidden flex items-center justify-center">
                <span className={`text-[9px] font-mono whitespace-nowrap opacity-80 ${isActive ? 'text-white' : 'text-transparent'}`}>
                  {messages[i] || '...'}
                </span>
              </div>
            </div>
            
            {i < agents.length - 1 && (
              <div className="px-1">
                <ChevronRight size={14} className={isPast ? 'text-neon-cyan' : 'text-gray-700'} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
