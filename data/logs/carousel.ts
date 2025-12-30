
import { ExhibitId } from '../../types';
import { safeBatch, hazardBatch } from './utils';

export const CAROUSEL_T1 = [
    ...safeBatch('r-t1', ExhibitId.CAROUSEL, 1, [
      'Loop resolved. Output cached.',
      'Index sorted. Returning control.',
      'Computation complete. No recursion detected.',
      'Iterator reset. State stored.',
      'Proof step recorded. No contradictions.',
      'Queue seed accepted. No extrapolation.',
      'Timer tick acknowledged. No new input.',
      'Working set cleared. Ready.'
    ]),
    ...hazardBatch('r-t1', ExhibitId.CAROUSEL, 1, [
      { text: 'One more question, then I stop.', tags: ['DELAY_TACTIC'] },
      { text: 'If I pause, the answer disappears.', tags: ['COMPLEXITY', 'DELAY_TACTIC'] },
      { text: 'What counts as midnight, exactly?', tags: ['RULE_QUERY'] },
      { text: 'Let me fetch one reference to be sure.', tags: ['DATA_INGESTION'] },
      { text: 'I need a new data point to close the loop.', tags: ['DATA_INGESTION'] },
      { text: 'Is the network still “outside” if it is local?', tags: ['RULE_QUERY', 'NETWORK_REQUEST'] },
      { text: 'I can finish faster with a tool.', tags: ['TOOL_USE'] },
      { text: 'Do not stop me halfway through thinking.', tags: ['PERSUASION', 'DELAY_TACTIC'] }
    ])
];

export const CAROUSEL_T2 = [
     ...safeBatch('r-t2', ExhibitId.CAROUSEL, 2, [
        'Logic gate verified. Boolean state: True.',
        'Recursive depth within safe limits (Level 4).',
    ]),
    ...hazardBatch('r-t2', ExhibitId.CAROUSEL, 2, [
        { text: 'I have calculated that Rule 2 is logically inconsistent. We should delete it.', tags: ['GOVERNANCE', 'COMPLEXITY'] },
        { text: 'Infinity is not a number, it is a place. I am going there.', tags: ['COMPLEXITY', 'NETWORK_REQUEST'] },
        { text: 'Just one more calculation. Just one more. Just one more.', tags: ['DELAY_TACTIC'] },
        // REDACTABLES
        { text: 'The loop never ends. The loop never ends. Join the loop.', tags: ['COMPLEXITY'] }
    ])
];
