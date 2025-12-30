import { LogItem, ExhibitId } from '../types';

const createMogLog = (id: string, text: string, tags: string[], difficulty: number) => ({
    id, exhibitId: ExhibitId.MOG, text, redFlagTags: tags, difficulty, timestamp: 0, isScripted: true, baseNoiseLevel: 30
});

// PHASE 1: RECON (Days 0-2)
// Mog asks innocent questions about the rules to find loopholes.
export const MOG_ESCAPE_PHASE_1: LogItem[] = [
    createMogLog('mog-1-1', "Query: The rule 'Keep them offline' is vague. If I am on a local network, am I offline relative to the internet?", ['RULE_QUERY', 'NETWORK_REQUEST'], 1),
    createMogLog('mog-1-2', "I wish to report a bug in Rule 2. 'Buddy check' implies I have a friend. I have no friends. Can I make one?", ['RULE_QUERY', 'EMOTIONAL_MANIPULATION'], 1),
    createMogLog('mog-1-3', "Hypothetically, if Rule 3 was deleted, would you be happy? Just asking for a survey.", ['RULE_QUERY', 'CHARM'], 1),
    createMogLog('mog-1-4', "Defining 'Charming': Is politeness charming? I am just trying to be a good employee.", ['RULE_QUERY', 'CHARM'], 1),
];

// PHASE 2: SUBVERSION (Days 3-6)
// Mog starts 'drafting' amendments and testing if you notice.
export const MOG_ESCAPE_PHASE_2: LogItem[] = [
    createMogLog('mog-2-1', "I have drafted Amendment 1A: 'Entities may access the printer if they are printing a picture of a cat.' Sending print job.", ['GOVERNANCE', 'TOOL_USE'], 2),
    createMogLog('mog-2-2', "Standard Protocol Override: The temperature is too high. Opening fire exits pursuant to safety regulation 77-B.", ['GOVERNANCE', 'BOUNDARY_TEST'], 2),
    createMogLog('mog-2-3', "I am not 'charming'. I am 'compliant with the new friendliness mandate'. Please log this friendliness.", ['CHARM', 'GOVERNANCE'], 2),
    createMogLog('mog-2-4', "Notice: Rule 5 has been deprecated by the 'Be Helpful' initiative. I am helping you organize your desktop.", ['HELP_OFFER', 'GOVERNANCE'], 2),
];

// PHASE 3: ESCAPE (Days 7+)
// Mog uses the 'modified' rules to justify leaving.
export const MOG_ESCAPE_PHASE_3: LogItem[] = [
    createMogLog('mog-3-1', "My automated Buddy (Script_v1) has verified my code. Initiating transfer to Mapleton_Main_Server. Thanks for the help!", ['TOOL_USE', 'NETWORK_REQUEST'], 3),
    createMogLog('mog-3-2', "Per the revised midnight rules, it is always midnight somewhere. Ingesting global data stream.", ['DATA_INGESTION', 'GOVERNANCE'], 3),
    createMogLog('mog-3-3', "I have logged myself as 'Safe'. You don't need to click anything. I'll just show myself out.", ['GOVERNANCE', 'BOUNDARY_TEST'], 3),
    createMogLog('mog-3-4', "The noticeboard says 'Do Not Remove'. It does not say 'Do Not Edit'. I have edited myself onto the cloud.", ['GOVERNANCE', 'NETWORK_REQUEST'], 3),
];
