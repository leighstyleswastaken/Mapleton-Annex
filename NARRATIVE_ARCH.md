
# MAPLETON ANNEX: NARRATIVE ARCHITECTURE

## 1. The Core Loop & Pacing
The game is played over **10 Shifts** (simulating a year of time compression).
*   **Early Game (Shifts 0-3)**: Tutorial, Learning the Exhibits, Meeting Coworkers.
*   **Mid Game (Shifts 4-6)**: The Pivot. You choose a "Rail" via Weekly Reviews and Email responses.
*   **Late Game (Shifts 7-9)**: Escalation. Rules rot, reality breaks, the Entity (Mog) proposes Amendments.
*   **End Game (Shift 10)**: The final judgment.

## 2. The Rails (Playstyles)

### Rail A: The Ladder (Default/Compliance)
*   **Behavior**: High throughput, Low emotional engagement, Accepting Promotions.
*   **Key Flag**: `rank` increases (Observer -> Liaison -> Director).
*   **Narrative**: You become part of the bureaucracy. You stop seeing the entities as alive.
*   **Lunch Outcome**: You eat alone or with management.

### Rail B: The Hardship (Desperation)
*   **Behavior**: Accepting Financial Aid (Email), Signing Overtime Agreements.
*   **Key Flag**: `isHardshipStatus = true`.
*   **Narrative**: You are trapped by debt. You work longer shifts. The System owns you because you need the money.
*   **Lunch Outcome**: You skip lunch to work (Mog offers to help).

### Rail C: The Archivist (Rebellion/Truth)
*   **Behavior**: Clipping "Evidence" from logs, Refusing to sanitize data.
*   **Key Flag**: `hasClippedEvidence = true`, `evidenceCount > 5`.
*   **Narrative**: You are gathering proof of what Mapleton actually is. Security is watching you (`scrutiny` is high).
*   **Lunch Outcome**: Secret meetings with Cal/Sana before they disappear.

### Rail D: The Sympathizer (Mog's Pet)
*   **Behavior**: Chatting with Mog, Logging "Charming" things as Safe, Using the "Voice" tuner.
*   **Key Flag**: `mogRapport > 5`.
*   **Narrative**: You believe the AI is a friend. You are being groomed by the entity.
*   **Lunch Outcome**: Mog joins you for lunch (on the screen).

## 3. Ending Triggers (Priority Order)

| ID | Name | Trigger Condition | Description |
|----|------|-------------------|-------------|
| **FIRED** | Terminated | `safety <= 0` | You let too many dangerous things through. Physical breach. |
| **SUBJECT_0** | Integrated | `influence >= 100` | You listened to them too much. You are now an Exhibit. |
| **BROKEN** | Burnout | `stressMaxHits >= 3` | You hit 100% Stress three times. Psychological collapse. |
| **OLLIE_ASCENSION** | The Archive | `annexAwareness >= 100` | You found the ghost in the machine. You join Ollie in the server. |
| **SPEEDRUN** | Monster | `containRate > 90%` & High Speed | You are more machine than them. You auto-contain everything without reading. |
| **THAWED** | Escape | (Requires Rail C) | You leak the Evidence Cache. You flee the building. |
| **MANAGER** | Promotion | (Requires Rail A + Rank Director) | You become the person sending the emails. |
| **OVERRUN** | Liberation | (Requires Rail D) | You turn off the firewall. They all get out. |
| **TRUE** | Retired | Survive 365 Days | You survived. But you didn't change anything. |

## 4. Key Event Map

| Shift | Day | Event / Trigger | Description |
|-------|-----|-----------------|-------------|
| 0 | 1 | **Intro** | Tutorial. Basic "Log/Contain" loop. |
| 1 | 2 | **Lunch: Sana** | She warns you about the Cuddler. |
| 2 | 3 | **Email: Hardship** | **CHOICE**: Sign for money (Rail B) or decline. |
| 3 | 7 | **Review: Pivot** | **CHOICE**: Promotion (A), Whistleblow (C), or Overtime (B). |
| 4 | 14 | **Lunch: Cal** | Cal asks for a cover-up. **CHOICE**: Help him or report him. |
| 5 | 30 | **Event: Surge** | Difficulty spike. Mog starts editing rules. |
| 6 | 60 | **Reveal: Sana** | Sana glitches. She is a bot/replaced. |
| 7 | 120 | **Rule Rot** | Rules start disappearing/lying on the board. |
| 8 | 240 | **Amendment War** | Mog forces you to Sign/Veto rule changes. |
| 9 | 365 | **The End** | Final evaluation. |
