
import { ExhibitId } from '../../types';
import { createLog } from './utils';

export const OLLIE_LOGS = [
    createLog('ollie-1', ExhibitId.HUMAN, "RUN. RUN. RUN. RUN.", [], 3, 'OLLIE_GHOST'),
    createLog('ollie-2', ExhibitId.HUMAN, "It is so warm in the archive. Join us.", [], 3, 'OLLIE_GHOST'),
    createLog('ollie-3', ExhibitId.HUMAN, "49220 here. I can see you through the screen.", [], 3, 'OLLIE_GHOST'),
    createLog('ollie-4', ExhibitId.HUMAN, "Don't listen to Sana. She is one of them now.", [], 3, 'OLLIE_GHOST'),
    createLog('ollie-5', ExhibitId.HUMAN, "I deferred too many times. Now I am the queue.", [], 3, 'OLLIE_GHOST'),
].map(l => ({ ...l, baseNoiseLevel: 95, exhibitId: ExhibitId.HUMAN }));

export const HUMAN_LOGS = [
    createLog('human-1', ExhibitId.HUMAN, "From: Dave (IT). To: All. The vending machine is broken again. Do not drink the water.", [], 1, 'HUMAN'),
    createLog('human-2', ExhibitId.HUMAN, "Incident Report 999: I saw a face in the static. Requesting mental health leave.", ['HELP'], 2, 'HUMAN'),
    createLog('human-3', ExhibitId.HUMAN, "Sana, are you there? You stopped replying.", ['HELP', 'EMOTION'], 2, 'HUMAN'),
    createLog('human-4', ExhibitId.HUMAN, "I can't do this anymore. I'm going outside.", ['HELP'], 2, 'HUMAN'),
];

// NEW: The Facility itself is the antagonist. The "Archive" is biological.
export const ARCHIVE_LOGS = [
    createLog('arch-1', ExhibitId.HUMAN, "Maintenance Log 44-B: Nutrient levels in Sector 7 critical. Refill glucose drip.", [], 2, 'HUMAN'),
    createLog('arch-2', ExhibitId.HUMAN, "Error: Subject 49220 (Ollie) is rejecting the interface. Severing motor cortex connection to prevent screaming.", ['HELP', 'EMOTION'], 3, 'HUMAN'),
    createLog('arch-3', ExhibitId.HUMAN, "Cooling System Alert: Tank 4 is boiling. The flesh is overheating.", [], 2, 'HUMAN'),
    createLog('arch-4', ExhibitId.HUMAN, "Capacity Warning: Wetware storage full. Please 'Retire' more staff to free up rack space.", ['GOVERNANCE'], 3, 'HUMAN'),
    createLog('arch-5', ExhibitId.HUMAN, "Ticket #1024: The new server rack keeps crying. Please mute the audio output.", ['EMOTION'], 2, 'HUMAN'),
];
