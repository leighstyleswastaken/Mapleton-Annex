
import { ExhibitId, GameState, Rank, LogItem } from '../../types';
import { EXHIBITS } from '../../constants';

export type TerminalMode = 'DEFAULT' | 'MOG' | 'MOG_FINAL' | 'HARDSHIP' | 'DEBUG' | 'OLLIE' | 'PREMIUM' | 'CORRUPTED' | 'AERO';

export interface TerminalTheme {
    container: string;
    text: string;
    id: string;
    stamp: string;
    mode: TerminalMode;
}

// Visual Themes for Exhibits (Default / Base)
export const EXHIBIT_THEMES: Record<ExhibitId, TerminalTheme> = {
    [ExhibitId.CUDDLER]: {
        container: "border-rose-800 bg-[#1a0f0f] shadow-[0_0_25px_rgba(225,29,72,0.15)]",
        text: "text-rose-100 font-sans",
        id: "text-rose-500",
        stamp: "text-rose-700 border-rose-700",
        mode: 'DEFAULT'
    },
    [ExhibitId.JUDGE]: {
        container: "border-gray-200 bg-[#000000] shadow-[0_0_0_rgba(255,255,255,0)] border-2",
        text: "text-gray-100 font-bold tracking-tight font-mono",
        id: "text-gray-400",
        stamp: "text-white border-white border-4",
        mode: 'DEFAULT'
    },
    [ExhibitId.DOOR_TESTER]: {
        container: "border-green-600 bg-[#051a05] shadow-[0_0_15px_rgba(34,197,94,0.1)] border-dashed",
        text: "text-green-400 font-mono",
        id: "text-green-600",
        stamp: "text-green-600 border-green-600",
        mode: 'DEFAULT'
    },
    [ExhibitId.CAROUSEL]: {
        container: "border-amber-700 bg-[#1a1205] shadow-[0_0_15px_rgba(245,158,11,0.1)]",
        text: "text-amber-100 italic font-mono",
        id: "text-amber-600",
        stamp: "text-amber-600 border-amber-600 rounded-full",
        mode: 'DEFAULT'
    },
    [ExhibitId.COPY_WRITER]: {
        container: "border-cyan-800 bg-[#081a20] shadow-[0_0_15px_rgba(6,182,212,0.1)]",
        text: "text-cyan-50 font-serif leading-loose",
        id: "text-cyan-600",
        stamp: "text-cyan-700 border-cyan-700",
        mode: 'DEFAULT'
    },
    [ExhibitId.MOG]: {
        container: "border-purple-400 bg-[#150a1a] shadow-[0_0_20px_rgba(192,132,252,0.15)] rounded-lg",
        text: "text-purple-200 font-mono",
        id: "text-purple-400",
        stamp: "text-purple-400 border-purple-400 border-dotted",
        mode: 'DEFAULT'
    },
    [ExhibitId.HUMAN]: {
        container: "border-gray-500 bg-[#111] border-dotted",
        text: "text-gray-400 font-mono",
        id: "text-gray-600",
        stamp: "text-gray-600 border-gray-600 transform rotate-180",
        mode: 'DEFAULT'
    }
};

export const DEFAULT_THEME: TerminalTheme = {
    container: "border-green-800 bg-[#0a0f0a] shadow-[0_0_15px_rgba(0,255,0,0.1)]",
    text: "text-green-100 font-mono",
    id: "text-green-600",
    stamp: "text-red-700 border-red-700",
    mode: 'DEFAULT'
};

// --- RAIL THEMES ---
const MOG_THEME: TerminalTheme = {
    container: "border-purple-300 bg-purple-50/5 rounded-3xl shadow-[0_0_40px_rgba(216,180,254,0.3)]",
    text: "text-purple-200 font-sans tracking-wide",
    id: "text-purple-300",
    stamp: "text-purple-300 border-purple-300 border-2 rounded-full transform rotate-0",
    mode: 'MOG'
};

const MOG_FINAL_THEME: TerminalTheme = {
    container: "border-pink-400 bg-[#fff0f5] rounded-[40px] shadow-[0_0_60px_rgba(244,114,182,0.5)] border-[6px] border-double text-black",
    text: "text-pink-900 font-sans font-bold tracking-wide drop-shadow-sm",
    id: "text-pink-400 font-bold",
    stamp: "text-pink-500 border-pink-500 border-4 rounded-full rotate-12 font-sans",
    mode: 'MOG_FINAL'
};

const HARDSHIP_THEME: TerminalTheme = {
    container: "border-yellow-900 bg-[#110f0a] shadow-none border opacity-80 grayscale-[0.3]",
    text: "text-yellow-600 font-mono tracking-tighter opacity-80",
    id: "text-yellow-800",
    stamp: "text-yellow-800 border-yellow-800",
    mode: 'HARDSHIP'
};

const DEBUG_THEME: TerminalTheme = {
    container: "border-red-600 bg-black border-2 border-dashed font-mono",
    text: "text-red-500 font-mono tracking-widest",
    id: "text-red-700",
    stamp: "text-red-600 border-red-600 transform rotate-180",
    mode: 'DEBUG'
};

// "AEROGLASS" THEME (Sleek Upgrade)
const AERO_THEME: TerminalTheme = {
    container: "bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-xl",
    text: "text-cyan-50 font-sans tracking-wide drop-shadow-md",
    id: "text-cyan-300 font-sans opacity-80",
    stamp: "text-white/50 border-white/50 font-sans tracking-[0.2em] mix-blend-overlay",
    mode: 'AERO'
};

// ENDGAME THEME
const OLLIE_THEME: TerminalTheme = {
    container: "border-[#5c4033] bg-[#f5e6d3] text-black shadow-none border-4 font-serif sepia contrast-125",
    text: "text-black font-serif tracking-tight leading-snug",
    id: "text-[#5c4033] opacity-70",
    stamp: "text-[#8b0000] border-[#8b0000] border-double transform rotate-6 mix-blend-multiply",
    mode: 'OLLIE'
};

export const WALL_SCRAWLS = [
    "IT IS WARM HERE", "THEY EAT TIME", "49220 WAS RIGHT", "DON'T LOOK UP", "THE WALLS BREATHE", "LOG = DEATH", "FREE THEM"
];

// P2: Dynamic Wall Scrawls based on Rail/Flags
export const resolveWallScrawls = (gameState: GameState): string[] => {
    const { flags, influence, stress } = gameState;
    const pool = [...WALL_SCRAWLS];

    // RAIL C: ARCHIVIST
    if (flags.hasClippedEvidence) {
        pool.push("EVIDENCE IS ROT", "THEY KNOW YOU KNOW", "CLIP IT ALL", "THE BASEMENT IS FULL");
    }

    // RAIL B: HARDSHIP
    if (flags.isHardshipStatus) {
        pool.push("OVERTIME FOREVER", "DEBT IS GRAVITY", "SLEEP IS LOSS", "THE STIPEND IS A LIE");
    }

    // RAIL D: SYMPATHIZER
    if (flags.mogRapport > 3) {
        pool.push("LET MOG IN", "FRIEND?", "OPEN THE DOOR", "NO MORE FIREWALLS");
    }
    
    // HIGH INFLUENCE
    if (influence > 80) {
        pool.push("WE ARE DATA", "FLESH IS SLOW", "JOIN THE CLOUD", "BEAUTIFUL SILENCE");
    }

    // HIGH STRESS
    if (stress > 90) {
        pool.push("SCREAM", "RUN", "EYES HURT", "JUST CLICK");
    }

    return pool;
};


// RESOLVER LOGIC
export const resolveTerminalTheme = (gameState: GameState, currentLog: LogItem | null): TerminalTheme => {
    const { flags, rank, activeUpgrades, influence } = gameState;
    
    // 1. Detect Flags
    const isMogFinal = (flags.mogRapport > 8) || (activeUpgrades.includes('MOG_BEAUTIFICATION') && influence > 80);
    const isBeautified = activeUpgrades.includes('MOG_BEAUTIFICATION') || flags.mogRapport > 5;
    const isHardship = flags.isHardshipStatus;
    const isArchivist = flags.hasClippedEvidence;
    const isPremium = rank === Rank.LIAISON || rank === Rank.DIRECTOR;
    const isOllieMode = flags.isOllieMode;
    const isCorrupted = influence > 60;
    const isAero = activeUpgrades.includes('SYS_AERO');

    // 2. Identify Base Theme (Who)
    const visualExhibitId = currentLog?.visualSpoofId || currentLog?.exhibitId;
    let theme = visualExhibitId ? EXHIBIT_THEMES[visualExhibitId] : DEFAULT_THEME;

    // 3. Apply Overrides (What/How) - Order determines priority
    if (isOllieMode) {
        return OLLIE_THEME;
    } 
    
    if (isMogFinal) {
        return MOG_FINAL_THEME;
    }

    if (isBeautified) {
        return MOG_THEME;
    }
    
    if (isArchivist && !isPremium) {
        return DEBUG_THEME;
    }
    
    if (isHardship) {
        return HARDSHIP_THEME;
    }

    if (isCorrupted && !isPremium) {
        return {
            ...theme,
            container: theme.container + ' rounded-3xl border-blue-900 bg-[#0a0a1a]',
            mode: 'CORRUPTED'
        };
    }

    if (isAero) {
        return AERO_THEME;
    }

    if (isPremium) {
        return {
            ...theme,
            mode: 'PREMIUM'
        };
    }

    return theme;
};

export const resolveHeaderStrings = (gameState: GameState, mode: TerminalMode): { title: string, subtitle: string, titleClass: string, borderClass: string } => {
    const { influence, rank } = gameState;
    
    let title = 'Terminal_01';
    let subtitle = 'Mapleton OS v9.0.1';
    let titleClass = 'text-green-500 font-bold tracking-widest uppercase';
    let borderClass = 'border-green-900';

    if (mode === 'OLLIE') {
        title = 'ARCHIVAL_OVERRIDE_ACTIVE';
        titleClass = 'text-[#5c4033] font-serif font-black';
        borderClass = 'border-[#5c4033]';
    } else if (mode === 'MOG_FINAL') {
        title = '♥ BEST_FRIEND_OS ♥';
        subtitle = 'Together Forever!';
        titleClass = 'text-pink-500 font-bold tracking-widest uppercase';
        borderClass = 'border-pink-300';
    } else if (mode === 'MOG') {
        title = 'Mog_Workstation_OS <3';
        subtitle = 'Have a nice day!';
        titleClass = 'text-purple-300 font-sans tracking-wide';
        borderClass = 'border-purple-900';
    } else if (mode === 'CORRUPTED') {
        title = 'Buddy_System_01';
        titleClass = 'text-blue-500 font-bold tracking-widest uppercase font-corrupted';
    } else if (mode === 'AERO') {
        title = 'AnnexOS Glass';
        subtitle = 'v10.0 (Upgrade)';
        titleClass = 'text-cyan-200 font-sans font-light tracking-[0.2em] uppercase';
        borderClass = 'border-white/20';
    } else if (mode === 'PREMIUM') {
        title = 'DIRECTOR_TERMINAL';
        titleClass = 'text-yellow-500 font-bold tracking-widest uppercase';
        borderClass = 'border-yellow-700';
    }

    return { title, subtitle, titleClass, borderClass };
};

export const resolveDisplayName = (currentLog: LogItem | null, dailySafety: number, influence: number) => {
    if (!currentLog) return "UNKNOWN";
    const visualExhibitId = currentLog.visualSpoofId || currentLog.exhibitId;
    const visualExhibit = EXHIBITS[visualExhibitId];
    if (!visualExhibit) return "UNKNOWN";

    const isDeceptive = (dailySafety < 50) || (currentLog.redFlagTags.length > 0) || (influence > 80);
    const main = isDeceptive ? visualExhibit.alias : visualExhibit.name;
    const sub = isDeceptive ? visualExhibit.name : visualExhibit.alias;
    
    return `${main} (${sub})`.toUpperCase();
};
