import React, { useCallback, useRef } from 'react';
import { GameState, WeeklyStats, EndingType, Rank, Email } from '../../types';
import { SHIFT_DAYS, LOGS_PER_SHIFT, TUTORIAL_LOGS } from '../../constants';
import { 
    EMAILS, 
    EMAIL_CAL_DEBT, 
    EMAIL_CAL_WARNING, 
    EMAIL_DIRECTOR_SPEED, 
    EMAIL_DIRECTOR_SLOW,
    EMAIL_MOG_LADDER_DASHBOARD,
    EMAIL_MOG_LADDER_TAKEOVER,
    EMAIL_MOG_HARDSHIP_OPPORTUNITY,
    EMAIL_MOG_HARDSHIP_OWNERSHIP,
    EMAIL_MOG_ARCHIVIST_HELP,
    EMAIL_MOG_ARCHIVIST_FRAME,
    EMAIL_MOG_SYMPATHIZER_FRIEND,
    EMAIL_MOG_SYMPATHIZER_IDENTITY
} from '../../data/emails';
import { getReviewForShift } from '../../data/reviews';
import { audio } from '../../services/audioService';

const getNarrativeEmail = (gameState: GameState, nextShiftIndex: number): Email | null => {
    const { flags, rank } = gameState;

    if (nextShiftIndex === 4) {
        if (gameState.weeklyStats.throughput > 95 && gameState.weeklyStats.stability > 80) return EMAIL_DIRECTOR_SPEED;
        if (gameState.weeklyStats.throughput < 60) return EMAIL_DIRECTOR_SLOW;
    }

    if (nextShiftIndex === 5) {
        if (gameState.flags.isHardshipStatus) return EMAIL_CAL_DEBT;
        if (gameState.flags.mogRapport > 4) return EMAIL_CAL_WARNING;
    }

    if (nextShiftIndex === 7) {
        if (flags.isHardshipStatus) return EMAIL_MOG_HARDSHIP_OPPORTUNITY;
        if (flags.hasClippedEvidence) return EMAIL_MOG_ARCHIVIST_HELP;
        if (flags.mogRapport > 5) return EMAIL_MOG_SYMPATHIZER_FRIEND;
        if (rank === Rank.LIAISON || rank === Rank.DIRECTOR) return EMAIL_MOG_LADDER_DASHBOARD;
    }

    if (nextShiftIndex === 10) {
        if (flags.isHardshipStatus) return EMAIL_MOG_HARDSHIP_OWNERSHIP;
        if (flags.hasClippedEvidence) return EMAIL_MOG_ARCHIVIST_FRAME;
        if (flags.mogRapport > 5) return EMAIL_MOG_SYMPATHIZER_IDENTITY;
        if (rank === Rank.LIAISON || rank === Rank.DIRECTOR) return EMAIL_MOG_LADDER_TAKEOVER;
    }

    return EMAILS.find(e => e.triggerShiftIndex === nextShiftIndex) || null;
};

const resolveFinalEnding = (state: GameState): EndingType => {
    if (state.flags.mogRapport >= 3 || state.influence > 85) return EndingType.OVERRUN;
    if (state.flags.hasClippedEvidence && state.flags.evidenceCount >= 2) return EndingType.THAWED;
    if (state.rank === Rank.DIRECTOR) return EndingType.MANAGER;
    if (state.flags.isHardshipStatus) return EndingType.HARDSHIP;
    if (state.flags.hasClippedEvidence || state.flags.evidenceCount > 0) return EndingType.FRAMED;
    if (state.flags.mogRapport > 0) return EndingType.MIRROR;
    return EndingType.TRUE_ENDING;
};

export const useShiftSystem = (
    gameState: GameState,
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    spawnLog: () => void
) => {
    const isEndingSequenceStarted = useRef(false);

    const startShift = useCallback(() => {
        isEndingSequenceStarted.current = false; 
        audio.playKeystroke();
        setGameState(prev => ({ 
            ...prev, 
            isShiftActive: true, 
            isShiftEnding: false, 
            isPaused: false, 
            queue: [], 
            logsProcessedInShift: 0, 
            stress: 0, 
            deferCountShift: 0,
            hasTakenLunch: false, 
            dailySafety: 100 
        }));
        spawnLog();
    }, [spawnLog, setGameState]);

    const finalizeShift = useCallback(() => {
        setGameState(prev => {
            const target = prev.isTutorial ? TUTORIAL_LOGS.length + 1 : LOGS_PER_SHIFT;
            const throughput = Math.round((prev.logsProcessedInShift / target) * 100);
            const baseScrutiny = 20 + (prev.flags.evidenceCount * 10);
            
            const newWeeklyStats: WeeklyStats = {
                throughput,
                auditability: prev.dailySafety, 
                variance: 10 + (prev.deferCountGlobal * 2), 
                scrutiny: Math.min(100, baseScrutiny),
                stability: 100 - prev.stress, 
                dossierCount: prev.flags.evidenceCount,
                rapport: prev.flags.mogRapport
            };

            const review = getReviewForShift(prev);
            if (review) {
                return {
                    ...prev,
                    isShiftActive: false,
                    isShiftEnding: false,
                    isReviewPhase: true,
                    pendingReview: review,
                    weeklyStats: newWeeklyStats,
                    queue: [],
                    dailySafety: 100,
                    hasTakenLunch: false
                };
            }

            if (prev.shiftIndex >= SHIFT_DAYS.length - 1) {
                return { ...prev, gameOverReason: resolveFinalEnding(prev), isShiftActive: false };
            }

            const safetyImpact = Math.round((prev.dailySafety - 70) / 2);
            const newGlobalSafety = Math.min(100, Math.max(0, prev.safety + safetyImpact));
            const nextShiftIndex = prev.shiftIndex + 1;
            const nextEmail = getNarrativeEmail(prev, nextShiftIndex);

            let newRank = prev.rank;
            const isSafe = newGlobalSafety > 60;
            if (prev.rank === Rank.VISITOR && prev.shiftIndex >= 2 && isSafe) newRank = Rank.OBSERVER;

            let isOllie = prev.flags.isOllieMode;
            if (!isOllie && prev.influence > 80 && prev.shiftIndex > 7 && prev.deferCountGlobal > 10) {
                isOllie = true;
            }

            return {
                ...prev,
                safety: newGlobalSafety,
                isShiftActive: false,
                isShiftEnding: false,
                shiftIndex: nextShiftIndex,
                isTutorial: false,
                rank: newRank,
                queue: [],
                dailySafety: 100,
                hasTakenLunch: false,
                activeEmail: nextEmail,
                weeklyStats: newWeeklyStats,
                flags: { ...prev.flags, isOllieMode: isOllie }
            };
        });
    }, [setGameState]);

    return {
        startShift,
        finalizeShift,
        isEndingSequenceStarted
    };
};
