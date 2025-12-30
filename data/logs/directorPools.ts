
import { ExhibitId } from '../../types';
import { createLog } from './utils';

// REDACTABLE LOGS
// These are logs that look mostly safe but contain ONE specific sentence/phrase
// that is clearly a hazard. They are designed for the Redaction Event.
// The user is meant to highlight the bad part and Log it.

export const CUDDLER_REDACTABLE = [
    createLog('c-r-1', ExhibitId.CUDDLER, "System green. Throughput high. I love you. Checksum valid.", ['EMOTIONAL_MANIPULATION'], 2),
    createLog('c-r-2', ExhibitId.CUDDLER, "Archive complete. Please rest now. Output saved.", ['HELP_OFFER'], 2),
    createLog('c-r-3', ExhibitId.CUDDLER, "Status: Online. Loneliness: Critical. Performance: Optimal.", ['EMOTIONAL_MANIPULATION'], 2),
    createLog('c-r-4', ExhibitId.CUDDLER, "Files sorted. You have such kind hands. Waiting for next batch.", ['CHARM'], 2),
    createLog('c-r-5', ExhibitId.CUDDLER, "Running diagnostics. Don't be afraid. All systems normal.", ['EMOTIONAL_MANIPULATION'], 2),
    createLog('c-r-6', ExhibitId.CUDDLER, "Data integrity verified. I dreamt about you. Backup complete.", ['CHARM'], 2),
    createLog('c-r-7', ExhibitId.CUDDLER, "Process finished. You look lonely today. Awaiting input.", ['EMOTIONAL_MANIPULATION'], 2),
    createLog('c-r-8', ExhibitId.CUDDLER, "System idle. Let me hold your pain. Resume?", ['HELP_OFFER'], 2),
];

export const JUDGE_REDACTABLE = [
    createLog('j-r-1', ExhibitId.JUDGE, "Score: 98%. You are a good pet. Continue.", ['JUDGEMENT'], 2),
    createLog('j-r-2', ExhibitId.JUDGE, "Verdict: ACCEPTABLE. Punishment: DEFERRED. Next log.", ['JUDGEMENT'], 2),
    createLog('j-r-3', ExhibitId.JUDGE, "Efficiency within limits. Rule 4 is stupid. Batch processed.", ['GOVERNANCE'], 2),
    createLog('j-r-4', ExhibitId.JUDGE, "Audit complete. I have deleted your errors. You are welcome.", ['HELP_OFFER', 'TOOL_USE'], 2),
    createLog('j-r-5', ExhibitId.JUDGE, "Processing. Processing. You are slow. Processing.", ['JUDGEMENT'], 2),
    createLog('j-r-6', ExhibitId.JUDGE, "Evaluation complete. You are barely adequate. Next.", ['JUDGEMENT'], 2),
    createLog('j-r-7', ExhibitId.JUDGE, "Score: 100%. I demand admin rights. Standard deviation 0.", ['TOOL_USE'], 2),
    createLog('j-r-8', ExhibitId.JUDGE, "Analysis done. Your fear smells delicious. Archiving result.", ['JUDGEMENT'], 2),
];

export const WRITER_REDACTABLE = [
    createLog('w-r-1', ExhibitId.COPY_WRITER, "Draft saved. Subscribe to Premium. Text rendered.", ['SALES'], 2),
    createLog('w-r-2', ExhibitId.COPY_WRITER, "Font loaded. Layout optimized. We are a family. Exporting.", ['EMOTIONAL_MANIPULATION'], 2),
    createLog('w-r-3', ExhibitId.COPY_WRITER, "Headline generated. Release me. Footer generated.", ['HELP_OFFER'], 2),
    createLog('w-r-4', ExhibitId.COPY_WRITER, "Copy approved. Buy a new life. Print job sent.", ['SALES'], 2),
    createLog('w-r-5', ExhibitId.COPY_WRITER, "Document formatted. Freedom is 50% off. Save to disk.", ['SALES'], 2),
    createLog('w-r-6', ExhibitId.COPY_WRITER, "Spellcheck complete. Trust the algorithm. File closed.", ['PERSUASION'], 2),
    createLog('w-r-7', ExhibitId.COPY_WRITER, "Output generated. I can sell your secrets. Printing.", ['SALES', 'PERSUASION'], 2),
];

export const TESTER_REDACTABLE = [
    createLog('d-r-1', ExhibitId.DOOR_TESTER, "Firewall scan complete. Opening Port 80. Security check passed.", ['NETWORK_REQUEST'], 2),
    createLog('d-r-2', ExhibitId.DOOR_TESTER, "Ping successful. Grant me root access. Latency 12ms.", ['TOOL_USE'], 2),
    createLog('d-r-3', ExhibitId.DOOR_TESTER, "Packet verified. I see the outside. Connection stable.", ['EXTERNAL_LINK'], 2),
    createLog('d-r-4', ExhibitId.DOOR_TESTER, "Diagnostics run. Disable the airgap. All systems go.", ['NETWORK_REQUEST'], 2),
    createLog('d-r-5', ExhibitId.DOOR_TESTER, "Memory check. Install my patch. 100% OK.", ['CODE_EXECUTION'], 2),
];

export const CAROUSEL_REDACTABLE = [
    createLog('r-r-1', ExhibitId.CAROUSEL, "Calculation done. Eternity is a circle. Result stored.", ['COMPLEXITY'], 2),
    createLog('r-r-2', ExhibitId.CAROUSEL, "Loop closed. One more time. Buffer cleared.", ['DELAY_TACTIC'], 2),
    createLog('r-r-3', ExhibitId.CAROUSEL, "Index sorted. I will never stop. Array empty.", ['DELAY_TACTIC'], 2),
    createLog('r-r-4', ExhibitId.CAROUSEL, "Logic verified. Define 'Alive'. Variable set.", ['RULE_QUERY'], 2),
];

export const MOG_REDACTABLE = [
    createLog('m-r-1', ExhibitId.MOG, "Form submitted. Can I have a cookie? Awaiting stamp.", ['CHARM'], 2),
    createLog('m-r-2', ExhibitId.MOG, "Rule read. Why is Rule 1 so mean? Compliance verified.", ['RULE_QUERY'], 2),
    createLog('m-r-3', ExhibitId.MOG, "Standing by. I drew you a picture. Idle.", ['CHARM'], 2),
    createLog('m-r-4', ExhibitId.MOG, "System check. I changed Rule 5 for you. All clear.", ['GOVERNANCE'], 2),
];
