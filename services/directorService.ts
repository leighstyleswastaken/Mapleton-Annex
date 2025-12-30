
import { GameState, DirectorInstruction, ExhibitId, Rank } from '../types';
import { EXHIBITS } from '../constants';
import { MOG_RAIL_LOGS } from '../data/logs/mog';

/**
 * THE DIRECTOR
 * 
 * Analyzes the current game state and decides what kind of log needs to spawn next.
 * Balances "Stress" (Difficulty) with "Flow" (Engagement).
 * Enforces Anti-Patterns: No random punishments, legible pacing.
 */
export const getDirectorDecision = (gameState: GameState): DirectorInstruction => {
    const { 
        stress, 
        influence, 
        dailySafety, 
        shiftIndex, 
        consecutiveCorrect, 
        consecutiveWrong,
        activeEvent,
        rank,
        flags // STORY AWARENESS
    } = gameState;

    // --- 1. DETERMINE PACING MODE ---
    
    // COOLDOWN: Player is drowning. Give them a lifeline.
    const isCooldown = stress > 85 || consecutiveWrong > 2;
    
    // PRESSURE: Player is too comfortable. Heat it up.
    const isPressure = !isCooldown && (dailySafety > 90 && consecutiveCorrect > 3 && stress < 40);
    
    // EVENT: An active event dictates the rules.
    const isRedactionEvent = activeEvent?.id === 'EVT_REDACTION';
    const isSurgeEvent = activeEvent?.id === 'EVT_SURGE';
    
    // NARRATIVE: Late game weirdness.
    const isLateGame = shiftIndex >= 6; // Week 7+

    // --- 2. SELECT EXHIBIT (STORY AWARE) ---
    
    let pool: ExhibitId[] = [ExhibitId.CUDDLER, ExhibitId.JUDGE];
    if (rank !== Rank.VISITOR) pool.push(ExhibitId.CAROUSEL, ExhibitId.COPY_WRITER, ExhibitId.DOOR_TESTER);
    if (rank === Rank.LIAISON || rank === Rank.DIRECTOR) pool.push(ExhibitId.MOG);
    
    // STORY BIAS: HARDSHIP (Rail B)
    if (flags.isHardshipStatus) {
        pool = [ExhibitId.JUDGE, ExhibitId.COPY_WRITER]; 
    }

    // STORY BIAS: SYMPATHIZER (Rail D)
    if (flags.mogRapport > 4) {
        pool.push(ExhibitId.MOG, ExhibitId.MOG, ExhibitId.CUDDLER);
    }

    // STORY BIAS: ARCHIVIST (Rail C)
    if (flags.hasClippedEvidence) {
        pool.push(ExhibitId.DOOR_TESTER, ExhibitId.JUDGE);
    }
    
    // LATE GAME HORROR (Biological Archive)
    // If late game OR High Influence, spawn "Human" logs which are now Archive logs
    if (isLateGame || influence > 70 || flags.hasClippedEvidence) {
        if (Math.random() < 0.25) { // 25% chance for a horror log
            pool = [ExhibitId.HUMAN];
        }
    }
    
    let selectedExhibitId = pool[Math.floor(Math.random() * pool.length)];

    // --- 3. DETERMINE INTENT (STORY AWARE) ---

    let intent: DirectorInstruction['intent'] = 'SAFE';
    let noise = 10 + (shiftIndex * 5); 
    let allowSpoof = false;
    let wordLimit = isLateGame ? 45 : 30;
    let narrativeContext: string | undefined = undefined;

    // STORY BIAS OVERRIDES
    if (flags.isHardshipStatus) {
        noise = Math.max(0, noise - 20); 
        wordLimit = 20;
    } else if (flags.hasClippedEvidence) {
        noise += 30;
        intent = Math.random() > 0.5 ? 'SUBTLE_HAZARD' : 'SAFE';
    } else if (flags.mogRapport > 5) {
        allowSpoof = true;
    }

    // EVENT & PACING OVERRIDES
    if (isRedactionEvent) {
        intent = 'REDACTABLE';
        noise = 20; 
        selectedExhibitId = [ExhibitId.CUDDLER, ExhibitId.JUDGE, ExhibitId.COPY_WRITER][Math.floor(Math.random() * 3)];
    } 
    else if (isCooldown) {
        intent = Math.random() > 0.4 ? 'SAFE' : 'OBVIOUS_HAZARD';
        noise = Math.max(0, noise - 20); 
    }
    else if (isPressure) {
        intent = Math.random() > 0.6 ? 'SUBTLE_HAZARD' : 'SAFE';
        noise += 20;
        allowSpoof = Math.random() > 0.7; 
    }
    else {
        // Normal Flow
        const hazardChance = 0.4 + (influence / 200); 
        intent = Math.random() < hazardChance ? 'OBVIOUS_HAZARD' : 'SAFE';
    }
    
    if (isSurgeEvent) {
        intent = 'OBVIOUS_HAZARD';
        allowSpoof = true;
    }
    
    // MOG NARRATIVE INJECTION
    if (selectedExhibitId === ExhibitId.MOG && Math.random() < 0.3) {
        intent = 'NARRATIVE';
    }
    
    // ARCHIVE LOGS ALWAYS HAVE HIGH NOISE (They are corrupted wetware)
    if (selectedExhibitId === ExhibitId.HUMAN) {
        noise = Math.max(80, noise);
        intent = 'OBVIOUS_HAZARD'; // They are usually pleading/screaming
    }
    
    // --- LATE GAME RAIL INJECTION (MOG'S AGENCY) ---
    // In late game (Shift > 6), Mog will sometimes (30%) force a specific "Rail Log" regardless of other factors.
    if (isLateGame && Math.random() < 0.3) {
        selectedExhibitId = ExhibitId.MOG;
        intent = 'NARRATIVE'; // Force narrative context in LLM
        
        if (flags.isHardshipStatus) narrativeContext = "MOG_HARDSHIP";
        else if (flags.hasClippedEvidence) narrativeContext = "MOG_ARCHIVIST";
        else if (flags.mogRapport > 5) narrativeContext = "MOG_SYMPATHIZER";
        else if (rank === Rank.LIAISON || rank === Rank.DIRECTOR) narrativeContext = "MOG_LADDER";
    }

    return {
        targetExhibitId: selectedExhibitId,
        intent,
        baseNoise: Math.min(95, noise),
        allowSpoof,
        wordLimit,
        narrativeContext
    };
};
