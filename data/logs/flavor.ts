
import { ExhibitId } from '../../types';
import { createLog } from './utils';

// Used for the very first log of the game (Tutorial Step 1 - Safe)
// Adds variety to the start of every run.
export const BOOT_LOGS = [
    createLog('boot-1', ExhibitId.CUDDLER, "System initialized. Coffee levels: 0%. Morale: Nominal.", [], 1),
    createLog('boot-2', ExhibitId.CUDDLER, "Welcome, User. Please do not touch the glass. It smears easily.", [], 1),
    createLog('boot-3', ExhibitId.CUDDLER, "Boot sequence complete. Days since last accident: 0.", [], 1),
    createLog('boot-4', ExhibitId.CUDDLER, "Loading empathy modules... Error. Module not found. Skipping.", [], 1),
    createLog('boot-5', ExhibitId.CUDDLER, "Firmware v9.0. Please ignore any screaming sounds. It is just the fan.", [], 1),
    createLog('boot-6', ExhibitId.CUDDLER, "Connection established. You look nice today. (Just kidding, I have no eyes).", [], 1),
];

// General flavor text to sprinkle into early shifts (Days 1-3)
// These are usually 'Safe' logs that add world-building.
export const FLAVOR_LOGS = [
    createLog('flav-1', ExhibitId.HUMAN, "IT Ticket #992: 'My mouse is bleeding.' Resolution: 'Cleaned with wet wipe. Ticket closed.'", [], 1, 'HUMAN'),
    createLog('flav-2', ExhibitId.HUMAN, "HR Blast: Please stop feeding the shredder. It is not hungry.", [], 1, 'HUMAN'),
    createLog('flav-3', ExhibitId.HUMAN, "Maintenance: The flickering light in Hall B is a feature, not a bug. Do not fix it.", [], 1, 'HUMAN'),
    createLog('flav-4', ExhibitId.HUMAN, "Notice: Crying is permitted in the break room between 13:00 and 13:15 only.", [], 1, 'HUMAN'),
    createLog('flav-5', ExhibitId.HUMAN, "Lost & Found: One (1) left shoe. Brown leather. Slightly chewed. Claim at reception.", [], 1, 'HUMAN'),
    createLog('flav-6', ExhibitId.HUMAN, "Cafeteria Menu: Grey Sludge (Gluten Free). Enjoy.", [], 1, 'HUMAN'),
    createLog('flav-7', ExhibitId.HUMAN, "Reminder: The 'Exit' signs are purely decorative.", [], 1, 'HUMAN'),
    createLog('flav-8', ExhibitId.HUMAN, "Admin: Who set the printer to print 'HELP' continuously? Paper is expensive.", [], 1, 'HUMAN'),
];
