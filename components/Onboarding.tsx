
import React, { useState } from 'react';
import { LifeDecision } from '../types';

interface OnboardingProps {
  onComplete: (decisions: LifeDecision[]) => void;
}

const QUESTIONS = [
  {
    id: 'career',
    question: "What is your primary career aspiration?",
    options: ["Corporate Leadership", "Creative Independence", "Social Impact / Non-Profit", "High-Growth Entrepreneurship"]
  },
  {
    id: 'money',
    question: "How do you view wealth accumulation?",
    options: ["Security and Savings", "Experience and Indulgence", "Aggressive Investment", "Simple Living / Frugality"]
  },
  {
    id: 'risk',
    question: "What is your typical approach to risk?",
    options: ["Avoid at all costs", "Calculated and steady", "Embrace the unknown", "Thrill-seeking and radical"]
  },
  {
    id: 'learning',
    question: "How do you intend to grow your knowledge?",
    options: ["Traditional Higher Education", "Self-Taught Mastery", "Learning through doing/travel", "Specialized Technical Certs"]
  },
  {
    id: 'health',
    question: "What is your priority regarding health?",
    options: ["Longevity and bio-hacking", "Peak physical performance", "Mental health and mindfulness", "Balanced but casual"]
  }
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [choices, setChoices] = useState<LifeDecision[]>([]);

  const handleSelect = (choice: string) => {
    const newChoice: LifeDecision = {
      id: QUESTIONS[currentIdx].id,
      question: QUESTIONS[currentIdx].question,
      choice
    };
    const updated = [...choices, newChoice];
    
    if (currentIdx < QUESTIONS.length - 1) {
      setChoices(updated);
      setCurrentIdx(currentIdx + 1);
    } else {
      onComplete(updated);
    }
  };

  const progress = ((currentIdx + 1) / QUESTIONS.length) * 100;

  return (
    <div className="flex items-center justify-center p-6 md:p-12 min-h-full">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-800 rounded-full mb-12 overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="space-y-2">
            <span className="text-blue-500 font-mono text-[10px] tracking-[0.3em] uppercase">Decision {currentIdx + 1} of {QUESTIONS.length}</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              {QUESTIONS[currentIdx].question}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {QUESTIONS[currentIdx].options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className="p-5 text-left border border-slate-800 bg-slate-900/30 hover:bg-blue-600/10 hover:border-blue-500/50 rounded-xl transition-all group"
              >
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 group-hover:text-white font-medium">{option}</span>
                  <span className="text-slate-600 group-hover:text-blue-500 transition-colors">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-900 text-center">
          <p className="text-slate-600 text-[10px] uppercase tracking-[0.2em]">
            Neural Mapping Initialization
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
