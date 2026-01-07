
import React from 'react';
import { FutureAgent } from '../types';

interface TimelineViewProps {
  agents: FutureAgent[];
  activeAgentId: string;
  onSelectAgent: (id: string) => void;
}

const TimelineView: React.FC<TimelineViewProps> = ({ agents, activeAgentId, onSelectAgent }) => {
  return (
    <div className="relative flex flex-col gap-3 py-2">
      <div className="absolute left-[27px] top-6 bottom-6 w-[1px] bg-slate-800"></div>
      
      {agents.map((agent) => (
        <button
          key={agent.id}
          onClick={() => onSelectAgent(agent.id)}
          className={`relative z-10 flex items-center gap-4 group text-left transition-all p-3 rounded-2xl border ${
            activeAgentId === agent.id ? 'bg-slate-800/50 border-blue-500/50 shadow-lg' : 'hover:bg-slate-800/30 border-transparent'
          }`}
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all relative overflow-hidden ${
            activeAgentId === agent.id 
              ? 'border-blue-500 scale-105 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
              : 'border-slate-800 grayscale opacity-60'
          }`}>
             {agent.imageUrl ? (
               <img src={agent.imageUrl} className="w-full h-full object-cover" alt="" />
             ) : (
               <div className="bg-slate-900 w-full h-full flex items-center justify-center">
                 <span className="text-[10px] font-bold text-white">{agent.type.split(' ')[0][0]}</span>
               </div>
             )}
             <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-transparent transition-colors"></div>
          </div>
          
          <div className="flex flex-col flex-1 min-w-0">
            <span className={`text-[9px] font-bold uppercase tracking-[0.2em] mb-0.5 ${
                activeAgentId === agent.id ? 'text-blue-400' : 'text-slate-500'
            }`}>
              {agent.type}
            </span>
            <span className={`text-sm font-semibold truncate ${
                activeAgentId === agent.id ? 'text-white' : 'text-slate-400'
            }`}>
              {agent.name}
            </span>
          </div>

          {activeAgentId === agent.id && (
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
          )}
        </button>
      ))}
    </div>
  );
};

export default TimelineView;
