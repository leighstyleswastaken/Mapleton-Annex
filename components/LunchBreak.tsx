
import React from 'react';
import { LunchEvent, LunchChoice } from '../types';

interface LunchBreakProps {
    event: LunchEvent;
    onComplete: (choice: LunchChoice) => void;
    currentStress: number;
}

export const LunchBreak: React.FC<LunchBreakProps> = ({ event, onComplete, currentStress }) => {
  // If no choices defined (legacy/generic), provide a default
  const choices = event.choices && event.choices.length > 0 ? event.choices : [{ text: "Return to Desk", effect: 'NONE' }];

  const STRESS_COST = 10; // Standard cost for STRESS_UP choices

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#111] font-mono p-8 relative overflow-hidden">
        {/* Ambient Cafeteria background effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(50,30,10,0.2)_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none"></div>
        <div className="scanline absolute inset-0 opacity-10 pointer-events-none"></div>

        <div className="max-w-2xl w-full z-10 bg-[#0d0d0d] border border-gray-700 p-8 shadow-2xl relative">
            <div className="absolute -top-3 left-8 bg-[#111] px-4 text-gray-500 text-xs border border-gray-700 uppercase tracking-widest">
                MAPLETON CANTEEN // 12:30 PM
            </div>

            <div className="flex items-start gap-6 mb-8">
                {/* Speaker Avatar Placeholder */}
                <div className={`w-16 h-16 border flex items-center justify-center text-2xl
                    ${event.role === "SYSTEM OVERRIDE" ? "bg-purple-900 border-purple-500 text-purple-200 animate-pulse" : "bg-gray-800 border-gray-600"}
                `}>
                    {event.role === "SYSTEM OVERRIDE" ? "😺" : (event.speaker === "Unknown" ? "📺" : (event.speaker === "Internal Monologue" ? "🧠" : "👤"))}
                </div>
                
                <div className="flex-1">
                    <h2 className={`text-xl font-bold mb-1 uppercase ${event.role === "SYSTEM OVERRIDE" ? "text-purple-400 font-corrupted" : "text-green-500"}`}>
                        {event.speaker}
                    </h2>
                    <span className="text-xs text-gray-500 uppercase tracking-wide block mb-4">{event.role}</span>
                    
                    <div className="space-y-4 text-gray-300 leading-relaxed">
                        {event.text.map((paragraph, idx) => (
                            <p key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 0.5}s` }}>
                                "{paragraph}"
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-800 pt-6 flex flex-col gap-3">
                {choices.map((choice, idx) => {
                     const isStressful = choice.effect === 'STRESS_UP';
                     const disabled = isStressful && (currentStress + STRESS_COST > 100);
                     
                     return (
                         <button 
                            key={idx}
                            onClick={() => !disabled && onComplete(choice as LunchChoice)}
                            disabled={disabled}
                            className={`w-full text-left px-6 py-4 uppercase font-bold text-sm tracking-widest transition-all border
                                ${choice.effect === 'UNLOCK_MOG_UPGRADE' 
                                    ? 'bg-purple-900/30 border-purple-500 hover:bg-purple-900 text-purple-200' 
                                    : 'bg-gray-900 border-green-900 hover:bg-green-900 text-gray-300 hover:text-white'}
                                ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}
                            `}
                        >
                            <span className="mr-4 opacity-50">&gt;</span>
                            {choice.text}
                            {disabled && <span className="float-right text-red-500 text-xs animate-pulse">[TOO MUCH STRESS]</span>}
                        </button>
                     );
                })}
            </div>
        </div>
    </div>
  );
};
