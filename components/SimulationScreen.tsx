
import React, { useState, useEffect } from 'react';

const STATUS_MESSAGES = [
  "Initializing Temporal Anchors...",
  "Calibrating Chronal Nodes...",
  "Mapping Divergent Realities...",
  "Synthesizing Neural Profiles...",
  "Resolving Potential Paradoxes...",
  "Establishing Multi-Agent Uplink...",
  "Hardening Reality Substrate...",
  "Finalizing Temporal Trajectories..."
];

const SimulationScreen: React.FC = () => {
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIdx((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center relative overflow-hidden bg-[#0a0a0c]">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.1)_0%,_transparent_70%)]"></div>
      
      {/* Abstract Neural Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>
      </div>

      {/* Abstract Visualization: Data Rings */}
      <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
        <div className="absolute inset-0 border border-blue-500/5 rounded-full animate-[ping_4s_linear_infinite]"></div>
        <div className="absolute inset-10 border border-slate-800 rounded-full"></div>
        <div className="absolute inset-12 border-t-2 border-blue-500/40 rounded-full animate-spin [animation-duration:8s]"></div>
        <div className="absolute inset-20 border-b-2 border-purple-500/40 rounded-full animate-spin [animation-duration:5s] [animation-direction:reverse]"></div>
        
        {/* Subtle Inner Pulse */}
        <div className="relative w-4 h-4">
           <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-pulse blur-xl"></div>
           <div className="w-full h-full bg-blue-500 rounded-full opacity-20"></div>
        </div>
      </div>

      {/* Status Messages */}
      <div className="relative z-10 space-y-8">
        <div className="flex flex-col items-center gap-6">
          <div className="w-64 h-[1px] bg-slate-800 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-[loading_2s_ease-in-out_infinite]"></div>
          </div>
          
          <div className="space-y-1">
            <p className="text-blue-400 font-mono text-sm animate-pulse tracking-wide uppercase">
              {STATUS_MESSAGES[statusIdx]}
            </p>
            <p className="text-[9px] text-slate-600 font-mono tracking-[0.5em] uppercase opacity-50">
              Neural Sync in Progress
            </p>
          </div>
        </div>
      </div>

      {/* Decorative HUD Elements */}
      <div className="absolute bottom-12 right-12 opacity-10 hidden md:block">
        <div className="text-[9px] font-mono text-slate-500 space-y-1 text-right">
          <div>BLOCK_ID: 0x8F2A...</div>
          <div>ENTROPY: 0.0021</div>
          <div>LATENCY: 12ms</div>
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default SimulationScreen;
