# Mapleton Annex Narrative Simulation Lab

Standalone deterministic research harness for inspecting the experienced story of Mapleton Annex without rendering or automating the browser UI.

## Purpose

- run seeded playthroughs;
- apply named player policies;
- emit readable whole-run transcripts;
- compare ending and route distributions;
- flag narrative ordering defects;
- make randomised outcomes reproducible.

## Boundary

This first version is a structural baseline reconstructed from the current director, shift, lunch, flag and ending logic. It is not yet the production game runtime and does not claim byte-for-byte equivalence.

## Run

```bash
python run_baseline.py
```

Outputs are written to `outputs/`.

## Intended evolution

After the baseline has been reviewed, extract a pure TypeScript narrative engine shared by the React game, headless simulator and narrative regression tests.
