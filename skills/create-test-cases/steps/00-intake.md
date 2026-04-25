# Step 0: Intake Questionnaire

## Contract
- **Precondition:** Resume Detector has run; `$TESTOMATIO_EMAIL` + `$TESTOMATIO_PASSWORD` env vars set
- **Input:** $ARGUMENTS, memory, optional existing A1
- **Output:** A1 (`test-cases/{F}/intake.md`)
- **Postcondition:** A1 cheap-validation passes (Q1, Q1.2, Q2 rows present); `F` resolved; `S` optional (may be `pick after map` — resolved after Step 1)
- **Idempotent:** yes — safe to re-run; "start fresh" overwrites, "edit specific" preserves unchanged rows
- **Retry policy:** none (interactive)

---

Run the intake interview from [../intake-questionnaire.md](../intake-questionnaire.md) before any gathering. See [../intake-examples.md](../intake-examples.md) for filled templates.

## Preflight (before Q1)

Verify required env vars are set. Run once:
```bash
echo "email=${TESTOMATIO_EMAIL:?missing TESTOMATIO_EMAIL} pw=${TESTOMATIO_PASSWORD:+SET}"
```
If the shell errors on missing var → STOP and ask user to export both vars before continuing. Do NOT proceed — ui-explorer (Step 1.1 feature-baseline) will fail otherwise, wasting the work done in Step 0.

## Procedure

1. Read the argument and check memory for prior context
2. If `test-cases/{feature-slug}/intake.md` exists → ask: reuse / start over / edit specific answers
3. Run questions with smart-skip (skip what's already knowable; accept `"use defaults"` / `"за замовчуванням"` shortcut)
4. **Q1.2:** Ask if the user has a specific sub-feature in mind for the first run (optional). If yes → record as preferred starting point. If no / `не знаю` / `pick after map` → record as `pick after map`. Either way, Step 1 (feature phase) runs first and produces the sub-feature map; the final `S` is chosen from the approved map before Step 2 starts.
5. Save answers to `test-cases/{feature-slug}/intake.md` (template: intake-questionnaire.md Part 3)

## How answers feed into later steps

| Answer | Used in | Effect |
|---|---|---|
| Q1.1 feature location | Step 1.1 | Where ui-explorer (feature-baseline) starts its traversal |
| Q1.2 sub-feature hint | Step 1.4 / Step 2 | Preferred starting sub-feature after the map is approved; scopes Step 2 slice once chosen |
| Q2 coverage depth | Step 3 | Test case depth and count (smoke / balanced / regression) |
| Q3 sources | Step 1.2 | Which docs/specs to fetch for `_ac-baseline.md` (UI exploration is always on unless user says "no UI") |
| Q4 focus | Step 3 | Extra emphasis tests (security, validation, edge, etc.) |

**Do NOT proceed to Step 1 without a saved intake file.**
