# Step 2: Sub-feature Slice — thin layer on top of feature baselines

## Contract
- **Precondition:** A1 valid; feature phase complete (A-shared-ui, A-base, A2 all present and valid); `F` and `S` resolved from A2 sub-feature map
- **Input:** `_ac-baseline.md`, `_shared-ui.md`, `_existing-steps.md` (if exists), A2 sub-feature row (ownership + does-not-own + key elements), intake Q4 focus areas
- **Output:** A3 (`{S}-ac-delta.md`), A4 (`{S}-ui-delta.md`), A5 (`{S}-scope.md`)
- **Postcondition:** all three cheap-validations pass; AC↔UI cross-validation (using combined baseline + delta) has 0 unresolved gaps or gaps explicitly accepted in 2.4
- **Idempotent:** yes — existing delta artifacts are reused on spot-check, regenerated otherwise
- **Retry policy:** `ui-explorer` subagent failure → 1 retry then escalate; baseline files missing → escalate to user to re-run Step 1

---

## Purpose

The sub-feature phase is **thin**. Heavy exploration and AC extraction happened once in Step 1 and live in the feature-level `_*.md` files. This step only captures what is **specific to the current sub-feature** and builds the scope contract that Step 3 will generate tests against.

**Context invariant:** every sub-feature phase runs in its own conversation (HARD STOP in Step 4 after previous sub-feature). Keeping Step 2 thin preserves context for Step 3 generation.

## Substep dependency map

| # | Input | Output | Tool / Owner | Depends on |
|---|---|---|---|---|
| 2.1 | A-base, A2 sub-feature row, Q4 | A3 `{S}-ac-delta.md` | parent (inline) | — |
| 2.2 | A-shared-ui, A3 (2.1), A2 sub-feature row | A4 `{S}-ui-delta.md` | **ui-explorer** subagent, `mode: sub-feature-delta` | 2.1 |
| 2.3 | A3 + A4 + A-shared-ui + A-base | combined cross-validation report | parent (inline) | 2.1, 2.2 |
| 2.4 | A3 + A4 + A2 + cross-validation | A5 `{S}-scope.md` | parent (inline, single user gate) | 2.3 |

2.1 runs first (AC delta drives UI focus). 2.2 then 2.3 then 2.4 strictly sequentially.

---

## 2.1 AC delta — `{S}-ac-delta.md`

**Read `_ac-baseline.md`** once (entire file — it's small, flat AC list).

**Filter applicable baseline ACs:** for each `AC-N` in the baseline, decide whether this sub-feature must cover it. Use the A2 sub-feature row:
- `Owns:` → strong signal AC applies
- `Does NOT own:` → strong signal AC belongs to another sub-feature
- `Key elements:` → if AC mentions one of these elements, AC applies
- Cross-cutting concerns from A2: if the current sub-feature is listed under "Affects" → the concern's must-test scenarios add ACs

**Identify delta ACs:** requirements that the baseline did NOT capture but that emerge from either:
- sub-feature-specific docs (deeper links not fetched at feature level)
- UI observations during 2.2 (iterate — may need to append here after ui-delta)
- Q4 focus areas specific to this sub-feature

Write A3 per [../references/artifacts.md § A3](../references/artifacts.md) at `test-cases/{F}/{S}-ac-delta.md`:

```yaml
---
feature: {F}
suite: {S}
references: _ac-baseline.md
baseline_acs_applicable: [AC-3, AC-7, AC-12]
delta_ac_count: N
source: inferred | docs | mixed
---

## Baseline ACs applicable to {S}
- AC-3 (baseline)
- AC-7 (baseline)
- AC-12 (baseline)

## Delta ACs (sub-feature-specific)

ac-delta-1: {new requirement}
ac-delta-2: ...
```

Cheap-validation must pass before 2.2.

**Edge case:** sub-feature has zero applicable baseline ACs → either (a) destructuring map is wrong, or (b) this sub-feature is truly orthogonal. Flag to user BEFORE continuing — don't silently generate only from delta.

---

## 2.2 UI delta — `ui-explorer` subagent, mode: sub-feature-delta

Invoke via Agent tool with `subagent_type: ui-explorer`. The subagent receives the shared catalog path and writes ONLY elements specific to this sub-feature — it does not re-catalog shared chrome.

**Prompt must include:**
- `feature_slug`, `suite_slug`
- `entry_url` — sub-feature-specific entry (from A2 sub-feature row) or Q1.1 if no sub-entry
- `scope_summary` (from A2 sub-feature `Owns:` + `Does NOT own:`)
- `mode: sub-feature-delta`
- `shared_catalog_path: test-cases/{F}/_shared-ui.md` — subagent reads this first to know what NOT to re-catalog
- `ac_list_path: test-cases/{F}/{S}-ac-delta.md` — for AC-focused exploration and self-check
- `output_catalog_path: test-cases/{F}/{S}-ui-delta.md`

**Reuse:** If `{S}-ui-delta.md` already exists, pass `existing_catalog_path` — subagent spot-checks 3-5 delta elements and reuses or regenerates.

**Subagent contract:** writes delta per [../references/artifacts.md § A4](../references/artifacts.md). Returns ONE line:

```
Delta <written|reused> to <path>: <N> delta elements, <K> verified flows, gaps=<count>
```

**After subagent returns:**
1. Parse the 1-line summary; if `gaps > 0` → flag for 2.3 cross-validation
2. Run cheap validation on frontmatter (`head -20` + `awk`): `mode: sub-feature-delta` + `references: _shared-ui.md` + `delta_elements` present
3. `delta_elements: 0` is allowed but rare — confirm with user

**Fallback:** subagent fails twice → STOP and escalate. Do NOT run inline Playwright.

---

## 2.3 Cross-validation (combined baseline + delta)

Work out of both AC sources and both UI sources:
- AC pool: `baseline_acs_applicable` (from A3 frontmatter, resolved against A-base body) ∪ delta ACs (from A3 body)
- UI pool: A-shared-ui body ∪ A4 delta body

Steps:
1. **AC → UI:** for each AC in the combined pool, verify ≥1 element in the combined UI pool supports it. Missing support → either catalog is incomplete or AC is unreachable in UI (out-of-scope candidate).
2. **UI → AC:** for each delta UI element (A4), verify it maps to ≥1 AC. Unmapped delta elements → add an inferred delta AC or mark out-of-scope.
3. **Shared-UI elements** are not individually checked here — the feature phase already validated their coverage at the baseline level. But if an AC in the current sub-feature's applicable set has no coverage in either shared or delta UI → the shared catalog is incomplete; escalate to user to extend `_shared-ui.md` or to re-explore.

Report gaps before 2.4. If >0 AC→UI gaps that cannot be resolved by re-invoking `ui-explorer` once (appending to A4) → surface to user in 2.4 with resolution options.

---

## 2.4 Scope contract + single user gate → A5

**ONE user presentation** combining: applicable baseline ACs, delta ACs, UNCLEAR ACs, IN SCOPE (each maps to AC), OUT OF SCOPE (each with justification), sources summary.

Ask user to confirm or edit. **On approval** — save A5 per [../references/artifacts.md § A5](../references/artifacts.md) at `test-cases/{F}/{S}-scope.md` with sections `## In Scope`, `## Out of Scope`, `## Unclear ACs`, `## Sources Used`.

Step 3 Phase 3a scope-compliance gate reads this file; `test-case-reviewer` subagent does the same.

On user approval → proceed directly to Step 3 (no HARD STOP here — Step 3 generation is the same conversation).
