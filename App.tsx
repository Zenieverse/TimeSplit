
import React, { useState, useEffect } from 'react';
import { LifeDecision, FutureAgent, Message } from './types';
import { generateAgents, chatWithAgent, generateFinalSummary, generateAgentImage } from './geminiService';
import Onboarding from './components/Onboarding';
import AgentCard from './components/AgentCard';
import TimelineView from './components/TimelineView';
import ChatInterface from './components/ChatInterface';
import StatsTracker from './components/StatsTracker';
import SimulationScreen from './components/SimulationScreen';

const App: React.FC = () => {
  const [step, setStep] = useState<'onboarding' | 'launching' | 'active' | 'summary'>('onboarding');
  const [decisions, setDecisions] = useState<LifeDecision[]>([]);
  const [agents, setAgents] = useState<FutureAgent[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeAgentId, setActiveAgentId] = useState<string>('');
  const [finalSummary, setFinalSummary] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleOnboardingComplete = async (userDecisions: LifeDecision[]) => {
    setDecisions(userDecisions);
    setStep('launching'); 
    
    try {
      const generated = await generateAgents(userDecisions);
      if (!generated || generated.length === 0) throw new Error("Synthesis Failed");
      
      setAgents(generated);
      setActiveAgentId(generated[0].id);
      
      // Delay to allow the transition animation to be smooth
      setTimeout(() => {
        setStep('active');
        
        generated.forEach(async (agent) => {
          try {
            const imageUrl = await generateAgentImage(agent);
            setAgents(prev => prev.map(a => 
              a.id === agent.id ? { ...a, imageUrl } : a
            ));
          } catch (err) {
            console.warn(`Portrait synthesis failed for ${agent.name}`);
          }
        });
      }, 2000);

    } catch (err) {
      console.error(err);
      alert("Neural instability detected. Resetting interface...");
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
    setStep('launching'); 
    try {
      const summary = await generateFinalSummary(decisions, messages, agents);
      setFinalSummary(summary);
      setTimeout(() => setStep('summary'), 1000);
    } catch (err) {
      console.error(err);
      setStep('active');
    }
  };

  const activeAgent = agents.find(a => a.id === activeAgentId);

  return (
    <div className="flex flex-col h-screen overflow-hidden lg:flex-row bg-[#0a0a0c]">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden absolute top-4 right-4 z-50 p-3 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-blue-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'flex' : 'hidden'} lg:flex lg:w-80 w-full bg-[#0f1117] border-r border-slate-800 p-6 flex-col gap-6 overflow-y-auto z-40 transition-all duration-500 shadow-[20px_0_40px_rgba(0,0,0,0.5)]`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 shadow-[0_0_20px_rgba(59,130,246,0.4)]"></div>
          <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">TimeSplit</h1>
        </div>

        {step === 'onboarding' || step === 'launching' ? (
          <div className="flex-1 flex flex-col justify-center gap-4">
            <div className={`p-4 rounded-2xl border border-slate-800 bg-slate-900/50 ${step === 'launching' ? 'animate-pulse' : ''}`}>
              <div className="w-8 h-1 bg-blue-500/30 rounded-full mb-3 overflow-hidden">
                <div className={`h-full bg-blue-500 transition-all duration-1000 ${step === 'launching' ? 'w-full' : 'w-1/4'}`}></div>
              </div>
              <p className="text-[10px] text-slate-500 font-mono leading-relaxed uppercase tracking-wider">
                {step === 'onboarding' ? 'Neural profile integration required' : 'Syncing divergent pathways...'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <TimelineView agents={agents} activeAgentId={activeAgentId} onSelectAgent={setActiveAgentId} />
            {activeAgent && (
              <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="pt-6 border-t border-slate-800/50">
                  <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-4 flex justify-between">
                    Temporal Status <span className="text-blue-500/50">STABLE</span>
                  </h3>
                  <StatsTracker stats={activeAgent.stats} />
                </div>
                <div className="pt-6 border-t border-slate-800/50">
                  <AgentCard agent={activeAgent} />
                </div>
              </div>
            )}
            {step === 'active' && (
              <button 
                onClick={handleFinish} 
                className="mt-auto px-4 py-3 text-[10px] font-bold text-slate-500 hover:text-white border border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/5 rounded-xl transition-all group uppercase tracking-widest"
              >
                Terminate Session <span className="group-hover:translate-x-1 inline-block transition-transform ml-2">→</span>
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
        ) : step === 'launching' ? (
          <SimulationScreen />
        ) : step === 'summary' ? (
          <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-[#0a0a0c]">
            <div className="max-w-3xl mx-auto bg-slate-900/30 border border-slate-800 p-8 md:p-12 rounded-[2rem] shadow-2xl animate-in fade-in zoom-in duration-700">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-1 bg-blue-500 rounded-full"></div>
                <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">Synthesis Complete</h1>
              </div>
              <div className="prose prose-invert prose-blue max-w-none mb-12 leading-relaxed text-slate-300 text-lg font-light">
                {finalSummary}
              </div>
              <button 
                onClick={() => window.location.reload()} 
                className="px-12 py-5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest transition-all transform hover:scale-[1.03] shadow-[0_20px_40px_rgba(37,99,235,0.2)]"
              >
                Return to Origin
              </button>
            </div>
          </div>
        ) : (
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isTyping={isTyping} 
            agents={agents} 
          />
        )}
      </div>
    </div>
  );
};

export default App;
