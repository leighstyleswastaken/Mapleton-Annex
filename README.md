
# MAPLETON ANNEX

> **"Do not trust their words. Do not trust their faces."**

## Quick Start (Run Locally)

Get the facility running in 90 seconds.

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Set API Key**
    Create a `.env` file in the root directory:
    ```env
    API_KEY=your_gemini_api_key_here
    ```

3.  **Launch Facility**
    ```bash
    npm start
    ```
    Open [http://localhost:1234](http://localhost:1234) to begin your shift.

---

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
    *   **CONTAIN (Red)**: The text shows *intent*, *charm*, *emotion*, or *helpfulness*. It is a hazard.
    *   **DEFER (Yellow)**: If you are overwhelmed, you can defer the log.
        *   **Cost**: Clears the queue, but reduces **Facility Integrity**.
        *   **Diminishing Returns**: Repeated use increases the Integrity penalty and provides less Stress relief. Overuse summons **Ghost Logs**.

### The Meters
*   **Facility Integrity (Hull)**: Global health. If this hits 0%, you are **FIRED** (Game Over).
*   **Influence (Corruption)**: How much the AI has gotten inside your head. If this hits 100%, you become **SUBJECT 0** (Game Over).
*   **Stress (Daily)**: 
    *   Increases with every **Action** you take.
    *   **Dynamic Accrual**: The higher your **Influence**, the faster you gain Stress (The entities become louder).
    *   **Black Ice (Euphoria)**: If Stress > 90 and Influence > 80, the meter turns Cyan ("EUPHORIA"). The UI lies to you about your stress level, masking the damage until you break.
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
*   **Sarah (Compliance)**: Your primary contact. Starts strict and by-the-book. Slowly unravels as she gets flagged for "inefficiency".
*   **Dave (IT)**: The unseen tech support. He tries to fight Mog's influence on the network.
*   **Ollie**: The previous employee at your desk. Sarah claims he was "promoted to Archival".

### The Lunch Break
Halfway through a shift, you enter the **Canteen**.
*   **The Hub**: Choose who to sit with (Sana, Cal, or Mog) to gather lore or resources.
*   **History**: You can review past conversations to track the unraveling mystery.
*   **Mog's Offer**: Mog may offer to "Auto-Complete" your tasks so you can have a longer lunch. Accepting this spikes your Influence.

## 5. Events & Hazards

*   **Reality Flicker**: The screen glitches, text splits into RGB channels, and the UI drifts.
*   **Influence Surge**: Influence gains are doubled for a short time.
*   **The Amendment War**: Late game, Mog will propose legal changes to House Rules.
    *   *Sign*: +Influence, -Stress. **The Monkey's Paw**: Signing an amendment *functionally changes the game logic*. If you sign "Rule 4 is void," charming logs are no longer flagged as hazards by the system, but logging them still damages Facility Integrity invisibly.
    *   *Veto*: +Stress. You fight the bureaucracy.
*   **Button Theft**: In deep corruption stages, the "Contain" button may physically move or disappear.

## 6. Development Notes
*   **AI Backend**: Uses Gemini 2.0 Flash to generate unique log text based on the current game state.
*   **Audio**: All sound effects (chimes, hums, buzzers) are generated procedurally via the Web Audio API. No assets are loaded.

## License
MIT License. See LICENSE file for details.
