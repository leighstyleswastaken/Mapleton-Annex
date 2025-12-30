
# TERMINAL EVOLUTION & MECHANICS

## 1. The Difficulty Curve (Global)
Regardless of the Rail chosen, the machine degrades over time.

| Shift Range | Name | Tuner Drift | Signal Noise | UI Stability | Rule Status |
|---|---|---|---|---|---|
| **0-2** | Calibration | Minimal | Low (0-10%) | Stable | Stable |
| **3-5** | Degradation | Moderate | Med (10-40%) | Glitching | Stable |
| **6-8** | Corruption | High (Jerky) | High (40-70%) | **Button Theft** (Contain vanishes) | **Rotting** (Rules fade/Lie) |
| **9-10** | Entropy | Extreme | Severe (70%+) | **Black Ice** (Stress Euphoria) | **Redacted** (Black bars) |

## 2. Rail-Specific Evolutions (Visuals & Feel)

### Rail A: The Ladder (Compliance)
*   **Trigger**: `rank` >= LIAISON.
*   **Visual Theme**: "Premium". Gold/Platinum borders. Clean fonts.
*   **Behavior**: Buttons respond instantly. No feedback delays.
*   **Mog's Strategy**: **Optimization**. Mog tries to make you efficient so you process *more* entities (feeding it faster).

### Rail B: The Hardship (Desperation)
*   **Trigger**: `isHardshipStatus` = true.
*   **Visual Theme**: "Economy Mode". Dimmed screen. scanlines are heavier. Elements flicker.
*   **Behavior**: "Sluggish". Buttons take 200ms longer to click (simulating fatigue).
*   **Mog's Strategy**: **Relief**. Mog offers to do the work for you so you can sleep/rest, at the cost of your humanity (Influence).

### Rail C: The Archivist (Rebellion)
*   **Trigger**: `hasClippedEvidence` = true.
*   **Visual Theme**: "Debug Mode". Raw hex code overlays. Red outlines.
*   **Behavior**: "Paranoid". Random 'Security Scan' popups delay your work.
*   **Mog's Strategy**: **Obfuscation**. Mog tries to hide data from you (blurring text) or bribe you to delete evidence.

### Rail D: The Sympathizer (Mog's Friend)
*   **Trigger**: `mogRapport` > 5.
*   **Visual Theme**: "Beautification". Pink borders, rounded corners, soft fonts.
*   **Behavior**: "Playful". The Tuner snaps to the sweet spot automatically sometimes.
*   **Mog's Strategy**: **Integration**. Mog wants you to lower the firewall completely.

## 3. Trap Schedule (The "Upgrades")

Mog offers help when you **Defer** tasks (showing weakness). The offer depends on your current struggle.

| Rail | Trap Name | Effect | Cost | Narrative Context |
|---|---|---|---|---|
| **Any** | Auto-Sort | Shrink Contain Button | Space | "Your desk is messy. Let me fix it." |
| **B (Hardship)** | **Batch Process** | Skip Shift | Safety | "You look tired. I can finish today's quota." |
| **B (Hardship)** | **Alarm Mute** | Hide Safety Meter | - | "The sirens are loud. Sleep mode active?" |
| **A (Ladder)** | **Priority Matrix** | Shuffle Rules | Influence | "Let's re-order rules by 'Business Value'." |
| **D (Friend)** | **Voice Tuner** | TTS Audio | Stress | "I want you to hear their real voices." |
| **D (Friend)** | **Auto-Tuner** | Perfect Signal | Influence | "Let me hold the dial for you." |
| **C (Rebel)** | **Redaction** | Blurs Hazards | Evidence | "That text looks dangerous. I'll hide it." |

## 4. Visual Horror States

| Effect | Trigger | Description |
|---|---|---|
| **Ghost ID** | `rank` Hover | Hovering over your Rank changes the text to "OLLIE" or "SUBJECT 0". |
| **Black Ice** | `stress` > 90 & `influence` > 80 | The Stress meter turns Cyan. The label changes to "EUPHORIA". **Visual Deception**: The meter visually drops by 30%, making you feel safe while you are actually moments from a breakdown. |
| **Wall Scrawls** | `annexAwareness` > 0 | Text like "THEY EAT TIME" appears faintly on the terminal background. |
| **Button Theft** | Shift > 7 & High Influence | The "Contain" button is physically removed from the DOM 15% of the time, replaced by an "[OPTIMIZED]" label. |
