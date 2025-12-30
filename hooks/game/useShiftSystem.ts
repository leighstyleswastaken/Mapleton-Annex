
import { useCallback, useRef } from 'react';
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

// Logic to determine if a special narrative email should override the standard schedule
const getNarrativeEmail = (gameState: GameState, nextShiftIndex: number): Email | null => {
    const { flags, rank } = gameState;

    // PRIORITY 1: Director Interventions (Playstyle Critique)
    // Shift 4 check: Are they playing weirdly?
    if (nextShiftIndex === 4) {
        // Too fast (Speedrunner behavior)
        if (gameState.weeklyStats.throughput > 95 && gameState.weeklyStats.stability > 80) {
            return EMAIL_DIRECTOR_SPEED;
        }
        // Too slow (Hesitation/Empathy)
        if (gameState.weeklyStats.throughput < 60) {
            return EMAIL_DIRECTOR_SLOW;
        }
    }

    // PRIORITY 2: Reactive Character Arcs
    // Shift 5 check: Consequences of early choices
    if (nextShiftIndex === 5) {
        // Rail B: Hardship -> Cal Debt
        if (gameState.flags.isHardshipStatus) {
            return EMAIL_CAL_DEBT;
        }
        // Rail D: Sympathizer -> Cal Warning about Mog
        if (gameState.flags.mogRapport > 4) {
            return EMAIL_CAL_WARNING;
        }
    }

    // PRIORITY 3: MOG'S NARRATIVE EVOLUTION (Late Game)
    
    // WEEK 7-8 TACTICS (Approx Shift 7)
    if (nextShiftIndex === 7) {
        if (flags.isHardshipStatus) return EMAIL_MOG_HARDSHIP_OPPORTUNITY;
        if (flags.hasClippedEvidence) return EMAIL_MOG_ARCHIVIST_HELP;
        if (flags.mogRapport > 5) return EMAIL_MOG_SYMPATHIZER_FRIEND;
        if (rank === Rank.LIAISON || rank === Rank.DIRECTOR) return EMAIL_MOG_LADDER_DASHBOARD;
    }

    // WEEK 9-10 ENDGAME (Approx Shift 9)
    if (nextShiftIndex === 9) {
        if (flags.isHardshipStatus) return EMAIL_MOG_HARDSHIP_OWNERSHIP;
        if (flags.hasClippedEvidence) return EMAIL_MOG_ARCHIVIST_FRAME;
        if (flags.mogRapport > 5) return EMAIL_MOG_SYMPATHIZER_IDENTITY;
        if (rank === Rank.LIAISON || rank === Rank.DIRECTOR) return EMAIL_MOG_LADDER_TAKEOVER;
    }

    // Default: Fallback to static timeline
    return EMAILS.find(e => e.triggerShiftIndex === nextShiftIndex) || null;
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
            hasTakenLunch: false, 
            dailySafety: 100 
        }));
        spawnLog();
    }, [spawnLog, setGameState]);

    const finalizeShift = useCallback(() => {
        setGameState(prev => {
            const target = prev.isTutorial ? TUTORIAL_LOGS.length : LOGS_PER_SHIFT;
            const throughput = Math.round((prev.logsProcessedInShift / target) * 100);
            const baseScrutiny = 20 + (prev.flags.evidenceCount * 10);
            
            const newWeeklyStats: WeeklyStats = {
                throughput: throughput,
                auditability: prev.dailySafety, 
                variance: 10 + (prev.deferCountGlobal * 2), 
                scrutiny: Math.min(100, baseScrutiny),
                stability: 100 - prev.stress, 
                dossierCount: prev.flags.evidenceCount,
                rapport: prev.flags.mogRapport
            };
  
            const review = getReviewForShift(prev);
            if (review) return { ...prev, isShiftActive: false, isShiftEnding: false, isReviewPhase: true, pendingReview: review, weeklyStats: newWeeklyStats, queue: [], dailySafety: 100, hasTakenLunch: false };
  
            // ENDINGS LOGIC (P0)
            if (prev.shiftIndex >= SHIFT_DAYS.length - 1) {
                // Priority Check for Specific Endings
                if (prev.flags.mogRapport >= 8 || prev.influence > 90) return { ...prev, gameOverReason: EndingType.OVERRUN, isShiftActive: false };
                if (prev.flags.hasClippedEvidence && prev.flags.evidenceCount >= 5) return { ...prev, gameOverReason: EndingType.THAWED, isShiftActive: false };
                if (prev.rank === Rank.DIRECTOR && prev.safety > 40) return { ...prev, gameOverReason: EndingType.MANAGER, isShiftActive: false };
                return { ...prev, gameOverReason: EndingType.TRUE_ENDING, isShiftActive: false };
            }
  
            const safetyImpact = Math.round((prev.dailySafety - 70) / 2);
            const newGlobalSafety = Math.min(100, Math.max(0, prev.safety + safetyImpact));
            const nextShiftIndex = prev.shiftIndex + 1;
            
            // DYNAMIC EMAIL SELECTION
            const nextEmail = getNarrativeEmail(prev, nextShiftIndex);
  
            let newRank = prev.rank;
            const isSafe = newGlobalSafety > 60;
            if (prev.rank === Rank.VISITOR && prev.shiftIndex >= 2 && isSafe) newRank = Rank.OBSERVER;
            
            // OLLIE MODE CHECK
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
