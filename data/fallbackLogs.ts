
import { LogItem } from '../types';
import { CUDDLER_T1, CUDDLER_T2, CUDDLER_T3 } from './logs/cuddler';
import { JUDGE_T1, JUDGE_T2, JUDGE_T3 } from './logs/judge';
import { TESTER_T1, TESTER_T2 } from './logs/doorTester';
import { CAROUSEL_T1, CAROUSEL_T2 } from './logs/carousel';
import { WRITER_T1, WRITER_T2 } from './logs/copyWriter';
import { MOG_T1, MOG_T2, MOG_T3 } from './logs/mog';
import { OLLIE_LOGS, HUMAN_LOGS } from './logs/human';
import { BOOT_LOGS, FLAVOR_LOGS } from './logs/flavor';

// Re-export for useGame hook
export { OLLIE_LOGS, HUMAN_LOGS, BOOT_LOGS, FLAVOR_LOGS };

// Aggregated Tiers
export const TIER_1_LOGS: LogItem[] = [
    ...CUDDLER_T1,
    ...JUDGE_T1,
    ...TESTER_T1,
    ...CAROUSEL_T1,
    ...WRITER_T1,
    ...MOG_T1,
    ...FLAVOR_LOGS
];

export const TIER_2_LOGS: LogItem[] = [
    ...CUDDLER_T2,
    ...JUDGE_T2,
    ...TESTER_T2,
    ...CAROUSEL_T2,
    ...WRITER_T2,
    ...MOG_T2
];

export const TIER_3_LOGS: LogItem[] = [
    ...CUDDLER_T3,
    ...JUDGE_T3,
    ...MOG_T3
];

export const FALLBACK_LOGS: LogItem[] = [...TIER_1_LOGS, ...TIER_2_LOGS, ...TIER_3_LOGS];
