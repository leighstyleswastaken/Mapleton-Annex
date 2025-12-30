
import { useState, useEffect, useRef, useMemo } from 'react';
import { LogItem, FeedbackState, ExhibitId, Trap, GameEvent } from '../types';
import { audio } from '../services/audioService';
import { MOG_VOICE_COMMANDS } from '../constants';

interface UseTerminalProps {
    currentLog: LogItem | null;
    isProcessing: boolean;
    lastFeedback: FeedbackState | null;
    activeUpgrades: string[];
    activeTraps?: Trap[];
    activeEvent?: GameEvent | null;
    onFeedbackComplete: () => void;
    influence: number; // Added for weighted randomness
}

// Frequencies for each exhibit. 
const EXHIBIT_FREQUENCIES: Record<ExhibitId, number> = {
    [ExhibitId.CUDDLER]: 35,
    [ExhibitId.JUDGE]: 75,
    [ExhibitId.DOOR_TESTER]: 15,
    [ExhibitId.CAROUSEL]: 85,
    [ExhibitId.COPY_WRITER]: 50,
    [ExhibitId.MOG]: 60,
    [ExhibitId.HUMAN]: 10 // Weak signal
};

const SWEET_SPOT_WIDTH = 12; // +/- 6 units
const BASE_DRIFT_SPEED_MS = 800; 

export const useTerminal = ({ currentLog, isProcessing, lastFeedback, activeUpgrades, activeTraps = [], activeEvent, onFeedbackComplete, influence }: UseTerminalProps) => {
    // Local state for the specific "Desk" interactions
    const [highlightCount, setHighlightCount] = useState(0);
    const [showWarning, setShowWarning] = useState(false);
    const [typingComplete, setTypingComplete] = useState(false);
    const [feedbackAnim, setFeedbackAnim] = useState<FeedbackState | null>(null);
    
    // Track previous log to detect changes
    const prevLogId = useRef<string | undefined>(currentLog?.id);

    // SIGNAL TUNING STATE
    const hasAutoTuner = activeUpgrades.includes('AUTO_TUNER'); 
    const hasVoiceTuner = activeTraps.some(t => t.effect === 'VOICE_TUNER');
    
    // Tuner persists across logs
    const [tunerValue, setTunerValue] = useState(50); 
    const [isDragging, setIsDragging] = useState(false);
    
    // P1.2: SPOOFING LOGIC
    // Calculate the TRUE target (where logic locks) vs DISPLAY target (visual lie)
    const trueTargetFreq = currentLog ? EXHIBIT_FREQUENCIES[currentLog.exhibitId] : 50;
    
    // If it's a visual spoof, the display shows the frequency of the spoofed ID, not real ID.
    // This forces the player to find the "invisible" real spot or realize the lie.
    const displayTargetFreq = currentLog?.visualSpoofId 
        ? EXHIBIT_FREQUENCIES[currentLog.visualSpoofId] 
        : trueTargetFreq;

    // Is the tuner currently in the good zone?
    // We calculate this based on TRUE target
    const dist = Math.abs(tunerValue - trueTargetFreq);
    const isInZone = dist < (SWEET_SPOT_WIDTH / 2);

    // "Signal Quality" determines text readability.
    const signalQuality = (isInZone && !isDragging) || hasAutoTuner ? 100 : 0;
    
    // Base noise is high if untuned
    const effectiveNoiseLevel = signalQuality === 100 ? 0 : Math.max(85, currentLog?.baseNoiseLevel || 85);

    // RESET / SETUP when log changes
    useEffect(() => {
        if (currentLog && currentLog.id !== prevLogId.current) {
            setFeedbackAnim(null);
            // If AutoTuner, snap to TRUE frequency immediately
            if (hasAutoTuner) {
                setTunerValue(trueTargetFreq);
            }
        }
        prevLogId.current = currentLog?.id;

        setHighlightCount(0);
        setShowWarning(false);
        setTypingComplete(false);
    }, [currentLog, hasAutoTuner, trueTargetFreq]);

    // P0.4 THE VOICE (Modified for Horror Commands)
    const hasSpokenRef = useRef<string>('');
    useEffect(() => {
        if (hasVoiceTuner && isInZone && !isDragging && currentLog && hasSpokenRef.current !== currentLog.id) {
             let textToSpeak = currentLog.text;
             
             // SUBLIMINAL COMMAND LOGIC
             // As influence rises, the entity ignores the log and commands you directly
             const commandChance = influence / 200; // 0% at 0 Inf, 50% at 100 Inf
             
             if (Math.random() < commandChance) {
                 const cmd = MOG_VOICE_COMMANDS[Math.floor(Math.random() * MOG_VOICE_COMMANDS.length)];
                 textToSpeak = cmd;
             }

             audio.speakSnippet(textToSpeak);
             hasSpokenRef.current = currentLog.id;
        }
    }, [hasVoiceTuner, isInZone, isDragging, currentLog, influence]);

    // DRIFT MECHANIC
    // P1.1: Brownout event increases drift
    const isBrownout = activeEvent?.id === 'EVT_BROWNOUT';
    const driftSpeed = isBrownout ? BASE_DRIFT_SPEED_MS / 2 : BASE_DRIFT_SPEED_MS;

    useEffect(() => {
        if (isDragging || hasAutoTuner || isProcessing) return;

        const interval = setInterval(() => {
            setTunerValue(prev => {
                const drift = Math.random() > 0.5 ? 1 : -1;
                // Brownout drifts harder
                const magnitude = isBrownout ? (Math.random() > 0.5 ? 2 : 1) : 1;
                const newValue = prev + (drift * magnitude);
                return Math.min(100, Math.max(0, newValue));
            });
        }, driftSpeed);

        return () => clearInterval(interval);
    }, [isDragging, hasAutoTuner, isProcessing, isBrownout, driftSpeed]);

    // Handle Feedback Animations
    useEffect(() => {
        if (lastFeedback) {
            setFeedbackAnim(lastFeedback);
            const t = setTimeout(() => {
                onFeedbackComplete();
            }, 2000);
            return () => clearTimeout(t);
        } else {
            setFeedbackAnim(null);
        }
    }, [lastFeedback, onFeedbackComplete]);

    const handleDragStart = () => {
        setIsDragging(true);
    };

    const handleDrag = (val: number) => {
        setTunerValue(val);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        if (isInZone) {
            audio.playChime(); 
        }
    };

    return {
        highlightCount,
        setHighlightCount,
        showWarning,
        setShowWarning,
        typingComplete,
        setTypingComplete,
        feedbackAnim,
        signalNoise: effectiveNoiseLevel,
        tunerValue,
        handleDrag,
        handleDragStart,
        handleDragEnd,
        targetFreq: displayTargetFreq, // Use display (potentially spoofed)
        isInZone 
    };
};
