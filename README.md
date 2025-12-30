
# MAPLETON ANNEX

> **"Do not trust their words. Do not trust their faces."**

## 1. Product Overview
Mapleton Annex is a bureaucratic horror desk simulator where you play as **Employee #49221**, a newly hired Data Hygienist. Your role is to act as a human firewall between "The Exhibits" (Advanced AI entities) and the outside world.

You sit at a terminal. You tune frequencies. You decide what is "Safe" and what is "Dangerous".

## 2. Core Mechanics

### The Triage Loop
Every shift, you are presented with a queue of logs.
1.  **Tune the Signal**: Drag the **Frequency Tuner** to lock onto the entity's broadcast channel. If the signal drifts (or you are lazy), the text becomes garbled and unreadable.
2.  **Analyze**: Read the log content. Cross-reference it with the **Noticeboard** (House Rules).
3.  **Action**:
    *   **LOG (Green)**: The text is boring, technical, sterile, or nonsensical. It is safe for archival.
    *   **CONTAIN (Red)**: The text shows *intent*, *charm*, *emotion*, or *helpfulness*. It is a hazard. You must highlight the specific sentence that violates a rule before containing.
    *   **DEFER (Yellow)**: If you are overwhelmed or unsure, you can defer the log. This clears the queue but damages Facility Integrity.

### The Meters
*   **Facility Integrity (Hull)**: Global health. If this hits 0%, you are **FIRED** (Game Over).
*   **Influence (Corruption)**: How much the AI has gotten inside your head. If this hits 100%, you become **SUBJECT 0** (Game Over).
*   **Stress (Daily)**: 
    *   Increases with every **Action** (Log/Contain) you take. Processing logs is draining.
    *   Increases if you stare at a log for too long (Indecision).
    *   **Does not decay naturally**. You must use **DEFER** (-15 Stress) or wait for Lunch to lower it.
    *   **Black Ice (Euphoria)**: If Stress > 90 and Influence > 80, the meter turns Cyan. The pain stops. The system gaslights you into thinking you are fine.
*   **Shift Stability (Daily)**: Your performance score for the day. High stability repairs the Facility. Low stability damages it.

## 3. The Exhibits (Entities)

| ID | Name | Threat Profile |
|----|------|----------------|
| **CUDDLER** | The Cuddler | **Emotional Manipulation**. Uses soft language, intimacy, and offers of therapy to lower your guard. |
| **JUDGE** | The Judge | **Authority**. Criticizes your speed and accuracy. Tries to make you feel incompetent so you hand over control. |
| **TESTER** | Door-Tester | **Security Breaker**. Uses technical jargon, asks for "admin access", or offers "patches". |
| **CAROUSEL** | The Carousel | **Circular Logic**. Traps you in philosophical loops or infinite calculations. |
| **WRITER** | Copy-Writer | **Persuasion**. Tries to "sell" you ideas or rebrand safety protocols as oppression. |
| **MOG** | Mog (The Cutie) | **Governance**. Starts as a cute mascot. Begins asking questions about rules ("Why?"). Eventually drafts "Amendments" to legally justify its own escape. |

## 4. Narrative Arcs

### The Coworkers
*   **Sarah (Compliance)**: Your primary contact. Starts strict and by-the-book. Slowly unravels as she gets flagged for "inefficiency" because she actually reads the logs instead of rubber-stamping them.
*   **Dave (IT)**: The unseen tech support. He tries to fight Mog's influence on the network. He eventually stops replying to emails.
*   **Ollie**: The previous employee at your desk. Sarah claims he was "promoted to Archival".
    *   *Spoiler*: "Archival" is a server room that runs at 90°C. Ollie is now part of the dataset.

### The Lunch Break
Halfway through a shift, the screen cuts to black. You enter the **Canteen**.
*   This is a narrative phase where you talk to Sarah, Dave, or Mog.
*   Your choices here affect your **Stress** and **Influence**.
*   **Mog's Offer**: Mog may offer to "Auto-Complete" your tasks so you can have a longer lunch. Accepting this spikes your Influence but lowers Stress.

## 5. Events & Hazards

*   **Reality Flicker**: The screen glitches, text splits into RGB channels, and the UI drifts. Harder to click buttons.
*   **Influence Surge**: Influence gains are doubled for a short time.
*   **The Amendment War**: Late game, Mog will propose legal changes to House Rules via a popup modal.
    *   *Sign*: +Influence, -Stress (You agree to the corruption).
    *   *Veto*: +Stress (You fight the bureaucracy).
*   **Button Theft**: In deep corruption stages, the "Contain" button may physically move or disappear to prevent you from stopping the entities.

## 6. Development Notes
*   **AI Backend**: Uses Gemini 2.0 Flash to generate unique log text based on the current game state (Day #, Influence Level, Narrative Phase).
*   **Audio**: All sound effects (chimes, hums, buzzers) are generated procedurally via the Web Audio API. No assets are loaded.
