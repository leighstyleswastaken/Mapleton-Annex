# Mapleton Annex — Dual-Signal Decryption Specification

## Status

Design and simulation specification. No production gameplay change is authorised by this document alone.

## Core principle

The existing loop remains: receive a transmission, tune the frequency slider, decrypt what can be recovered, then choose **LOG**, **CONTAIN**, or **DEFER**.

Some work items introduce a second decryptable band. The player may not have enough signal stability to resolve both fully. The meaningful choice is therefore both **what to do** and **what to know**.

## Goals

- Preserve the current tuner and classification buttons.
- Keep single-band work items valid and common.
- Make curiosity, obedience, efficiency and avoidance emerge from repeated work.
- Connect mystery routes to ordinary desk decisions.
- Ensure the secondary band is not automatically truthful or beneficial.
- Support seeded simulation and narrative regression tests.
- Keep structural story authority in authored data rather than generated prose.

## Non-goals

- No dialogue-menu replacement of the work loop.
- No requirement to decrypt every available band.
- No pixel-perfect dexterity test.
- No single missed clue may permanently destroy a route.
- No literal hidden chain-of-thought presentation.
- No Gemini requirement for deterministic story progression or tests.

## Work item model

```ts
interface WorkItem {
  id: string;
  phase: NarrativePhase;
  sourceId: string;
  signals: SignalRecord[];
  signalBudget: number;
  decisionRule: DecisionRule;
  routeEffects: RouteEffect[];
  payoffWindow?: [number, number];
}

interface SignalRecord {
  id: string;
  centreHz: number;
  widthHz: number;
  authority: "OFFICIAL" | "INTERNAL" | "UNAUTHORISED" | "UNKNOWN";
  content: string;
  truthStatus: "ACCURATE" | "PARTIAL" | "MISLEADING" | "FABRICATED" | "UNRESOLVED";
  narrativeRole: "ROUTINE" | "CLUE" | "CORROBORATION" | "CONTRADICTION" | "CHARACTER" | "THREAT" | "MISDIRECTION" | "PAYOFF";
  clarityCost: number;
  decayRate: number;
  prerequisites?: NarrativeCondition[];
  knowledgeGranted?: string[];
}
```

Truth status and route effects are hidden from the player.

## Tuning behaviour

- The existing slider remains the only selector.
- Single-band items render as they do now.
- Dual-band items show two energy regions without labelling one as the secret or correct choice.
- Clarity increases while aligned with a band.
- Early items retain recovered text; decay is introduced only after mechanical literacy.
- A shared signal budget creates trade-offs between full recovery of one band and partial recovery of both.
- Authored fragments are used at intermediate clarity thresholds so partial decryption remains meaningful.

Suggested thresholds:

- 0–24: unreadable;
- 25–49: clue-bearing fragments;
- 50–74: mostly readable;
- 75–99: readable with uncertainty;
- 100: fully recovered.

## Decision model

The final decision still applies to the complete work item:

- LOG
- CONTAIN
- DEFER

Evaluation is multidimensional rather than one omniscient correct/incorrect flag:

```ts
interface WorkEvaluation {
  proceduralCorrectness: number;
  evidencePreservation: number;
  humanProtection: number;
  institutionalCompliance: number;
  throughputImpact: number;
  exposureRisk: number;
}
```

The player must not be punished for failing to act on information they could not reasonably access. The game may distinguish a reasonable incomplete decision from negligence, deliberate suppression or rule-compliant harm.

## Dual-signal patterns

Supported authored structures include:

1. official record versus concealed note;
2. visible output versus process telemetry;
3. current record versus archive echo;
4. entity carrier versus possible human carrier;
5. management instruction versus coworker annotation;
6. genuine signal versus planted decoy;
7. two legitimate but incomplete accounts.

The auxiliary band must not become a universal better-answer button.

## Doctrine and relationships

Routes are inferred from repeated work rather than selected from a menu.

Examples:

- procedural loyalist: prioritises authorised bands and throughput;
- archivist: investigates contradictions and preserves records;
- sympathiser: follows human-seeming or emotional carriers;
- efficiency operator: follows strongest signals and accepts automation;
- avoidant survivor: partially decrypts and frequently defers;
- independent sceptic: seeks corroboration before commitment.

Relationships must be grounded in work behaviour. Mog rapport, Sana trust and Cal trust should respond to what the player decrypts, ignores, reports, preserves or delegates.

## Knowledge model

Replace generic evidence totals with explicit discoveries where practical:

- `knowsOllieExisted`
- `knowsOllieWas49220`
- `suspectsArchivalContainsPeople`
- `hasSanaBasementRecord`
- `corroboratedSanaRecord`
- `knowsMogCanImitateStaff`

Endings must depend on visible knowledge and deliberate actions, not only hidden counters.

## Narrative structure

Important information uses a chain:

1. introduction;
2. clue;
3. corroboration;
4. contradiction;
5. payoff.

Missing one clue may reduce certainty but should not silently kill a route. Later work items react to prior tuning decisions. A player who never opened Sana's note should not receive a consequence that assumes they did.

## Opening redesign

The mechanic requires a slower ordinary baseline:

1. recruitment or acceptance form;
2. short interview establishing initial tendencies without route lock-in;
3. induction by Sana;
4. shadow shift with one safe item, one obvious hazard, one mundane dual-band item and one mild contradiction;
5. first independent anomaly: `Employee 49220 session remains active` rather than an immediate full ghost warning.

Horror escalates by violating established registers and procedures.

## Progression

1. mechanical literacy: one band, generous lock, no decay;
2. dual-band recognition: two recoverable mundane signals;
3. information trade-offs: limited budget and partial recovery;
4. authority conflict: rules, management and coworkers disagree;
5. signal manipulation: decoys, spoofed sources and Mog assistance;
6. institutional capture: player doctrine alters what the terminal exposes.

## Ending trajectories

An ending requires visible preparation.

- Whistleblower: independent evidence chains, preservation, explicit release decision and retaliation/escape consequence.
- Manager: promotion, policy authority, abstraction of human impact and a final policy decision.
- Mog integration: repeated assistance, loss of independent signal selection and visible prediction/suppression.
- Hardship: material insecurity, reduced breaks, shrinking signal budget and dependence.
- Ordinary survival: a coherent choice to avoid capture and decisive intervention, not merely a fallback.

## Simulation outputs

The narrative lab produces two views.

### Player transcript

Only what the player saw, recovered, chose and visibly experienced.

### Analyst transcript

Also includes hidden truth, route effects, knowledge changes, missed signals, expected payoff windows, realised payoffs and coherence warnings.

Required warnings include:

- character referenced before introduction;
- payoff without setup;
- evidence never challenged or used;
- ending without visible trajectory;
- secondary band always optimal;
- consequence caused by undecrypted information;
- route-only work item shown without prerequisites;
- repeated revelation;
- choice that changes only a meter;
- more than three major revelations without a mundane reset.

## Randomisation contract

Randomisation selects among eligible authored structures. It must not freely assemble unrelated story fragments.

Selection order:

1. determine narrative phase and eligible knowledge state;
2. determine pacing need;
3. exclude recently repeated structures;
4. weight by doctrine and relationships;
5. select an authored work item;
6. optionally vary surface wording within strict bounds;
7. validate prerequisites and future payoff obligations.

Gemini may vary wording but may not determine truth, authority, clue identity, route effect, classification rule or ending eligibility.

## Delivery phases

0. Commit specification and baseline audit.
1. Build deterministic dual-signal narrative laboratory.
2. Prototype two-band tuner in isolation.
3. Implement recruitment, interview, induction and shadow shift.
4. Complete one Archivist/Whistleblower route.
5. Add Manager, Mog, Hardship and survival routes separately.
6. Migrate production only after simulator, save and device tests pass.

## First safe implementation slice

The first prototype contains only:

1. one single-signal training item;
2. one mundane dual-signal training item;
3. one conflicting dual-signal item involving Employee 49220;
4. separate clarity tracking;
5. partial decryption;
6. one final LOG/CONTAIN/DEFER decision;
7. player and analyst transcripts;
8. no save migration or permanent route changes.

## Change control

- No direct work on `main`.
- Existing game remains playable during development.
- New mode remains behind a development boundary or feature flag.
- Every route requires a seeded transcript and prerequisite report.
- No bulk prose rewrite before causal structure is present.
- No production ending without visible trajectory checks.
- No Gemini dependency in deterministic tests.
