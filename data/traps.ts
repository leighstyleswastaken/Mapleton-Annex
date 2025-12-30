
import { GameState, Trap, Rank } from '../types';
import { TRAPS } from '../constants';

// Helper to determine which Trap Mog should offer based on the current Rail
export const getNextTrap = (gameState: GameState): Trap | null => {
    const { flags, rank, activeTraps } = gameState;
    
    // Filter out already active traps
    const available = TRAPS.filter(t => !activeTraps.find(at => at.id === t.id));
    if (available.length === 0) return null;

    let candidatePool: Trap[] = [];

    // RAIL B: HARDSHIP (Desperate for relief)
    if (flags.isHardshipStatus) {
        // High priority: Batch Process (Skip Shift) or Alarm Mute
        const hardshipTraps = available.filter(t => t.effect === 'AUTO_COMPLETE' || t.effect === 'HIDE_SAFETY');
        if (hardshipTraps.length > 0) return hardshipTraps[0];
    }

    // RAIL D: SYMPATHIZER (Wants connection)
    if (flags.mogRapport > 3) {
        // High priority: Voice Tuner or Auto Tuner (Not in basic list, implied upgrade)
        const friendTraps = available.filter(t => t.effect === 'VOICE_TUNER'); // Add Auto-Tuner logic if implemented as trap
        if (friendTraps.length > 0) return friendTraps[0];
    }

    // RAIL A: LADDER (Efficiency focused)
    if (rank === Rank.LIAISON || rank === Rank.DIRECTOR) {
        // High priority: Shuffle Rules (Efficiency re-order) or Shrink Contain (Focus on Log)
        const corpoTraps = available.filter(t => t.effect === 'SHUFFLE_RULES' || t.effect === 'SHRINK_CONTAIN');
        if (corpoTraps.length > 0) return corpoTraps[0];
    }

    // RAIL C: ARCHIVIST (Mog tries to stop you)
    // (If we had specific 'Anti-Rebel' traps, we'd put them here. 
    // For now, Mog tries to 'help' by shrinking the Contain button so you just Log everything)
    if (flags.hasClippedEvidence) {
        const censorTraps = available.filter(t => t.effect === 'SHRINK_CONTAIN');
        if (censorTraps.length > 0) return censorTraps[0];
    }

    // FALLBACK: Standard annoying traps
    // Drifting buttons, etc.
    return available[Math.floor(Math.random() * available.length)];
};
