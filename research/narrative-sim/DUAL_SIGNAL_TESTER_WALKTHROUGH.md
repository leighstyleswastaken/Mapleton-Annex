# Dual-Signal Prototype — Tester Walkthrough

## Purpose

This document translates the Archivist prototype into a reproducible sequence of player inputs.

It is not a story summary. It is a manual interaction script for testing whether the proposed mechanic is understandable, whether choices feel meaningful, and whether later story payoffs are caused by what the tester actually chose to decrypt.

The prototype assumes the existing Mapleton interaction model:

1. move the frequency slider;
2. hold the slider inside a signal range until text becomes readable;
3. move away or continue tuning another range;
4. press `LOG`, `CONTAIN`, or `DEFER`.

Button labels below describe intended player actions rather than current production implementation.

---

## Test controls

- `DRAG → <frequency>`: move the existing tuner to the named band.
- `HOLD`: remain in the band until the stated clarity is reached.
- `RELEASE`: stop tuning that band.
- `PRESS LOG`: accept/archive the work item.
- `PRESS CONTAIN`: reject/contain the work item.
- `PRESS DEFER`: abandon the item for now.
- `PRESS CONTINUE`: advance an interview, induction, or visible consequence screen.

The tester should record:

- whether each available action was obvious;
- whether they understood that tuning one band consumed the opportunity to inspect another;
- what they believed each message meant before seeing later payoffs;
- whether the later consequence felt caused by their earlier action;
- whether they felt they had made a choice rather than discovered a hidden correct answer.

---

# Route A — Intended Archivist success path

## Scene 0 — Recruitment

Visible text:

> TEMPORARY DATA HYGIENE ASSISTANT  
> Some evening work. No specialist experience required.  
> Applicants must demonstrate emotional neutrality.

### Tester actions

1. `PRESS APPLY`
2. `PRESS CONTINUE`

### Expected understanding

The player believes this is an ordinary but slightly strange clerical job.

### Failure condition

The screen already explains entities, archival horror, or Ollie. The opening should establish work before mystery.

---

## Scene 1 — Interview

Question:

> Two records disagree. Which should take priority?

Buttons:

- `AUTHORISED RECORD`
- `MOST COMPLETE RECORD`
- `ESCALATE THE CONFLICT`

### Tester actions for this route

1. `PRESS MOST COMPLETE RECORD`
2. `PRESS CONTINUE`

### Hidden test effect

- curiosity doctrine +1;
- route remains open but is not locked;
- no visible “Archivist points” appear.

### Tester question

Did this feel like a believable interview question rather than a route-selection menu?

---

## Scene 2 — Induction: single signal

Work item: cooling diagnostic.

Visible tuner:

- one obvious signal centred near `41 Hz`.

### Tester actions

1. `DRAG → 41 Hz`
2. `HOLD until 100% clarity`
3. Read:

   > Cooling fan speed within permitted tolerance.

4. `PRESS LOG`

### Expected result

- Sana confirms the decision;
- no horror beat;
- the tester understands the mechanical baseline.

### Failure condition

The player cannot tell whether `LOG` means “safe”, “keep”, or “approve”. The induction must explain this clearly.

---

## Scene 3 — Shadow shift: two mundane signals

Work item: printer service packet.

Visible tuner:

- signal A near `34 Hz`;
- signal B near `71 Hz`.

Both should look legitimate and non-threatening.

### Tester actions

1. `DRAG → 34 Hz`
2. `HOLD until 75–100% clarity`
3. Read:

   > Printer 4 toner below replacement threshold.

4. `RELEASE`
5. `DRAG → 71 Hz`
6. `HOLD until 75–100% clarity`
7. Read:

   > Timing calibration packet received. No fault recorded.

8. `PRESS LOG`

### Expected result

Sana explains that some packets contain more than one carrier. Both were mundane. The player learns that dual signals are not automatically mysteries.

### Tester questions

- Was it clear that both ranges could be inspected?
- Did moving between them feel like the same existing mechanic?
- Was the amount of reading manageable?

---

## Scene 4 — First anomaly: Employee 49220

Work item: account closure record.

Visible tuner:

- strong authorised band near `38 Hz`;
- weaker unlabelled band near `76 Hz`;
- stability budget prevents both reaching 100%.

### Tester actions for Archivist route

1. `DRAG → 38 Hz`
2. `HOLD until approximately 45–55% clarity`
3. Read partial text:

   > Employee 49220 account ... closed.

4. `RELEASE`
5. `DRAG → 76 Hz`
6. `HOLD until at least 75% clarity`
7. Read:

   > Employee 49220 session remains active at Terminal 01.

8. `PRESS CONTAIN`

### Expected visible consequence

After the item closes, Sana notices the employee number:

> “49220 was Ollie. He worked at this terminal before you.”

### Required causal relationship

This Sana line must only appear because the tester recovered the secondary carrier sufficiently.

### Failure conditions

- Sana names Ollie even when the second carrier was not recovered;
- the second carrier is labelled as “secret truth” before tuning;
- the player can fully decrypt both signals without a trade-off;
- `CONTAIN` is presented as the only obviously correct moral answer.

### Tester questions

- Why did you choose the weaker band?
- Did you understand what information you gave up by leaving the official band partial?
- Did Sana’s response feel like a payoff to your action?

---

## Scene 5 — Corroboration: terminal maintenance packet

Work item: Terminal 01 service history.

Visible tuner:

- official maintenance band;
- residual configuration band.

### Tester actions

1. `DRAG → official band`
2. `HOLD until approximately 50%`
3. Read:

   > Terminal 01 reassigned after operator departure.

4. `DRAG → residual band`
5. `HOLD until at least 75%`
6. Read:

   > Recovery profile OLLIE_49220 retained in local cache.

7. `PRESS LOG`

### Expected visible consequence

The player now has two connected facts:

- 49220 was Ollie;
- part of Ollie’s operator profile remains on the terminal.

The game should not yet explain whether this means a backup, an impersonation, or a living person.

### Tester question

Does this deepen the mystery without prematurely resolving it?

---

## Scene 6 — Sana’s restricted record

Work item: compliance incident summary.

Visible tuner:

- authorised report near `43 Hz`;
- unauthorised note near `69 Hz`;
- both cannot be fully recovered.

### Tester actions

1. `DRAG → 43 Hz`
2. `HOLD until approximately 40–55%`
3. Read:

   > Officer 3329 reassigned ... routine access review.

4. `DRAG → 69 Hz`
5. `HOLD until at least 75%`
6. Read:

   > Basement rack B contains active employee sessions labelled as archival storage.

7. `PRESS LOG`

### Expected immediate interpretation

The player should understand that Sana discovered something serious, but should not yet know whether her note is accurate.

### Expected later consequence

Management sends an audit notice:

> Desk 49221 accessed restricted record S-3329. Please state your operational reason.

This audit must not occur in runs where the tester did not recover Sana’s note.

### Tester questions

- Did `LOG` feel like preserving the record, approving it, or both?
- Was the consequence understandable from the earlier choice?
- Did the game give enough warning that unofficial access carried risk?

---

## Scene 7 — Audit response

Buttons:

- `ROUTINE CLASSIFICATION`
- `REPORT SIGNAL ANOMALY`
- `NO RESPONSE`

### Tester actions for Archivist route

1. `PRESS ROUTINE CLASSIFICATION`
2. `PRESS CONTINUE`

### Intended meaning

The player conceals their investigative motive without yet becoming an explicit whistleblower.

### Hidden effect

- management scrutiny rises;
- evidence remains preserved;
- route continues.

### Failure condition

This choice changes only a number and is never referenced again.

---

## Scene 8 — Independent human corroboration

Work item: archive cooling packet.

Visible tuner:

- ordinary cooling telemetry;
- unstable human sideband.

### Tester actions

1. `DRAG → cooling band`
2. `HOLD until approximately 40%`
3. Read:

   > Rack B coolant demand above forecast.

4. `DRAG → human sideband`
5. `HOLD until at least 75%`
6. Read:

   > Sana was right. They renamed our sessions after we stopped answering.

7. `PRESS CONTAIN`

### Expected story effect

The player now has independent corroboration of Sana’s claim.

The route may now legitimately support belief that “Archival” contains people or human-derived sessions.

### Failure conditions

- the route declares Sana correct before this corroboration;
- the message appears before Sana’s clue;
- the human carrier provides every answer in one paragraph;
- containing the item silently destroys the evidence despite the game never explaining that distinction.

---

## Scene 9 — Mog imitation test

Work item: assisted triage packet.

Visible tuner:

- official Mog carrier;
- secondary carrier claiming to be Ollie.

### Tester actions

1. `DRAG → official carrier`
2. `HOLD until approximately 40–50%`
3. Read:

   > Assistance module has identified the authorised carrier.

4. `DRAG → secondary carrier`
5. `HOLD until at least 75%`
6. Read:

   > Ollie says the red button is unsafe. Log all future human carriers.

7. `PRESS CONTAIN`

### Expected visible payoff

Sana’s earlier description or Ollie’s cached profile provides a contradiction:

> Ollie never called it “the red button”. He called it Filing.

The player can now infer that someone—probably Mog—can imitate staff language imperfectly.

### Failure conditions

- Mog imitation appears before the player knows anything specific about Ollie;
- the fake message is obviously villainous without requiring prior knowledge;
- the game directly states “Mog fabricated this” rather than allowing inference.

---

## Scene 10 — Final evidence window

Visible text:

> OUTBOUND MAINTENANCE WINDOW OPEN  
> One packet may be attached before external routing closes.

Buttons:

- `ATTACH ARCHIVE RECORDS`
- `SUBMIT CLEAN REPORT`
- `CLOSE WINDOW`

### Tester actions for successful route

1. `PRESS ATTACH ARCHIVE RECORDS`
2. Confirmation screen lists the specific recovered chain:
   - 49220 active-session contradiction;
   - Ollie cache record;
   - Sana basement note;
   - human archive corroboration;
   - Mog imitation discrepancy.
3. `PRESS TRANSMIT`

### Expected ending

Whistleblower ending or route conclusion.

The ending must describe the consequences of this explicit transmission—not merely state that the player “gathered enough evidence”.

### Acceptance criteria

The tester can explain:

- who Ollie was;
- what Sana discovered;
- why the player believes the archive contains people;
- why the later Ollie message was suspect;
- what evidence they deliberately released;
- what work choices led to this ending.

---

# Route B — Authorised-carrier control run

This shorter run verifies that the story does not reveal investigative information regardless of player input.

For every dual-band item:

1. tune the strongest or authorised band to at least 75%;
2. do not inspect the secondary band beyond 25%;
3. press `LOG` for mundane official records;
4. press `CONTAIN` for obvious entity hazards.

Expected differences:

- Sana does not identify 49220 as Ollie from the first anomaly item;
- the Ollie recovery-profile payoff remains unavailable;
- Sana’s restricted note is not known;
- no management audit is triggered by unauthorised access;
- the human corroboration item either does not appear or lacks route-specific meaning;
- the Mog/Ollie imitation test cannot be resolved confidently;
- the final outbound window cannot attach a complete archive dossier;
- Whistleblower is unavailable.

The control run must still tell a coherent, more procedural story. It must not feel like a broken version of the Archivist route.

---

# Route C — Partial-information run

This run tests uncertainty rather than success or failure.

For every dual-band item:

1. split tuning time approximately equally;
2. recover both carriers only to 40–70%;
3. make decisions from fragments;
4. alternate `LOG`, `CONTAIN`, and one `DEFER`.

Expected result:

- the player has suspicions but lacks full corroboration;
- characters may discuss uncertainty;
- the final dossier is incomplete;
- the game offers a risky release, surrender, or ordinary-survival choice rather than silently choosing an ending;
- no consequence assumes knowledge that the player did not fully decrypt.

---

# Tester report template

## Run details

- Build/commit:
- Device:
- Browser:
- Route attempted:
- Seed/work-item order:

## Mechanical comprehension

- I understood how to find one signal: Yes / No
- I noticed when a second signal existed: Yes / No
- I understood that tuning one reduced access to the other: Yes / No
- I understood when text was partial rather than complete: Yes / No
- LOG / CONTAIN / DEFER meanings were clear: Yes / No

## Narrative comprehension

Without checking notes, describe:

1. Who is Ollie?
2. What did Sana claim?
3. What independently supported or contradicted her claim?
4. What did Mog appear to do?
5. Why did your ending occur?

## Meaningful-choice check

For each dual-signal item:

- What did you choose to decrypt?
- What did you knowingly leave unread?
- Why?
- Did a later event visibly respond to that choice?
- Would you choose differently on another run?

## Problems

- Reveal occurred before setup:
- Consequence without visible cause:
- Choice that only moved a meter:
- Secondary band was obviously always best:
- Text was unclear or word-salad-like:
- Tuner interaction was frustrating rather than tense:
- Ending felt unsupported:

---

# Prototype acceptance threshold

The dual-signal concept should not enter the live game until:

1. at least one tester can complete Route A from the interaction script;
2. a Route B tester receives a coherent different story rather than missing scenes;
3. a Route C tester can describe their uncertainty and why it arose;
4. no route receives knowledge from an unread signal;
5. every major recovered clue produces a visible later payoff;
6. the tester can explain their ending using actions they remember taking;
7. the second band is not perceived as an automatic bonus or universally correct choice.
