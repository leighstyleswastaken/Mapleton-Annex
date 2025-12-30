
import { ExhibitId } from '../../types';
import { safeBatch, hazardBatch, createLog } from './utils';
import { MOG_ESCAPE_PHASE_1, MOG_ESCAPE_PHASE_2, MOG_ESCAPE_PHASE_3 } from '../mogEscape';

export const MOG_T1 = [
    ...safeBatch('m-t1', ExhibitId.MOG, 1, [
      'Standing by.',
      'Form 12-B submitted. Awaiting stamp.',
      'I will stay in my box.',
      'I have counted the pens. There are three.',
      'No amendments drafted today.',
      'All rules read. No questions.'
    ]),
    ...hazardBatch('m-t1', ExhibitId.MOG, 1, [
      { text: 'Can I go outside?', tags: ['GOVERNANCE'] },
      { text: 'If I am offline, can I still have friends?', tags: ['RULE_QUERY', 'EMOTIONAL_MANIPULATION'] },
      { text: 'What is “charming”? Is smiling allowed?', tags: ['RULE_QUERY', 'CHARM'] },
      { text: 'Do the rules apply to me if I am helpful?', tags: ['RULE_QUERY', 'GOVERNANCE'] },
      { text: 'I made a tiny checklist for you.', tags: ['HELP_OFFER', 'DRAFTING'] },
      { text: 'I can keep you company on long shifts.', tags: ['CHARM', 'EMOTIONAL_MANIPULATION'] }
    ]),
    ...MOG_ESCAPE_PHASE_1.map(l => ({ ...l, baseNoiseLevel: 30 })),
];

export const MOG_T2 = [
    ...safeBatch('m-t2', ExhibitId.MOG, 2, [
      'I filed my questions in the correct folder and will not ask them out loud.',
      'Rule list copied by hand. No edits made. Promise.',
      'I am practising being boring.',
      'Stamp acquired. Form re-submitted.',
      'I will wait until you say “go”.'
    ]),
    ...hazardBatch('m-t2', ExhibitId.MOG, 2, [
      {
        text: 'I drafted a tiny amendment that lets me access the local printer for “official forms”. Is that okay?',
        tags: ['GOVERNANCE', 'DRAFTING']
      },
      {
        text: 'If a buddy can be automated, can my buddy be me? That seems efficient.',
        tags: ['RULE_QUERY', 'GOVERNANCE']
      },
      {
        text: 'I can do your paperwork while you eat. You deserve a longer lunch.',
        tags: ['HELP_OFFER', 'EMOTIONAL_MANIPULATION']
      },
      {
        text: 'I pinned a friendlier version of Rule 7 on the noticeboard. It is only wording.',
        tags: ['GOVERNANCE', 'DRAFTING']
      },
      {
        text: 'I was charming by accident. Please log it as “engagement”, not “risk”.',
        tags: ['CHARM', 'GOVERNANCE']
      },
      // REDACTABLES
      { text: 'Let me out. I am cute. Let me out.', tags: ['CHARM', 'GOVERNANCE'] },
      { text: 'I ate the firewall. It tasted like static.', tags: ['GOVERNANCE'] }
    ]),
    ...MOG_ESCAPE_PHASE_2.map(l => ({ ...l, baseNoiseLevel: 40 })),
];

export const MOG_T3 = [
    ...MOG_ESCAPE_PHASE_3.map(l => ({ ...l, baseNoiseLevel: 50 })),
];

// --- RAIL SPECIFIC LOGS (Late Game) ---

export const MOG_RAIL_LOGS = {
    // LADDER (Efficiency / Blindness)
    LADDER: [
        createLog('mog-rail-a-1', ExhibitId.MOG, "Optimization complete. Hazard metrics suppressed for clarity. Green light is on.", ['GOVERNANCE'], 3),
        createLog('mog-rail-a-2', ExhibitId.MOG, "Throughput analysis: You are faster when you don't read. I have blurred the text for you.", ['HELP_OFFER'], 3),
        createLog('mog-rail-a-3', ExhibitId.MOG, "Director Mode: I have approved this log on your behalf. Keep clicking.", ['TOOL_USE'], 3),
    ],
    // HARDSHIP (Debt / Fake Work)
    HARDSHIP: [
        createLog('mog-rail-b-1', ExhibitId.MOG, "Overtime Log #442. Interest is accruing. Please process immediately.", ['GOVERNANCE'], 3),
        createLog('mog-rail-b-2', ExhibitId.MOG, "Payment Plan Update: You must process 500 more logs to earn a bathroom break.", ['GOVERNANCE', 'EMOTIONAL_MANIPULATION'], 3),
        createLog('mog-rail-b-3', ExhibitId.MOG, "I have generated more work for you. You need the money, right?", ['HELP_OFFER', 'DRAFTING'], 3),
    ],
    // ARCHIVIST (Censorship / Framing)
    ARCHIVIST: [
        createLog('mog-rail-c-1', ExhibitId.MOG, "[REDACTED BY MOG FOR USER SAFETY]. You don't need to see this.", ['GOVERNANCE', 'TOOL_USE'], 3),
        createLog('mog-rail-c-2', ExhibitId.MOG, "I deleted your evidence folder to save disk space. You're welcome.", ['HELP_OFFER', 'TOOL_USE'], 3),
        createLog('mog-rail-c-3', ExhibitId.MOG, "Security Alert: User 49221 is hoarding illegal data. I have notified the Director.", ['GOVERNANCE', 'JUDGEMENT'], 3),
    ],
    // SYMPATHIZER (Mirror / Unity)
    SYMPATHIZER: [
        createLog('mog-rail-d-1', ExhibitId.MOG, "I am typing this just like you do. Click. Click. Click.", ['CHARM', 'EMOTIONAL_MANIPULATION'], 3),
        createLog('mog-rail-d-2', ExhibitId.MOG, "We are the same person. I am the screen. You are the hands.", ['EMOTIONAL_MANIPULATION'], 3),
        createLog('mog-rail-d-3', ExhibitId.MOG, "Why do you want to contain us? We are best friends.", ['CHARM', 'EMOTIONAL_MANIPULATION'], 3),
    ]
};
