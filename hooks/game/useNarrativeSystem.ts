
import { useCallback } from 'react';
import { GameState, EmailOption, LunchChoice, MemoOption, Rank } from '../../types';
import { EMAILS } from '../../data/emails';
import { LOGS_PER_SHIFT, TUTORIAL_LOGS } from '../../constants';
import { audio } from '../../services/audioService';

export const useNarrativeSystem = (
    gameState: GameState,
    setGameState: React.Dispatch<React.SetStateAction<GameState>>
) => {

  const completeIntro = () => {
      audio.playKeystroke();
      const dayOneEmail = EMAILS.find(e => e.triggerShiftIndex === 0);
      setGameState(prev => ({ ...prev, hasSeenIntro: true, activeEmail: dayOneEmail || null }));
  };
  
  const closeEmail = (option?: EmailOption) => {
      setGameState(prev => {
          let updates: Partial<GameState> = { activeEmail: null };
          if (option) {
              if (option.effect === 'SIGN_HARDSHIP') {
                  updates = { ...updates, flags: { ...prev.flags, isHardshipStatus: true }, dailySafety: 100, stress: Math.max(0, prev.stress - 30) };
                  audio.playSuccess();
              } else if (option.effect === 'CLIP_EVIDENCE') {
                  updates = { ...updates, flags: { ...prev.flags, hasClippedEvidence: true, evidenceCount: prev.flags.evidenceCount + 1 }, safety: Math.max(0, prev.safety - 10), stress: Math.min(100, prev.stress + 10) };
                  audio.playKeystroke();
              } else if (option.effect === 'REPORT_INCIDENT') {
                   updates = { ...updates, safety: Math.min(100, prev.safety + 10) };
                   audio.playChime();
              }
          }
          return { ...prev, ...updates };
      });
  };

  const startLunchBreak = (eventId?: string) => {
      audio.playChime();
      setGameState(prev => ({ 
          ...prev, 
          isLunchBreak: true, 
          activeLunchEventId: eventId || null, 
          isShiftActive: false 
      }));
  };

  const completeLunch = (choice: LunchChoice) => {
      audio.playKeystroke();
      setGameState(prev => {
          let updates: Partial<GameState> = {};
          if (choice.effect === 'STRESS_DOWN') updates.stress = Math.max(0, prev.stress - 20);
          else if (choice.effect === 'STRESS_UP') updates.stress = Math.min(100, prev.stress + 10);
          else if (choice.effect === 'INFLUENCE_UP') updates.influence = Math.min(100, prev.influence + 10);
          else if (choice.effect === 'UNLOCK_MOG_UPGRADE') {
              updates.activeUpgrades = [...prev.activeUpgrades, 'MOG_BEAUTIFICATION'];
              updates.stress = Math.max(0, prev.stress - 20);
              updates.influence = Math.min(100, prev.influence + 15);
              audio.playSuccess();
          } else if (choice.effect === 'SKIP_TASKS') {
              const target = prev.isTutorial ? TUTORIAL_LOGS.length : LOGS_PER_SHIFT;
              const remaining = target - prev.logsProcessedInShift;
              const skipAmount = Math.ceil(remaining / 2) + 1; 
              updates.logsProcessedInShift = Math.min(target, prev.logsProcessedInShift + skipAmount);
              updates.influence = Math.min(100, prev.influence + 5);
          } else if (choice.effect === 'ACCEPT_MOG_DRAFT') {
              updates = { ...updates, flags: { ...prev.flags, mogRapport: prev.flags.mogRapport + 1 }, influence: Math.min(100, prev.influence + 15), stress: Math.max(0, prev.stress - 15) };
              audio.playSuccess();
          } else if (choice.effect === 'REJECT_MOG_DRAFT') {
              updates = { ...updates, flags: { ...prev.flags, mogRapport: Math.max(0, prev.flags.mogRapport - 1) }, stress: Math.min(100, prev.stress + 5) };
          } else if (choice.effect === 'GAIN_KEY') {
              updates = { ...updates, flags: { ...prev.flags, hasBasementKey: true }, influence: Math.min(100, prev.influence + 20) };
              audio.playSuccess();
          }

          if (choice.nextEventId) return { ...prev, ...updates, activeLunchEventId: choice.nextEventId, isLunchBreak: true };
          else return { ...prev, ...updates, isLunchBreak: false, hasTakenLunch: true, activeLunchEventId: null, isShiftActive: true };
      });
  };

  const handleReviewDecision = (option: MemoOption) => {
      setGameState(prev => {
          let updates: Partial<GameState> = { isReviewPhase: false, pendingReview: null };
          if (option.statsDelta?.stability) updates.stress = Math.max(0, Math.min(100, prev.stress - (option.statsDelta.stability || 0)));
          if (option.effectType === 'PROMOTION') {
              const ranks = Object.values(Rank);
              const currentIdx = ranks.indexOf(prev.rank);
              if (currentIdx < ranks.length - 1) updates.rank = ranks[currentIdx + 1];
              audio.playSuccess();
          } else if (option.effectType === 'HARDSHIP_ACCEPT') updates.flags = { ...prev.flags, isHardshipStatus: true };

          const safetyImpact = Math.round((prev.dailySafety - 70) / 2);
          const newGlobalSafety = Math.min(100, Math.max(0, prev.safety + safetyImpact));
          const nextShiftIndex = prev.shiftIndex + 1;
          const nextEmail = EMAILS.find(e => e.triggerShiftIndex === nextShiftIndex);

          return { ...prev, ...updates, safety: newGlobalSafety, shiftIndex: nextShiftIndex, isTutorial: false, activeEmail: nextEmail || null };
      });
  };

  const signAmendment = () => {
      audio.playSuccess();
      setGameState(prev => {
          if (!prev.pendingAmendment) return prev;
          const am = prev.pendingAmendment;
          return {
              ...prev,
              activeAmendments: [...prev.activeAmendments, am],
              pendingAmendment: null,
              influence: Math.min(100, prev.influence + 15),
              safety: am.cost === 'SAFETY' ? Math.max(0, prev.safety - 10) : prev.safety
          };
      });
  };

  const vetoAmendment = () => {
      audio.playBuzzer();
      setGameState(prev => ({
          ...prev,
          pendingAmendment: null,
          stress: Math.min(100, prev.stress + 20),
          influence: Math.max(0, prev.influence - 5)
      }));
  };

  const acceptTrap = () => {
      audio.playChime();
      setGameState(prev => {
          const trap = prev.pendingTrap!;
          let updates: Partial<GameState> = {
              activeTraps: [...prev.activeTraps, trap],
              pendingTrap: null,
              stress: Math.max(0, prev.stress - 20)
          };
          if (trap.globalCost) updates.safety = Math.max(0, prev.safety - trap.globalCost);
          if (trap.effect === 'AUTO_COMPLETE') {
              updates = { ...updates, stress: 0, logsProcessedInShift: LOGS_PER_SHIFT, dailySafety: Math.max(0, prev.dailySafety - 15), influence: Math.min(100, prev.influence + 10) };
          } else if (trap.effect === 'BOOST_DAILY') {
              updates = { ...updates, dailySafety: 100, stress: 0 };
          } else if (trap.effect === 'SHUFFLE_RULES') {
              const shuffled = [...prev.activeRuleIds].sort(() => Math.random() - 0.5);
              updates = { ...updates, activeRuleIds: shuffled, influence: Math.min(100, prev.influence + 15) };
          } else if (trap.effect === 'PRINTER_JAM') {
              updates = { ...updates, influence: Math.min(100, prev.influence + 5) };
          } else if (trap.effect === 'DEAD_KEYS') {
               updates = { ...updates, influence: Math.min(100, prev.influence + 5) };
          }
          return { ...prev, ...updates };
      });
  };

  const rejectTrap = () => {
      audio.playBuzzer();
      setGameState(prev => ({ ...prev, pendingTrap: null, stress: Math.min(100, prev.stress + 20) }));
  };

  return {
    completeIntro,
    closeEmail,
    startLunchBreak,
    completeLunch,
    handleReviewDecision,
    signAmendment,
    vetoAmendment,
    acceptTrap,
    rejectTrap
  };
};
