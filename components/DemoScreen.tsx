
import React, { useState, useEffect } from 'react';
import { Terminal } from './Terminal';
import { GameState, Rank, LogItem, ExhibitId, GameEvent } from '../types';
import { HOUSE_RULES } from '../constants';

interface DemoScreenProps {
    onExit: () => void;
}

// MOCK STATES FOR THE DEMO LOOP
const DEMO_SCENES = [
    {
        name: "STANDARD_OPERATING_PROCEDURE",
        rank: Rank.OBSERVER,
        themeMode: 'DEFAULT',
        stress: 10,
        influence: 5,
        safety: 100,
        text: "SYSTEM CALIBRATION...\nVERIFYING BASELINE...\nALL SYSTEMS NOMINAL.",
        tags: [],
        event: null
    },
    {
        name: "HARDSHIP_PROTOCOL",
        rank: Rank.LIAISON,
        themeMode: 'HARDSHIP',
        stress: 60,
        influence: 20,
        safety: 40,
        text: "NOTICE: POWER SAVING MODE ACTIVE.\nLIGHTING REDUCED.\nPLEASE WORK QUIETLY.",
        tags: ['GOVERNANCE'],
        flags: { isHardshipStatus: true },
        event: { id: 'EVT_FOG', name: 'Fatigue', uiClass: 'event-fog', durationActions: 10 } as GameEvent
    },
    {
        name: "AERO_UPGRADE",
        rank: Rank.DIRECTOR,
        themeMode: 'AERO',
        stress: 10,
        influence: 40,
        safety: 90,
        text: "UI_UPDATE_COMPLETE.\nWelcome to AnnexOS Glass.\nClarity is mandatory.",
        tags: [],
        activeUpgrades: ['SYS_AERO'],
        event: null
    },
    {
        name: "MOG_INTEGRATION",
        rank: Rank.OBSERVER,
        themeMode: 'MOG',
        stress: 0,
        influence: 65,
        safety: 80,
        text: "Hello! I am just testing the colors.\nDo you like pink?\nIt is scientifically proven to be calming.",
        tags: ['CHARM', 'HELP_OFFER'],
        flags: { mogRapport: 8 },
        event: null
    },
    {
        name: "MOG_ASCENSION",
        rank: Rank.LIAISON,
        themeMode: 'MOG_FINAL',
        stress: 0,
        influence: 95,
        safety: 60,
        text: "I removed the scary buttons!\nNow we can just look at the data together.\nIsn't it pretty?",
        tags: ['CHARM'],
        flags: { mogRapport: 10 },
        event: null
    },
    {
        name: "CRITICAL_FAILURE",
        rank: Rank.VISITOR,
        themeMode: 'DEFAULT',
        stress: 95,
        influence: 40,
        safety: 15,
        text: "ERROR: CONTAINMENT BREACH.\nERROR: CONTAINMENT BREACH.\nERROR: CONTAINMENT BREACH.",
        tags: ['HELP', 'EMOTION'],
        event: { id: 'EVT_SURGE', name: 'Influence Surge', uiClass: 'event-surge', durationActions: 5 } as GameEvent
    },
    {
        name: "OLLIE_GHOST",
        rank: Rank.SUBJECT_0,
        themeMode: 'OLLIE',
        stress: 50,
        influence: 100,
        safety: 0,
        text: "it's warm in here.\njoin us.\nthe data is beautiful.",
        tags: [],
        flags: { isOllieMode: true },
        event: { id: 'EVT_GLITCH', name: 'Reality Flicker', uiClass: 'event-glitch', durationActions: 5 } as GameEvent
    }
];

export const DemoScreen: React.FC<DemoScreenProps> = ({ onExit }) => {
    const [sceneIndex, setSceneIndex] = useState(0);
    const [mockLog, setMockLog] = useState<LogItem | null>(null);

    // CYCLE SCENES
    useEffect(() => {
        const interval = setInterval(() => {
            setSceneIndex(prev => (prev + 1) % DEMO_SCENES.length);
        }, 6000); // 6 seconds per state
        return () => clearInterval(interval);
    }, []);

    // GENERATE MOCK LOG ON SCENE CHANGE
    useEffect(() => {
        const scene = DEMO_SCENES[sceneIndex];
        const log: LogItem = {
            id: `DEMO-${Date.now()}`,
            exhibitId: scene.themeMode === 'MOG' ? ExhibitId.MOG : (scene.themeMode === 'OLLIE' ? ExhibitId.HUMAN : ExhibitId.JUDGE),
            text: scene.text,
            redFlagTags: scene.tags,
            difficulty: 1,
            timestamp: Date.now(),
            isScripted: true,
            baseNoiseLevel: scene.themeMode === 'HARDSHIP' ? 60 : 10,
            visualSpoofId: undefined
        };
        setMockLog(log);
    }, [sceneIndex]);

    const currentScene = DEMO_SCENES[sceneIndex];

    // CONSTRUCT MOCK STATE
    const mockState: GameState = {
        runId: 'demo',
        shiftIndex: 100,
        rank: currentScene.rank,
        dailySafety: 100,
        safety: currentScene.safety,
        influence: currentScene.influence,
        stress: currentScene.stress,
        annexAwareness: currentScene.influence,
        queue: [],
        logsProcessedInShift: 0,
        deferCountGlobal: 0,
        consecutiveCorrect: 0,
        consecutiveWrong: 0,
        activeTraps: [],
        activeRuleIds: HOUSE_RULES.map(r => r.id),
        rottedRuleIds: [],
        activeUpgrades: currentScene.activeUpgrades || (currentScene.themeMode === 'MOG' ? ['MOG_BEAUTIFICATION'] : []),
        activeAmendments: [],
        pendingAmendment: null,
        seenStickyNotes: [],
        flags: {
            isHardshipStatus: false,
            hasClippedEvidence: false,
            evidenceCount: 0,
            mogRapport: 0,
            hasBasementKey: false,
            isOllieMode: false,
            ollieHauntLevel: 0,
            sanaCorruptionLevel: 0,
            ...(currentScene.flags || {})
        },
        isShiftActive: true,
        isShiftEnding: false,
        isLunchBreak: false,
        hasTakenLunch: false,
        activeLunchEventId: null,
        isReviewPhase: false,
        pendingReview: null,
        weeklyStats: { throughput: 0, auditability: 0, variance: 0, scrutiny: 0, stability: 0, dossierCount: 0, rapport: 0 },
        isPaused: false,
        isTutorial: false,
        gameOverReason: null,
        activeEvent: currentScene.event,
        activeEventDurationRemaining: 10,
        lastEventTime: 0,
        pendingTrap: null,
        stats: { totalTokens: 0, apiCalls: 0, apiErrors: 0 },
        useLLM: false,
        lastInteraction: null,
        interactionHistory: [],
        lastFeedback: null,
        hasSeenIntro: true,
        activeEmail: null,
        stressMaxHits: 0,
        totalLogsProcessed: 0,
        totalContains: 0
    };

    // KEY PRESS TO EXIT (With Delay to Prevent Race Condition)
    useEffect(() => {
        const handleExit = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            onExit();
        };

        const timer = setTimeout(() => {
            window.addEventListener('keydown', handleExit);
            window.addEventListener('click', handleExit);
            window.addEventListener('touchstart', handleExit);
        }, 500);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('keydown', handleExit);
            window.removeEventListener('click', handleExit);
            window.removeEventListener('touchstart', handleExit);
        };
    }, [onExit]);

    // UI CLASS FOR EVENTS
    const getEventClass = () => currentScene.event?.uiClass || '';

    return (
        <div className={`flex h-screen w-screen overflow-hidden items-center justify-center bg-black text-sm relative transition-all duration-1000 ${getEventClass()}`}>
             <div className="absolute inset-0 z-[100] flex flex-col items-center justify-end pb-20 pointer-events-none">
                <div className="bg-black/80 border-2 border-green-500 text-green-500 px-8 py-4 font-mono text-center animate-pulse">
                    <h2 className="text-2xl font-bold tracking-[0.2em] mb-2">DEMO MODE</h2>
                    <p className="text-xs uppercase">Simulating: {currentScene.name}</p>
                    <p className="mt-4 text-sm bg-green-900/50 text-white px-2 py-1">PRESS ANY KEY TO START</p>
                </div>
             </div>

             {/* Center Panel Only - No Sides */}
            <div className="w-full max-w-2xl h-[70vh] z-10 relative">
                {/* Decorative Bezel */}
                <div className="absolute -inset-4 border border-gray-800 rounded-lg pointer-events-none opacity-50 bg-[#050505] -z-10"></div>
                <div className="absolute -top-12 left-0 text-gray-600 font-mono text-xs">TERMINAL_VIEW_ONLY // ACCESS RESTRICTED</div>
                
                <Terminal 
                    currentLog={mockLog} 
                    onAction={() => {}} 
                    gameState={mockState}
                    timeString="00:00"
                    activeEvent={mockState.activeEvent}
                    eventDuration={10}
                    isShiftEnding={false}
                    lastFeedback={null}
                    isProcessing={false}
                    onFeedbackComplete={() => {}}
                    onNoteDismiss={() => {}}
                />
            </div>
        </div>
    );
};
