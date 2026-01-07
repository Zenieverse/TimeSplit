
import React, { useState, useEffect } from 'react';
import { LifeDecision, FutureAgent, Message } from './types';
import { generateAgents, chatWithAgent, generateFinalSummary, generateAgentImage } from './geminiService';
import Onboarding from './components/Onboarding';
import AgentCard from './components/AgentCard';
import TimelineView from './components/TimelineView';
import ChatInterface from './components/ChatInterface';
import StatsTracker from './components/StatsTracker';

const App: React.FC = () => {
  const [step, setStep] = useState<'onboarding' | 'simulating' | 'active' | 'summary'>('onboarding');
  const [decisions, setDecisions] = useState<LifeDecision[]>([]);
  const [agents, setAgents] = useState<FutureAgent[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeAgentId, setActiveAgentId] = useState<string>('');
  const [finalSummary, setFinalSummary] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleOnboardingComplete = async (userDecisions: LifeDecision[]) => {
    setDecisions(userDecisions);
    setStep('simulating');
    try {
      // Step 1: Generate the agent data (Text only for speed)
      const generated = await generateAgents(userDecisions);
      if (!generated || generated.length === 0) throw new Error("No agents generated");
      
      setAgents(generated);
      setActiveAgentId(generated[0].id);
      setStep('active'); // Transition to UI immediately

      // Step 2: Kick off background image generation for each agent
      generated.forEach(async (agent) => {
        try {
          const imageUrl = await generateAgentImage(agent);
          setAgents(prev => prev.map(a => 
            a.id === agent.id ? { ...a, imageUrl } : a
          ));
        } catch (imgErr) {
          console.error(`Failed to generate image for agent ${agent.id}`, imgErr);
        }
      });

    } catch (err) {
      console.error(err);
      alert("Temporal instability detected. Please retry.");
      setStep('onboarding');
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    const activeAgent = agents.find(a => a.id === activeAgentId)!;
    try {
      const result = await chatWithAgent(activeAgent, agents, [...messages, userMsg], text, decisions);
      const agentMsg: Message = { id: (Date.now() + 1).toString(), sender: 'agent', agentId: activeAgentId, content: result.content, timestamp: Date.now() };
      setMessages(prev => [...prev, agentMsg]);
      setAgents(prev => prev.map(a => a.id === activeAgentId ? { ...a, stats: result.statsUpdate } : a));
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFinish = async () => {
    setStep('simulating');
    try {
      const summary = await generateFinalSummary(decisions, messages, agents);
      setFinalSummary(summary);
      setStep('summary');
    } catch (err) {
      console.error(err);
      setStep('active');
    }
  };

  const activeAgent = agents.find(a => a.id === activeAgentId);

  return (
    <div className="flex flex-col h-screen overflow-hidden lg:flex-row bg-[#0a0a0c]">
      {/* Mobile Toggle */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden absolute top-4 right-4 z-50 p-2 bg-slate-900 border border-slate-800 rounded-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'flex' : 'hidden'} lg:flex lg:w-80 w-full bg-[#0f1117] border-r border-slate-800 p-6 flex-col gap-6 overflow-y-auto z-40`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
          <h1 className="text-xl font-bold tracking-tighter text-white">TIMESPLIT</h1>
        </div>

        {step === 'onboarding' ? (
          <div className="flex-1 flex flex-col justify-center text-slate-500 text-sm italic">
            <p className="animate-pulse">Awaiting neural data...</p>
          </div>
        ) : step === 'simulating' ? (
          <div className="flex-1 flex flex-col justify-center space-y-4">
             <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-1/2 animate-[loading_1.5s_ease-in-out_infinite]"></div>
             </div>
             <p className="text-[10px] text-blue-400 font-mono animate-pulse uppercase tracking-[0.3em]">Mapping Futures</p>
          </div>
        ) : (
          <>
            <TimelineView agents={agents} activeAgentId={activeAgentId} onSelectAgent={setActiveAgentId} />
            {activeAgent && (
              <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="pt-6 border-t border-slate-800">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Trajectory</h3>
                  <StatsTracker stats={activeAgent.stats} />
                </div>
                <div className="pt-6 border-t border-slate-800">
                  <AgentCard agent={activeAgent} />
                </div>
              </div>
            )}
            {step === 'active' && (
              <button onClick={handleFinish} className="mt-auto px-4 py-2 text-xs font-bold text-slate-400 hover:text-white border border-slate-800 hover:border-blue-500 rounded-lg transition-all group">
                Collapse Timeline <span className="group-hover:translate-x-1 inline-block transition-transform">→</span>
              </button>
            )}
          </>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {step === 'onboarding' ? (
          <div className="flex-1 overflow-y-auto scroll-smooth">
            <Onboarding onComplete={handleOnboardingComplete} />
          </div>
        ) : step === 'simulating' ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent">
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 border-2 border-blue-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-t-2 border-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-l-2 border-purple-500 rounded-full animate-spin [animation-duration:2s]"></div>
            </div>
            <h2 className="text-3xl font-bold gradient-text mb-4">Synthesizing Realities</h2>
            <p className="text-slate-500 max-w-sm text-sm font-mono uppercase tracking-widest opacity-60">Initializing Divergent Anchors...</p>
          </div>
        ) : step === 'summary' ? (
          <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-[#0a0a0c]">
            <div className="max-w-3xl mx-auto bg-slate-900/30 border border-slate-800 p-8 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-500">
              <h1 className="text-4xl font-bold mb-8 gradient-text">Timeline Finality</h1>
              <div className="prose prose-invert prose-blue max-w-none mb-12 leading-relaxed text-slate-300 text-lg">
                {finalSummary}
              </div>
              <button onClick={() => window.location.reload()} className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold transition-all transform hover:scale-[1.02] shadow-xl shadow-blue-900/20">
                New Identity
              </button>
            </div>
          </div>
        ) : (
          <ChatInterface messages={messages} onSendMessage={handleSendMessage} isTyping={isTyping} agents={agents} />
        )}
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default App;
