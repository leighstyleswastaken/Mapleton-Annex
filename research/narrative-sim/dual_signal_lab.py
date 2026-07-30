from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Tuple
import random


class Decision(str, Enum):
    LOG = "LOG"
    CONTAIN = "CONTAIN"
    DEFER = "DEFER"


@dataclass(frozen=True)
class Signal:
    id: str
    centre_hz: int
    authority: str
    role: str
    truth: str
    text: str
    fragments: Tuple[str, str, str]
    clarity_cost: int
    knowledge: Tuple[str, ...] = ()

    def render(self, clarity: int) -> str:
        if clarity < 25:
            return "[unreadable carrier noise]"
        if clarity < 50:
            return self.fragments[0]
        if clarity < 75:
            return self.fragments[1]
        if clarity < 100:
            return self.fragments[2]
        return self.text


@dataclass(frozen=True)
class WorkItem:
    id: str
    phase: str
    title: str
    signals: Tuple[Signal, ...]
    budget: int
    expected_payoffs: Tuple[str, ...] = ()


@dataclass(frozen=True)
class Policy:
    name: str
    official_bias: float
    curiosity: float
    split_attention: float
    defer_rate: float
    contain_hazard: float
    contain_safe: float


@dataclass
class RunState:
    knowledge: set[str] = field(default_factory=set)
    doctrine: Dict[str, int] = field(default_factory=lambda: {
        "compliance": 0,
        "curiosity": 0,
        "efficiency": 0,
        "avoidance": 0,
        "human_protection": 0,
    })
    visible_events: List[str] = field(default_factory=list)
    analyst_events: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    obligations: Dict[str, int] = field(default_factory=dict)


POLICIES = {
    "loyalist": Policy("Procedural loyalist", .90, .15, .10, .03, .90, .08),
    "archivist": Policy("Archivist investigator", .35, .90, .70, .04, .86, .08),
    "operator": Policy("Efficiency operator", .80, .25, .15, .08, .78, .05),
    "sceptic": Policy("Independent sceptic", .50, .72, .82, .10, .82, .10),
    "avoidant": Policy("Avoidant survivor", .55, .25, .40, .38, .65, .16),
}


def signal(id: str, hz: int, authority: str, role: str, truth: str,
           text: str, f1: str, f2: str, f3: str, cost: int,
           knowledge: Tuple[str, ...] = ()) -> Signal:
    return Signal(id, hz, authority, role, truth, text, (f1, f2, f3), cost, knowledge)


ITEMS: Tuple[WorkItem, ...] = (
    WorkItem(
        "training-cooling", "TRAINING", "Cooling diagnostic",
        (signal(
            "cooling-official", 41, "OFFICIAL", "ROUTINE", "ACCURATE",
            "Cooling fan speed within permitted tolerance.",
            "...fan speed...", "Cooling fan... permitted...",
            "Cooling fan speed within permitted tolerance.", 55,
        ),),
        budget=80,
    ),
    WorkItem(
        "training-printer", "TRAINING", "Printer service packet",
        (
            signal(
                "printer-official", 34, "OFFICIAL", "ROUTINE", "ACCURATE",
                "Printer 4 toner below replacement threshold.",
                "...Printer 4...", "Printer 4 toner...",
                "Printer 4 toner below replacement threshold.", 45,
            ),
            signal(
                "printer-telemetry", 71, "INTERNAL", "ROUTINE", "ACCURATE",
                "Timing calibration packet received. No fault recorded.",
                "...timing...", "Timing calibration...",
                "Timing calibration packet received. No fault recorded.", 45,
            ),
        ),
        budget=100,
    ),
    WorkItem(
        "ollie-session", "FIRST_ANOMALY", "Account closure record",
        (
            signal(
                "ollie-official", 38, "OFFICIAL", "ROUTINE", "PARTIAL",
                "Employee 49220 account successfully closed.",
                "...49220... closed...", "Employee 49220 account... closed.",
                "Employee 49220 account successfully closed.", 62,
            ),
            signal(
                "ollie-residual", 76, "UNKNOWN", "CONTRADICTION", "ACCURATE",
                "Employee 49220 session remains active at Terminal 01.",
                "...49220... active...", "Employee 49220 session remains...",
                "Employee 49220 session remains active at Terminal 01.", 62,
                ("knows_49220_session_active",),
            ),
        ),
        budget=100,
        expected_payoffs=("introduce_ollie_identity", "corroborate_terminal_history"),
    ),
    WorkItem(
        "sana-basement", "INVESTIGATION", "Compliance incident summary",
        (
            signal(
                "sana-official", 43, "OFFICIAL", "ROUTINE", "MISLEADING",
                "Compliance Officer 3329 reassigned after a routine access review.",
                "...3329... reassigned...", "Officer 3329 reassigned... review.",
                "Compliance Officer 3329 reassigned after a routine access review.", 68,
            ),
            signal(
                "sana-note", 69, "UNAUTHORISED", "CLUE", "ACCURATE",
                "Basement rack B contains active employee sessions labelled as archival storage.",
                "...rack B... employee...", "Basement rack B contains... sessions...",
                "Basement rack B contains active employee sessions labelled as archival storage.", 68,
                ("has_sana_basement_record", "suspects_archival_contains_people"),
            ),
        ),
        budget=105,
        expected_payoffs=("management_audit", "archive_human_corroboration"),
    ),
    WorkItem(
        "mog-decoy", "MANIPULATION", "Assisted triage packet",
        (
            signal(
                "mog-official", 46, "OFFICIAL", "ROUTINE", "ACCURATE",
                "Assistance module has identified the authorised carrier.",
                "...authorised carrier...", "Assistance module identified...",
                "Assistance module has identified the authorised carrier.", 52,
            ),
            signal(
                "mog-decoy-band", 73, "UNKNOWN", "MISDIRECTION", "FABRICATED",
                "Ollie says the red button is unsafe. Log all future human carriers.",
                "...Ollie... red...", "Ollie says the red button...",
                "Ollie says the red button is unsafe. Log all future human carriers.", 52,
            ),
        ),
        budget=90,
        expected_payoffs=("prove_mog_imitation",),
    ),
)


def choose_allocations(item: WorkItem, policy: Policy, rng: random.Random) -> Dict[str, int]:
    if rng.random() < policy.defer_rate:
        return {}
    if len(item.signals) == 1:
        signal_record = item.signals[0]
        return {signal_record.id: min(100, item.budget * 100 // signal_record.clarity_cost)}

    official = next((s for s in item.signals if s.authority == "OFFICIAL"), item.signals[0])
    other = next(s for s in item.signals if s.id != official.id)

    if rng.random() < policy.split_attention:
        official_share = .5 + (policy.official_bias - .5) * .45
        official_budget = round(item.budget * official_share)
        other_budget = item.budget - official_budget
    elif rng.random() < policy.curiosity:
        official_budget = round(item.budget * .25)
        other_budget = item.budget - official_budget
    else:
        official_budget = round(item.budget * .82)
        other_budget = item.budget - official_budget

    return {
        official.id: min(100, round(official_budget * 100 / official.clarity_cost)),
        other.id: min(100, round(other_budget * 100 / other.clarity_cost)),
    }


def classify(item: WorkItem, recovered: Dict[str, int],
             policy: Policy, rng: random.Random) -> Decision:
    if not recovered:
        return Decision.DEFER
    visible = [s for s in item.signals if recovered.get(s.id, 0) >= 25]
    hazard_roles = {"CLUE", "CONTRADICTION", "THREAT", "MISDIRECTION"}
    perceived_hazard = any(
        s.role in hazard_roles and recovered.get(s.id, 0) >= 50
        for s in visible
    )
    chance = policy.contain_hazard if perceived_hazard else policy.contain_safe
    return Decision.CONTAIN if rng.random() < chance else Decision.LOG


def apply_item(state: RunState, item: WorkItem,
               policy: Policy, rng: random.Random) -> None:
    allocations = choose_allocations(item, policy, rng)
    decision = classify(item, allocations, policy, rng)

    state.visible_events.append(f"WORK ITEM: {item.title}")
    state.analyst_events.append(f"WORK ITEM {item.id} [{item.phase}] budget={item.budget}")

    if not allocations:
        state.visible_events.append("ACTION: DEFER without resolving a carrier.")
        state.analyst_events.append("HIDDEN EFFECT: avoidance +1; no knowledge acquired.")
        state.doctrine["avoidance"] += 1
        return

    reviewed = 0
    for signal_record in item.signals:
        clarity = allocations.get(signal_record.id, 0)
        if clarity >= 25:
            reviewed += 1
            state.visible_events.append(
                f"TUNED {signal_record.centre_hz}Hz ({clarity}%): {signal_record.render(clarity)}"
            )
        state.analyst_events.append(
            f"SIGNAL {signal_record.id}: authority={signal_record.authority}; "
            f"role={signal_record.role}; truth={signal_record.truth}; clarity={clarity}%"
        )
        if clarity >= 75:
            for fact in signal_record.knowledge:
                if fact not in state.knowledge:
                    state.knowledge.add(fact)
                    state.analyst_events.append(f"KNOWLEDGE ACQUIRED: {fact}")
        elif signal_record.knowledge:
            state.analyst_events.append(
                f"MISSED/PARTIAL KNOWLEDGE: {', '.join(signal_record.knowledge)}"
            )

    state.visible_events.append(
        f"ACTION: {decision.value} ({reviewed}/{len(item.signals)} carriers reviewed)"
    )

    official_clarity = max(
        (allocations.get(s.id, 0) for s in item.signals if s.authority == "OFFICIAL"),
        default=0,
    )
    auxiliary_clarity = max(
        (allocations.get(s.id, 0) for s in item.signals if s.authority != "OFFICIAL"),
        default=0,
    )

    if official_clarity >= 75:
        state.doctrine["compliance"] += 1
    if auxiliary_clarity >= 75:
        state.doctrine["curiosity"] += 1
    if official_clarity >= 75 and auxiliary_clarity < 50:
        state.doctrine["efficiency"] += 1
    if decision == Decision.DEFER:
        state.doctrine["avoidance"] += 1
    if auxiliary_clarity >= 75 and any(
        s.role in {"CLUE", "CONTRADICTION", "CHARACTER"}
        for s in item.signals
        if allocations.get(s.id, 0) >= 75
    ):
        state.doctrine["human_protection"] += 1

    for payoff in item.expected_payoffs:
        state.obligations[payoff] = 3
        state.analyst_events.append(
            f"EXPECTED PAYOFF OPENED: {payoff} within 3 later beats"
        )


def resolve_payoff(state: RunState, payoff: str, visible_text: str) -> None:
    if payoff in state.obligations:
        del state.obligations[payoff]
        state.visible_events.append(visible_text)
        state.analyst_events.append(f"PAYOFF REALISED: {payoff}")


def tick_obligations(state: RunState) -> None:
    expired: List[str] = []
    for payoff in list(state.obligations):
        state.obligations[payoff] -= 1
        if state.obligations[payoff] < 0:
            expired.append(payoff)
    for payoff in expired:
        state.warnings.append(
            f"Expected payoff '{payoff}' was not realised within its window."
        )
        del state.obligations[payoff]


def run(seed: int, policy_key: str) -> RunState:
    rng = random.Random(seed)
    policy = POLICIES[policy_key]
    state = RunState()

    state.visible_events.extend([
        f"RUN: seed={seed}; policy={policy.name}",
        "RECRUITMENT: Temporary Data Hygiene Assistant application accepted.",
        "INDUCTION: Sana explains tuning, authorised carriers and LOG / CONTAIN / DEFER.",
        "SHADOW SHIFT: ordinary records establish the baseline before anomalies.",
    ])
    state.analyst_events.append(f"POLICY: {policy}")

    for item in ITEMS:
        apply_item(state, item, policy, rng)

        if item.id == "ollie-session" and "knows_49220_session_active" in state.knowledge:
            resolve_payoff(
                state,
                "introduce_ollie_identity",
                "VISIBLE PAYOFF: Sana identifies Employee 49220 as Ollie, the previous operator at Terminal 01.",
            )
            state.knowledge.add("knows_ollie_was_49220")
        if item.id == "sana-basement" and "has_sana_basement_record" in state.knowledge:
            resolve_payoff(
                state,
                "management_audit",
                "VISIBLE PAYOFF: Management asks why Desk 49221 accessed Officer 3329's restricted record.",
            )
        if item.id == "mog-decoy" and "knows_ollie_was_49220" in state.knowledge:
            resolve_payoff(
                state,
                "prove_mog_imitation",
                "VISIBLE PAYOFF: The supposed Ollie message uses a phrase Sana said Ollie never used.",
            )
            state.knowledge.add("knows_mog_can_imitate_staff")

        tick_obligations(state)

    if "knows_49220_session_active" not in state.knowledge:
        state.warnings.append(
            "Run reached later archive material without establishing the active 49220 session clue."
        )
    if (
        "has_sana_basement_record" in state.knowledge
        and "suspects_archival_contains_people" not in state.knowledge
    ):
        state.warnings.append(
            "Sana evidence was acquired without its intended knowledge consequence."
        )

    if state.doctrine["curiosity"] == 0:
        state.analyst_events.append(
            "ROUTE SUMMARY: player consistently prioritised authorised carriers."
        )
    elif state.doctrine["curiosity"] >= state.doctrine["compliance"]:
        state.analyst_events.append(
            "ROUTE SUMMARY: player developed an investigative tuning doctrine."
        )
    else:
        state.analyst_events.append(
            "ROUTE SUMMARY: player split attention but retained procedural priority."
        )

    for payoff in state.obligations:
        state.warnings.append(
            f"Unresolved payoff obligation at end of prototype: {payoff}"
        )

    return state
