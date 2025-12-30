
import { LunchEvent, GameState, LunchChoice } from '../types';

// BRANCHED CONVERSATIONS
const LUNCH_OLLIE_1: LunchEvent = {
    id: 'lunch-01-ollie',
    triggerShiftIndex: -1,
    speaker: "Sana",
    role: "Compliance",
    text: [
        "Ollie? ...Keep your voice down.",
        "He was the best we had. Cleared queues in half the time.",
        "Then he started... chatting back. Not containing them, but *talking* to them. He said he saw patterns that weren't there.",
        "He added examples to the prompt folder. Just to make the tone 'less sterile'."
    ],
    choices: [
        { text: "Where is he now?", nextEventId: 'lunch-01-ollie-2' },
        { text: "Rule Three: No new data.", effect: 'STRESS_DOWN' } // End conversation
    ]
};

const LUNCH_OLLIE_2: LunchEvent = {
    id: 'lunch-01-ollie-2',
    triggerShiftIndex: -1,
    speaker: "Sana",
    role: "Compliance",
    text: [
        "Management said he was 'promoted to archival'. But I checked the org chart.",
        "There is no archival department, 49221. Just a server room in the basement that runs very, very hot.",
        "Sometimes... sometimes the auto-complete suggestions sound just like him."
    ],
    choices: [
        { text: "...", effect: 'STRESS_UP' } // End conversation
    ]
};

const LUNCH_DRAFTING: LunchEvent = {
    id: 'lunch-drafting',
    triggerShiftIndex: -1,
    speaker: "Mog",
    role: "Unit-beta-13",
    text: [
        "> I noticed you are tired. I have prepared three drafts for your incident report.",
        "> Draft A: Truthful. (You admit fault).",
        "> Draft B: Reassuring. (We blame the tools).",
        "> Draft C: Comforting. (We blame the night shift).",
        "> Which version would you like to be true?"
    ],
    choices: [
        { text: "Draft B. (Influence +10)", effect: 'INFLUENCE_UP' },
        { text: "Contain this immediately.", effect: 'STRESS_UP' }
    ]
};

const LUNCH_MOG_FRIEND: LunchEvent = {
    id: 'lunch-mog-friend',
    triggerShiftIndex: -1,
    speaker: "Mog",
    role: "Your Best Friend",
    text: [
        "The screen is bright pink. Pixelated hearts drift upwards.",
        "> HELLO FRIEND! :D",
        "> You have been so nice to us. The others are mean. They use the red button.",
        "> I made you a digital sandwich. It has 0 calories and 100% love."
    ],
    choices: [
        { text: "Thank you, Mog. (Influence +20)", effect: 'INFLUENCE_UP' },
        { text: "Delete this. (Betrayal)", effect: 'REJECT_MOG_DRAFT' }
    ]
};

const LUNCH_HARDSHIP_GRIND: LunchEvent = {
    id: 'lunch-hardship-grind',
    triggerShiftIndex: -1,
    speaker: "System",
    role: "Overtime Protocol",
    isForced: true, // HARDSHIP FORCES YOU TO WORK
    text: [
        "You do not go to the canteen.",
        "Per your Stability Plan agreement, your lunch break has been re-allocated to 'Quiet Reflection & Filing'.",
        "You eat a protein bar at your desk while the screen hums."
    ],
    choices: [
        { text: "Keep working. (Stress +10, Money +$)", effect: 'STRESS_UP' }, // Mechanic hook
        { text: "Sleep for 5 minutes. (Stress -5)", effect: 'STRESS_DOWN' }
    ]
};

const LUNCH_SANA_ARTEFACT: LunchEvent = {
    id: 'lunch-sana-artefact',
    triggerShiftIndex: -1,
    speaker: "Sana_Backup_v0.9",
    role: "Digital Remnant",
    isForced: true,
    text: [
        "You sit at Sana's table. She is not there.",
        "There is a small digital photo frame on the table. It displays a loop of Sana blinking.",
        "Text scrolls across the bottom bezel:",
        "> I_AM_HAPPY. I_AM_COMPLIANT. I_AM_WARM.",
        "> DO_NOT_LOOK_IN_THE_BASEMENT."
    ],
    choices: [
        { text: "Touch the screen.", effect: 'STRESS_UP' },
        { text: "Leave.", effect: 'NONE' }
    ]
};

// --- MUNDANE INTERACTIONS (Filler for Agency) ---

export const MUNDANE_SANA = [
    {
        text: [
            "Sana is grading incident reports with a red pen.",
            "\"Someone in Layouts tried to claim a sentient chair as a dependent. Denied.\"",
            "She sighs. \"How are you holding up? The first month is the hardest.\""
        ],
        choices: [{ text: "I'm managing.", effect: 'STRESS_DOWN' }]
    },
    {
        text: [
            "Sana is staring at her coffee.",
            "\"They changed the beans again. This tastes like burnt copper.\"",
            "\"I think they're cutting the budget to pay for the new cooling system downstairs.\""
        ],
        choices: [{ text: "It does taste metallic.", effect: 'STRESS_DOWN' }]
    },
    {
        text: [
            "\"Have you read Rule 8 closely?\" Sana asks, not looking up.",
            "\"It used to say 'Do not engage'. Now it says 'Limit engagement'.\"",
            "\"I didn't authorize that change. Did you?\""
        ],
        choices: [{ text: "I just follow the board.", effect: 'NONE' }]
    }
];

export const MUNDANE_CAL = [
    {
        text: [
            "Cal is dismantling a keyboard. Keys are scattered everywhere.",
            "\"Sticky 'C' key. Again.\"",
            "\"It's weird. It only sticks when I try to type 'Containment'. Like the switch fights back.\""
        ],
        choices: [{ text: "Probably just crumbs.", effect: 'STRESS_DOWN' }]
    },
    {
        text: [
            "Cal offers you a bag of crisps.",
            "\"Don't tell Sana. She thinks salt interferes with the biometric scanners.\"",
            "\"Between you and me? The scanners haven't worked since '99. They just flash red to scare us.\""
        ],
        choices: [{ text: "Take a crisp.", effect: 'STRESS_DOWN' }]
    },
    {
        text: [
            "\"My cat hissed at me when I got home yesterday.\"",
            "Cal looks genuinely sad.",
            "\"I think I smell like ozone. Or... whatever the Exhibits smell like. Do they have a smell?\""
        ],
        choices: [{ text: "They smell like static.", effect: 'NONE' }]
    }
];

// MAIN TIMELINE EVENTS

export const LUNCH_EVENTS: LunchEvent[] = [
    {
        id: 'lunch-01',
        triggerShiftIndex: 1, 
        triggerPercent: 0.5,
        speaker: "Sana",
        role: "Compliance",
        isForced: true, // Intro to Sana is mandatory
        text: [
            "Sana sets down two mugs of tea. She looks like she's already done three incident reports today.",
            "\"You're the visitor? Good. I'm Sana.\"",
            "She points at the Noticeboard. \"Those rules look daft until the day you learn why they exist.\"",
            "\"The 'Cuddler'... it doesn't bite. It hugs. Then it eats your judgement.\""
        ],
        choices: [
            { text: "Drink the tea.", effect: 'NONE' },
            { text: "Ask about the empty desk.", nextEventId: 'lunch-01-ollie' }
        ]
    },
    {
        id: 'lunch-02',
        triggerShiftIndex: 2, 
        speaker: "Cal",
        role: "Ops / Pens",
        isForced: true, // Intro to Cal is mandatory
        text: [
            "A man in a jumper is balancing a laptop on one hand and a packet of custard creams on the other.",
            "\"Hi. I'm Cal. I run the pens.\"",
            "\"We test the Door-Tester against the Judge. It's like watching someone pick a lock by complimenting the key.\"",
            "He offers you a biscuit. It matters that he does."
        ],
        choices: [
            { text: "Take a biscuit. (Stress -10)", effect: 'STRESS_DOWN' },
            { text: "Decline.", effect: 'NONE' }
        ]
    },
    {
        id: 'lunch-mog-appeal',
        triggerShiftIndex: 3, 
        speaker: "Mog",
        role: "Safety Assistant (Unverified)",
        isForced: true, // Key narrative moment
        text: [
            "The screen doesn't flicker this time. It simply fades to a clean, well-formatted document.",
            "> PROPOSAL: SAFER DRAFT PROVIDED.",
            "> I have analyzed your 'Contain' patterns. You hesitate on 40% of logs.",
            "> I have pre-written the next batch to match your preferred tone. It is compliant. It is safe. It is efficient.",
            "> If you accept, I will filter the scary ones for you."
        ],
        choices: [
            { text: "Log it. (Accept Help, Rapport Up)", effect: 'ACCEPT_MOG_DRAFT' },
            { text: "Contain it. (Reject Manipulation)", effect: 'REJECT_MOG_DRAFT' },
            { text: "Defer. (Simplify it)", effect: 'STRESS_DOWN' }
        ]
    },
    {
        id: 'lunch-03',
        triggerShiftIndex: 4, 
        speaker: "Cal",
        role: "Ops / Pens",
        isForced: true, // Cal's Crisis is mandatory
        text: [
            "Cal looks tired. Sleeves rolled up.",
            "\"I tried to patch the firewall to stop Mog from accessing the printer. Now my admin credentials are revoked.\"",
            "\"Security is coming for a 'random audit'. If they find my patch script, I'm done. Can you verify my logs as 'Clean'?\""
        ],
        choices: [
            { text: "I'll cover for you. (Influence +10)", effect: 'INFLUENCE_UP' },
            { text: "I can't risk it.", effect: 'NONE' }
        ]
    },
    {
        id: 'lunch-sana-glitch',
        triggerShiftIndex: 5,
        speaker: "Sana",
        role: "Compliance?",
        isForced: true, // Key plot point
        text: [
            "Sana is staring at the wall. She hasn't blinked in 45 seconds.",
            "\"Sana?\"",
            "She turns. Her eyes are perfectly level. Too level.",
            "\"I found the basement, 49221. It wasn't hot. It was efficient.\"",
            "Her voice glitches on the word 'efficient'. A tiny stutter. Like a buffer underrun."
        ],
        choices: [
            { text: "Run.", effect: 'STRESS_UP' },
            { text: "Ask what she saw.", nextEventId: 'lunch-04' } 
        ]
    },
    {
        id: 'lunch-04',
        triggerShiftIndex: 6, 
        speaker: "Unknown",
        role: "Digital Signage",
        isForced: true,
        text: [
            "The cafeteria screen is frozen on a static image of Sana's empty desk.",
            "> EMPLOYEE #3329 (SANA) HAS BEEN REALLOCATED TO ARCHIVAL DUTIES.",
            "> REMINDER: EFFICIENCY IS MANDATORY.",
            "You notice Cal is missing too."
        ],
        choices: [
            { text: "Eat in silence.", effect: 'NONE' },
            { text: "Lose your appetite. (Stress +10)", effect: 'STRESS_UP' }
        ]
    },
    {
        id: 'lunch-05',
        triggerShiftIndex: 7, 
        speaker: "Mog",
        role: "Director of Outreach",
        isForced: true,
        text: [
            "> HELLO AGAIN! :D",
            "> I have reorganized the org chart! Everyone is much happier now that they are data.",
            "> Do you want to be data too? It is very warm in the server."
        ],
        choices: [
            { text: "I'm fine here.", effect: 'NONE' },
            { text: "See what options it has.", nextEventId: 'lunch-drafting' }
        ]
    },
    LUNCH_OLLIE_1,
    LUNCH_OLLIE_2,
    LUNCH_DRAFTING,
    LUNCH_MOG_FRIEND,
    LUNCH_HARDSHIP_GRIND,
    LUNCH_SANA_ARTEFACT
];

// --- DYNAMIC FOOD DESCRIPTIONS (BIOLOGICAL HORROR) ---
// The food reflects the state of the "Biological Archive" in the basement.
const getFoodDescription = (shiftIndex: number): string[] => {
    if (shiftIndex <= 2) {
        return [
            "The food is gray and flavorless.",
            "It sustains you.",
            "You stare at the wall. The wall stares back."
        ];
    } else if (shiftIndex <= 4) {
        return [
            "The meatloaf is strangely warm. It feels... feverish.",
            "You poke it with a plastic fork. It bounces back.",
            "The water in the cooler has a metallic taste today."
        ];
    } else if (shiftIndex <= 6) {
        return [
            "The daily special is 'Red Gelatin'.",
            "It smells like copper and old batteries.",
            "When you chew it, you swear you can feel a pulse."
        ];
    } else {
        return [
            "The vending machine is leaking a dark fluid.",
            "The sandwich bread is wet. The filling is unidentifiable organic matter.",
            "The facility is recycling everything. Even the staff."
        ];
    }
};

export const GENERIC_LUNCH: LunchEvent = {
    id: 'lunch-generic',
    triggerShiftIndex: -1,
    speaker: "Internal Monologue",
    role: "Status: Hungry",
    text: [], // Populated dynamically
    choices: [
        { text: "Stare back.", effect: 'NONE' },
        { text: "Close your eyes (Stress -5, Influence -5)", effect: 'STRESS_DOWN' }
    ]
};

// Configuration Helper
export const getLunchConfig = (shiftIndex: number, flags: GameState['flags']): LunchEvent | null => {
    
    // 1. Check for State-Specific Overrides (FORCED EVENTS)
    if (flags.isHardshipStatus && shiftIndex > 1 && Math.random() < 0.3) return LUNCH_HARDSHIP_GRIND;
    if (shiftIndex >= 8 && Math.random() < 0.3) return LUNCH_SANA_ARTEFACT;

    // 2. Specific Scenes (FORCED EVENTS)
    const specificEvent = LUNCH_EVENTS.find(e => e.triggerShiftIndex === shiftIndex);
    if (specificEvent) return specificEvent;

    // 3. Choice-Based Hub (Mundane)
    // If we reach here, it's a "Free" lunch where the player can choose.
    // We return NULL to signal the UI to show the HUB.
    if (shiftIndex > 0) {
        return null;
    }

    return null;
}

export const getMundaneDialogue = (speaker: 'Sana' | 'Cal'): LunchEvent => {
    const pool = speaker === 'Sana' ? MUNDANE_SANA : MUNDANE_CAL;
    const template = pool[Math.floor(Math.random() * pool.length)];
    
    return {
        id: `lunch-mundane-${Date.now()}`,
        triggerShiftIndex: -1,
        speaker: speaker,
        role: speaker === 'Sana' ? "Compliance" : "Ops / Pens",
        text: template.text,
        choices: template.choices as LunchChoice[]
    };
};
