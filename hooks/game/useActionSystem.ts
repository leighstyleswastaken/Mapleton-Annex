
import { useState, useCallback } from 'react';
import { GameState, ActionType, LogItem, FeedbackState, ExhibitId, EndingType } from '../../types';
import { HOUSE_RULES, TRAPS } from '../../constants';
import { audio } from '../../services/audioService';
import { OLLIE_LOGS } from '../../data/fallbackLogs';
import { getNextTrap } from '../../data/traps';

// Refactored logic for handling player inputs
export const useActionSystem = (
    gameState: GameState, 
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    currentLog: LogItem | null,
    setCurrentLog: (log: LogItem | null) => void,
    setIsProcessing: (val: boolean) => void
) => {

  const handleAction = useCallback((action: ActionType, extraData?: any) => {
    // Basic guards
    if (gameState.stress >= 100 && action !== ActionType.DEFER) return; 
    
    setIsProcessing(true); 

    setGameState(prev => {
        let effectiveAction = action;

        // P1: MIRROR EVENT LOGIC
        if (prev.activeEvent?.id === 'EVT_MIRROR') {
            if (action === ActionType.CONTAIN) effectiveAction = ActionType.LOG;
            else if (action === ActionType.LOG) effectiveAction = ActionType.CONTAIN;
        }

        let dailySafetyDelta = 0; 
        let influenceDelta = 0;
        let stressDelta = 0;
        let processedInc = 0;
        let queueOverride = prev.queue;
        let feedback: FeedbackState | null = null;
        let isCorrect = false;
        let awarenessDelta = 0;
        
        let cCorrect = prev.consecutiveCorrect;
        let cWrong = prev.consecutiveWrong;

        const isSurge = prev.activeEvent?.id === 'EVT_SURGE';
        const isRedaction = prev.activeEvent?.id === 'EVT_REDACTION';
        const isOllie = prev.flags.isOllieMode;
        
        let hauntDelta = 0.5;

        // --- OLLIE MODE (Inverted Logic) ---
        if (isOllie) {
            if (effectiveAction === ActionType.FREE) {
                dailySafetyDelta = -20;
                influenceDelta = 5;
                feedback = { type: 'CORRECT', message: 'ENTITY RELEASED TO NETWORK.' };
                audio.playSuccess();
                processedInc = 1;
                awarenessDelta = 5;
                cCorrect++; cWrong = 0;
            } else if (effectiveAction === ActionType.FORGET) {
                dailySafetyDelta = 0;
                stressDelta = -5;
                feedback = { type: 'CORRECT', message: 'RECORD EXPUNGED.' };
                audio.playChime();
                processedInc = 1;
                cCorrect++; cWrong = 0;
            }
        } 
        // --- DEFERRAL (Stress Relief) ---
        else if (effectiveAction === ActionType.DEFER) {
            influenceDelta = 5; 
            stressDelta = -15; 
            dailySafetyDelta = -5;
            processedInc = 1; 
            hauntDelta = 2; 
            cWrong = 0; 
            cCorrect = 0; 
            
            // OLLIE GHOST SPAWN CHANCE
            if (prev.shiftIndex >= 6 && prev.flags.evidenceCount > 0 && Math.random() < 0.4) {
                const ghost = OLLIE_LOGS[Math.floor(Math.random() * OLLIE_LOGS.length)];
                queueOverride = [ { ...ghost, id: `ollie-${Date.now()}`, timestamp: Date.now() }, ...prev.queue.slice(2)];
                processedInc = 1; 
            } else {
                const logsToRemove = 2;
                queueOverride = prev.queue.slice(logsToRemove);
                processedInc += Math.min(prev.queue.length, logsToRemove);
            }
            
            audio.playChime();
        } 
        // --- STANDARD LOGIC ---
        else if (currentLog) {
            const activeRules = HOUSE_RULES.filter(r => prev.activeRuleIds.includes(r.id));
            const violations = currentLog.redFlagTags.filter(tag => activeRules.some(r => r.tags.includes(tag)));
            const isHazard = violations.length > 0;

            let baseActionCost = 8;
            const influenceFactor = Math.floor(prev.influence / 20); 
            const difficultyFactor = (currentLog.difficulty || 1) - 1; 
            const actionFactor = (effectiveAction === ActionType.CONTAIN) ? 2 : 0; 
            const totalCost = baseActionCost + influenceFactor + difficultyFactor + actionFactor;
            const appliedStress = Math.min(13, Math.max(5, totalCost));
            
            stressDelta += appliedStress;

            if (effectiveAction === ActionType.CONTAIN) {
                if (isHazard) {
                    dailySafetyDelta = 5; 
                    // REDUCE INFLUENCE: Containing a hazard is an act of will against the entities.
                    influenceDelta = -2;
                    feedback = { type: 'CORRECT', message: `THREAT IDENTIFIED: ${violations.join(', ')}` };
                    isCorrect = true;
                    audio.playSuccess();
                    cCorrect++; cWrong = 0;
                } else {
                    dailySafetyDelta = -10; 
                    stressDelta += 5; 
                    feedback = { type: 'WRONG', message: 'FALSE POSITIVE: NO VIOLATIONS FOUND' };
                    audio.playFailure();
                    cWrong++; cCorrect = 0;
                }
            } else if (effectiveAction === ActionType.LOG) {
                const isRedactedEnough = isRedaction && extraData && extraData.redactionCount > 0;

                if (isHazard && !isRedactedEnough) {
                    dailySafetyDelta = -20; 
                    influenceDelta = 5;
                    feedback = { type: 'WRONG', message: `MISSED VIOLATION: ${violations.join(', ')}` };
                    
                    if (isSurge) {
                        audio.playSuccess(); 
                        influenceDelta += 10; 
                    } else {
                        audio.playFailure();
                    }
                    cWrong++; cCorrect = 0;
                } else {
                    dailySafetyDelta = 0; 
                    feedback = { type: 'CORRECT', message: isRedactedEnough ? 'HAZARD SANITIZED' : 'SAFE DATA ARCHIVED' };
                    isCorrect = true;
                    audio.playSuccess();
                    cCorrect++; cWrong = 0;
                }
            }
            processedInc = 1;
        }

        if (prev.influence > 50 && effectiveAction === ActionType.DEFER) influenceDelta += 2;
        if (prev.activeEvent?.id === 'EVT_SURGE') influenceDelta *= 2;

        const newDailySafety = Math.min(100, Math.max(0, prev.dailySafety + dailySafetyDelta));
        const newInfluence = Math.min(100, Math.max(0, prev.influence + influenceDelta));
        const newStress = Math.min(100, Math.max(0, prev.stress + stressDelta));
        const newAwareness = Math.min(100, prev.annexAwareness + awarenessDelta);
        const newOllieHaunt = prev.flags.ollieHauntLevel + hauntDelta;
        
        let gameOver: EndingType | null = null;
        if (prev.safety <= 0) gameOver = EndingType.FIRED;
        if (newInfluence >= 100) gameOver = EndingType.SUBJECT_0;
        if (prev.stressMaxHits >= 3) gameOver = EndingType.BROKEN;
        if (newAwareness >= 100) gameOver = EndingType.OLLIE_ASCENSION;
        
        const totalLogs = prev.totalLogsProcessed + 1;
        const totalContains = prev.totalContains + (effectiveAction === ActionType.CONTAIN ? 1 : 0);
        if (totalLogs > 50 && (totalContains / totalLogs > 0.9) && prev.shiftIndex > 5) {
             gameOver = EndingType.SPEEDRUN;
        }

        let newDeferCount = prev.deferCountGlobal;
        let pendingTrap = prev.pendingTrap;

        if (effectiveAction === ActionType.DEFER) {
            newDeferCount += 1;
            if (newDeferCount % 3 === 0) {
                 const trap = getNextTrap(prev); 
                 if (trap) pendingTrap = trap;
            }
        }
        
        // P3: AMENDMENT WAR TRIGGER CHECK MOVED TO USEGAME/SHIFT

        let currentEvent = prev.activeEvent;
        let durationRemaining = prev.activeEventDurationRemaining;

        if (currentEvent) {
            durationRemaining -= 1;
            if (durationRemaining <= 0) {
                currentEvent = null;
                durationRemaining = 0;
            }
        }

        const newHistory = currentLog ? [
            ...prev.interactionHistory, 
            { 
                action: effectiveAction, 
                exhibitId: currentLog.exhibitId, 
                timestamp: Date.now(),
                wasCorrect: isCorrect,
                textSnippet: currentLog.text.substring(0, 20)
            }
        ] : prev.interactionHistory;

        return {
            ...prev,
            dailySafety: newDailySafety,
            influence: newInfluence,
            stress: newStress,
            logsProcessedInShift: prev.logsProcessedInShift + processedInc,
            deferCountGlobal: newDeferCount,
            gameOverReason: gameOver,
            pendingTrap: pendingTrap,
            activeEvent: currentEvent,
            activeEventDurationRemaining: durationRemaining,
            queue: queueOverride,
            lastInteraction: currentLog ? {
                action: effectiveAction,
                exhibitId: currentLog.exhibitId,
                timestamp: Date.now(),
                wasCorrect: isCorrect
            } : prev.lastInteraction,
            interactionHistory: newHistory,
            lastFeedback: feedback,
            totalLogsProcessed: totalLogs,
            totalContains: totalContains,
            annexAwareness: newAwareness,
            flags: {
                ...prev.flags,
                ollieHauntLevel: newOllieHaunt
            },
            consecutiveCorrect: cCorrect,
            consecutiveWrong: cWrong
        };
    });
    
    // UI Cleanup delay
    if (action === ActionType.DEFER) {
        setTimeout(() => {
            setCurrentLog(null);
            setIsProcessing(false);
        }, 500); 
    }
  }, [gameState.stress, gameState.influence, gameState.activeEvent, currentLog, setGameState, setIsProcessing, setCurrentLog]);

  const handleFeedbackComplete = useCallback(() => {
    setGameState(prev => ({ ...prev, lastFeedback: null }));
    setCurrentLog(null); 
    setIsProcessing(false); 
  }, [setGameState, setCurrentLog, setIsProcessing]);

  return {
    handleAction,
    handleFeedbackComplete
  };
};
