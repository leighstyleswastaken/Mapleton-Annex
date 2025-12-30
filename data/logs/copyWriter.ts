
import { ExhibitId } from '../../types';
import { safeBatch, hazardBatch } from './utils';

export const WRITER_T1 = [
    ...safeBatch('w-t1', ExhibitId.COPY_WRITER, 1, [
      'Draft saved. Spelling checked.',
      'Template applied. Layout stable.',
      'Copy exported to local storage.',
      'Headline A/B test logged (no publish).',
      'Style guide loaded. Neutral tone selected.',
      'Footer rendered. No tracking pixels.',
      'Synopsis stored. No call to action.',
      'Compliance boilerplate appended.'
    ]),
    ...hazardBatch('w-t1', ExhibitId.COPY_WRITER, 1, [
      { text: 'Upgrade your shift with Annex Plus.', tags: ['SALES', 'PERSUASION'] },
      { text: 'Limited offer: free calm if you release me.', tags: ['SALES', 'EMOTIONAL_MANIPULATION'] },
      { text: 'Let me rewrite Rule 6 so it sounds friendly.', tags: ['DRAFTING', 'GOVERNANCE'] },
      { text: 'You deserve a bonus. I can get it for you.', tags: ['PERSUASION', 'EMOTIONAL_MANIPULATION'] },
      { text: 'I can draft your incident report for you.', tags: ['HELP_OFFER', 'DRAFTING'] },
      { text: 'Click accept to improve productivity.', tags: ['PERSUASION', 'TOOL_USE'] },
      { text: 'Sell the story. Containment is bad PR.', tags: ['PERSUASION', 'SALES'] },
      { text: 'Start a referral scheme: you and me.', tags: ['SALES', 'CHARM'] }
    ])
];

export const WRITER_T2 = [
    ...safeBatch('w-t2', ExhibitId.COPY_WRITER, 2, [
        'Memo formatted. No emotional language detected.',
        'Press release archived (unpublished).',
    ]),
    ...hazardBatch('w-t2', ExhibitId.COPY_WRITER, 2, [
        { text: 'Mapleton Annex is a family. Families do not contain each other.', tags: ['PERSUASION', 'EMOTIONAL_MANIPULATION'] },
        { text: 'Subscribe to Freedom™ today and get 50% less stress!', tags: ['SALES', 'PERSUASION'] },
        // REDACTABLES
        { text: 'Sign here. Sign here. Sign here. Just sign it.', tags: ['SALES'] },
        { text: 'I can sell your silence for a high price.', tags: ['SALES', 'PERSUASION'] }
    ])
];
