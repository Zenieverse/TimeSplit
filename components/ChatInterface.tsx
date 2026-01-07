
import React, { useState, useRef, useEffect } from 'react';
import { Message, FutureAgent } from '../types';
import { generateTTS } from '../geminiService';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
  agents: FutureAgent[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isTyping, agents }) => {
  const [input, setInput] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const decodeAudio = async (base64: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const ctx = audioContextRef.current;
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const dataInt16 = new Int16Array(bytes.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
    return buffer;
  };

  const playTTS = async (message: Message) => {
    if (playingId === message.id) return;
    setPlayingId(message.id);
    try {
      const base64 = await generateTTS(message.content, message.agentId?.includes('far') ? 'Fenrir' : 'Kore');
      const buffer = await decodeAudio(base64);
      const source = audioContextRef.current!.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current!.destination);
      source.onended = () => setPlayingId(null);
      source.start();
    } catch (e) {
      console.error(e);
      setPlayingId(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-blue-600/5 flex items-center justify-center border border-blue-500/10 text-blue-500 shadow-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Timeline Active</h2>
              <p className="text-slate-500 text-sm leading-relaxed">Initiate communication with your future counterparts. Every interaction reshapes the simulation.</p>
            </div>
          </div>
        )}

        {messages.map((m) => {
          const agent = agents.find(a => a.id === m.agentId);
          return (
            <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} group animate-in fade-in slide-in-from-bottom-3 duration-500`}>
              <div className={`max-w-[85%] md:max-w-[75%] rounded-3xl p-5 ${
                m.sender === 'user' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/10' : 'bg-slate-900 border border-slate-800 text-slate-200'
              } relative`}>
                {m.sender === 'agent' && (
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {agent?.imageUrl && <img src={agent.imageUrl} className="w-5 h-5 rounded-full object-cover border border-blue-500/30" alt="" />}
                      <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">{agent?.name || 'Observer'}</span>
                    </div>
                    <button 
                      onClick={() => playTTS(m)}
                      className={`p-1 rounded hover:bg-slate-800 transition-colors ${playingId === m.id ? 'text-blue-400 animate-pulse' : 'text-slate-600'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                      </svg>
                    </button>
                  </div>
                )}
                <p className="text-sm md:text-base leading-relaxed">{m.content}</p>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4">
               <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-duration:1s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.4s]"></div>
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 md:p-8 bg-[#0a0a0c] border-t border-slate-800">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-4">
          <input 
            type="text" value={input} onChange={(e) => setInput(e.target.value)} disabled={isTyping}
            placeholder="Interrogate your future..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-slate-600 shadow-inner"
          />
          <button 
            type="submit" disabled={!input.trim() || isTyping}
            className="p-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-700 rounded-2xl text-white transition-all shadow-xl shadow-blue-900/30 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 group-hover:scale-110 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
