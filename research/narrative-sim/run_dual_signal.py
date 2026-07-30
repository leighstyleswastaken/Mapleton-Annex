from pathlib import Path

from dual_signal_lab import POLICIES, run


OUT = Path(__file__).parent / "outputs" / "dual_signal"
OUT.mkdir(parents=True, exist_ok=True)

for policy_key in POLICIES:
    for seed in (1, 7, 13):
        state = run(seed, policy_key)

        player_lines = ["# Player-experience transcript", ""] + state.visible_events
        analyst_lines = ["# Analyst transcript", ""] + state.analyst_events
        analyst_lines += ["", "## Final knowledge"]
        analyst_lines += [f"- {item}" for item in sorted(state.knowledge)] or ["- None"]
        analyst_lines += ["", "## Doctrine"]
        analyst_lines += [f"- {key}: {value}" for key, value in state.doctrine.items()]
        analyst_lines += ["", "## Warnings"]
        analyst_lines += [f"- {warning}" for warning in state.warnings] or ["- None"]

        stem = f"{policy_key}_seed_{seed}"
        (OUT / f"player_{stem}.md").write_text(
            "\n\n".join(player_lines), encoding="utf-8"
        )
        (OUT / f"analyst_{stem}.md").write_text(
            "\n\n".join(analyst_lines), encoding="utf-8"
        )

print(f"Wrote dual-signal transcripts to {OUT}")
