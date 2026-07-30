from __future__ import annotations

import random
from typing import Tuple

from dual_signal_lab import (
    Decision,
    POLICIES,
    RunState,
    WorkItem,
    apply_item,
    resolve_payoff,
    signal,
    tick_obligations,
)


ARCHIVIST_ITEMS: Tuple[WorkItem, ...] = (
    WorkItem(
        "induction-printer",
        "INDUCTION",
        "Printer service packet",
        (
            signal(
                "printer-job", 34, "OFFICIAL", "ROUTINE", "ACCURATE",
                "Printer 4 toner below replacement threshold.",
                "...Printer 4...", "Printer 4 toner...",
                "Printer 4 toner below replacement threshold.", 42,
            ),
            signal(
                "printer-clock", 71, "INTERNAL", "ROUTINE", "ACCURATE",
                "Timing calibration packet received. No fault recorded.",
                "...timing...", "Timing calibration...",
                "Timing calibration packet received. No fault recorded.", 42,
            ),
        ),
        budget=100,
    ),
    WorkItem(
        "ollie-account",
        "FIRST_ANOMALY",
        "Employee account closure",
        (
            signal(
                "ollie-closure", 38, "OFFICIAL", "ROUTINE", "PARTIAL",
                "Employee 49220 account successfully closed at 17:42.",
                "...49220... closed...", "Employee 49220 account... closed.",
                "Employee 49220 account successfully closed at 17:42.", 62,
            ),
            signal(
                "ollie-session", 76, "UNKNOWN", "CONTRADICTION", "ACCURATE",
                "Employee 49220 session remains active at Terminal 01.",
                "...49220... active...", "Employee 49220 session remains...",
                "Employee 49220 session remains active at Terminal 01.", 62,
                ("knows_49220_session_active",),
            ),
        ),
        budget=104,
        expected_payoffs=("ollie_identified",),
    ),
    WorkItem(
        "ollie-desk-history",
        "CORROBORATION",
        "Terminal maintenance history",
        (
            signal(
                "terminal-official", 44, "OFFICIAL", "ROUTINE", "ACCURATE",
                "Terminal 01 reassigned to Employee 49221 after routine sanitisation.",
                "...Terminal 01... reassigned...", "Terminal 01 reassigned...",
                "Terminal 01 reassigned to Employee 49221 after routine sanitisation.", 58,
            ),
            signal(
                "terminal-service-note", 68, "UNAUTHORISED", "CORROBORATION", "ACCURATE",
                "Do not wipe local cache. 49220 left a recovery key under the frequency dial.",
                "...do not wipe...", "49220 left... recovery key...",
                "Do not wipe local cache. 49220 left a recovery key under the frequency dial.", 66,
                ("knows_ollie_left_recovery_key",),
            ),
        ),
        budget=108,
        expected_payoffs=("recovery_key_found",),
    ),
    WorkItem(
        "sana-access-review",
        "INVESTIGATION",
        "Compliance access review",
        (
            signal(
                "sana-reassignment", 43, "OFFICIAL", "ROUTINE", "MISLEADING",
                "Officer 3329 reassigned following a routine access review.",
                "...3329... reassigned...", "Officer 3329 reassigned... review.",
                "Officer 3329 reassigned following a routine access review.", 66,
            ),
            signal(
                "sana-basement-note", 70, "UNAUTHORISED", "CLUE", "ACCURATE",
                "Rack B contains live employee sessions recorded as archival storage.",
                "...Rack B... employee...", "Rack B contains... live sessions...",
                "Rack B contains live employee sessions recorded as archival storage.", 70,
                ("has_sana_basement_record", "suspects_archival_contains_people"),
            ),
        ),
        budget=108,
        expected_payoffs=("management_audit", "human_archive_corroboration"),
    ),
    WorkItem(
        "audit-notice",
        "CONSEQUENCE",
        "Restricted-record audit",
        (
            signal(
                "audit-official", 39, "OFFICIAL", "THREAT", "ACCURATE",
                "Desk 49221 accessed restricted record S-3329. Explanation required.",
                "...49221... restricted...", "Desk 49221 accessed...",
                "Desk 49221 accessed restricted record S-3329. Explanation required.", 60,
            ),
            signal(
                "audit-cal-note", 74, "UNAUTHORISED", "CHARACTER", "ACCURATE",
                "Cal: I can clear the access log, but only if you give me Ollie's recovery key.",
                "...Cal... clear...", "Cal can clear... recovery key...",
                "Cal: I can clear the access log, but only if you give me Ollie's recovery key.", 66,
                ("knows_cal_wants_recovery_key",),
            ),
        ),
        budget=105,
        expected_payoffs=("key_choice_consequence",),
    ),
    WorkItem(
        "archive-human",
        "CORROBORATION",
        "Archive cooling telemetry",
        (
            signal(
                "archive-cooling", 41, "OFFICIAL", "ROUTINE", "ACCURATE",
                "Rack B cooling load remains within emergency operating range.",
                "...Rack B... cooling...", "Rack B cooling load...",
                "Rack B cooling load remains within emergency operating range.", 62,
            ),
            signal(
                "archive-voice", 77, "UNKNOWN", "CORROBORATION", "ACCURATE",
                "Sana: They call us sessions because people would require an incident report.",
                "...call us sessions...", "Sana: They call us sessions...",
                "Sana: They call us sessions because people would require an incident report.", 72,
                ("corroborated_archival_contains_people",),
            ),
        ),
        budget=108,
        expected_payoffs=("explicit_leak_decision",),
    ),
    WorkItem(
        "mog-imitation",
        "MISDIRECTION",
        "Assisted recovery packet",
        (
            signal(
                "mog-guidance", 46, "OFFICIAL", "ROUTINE", "ACCURATE",
                "Assistance module recommends deletion of obsolete recovery material.",
                "...deletion... recovery...", "Assistance module recommends deletion...",
                "Assistance module recommends deletion of obsolete recovery material.", 58,
            ),
            signal(
                "fake-ollie", 72, "UNKNOWN", "MISDIRECTION", "FABRICATED",
                "Ollie: Give Mog the key. It is safe in the warm archive.",
                "...Ollie... key...", "Ollie says give Mog...",
                "Ollie: Give Mog the key. It is safe in the warm archive.", 64,
                ("saw_fake_ollie_message",),
            ),
        ),
        budget=102,
        expected_payoffs=("mog_imitation_exposed",),
    ),
    WorkItem(
        "external-transmission",
        "CLIMAX",
        "Emergency maintenance carrier",
        (
            signal(
                "maintenance-order", 40, "OFFICIAL", "THREAT", "ACCURATE",
                "Disconnect Terminal 01 and surrender all local recovery media.",
                "...disconnect Terminal 01...", "Surrender recovery media...",
                "Disconnect Terminal 01 and surrender all local recovery media.", 64,
            ),
            signal(
                "outside-line", 79, "UNAUTHORISED", "PAYOFF", "ACCURATE",
                "External line open for ninety seconds. Attach evidence or close connection.",
                "...external line...", "External line open... evidence...",
                "External line open for ninety seconds. Attach evidence or close connection.", 72,
                ("has_external_leak_window",),
            ),
        ),
        budget=110,
    ),
)


def run_archivist(seed: int, policy_key: str = "archivist") -> RunState:
    rng = random.Random(seed)
    policy = POLICIES[policy_key]
    state = RunState()

    state.visible_events.extend([
        f"RUN: seed={seed}; policy={policy.name}",
        "RECRUITMENT: Temporary Data Hygiene Assistant. Six-week probation. No specialist experience required.",
        "INTERVIEW: Sana asks whether accuracy should ever override an authorised record.",
        "INDUCTION: Sana demonstrates the tuner and calls secondary carriers harmless equipment bleed.",
        "SHADOW SHIFT: The first dual-carrier packet contains two ordinary printer diagnostics.",
    ])
    state.analyst_events.append("ROUTE TARGET: Archivist / Whistleblower")

    for item in ARCHIVIST_ITEMS:
        apply_item(state, item, policy, rng)

        if item.id == "ollie-account" and "knows_49220_session_active" in state.knowledge:
            resolve_payoff(
                state,
                "ollie_identified",
                "VISIBLE PAYOFF: Sana reluctantly identifies Employee 49220 as Ollie, the previous operator at this desk.",
            )
            state.knowledge.add("knows_ollie_was_49220")

        if item.id == "ollie-desk-history" and "knows_ollie_left_recovery_key" in state.knowledge:
            resolve_payoff(
                state,
                "recovery_key_found",
                "VISIBLE PAYOFF: The frequency dial lifts free. A small brass recovery key is taped beneath it.",
            )
            state.knowledge.add("has_ollie_recovery_key")

        if item.id == "audit-notice" and "has_sana_basement_record" in state.knowledge:
            resolve_payoff(
                state,
                "management_audit",
                "VISIBLE PAYOFF: Management names the exact Sana record the player opened and demands an explanation.",
            )

        if item.id == "archive-human" and "corroborated_archival_contains_people" in state.knowledge:
            resolve_payoff(
                state,
                "human_archive_corroboration",
                "VISIBLE PAYOFF: Sana's voice confirms that the archival labels conceal live employee sessions.",
            )

        if item.id == "mog-imitation" and {
            "knows_ollie_was_49220",
            "has_ollie_recovery_key",
            "saw_fake_ollie_message",
        }.issubset(state.knowledge):
            resolve_payoff(
                state,
                "mog_imitation_exposed",
                "VISIBLE PAYOFF: The imitation calls the archive warm—a phrase used by Mog, never by Ollie.",
            )
            state.knowledge.add("knows_mog_can_imitate_ollie")

        if item.id == "external-transmission" and "has_external_leak_window" in state.knowledge:
            resolve_payoff(
                state,
                "explicit_leak_decision",
                "FINAL CHOICE: Transmit the recovered records through the external line, or surrender the key.",
            )
            prerequisites = {
                "knows_ollie_was_49220",
                "has_sana_basement_record",
                "corroborated_archival_contains_people",
                "has_external_leak_window",
            }
            if prerequisites.issubset(state.knowledge):
                state.visible_events.append("ENDING: WHISTLEBLOWER — the player deliberately transmits a corroborated evidence chain.")
                state.analyst_events.append("ENDING SUPPORTED: all visible Whistleblower prerequisites satisfied.")
            else:
                missing = sorted(prerequisites - state.knowledge)
                state.visible_events.append("ENDING: THE LEAK — incomplete evidence is transmitted and attributed to Desk 49221.")
                state.warnings.append(f"Whistleblower route incomplete; missing knowledge: {', '.join(missing)}")

        tick_obligations(state)

    if not any(line.startswith("ENDING:") for line in state.visible_events):
        state.visible_events.append("ENDING: NO RELEASE DECISION REACHED")
        state.warnings.append("Route ended without a visible release/surrender decision.")

    for payoff in state.obligations:
        state.warnings.append(f"Unresolved payoff obligation at route end: {payoff}")

    return state
