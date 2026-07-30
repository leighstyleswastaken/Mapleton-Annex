# Mapleton Annex Narrative Simulation Lab

Standalone deterministic research harness for inspecting the experienced story of Mapleton Annex without rendering or automating the browser UI.

## Purpose

- run seeded playthroughs;
- apply named player policies;
- emit readable whole-run transcripts;
- compare ending and route distributions;
- expose hidden route effects and knowledge acquisition;
- flag narrative ordering and payoff defects;
- make randomised outcomes reproducible.

## Boundary

This laboratory is research code alongside the game. It does not yet replace the production React runtime and does not claim byte-for-byte equivalence with a played run.

The baseline model reconstructs the current director, fixed scenes, flags and ending priorities. The dual-signal model tests the proposed mechanic in which some work items contain two frequency bands and the player must decide what to decrypt before choosing LOG, CONTAIN or DEFER.

## Run

```bash
python research/narrative-sim/run_baseline.py
python research/narrative-sim/run_dual_signal.py
```

Generated outputs belong under `research/narrative-sim/outputs/` and should be treated as review artefacts rather than authored game content.

## Transcript types

### Player-experience transcript

Contains only what the player could see: recovered signals, choices and visible consequences.

### Analyst transcript

Also records hidden truth status, signal authority, knowledge changes, doctrine changes, expected payoff obligations and coherence warnings.

## Intended evolution

1. Review representative seeded runs.
2. Agree the recruitment, interview, induction and shadow-shift opening.
3. Prove one coherent Archivist/Whistleblower route in simulation.
4. Extract a pure TypeScript work-item and narrative engine.
5. Share that engine between the React game, headless simulator and narrative regression tests.
6. Prototype the two-band tuner only after the causal model is stable.
