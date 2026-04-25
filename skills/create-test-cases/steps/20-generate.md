# Step 3: Generate Test Cases

## Contract
- **Precondition:** A1 intake; feature-level `_ac-baseline.md`, `_shared-ui.md`, A2 destructuring map all valid; sub-feature-level A3 `{S}-ac-delta.md`, A4 `{S}-ui-delta.md`, A5 `{S}-scope.md` all valid
- **Input:** all artifacts above + `_existing-steps.md` (if present) + `_style.md` (if present, read FIRST in Phase 2) + product-context.md (JIT)
- **Output:** A6 (single MD or directory per Phase 1 Output decision); optional A7 from reviewer subagent for ≥15-test suites
- **Postcondition:** all Phase 3a bash gates exit 0; Phase 3b ui-validator returns `mismatches fixed, gaps=0`; Phase 4 user approved option 1
- **Idempotent:** yes — regeneration on Phase 4 reject overwrites A6; Phase 3 fixes mutate A6 in place
- **Retry policy:** Phase 4 reject → regenerate (max 3 iterations, then escalate per § Iteration limit)

---

Combines checklist, test case generation, and quality checks into one step.

**Output files:**
- **Flat suite (default):** single file `test-cases/{feature-slug}/{suite-slug}-test-cases.md`
- **Nested suites:** directory `test-cases/{feature-slug}/{suite-slug}/` with one MD file per section (e.g., `runs-list.md`, `run-detail-view.md`). See [../references/test-case-format.md](../references/test-case-format.md) § Nested Suites for format.

**Format:** [../references/test-case-format.md](../references/test-case-format.md) | **Step rules:** [../references/testing-strategy.md § 3](../references/testing-strategy.md) | **Priority:** [../references/testing-strategy.md § 8](../references/testing-strategy.md) | **Roles:** [../references/product-context.md § User Roles](../references/product-context.md)

## Phase 0: Cross-Cutting Concerns Input

Read `test-cases/{F}/destructuring.md` § Cross-cutting concerns. For each concern that lists the current sub-feature in "Affects":
- Add its "Must-test scenarios" to the checklist as mandatory items
- These become dedicated test cases in Phase 2, not just steps inside other tests

Cross-cutting analysis is done once at the feature level (Step 1.4) and consumed by every sub-feature. Destructuring is the default flow — no mode switch.

## Phase 1: Checklist

Generate a categorized checklist from combined inputs:
- **ACs** = `_ac-baseline.md` filtered by A3 `baseline_acs_applicable` + A3 delta ACs
- **UI** = `_shared-ui.md` (feature-level) + `{S}-ui-delta.md` (sub-feature-specific)
- **Reusable steps** = `_existing-steps.md` (if present)
- **Cross-cutting must-test scenarios** from Phase 0

Shape driven by Q2 (coverage depth). Q4 focus areas add emphasis.

Apply three consolidation passes in order — **definitions and rules live in [../references/testing-strategy.md](../references/testing-strategy.md), do not restate here**:
1. **E2E pass** — see [../references/testing-strategy.md § 1.3](../references/testing-strategy.md)
2. **Parameterization pass** — see [../references/testing-strategy.md § 5.5](../references/testing-strategy.md)
3. **Grouping pass (mandatory, fully automatic)** — assign every checklist item to a section. Sections come from AC list themes and UI catalog screens (CRUD, Search & Filter, Permissions, Validation, Edge Cases, Multi-environment, etc. — see SKILL.md § Sub-suite Distribution Rule for what counts as a natural section). Then apply the decision matrix:
   - Count sections + tests-per-section
   - If any section has < 3 tests → **auto-merge** it into the closest semantically related section (do NOT ask user); re-evaluate
   - Pick output mode per matrix: **nested** (≥ 2 sections of ≥ 3 tests after merging) or **flat** (otherwise)
   - Record the decision in a 1-line note at the top of the checklist: `Output: nested | sections: 3 (CRUD: 5, Permissions: 4, Validation: 3)` or `Output: flat | reason: only 1 natural section`
   - Phase 2 reads this header and generates the correct file layout — flat MD or directory of section MDs

## Phase 2: Full Test Cases

**Style carryover (read FIRST).** Before writing any test, check whether `test-cases/{F}/_style.md` exists:
- **Exists** → Read it. Match its conventions exactly — preconditions phrasing, step granularity, voice, element references, title pattern, parameterization rule, tag usage. The file was written after the first sub-feature of this feature was approved by the user; honoring it keeps the whole feature stylistically consistent.
- **Does not exist** → this is the first sub-feature of the feature. Proceed; Step 4 will capture style after user approval so the next sub-feature inherits it.

**Reusable step phrases.** If `_existing-steps.md` exists, prefer matching its phrasings when semantically equivalent rather than inventing new wording. Reduces step-library churn on publish.

Convert checklist into detailed test cases with metadata:
- `priority` via impact×frequency matrix, `source` (AC traceability), `automation` classification, `automation-note`
- Preconditions (exact role + data requirements)
- Steps with `_Expected_:` after each action
- Tags in title (`@smoke`, `@negative`, etc.)

**Hard rules:**
- **NEVER generate IDs** — no `id: @S...` / `id: @T...`, server assigns them
- **E2E format, min-3-steps, parameterization** — enforce per [../references/testing-strategy.md § 1.3](../references/testing-strategy.md) (E2E + min steps) and [§ 5.5](../references/testing-strategy.md) (parameterization). Do not restate the rules here.
- Splitting/merging during step writing is allowed when it improves quality
- Emphasize Q4 focus areas, write in English

## Phase 3: Built-in Quality Checks

Split into 3a (mechanical checks on MD) + 3b (UI reality check in browser). Both MUST run before Phase 4. Thresholds are blocking for suites ≥15 tests, advisory for smaller suites (see self-review-checks.md intro).

### Phase 3a: Mechanical checks (LLM table)

Row execution rule depends on suite size:

| Suite size | How to run 3a |
|---|---|
| **< 15 tests** | Execute each row inline during generation |
| **≥ 15 tests** | **Mandatory delegation** to `test-case-reviewer` subagent — running inline compacts the parent context and LLM starts missing cross-test connections mid-review (observed regression). Pass the test-cases MD path; subagent returns 1-line `Reviewed <path>: <V> violations, fixed=<F>` and writes a violations report. See [../../agents/test-case-reviewer.md](../../../agents/test-case-reviewer.md) |

| Check | Threshold | Detail § | Action if failing |
|---|---|---|---|
| AC coverage | All ACs covered; if `(inferred)` → cross-check with product-context.md | [§ 1](../references/self-review-checks.md#1-coverage) | Add missing tests |
| Cross-cutting coverage | Each affected concern from destructuring.md has ≥1 dedicated test | [§ 1b](../references/self-review-checks.md#1b-cross-cutting-coverage-from-destructuringmd) | Add tests for uncovered concerns |
| UI element coverage | ≥80% elements in action steps (not just preconditions) | [§ 1](../references/self-review-checks.md#1-coverage) | Add tests or flag unused elements |
| Scope compliance | No tests under OUT OF SCOPE items from Step 2.4 (A5) | [§ 2](../references/self-review-checks.md#2-scope-compliance-from-step-14) | STOP and ask user |
| Scenario balance | per [../references/testing-strategy.md § 2.3](../references/testing-strategy.md) | [§ 3](../references/self-review-checks.md#3-balance) | Rebalance before finalizing |
| Semantic balance | Each negative/boundary/role test is genuine by content, not just tag | [§ 3](../references/self-review-checks.md#3-balance) | Reclassify, then re-check thresholds |
| Priority pyramid | critical ≤15%, high ≤35%, normal ≥35%, low ≥5% | [§ 3](../references/self-review-checks.md#3-balance) | Recalibrate priorities |
| Step quality | Atomic, observable, independent, ≥3 steps | [§ 4](../references/self-review-checks.md#4-step-quality) | Fix inline |
| E2E + parameterization | 100% E2E, 0 unmerged candidates | [§ 6](../references/self-review-checks.md#6-e2e--parameterization) | Consolidate |
| **Sub-suite distribution** | If 2+ natural sections of ≥3 tests exist → MUST be nested (regardless of total count) | [§ 8](../references/self-review-checks.md#8-sub-suite-distribution) | Re-run Phase 1 Grouping pass with auto-merge of undersized sections |
| Automation readiness | 100% classified, ≤30% manual-only | [§ 7](../references/self-review-checks.md#7-automation-readiness) | Add fields |

**Loading rule:** Read self-review-checks.md only when (a) a check row's mechanic is unclear from the table, or (b) you hit a borderline case. Use anchor links to load just the section, never the whole file.

**Borderline escalation:** if a Scope-compliance check hits a test whose AC mapping is ambiguous ("maybe in scope, maybe out") → STOP and ask user. Do not silently include or silently drop — the Step 2.4 scope contract (A5) is the source of truth; update it if needed.

### Phase 3a — deterministic Bash gate checks

After (or instead of, for ≥15-test suites via subagent) the mechanical table above, run the Bash gate batch. These gates are **blocking regardless of suite size** — they fail fast on issues that the LLM self-review regularly misses.

**Full gate definitions + commands:** [../references/artifacts.md § Phase 3a gate-check recipes](../references/artifacts.md#phase-3a-gate-check-recipes). The skill invokes them via a single block:

```bash
# SET F and S before running
F="{feature-slug}"
S="{suite-slug}"
# Resolve A6 path (flat vs nested)
if [ -f "test-cases/$F/$S-test-cases.md" ]; then
  MDS=("test-cases/$F/$S-test-cases.md")
elif [ -d "test-cases/$F/$S" ]; then
  MDS=(test-cases/$F/$S/*.md)
else
  echo "GATE-FAIL: A6 not found"; exit 1
fi
MD="${MDS[0]}"

# Run gates — each exits non-zero on violation
fail=0
# Gate 1: AC coverage — applies to baseline ACs applicable to this sub-feature + delta ACs
# See artifacts.md § Gate 1 for full script. Inline version:
bash -c '
  set -e
  base_acs=$(awk "/^baseline_acs_applicable:/{sub(/^baseline_acs_applicable: *\[/, \"\"); sub(/\].*$/, \"\"); gsub(/,/, \" \"); gsub(/ +/, \" \"); print; exit}" "test-cases/'"$F"'/'"$S"'-ac-delta.md")
  delta_acs=$(grep -oE "^ac-delta-[0-9]+" "test-cases/'"$F"'/'"$S"'-ac-delta.md" | sort -u)
  for ac in $base_acs $delta_acs; do
    [ -z "$ac" ] && continue
    grep -qE "^source:.*\b$ac\b" '"${MDS[@]}"' || { echo "GATE-1 uncovered: $ac"; exit 1; }
  done
' || fail=$((fail+1))

# Gate 5: no forbidden metadata
grep -qE '^(tags|labels):' "${MDS[@]}" && { echo "GATE-5 forbidden tags/labels: header fields"; fail=$((fail+1)); }

# Gate 9: no id field
grep -qE '^id: @[ST]' "${MDS[@]}" && { echo "GATE-9 forbidden id field"; fail=$((fail+1)); }

# Gate 11: no impl leakage (CSS / icon class / data-test-id / inline AC / raw exploit payload)
# See artifacts.md § Gate 11 for full awk script
bash -c 'set -e; SCRIPT=$(sed -n "/^### Gate 11/,/^### Gate 12/p" .claude/skills/create-test-cases/references/artifacts.md | sed -n "/```bash/,/```/p" | sed "1d;\$d"); eval "$SCRIPT"' || fail=$((fail+1))

# Gate 12: parameterized title references ${col}
bash -c 'set -e; SCRIPT=$(sed -n "/^### Gate 12/,/^### Gate 13/p" .claude/skills/create-test-cases/references/artifacts.md | sed -n "/```bash/,/```/p" | sed "1d;\$d"); eval "$SCRIPT"' || fail=$((fail+1))

# Gate 13: no process-metadata sections (## Validation Log, ## Review Log, TODO, placeholders) leaked into test MD
bash -c 'set -e; SCRIPT=$(sed -n "/^### Gate 13/,/^---/p" .claude/skills/create-test-cases/references/artifacts.md | sed -n "/```bash/,/```/p" | sed "1d;\$d"); eval "$SCRIPT"' || fail=$((fail+1))

# (Gates 2, 3, 4, 6, 7, 8, 10 — see artifacts.md for full commands; run the same pattern)

if [ $fail -gt 0 ]; then
  echo "Phase 3a gates: $fail violations — routing back to regeneration"
  exit 1
fi
echo "Phase 3a gates: PASS"
```

**Routing on gate failure:**
- **Gates 1, 3, 4, 6, 7, 8 (content violations)** → regenerate the flagged tests in place, re-run gates (max 2 auto-regeneration attempts, then escalate to user)
- **Gate 2 (priority pyramid)** → recalibrate priorities (ask LLM to downgrade lowest-impact critical/high to normal), re-run gate
- **Gates 5, 9 (forbidden fields)** → strip the fields from A6 in place, no regeneration needed
- **Gate 10 (layout mismatch)** → re-run Phase 1 Grouping pass with the correct Output mode, then regenerate Phase 2
- **Gate 11 (impl leakage)** → strip CSS classes / icon classes / `data-test-id` / `aria-describedby` / inline AC refs / raw exploit payloads from the flagged Steps and `_Expected_:` lines in place. Rewrite the affected lines semantically (label, tooltip, role, visual state). No test-count change. Re-run gate. See [../references/test-case-format.md § Anti-patterns in test case bodies](../references/test-case-format.md) for rewrite patterns.
- **Gate 12 (parameterized title missing `${col}`)** → rewrite the flagged test title to reference at least one column from its `<!-- example -->` header via `${col_name}` (e.g. `## Mark test as PASSED with each sub-status` → `## Mark test as PASSED with each ${sub_status}`). No Steps change. Re-run gate.
- **Gate 13 (process-metadata leak)** → strip the offending H2 block / placeholder / dev-marker from the test MD. Investigate the producing subagent's output path: `ui-validator` must write to `{S}-validation-log.md` (A8), `test-case-reviewer` must write to `{S}-review.md` (A7). If the subagent definition still points to the wrong path → fix the agent definition, not just the symptom. **Not auto-fixable** by the skill. Re-run gate after manual cleanup. Regression origin: 2026-04-20 — 20 files leaked `## Validation Log` from ui-validator.

**Do NOT proceed to Phase 3b or Phase 4 while any gate fails.** If user explicitly overrides a gate (e.g. accepts a <15-test skew) → log the override in A6 as a comment line `<!-- gate-override: Gate-2 priority pyramid waived by user 2026-04-16 -->`.

### Phase 3b: UI reality check — always via `ui-validator` subagent

Element names and step mechanics cannot be verified from the MD alone — they must be walked through the real UI. Same isolation pattern as ui-explorer: Playwright dumps stay in the subagent, parent sees only a 1-line summary.

| Check | Threshold | Detail § | Action if failing |
|---|---|---|---|
| **UI reality check** | Walk 2-3 tests step-by-step in browser via `ui-validator` subagent. Covers element-name accuracy, step mechanics, toast text | [§ 5](../references/self-review-checks.md#5-ui-reality-check-playwright) | Fix steps, toasts, element names that don't match real UI |

Invoke via the Agent tool with `subagent_type: ui-validator`. Pass test-cases MD path + UI catalog path. Subagent walks 2-3 tests in Playwright, edits the MD in-place to fix mismatches, returns: `Validated <path>: <K> tests walked, <M> mismatches fixed, gaps=<count>`. See [../../agents/ui-validator.md](../../../agents/ui-validator.md).

**Never run 3b inline in the parent** — Playwright snapshots will compact the conversation mid-generation.

## Phase 4: Present to User

Show: test count, priority distribution, scenario balance, AC/UI coverage, automation split. Then unified menu:

```
1. 👍 Approve — save MD, hand off to /publish-test-cases-batch
2. ➖ Less detail — drop boundary/rare edge cases
3. ➕ More detail — add boundaries, state transitions, role checks
4. ✏️ Edit — rename / add / remove specific tests
```

**On option 1 (Approve):** save A6, go directly to Step 4 (final report + publish handoff). This skill never pushes — the Step 4 handoff line tells the user which `/publish-test-cases-batch` invocation to run next.

**Iteration limit:** Phase 4 is the **single approval gate** (no separate presentation phase). If the user rejects / requests changes **3 times in a row** → STOP the loop and ask: "We've iterated 3 times — is there a scope or strategy issue I'm missing? Options: (a) revisit Step 2.4 scope contract (A5), (b) change Q2 coverage depth, (c) accept current state and hand off." Do not silently keep regenerating.

## Automation Classification

Every test MUST include `automation` and optionally `automation-note` metadata per [../references/test-case-format.md](../references/test-case-format.md).

| Classification | When | Examples |
|---|---|---|
| `candidate` | Single-user flow, standard UI, deterministic | Form fill + submit, CRUD, click + verify toast |
| `deferred` | Automatable but needs infrastructure | Multi-user, email verification, specific file formats |
| `manual-only` | Not cost-effective or needs human judgment | Visual layout, subjective UX, complex drag-and-drop |

Default to `candidate` when unsure. `automation-note` required for `deferred` and `manual-only`.

## Traceability

Every test links to at least one AC via `source` metadata: `source: AC-2, AC-3`. No AC match → `source: exploratory`. Multiple exploratory = likely scope drift.

## Matching Existing Style

If the argument (Q1) is a Testomat suite URL, or Q3 sources include links to an existing suite: match writing style, detail level, title patterns, language. Do NOT copy feature-specific prefixes or outdated element names.
