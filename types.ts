
export enum FutureAgentType {
  NEAR = 'Near Future (1 Year)',
  MID = 'Mid Future (5 Years)',
  FAR = 'Far Future (20 Years)'
}

export interface AgentStats {
  confidence: number;
  stability: number;
  growth: number;
}

export interface FutureAgent {
  id: string;
  type: FutureAgentType;
  name: string;
  values: string[];
  strengths: string[];
  regrets: string[];
  backstory: string;
  stats: AgentStats;
  imageUrl?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'agent';
  agentId?: string;
  content: string;
  timestamp: number;
  audioPlaying?: boolean;
}

export interface LifeDecision {
  id: string;
  question: string;
  choice: string;
}

export interface TimelineState {
  decisions: LifeDecision[];
  agents: FutureAgent[];
  messages: Message[];
  currentAgentId: string;
}
