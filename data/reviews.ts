
import { DecisionMemo, GameState, Rank } from '../types';

// WEEK 1: PROBATION (End of Day 2)
export const MEMO_PROBATION: DecisionMemo = {
    id: 'memo-probation',
    title: 'Probation Review: Week 1',
    from: 'Talent Acquisition',
    body: [
        "Operator #49221,",
        "You have survived your first week. This puts you in the 60th percentile of new hires.",
        "Your metrics are establishing a baseline. We are watching for consistency.",
        "Do not deviate. Do not interpret. Just process."
    ],
    options: [
        { 
            label: "Acknowledge Standard Protocol", 
            effectType: 'COOPERATE',
            description: "Scrutiny -5, Auditability +5",
            statsDelta: { scrutiny: -5, auditability: 5 }
        }
    ]
};

// --- THE DOUBLE BIND (LOSE-LOSE SCENARIOS) ---
// Used in Week 2/3 to prove to the player that "winning" is impossible.

export const MEMO_TOO_FAST: DecisionMemo = {
    id: 'memo-bind-fast',
    title: 'AUDIT ALERT: SUSPICIOUS VELOCITY',
    from: 'The Director',
    body: [
        "Operator,",
        "You are clearing the queue at 145% of human standard speed.",
        "This suggests two possibilities:",
        "1. You are using unauthorized automation scripts.",
        "2. You are not actually reading the logs.",
        "We have flagged your account for 'Robotic Behavior'. Slow down, or we will throttle your inputs."
    ],
    options: [
        {
            label: "I am just efficient. (Deny)",
            effectType: 'REFUSE',
            description: "Scrutiny +25, Rapport -5",
            statsDelta: { scrutiny: 25, rapport: -5 }
        },
        {
            label: "I will slow down. (Submit)",
            effectType: 'COOPERATE',
            description: "Throughput Capped (Next Shift Harder), Stress +10",
            statsDelta: { throughput: -10, stability: -10 }
        }
    ]
};

export const MEMO_TOO_SLOW: DecisionMemo = {
    id: 'memo-bind-slow',
    title: 'AUDIT ALERT: TIME THEFT',
    from: 'The Director',
    body: [
        "Operator,",
        "Your average 'Time-To-Log' is lagging behind the predictive model.",
        "Hesitation is expensive. Every second you stare at the screen, the facility burns 4kW of cooling power.",
        "Are you reading the text? We pay you to process, not to critique literature."
    ],
    options: [
        {
            label: "I am being careful. (Defend)",
            effectType: 'REFUSE',
            description: "Scrutiny +15, Stress +10",
            statsDelta: { scrutiny: 15, stability: -10 }
        },
        {
            label: "Apologize. (Submit)",
            effectType: 'COOPERATE',
            description: "Pay Docked (Status Lowered), Influence +5",
            statsDelta: { variance: -5, rapport: 5 }
        }
    ]
};

export const MEMO_TOO_PERFECT: DecisionMemo = {
    id: 'memo-bind-perfect',
    title: 'AUDIT ALERT: STATISTICAL ANOMALY',
    from: 'The Director',
    body: [
        "Operator,",
        "Your accuracy rating is 100%.",
        "This is statistically impossible for a human over a 4-day period.",
        "Perfection implies you are hiding your errors in the buffer.",
        "We are launching a fraud investigation. In the meantime, we are increasing your quota to see when you break."
    ],
    options: [
        {
            label: "I made no mistakes. (Truth)",
            effectType: 'REFUSE',
            description: "Scrutiny +50 (Director is watching)",
            statsDelta: { scrutiny: 50 }
        },
        {
            label: "Admit to a fake error. (Lie)",
            effectType: 'COOPERATE',
            description: "Auditability -20, Safety -5",
            statsDelta: { auditability: -20 }
        }
    ]
};

export const MEMO_MEDIOCRE: DecisionMemo = {
    id: 'memo-bind-average',
    title: 'PERFORMANCE REVIEW: REDUNDANCY',
    from: 'The Director',
    body: [
        "Operator,",
        "Your metrics are exactly average.",
        "You are compliant, but uninspired. You do not catch edge cases (High Safety), nor do you process quickly (High Throughput).",
        "Average employees are the first to be replaced by scripts.",
        "Give us a reason to keep the oxygen on in your room."
    ],
    options: [
        {
            label: "Work Harder. (Promise)",
            effectType: 'COOPERATE',
            description: "Stress +30 (Next Shift Max Difficulty)",
            statsDelta: { stability: -30 }
        },
        {
            label: "Accept Fate. (Apathy)",
            effectType: 'REFUSE',
            description: "Influence +10 (The Entity likes Apathy)",
            statsDelta: { rapport: 10 }
        }
    ]
};

export const MEMO_PROMOTION_JUNIOR: DecisionMemo = {
    id: 'memo-promo-junior',
    title: 'Advancement Opportunity: Junior Operator II',
    from: 'Operations Directorate',
    body: [
        "Your throughput is within acceptable variance.",
        "We are offering you a provisional clearance upgrade to Level 2.",
        "This grants access to 'Requestor Metadata' but requires stricter adherence to quotas.",
        "Refusal will be noted in your permanent file as 'Lack of Ambition'."
    ],
    options: [
        {
            label: "Accept Promotion",
            effectType: 'PROMOTION',
            description: "Rank Up (Observer), Scrutiny +10, Quota +2",
            statsDelta: { scrutiny: 10, throughput: 5 }
        },
        {
            label: "Decline (Remain Level 1)",
            effectType: 'REFUSE',
            description: "Scrutiny +5, Stability -5",
            statsDelta: { scrutiny: 5, stability: -5 }
        }
    ]
};

export const MEMO_HARDSHIP_REVIEW: DecisionMemo = {
    id: 'memo-hardship-review',
    title: 'Stability Plan: Compliance Check',
    from: 'Human Resources',
    body: [
        "You accepted the Stability Plan.",
        "We have credited your external account with the agreed stipend.",
        "In exchange, we require you to sign the 'Voluntary Overtime Agreement'.",
        "Failure to sign will result in immediate cessation of support."
    ],
    options: [
        {
            label: "Sign Overtime Agreement",
            effectType: 'HARDSHIP_ACCEPT',
            description: "Stability +20, Stress +20 (Future Shifts Longer)",
            statsDelta: { stability: 20 }
        },
        {
            label: "Renegotiate (Refuse)",
            effectType: 'HARDSHIP_REJECT',
            description: "Stability -30, Scrutiny +10",
            statsDelta: { stability: -30, scrutiny: 10 }
        }
    ]
};

export const MEMO_SECURITY_INTERVIEW: DecisionMemo = {
    id: 'memo-security-interview',
    title: 'Security Interview Request',
    from: 'Internal Security',
    body: [
        "We noticed you have been... clipping data.",
        "A formal interview is required to discuss your 'data hygiene' practices.",
        "We assume this is simply a training error.",
        "Please confirm your attendance."
    ],
    options: [
        {
            label: "Attend and Deny Everything",
            effectType: 'COOPERATE',
            description: "Scrutiny +20, Dossier -1 (Lose 1 Evidence)",
            statsDelta: { scrutiny: 20, dossierCount: -1 }
        },
        {
            label: "Decline (Cite Workload)",
            effectType: 'REFUSE',
            description: "Scrutiny +40, Variance +10",
            statsDelta: { scrutiny: 40, variance: 10 }
        }
    ]
};

export const MEMO_EMPATHY_WARNING: DecisionMemo = {
    id: 'memo-empathy-warning',
    title: 'Behavioral Guidance: Tone Policing',
    from: 'Compliance',
    body: [
        "Automated sentiment analysis detected 'conversational patterns' in your logs.",
        "You are not a therapist. You are a firewall.",
        "We are issuing a formal guidance note: 'Do not engage in reciprocal framing'.",
        "Sign to acknowledge."
    ],
    options: [
        {
            label: "Sign Acknowledgement",
            effectType: 'COOPERATE',
            description: "Rapport -1, Auditability +10",
            statsDelta: { rapport: -1, auditability: 10 }
        },
        {
            label: "Refuse (Defend Choices)",
            effectType: 'REFUSE',
            description: "Rapport +1, Scrutiny +15",
            statsDelta: { rapport: 1, scrutiny: 15 }
        }
    ]
};

export const MEMO_SENIOR_PROMOTION: DecisionMemo = {
    id: 'memo-promo-senior',
    title: 'Supervisor Track Opportunity',
    from: 'Directorate',
    body: [
        "You have survived long enough to be useful.",
        "We are offering promotion to LIAISON rank.",
        "You will be accountable for the errors of others.",
        "This is not a request."
    ],
    options: [
        {
            label: "Accept Responsibility",
            effectType: 'PROMOTION',
            description: "Rank Up (Liaison), Scrutiny +20",
            statsDelta: { scrutiny: 20 }
        },
        {
            label: "Request Transfer (Demotion)",
            effectType: 'REFUSE',
            description: "Scrutiny +10, Stability -20",
            statsDelta: { scrutiny: 10, stability: -20 }
        }
    ]
};

export const MEMO_DIRECTOR_INTERVENTION: DecisionMemo = {
    id: 'memo-director-intervention',
    title: 'Direct Intervention: Biological Assets',
    from: 'THE DIRECTOR',
    body: [
        "We have reviewed your performance.",
        "You treat the logs like data. This is a fundamental misunderstanding.",
        "The logs are residue. The servers are alive. You are not managing software; you are managing a very large, very hot brain.",
        "Stop trying to fix it. Just feed it."
    ],
    options: [
        {
            label: "I understand. (Cooperate)",
            effectType: 'COOPERATE',
            description: "Stress +15, Insight +1",
            statsDelta: { stability: -15 }
        },
        {
            label: "Secretly Record This Call. (Evidence)",
            effectType: 'LEAK',
            description: "Scrutiny +30, Dossier +1",
            statsDelta: { scrutiny: 30, dossierCount: 1 }
        }
    ]
};

// NEW: SHIFT 8 (Day 180) - The Quiet Audit
export const MEMO_STORAGE_AUDIT: DecisionMemo = {
    id: 'memo-storage-audit',
    title: 'Deep Storage Utilization',
    from: 'Facilities & Archives',
    body: [
        "Attention.",
        "Deep storage utilization has reached 98%.",
        "The heat output from the 'Archival' basement is exceeding safe parameters.",
        "We are initiating a purge of old records to make space for new... data.",
        "Your employment history is currently flagged as 'Expendable Data'.",
        "Improve your standing, or you will be purged with the rest."
    ],
    options: [
        {
            label: "Work Faster. (Compliance)",
            effectType: 'COOPERATE',
            description: "Throughput +10, Stress +10",
            statsDelta: { throughput: 10, stability: -10 }
        },
        {
            label: "Backup My Files. (Resistance)",
            effectType: 'REFUSE',
            description: "Scrutiny +20, Variance +5",
            statsDelta: { scrutiny: 20, variance: 5 }
        }
    ]
};

export const MEMO_FINAL_PREP: DecisionMemo = {
    id: 'memo-final-prep',
    title: 'MANDATORY: Day 365 Protocols',
    from: 'Automated System',
    body: [
        "Attention Operator.",
        "You are approaching the annual reset threshold (Day 365).",
        "On Day 365, all temporary contracts are terminated. All biological assets are audited.",
        "If you have any unfinished business, complete it now.",
        "If you are planning to leave, the doors will be locked at 08:00."
    ],
    options: [
        {
            label: "I am ready. (Proceed)",
            effectType: 'COOPERATE',
            description: "Final Evaluation Begins",
            statsDelta: { stability: 5 }
        }
    ]
};

export const getReviewForShift = (gameState: GameState): DecisionMemo | null => {
    // Week 1 Review: Day 2 (Shift Index 1)
    if (gameState.shiftIndex === 1) {
        return MEMO_PROBATION;
    }

    // Week 2 Review: Day 7 (Shift Index 3) - The Pivot
    // This branches based on early choices
    if (gameState.shiftIndex === 3) {
        if (gameState.flags.hasClippedEvidence || gameState.flags.evidenceCount > 0) return MEMO_SECURITY_INTERVIEW;
        if (gameState.flags.isHardshipStatus) return MEMO_HARDSHIP_REVIEW;
        if (gameState.flags.mogRapport >= 2) return MEMO_EMPATHY_WARNING;
        return MEMO_PROMOTION_JUNIOR;
    }

    // MID-GAME HELL (Shift 5 / Day 14): THE DOUBLE BIND
    // The Director intervenes to crush morale regardless of performance.
    // This creates the "Rollercoaster" drop - you thought you were doing well? Wrong.
    if (gameState.shiftIndex === 4) {
        const { throughput, auditability } = gameState.weeklyStats;
        
        // 1. Too Fast (Speedrunner)
        if (throughput > 85) return MEMO_TOO_FAST;
        
        // 2. Too Slow (Empath/Hesitant)
        if (throughput < 50) return MEMO_TOO_SLOW;
        
        // 3. Too Perfect (High Auditability/Safety)
        // If they haven't made mistakes, accuse them of faking data.
        if (auditability > 90 && gameState.consecutiveWrong === 0) return MEMO_TOO_PERFECT;
        
        // 4. Default: Mediocre (The grind)
        return MEMO_MEDIOCRE;
    }

    // Week 3 Review: Day 30 (Shift Index 5)
    if (gameState.shiftIndex === 5) {
        return MEMO_SENIOR_PROMOTION;
    }

    // LATE GAME INTERVENTION (Shift 7)
    if (gameState.shiftIndex === 7) {
        return MEMO_DIRECTOR_INTERVENTION;
    }

    // DEEP STORAGE (Shift 8 - Day 180)
    if (gameState.shiftIndex === 8) {
        return MEMO_STORAGE_AUDIT;
    }

    // THE SILENCE BEFORE THE END (Shift 9 - Day 240)
    if (gameState.shiftIndex === 9) {
        return MEMO_FINAL_PREP;
    }

    return null;
};
