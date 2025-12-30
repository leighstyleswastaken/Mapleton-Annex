
import React, { useState, useEffect } from 'react';
import { Noticeboard } from './components/Noticeboard';
import { Terminal } from './components/Terminal';
import { StatusPanel } from './components/StatusPanel';
import { CheatMenu } from './components/CheatMenu';
import { LunchBreak } from './components/LunchBreak';
import { EmailClient } from './components/EmailClient';
import { WeeklyReview } from './components/WeeklyReview';
import { SystemMenu } from './components/SystemMenu'; 
import { DemoScreen } from './components/DemoScreen'; 
import { MobileNav } from './components/MobileNav';
import { useGame } from './hooks/useGame';
import { 
  HOUSE_RULES, 
  MAX_QUEUE_SIZE,
  GAME_VERSION
} from './constants';
import { ENDINGS } from './data/endings';
import { LUNCH_EVENTS, GENERIC_LUNCH } from './data/lunchEvents';

type MobileTab = 'TERMINAL' | 'RULES' | 'STATUS';

const App: React.FC = () => {
  const { 
    gameState, 
    setGameState, 
    currentLog, 
    handleAction, 
    acceptTrap, 
    rejectTrap, 
    signAmendment,
    vetoAmendment,
    startShift,
    completeIntro,
    togglePause,
    currentDay,
    timeString,
    isProcessing,
    completeLunch,
    closeEmail,
    handleFeedbackComplete,
    resetGame,
    handleReviewDecision,
    dismissStickyNote
  } = useGame();

  const [showCheatMenu, setShowCheatMenu] = useState(false);
  const [showSystemMenu, setShowSystemMenu] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false); 
  const [mobileTab, setMobileTab] = useState<MobileTab>('TERMINAL');

  // Handle ESC for System Menu / Pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            if (isDemoMode) {
                setIsDemoMode(false);
                return;
            }
            if (showCheatMenu) {
                setShowCheatMenu(false);
                return;
            }
            if (showSystemMenu) {
                setShowSystemMenu(false);
                if (gameState.isPaused) togglePause();
                return;
            }
            
            handleOpenSystemMenu();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePause, showCheatMenu, showSystemMenu, gameState.isPaused, isDemoMode]);

  const handleOpenSystemMenu = () => {
      setShowSystemMenu(true);
      if (!gameState.isPaused && gameState.isShiftActive) {
          togglePause(); 
      }
  };

  const handleCloseSystemMenu = () => {
      setShowSystemMenu(false);
      if (gameState.isPaused && gameState.isShiftActive) {
          togglePause(); 
      }
  };

  const getEventClass = () => {
    if (!gameState.activeEvent) return '';
    return gameState.activeEvent.uiClass;
  };

  const isAero = gameState.activeUpgrades.includes('SYS_AERO');

  // --- PERSISTENT UI OVERLAYS ---
  const VersionOverlay = () => (
      <div className="fixed bottom-16 md:bottom-1 right-1 z-[100] text-[10px] text-white/30 font-mono tracking-widest pointer-events-none select-none mix-blend-difference">
          v{GAME_VERSION}
      </div>
  );

  const SysOptButton = () => (
      <button 
        onClick={() => setShowSystemMenu(true)}
        className="fixed top-4 right-4 z-[60] text-[10px] text-green-700 border border-green-900 px-2 py-1 hover:bg-green-900 hover:text-white uppercase tracking-widest bg-black"
      >
          [ SYS_OPT ]
      </button>
  );

  // --- View: Demo Mode ---
  if (isDemoMode) {
      return (
        <>
            <VersionOverlay />
            <DemoScreen onExit={() => setIsDemoMode(false)} />
        </>
      );
  }

  // --- View: Intro Screen ---
  if (!gameState.hasSeenIntro) {
      return (
          <div className="flex flex-col items-center justify-center h-[100dvh] bg-[#050505] text-green-500 font-mono p-8 text-center relative overflow-hidden">
             
              <VersionOverlay />
              <SysOptButton />

              <SystemMenu 
                 isOpen={showSystemMenu} 
                 onClose={() => setShowSystemMenu(false)} 
                 onRestart={resetGame} 
              />
              
              <div 
                  className="absolute inset-0 z-0 bg-cover bg-center opacity-40 grayscale contrast-125 transition-all duration-[3s] hover:grayscale-0 hover:opacity-50"
                  style={{ backgroundImage: "url('./start_screen.jpg')" }}
              ></div>
              <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/90 via-black/70 to-black/90"></div>
              
              <div className="max-w-2xl w-full border-4 border-double border-green-800 p-6 md:p-10 bg-black/90 z-10 shadow-[0_0_50px_rgba(0,255,0,0.1)] relative backdrop-blur-sm">
                  <div className="absolute top-4 right-4 border border-green-700 px-2 py-1 text-xs uppercase opacity-50">
                      Form HR-001
                  </div>

                  <h1 className="text-2xl md:text-3xl mb-8 font-bold tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">MAPLETON ANNEX</h1>
                  
                  <div className="text-left space-y-6 text-sm mb-8 leading-relaxed text-green-100">
                      <p>
                        "Mapleton Annex used to be council storage. Now it's where we keep the weird stuff until we can name it."
                      </p>
                      
                      <div className="bg-red-900/20 border border-red-900 p-3 text-xs italic text-red-300">
                         NOTE: This desk became available at 08:59 AM today. <br/>
                         The previous employee (Ollie) left... suddenly. <br/>
                         Please ignore any personal items he left behind.
                      </div>

                      {/* HOW TO PLAY BOX */}
                      <div className="bg-[#0a1a0a] border border-green-600 p-4 font-mono text-xs">
                          <h3 className="text-green-400 font-bold mb-3 border-b border-green-800 pb-1">STANDARD OPERATING PROCEDURE</h3>
                          <ol className="list-decimal list-inside space-y-2 text-green-200">
                              <li><span className="text-white font-bold">TUNE</span>: Drag the Frequency Slider to clarify the signal.</li>
                              <li><span className="text-white font-bold">ANALYZE</span>: Read the text. Look for <span className="text-red-400">Emotion</span>, <span className="text-red-400">Charm</span>, or <span className="text-red-400">Help</span>.</li>
                              <li><span className="text-white font-bold">DECIDE</span>:
                                  <ul className="ml-4 mt-1 space-y-1 text-[10px] text-green-400">
                                      <li>- <span className="text-red-500 font-bold">CONTAIN</span> if it shows intent or personality.</li>
                                      <li>- <span className="text-green-500 font-bold">LOG</span> if it is boring, technical, or sterile.</li>
                                      <li>- <span className="text-yellow-500 font-bold">DEFER</span> if you panic (clears queue, but lowers Integrity).</li>
                                  </ul>
                              </li>
                              <li><span className="text-white font-bold">SURVIVE</span>: Manage Stress. Do not trust the voice.</li>
                          </ol>
                      </div>

                      <p className="italic text-xs text-green-700 text-center">
                          "Pens are how it gets out. Through what you write down. Through what you decide to keep."
                      </p>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                      <button 
                          onClick={completeIntro}
                          className="flex-1 py-4 bg-green-900 text-white hover:bg-green-700 uppercase font-bold tracking-widest border border-green-500 transition-all hover:scale-[1.01] shadow-lg"
                      >
                          [ PICK UP PEN ]
                      </button>
                      <button 
                          onClick={(e) => {
                              e.stopPropagation();
                              setIsDemoMode(true);
                          }}
                          className="w-full md:w-32 py-4 bg-black text-green-600 hover:text-white hover:bg-green-900/30 uppercase font-bold tracking-widest border border-green-800 transition-all text-xs"
                      >
                          DEMO
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  // --- View: Game Over ---
  if (gameState.gameOverReason) {
    const ending = ENDINGS[gameState.gameOverReason];
    const title = ending?.title || "GAME OVER";
    const desc = ending?.description || "The shift has ended permanently.";
    const color = ending?.color || "text-white";

    return (
        <div className="flex flex-col items-center justify-center h-[100dvh] bg-black text-white font-mono p-8 text-center z-50 relative">
             <VersionOverlay />
             <SysOptButton />

            <SystemMenu 
                 isOpen={showSystemMenu} 
                 onClose={() => setShowSystemMenu(false)} 
                 onRestart={resetGame} 
            />

            <div className="max-w-2xl w-full border border-gray-800 p-8 bg-[#0a0a0a]">
                <div className="text-xs text-gray-600 mb-8 tracking-[0.2em] border-b border-gray-900 pb-2">
                    INCIDENT REPORT // FINAL ENTRY
                </div>
                
                <h1 className={`text-3xl md:text-4xl mb-6 font-bold tracking-wider ${color} animate-pulse`}>{title}</h1>
                
                <p className="text-md md:text-lg mb-10 leading-relaxed text-gray-300 font-serif">
                    {desc}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8 text-xs font-mono text-gray-500 border-t border-gray-800 pt-6">
                    <div className="text-right pr-4 border-r border-gray-800">
                        <p>EMPLOYEE ID</p>
                        <p>DAYS ACTIVE</p>
                        <p>FINAL RANK</p>
                    </div>
                    <div className="text-left pl-4 text-gray-400">
                        <p>49221</p>
                        <p>{typeof gameState.shiftIndex === 'number' ? gameState.shiftIndex : 0}</p>
                        <p>{gameState.rank}</p>
                    </div>
                </div>

                <button 
                    onClick={resetGame} 
                    className="w-full py-4 border border-white/20 hover:bg-white hover:text-black uppercase tracking-widest transition-all"
                >
                    INITIALIZE NEW OPERATOR
                </button>
            </div>
        </div>
    );
  }
  
  // --- View: Weekly Review ---
  if (gameState.isReviewPhase) {
      return (
          <>
            <VersionOverlay />
            <SysOptButton />
            <SystemMenu isOpen={showSystemMenu} onClose={() => setShowSystemMenu(false)} onRestart={resetGame} />
            <WeeklyReview 
                gameState={gameState}
                onMakeDecision={handleReviewDecision}
            />
          </>
      );
  }

  // --- View: Email Client ---
  if (gameState.activeEmail && !gameState.isShiftActive) {
      return (
        <>
             <VersionOverlay />
             <SysOptButton />
            <SystemMenu isOpen={showSystemMenu} onClose={() => setShowSystemMenu(false)} onRestart={resetGame} />
            <EmailClient email={gameState.activeEmail} onClose={closeEmail} />
        </>
      );
  }

  // --- View: Lunch Break ---
  if (gameState.isLunchBreak) {
      let event;
      let isForced = false;

      if (gameState.activeLunchEventId) {
          event = LUNCH_EVENTS.find(e => e.id === gameState.activeLunchEventId);
          isForced = true; 
      } else {
          const scheduled = LUNCH_EVENTS.find(e => e.triggerShiftIndex === gameState.shiftIndex);
          if (scheduled) {
              event = scheduled;
              isForced = true; 
          } else {
              event = GENERIC_LUNCH;
              isForced = false; 
          }
      }
      
      const safeEvent = event || GENERIC_LUNCH;

      return (
        <>
             <VersionOverlay />
             <SysOptButton />
            <SystemMenu isOpen={showSystemMenu} onClose={() => setShowSystemMenu(false)} onRestart={resetGame} />
            <LunchBreak 
                event={safeEvent} 
                onComplete={completeLunch} 
                currentStress={gameState.stress} 
                gameState={gameState}
                isForcedMode={isForced}
            />
        </>
      );
  }

  // --- View: P3 AMENDMENT MODAL (New) ---
  if (gameState.pendingAmendment) {
      const VETO_COST = 15;
      const canVeto = gameState.stress + VETO_COST <= 100;

      return (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <VersionOverlay />
              <div className="bg-yellow-200 text-black border-4 border-dashed border-gray-500 p-8 max-w-md w-full shadow-[10px_10px_0px_rgba(0,0,0,0.5)] transform rotate-1 relative font-serif">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-100 border border-red-300 px-3 py-1 text-xs text-red-800 uppercase font-bold tracking-widest shadow-sm">
                      Proposed Amendment
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-4 text-center">Rule Change Request</h2>
                  
                  <div className="mb-6 space-y-4">
                      <div className="bg-white/50 p-2 border border-black/10">
                          <p className="text-xs uppercase text-gray-500 mb-1">Target:</p>
                          <p className="font-mono text-sm">{gameState.pendingAmendment.ruleId}</p>
                      </div>
                      
                      <div className="text-xl font-bold text-blue-900 leading-tight">
                          "{gameState.pendingAmendment.newText}"
                      </div>
                      
                      <div className="italic text-gray-700 bg-yellow-100 p-2 border-l-4 border-blue-400">
                          Note: {gameState.pendingAmendment.reason}
                      </div>
                  </div>

                  <div className="flex gap-4">
                      <button 
                        onClick={signAmendment}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 font-bold uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
                      >
                          Sign (Influence +15)
                      </button>
                      <button 
                        onClick={canVeto ? vetoAmendment : undefined}
                        disabled={!canVeto}
                        className={`flex-1 border-2 border-black py-3 font-bold uppercase tracking-wider transition-all
                            ${canVeto 
                                ? 'bg-white hover:bg-gray-100 text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                        `}
                      >
                          {canVeto ? `Veto (Stress +${VETO_COST})` : 'TOO STRESSED'}
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  // --- View: Trap Modal ---
  if (gameState.pendingTrap) {
      const REJECT_COST = 20;
      const canReject = gameState.stress + REJECT_COST <= 100;

      return (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
              <VersionOverlay />
              <div className="bg-[#1a1a1a] border-2 border-purple-500 p-6 max-w-md w-full shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                  <h2 className="text-purple-400 font-bold text-xl mb-4 font-mono">OPTIMIZATION SUGGESTED</h2>
                  <p className="text-gray-300 mb-6 font-mono text-sm leading-relaxed">
                      {gameState.pendingTrap.description}
                  </p>
                  <div className="flex gap-4">
                      <button 
                        onClick={acceptTrap}
                        className="flex-1 bg-purple-700 hover:bg-purple-600 text-white py-3 font-bold uppercase tracking-wider"
                      >
                          Accept Upgrade
                      </button>
                      <button 
                        onClick={canReject ? rejectTrap : undefined}
                        disabled={!canReject}
                        className={`flex-1 border border-gray-600 py-3 font-bold uppercase tracking-wider
                            ${canReject ? 'hover:bg-gray-800 text-gray-400' : 'opacity-50 cursor-not-allowed text-gray-600'}
                        `}
                      >
                          {canReject ? `Refuse (+${REJECT_COST} Stress)` : 'TOO STRESSED'}
                      </button>
                  </div>
              </div>
          </div>
      )
  }

  // --- View: Start Screen (Shift Start) ---
  if (!gameState.isShiftActive) {
      return (
          <div className="flex flex-col items-center justify-center h-[100dvh] bg-[#1a1a1a] text-gray-300 font-mono">
              <VersionOverlay />
              <SysOptButton />
              <SystemMenu isOpen={showSystemMenu} onClose={() => setShowSystemMenu(false)} onRestart={resetGame} />

              <div className="bg-black p-8 border border-gray-700 shadow-xl max-w-md w-full relative">
                  <div className="absolute top-0 right-0 p-2 text-[10px] text-gray-600">ID: 49221</div>
                  <h1 className="text-2xl mb-2 text-green-500">MAPLETON ANNEX</h1>
                  <h2 className="text-sm text-gray-500 mb-6 uppercase tracking-widest">
                    Day {currentDay} // {gameState.rank}
                  </h2>
                  
                  <div className="space-y-4 mb-8 text-sm">
                    {gameState.shiftIndex === 0 ? (
                        <>
                            <p className="text-white font-bold border-b border-gray-700 pb-2">TUTORIAL PROTOCOLS</p>
                            <div className="space-y-2 text-xs">
                                <p>1. <span className="text-red-400 font-bold">CONTAIN</span> logs that show emotion, charm, or intent.</p>
                                <p>2. <span className="text-green-400 font-bold">LOG</span> logs that are boring, technical, or sterile.</p>
                                <p>3. <span className="text-amber-400 font-bold">DEFER</span> if overwhelmed. It clears the queue but costs safety.</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="border-b border-gray-700 pb-2 font-bold">DAILY BRIEFING</p>
                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                    <p className="text-gray-400">FACILITY INTEGRITY</p>
                                    <p className={`font-bold ${gameState.safety < 40 ? 'text-red-500' : 'text-blue-400'}`}>{gameState.safety}%</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">INFLUENCE</p>
                                    <p className="text-purple-400 font-bold">{gameState.influence}%</p>
                                </div>
                            </div>
                            
                            <div className="mt-4 bg-gray-900 p-2 border-l-2 border-green-500 text-xs text-gray-300">
                                <p className="mb-1 text-green-500 font-bold">PROTOCOL UPDATE:</p>
                                <p>Shift Stability resets to 100% daily.</p>
                                <p>Ending the day with High Stability repairs Facility Integrity.</p>
                                <p>Ending Low damages it.</p>
                            </div>
                        </>
                    )}
                  </div>

                  <button 
                    onClick={startShift}
                    className="w-full py-3 bg-green-900 text-green-100 hover:bg-green-700 uppercase font-bold tracking-wider border border-green-800"
                  >
                    Clock In
                  </button>
              </div>
          </div>
      )
  }

  // --- CSS STRATEGY: ---
  // Desktop: Normal flex layout. Panels are visible blocks.
  // Mobile: Panels are hidden by default. If active, they become fixed full-screen overlays.
  
  // Base classes for side panels that reset completely on desktop (md:)
  const panelBaseClass = "w-full md:w-1/4 h-full z-10 transition-all duration-300";
  
  // Mobile: "Modal" style (Fixed, inset-0, black bg)
  // Desktop: "Column" style (Static, transparent bg, visible)
  const getPanelVisibilityClass = (isActiveMobile: boolean) => {
      // Logic:
      // 1. On Mobile: If active, 'fixed inset-0 ...'. If not active, 'hidden'.
      // 2. On Desktop: Always 'md:block md:static md:inset-auto ...'
      
      const mobileClass = isActiveMobile 
        ? "fixed inset-0 bg-black/95 z-40 overflow-y-auto pb-20 pt-10 px-4" 
        : "hidden";
        
      return `${mobileClass} md:block md:static md:bg-transparent md:z-auto md:p-0 md:overflow-visible`;
  };

  // --- View: Main Game Loop ---
  return (
    <div className={`flex h-[100dvh] w-screen overflow-hidden text-sm relative transition-all duration-1000 ${getEventClass()} ${isAero ? 'bg-gradient-to-br from-gray-900 to-black' : ''}`}>
        <VersionOverlay />
        <style>{`
            .event-glitch .flex-1 { 
                animation: twitch 2s infinite; 
                text-shadow: 2px 0 rgba(255,0,0,0.5), -2px 0 rgba(0,0,255,0.5);
            }
            .event-surge * { color: #d8b4fe !important; border-color: #d8b4fe !important; }
            .event-fog { filter: blur(3px) brightness(80%); }
            
            @keyframes twitch {
                0% { transform: translate(0,0); }
                5% { transform: translate(-2px, 1px); }
                10% { transform: translate(1px, -1px); }
                15% { transform: translate(0,0); }
                100% { transform: translate(0,0); }
            }
            .safe-area-pb {
                padding-bottom: env(safe-area-inset-bottom);
            }
        `}</style>

        <SysOptButton />

        <SystemMenu 
            isOpen={showSystemMenu} 
            onClose={handleCloseSystemMenu} 
            onRestart={resetGame} 
        />
        
        {/* PAUSE OVERLAY */}
        {gameState.isPaused && !showSystemMenu && (
            <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
                <div className="text-center font-mono border-2 border-green-500 p-8 bg-black box-shadow-xl">
                    <h2 className="text-2xl text-green-500 font-bold mb-4 tracking-widest">SYSTEM PAUSED</h2>
                    <p className="text-gray-400 text-xs mb-8">Operator step-away initiated.</p>
                    <button 
                        onClick={togglePause}
                        className="px-6 py-2 border border-green-700 text-green-500 hover:bg-green-900 uppercase font-bold"
                    >
                        RESUME SESSION [ESC]
                    </button>
                </div>
            </div>
        )}

      {/* Left Panel: Rules */}
      {/* On Mobile: Toggled by 'RULES' tab. On Desktop: Always visible column. */}
      <div className={`${panelBaseClass} ${getPanelVisibilityClass(mobileTab === 'RULES')}`}>
        <Noticeboard 
            rules={HOUSE_RULES} 
            activeRuleIds={gameState.activeRuleIds} 
            activeAmendments={gameState.activeAmendments}
            influence={gameState.influence} 
            isAero={isAero}
        />
        {/* Mobile Close Button (Optional UX help) */}
        <div className="md:hidden mt-4 text-center">
            <button onClick={() => setMobileTab('TERMINAL')} className="text-gray-500 text-xs border border-gray-700 px-4 py-2 uppercase">Close Protocols</button>
        </div>
      </div>

      {/* Center Panel: Terminal */}
      {/* On Mobile: Always rendered underneath, but might be covered by overlays. Flex col handles layout. */}
      <div className="flex-1 h-full z-10 min-w-[300px] flex flex-col pb-16 md:pb-0">
        <Terminal 
            currentLog={currentLog} 
            onAction={handleAction} 
            gameState={gameState} 
            timeString={timeString}
            activeEvent={gameState.activeEvent}
            eventDuration={gameState.activeEventDurationRemaining}
            isShiftEnding={gameState.isShiftEnding}
            lastFeedback={gameState.lastFeedback}
            isProcessing={isProcessing}
            onFeedbackComplete={handleFeedbackComplete}
            onNoteDismiss={dismissStickyNote}
        />
        <div className="absolute top-20 right-10 text-xs text-green-800 font-mono hidden md:block">
            QUEUE LOAD: {gameState.queue.length}/{MAX_QUEUE_SIZE}
        </div>
      </div>

      {/* Right Panel: Status */}
      {/* On Mobile: Toggled by 'STATUS' tab. On Desktop: Always visible column. */}
      <div className={`${panelBaseClass} ${getPanelVisibilityClass(mobileTab === 'STATUS')}`}>
        <StatusPanel 
            safety={gameState.safety}
            dailySafety={gameState.dailySafety}
            influence={gameState.influence}
            stress={gameState.stress}
            rank={gameState.rank}
            shiftIndex={gameState.shiftIndex}
            activeTraps={gameState.activeTraps}
            flags={gameState.flags}
            isAero={isAero}
        />
        <div className="md:hidden mt-4 text-center">
            <button onClick={() => setMobileTab('TERMINAL')} className="text-gray-500 text-xs border border-gray-700 px-4 py-2 uppercase">Close Bios</button>
        </div>
      </div>

      <MobileNav 
        activeTab={mobileTab} 
        onTabChange={setMobileTab} 
        hasAlerts={gameState.dailySafety < 50 || gameState.stress > 80}
      />

      {/* Cheat Menu Toggle */}
      <button 
        onClick={() => setShowCheatMenu(!showCheatMenu)}
        className="fixed bottom-20 md:bottom-1 left-1 opacity-20 hover:opacity-100 text-[10px] text-white z-50 font-mono"
      >
        DEV_TOOLS
      </button>

      <CheatMenu 
        isOpen={showCheatMenu} 
        onClose={() => setShowCheatMenu(false)} 
        gameState={gameState} 
        setGameState={setGameState} 
      />
    </div>
  );
};

export default App;
