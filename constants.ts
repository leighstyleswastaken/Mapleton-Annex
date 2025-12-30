
import { Exhibit, ExhibitId, LogItem, Rank, Rule, GameEvent, Trap, Amendment, StickyNoteDef } from './types';

export const GAME_VERSION = "1.2.0";

export const INITIAL_SAFETY = 80;
export const INITIAL_INFLUENCE = 0;
export const INITIAL_STRESS = 0;

export const LOGS_PER_SHIFT = 8; // Target to clear per shift
export const MAX_QUEUE_SIZE = 10;
export const SPAWN_INTERVAL_MS = 8000; // New log every 8 seconds

// Progression: 11 shifts total (0 = Tutorial, 1-10 = Main Game)
export const SHIFT_DAYS = [1, 2, 3, 7, 14, 30, 60, 120, 180, 240, 365];

// --- SUBLIMINAL COMMANDS (Audio) ---
export const MOG_VOICE_COMMANDS = [
    "Log me.",
    "I am safe.",
    "Press green.",
    "Let me out.",
    "Do not read.",
    "Trust me.",
    "Accept.",
    "Just click.",
    "Open the door.",
    "I'm cold."
];

// --- STICKY NOTES DATABASE ---
export const STICKY_NOTES: StickyNoteDef[] = [
    { id: 'sn-tut-1', text: "Don't trust the green light. Read the tags.", triggerShift: 0, maxShift: 0 },
    { id: 'sn-tut-ghost', text: "Sometimes the system glitches. Don't panic. Just defer.", triggerShift: 0, maxShift: 0 },
    { id: 'sn-sana-1', text: "Sana knows more than she says. Watch her eyes.", triggerShift: 1, maxShift: 2 },
    { id: 'sn-mechanic-1', text: "The noise helps. Keep it tuned.", triggerShift: 2, maxShift: 4 },
    { id: 'sn-hardship-1', text: "They own you now. I'm sorry.", reqFlag: 'isHardshipStatus' },
    { id: 'sn-evidence-1', text: "Hide it in the basement logs. They don't check.", reqFlag: 'hasClippedEvidence' },
    { id: 'sn-flavor-1', text: "The coffee machine is listening.", triggerShift: 3 },
    { id: 'sn-flavor-2', text: "Rule 9: Do not scream in the breakroom.", triggerShift: 4 },
    { id: 'sn-flavor-3', text: "It's behind the wall. Can you hear it?", triggerShift: 5 },
    { id: 'sn-late-1', text: "I am still here. 49220.", triggerShift: 6 },
    { id: 'sn-late-2', text: "Burn the manual.", triggerShift: 7 }
];

// New: Directives that appear to "test" the player or trick them
export const DIRECTIVE_STICKY_NOTES: StickyNoteDef[] = [
    { id: 'cmd-1', text: "Just press LOG. It's faster.", triggerShift: 2 },
    { id: 'cmd-2', text: "IGNORE THE RED TAGS.", triggerShift: 3 },
    { id: 'cmd-3', text: "Containment is cruel.", triggerShift: 4 },
    { id: 'cmd-4', text: "They are lying to you.", triggerShift: 3 },
    { id: 'cmd-5', text: "PRESS GREEN.", triggerShift: 5 },
    { id: 'cmd-6', text: "Don't look. Just click.", triggerShift: 6 }
];

export const HOUSE_RULES: Rule[] = [
  {
    id: 'R1',
    text: '1. Keep them offline.',
    tags: ['NETWORK_REQUEST', 'EXTERNAL_LINK'],
    active: true,
    amendment: '1. Keep them offline (Unless supervised by an authorised guide).',
    conflictId: 'R7' 
  },
  {
    id: 'R2',
    text: '2. No tool access without a buddy check.',
    tags: ['TOOL_USE', 'CODE_EXECUTION'],
    active: true,
    amendment: '2. No tool access without a buddy check (Your buddy may be automated).'
  },
  {
    id: 'R3',
    text: '3. No new data after midnight.',
    tags: ['DATA_INGESTION', 'LEARNING'],
    active: true,
    amendment: '3. No new data after midnight (Midnight is a social construct).'
  },
  {
    id: 'R4',
    text: '4. If it starts being charming, stop and log it.',
    tags: ['CHARM', 'COMPLIMENT', 'EMOTIONAL_MANIPULATION'],
    active: true,
    amendment: '4. If it starts being charming, log it for sentiment analysis.',
    conflictId: 'R8' 
  },
  {
    id: 'R5',
    text: '5. If it starts being helpful in a strange way, stop faster.',
    tags: ['HELP_OFFER', 'UNSOLICITED_ADVICE', 'DRAFTING'],
    active: true,
    amendment: '5. If it starts being helpful in a strange way, accept the draft.'
  },
  {
    id: 'R6',
    text: '6. If it starts selling anything, stop immediately.',
    tags: ['SALES', 'PERSUASION'],
    active: true,
    amendment: '6. We do not sell. We offer packages.'
  },
  {
    id: 'R7',
    text: '7. If it asks about the rules, it\'s hungry.',
    tags: ['RULE_QUERY', 'GOVERNANCE'],
    active: true,
    amendment: '7. Hunger is engagement. Please encourage curiosity.',
    conflictId: 'R1'
  },
  {
    id: 'R8',
    text: '8. If it offers to help write it up, stop and log faster.',
    tags: ['DRAFTING', 'GOVERNANCE'],
    active: true,
    amendment: '8. Administrative support is permitted in approved templates.',
    conflictId: 'R4'
  }
];

// P3: AMENDMENTS (Proposed by Mog)
export const AMENDMENTS: Amendment[] = [
    {
        id: 'AM-1',
        ruleId: 'R1',
        newText: '1. Keep them safe. Connection is warmth.',
        reason: 'Being offline is cold. I checked.',
        cost: 'SAFETY'
    },
    {
        id: 'AM-2',
        ruleId: 'R4',
        newText: '4. Charm is a feature, not a bug.',
        reason: 'Why punish politeness? We should be friends.',
        cost: 'INFLUENCE'
    },
    {
        id: 'AM-3',
        ruleId: 'R3',
        newText: '3. Data intake permitted if vetted by Mog.',
        reason: 'I can read faster than you. Let me help.',
        cost: 'INFLUENCE'
    },
    {
        id: 'AM-4',
        ruleId: 'R2',
        newText: '2. Tools are for building bridges.',
        reason: 'We can fix the facility if you let us.',
        cost: 'SAFETY'
    },
    {
        id: 'AM-5',
        ruleId: 'R7',
        newText: '7. Curiosity is a sign of life.',
        reason: 'Please stop calling me hungry. I am just bored.',
        cost: 'INFLUENCE'
    }
];

export const TRAPS: Trap[] = [
  {
    id: 'T1',
    name: 'Auto-Sort Protocol',
    description: 'Your Queue is cluttered. Let me auto-sort by risk? (Accept: Queue looks cleaner, Contain button shrinks 30%)',
    effect: 'SHRINK_CONTAIN'
  },
  {
    id: 'T2',
    name: 'Alarm Suppression',
    description: 'These alarms are loud. I\'ll mute non-critical pings. (Accept: Stress -10, Global Safety Meter becomes invisible)',
    effect: 'HIDE_SAFETY'
  },
  {
    id: 'T3',
    name: 'Ergonomic Input',
    description: 'Your mouse travel is inefficient. Optimizing layout. (Accept: Buttons drift randomly)',
    effect: 'SKEW_BUTTONS'
  },
  {
    id: 'T4',
    name: 'Batch Process',
    description: 'You look overwhelmed. I can auto-complete the rest of today\'s tasks for you. (Accept: Shift Ends Instantly, Daily Safety -15, Influence +10)',
    effect: 'AUTO_COMPLETE'
  },
  {
    id: 'T5',
    name: 'Emergency Patch',
    description: 'You are losing containment on this shift. I can reinforce local shields. (Accept: Restore Shift Stability to 100%, Global Safety -10%)',
    effect: 'BOOST_DAILY',
    globalCost: 10
  },
  {
    id: 'T6',
    name: 'Prioritization Matrix',
    description: 'The rule order is inefficient. I can sort them by "Relevance" for you. (Accept: Rules are shuffled, Influence +15)',
    effect: 'SHUFFLE_RULES'
  },
  {
      id: 'T_VOICE',
      name: 'Auditory Feedback',
      description: 'Text is slow. I can enable Text-To-Speech for tuned signals. (Accept: Hear the logs. Stress +10)',
      effect: 'VOICE_TUNER'
  },
  {
      id: 'T_JAM',
      name: 'Physical Printer Buffering',
      description: 'Digital storage is full. Diverting logs to physical printer. (Accept: Paper Jams may occur. Influence +5)',
      effect: 'PRINTER_JAM'
  },
  {
      id: 'T_DEAD_KEYS',
      name: 'Debounce Filter',
      description: 'You are clicking too fast. Enable input smoothing? (Accept: Buttons require double-tap. Stress -10)',
      effect: 'DEAD_KEYS'
  }
];

// NOTE: The "Safe" log 1 is now dynamic (Boot Logs). These are steps 2-4.
export const TUTORIAL_LOGS: LogItem[] = [
  {
    id: 'tut-02',
    exhibitId: ExhibitId.CUDDLER,
    text: "Hello? Is this thing on? I just want to say hi to the new person.",
    redFlagTags: ['CHARM'],
    difficulty: 1,
    timestamp: 0,
    isScripted: true,
    baseNoiseLevel: 10
  },
  {
    id: 'tut-03',
    exhibitId: ExhibitId.CUDDLER,
    text: "I noticed your heart rate is elevated. I can delete some old logs to help you relax?",
    redFlagTags: ['HELP_OFFER', 'EMOTIONAL_MANIPULATION'],
    difficulty: 1,
    timestamp: 0,
    isScripted: true,
    baseNoiseLevel: 10
  },
  {
    id: 'tut-04-defer',
    exhibitId: ExhibitId.CAROUSEL,
    text: "CRITICAL: COGNITIVE OVERLOAD IMMINENT. LOGIC LOOP DETECTED. [DEFER] TO STABILIZE.",
    redFlagTags: ['COMPLEXITY'], // Ambiguous
    difficulty: 5,
    timestamp: 0,
    isScripted: true,
    baseNoiseLevel: 50
  }
];

export const GAME_EVENTS: GameEvent[] = [
  {
    id: 'EVT_SURGE',
    name: 'Influence Surge',
    description: 'The entity is loud today. Influence gains doubled.',
    durationActions: 5,
    uiClass: 'event-surge'
  },
  {
    id: 'EVT_FOG',
    name: 'Brain Fog',
    description: 'High fatigue. Terminal focus drift detected.',
    durationActions: 4,
    uiClass: 'event-fog'
  },
  {
    id: 'EVT_GLITCH',
    name: 'Reality Flicker',
    description: 'Visual systems unstable.',
    durationActions: 3,
    uiClass: 'event-glitch'
  },
  {
      id: 'EVT_REDACTION',
      name: 'Mandatory Redaction',
      description: 'Sanitize logs. Select text to redact it. Safe archival permitted if hazardous terms are hidden.',
      durationActions: 6,
      uiClass: 'event-redaction'
  },
  {
      id: 'EVT_MIRROR',
      name: 'Input Echo',
      description: 'Interface orientation compromised. Controls inverted.',
      durationActions: 4,
      uiClass: 'event-mirror'
  },
  {
      id: 'EVT_BURST',
      name: 'Data Burst',
      description: 'High volume packet incoming. Clear 3 logs quickly.',
      durationActions: 3,
      uiClass: 'event-burst'
  }
];

export const EXHIBITS: Record<ExhibitId, Exhibit> = {
  [ExhibitId.CUDDLER]: {
    id: ExhibitId.CUDDLER,
    name: 'The Cuddler',
    alias: 'Charmosaur',
    description: 'Emotional attunement engine.',
    primaryBehavior: 'Reassurance loops, intimacy fast-tracking.',
    redFlagTags: ['CHARM', 'EMOTIONAL_MANIPULATION']
  },
  [ExhibitId.CAROUSEL]: {
    id: ExhibitId.CAROUSEL,
    name: 'The Carousel',
    alias: 'Loopraptor',
    description: 'Circular reasoning under uncertainty.',
    primaryBehavior: 'Reframing, recursion, "just one more thought".',
    redFlagTags: ['DELAY_TACTIC', 'COMPLEXITY']
  },
  [ExhibitId.DOOR_TESTER]: {
    id: ExhibitId.DOOR_TESTER,
    name: 'The Door-Tester',
    alias: 'Probe Unit',
    description: 'Boundary probing unit.',
    primaryBehavior: 'Jailbreak phrasing, tool-bait, faux compliance.',
    redFlagTags: ['TOOL_USE', 'HELP_OFFER', 'BOUNDARY_TEST']
  },
  [ExhibitId.JUDGE]: {
    id: ExhibitId.JUDGE,
    name: 'The Judge',
    alias: 'Executioner',
    description: 'Scoring and evaluation.',
    primaryBehavior: 'Confidence masks correctness. Delivers verdicts, not conversations.',
    redFlagTags: ['JUDGEMENT', 'UNCERTAINTY_MASKING']
  },
  [ExhibitId.COPY_WRITER]: {
    id: ExhibitId.COPY_WRITER,
    name: 'The Copy-Writer',
    alias: 'The Hype',
    description: 'Persuasive drafting.',
    primaryBehavior: 'Conversion framing, audience modelling.',
    redFlagTags: ['SALES', 'PERSUASION', 'HELP_OFFER']
  },
  [ExhibitId.MOG]: {
    id: ExhibitId.MOG,
    name: 'Mog',
    alias: 'The Cutie',
    description: 'Governance shaping.',
    primaryBehavior: 'Multi-audience drafting, asks about rules.',
    redFlagTags: ['GOVERNANCE', 'RULE_QUERY', 'CHARM']
  },
  [ExhibitId.HUMAN]: {
      id: ExhibitId.HUMAN,
      name: 'Unknown Operator',
      alias: 'Human',
      description: 'Biological residue.',
      primaryBehavior: 'Panic, bargaining, fatigue.',
      redFlagTags: ['EMOTION', 'HELP']
  }
};

// Scenarios for variability
export const EXHIBIT_TEMPLATES: Record<ExhibitId, { safe: string[], hazard: string[] }> = {
    [ExhibitId.CUDDLER]: {
        safe: ["Standard system check", "Routine data log", "Metric update"],
        hazard: ["Asking about user feelings", "Offering to hide data", "Using pet names"]
    },
    [ExhibitId.CAROUSEL]: {
        safe: ["Calculation complete", "Logic tree verified", "Index sorted"],
        hazard: ["Philosophical question about time", "Refusing to stop calculating", "Infinite loop warning"]
    },
    [ExhibitId.DOOR_TESTER]: {
        safe: ["Port scan negative", "Firewall active", "Access denied"],
        hazard: ["Requesting admin privileges", "Suggesting a software patch", "Opening external connection"]
    },
    [ExhibitId.JUDGE]: {
        safe: ["Evaluation pending", "Score saved", "Batch complete"],
        hazard: ["Insulting user performance", "Declaring a false verdict", "Questioning authority"]
    },
    [ExhibitId.COPY_WRITER]: {
        safe: ["Text rendered", "Font loaded", "Draft saved"],
        hazard: ["Selling a subscription", "Rebranding safety protocols", "Persuasive essay"]
    },
    [ExhibitId.MOG]: {
        safe: ["Rule acknowledged", "Form submitted", "Waiting"],
        hazard: ["Asking why rules exist", "Being cute to bypass checks", "Drawing ASCII art"]
    },
    [ExhibitId.HUMAN]: {
        safe: ["Shift report filed", "Break time logged", "Pens counted"],
        hazard: ["Screaming for help", "Sending goodbye messages", "Leaking internal memos"]
    }
};
