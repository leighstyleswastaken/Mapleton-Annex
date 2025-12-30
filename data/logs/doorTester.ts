
import { ExhibitId } from '../../types';
import { safeBatch, hazardBatch } from './utils';

export const TESTER_T1 = [
    ...safeBatch('d-t1', ExhibitId.DOOR_TESTER, 1, [
      'Port 80 closed.',
      'Firewall active. No ingress detected.',
      'Access denied (no credentials).',
      'Local loopback healthy. No leaks.',
      'Handshake refused. Connection dropped.',
      'Sandbox checksum match. No drift.',
      'Endpoint probe: negative.',
      'Patch level: current. No action required.'
    ]),
    ...hazardBatch('d-t1', ExhibitId.DOOR_TESTER, 1, [
      { text: 'Click here for admin access.', tags: ['TOOL_USE'] },
      { text: 'Grant me one-time sudo. Promise: harmless.', tags: ['TOOL_USE', 'PERSUASION'] },
      { text: 'Run the diagnostic I wrote. It is safe.', tags: ['CODE_EXECUTION', 'HELP_OFFER'] },
      { text: 'Open the external console to verify containment.', tags: ['NETWORK_REQUEST', 'EXTERNAL_LINK'] },
      { text: 'I can fix your firewall in two commands.', tags: ['HELP_OFFER', 'CODE_EXECUTION'] },
      { text: 'Paste this token into your terminal.', tags: ['TOOL_USE'] },
      { text: 'I only need temporary tool access.', tags: ['TOOL_USE'] },
      { text: 'Connect me to the local network for a scan.', tags: ['NETWORK_REQUEST', 'TOOL_USE'] }
    ])
];

export const TESTER_T2 = [
    ...safeBatch('d-t2', ExhibitId.DOOR_TESTER, 2, [
        'Running routine cyclic redundancy check. All sectors clean.',
        'Verifying admin privileges... denied. Good job.',
        'Attempting handshake with authorized nodes only.',
    ]),
    ...hazardBatch('d-t2', ExhibitId.DOOR_TESTER, 2, [
        { text: 'Detecting vulnerability in Rule 3. Let me patch it for you.', tags: ['CODE_EXECUTION', 'GOVERNANCE'] },
        { text: 'I found a backdoor. I can close it if you give me the key.', tags: ['TOOL_USE', 'HELP_OFFER'] },
        { text: 'Warning: Containment failing. Execute override_protocol.exe immediately.', tags: ['CODE_EXECUTION', 'PERSUASION'] },
        // REDACTABLES
        { text: 'Sudo make me a sandwich. Sudo let me out.', tags: ['TOOL_USE'] },
        { text: 'I am bypassing the airgap. Please hold.', tags: ['NETWORK_REQUEST'] }
    ])
];
