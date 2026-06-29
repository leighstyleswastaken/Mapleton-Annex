# Player Completion Patch Notes

This patch is aimed at making Mapleton Annex feel complete from a player point of view, without rewriting the game.

## What changed

- Replaces normal-route use of the old dev placeholder ending with concrete branch endings.
- Adds specific endings for:
  - Stability Plan / hardship capture
  - Framed evidence leak
  - Mog friendship / mirror capture
- Keeps the existing endings for:
  - standard retirement
  - Director / manager route
  - whistleblower route
  - Mog overrun route
  - failure states
- Makes final branch resolution more forgiving, so partial-but-real player routes resolve to authored endings instead of a "not implemented" message.
- Lowers the whistleblower evidence requirement from effectively unreachable to a route that can be reached by clipping evidence and later leaking/recording evidence.
- Makes weekly review decisions affect player branch flags where their text says they should:
  - Dossier / evidence changes
  - Entity rapport changes
  - hardship accept/reject
  - leak/evidence actions
- Uses the existing Mog rail logs during offline/fallback play so late-game branch-specific logs actually appear even without a Gemini API key.
- Adds an `npm start` alias because the README tells players/developers to run `npm start`.

## Intent

The aim is not to add a new act. The aim is to remove the player-facing feeling of "I found a route the game admits is unfinished".

A player who survives to the final shift should now get a proper ending for the path they drifted into, even if they did not perfectly complete the strongest version of that path.

## Validation

Not locally build-tested in this connector session. Suggested checks after merge:

1. `npm install`
2. `npm run build`
3. Start a new run and confirm onboarding still reaches the first shift.
4. Use the cheat menu to jump late-game routes, if available.
5. Confirm final outcomes no longer show `SIGNAL LOST // NARRATIVE PENDING` during ordinary branch play.
