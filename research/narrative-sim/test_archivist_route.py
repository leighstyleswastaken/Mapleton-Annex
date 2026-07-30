from archivist_route import run_archivist


def visible_index(lines: list[str], fragment: str) -> int:
    for index, line in enumerate(lines):
        if fragment in line:
            return index
    return -1


def test_ollie_is_identified_after_first_anomaly() -> None:
    state = run_archivist(1, "archivist")
    anomaly = visible_index(state.visible_events, "Employee account closure")
    identity = visible_index(state.visible_events, "identifies Employee 49220 as Ollie")
    assert anomaly >= 0
    assert identity > anomaly


def test_sana_evidence_has_visible_consequence() -> None:
    state = run_archivist(7, "archivist")
    evidence = visible_index(state.visible_events, "Compliance access review")
    audit = visible_index(state.visible_events, "Management names the exact Sana record")
    assert evidence >= 0
    assert audit > evidence


def test_whistleblower_requires_explicit_release_choice() -> None:
    for seed in range(1, 51):
        state = run_archivist(seed, "archivist")
        ending = next(
            (line for line in state.visible_events if line.startswith("ENDING:")),
            "",
        )
        if "WHISTLEBLOWER" in ending:
            assert visible_index(state.visible_events, "FINAL CHOICE:") >= 0
            assert "knows_ollie_was_49220" in state.knowledge
            assert "has_sana_basement_record" in state.knowledge
            assert "corroborated_archival_contains_people" in state.knowledge
            assert "has_external_leak_window" in state.knowledge


def test_no_payoff_without_setup() -> None:
    for policy in ("loyalist", "archivist", "operator", "sceptic", "avoidant"):
        for seed in range(1, 21):
            state = run_archivist(seed, policy)
            visible = "\n".join(state.visible_events)
            if "identifies Employee 49220 as Ollie" in visible:
                assert "knows_49220_session_active" in state.knowledge
            if "Sana's voice confirms" in visible:
                assert "corroborated_archival_contains_people" in state.knowledge
            if "imitation calls the archive warm" in visible:
                assert "saw_fake_ollie_message" in state.knowledge


def test_every_run_ends_visibly() -> None:
    for policy in ("loyalist", "archivist", "operator", "sceptic", "avoidant"):
        for seed in range(1, 21):
            state = run_archivist(seed, policy)
            assert any(line.startswith("ENDING:") for line in state.visible_events)


if __name__ == "__main__":
    tests = [
        test_ollie_is_identified_after_first_anomaly,
        test_sana_evidence_has_visible_consequence,
        test_whistleblower_requires_explicit_release_choice,
        test_no_payoff_without_setup,
        test_every_run_ends_visibly,
    ]
    for test in tests:
        test()
        print(f"PASS: {test.__name__}")
