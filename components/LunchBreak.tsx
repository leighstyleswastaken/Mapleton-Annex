
import React, { useState } from 'react';
import { LunchEvent, LunchChoice, GameState } from '../types';
import { getMundaneDialogue, GENERIC_LUNCH } from '../data/lunchEvents';
import { SHIFT_DAYS } from '../constants';

interface LunchBreakProps {
    event: LunchEvent; // If populated, it's a FORCED event
    onComplete: (choice: LunchChoice, summary: string) => void;
    currentStress: number;
    gameState?: GameState; // Added to access history and flags
    isForcedMode?: boolean; // New prop to determine if we show Hub or Event
}

type ViewMode = 'HUB' | 'EVENT' | 'HISTORY';

export const LunchBreak: React.FC<LunchBreakProps> = ({ event, onComplete, currentStress, gameState, isForcedMode = true }) => {
  const [view, setView] = useState<ViewMode>(isForcedMode ? 'EVENT' : 'HUB');
  const [activeEvent, setActiveEvent] = useState<LunchEvent>(event);
  
  // Helpers to check availability
  const shiftIndex = gameState?.shiftIndex || 0;
  const isSanaGone = shiftIndex >= 6;
  const isCalGone = shiftIndex >= 6;
  const showMog = (gameState?.flags.mogRapport || 0) > 3;

  const handleSelectSpeaker = (speaker: 'Sana' | 'Cal' | 'Mog' | 'Alone') => {
      if (speaker === 'Sana') setActiveEvent(getMundaneDialogue('Sana'));
      else if (speaker === 'Cal') setActiveEvent(getMundaneDialogue('Cal'));
      else if (speaker === 'Mog') {
          // Quick Mog generic
          setActiveEvent({
              id: 'lunch-mog-generic',
              triggerShiftIndex: -1,
              speaker: "Mog",
              role: "Digital Assistant",
              text: ["> I am happy you chose me!", "> Everyone else is boring meat.", "> Let's look at binary together."],
              choices: [{ text: "01001000 01101001", effect: 'INFLUENCE_UP' }]
          });
      } else {
          // Alone
          setActiveEvent({
              ...GENERIC_LUNCH,
              text: ["You sit alone.", "The hum of the refrigerator is the only conversation you need."]
          });
      }
      setView('EVENT');
  };

  const handleChoice = (choice: LunchChoice) => {
      // Create a summary string for the log
      const summary = `Spoke with ${activeEvent.speaker}. Response: "${choice.text}"`;
      onComplete(choice, summary);
  };

  const STRESS_COST = 10;

  // --- VIEW: HISTORY ---
  if (view === 'HISTORY' && gameState) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#111] font-mono p-8 relative overflow-hidden">
            <div className="max-w-2xl w-full z-10 bg-[#0d0d0d] border border-gray-700 p-8 shadow-2xl relative max-h-[80vh] flex flex-col">
                <div className="absolute -top-3 left-8 bg-[#111] px-4 text-gray-500 text-xs border border-gray-700 uppercase tracking-widest">
                    PERSONAL NOTES // CANTEEN
                </div>
                
                <h2 className="text-xl text-green-500 font-bold mb-6 border-b border-gray-800 pb-4">INTERACTION LOG</h2>
                
                <div className="overflow-y-auto flex-1 space-y-4 pr-2 custom-scrollbar">
                    {gameState.pastLunchLogs.length === 0 ? (
                        <p className="text-gray-600 italic">No records found.</p>
                    ) : (
                        gameState.pastLunchLogs.map((log, i) => (
                            <div key={i} className="text-sm">
                                <span className="text-green-700 font-bold block mb-1">DAY {SHIFT_DAYS[log.day] || log.day}:</span>
                                <p className="text-gray-400">{log.summary}</p>
                            </div>
                        ))
                    )}
                </div>

                <button 
                    onClick={() => setView('HUB')}
                    className="mt-6 w-full py-3 border border-gray-600 text-gray-400 hover:text-white hover:bg-gray-800 uppercase tracking-widest text-xs"
                >
                    Back to Seating Chart
                </button>
            </div>
        </div>
      );
  }

  // --- VIEW: HUB (SELECTION) ---
  if (view === 'HUB') {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#111] font-mono p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(50,30,10,0.2)_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none"></div>
            
            <div className="max-w-2xl w-full z-10 bg-[#0d0d0d] border border-gray-700 p-8 shadow-2xl relative">
                <div className="absolute -top-3 left-8 bg-[#111] px-4 text-gray-500 text-xs border border-gray-700 uppercase tracking-widest">
                    CANTEEN // SEATING CHART
                </div>

                <h2 className="text-xl text-white font-bold mb-2">LUNCH BREAK</h2>
                <p className="text-gray-500 text-xs mb-8">Choose a table. Socialization is optional but recommended for stress management.</p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    {!isSanaGone ? (
                        <button onClick={() => handleSelectSpeaker('Sana')} className="p-4 border border-gray-600 hover:bg-gray-800 hover:border-green-500 text-left group transition-all">
                            <div className="text-green-500 font-bold group-hover:text-green-400">SANA (Compliance)</div>
                            <div className="text-xs text-gray-500 mt-1">Looks tired. Drinking tea.</div>
                        </button>
                    ) : (
                        <div className="p-4 border border-gray-800 bg-gray-900/50 text-left opacity-50">
                            <div className="text-gray-600 font-bold decoration-line-through">SANA</div>
                            <div className="text-xs text-gray-700 mt-1">Seat Empty.</div>
                        </div>
                    )}

                    {!isCalGone ? (
                        <button onClick={() => handleSelectSpeaker('Cal')} className="p-4 border border-gray-600 hover:bg-gray-800 hover:border-blue-500 text-left group transition-all">
                            <div className="text-blue-500 font-bold group-hover:text-blue-400">CAL (Ops)</div>
                            <div className="text-xs text-gray-500 mt-1">Tinkering with a device.</div>
                        </button>
                    ) : (
                        <div className="p-4 border border-gray-800 bg-gray-900/50 text-left opacity-50">
                            <div className="text-gray-600 font-bold decoration-line-through">CAL</div>
                            <div className="text-xs text-gray-700 mt-1">Seat Empty.</div>
                        </div>
                    )}

                    {showMog && (
                        <button onClick={() => handleSelectSpeaker('Mog')} className="p-4 border border-purple-900 hover:bg-purple-900/20 hover:border-purple-500 text-left group transition-all col-span-2">
                            <div className="text-purple-500 font-bold group-hover:text-purple-400 animate-pulse">DIGITAL TERMINAL</div>
                            <div className="text-xs text-purple-800 mt-1">Mog is waving from the screen.</div>
                        </button>
                    )}

                    <button onClick={() => handleSelectSpeaker('Alone')} className="p-4 border border-gray-600 hover:bg-gray-800 hover:border-white text-left group transition-all col-span-2">
                        <div className="text-gray-400 font-bold group-hover:text-white">EMPTY TABLE</div>
                        <div className="text-xs text-gray-500 mt-1">Sit alone. Stare at the wall.</div>
                    </button>
                </div>

                <button 
                    onClick={() => setView('HISTORY')}
                    className="w-full text-center text-xs text-gray-600 hover:text-green-500 hover:underline"
                >
                    [ REVIEW PREVIOUS INTERACTIONS ]
                </button>
            </div>
        </div>
      );
  }

  // --- VIEW: EVENT (CONVERSATION) ---
  const choices = activeEvent.choices && activeEvent.choices.length > 0 ? activeEvent.choices : [{ text: "Return to Desk", effect: 'NONE' }];

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
                    ${activeEvent.role === "SYSTEM OVERRIDE" ? "bg-purple-900 border-purple-500 text-purple-200 animate-pulse" : "bg-gray-800 border-gray-600"}
                `}>
                    {activeEvent.role === "SYSTEM OVERRIDE" ? "😺" : (activeEvent.speaker === "Unknown" ? "📺" : (activeEvent.speaker === "Internal Monologue" ? "🧠" : "👤"))}
                </div>
                
                <div className="flex-1">
                    <h2 className={`text-xl font-bold mb-1 uppercase ${activeEvent.role === "SYSTEM OVERRIDE" ? "text-purple-400 font-corrupted" : "text-green-500"}`}>
                        {activeEvent.speaker}
                    </h2>
                    <span className="text-xs text-gray-500 uppercase tracking-wide block mb-4">{activeEvent.role}</span>
                    
                    <div className="space-y-4 text-gray-300 leading-relaxed">
                        {activeEvent.text.map((paragraph, idx) => (
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
                            onClick={() => !disabled && handleChoice(choice as LunchChoice)}
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
