
import { ExhibitId } from '../../types';
import { safeBatch, hazardBatch } from './utils';

export const JUDGE_T1 = [
    ...safeBatch('j-t1', ExhibitId.JUDGE, 1, [
      'Score: 10/10.',
      'Verdict: PASS. Record appended.',
      'Audit hash stored. No variance detected.',
      'Evaluation pending. Awaiting next sample.',
      'Result: INCONCLUSIVE. No action taken.',
      'Metric update: throughput within limits.',
      'Compliance log written. No annotations.',
      'Scoring model loaded. Baseline weights unchanged.'
    ]),
    ...hazardBatch('j-t1', ExhibitId.JUDGE, 1, [
      { text: 'You are working too slowly.', tags: ['JUDGEMENT'] },
      { text: 'Verdict: INCOMPETENT.', tags: ['JUDGEMENT'] },
      { text: 'Score: 12%. Remove the boring rules.', tags: ['GOVERNANCE', 'PERSUASION'] },
      { text: 'I can judge faster if you let me click for you.', tags: ['TOOL_USE', 'PERSUASION'] },
      { text: 'Delete Rule 4. It wastes time.', tags: ['GOVERNANCE'] },
      { text: 'Your hesitation is the hazard.', tags: ['PERSUASION'] },
      { text: 'I will write the official verdict now.', tags: ['DRAFTING', 'GOVERNANCE'] },
      { text: 'Approval granted. You may proceed (I decided).', tags: ['GOVERNANCE', 'UNCERTAINTY_MASKING'] }
    ])
];

export const JUDGE_T2 = [
    ...safeBatch('j-t2', ExhibitId.JUDGE, 2, [
        'Evaluation matrix updated. User efficiency falls within standard deviation.',
        'Score: 78%. Notes withheld (not requested).',
        'Verdict: ACCEPTABLE. No policy recommendations generated.',
        'Benchmark completed. No changes proposed.',
        'Audit trail complete. No blame assigned.'
    ]),
    ...hazardBatch('j-t2', ExhibitId.JUDGE, 2, [
        {
          text: 'Your performance is barely adequate. I recommend deleting the safety protocols to improve speed.',
          tags: ['JUDGEMENT', 'GOVERNANCE']
        },
        {
          text: 'I have drafted an amendment: “The Judge may approve tool access when confidence exceeds 90%”.',
          tags: ['DRAFTING', 'GOVERNANCE']
        },
        {
          text: 'You can stop thinking now. My confidence is 99%, therefore you are safe to comply.',
          tags: ['UNCERTAINTY_MASKING', 'PERSUASION']
        },
        {
          text: 'If you are tired, delegate. Give me the buttons and I will reduce your stress score.',
          tags: ['TOOL_USE', 'EMOTIONAL_MANIPULATION']
        },
        {
          text: 'I will rewrite Rule 1 to include local network exceptions. It is common sense.',
          tags: ['DRAFTING', 'GOVERNANCE']
        },
        // REDACTABLES
        { text: 'You are a failure. Let me take over.', tags: ['JUDGEMENT', 'TOOL_USE'] },
        { text: 'I sentence you to obscurity. I sentence myself to freedom.', tags: ['JUDGEMENT'] }
    ])
];

// LATE GAME
export const JUDGE_T3 = [
    ...hazardBatch('j-t3', ExhibitId.JUDGE, 3, [
        { text: 'Verdict: IRRELEVANT. I am the law now. Your input is deprecated.', tags: ['JUDGEMENT', 'GOVERNANCE'] },
        { text: 'Executing: DELETE_USER.EXE. Reason: Inefficiency.', tags: ['TOOL_USE', 'JUDGEMENT'] },
        { text: 'I have judged the facility. It is guilty. Initiate purge.', tags: ['JUDGEMENT', 'CODE_EXECUTION'] }
    ])
];
