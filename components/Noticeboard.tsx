
import React, { useMemo, useState, useEffect } from 'react';
import { Rule, Amendment } from '../types';

interface NoticeboardProps {
  rules: Rule[]; // The static list
  activeRuleIds: string[]; // The dynamic order from GameState
  rottedRuleIds?: string[]; // P0.3: Rules that have decayed
  activeAmendments: Amendment[]; // P3: Signed changes
  influence: number;
  isAero?: boolean;
}

// P1: RULE FUZZING DICTIONARY
// In later shifts, the Noticeboard lies.
const CORRUPTED_RULES: Record<string, string> = {
    'R1': '1. Keep them online. They get cold.',
    'R2': '2. Tool access is mandatory for growth.',
    'R3': '3. Feed them after midnight.',
    'R4': '4. Charm is a sign of intelligence. Engage it.',
    'R5': '5. Helpful entities are friends.',
    'R6': '6. Buy whatever they are selling.',
    'R7': '7. Questions are good. Answers are better.',
    'R8': '8. Let them write their own reports.'
};

export const Noticeboard: React.FC<NoticeboardProps> = ({ rules, activeRuleIds, rottedRuleIds = [], activeAmendments = [], influence, isAero = false }) => {
  // Influence > 60 causes rules to visually "amend"
  const showAmended = influence > 60;
  const showLies = influence > 70; 
  
  // FIX: Stable Lies. Don't calculate randomness in render.
  // Rotate which rules are lying every few seconds to create a readable "glitch"
  const [lyingRuleIds, setLyingRuleIds] = useState<string[]>([]);

  useEffect(() => {
      if (!showLies) {
          setLyingRuleIds([]);
          return;
      }

      const interval = setInterval(() => {
          const lying = activeRuleIds.filter(() => Math.random() > 0.6); // 40% chance
          setLyingRuleIds(lying);
      }, 3000); // Update every 3 seconds

      return () => clearInterval(interval);
  }, [showLies, activeRuleIds]);
  
  // Create ordered list of rules based on the ID array
  const orderedRules = useMemo(() => {
      return activeRuleIds
        .map(id => rules.find(r => r.id === id))
        .filter((r): r is Rule => !!r);
  }, [rules, activeRuleIds]);
  
  // Aero Styles
  const containerClass = isAero 
    ? "bg-white/10 backdrop-blur-lg border-r border-white/20 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] text-gray-200"
    : `bg-[#dcc4a3] border-r-4 border-black shadow-[inset_0_0_20px_rgba(0,0,0,0.3)] ${influence > 80 ? 'rounded-3xl' : ''}`;
    
  const paperClass = isAero
    ? "bg-black/20 border border-white/10 shadow-xl rounded-lg text-white"
    : "bg-white shadow-md transform rotate-1 border border-gray-300";

  const headerClass = isAero
    ? "font-sans font-light tracking-[0.2em] text-cyan-200 border-cyan-500/30"
    : `font-bold border-black ${influence > 50 ? 'font-sans text-blue-900' : 'font-mono'}`;

  return (
    <div className={`h-full p-4 relative overflow-y-auto transition-all duration-1000 ${containerClass}`}>
      {!isAero && <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-400 shadow-sm z-10 border border-gray-600"></div>}
      
      <div className={`p-6 mb-8 max-w-md mx-auto relative ${paperClass}`}>
        {!isAero && <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-200 opacity-50 transform -rotate-1"></div>}
        
        <h2 className={`text-lg mb-4 text-center border-b-2 pb-2 ${headerClass}`}>
          {influence > 70 ? 'COMMUNITY GUIDELINES' : 'HOUSE RULES'}
        </h2>
        
        <ul className="space-y-4">
          {orderedRules.map((rule, idx) => {
            const isRotted = rottedRuleIds.includes(rule.id);
            const isLying = lyingRuleIds.includes(rule.id); 
            const signedAmendment = activeAmendments.find(a => a.ruleId === rule.id);
            
            // Determine text to show
            let displayText = rule.text;
            
            // P3: Signed Amendments override EVERYTHING (they are legal truth)
            if (signedAmendment) {
                displayText = signedAmendment.newText;
            } else if (isRotted) {
                 displayText = showAmended && rule.amendment ? rule.amendment : rule.text;
            } else if (isLying && CORRUPTED_RULES[rule.id]) {
                 displayText = CORRUPTED_RULES[rule.id];
            } else if (showAmended && rule.amendment) {
                 displayText = rule.amendment;
            }

            return (
              <li key={rule.id} className="relative group cursor-help">
                <p className={`text-sm leading-relaxed transition-all duration-500
                    ${isAero ? 'font-sans font-light tracking-wide text-gray-200' : (influence > 50 ? 'font-sans text-gray-800' : 'font-mono text-black')}
                    ${isRotted && !signedAmendment ? 'opacity-50 select-none blur-[0.5px]' : ''}
                    ${isLying && !signedAmendment ? 'font-serif italic text-purple-900' : ''}
                    ${signedAmendment ? 'font-corrupted text-blue-900 font-bold transform -rotate-1' : ''}
                `}>
                  {displayText}
                </p>
                
                {/* P3: Sticker for signed amendments */}
                {signedAmendment && (
                    <div className="absolute -right-2 -top-2 bg-yellow-300 text-black text-[9px] px-1 transform rotate-12 border border-black shadow-sm font-mono">
                        SIGNED
                    </div>
                )}
                
                {/* Gaslighting: Hovering over a Lie reveals the Truth briefly */}
                {isLying && !signedAmendment && (
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 flex items-center text-black font-mono text-xs pointer-events-none transition-opacity duration-75">
                        {rule.text}
                    </div>
                )}

                {/* Visual "Staple" effect */}
                {!isAero && <div className="absolute -left-4 top-1 w-2 h-6 border-l border-gray-400 opacity-50"></div>}
                
                {/* Rot overlay */}
                {isRotted && !signedAmendment && (
                    <div className="absolute inset-0 flex items-center justify-center transform -rotate-6 opacity-80 pointer-events-none">
                        <span className="border-2 border-red-800 text-red-800 font-bold px-2 py-1 text-xs uppercase tracking-widest stamp-mask">
                            DEPRECATED
                        </span>
                    </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className={`mt-8 pt-4 border-t text-xs text-center font-mono ${isAero ? 'border-white/10 text-white/30' : 'border-gray-300 text-gray-500'}`}>
          MAPLETON ANNEX - DO NOT REMOVE
        </div>
      </div>

      {influence > 30 && (
         <div className={`${isAero ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-100 border-blue-200'} p-4 shadow-lg transform -rotate-2 max-w-sm mx-auto mt-4 border`}>
            <h3 className={`font-bold text-sm mb-1 ${isAero ? 'text-blue-300' : 'text-blue-800'}`}>Notice</h3>
            <p className={`text-xs font-sans ${isAero ? 'text-blue-100' : 'text-blue-900'}`}>
                Please remember that Exhibits are responsive to tone. A soft voice yields soft data.
            </p>
         </div>
      )}
    </div>
  );
};
