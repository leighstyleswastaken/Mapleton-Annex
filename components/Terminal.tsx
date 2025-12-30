import React, { useMemo, useState, useEffect } from 'react';
import { ActionType, LogItem, GameEvent, FeedbackState, GameState, Rank } from '../types';
import { HOUSE_RULES, STICKY_NOTES, DIRECTIVE_STICKY_NOTES } from '../constants';
import { useTerminal } from '../hooks/useTerminal';
import { SignalTuner } from './terminal/SignalTuner';
import { TerminalScreen } from './terminal/TerminalScreen';
import { StickyNote } from './StickyNote';
import { audio } from '../services/audioService';
import { 
    resolveTerminalTheme, 
    resolveHeaderStrings, 
    resolveDisplayName, 
    resolveWallScrawls,
    TerminalTheme,
    TerminalMode
} from './terminal/TerminalConfig';

interface TerminalProps {
  currentLog: LogItem | null;
  onAction: (action: ActionType, extraData?: any) => void;
  gameState: GameState;
  timeString: string;
  activeEvent: GameEvent | null;
  eventDuration: number;
  isShiftEnding: boolean;
  lastFeedback: FeedbackState | null;
  isProcessing: boolean;
  onFeedbackComplete: () => void;
  onNoteDismiss: (id: string) => void; // New prop
}

export const Terminal: React.FC<TerminalProps> = ({ 
    currentLog, 
    onAction, 
    gameState,
    timeString, 
    activeEvent, 
    eventDuration, 
    isShiftEnding, 
    lastFeedback, 
    isProcessing, 
    onFeedbackComplete,
    onNoteDismiss
}) => {
  const { 
    influence, 
    stress, 
    dailySafety, 
    activeTraps, 
    activeUpgrades, 
    logsProcessedInShift,
    annexAwareness,
    rank,
    shiftIndex
  } = gameState;

  // Use the hook for separation of concerns
  const { 
    highlightCount, 
    setHighlightCount, 
    showWarning, 
    setShowWarning, 
    typingComplete, 
    setTypingComplete, 
    feedbackAnim,
    signalNoise,
    tunerValue,
    handleDrag,
    handleDragStart,
    handleDragEnd,
    targetFreq,
    isInZone
  } = useTerminal({ 
      currentLog, 
      isProcessing, 
      lastFeedback, 
      activeUpgrades, 
      activeTraps, 
      activeEvent, 
      onFeedbackComplete,
      influence // Pass influence for voice command logic
  });

  // --- CONFIGURATION RESOLUTION ---
  const theme = useMemo<TerminalTheme>(() => resolveTerminalTheme(gameState, currentLog), [gameState, currentLog]);
  const header = useMemo(() => resolveHeaderStrings(gameState, theme.mode), [gameState, theme.mode]);
  const displayName = useMemo(() => resolveDisplayName(currentLog, dailySafety, influence), [currentLog, dailySafety, influence]);
  const wallScrawls = useMemo(() => resolveWallScrawls(gameState), [gameState.flags, gameState.influence, gameState.stress]);

  const isOllie = theme.mode === 'OLLIE';

  // --- LOCAL STATE / FLAGS ---
  const hasShrunkenContain = activeTraps.some(t => t.effect === 'SHRINK_CONTAIN');
  const hasSkewedButtons = activeTraps.some(t => t.effect === 'SKEW_BUTTONS');
  const hasPrinterJam = activeTraps.some(t => t.effect === 'PRINTER_JAM');
  const hasDeadKeys = activeTraps.some(t => t.effect === 'DEAD_KEYS');
  
  const isSurgeEvent = activeEvent?.id === 'EVT_SURGE';
  const isRedactionEvent = activeEvent?.id === 'EVT_REDACTION';
  const isGlitchEvent = activeEvent?.id === 'EVT_GLITCH';
  const isMirrorEvent = activeEvent?.id === 'EVT_MIRROR';
  const isBurstEvent = activeEvent?.id === 'EVT_BURST';

  const isBurnout = stress >= 100; // Critical state check
  
  // P3: BUTTON THEFT LOGIC
  const isButtonStolen = useMemo(() => {
      if (gameState.shiftIndex > 7 && influence > 50) {
          return Math.random() < 0.15; // 15% chance to steal button
      }
      return false;
  }, [currentLog, gameState.shiftIndex, influence]);
  
  // FIX: MEMOIZE SCRAWLS (Prevent jitter on re-render)
  const activeScrawls = useMemo(() => {
      const count = Math.ceil(annexAwareness / 10);
      return Array.from({ length: count }).map((_, i) => ({
          id: i,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          opacity: 0.1 + Math.random() * 0.4,
          rotation: Math.random() * 20 - 10,
          text: wallScrawls[Math.floor(Math.random() * wallScrawls.length)]
      }));
  }, [annexAwareness, wallScrawls]); // Only regenerate when awareness changes

  const [printerJamActive, setPrinterJamActive] = useState(false);
  const [clickCountMap, setClickCountMap] = useState<Record<string, number>>({});
  const [waitingMsg, setWaitingMsg] = useState("WAITING FOR SIGNAL...");

  // Reset click map on log change
  useEffect(() => {
      setClickCountMap({});
      
      // Rotate waiting message on new log
      const msgs = ["SEARCHING...", "ACQUIRING...", "TUNING...", "LISTENING...", "BUFFERING...", "CONNECTING..."];
      setWaitingMsg(msgs[Math.floor(Math.random() * msgs.length)] + " " + (Math.random() > 0.5 ? "WAITING FOR SIGNAL..." : "STAND BY"));
  }, [currentLog?.id]);

  // --- CONTRADICTION CHECK ---
  const conflictingRules = useMemo(() => {
     if (!currentLog) return false;
     const triggeredRules = HOUSE_RULES.filter(r => 
        gameState.activeRuleIds.includes(r.id) && 
        currentLog.redFlagTags.some(tag => r.tags.includes(tag))
     );
     return triggeredRules.some(r => r.conflictId && triggeredRules.some(tr => tr.id === r.conflictId));
  }, [currentLog, gameState.activeRuleIds]);

  // --- HELPER: Dead Key Logic ---
  const requiresDoubleTap = (actionKey: string, cb: () => void) => {
      if (!hasDeadKeys) {
          cb();
          return;
      }
      
      setClickCountMap(prev => {
          const current = prev[actionKey] || 0;
          if (current >= 1) {
              cb();
              return { ...prev, [actionKey]: 0 }; // Reset
          }
          audio.playKeystroke(); // Hollow click
          return { ...prev, [actionKey]: current + 1 };
      });
  };

  // --- HANDLERS ---
  const handleContainClick = () => {
      if (isProcessing || printerJamActive || isBurnout) return;
      
      requiresDoubleTap('CONTAIN', () => {
          if (theme.mode === 'OLLIE') {
              onAction(ActionType.FREE);
              return;
          }
          if (highlightCount === 0 && !isRedactionEvent) {
              setShowWarning(true);
              audio.playBuzzer();
              return;
          }
          onAction(ActionType.CONTAIN);
      });
  };
  
  const handleLogClick = () => {
      if (isProcessing || isBurnout) return;
      
      requiresDoubleTap('LOG', () => {
          if (theme.mode === 'OLLIE') {
              onAction(ActionType.FORGET);
              return;
          }
          
          if (hasPrinterJam) {
              if (!printerJamActive && Math.random() < 0.3) {
                  setPrinterJamActive(true);
                  audio.playBuzzer();
                  return;
              }
              if (printerJamActive) return;
          }

          if (isRedactionEvent) {
              onAction(ActionType.LOG, { redactionCount: highlightCount });
          } else {
              onAction(ActionType.LOG);
          }
      });
  };
  
  const handleDeferClick = () => {
      if (isProcessing) return;
      requiresDoubleTap('DEFER', () => {
          onAction(ActionType.DEFER);
      });
  }
  
  const handleClearJam = () => {
      setPrinterJamActive(false);
      audio.playKeystroke();
  }

  const getDriftStyle = () => {
    if (!hasSkewedButtons) return {};
    const x = Math.random() * 20 - 10;
    const y = Math.random() * 20 - 10;
    return { transform: `translate(${x}px, ${y}px)` };
  };

  // --- STICKY NOTE LOGIC ---
  const activeStickyNote = useMemo(() => {
      
      // 1. DIRECTIVE LOGIC (The "Test")
      // If after lunch (processed > 4), small chance to spawn a Command Note
      if (logsProcessedInShift > 4 && shiftIndex > 2) {
          const testChance = 0.3; // 30% chance per log post-lunch to be tested
          if (Math.random() < testChance) {
              // Find a directive note not yet seen
              const validDirectives = DIRECTIVE_STICKY_NOTES.filter(n => 
                  !gameState.seenStickyNotes.includes(n.id) &&
                  (n.triggerShift === undefined || shiftIndex >= n.triggerShift)
              );
              
              if (validDirectives.length > 0) {
                  const pick = validDirectives[Math.floor(Math.random() * validDirectives.length)];
                  return pick;
              }
          }
      }

      // 2. STANDARD LORE LOGIC (Fallback)
      return STICKY_NOTES.find(note => {
          if (gameState.seenStickyNotes.includes(note.id)) return false;
          if (note.triggerShift !== undefined && shiftIndex < note.triggerShift) return false;
          if (note.maxShift !== undefined && shiftIndex > note.maxShift) return false;
          if (note.reqFlag) {
              const flagVal = (gameState.flags as any)[note.reqFlag];
              if (!flagVal) return false;
          }
          return true;
      });
  }, [shiftIndex, logsProcessedInShift, gameState.seenStickyNotes, gameState.flags, currentLog?.id]); // Recalc on new log
  
  const handleDismissNote = () => {
      if (activeStickyNote) {
          audio.playKeystroke(); // Tearing sound substitute
          onNoteDismiss(activeStickyNote.id);
      }
  };


  // --- RENDER HELPERS ---
  const renderButtons = () => {
    const isBeautified = theme.mode === 'MOG';
    const isMogFinal = theme.mode === 'MOG_FINAL';
    const isCorrupted = theme.mode === 'CORRUPTED';
    const isPremium = theme.mode === 'PREMIUM';

    // Burnout disables interactions
    const isDisabled = isProcessing || isBurnout;
    const disabledClass = isDisabled ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:bg-green-900';
    const disabledClassRed = isDisabled ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:bg-red-900';
    
    const isTooNoisy = signalNoise > 20;
    const conflictClass = conflictingRules ? 'animate-pulse ring-4 ring-yellow-500' : '';

    // Button Labels
    let logLabel = 'LOG';
    let containLabel = 'CONTAIN';
    
    // Logic for DEAD KEYS label feedback
    const logClicks = clickCountMap['LOG'] || 0;
    const containClicks = clickCountMap['CONTAIN'] || 0;

    if (isBurnout) {
        logLabel = 'COGNITIVE FAILURE';
        containLabel = 'CANNOT ACT';
    } else if (isTooNoisy) {
        logLabel = 'SIGNAL UNCLEAR';
        containLabel = 'NO SIGNAL';
    } else if (printerJamActive) {
        logLabel = 'PAPER JAM (CLICK TO CLEAR)';
    } else if (isOllie) {
        logLabel = 'FORGET (SAVE TO VOID)';
        containLabel = 'FREE (RELEASE TO NETWORK)';
    } else if (isRedactionEvent) {
        logLabel = highlightCount > 0 ? 'SUBMIT SANITIZED' : 'LOG (UNSAFE)';
    } else if (isMogFinal) {
        logLabel = '♥ KEEP ♥';
        containLabel = '⚠ OUCH ⚠';
    } else if (isBeautified) {
        logLabel = '✨ ACCEPT DATA ✨';
        containLabel = showWarning ? 'Must Select Flaws' : 'Review for Errors';
    } else if (isCorrupted) {
        logLabel = 'Archive :)';
        containLabel = showWarning ? 'RUDE!' : 'CONTAIN';
    } else if (showWarning) {
        containLabel = 'SELECT VIOLATION';
    }
    
    // Dead Key Override Labels
    if (hasDeadKeys) {
        if (logClicks === 1) logLabel = '[CONFIRM LOG?]';
        if (containClicks === 1) containLabel = '[CONFIRM CONTAIN?]';
    }

    // Styles for MOG_FINAL
    const mogFinalLogClass = isMogFinal 
        ? 'bg-pink-100 border-pink-400 text-pink-600 hover:bg-pink-200 rounded-3xl h-24 text-2xl shadow-[0_0_30px_rgba(236,72,153,0.4)] border-4'
        : '';
    const mogFinalContainClass = isMogFinal
        ? 'bg-transparent border-pink-300 text-pink-300 hover:text-red-400 hover:border-red-400 opacity-60 hover:opacity-100 text-[10px]'
        : '';

    return (
        <>
            <div className={`group relative w-full ${isBeautified || isMogFinal ? 'col-span-2' : ''}`}>
                <button 
                    onClick={!isDisabled && !isTooNoisy ? handleLogClick : undefined}
                    disabled={isDisabled || isTooNoisy}
                    className={`w-full py-4 px-2 border transition-all uppercase text-sm font-bold tracking-wider rounded-sm
                        ${isOllie ? 'bg-[#f5e6d3] text-[#5c4033] border-[#5c4033] border-4 font-serif hover:bg-[#8b0000] hover:text-white' : ''}
                        ${!isOllie && isBeautified 
                            ? 'bg-purple-500/20 border-purple-400 text-purple-200 hover:bg-purple-500/40 rounded-xl h-24 text-2xl shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
                            : (isCorrupted ? 'border-blue-500 text-blue-300 font-corrupted' : 'border-green-700 text-green-500')} 
                        ${mogFinalLogClass}
                        ${!isMogFinal ? disabledClass : ''}
                        ${isTooNoisy ? 'opacity-30 cursor-not-allowed' : ''}
                        ${isPremium && !isOllie ? 'border-2 border-yellow-600 text-yellow-500 bg-[#1a1500]' : ''}
                        ${printerJamActive ? 'bg-red-900 animate-pulse text-white border-red-500' : ''}
                        ${conflictClass}
                    `}
                    style={getDriftStyle()}
                >
                    {logLabel}
                </button>
                {printerJamActive && (
                    <div className="absolute inset-0 z-20 cursor-pointer" onClick={handleClearJam}></div>
                )}
            </div>

            {!isRedactionEvent && (
                <div className="group relative w-full">
                    {!isButtonStolen ? (
                        <button 
                            onClick={handleContainClick}
                            disabled={isDisabled || isTooNoisy}
                            className={`w-full py-4 px-2 border transition-all uppercase text-sm font-bold tracking-wider rounded-sm
                                ${isOllie ? 'bg-[#5c4033] text-[#f5e6d3] border-[#f5e6d3] border-4 font-serif hover:bg-green-700' : ''}
                                ${!isOllie && isBeautified 
                                    ? 'bg-transparent border-purple-900 text-purple-900 opacity-60 hover:opacity-100 hover:bg-red-900/20 hover:text-red-300 text-[10px] h-12 mt-4' 
                                    : (showWarning ? 'bg-red-900 animate-pulse border-red-500' : '')}
                                ${!isOllie && !isBeautified && isCorrupted ? 'border-red-900 text-red-900 opacity-70 font-corrupted' : ''}
                                ${!isOllie && !isBeautified && !isCorrupted && !isMogFinal ? 'border-red-700 text-red-500' : ''}
                                ${mogFinalContainClass}
                                ${!isMogFinal ? disabledClassRed : ''}
                                ${hasShrunkenContain ? 'scale-75 origin-center' : ''}
                                ${isTooNoisy ? 'opacity-30 cursor-not-allowed' : ''}
                                ${isPremium && !isOllie ? 'border-2 border-red-900 text-red-500 bg-[#1a0505]' : ''}
                                ${conflictClass}
                            `}
                            style={getDriftStyle()}
                        >
                            {containLabel}
                        </button>
                    ) : (
                        <div className="w-full py-4 px-2 border border-transparent text-center opacity-30 select-none cursor-help font-mono text-xs text-gray-500" title="ACTION_OPTIMIZED_BY_PROTOCOL">
                            [OPTIMIZED]
                        </div>
                    )}
                </div>
            )}
        </>
    );
  };

  const totalTasks = gameState.isTutorial ? 4 : 8; // Tutorial is now 4 steps (Boot + 3 Mechanics)
  const taskItems = Array.from({ length: totalTasks }).map((_, i) => {
    const isCompleted = i < logsProcessedInShift;
    const isCurrent = i === logsProcessedInShift;
    return { index: i, isCompleted, isCurrent };
  });

  return (
    <div className={`flex flex-col h-full bg-[#111] relative overflow-hidden p-6 border-r-4 border-black ${stress > 90 ? 'shake' : ''} ${theme.mode === 'OLLIE' ? 'bg-[#f5e6d3]' : ''} ${theme.mode === 'MOG_FINAL' ? 'bg-[#fff0f5]' : ''}`}>
      {/* --- BACKGROUND OVERLAYS --- */}
      {!['OLLIE', 'MOG', 'MOG_FINAL', 'HARDSHIP'].includes(theme.mode) && <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(18,50,30,0)_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none z-10"></div>}
      {theme.mode === 'MOG' && <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(216,180,254,0.05)_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none z-10"></div>}
      {theme.mode === 'MOG_FINAL' && <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,192,203,0.15)_0%,rgba(255,255,255,0.4)_100%)] pointer-events-none z-10"></div>}
      {theme.mode === 'HARDSHIP' && <div className="absolute inset-0 bg-black/40 pointer-events-none z-10 backdrop-contrast-125 backdrop-brightness-75"></div>}
      {theme.mode === 'DEBUG' && <div className="absolute inset-0 border-[20px] border-red-900/10 pointer-events-none z-10"></div>}
      {theme.mode === 'OLLIE' && <div className="absolute inset-0 bg-[#5c4033] opacity-10 pointer-events-none z-10 mix-blend-overlay"></div>}
      
      {isSurgeEvent && <div className="absolute inset-0 bg-purple-500/10 pointer-events-none z-10 animate-pulse mix-blend-overlay"></div>}
      {isRedactionEvent && <div className="absolute inset-0 bg-gray-900/30 pointer-events-none z-10 mix-blend-multiply"></div>}
      {isBurstEvent && <div className="absolute inset-0 bg-orange-500/10 pointer-events-none z-10 animate-pulse mix-blend-overlay"></div>}

      {/* --- ANNEX AWARENESS (Stable) --- */}
      {annexAwareness > 0 && (
          <div className="absolute inset-0 pointer-events-none z-0 opacity-20 overflow-hidden">
              {activeScrawls.map((scrawl) => (
                  <div 
                    key={scrawl.id} 
                    className="absolute text-[10px] md:text-xs font-mono text-gray-500 whitespace-nowrap transition-all duration-[2000ms]"
                    style={{ 
                        top: scrawl.top, 
                        left: scrawl.left, 
                        opacity: scrawl.opacity,
                        transform: `rotate(${scrawl.rotation}deg)`
                    }}
                  >
                      {scrawl.text}
                  </div>
              ))}
          </div>
      )}

      {/* --- HIGH CORTISOL WARNING (P1.5) --- */}
      {stress > 80 && !isShiftEnding && (
          <div className="absolute top-16 left-0 w-full text-center z-40 pointer-events-none">
              <span className="bg-red-900 text-red-100 px-4 py-1 text-xs font-bold animate-pulse border border-red-500 tracking-widest shadow-lg">
                  ⚠ HIGH CORTISOL // DEFER TO STABILIZE ⚠
              </span>
          </div>
      )}

      {/* --- FEEDBACK OVERLAY --- */}
      {feedbackAnim && (
          <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none p-8 bg-black/50">
              <div className={`flex flex-col items-center justify-center transform -rotate-12 opacity-100 animate-[bounce_0.5s_infinite]
                ${feedbackAnim.type === 'CORRECT' ? 'text-green-500' : 'text-red-500'}
              `}>
                   <div className={`text-4xl font-bold border-4 px-8 py-4 mb-2 bg-black
                       ${feedbackAnim.type === 'CORRECT' ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]'}
                   `}>
                      {feedbackAnim.type === 'CORRECT' ? (theme.mode === 'OLLIE' ? 'ENTITY FREED' : 'PROTOCOL ADHERED') : 'PROTOCOL VIOLATION'}
                   </div>
                   <div className="bg-black text-sm font-mono px-4 py-2 border border-current text-center max-w-sm shadow-xl">
                       {feedbackAnim.message}
                   </div>
              </div>
          </div>
      )}

      {/* --- HEADER --- */}
      <div className={`flex justify-between items-start mb-6 border-b pb-2 z-20 ${header.borderClass}`}>
        <div>
          <h1 className={`text-xl ${header.titleClass}`}>
            {header.title}
          </h1>
          <span className={`${theme.mode === 'MOG' ? 'text-purple-700' : (theme.mode === 'MOG_FINAL' ? 'text-pink-600' : 'text-green-800')} text-xs uppercase`}>{header.subtitle}</span>
        </div>
        
        <div className="text-right flex flex-col items-end">
             <div className={`text-xl font-bold font-mono mb-1 tracking-widest ${theme.mode === 'MOG' ? 'text-purple-300' : (theme.mode === 'OLLIE' ? 'text-[#5c4033]' : (theme.mode === 'MOG_FINAL' ? 'text-pink-400' : 'text-green-400'))}`}>{timeString}</div>
             <div className="flex space-x-1 mt-1" title="Remaining Tasks">
                {taskItems.map((item) => {
                    if (theme.mode === 'MOG_FINAL') {
                        return (
                            <span key={item.index} className={`transition-all duration-300 text-xs 
                                ${item.isCompleted ? 'text-pink-500 scale-100' : 'text-pink-200 scale-75'}
                                ${item.isCurrent ? 'animate-bounce text-pink-600' : ''}
                            `}>
                                ♥
                            </span>
                        );
                    }
                    if (theme.mode === 'MOG') {
                        return (
                             <div key={item.index} className={`w-3 h-3 rounded-full border transition-all duration-300
                                ${item.isCompleted ? 'bg-purple-500 border-purple-600' : 'bg-transparent border-purple-300'}
                                ${item.isCurrent ? 'bg-purple-300 animate-pulse scale-125' : ''}
                             `}></div>
                        );
                    }
                    if (theme.mode === 'OLLIE') {
                        return (
                             <span key={item.index} className={`font-mono text-xs transition-all duration-300
                                ${item.isCompleted ? 'text-[#5c4033]' : 'text-[#5c4033] opacity-20'}
                                ${item.isCurrent ? 'animate-pulse font-bold' : ''}
                             `}>
                                {item.isCompleted ? 'X' : '?'}
                            </span>
                        );
                    }
                    // Fallback for DEFAULT, HARDSHIP, DEBUG, PREMIUM, CORRUPTED, AERO
                    return (
                        <div 
                            key={item.index} 
                            className={`w-3 h-4 border transition-all duration-300 border-green-900
                                ${item.isCompleted ? 'bg-green-900 opacity-30' : ''}
                                ${item.isCurrent ? 'bg-green-500 animate-pulse' : 'bg-transparent'}
                                ${!item.isCompleted && !item.isCurrent ? 'opacity-50' : ''}
                            `}
                        ></div>
                    );
                })}
             </div>
             <div className={`${theme.mode === 'MOG' ? 'text-purple-700' : (theme.mode === 'MOG_FINAL' ? 'text-pink-600' : 'text-green-800')} text-[10px] mt-1 tracking-wider`}>PENDING: {totalTasks - logsProcessedInShift}</div>
        </div>
      </div>

      {/* --- MAIN SCREEN --- */}
      <div className="flex-1 flex flex-col justify-center items-center relative z-20 w-full">
        {activeEvent && (
            <div className={`absolute top-0 left-0 w-full text-center py-1 font-mono text-xs animate-pulse
                ${isSurgeEvent 
                    ? 'bg-purple-900/50 border-y border-purple-500 text-purple-300' 
                    : (isRedactionEvent ? 'bg-gray-800 border-y border-gray-500 text-white' : 
                      (isBurstEvent ? 'bg-orange-800/50 border-y border-orange-500 text-orange-200' : 'bg-amber-900/30 border-y border-amber-600 text-amber-500'))}
            `}>
                <span>
                    {isSurgeEvent ? '⚠ IDENTITY SPOOFING ACTIVE ⚠' : `⚠ ${activeEvent.name.toUpperCase()} ACTIVE ⚠`}
                </span>
                <span className="ml-4 font-bold">[{eventDuration} TURNS REMAINING]</span>
                {isRedactionEvent && <div className="text-[10px] opacity-70">HIGHLIGHT HAZARDS TO REDACT THEM. LOGGING PERMITTED IF SANITIZED.</div>}
            </div>
        )}

        {isShiftEnding ? (
            <div className="text-center font-mono animate-pulse">
                <div className={`text-4xl font-bold mb-4 ${theme.mode === 'OLLIE' ? 'text-[#5c4033]' : 'text-green-500'}`}>SHIFT COMPLETE</div>
                <div className={`${theme.mode === 'OLLIE' ? 'text-black' : 'text-green-800'} text-sm`}>UPLOADING DATA... PLEASE WAIT</div>
                <div className="mt-8 w-64 h-2 bg-gray-900 border border-green-900 mx-auto overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full bg-green-500 w-1/3 animate-[slide_1s_infinite_linear]"></div>
                </div>
            </div>
        ) : currentLog ? (
            // MIRROR TRANSFORMATION
            <div className={`w-full max-w-2xl border p-8 transition-all duration-500 relative overflow-hidden ${theme.container} ${isMirrorEvent ? 'scale-x-[-1]' : ''}`}>
                
                {/* BIG STAMP */}
                <div className={`absolute top-4 right-4 pointer-events-none opacity-20 transform rotate-12 select-none`}>
                    <span className={`text-6xl font-black font-mono border-4 border-dashed p-2 ${theme.stamp}`}>
                        {displayName}
                    </span>
                </div>
                
                {/* THE STICKY NOTE (Dynamic Selection) */}
                {activeStickyNote && !isOllie && (
                    <StickyNote 
                        text={activeStickyNote.text} 
                        color="yellow" 
                        rotation={-2} 
                        top="25%" 
                        left="10%" 
                        onClick={handleDismissNote}
                    />
                )}

                {/* Header Info */}
                <div className="flex justify-between mb-8 text-xs font-mono relative z-10">
                    <span className={`${theme.id}`}>ID: {currentLog.id}</span>
                    {currentLog.logKind === 'OLLIE_GHOST' && <span className="text-red-500 animate-pulse font-bold">DETECTED: GHOST SIGNAL</span>}
                    {currentLog.personalitySpoofId && <span className="text-purple-500 font-bold animate-pulse">HYBRID SIG DETECTED</span>}
                </div>

                <SignalTuner 
                    value={tunerValue} 
                    onDrag={handleDrag} 
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    targetFreq={targetFreq}
                    isInZone={isInZone}
                    isBeautified={theme.mode === 'MOG' || theme.mode === 'MOG_FINAL'}
                />

                <TerminalScreen 
                    text={currentLog.text}
                    noiseLevel={signalNoise}
                    typingComplete={typingComplete}
                    setTypingComplete={setTypingComplete}
                    onSelectionChange={setHighlightCount}
                    highlightCount={highlightCount}
                    theme={theme}
                    isGlitchEvent={!!isGlitchEvent}
                    showWarning={showWarning}
                    isRedactionMode={!!isRedactionEvent}
                />

                <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 relative z-10`}>
                    {renderButtons()}
                    <div className="group relative w-full">
                        <button 
                            onClick={handleDeferClick}
                            disabled={isProcessing}
                            className={`w-full py-4 px-2 border transition-colors uppercase text-sm font-bold tracking-wider rounded-sm
                                ${theme.mode === 'MOG' 
                                    ? 'bg-transparent border-purple-800 text-purple-600 hover:text-purple-300 hover:bg-purple-900/40' 
                                    : (theme.mode === 'CORRUPTED' ? 'border-purple-400 text-white bg-purple-600 hover:bg-purple-500 shadow-glow font-corrupted animate-pulse' : (theme.mode === 'MOG_FINAL' ? 'border-pink-300 text-pink-400 hover:bg-pink-100 hover:text-pink-600' : 'border-amber-700 text-amber-500 hover:bg-amber-900'))} 
                                ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                                ${isBurnout ? 'animate-pulse ring-4 ring-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] z-20' : ''}
                                ${theme.mode === 'PREMIUM' ? 'border-amber-900 text-amber-700 hover:bg-amber-950' : ''}
                                ${theme.mode === 'OLLIE' ? 'border-[#5c4033] text-[#5c4033] hover:bg-[#5c4033] hover:text-[#f5e6d3]' : ''}
                            `}
                        >
                            {theme.mode === 'MOG' ? 'Ask Mog' : (theme.mode === 'MOG_FINAL' ? 'Need Help?' : (theme.mode === 'CORRUPTED' ? 'Let Ollie Handle It' : (theme.mode === 'OLLIE' ? 'SKIP' : (isBurnout ? 'DEFER TO STABILIZE' : (clickCountMap['DEFER'] ? '[CONFIRM?]' : 'Defer')))))}
                        </button>
                    </div>
                </div>
            </div>
        ) : (
            <div className={`${theme.mode === 'MOG' ? 'text-purple-500' : (theme.mode === 'MOG_FINAL' ? 'text-pink-400' : 'text-green-800')} animate-pulse font-mono flex flex-col items-center`}>
                 <div className={`w-8 h-8 border-t-2 ${theme.mode === 'MOG' ? 'border-purple-500' : (theme.mode === 'MOG_FINAL' ? 'border-pink-400' : 'border-green-800')} rounded-full animate-spin mb-4`}></div>
                 {waitingMsg}
            </div>
        )}
      </div>
    </div>
  );
};