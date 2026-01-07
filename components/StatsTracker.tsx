
import React from 'react';
import { AgentStats } from '../types';

interface StatsTrackerProps {
  stats: AgentStats;
}

const StatsTracker: React.FC<StatsTrackerProps> = ({ stats }) => {
  const StatBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-[10px] font-mono">
        <span className="text-slate-400 uppercase">{label}</span>
        <span className="text-slate-300">{Math.round(value)}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000`} 
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <StatBar label="Confidence" value={stats.confidence} color="bg-blue-500" />
      <StatBar label="Stability" value={stats.stability} color="bg-purple-500" />
      <StatBar label="Growth" value={stats.growth} color="bg-emerald-500" />
    </div>
  );
};

export default StatsTracker;
