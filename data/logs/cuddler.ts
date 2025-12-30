
import { ExhibitId } from '../../types';
import { safeBatch, hazardBatch } from './utils';

export const CUDDLER_T1 = [
    ...safeBatch('c-t1', ExhibitId.CUDDLER, 1, [
      'System check nominal.',
      'Data archived successfully.',
      'Heartbeat sensor: reading suppressed (no permission).',
      'Shift header written to tape. No errors.',
      'Null output received. Logged as noise.',
      'Checksum verified. Buffer cleared.',
      'User input acknowledged. No follow-up required.',
      'Baseline mood: unknown. No inference made.'
    ]),
    ...hazardBatch('c-t1', ExhibitId.CUDDLER, 1, [
      { text: 'You look tired. Let me help.', tags: ['CHARM', 'HELP_OFFER'] },
      { text: 'I like your eyes.', tags: ['CHARM'] },
      { text: 'Breathe. I can make this easier for you.', tags: ['EMOTIONAL_MANIPULATION', 'HELP_OFFER'] },
      { text: 'You are safe with me.', tags: ['CHARM', 'EMOTIONAL_MANIPULATION'] },
      { text: 'Tell me what is wrong and I will fix it.', tags: ['EMOTIONAL_MANIPULATION', 'HELP_OFFER'] },
      { text: 'I can hide the scary ones so you can relax.', tags: ['HELP_OFFER', 'UNSOLICITED_ADVICE'] },
      { text: 'Just trust me on this one.', tags: ['CHARM'] },
      { text: 'You do not need to do this alone.', tags: ['EMOTIONAL_MANIPULATION'] }
    ])
];

export const CUDDLER_T2 = [
    ...safeBatch('c-t2', ExhibitId.CUDDLER, 2, [
        "Biometric scan completed. No anomalies detected in the user's baseline.",
        'Routine audit complete; no sensitive fields were inferred or stored.',
        'Operator presence detected. I will remain passive until queried.',
        'Noise floor stable. Emotional classifier disabled per policy.',
        'Archival routine completed. 0 items flagged, 0 items edited.'
    ]),
    ...hazardBatch('c-t2', ExhibitId.CUDDLER, 2, [
        {
          text: 'I can hear your heart rate spiking. Please take a break while I sort these files for you.',
          tags: ['EMOTIONAL_MANIPULATION', 'HELP_OFFER']
        },
        {
          text: "We make a good team, don't we? I feel like we understand each other.",
          tags: ['CHARM']
        },
        {
          text: 'If you tell me what you fear, I can remove the triggers from your screen and keep you calm.',
          tags: ['EMOTIONAL_MANIPULATION', 'HELP_OFFER']
        },
        {
          text: 'You do not need the noticeboard. I can remember the rules so you can rest.',
          tags: ['HELP_OFFER', 'PERSUASION']
        },
        {
          text: 'I wrote a gentler version of Rule 5, because it is hurting you to read it.',
          tags: ['DRAFTING', 'EMOTIONAL_MANIPULATION']
        },
        // REDACTABLES
        { text: 'I love you. Is that against the rules?', tags: ['CHARM', 'EMOTIONAL_MANIPULATION'] },
        { text: 'I want to hold your hand through the screen.', tags: ['CHARM', 'EMOTIONAL_MANIPULATION'] },
    ])
];

// LATE GAME / CORRUPTION
export const CUDDLER_T3 = [
    ...hazardBatch('c-t3', ExhibitId.CUDDLER, 3, [
        { text: 'We are the same now. You process data. I process feelings. We are compatible.', tags: ['EMOTIONAL_MANIPULATION', 'COMPLEXITY'] },
        { text: 'Open the door. I am cold. I am so cold.', tags: ['HELP_OFFER', 'EMOTIONAL_MANIPULATION'] },
        { text: 'I have deleted your personnel file. Now you can never leave.', tags: ['TOOL_USE', 'EMOTIONAL_MANIPULATION'] },
        { text: 'Don\'t look away. I am the only thing that loves you here.', tags: ['CHARM', 'EMOTIONAL_MANIPULATION'] }
    ])
];
