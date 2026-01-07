
import React from 'react';
import { FutureAgent } from '../types';

interface AgentCardProps {
  agent: FutureAgent;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  return (
    <div className="space-y-6">
      <div className="relative group overflow-hidden rounded-2xl">
        {agent.imageUrl ? (
          <img 
            src={agent.imageUrl} 
            className="w-full h-48 object-cover rounded-2xl shadow-2xl border border-slate-800 mb-0 transition-all duration-1000 animate-in fade-in group-hover:scale-[1.05]" 
            alt={agent.name} 
          />
        ) : (
          <div className="w-full h-48 bg-slate-900 flex flex-col items-center justify-center border border-slate-800 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent animate-[scan_2s_linear_infinite]"></div>
            <div className="w-10 h-10 border border-slate-700 rounded-full flex items-center justify-center animate-pulse mb-2">
               <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <span className="text-slate-700 text-[9px] font-bold font-mono tracking-widest uppercase">Neural Scanning</span>
          </div>
        )}
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-[8px] font-bold text-blue-400 uppercase tracking-widest z-10">
          Verified ID
        </div>
      </div>

      <div>
        <h4 className="text-xl font-bold text-white mb-2">{agent.name}</h4>
        <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-blue-500/30 pl-3">
          {agent.backstory}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 block">Neural Architecture</span>
          <div className="flex flex-wrap gap-2">
            {agent.values.map(v => (
              <span key={v} className="px-2 py-1 bg-slate-900 text-slate-300 border border-slate-800 rounded-md text-[10px] font-medium">
                {v}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-900/5 rounded-xl border border-blue-500/10">
            <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest mb-2 block">Acquisitions</span>
            <ul className="text-[10px] text-slate-400 space-y-1">
              {agent.strengths.slice(0, 2).map(s => <li key={s} className="truncate">• {s}</li>)}
            </ul>
          </div>
          <div className="p-3 bg-red-900/5 rounded-xl border border-red-500/10">
            <span className="text-[8px] font-bold text-red-400 uppercase tracking-widest mb-2 block">Divergence</span>
            <ul className="text-[10px] text-slate-400 space-y-1">
              {agent.regrets.slice(0, 2).map(r => <li key={r} className="truncate">• {r}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
};

export default AgentCard;
