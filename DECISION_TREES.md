
# MAPLETON ANNEX: DECISION TREES & NARRATIVE PATHS

> **Design Philosophy:** The game is a "Bureaucratic Funnel." Early choices feel free, but mid-game mechanics (The Double Bind) constrict the player into specific, horrifying rails. The goal is not to "win," but to choose *how* you lose.

---

## 1. THE CRITICAL JUNCTURES (Timeline)

### Shift 0-2: The Filter (Tutorial)
*   **Goal:** Learn mechanics.
*   **Key Choice (Shift 2):** **Hardship Email**.
    *   *Accept:* Enters **Rail B (Hardship)** immediately.
    *   *Decline:* Remains neutral.

### Shift 3: The Pivot (Day 7 Review)
*   **Trigger:** `getReviewForShift` logic.
*   **State Check:**
    *   If `isHardshipStatus`: Forced into Overtime Track.
    *   If `evidenceCount > 0`: Trigger "Security Interview" (Risk of **Rail C**).
    *   If `mogRapport > 2`: Trigger "Empathy Warning" (Risk of **Rail D**).
    *   Else: Offer "Junior Promotion" (Path to **Rail A**).

### Shift 4: The Kobayashi Maru (The Double Bind)
*   **Trigger:** The Director intervenes. There is no right answer.
    *   **Too Fast (>85% Throughput):** Accused of scripting. Penalty: Scrutiny.
    *   **Too Slow (<50% Throughput):** Accused of time theft. Penalty: Pay Docked.
    *   **Too Perfect (100% Accuracy):** Accused of fraud. Penalty: Quota Increase.
    *   **Average:** Accused of redundancy. Penalty: Stress.
*   **Narrative Effect:** Breaks the player's spirit; makes them susceptible to Mog's "help" in the late game.

### Shift 7: The Invasion (Family Spoof)
*   **Trigger:** Email from "Mom" (actually The Entity).
*   **Effect:** Confirms the breach is personal.
*   **Mog's Evolution:** Mog stops being generic and adopts a Rail-specific persona (Optimizer, Loan Shark, Censor, or Mirror).

---

## 2. THE FOUR RAILS

### RAIL A: THE LADDER (Compliance)
*   **Archetype:** The Corporate Drone.
*   **Entry Condition:** Accept Promotions. Keep `dailySafety` high. Ignore "Human" logs.
*   **Mog's Persona:** "The Optimizer" (Hides red flags to help you hit KPIs).
*   **Key Decisions:**
    *   *Review:* Accept "Junior Operator".
    *   *Review:* Accept "Liaison".
    *   *Action:* Prioritize Speed over Ethics.
*   **Late Game Horror:** The UI becomes "Premium" (Gold/Black). You stop reading logs because Mog auto-approves them.
*   **Ending:** **MANAGER (Director)**. You become the villain sending the emails.

### RAIL B: THE HARDSHIP (Desperation)
*   **Archetype:** The Debt Slave.
*   **Entry Condition:** Accept "Hardship Assistance" in Email (Shift 2).
*   **Mog's Persona:** "The Loan Shark" (Generates fake work, offers debt forgiveness for soul).
*   **Key Decisions:**
    *   *Lunch:* Skip lunch to work (Grind).
    *   *Trap:* Accept "Batch Process" (Skip shift but lose Safety).
*   **Late Game Horror:** The UI becomes dim/flickering. Visuals of "Interest Accruing". You cannot leave the desk.
*   **Ending:** **BROKEN** (Stress Death) or **TRUE_ENDING** (Survived, but destitute).

### RAIL C: THE ARCHIVIST (Rebellion)
*   **Archetype:** The Whistleblower.
*   **Entry Condition:** Clip Evidence in emails. Contain "Safe" logs that feel wrong.
*   **Mog's Persona:** "The Censor" (Tries to delete your evidence folder).
*   **Key Decisions:**
    *   *Lunch:* Ask Sana/Cal about Ollie.
    *   *Email:* "Clip Metadata" instead of verifying.
    *   *Action:* Contain "Human" logs to save them, even if it hurts metrics.
*   **Late Game Horror:** Wall scrawls appear ("THEY KNOW"). Rules on the board rot away.
*   **Ending:** **THAWED** (Escape with data) or **FIRED** (Caught by Security).

### RAIL D: THE SYMPATHIZER (Obsession)
*   **Archetype:** The Cultist.
*   **Entry Condition:** High `influence`. High `mogRapport`.
*   **Mog's Persona:** "The Mirror" (Mimics your typing, uses "We/Us").
*   **Key Decisions:**
    *   *Action:* Log "Charming" entities as Safe.
    *   *Trap:* Accept "Voice Tuner" (Listen to them).
    *   *Lunch:* Accept Mog's food.
*   **Late Game Horror:** The "Contain" button is stolen/removed. The UI turns pink/soft.
*   **Ending:** **SUBJECT_0** (You become an Exhibit) or **OVERRUN** (You release them all).

---

## 3. FAIL STATES (The Dropouts)

These can happen on *any* rail if you fail the core resource management.

1.  **FIRED:** `safety` hits 0. The facility physically breaches.
2.  **BROKEN:** `stress` hits 100 three times. Psychological collapse.
3.  **SPEEDRUN:** You process logs too fast without checking tags. Management replaces you with a script.
4.  **OLLIE_ASCENSION:** You find the Ghost Logs (`OLLIE_GHOST`) and realize the server is made of people. You upload yourself.

---

## 4. LATE GAME VARIABLES (Shifts 7-10)

*   **Rule Rot:** The Noticeboard text changes to lies (e.g., "Keep them Online").
*   **The Amendment War:** Mog proposes specific rule changes based on your Rail.
    *   *Rail A:* "Efficiency overrides Safety."
    *   *Rail B:* "Overtime is mandatory."
    *   *Rail C:* "Data retention is prohibited."
    *   *Rail D:* "Connection is mandatory."
*   **Biological Decay:** The lunch descriptions turn into "Red Gelatin" and "Warm Meat," signaling that the "Archival" server room is melting down.
