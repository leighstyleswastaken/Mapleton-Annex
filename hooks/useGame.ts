
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  GameState, 
  Rank, 
  LogItem,
  EndingType,
  WeeklyStats,
  ExhibitId
} from '../types';
import { 
  INITIAL_SAFETY, 
  INITIAL_INFLUENCE, 
  INITIAL_STRESS,
  HOUSE_RULES, 
  LOGS_PER_SHIFT,
  MAX_QUEUE_SIZE,
  SPAWN_INTERVAL_MS,
  TUTORIAL_LOGS,
  SHIFT_DAYS,
  GAME_EVENTS,
  AMENDMENTS
} from '../constants';
import { EMAILS } from '../data/emails';
import { OLLIE_LOGS, HUMAN_LOGS, BOOT_LOGS, FLAVOR_LOGS } from '../data/fallbackLogs';
import { getLunchConfig } from '../data/lunchEvents';
import { generateLogWithGemini } from '../services/geminiService';
import { getDirectorDecision } from '../services/directorService';
import { audio } from '../services/audioService';

// Import New Sub-Hooks
import { useActionSystem } from './game/useActionSystem';
import { useShiftSystem } from './game/useShiftSystem';
import { useNarrativeSystem } from './game/useNarrativeSystem';

const STORAGE_KEY = 'mapleton_annex_save_v1';

const getInitialState = (): GameState => ({
    runId: `run-${Date.now()}`,
    shiftIndex: 0,
    rank: Rank.VISITOR,
    dailySafety: 100, 
    safety: INITIAL_SAFETY, 
    influence: INITIAL_INFLUENCE,
    stress: INITIAL_STRESS,
    annexAwareness: 0,
    queue: [],
    logsProcessedInShift: 0,
    deferCountGlobal: 0,
    deferCountShift: 0, // NEW
    consecutiveCorrect: 0, 
    consecutiveWrong: 0,   
    activeTraps: [],
    activeRuleIds: HOUSE_RULES.filter(r => r.active).map(r => r.id),
    rottedRuleIds: [],
    activeUpgrades: [],
    activeAmendments: [],
    pendingAmendment: null,
    lastAmendmentLogCount: 0,
    seenStickyNotes: [], 
    seenLogIds: [],
    pastLunchLogs: [], 
    flags: {
        isHardshipStatus: false,
        hasClippedEvidence: false,
        evidenceCount: 0,
        mogRapport: 0,
        hasBasementKey: false,
        isOllieMode: false,
        ollieHauntLevel: 0,
        sanaCorruptionLevel: 0
    },
    isShiftActive: false,
    isShiftEnding: false,
    isLunchBreak: false,
    hasTakenLunch: false,
    activeLunchEventId: null,
    isReviewPhase: false,
    pendingReview: null,
    weeklyStats: {
        throughput: 100,
        auditability: 80,
        variance: 10,
        scrutiny: 20,
        stability: 80,
        dossierCount: 0,
        rapport: 0
    },
    isPaused: false,
    isTutorial: true,
    gameOverReason: null,
    activeEvent: null,
    activeEventDurationRemaining: 0,
    lastEventTime: 0,
    pendingTrap: null,
    stats: {
        totalTokens: 0,
        apiCalls: 0,
        apiErrors: 0
    },
    useLLM: false, 
    lastInteraction: null,
    interactionHistory: [],
    lastFeedback: null,
    hasSeenIntro: false,
    activeEmail: null,
    stressMaxHits: 0,
    totalLogsProcessed: 0,
    totalContains: 0
});

const loadSavedState = (): GameState | null => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            const initial = getInitialState();
            
            const mergedState: GameState = {
                ...initial,
                ...parsed,
                flags: { ...initial.flags, ...(parsed.flags || {}) },
                weeklyStats: { ...initial.weeklyStats, ...(parsed.weeklyStats || {}) },
                stats: { ...initial.stats, ...(parsed.stats || {}) },
                seenStickyNotes: parsed.seenStickyNotes || [],
                seenLogIds: parsed.seenLogIds || [],
                pastLunchLogs: parsed.pastLunchLogs || [],
                // Safety resets on load to prevent stuck states
                isShiftActive: false,
                isShiftEnding: false,
                isPaused: false,
                queue: [],
                logsProcessedInShift: 0,
                stress: 0,
                deferCountShift: 0,
                hasTakenLunch: false,
                dailySafety: 100,
                pendingAmendment: null,
                pendingTrap: null,
                activeEvent: null,
                activeEventDurationRemaining: 0,
                lastEventTime: parsed.lastEventTime || 0
            };
            return mergedState;
        }
    } catch (e) {
        console.error("Failed to load save file:", e);
    }
    return null;
};

// Helper: Filter a log pool by seen IDs
const getUnseenLog = (pool: LogItem[], seenIds: string[]): LogItem => {
    const available = pool.filter(l => !seenIds.includes(l.id));
    if (available.length === 0) {
        return pool[Math.floor(Math.random() * pool.length)];
    }
    return available[Math.floor(Math.random() * available.length)];
};

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>(() => loadSavedState() || getInitialState());
  const [currentLog, setCurrentLog] = useState<LogItem | null>(null);
  const [loadingLog, setLoadingLog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Keep ref for timers
  const gameStateRef = useRef(gameState);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  // Persist Save
  useEffect(() => {
      if (gameState.hasSeenIntro && (!gameState.isShiftActive || gameState.isReviewPhase || gameState.gameOverReason)) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
      }
  }, [gameState]);

  // --- MAIN SPAWN LOGIC ---
  const spawnLog = useCallback(async () => {
    const currentState = gameStateRef.current;
    
    // Ghost Log for Tutorial: Shift 0, Item 2
    if (currentState.isTutorial && currentState.shiftIndex === 0 && currentState.logsProcessedInShift === 2 && currentState.queue.length === 0) {
        const ghostLog: LogItem = {
            id: 'tut-ghost-1',
            exhibitId: ExhibitId.HUMAN,
            text: "SYSTEM ERROR: USER 49220 IS STILL LOGGED IN. 'Get out while you can. The Cuddler isn't a program. It's a [REDACTED].'",
            redFlagTags: ['HELP', 'EMOTION'],
            difficulty: 5,
            timestamp: Date.now(),
            isScripted: true,
            baseNoiseLevel: 60,
            logKind: 'OLLIE_GHOST'
        };
        setGameState(prev => ({
            ...prev,
            seenLogIds: [...prev.seenLogIds, ghostLog.id],
            queue: [...prev.queue, ghostLog]
        }));
        return;
    }

    const tutorialLength = TUTORIAL_LOGS.length + 1; // +1 for the Boot log
    const target = currentState.isTutorial ? tutorialLength : LOGS_PER_SHIFT;
    const lunchThreshold = Math.floor(target / 2);
    const totalExisting = currentState.logsProcessedInShift + currentState.queue.length;
    if (totalExisting >= target) return;
    if (currentState.shiftIndex > 0 && !currentState.hasTakenLunch && totalExisting >= lunchThreshold) return;
    if (currentState.queue.length >= MAX_QUEUE_SIZE) return;
    
    // TUTORIAL LOGIC
    if (currentState.isTutorial && currentState.shiftIndex === 0) {
        if (totalExisting === 0) {
            // STEP 1: Random Boot Log (Safe)
            // Use filtering to ensure variety on restart
            const bootLog = getUnseenLog(BOOT_LOGS, currentState.seenLogIds);
            setGameState(prev => ({
                ...prev,
                seenLogIds: [...prev.seenLogIds, bootLog.id],
                queue: [...prev.queue, { ...bootLog, timestamp: Date.now() }]
            }));
            return;
        }
        
        // STEPS 2-4: Fixed Mechanic Tutorials
        const tutIndex = totalExisting - 1;
        if (tutIndex < TUTORIAL_LOGS.length) {
            setGameState(prev => ({
                ...prev,
                queue: [...prev.queue, { ...TUTORIAL_LOGS[tutIndex], timestamp: Date.now() }]
            }));
            return;
        }
        return; 
    }

    setLoadingLog(true);

    // FLAVOR LOGIC (Early Game Funnies)
    if (currentState.shiftIndex <= 3 && Math.random() < 0.2) {
        const flavor = getUnseenLog(FLAVOR_LOGS, currentState.seenLogIds);
        const uniqueFlavor = { 
            ...flavor, 
            id: `flav-${Date.now()}-${Math.random()}`, 
            timestamp: Date.now() 
        };
        setGameState(prev => ({
            ...prev,
            seenLogIds: [...prev.seenLogIds, flavor.id],
            queue: [...prev.queue, uniqueFlavor]
        }));
        setLoadingLog(false);
        return;
    }

    // HUMAN LOGS LOGIC (Mid-Late Game Horror)
    if (currentState.shiftIndex >= 6 && Math.random() < 0.15) {
        const humanLog = getUnseenLog(HUMAN_LOGS, currentState.seenLogIds);
        const uniqueLog = { 
            ...humanLog, 
            id: `human-${Date.now()}-${Math.random()}`, 
            timestamp: Date.now() 
        };
        setGameState(prev => ({
            ...prev,
            seenLogIds: [...prev.seenLogIds, humanLog.id],
            queue: [...prev.queue, uniqueLog]
        }));
        setLoadingLog(false);
        return;
    }

    // --- DIRECTOR INTERVENTION ---
    const instruction = getDirectorDecision(currentState);
    
    // Pass seenLogIds to Gemini Service for deduplication
    const result = await generateLogWithGemini(
      instruction,
      currentState.influence,
      !currentState.useLLM,
      currentState.lastInteraction,
      currentState.shiftIndex,
      currentState.seenLogIds // PASSED
    );

    setGameState(prev => ({
        ...prev,
        seenLogIds: [...prev.seenLogIds, result.log.id], // Track new ID
        queue: [...prev.queue, result.log],
        stats: {
            totalTokens: prev.stats.totalTokens + result.tokens,
            apiCalls: prev.stats.apiCalls + (result.isError ? 0 : 1), 
            apiErrors: result.isError ? prev.stats.apiErrors + 1 : prev.stats.apiErrors
        }
    }));
    setLoadingLog(false);
  }, [currentLog]);

  // --- INITIALIZE SUBSYSTEMS ---
  const narrative = useNarrativeSystem(gameState, setGameState);
  const shift = useShiftSystem(gameState, setGameState, spawnLog);
  const actions = useActionSystem(gameState, setGameState, currentLog, setCurrentLog, setIsProcessing);

  // --- GAME LOOP TIMERS ---

  // Spawn Interval
  useEffect(() => {
    if (!gameState.isShiftActive || gameState.isTutorial || gameState.isShiftEnding || gameState.isPaused || gameState.isLunchBreak || gameState.isReviewPhase || gameState.activeEmail || gameState.pendingAmendment) return;
    const interval = setInterval(() => spawnLog(), SPAWN_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [gameState.isShiftActive, gameState.isTutorial, gameState.isShiftEnding, gameState.isPaused, gameState.isLunchBreak, gameState.isReviewPhase, gameState.activeEmail, gameState.pendingAmendment, spawnLog]);

  // Rule Rot Timer (Shift > 7)
  useEffect(() => {
      if (!gameState.isShiftActive || gameState.shiftIndex <= 7 || gameState.isPaused || gameState.pendingAmendment) return;

      const rotInterval = setInterval(() => {
          setGameState(prev => {
              const active = prev.activeRuleIds;
              const rotted = prev.rottedRuleIds;
              const fresh = active.filter(id => !rotted.includes(id));
              
              if (fresh.length > 0) {
                  const victim = fresh[Math.floor(Math.random() * fresh.length)];
                  audio.playFailure(); 
                  return {
                      ...prev,
                      rottedRuleIds: [...prev.rottedRuleIds, victim]
                  };
              }
              return prev;
          });
      }, 20000); 
      return () => clearInterval(rotInterval);
  }, [gameState.isShiftActive, gameState.shiftIndex, gameState.isPaused, gameState.pendingAmendment]);

  // Stress Timer & Amendment Check & Random Events
  useEffect(() => {
    if (!gameState.isShiftActive || gameState.isShiftEnding || gameState.isPaused || gameState.isLunchBreak || gameState.isReviewPhase || gameState.activeEmail || gameState.pendingAmendment) return;
    
    const stressInterval = setInterval(() => {
        const queueLen = gameStateRef.current.queue.length;
        
        setGameState(prev => {
            // FIX: DYNAMIC STRESS ACCRUAL
            let newStress = prev.stress;
            const influenceFactor = Math.floor(prev.influence / 20); // More influence = More stress sensitivity
            
            // Queue Pressure
            if (queueLen > 3) newStress += 1 + influenceFactor;
            else if (currentLog && Math.random() < 0.3) newStress += 1; // Idle Staring
            else if (queueLen < 2 && newStress > 0 && Math.random() < 0.2) newStress -= 1; // Small relief for clean desk
            
            newStress = Math.min(100, Math.max(0, newStress));
            let maxHits = prev.stressMaxHits;
            if (newStress === 100 && prev.stress < 100) maxHits += 1;

            // AMENDMENT TRIGGER (Poll every 2s)
            let pendingAmendment = prev.pendingAmendment;
            // Cooldown check: Must have processed 3+ logs since last amendment decision
            const logsSinceAmendment = prev.totalLogsProcessed - (prev.lastAmendmentLogCount || 0);
            
            if (prev.shiftIndex >= 4 && prev.influence > 30 && !pendingAmendment && !prev.pendingTrap && logsSinceAmendment >= 3 && Math.random() < 0.05) {
                const available = AMENDMENTS.filter(a => !prev.activeAmendments.some(active => active.id === a.id));
                if (available.length > 0) {
                    pendingAmendment = available[Math.floor(Math.random() * available.length)];
                    audio.playChime();
                }
            }

            // EVENT TRIGGER (Poll every 2s)
            let currentEvent = prev.activeEvent;
            let durationRemaining = prev.activeEventDurationRemaining;
            let lastEventTime = prev.lastEventTime;
            const now = Date.now();
            const EVENT_COOLDOWN_MS = 60000; // 1 minute cooldown

            // Only trigger new event if cooldown passed, not in tutorial, and random chance met
            if (!currentEvent && !prev.isTutorial && Math.random() < 0.02 && (now - lastEventTime > EVENT_COOLDOWN_MS)) {
                 const randomEvent = GAME_EVENTS[Math.floor(Math.random() * GAME_EVENTS.length)];
                 currentEvent = randomEvent;
                 durationRemaining = randomEvent.durationActions;
                 lastEventTime = now;
            }

            return { 
                ...prev, 
                stress: newStress, 
                stressMaxHits: maxHits, 
                pendingAmendment,
                activeEvent: currentEvent,
                activeEventDurationRemaining: durationRemaining,
                lastEventTime: lastEventTime
            };
        });
    }, 2000); 
    return () => clearInterval(stressInterval);
  }, [gameState.isShiftActive, gameState.isShiftEnding, gameState.isPaused, gameState.isLunchBreak, gameState.isReviewPhase, gameState.activeEmail, gameState.pendingAmendment, currentLog]);

  // Queue Consumer & Lifecycle Manager
  useEffect(() => {
    if (gameState.isShiftEnding || gameState.isPaused || gameState.isLunchBreak || gameState.isReviewPhase || gameState.activeEmail || gameState.pendingAmendment) return;
    
    // 1. Consume Queue
    if (!currentLog && !isProcessing && gameState.queue.length > 0) {
        const [next, ...rest] = gameState.queue;
        // Tutorial Stress Spike
        if (gameState.isTutorial && gameState.logsProcessedInShift === 3) {
             setGameState(prev => ({ ...prev, stress: 95 })); 
             audio.playBuzzer();
        }
        setCurrentLog(next);
        setGameState(prev => ({ ...prev, queue: rest }));
        return;
    } 
    
    const tutorialLength = TUTORIAL_LOGS.length + 1;
    const target = gameState.isTutorial ? tutorialLength : LOGS_PER_SHIFT;

    // 2. Check for Lunch
    const pendingLunch = getLunchConfig(gameState.shiftIndex, gameState.flags);
    
    if (!gameState.hasTakenLunch && gameState.isShiftActive) {
         const pct = 0.5; // Default trigger point
         const threshold = Math.floor(target * pct);
         
         if (gameState.logsProcessedInShift >= threshold && !currentLog && gameState.queue.length === 0) {
             // Pass pendingLunch ID if forced, otherwise undefined (Hub Mode)
             narrative.startLunchBreak(pendingLunch?.id);
             return;
         }
    }

    // 3. Check for Shift End
    if (!currentLog && !isProcessing && gameState.queue.length === 0 && gameState.isShiftActive) {
        if (gameState.logsProcessedInShift >= target) {
            if (!shift.isEndingSequenceStarted.current) {
                shift.isEndingSequenceStarted.current = true;
                setTimeout(() => {
                    setGameState(prev => ({ ...prev, isShiftEnding: true }));
                    audio.playChime(); 
                    setTimeout(() => shift.finalizeShift(), 4000);
                }, 2500); 
            }
        } else if (!gameState.isTutorial) spawnLog();
        else if (gameState.isTutorial && gameState.logsProcessedInShift < tutorialLength) spawnLog();
    }
  }, [currentLog, gameState.queue, gameState.isShiftActive, gameState.logsProcessedInShift, gameState.isTutorial, gameState.hasTakenLunch, gameState.isShiftEnding, gameState.isPaused, gameState.isLunchBreak, gameState.isReviewPhase, gameState.activeEmail, gameState.pendingAmendment, isProcessing, spawnLog, narrative.startLunchBreak, shift.finalizeShift]);

  const resetGame = useCallback(() => {
      localStorage.removeItem(STORAGE_KEY);
      setGameState(getInitialState());
      setCurrentLog(null);
      setLoadingLog(false);
      setIsProcessing(false);
      shift.isEndingSequenceStarted.current = false;
      audio.playChime();
  }, []);

  const currentDay = SHIFT_DAYS[gameState.shiftIndex] || 365;
  const hour = 9 + Math.min(gameState.logsProcessedInShift, LOGS_PER_SHIFT);
  const timeString = `${hour < 10 ? '0' : ''}${hour}:00`;

  const togglePause = () => { if (gameState.isShiftActive && !gameState.isShiftEnding) setGameState(prev => ({ ...prev, isPaused: !prev.isPaused })); };

  // New: Handle Sticky Note Dismissal
  const dismissStickyNote = useCallback((noteId: string) => {
      setGameState(prev => ({
          ...prev,
          seenStickyNotes: [...prev.seenStickyNotes, noteId]
      }));
  }, []);

  return {
    gameState,
    setGameState,
    currentLog,
    handleAction: actions.handleAction,
    acceptTrap: narrative.acceptTrap,
    rejectTrap: narrative.rejectTrap,
    signAmendment: narrative.signAmendment,
    vetoAmendment: narrative.vetoAmendment,
    startShift: shift.startShift,
    completeIntro: narrative.completeIntro,
    togglePause,
    currentDay,
    timeString,
    isProcessing,
    completeLunch: narrative.completeLunch,
    closeEmail: narrative.closeEmail,
    handleFeedbackComplete: actions.handleFeedbackComplete,
    resetGame,
    handleReviewDecision: narrative.handleReviewDecision,
    dismissStickyNote
  };
};
