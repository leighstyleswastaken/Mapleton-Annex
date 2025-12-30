# Mapleton Annex Anti-Patterns (One Pager)

Keep this visible when adding events, UI sabotage, logs, upgrades, or late-game escalation.

## The principle
Difficulty comes from interpretation, cognitive load, and bureaucratic dread. Not twitch skill, unreadable randomness, or “gotcha” UI.

---

## Player experience: don’t break trust
- **Don’t** punish randomly with no readable cause. **Do** make triggers legible and consistent (even if unsettling).
- **Don’t** make careful reading the losing strategy. **Do** reward attention with stability, clarity, or safer outcomes.
- **Don’t** turn sabotage into a dexterity mini-game. **Do** keep sabotage interpretive (conflicting rules, mirrored meaning, moral traps).
- **Don’t** hide fail-state changes. **Do** surface consequences as they occur (audit notes, small status lines, diegetic warnings).
- **Don’t** allow a single dominant strategy (“contain everything”, “always defer”). **Do** add situational incentives and trade-offs.

---

## Loop and pacing: don’t flatten the game
- **Don’t** ramp everything at once (queue, drift, noise, stress) into a binary collapse. **Do** alternate stressors to create tense plateaus.
- **Don’t** make late game “all CONTAIN”. **Do** preserve meaningful ambiguity and at least one safe template per exhibit.
- **Don’t** let one early mistake doom the run silently. **Do** provide catch-up mechanics with painful trade-offs.
- **Don’t** pad shifts into boredom. **Do** compress mid-game once the loop is learned, and vary structure instead.

---

## Narrative: keep it corporate, keep it sharp
- **Don’t** rely on jump scares or “spooky face” horror. **Do** keep it administrative, gaslighting, quietly wrong.
- **Don’t** lore-dump. **Do** deliver story via short memos, optional attachments, and actionable choices.
- **Don’t** fake choice. **Do** ensure options diverge meaningfully (even if consequences are delayed).
- **Don’t** whiplash tone. **Do** keep tone consistent per rail, and foreshadow shifts.

---

## LLM integration: the model writes, the game judges
- **Don’t** let the model decide correctness. **Do** keep rule enforcement deterministic (tags, hazard classification).
- **Don’t** accept generator drift that makes safe-looking logs penalised. **Do** use hybrid constraints, fallbacks, and validation.
- **Don’t** freeze the UI on calls. **Do** keep flow smooth with in-universe buffering and graceful failure.
- **Don’t** automate away reading. **Do** make upgrades a monkey’s paw: convenience in exchange for risk, corruption, or constraint.

---

## Codebase: the things that make humans (and models) get lost
- **Don’t** concentrate everything into one god hook or god component. **Do** split concerns (shift engine, meters, narrative, API).
- **Don’t** leak timers (interval soup, stale closures). **Do** centralise timer ownership and always clean up.
- **Don’t** call randomness during render. **Do** generate once per log or event and persist it by id.
- **Don’t** store saves without versioning or validation. **Do** migrate, or scrub safely on load.

---

## PR stop-me checklist
- Does this add cognitive tension, not mouse accuracy?
- Can the player explain why they won or lost?
- Does this preserve meaningful choice and ambiguity?
- Is the model contributing flavour and variety, not authority?
- Will a fresh contributor understand where the logic lives?
