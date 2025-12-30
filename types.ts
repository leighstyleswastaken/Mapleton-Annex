
export enum Rank {
  VISITOR = 'VISITOR',
  OBSERVER = 'OBSERVER',
  LIAISON = 'LIAISON',
  DIRECTOR = 'DIRECTOR',
  SUBJECT_0 = 'SUBJECT_0'
}

export enum ActionType {
  LOG = 'LOG',
  CONTAIN = 'CONTAIN',
  DEFER = 'DEFER',
  CLEAR_JAM = 'CLEAR_JAM', 
  FREE = 'FREE', 
  FORGET = 'FORGET' 
}

export enum ExhibitId {
  CUDDLER = 'CUDDLER',
  CAROUSEL = 'CAROUSEL',
  DOOR_TESTER = 'DOOR_TESTER',
  JUDGE = 'JUDGE',
  COPY_WRITER = 'COPY_WRITER',
  MOG = 'MOG',
  HUMAN = 'HUMAN'
}

export interface Exhibit {
  id: ExhibitId;
  name: string;
  alias: string;
  description: string;
  primaryBehavior: string;
  redFlagTags: string[];
}

export interface Rule {
  id: string;
  text: string;
  tags: string[]; 
  active: boolean;
  amendment?: string;
  conflictId?: string; 
}

export interface Amendment {
    id: string;
    ruleId: string;
    newText: string;
    reason: string;
    cost: 'INFLUENCE' | 'SAFETY';
}

export interface LogItem {
  id: string;
  exhibitId: ExhibitId; 
  text: string;
  redFlagTags: string[];
  difficulty: number;
  timestamp: number; 
  isScripted?: boolean;
  visualSpoofId?: ExhibitId; 
  personalitySpoofId?: ExhibitId; 
  baseNoiseLevel: number; 
  logKind?: 'NORMAL' | 'OLLIE_GHOST' | 'MIRROR' | 'HUMAN' | 'HYBRID'; 
}

// P4: THE DIRECTOR
export interface DirectorInstruction {
    targetExhibitId: ExhibitId;
    intent: 'SAFE' | 'OBVIOUS_HAZARD' | 'SUBTLE_HAZARD' | 'REDACTABLE' | 'NARRATIVE';
    baseNoise: number;
    allowSpoof: boolean;
    wordLimit: number;
    narrativeContext?: string;
    specificTags?: string[];
}

export interface GameEvent {
  id: string;
  name: string;
  description: string;
  durationActions: number;
  uiClass: string; 
}

export enum EndingType {
  TRUE_ENDING = 'TRUE_ENDING', 
  SUBJECT_0 = 'SUBJECT_0', 
  BROKEN = 'BROKEN', 
  SPEEDRUN = 'SPEEDRUN', 
  FIRED = 'FIRED', 
  THAWED = 'THAWED',      // Rail C: Archivist Escape
  MANAGER = 'MANAGER',    // Rail A: Promotion to Director
  OVERRUN = 'OVERRUN',    // Rail D: Mog takes over
  OLLIE_ASCENSION = 'OLLIE_ASCENSION' 
}

export interface Trap {
  id: string;
  name: string;
  description: string;
  effect: 'SHRINK_CONTAIN' | 'HIDE_SAFETY' | 'SKEW_BUTTONS' | 'AUTO_COMPLETE' | 'BOOST_DAILY' | 'SHUFFLE_RULES' | 'VOICE_TUNER' | 'PRINTER_JAM' | 'DEAD_KEYS';
  globalCost?: number; 
}

export interface SessionStats {
  totalTokens: number;
  apiCalls: number;
  apiErrors: number;
}

export interface InteractionHistory {
  action: ActionType;
  exhibitId: ExhibitId;
  timestamp: number;
  wasCorrect: boolean;
  textSnippet?: string; 
}

export interface FeedbackState {
    type: 'CORRECT' | 'WRONG';
    message: string;
}

export interface LunchChoice {
    text: string;
    effect?: 'NONE' | 'STRESS_DOWN' | 'STRESS_UP' | 'INFLUENCE_UP' | 'UNLOCK_MOG_UPGRADE' | 'SKIP_TASKS' | 'ACCEPT_MOG_DRAFT' | 'REJECT_MOG_DRAFT' | 'GAIN_KEY';
    nextEventId?: string; 
}

export interface LunchEvent {
    id: string;
    triggerShiftIndex: number; 
    triggerPercent?: number; 
    speaker: string;
    role: string;
    text: string[];
    choices: LunchChoice[]; 
}

export interface EmailOption {
    label: string;
    effect: 'NONE' | 'SIGN_HARDSHIP' | 'CLIP_EVIDENCE' | 'REPORT_INCIDENT' | 'ARCHIVE';
    style?: 'default' | 'danger' | 'safe';
}

export interface Email {
    id: string;
    triggerShiftIndex: number; 
    sender: string;
    subject: string;
    body: string[];
    attachment?: string; 
    options?: EmailOption[];
}

export interface WeeklyStats {
    throughput: number; 
    auditability: number; 
    variance: number; 
    scrutiny: number; 
    stability: number; 
    dossierCount: number; 
    rapport: number; 
}

export interface MemoOption {
    label: string;
    description?: string;
    effectType: 'PROMOTION' | 'HARDSHIP_ACCEPT' | 'HARDSHIP_REJECT' | 'SIGN_OFF' | 'LEAK' | 'COOPERATE' | 'REFUSE';
    statsDelta?: Partial<WeeklyStats>;
}

export interface DecisionMemo {
    id: string;
    title: string;
    from: string;
    body: string[];
    options: MemoOption[];
}

export interface StickyNoteDef {
    id: string;
    text: string;
    triggerShift?: number;
    maxShift?: number;
    reqFlag?: string;
}

export interface GameState {
  runId: string;
  shiftIndex: number; 
  rank: Rank;
  
  // METERS
  dailySafety: number; 
  safety: number; 
  influence: number; 
  stress: number; 
  annexAwareness: number; 

  queue: LogItem[];
  logsProcessedInShift: number;
  deferCountGlobal: number; 
  consecutiveCorrect: number; 
  consecutiveWrong: number;   
  
  activeTraps: Trap[];
  activeRuleIds: string[]; 
  rottedRuleIds: string[]; 
  activeUpgrades: string[]; 
  
  // P3: AMENDMENTS
  activeAmendments: Amendment[]; 
  pendingAmendment: Amendment | null; 
  
  // NARRATIVE FLAGS
  flags: {
      isHardshipStatus: boolean; 
      hasClippedEvidence: boolean; 
      evidenceCount: number;
      mogRapport: number;
      hasBasementKey: boolean; 
      isOllieMode: boolean; 
      ollieHauntLevel: number; 
      sanaCorruptionLevel: number; 
  };
  
  // NEW: Track dismissed notes to prevent repetition
  seenStickyNotes: string[];

  isShiftActive: boolean;
  isShiftEnding: boolean;
  
  isLunchBreak: boolean; 
  hasTakenLunch: boolean; 
  activeLunchEventId: string | null; 
  
  isReviewPhase: boolean; 
  pendingReview: DecisionMemo | null; 
  weeklyStats: WeeklyStats; 

  isPaused: boolean; 
  isTutorial: boolean;
  
  gameOverReason: EndingType | null;
  activeEvent: GameEvent | null;
  activeEventDurationRemaining: number; 
  lastEventTime: number; // For cooldown logic
  pendingTrap: Trap | null; 
  
  stats: SessionStats;
  useLLM: boolean; 
  
  lastInteraction: InteractionHistory | null; 
  interactionHistory: InteractionHistory[]; 
  lastFeedback: FeedbackState | null; 
  
  hasSeenIntro: boolean; 
  activeEmail: Email | null; 
  
  stressMaxHits: number; 
  totalLogsProcessed: number;
  totalContains: number;
}

export interface ShiftConfig {
  logsPerShift: number;
  exhibitsActive: ExhibitId[];
}
