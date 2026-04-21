# Coverage Self-Review — Check Definitions

Detailed definitions for the 9 check groups used in [SKILL.md Step 2 Phase 3](../SKILL.md). Each group is **blocking** — fix during generation before presenting to user.

**Loading guidance:** This file is **reference detail, not a runbook**. SKILL.md Phase 3 has the running check table. Only load specific sections of this file (via anchor links from the Phase 3 table) when you hit a borderline case or need to clarify mechanics. Do NOT eagerly Read the full file — it wastes parent context.

**Small suite exception (< 15 tests):** percentage thresholds in checks #3 (balance) and #6 (E2E) become **advisory** — report violations but do not block. With 10 tests, one test off makes 10% swing, so strict thresholds are impractical. Still aim for the targets.

**Quick pre-check** (run before the 6 mechanical checks):
- Every test starts with a user action (not "Verify..." / "Check...")
- Every step has `_Expected_:` with observable result
- All UI element names match the catalog exactly
- No 3+ tests with identical setup that should be consolidated or parameterized

## Section map (anchor-based — stable across edits)

Extract ONE section via a single `awk` call — never Read the whole file:

```bash
awk '/^START_PATTERN/,/^END_PATTERN/' .claude/skills/create-test-cases/references/self-review-checks.md
```

| § | Topic | START pattern | END pattern (exclusive) |
|---|---|---|---|
| 1 | Coverage (UI / AC / inferred AC) | `^## 1\. Coverage` | `^## 1b\. ` |
| 1b | Cross-Cutting Coverage | `^## 1b\. Cross-Cutting` | `^## 2\. ` |
| 2 | Scope Compliance | `^## 2\. Scope Compliance` | `^## 3\. ` |
| 3 | Balance (scenario + semantic + priority) | `^## 3\. Balance` | `^## 4\. ` |
| 4 | Step Quality | `^## 4\. Step Quality` | `^## 5\. ` |
| 5 | UI Reality Check (Playwright) | `^## 5\. UI Reality` | `^## 6\. ` |
| 6 | E2E + Parameterization | `^## 6\. E2E` | `^## 6b\. ` |
| 6b | Implementation Leakage | `^## 6b\. Implementation` | `^## 7\. ` |
| 7 | Automation Readiness | `^## 7\. Automation` | `^## 8\. ` |
| 8 | Sub-suite Distribution | `^## 8\. Sub-suite` | `^## Output Format` |
| — | Output Format (report template) | `^## Output Format` | end-of-file (use `awk '/^## Output Format/{p=1} p'`) |

---

## 1. Coverage

### UI element coverage (from Step 1.3 catalog)
- Count buttons/toggles/inputs/tabs in catalog
- Count how many are referenced in at least one test step
- Flag unused elements: *"Buttons referenced: 12/14 (unused: **'Import'**, **'Export'**)"*
- Flag toasts not asserted: *"Toasts asserted: 5/7 (missing: `"Label has been updated"`, `"Label deletion failed"`)"*

### AC coverage (from Step 1.1 AC list)
- For each AC, count linked tests via `source` field
- Flag uncovered: *"AC-4 NOT COVERED"*
- Flag over-covered (>5 tests per AC) as possible redundancy

### Independent AC validation (when AC list is `(inferred)`)
When ACs were built from UI exploration (not from docs/specs), cross-check against [product-context.md](product-context.md) entity operations:
- For each entity involved in the feature, verify the AC list covers: **Create, Read, Update, Delete** (where applicable)
- Check entity relationships: if entity A affects entity B (e.g., deleting a label removes it from tests), verify an AC exists for the cross-entity behavior
- Compare with role-based rules: verify ACs exist for permission-denied scenarios (at minimum: read-only user)
- Flag gaps: *"Entity 'Run' has no AC for Update operation"*, *"No cross-entity AC for Plan→Run relationship"*
- This reduces circular dependency — product-context.md provides an independent checklist that the UI exploration may have missed

---

## 1b. Cross-Cutting Coverage (from destructuring.md)

`destructuring.md` is always produced by Step 1 (feature phase) under the feature-first flow, so this check is always on. If the file is missing → treat as a Step 1 precondition violation, not a skip.

Read the `Cross-cutting concerns` section from `destructuring.md`. For each concern that lists the **current sub-feature** in its "Affects" field:
- Verify at least 1 test exists that exercises the variant flow (not just mentions the element in preconditions)
- The test must **activate the modifier** (e.g., select 2+ environments) and verify the **changed behavior** in this sub-feature's scope

**Flag format:** *"Cross-cutting concern '{name}' affects this sub-feature but has 0 dedicated tests"*

**Blocking:** any affected concern with 0 tests → add at least 1 test before proceeding.

**Example:** If concern "Multi-environment" says `Affects: #2 Run Execution (N parallel runs, env context during execution)` and the current suite is Run Execution → at least 1 test must select 2+ environments and verify environment-specific execution behavior.

---

## 2. Scope Compliance (from Step 1.4)

- Verify no test falls under OUT OF SCOPE items
- If any do → flag and ask user before proceeding

---

## 3. Balance

### Scenario type balance
- **Category definitions and thresholds:** see [testing-strategy.md § 2.3](testing-strategy.md) — single source of truth. Do not restate here.
- **Mechanics:** count tests per category (happy / negative / boundary / state / role), compute %, compare to thresholds in § 2.3
- Flag skew: *"80% happy path — under-testing error cases"*

### Semantic balance validation (anti-gaming)
Classify tests by **content**, not by tag — verify each category is genuine:
- **Negative** = test where the user action **fails, is denied, or produces an error**. If the test ends with a success outcome → it's NOT negative regardless of tag
- **Boundary** = test where input is **at or beyond a limit** (0, 1, max, max+1, empty, whitespace-only, special chars). If the input is a normal valid value → it's NOT boundary
- **Role-based** = test where the **same action is performed by a different role** with a different expected outcome. If the role doesn't affect the outcome → it's NOT role-based
- Flag misclassified: *"t.12 tagged @negative but ends with success toast — reclassify as happy path"*
- Re-check thresholds after reclassification

### Priority distribution ([testing-strategy.md § 8](testing-strategy.md))
- **Healthy pyramid:** `critical` ≤ 15%, `high` ≤ 35%, `normal` ≥ 35%, `low` ≥ 5%
- Flag inverted pyramid or high overload
- All 4 thresholds are blocking — fix before proceeding

---

## 4. Step Quality

### Atomic step check
- Grep for step lines containing ` and `, ` then `, ` after which ` — compound steps
- Flag each for splitting

### Observable expected result check
- Grep for `_Expected_:` lines matching vague patterns (full banned list — see [testing-strategy.md § 3.3](testing-strategy.md)):
  `is saved`, `works`, `is correct`, `should work`, `updates`, `approximately`, `correctly`, `appropriately`, `properly`, `as expected`, `works fine`
- Flag each for rewording to observable state (toast text, element visibility, counter value, specific user avatar on a named test)
- **Blocking:** any match → fix before proceeding

### Test independence
- Flag tests whose Preconditions reference "previous test" or "after test X"

### Minimum step count ([testing-strategy.md § 1.3](testing-strategy.md))
- Count standalone tests with < 3 steps
- Flag each: *"t.5 has 1 step — add navigation context or merge with t.4"*
- **Blocking:** if >20% of standalone tests have < 3 steps → fix before proceeding

### Precondition role names ([product-context.md § User Roles](product-context.md))
- Scan all `**Preconditions:**` lines for role names
- Verify every role matches the "Role" column in product-context.md (`owner`, `manager`, `QA`, `read-only user`)
- Flag internal code names: `mainUser`, `qaUser`, `managerUser`, `readonlyUser`
- Flag missing role: *"t.3 precondition has no role specified"*
- **Blocking:** any internal code name found → replace before proceeding

---

## 5. UI Reality Check (Playwright)

Pick 3 tests representing different categories: 1 happy-path, 1 negative, 1 boundary or complex flow. Open browser via Playwright MCP and execute each test step-by-step literally.

For each step:
- Perform the exact action described
- Compare `_Expected_:` with what actually happens in the UI
- Flag mismatches: wrong toast text, missing dialog, element not visible, wrong navigation

**Common catches:**
- Toast text is different from what was written (e.g., `"Run saved"` vs actual `"Run has been saved"`)
- A confirmation dialog appears that the test doesn't mention
- An element is only visible after scrolling or expanding a section
- Navigation goes to a different URL than expected
- A loading state blocks the next action (missing wait step)

**Blocking:** if any test has >1 step mismatch → fix all mismatches in MD, then re-verify the fixed steps.

---

## 6. E2E + Parameterization

### E2E format compliance ([testing-strategy.md § 1.3](testing-strategy.md))
- Scan every test title: if it starts with a noun/adjective describing UI state → NOT E2E
- Flag titles matching: `"X is visible..."`, `"X is active..."`, `"X shows..."` (without prior user action)
- Group tests by entry point + first 2 steps: if 3+ share them → flag as consolidation candidates
- **Blocking:** if >20% of tests fail E2E check → fix first

### Cross-screen outcome verification ([testing-strategy.md § 1.6](testing-strategy.md))
- For each test whose `source` references an AC with outcome verbs (`applied`, `distributed`, `assigned`, `saved`, `created`, `deleted`, `updated`, `launched`): scan the steps
- If the last step is a button click (Launch / Save / Submit / Delete / Assign / Finish) without a follow-up step that inspects the resulting screen (`execution page`, `detail page`, `list`, `tree`) → flag
- Flag format: *"t.X source references 'distributed' but steps stop at 'Click Launch' — add step that inspects execution page with concrete match (specific test + specific avatar)"*
- Exception: test title explicitly says it's about modal behavior (`"...button text updates"`, `"...strategy selector disappears"`) — declare the modal-only scope in the title
- **Blocking:** any outcome test that stops at the action button → fix before proceeding

### Parameterization check ([testing-strategy.md § 5.5](testing-strategy.md))
- Group tests by identical first 2 steps
- If 3+ in a group differ only by input data → flag as parameterization candidates
- **Blocking:** if parameterization candidates exist → consolidate before proceeding

### Parameterized title check ([test-case-format.md § Parameterized title rule](test-case-format.md))
- For every test that has an `<!-- example -->` block with parameter columns, scan the test title for `${col_name}` syntax referencing at least one column from that example block
- Flag tests whose title is missing all `${col}` placeholders: *"t.7 has example block with columns [sub_status, hotkey] but title uses no `${}` — each row would render with an identical title"*
- **Blocking:** any parameterized test without `${col}` in the title → fix before proceeding

---

## 6b. Implementation Leakage

**Blocking** — anything on this list must be stripped from test titles, Steps, and `_Expected_:` before proceeding. These belong in `ui-elements.md` (LLM cross-check context) only, never in the generated test case body. Full anti-pattern table: [test-case-format.md § Anti-patterns in test case bodies](test-case-format.md).

Run these greps across the generated MD file(s) and flag every hit:

| Grep pattern | Leaks |
|---|---|
| `\b(bg-\|text-\|ring-\|hover:\|focus:)[a-z0-9-]+` | Tailwind-style CSS class names |
| `\bmd-icon-[a-z-]+` | MDI icon class names |
| `\.[a-z-]+-icon\|\.keyboard-shortcut-[a-z-]+` | Class-selector leak |
| `data-test-id\|aria-describedby\|aria-labelledby` | Selector / automation-flavored attributes |
| `\(AC-[0-9]+\)` or `\bAC-[0-9]+\b` inside Steps or `_Expected_:` lines | Inline AC refs (they belong in `source:` frontmatter only) |
| `<script[ >]\|<img[^>]*onerror\|<iframe[^>]*onload` inside Steps or `_Expected_:` | Raw exploit payloads pasted into tester instructions |

**How to fix:** replace with semantic descriptions (tooltip text, visual state prose, role/position). See the mapping table in `test-case-format.md`.

**Note:** AC refs in the `<!-- test -->` frontmatter `source:` field are **correct** — the grep must target Step/Expected lines only, not the frontmatter.

---

## 7. Automation Readiness

- Count tests by `automation` field: candidate, deferred, manual-only
- Flag missing classification
- Report distribution: *"Automation: candidate 45 (55%), deferred 25 (31%), manual-only 11 (14%)"*
- If >30% manual-only → flag for review

---

## 8. Sub-suite Distribution

**Single source of truth for the rule. All other mentions in SKILL.md / test-case-format.md / subagents must be stubs that link here.**

**Why this exists:** testers reported flat suites are unnavigable — even at 6-10 tests, mixed CRUD + Permissions + Edge Cases without structure forces them to scan the whole list. The trigger is whether **logical sections exist**, not how many tests there are.

### Decision matrix (fully automatic, no user prompt)

| Natural sections found | Section sizes (after auto-merge) | Output |
|---|---|---|
| ≥ 2 sections | every section ≥ 3 tests | **Nested** — directory with one MD file per section (**MANDATORY**) |
| ≥ 2 sections | one or more sections < 3 tests | **Auto-merge** undersized into nearest semantic neighbour, re-apply matrix |
| 0-1 sections | — | **Flat** — single MD file |

**No user questions on borderline cases.** Auto-merge silently (e.g. "Edge Cases: 2" + "Boundaries: 4" → "Boundaries & Edge Cases: 6"). Phase 4 approval gate is the user's chance to push back. Total test count is **NOT** part of the decision.

### What counts as a "natural section"

A coherent slice of the sub-feature that a tester would search for as one unit. Section boundaries must come from AC list / UI catalog, not arbitrary splits. Common patterns:

- **CRUD** — Create, Read, Update, Delete of the primary entity
- **Search & Filter** — query, facet, sort
- **Permissions** — role-based access variants
- **Validation** — form field errors, constraint violations
- **Edge Cases** — off-nominal data, race conditions
- **Multi-environment / Multi-user** — structural modifiers from destructuring cross-cutting concerns
- **Workflow stage** — Draft / Active / Finished / Archived

### Mechanics

1. **Identify natural sections** by scanning:
   - AC list themes — group ACs that describe the same surface (e.g. AC-1..AC-5 about creation = "CRUD" section)
   - UI catalog screens — different screens often = different sections
   - Test titles — verbs/nouns cluster (e.g. "Filter by...", "Search for..." → Search & Filter)
2. **Count per section:** how many tests fall into each
3. **Auto-merge undersized sections** (< 3 tests) into the closest semantically related section — silently, no user prompt
4. **Apply matrix above** — fully automatic

### Why a directory of MD files (not one MD with multiple `<!-- suite -->` blocks)

The `check-tests` parser uses a single `currentSuite` variable — multiple `<!-- suite -->` blocks in one file overwrite each other (real bug, see `.claude/skills/create-test-cases/CLAUDE.md` § Nested Suites). A directory becomes a parent suite in Testomat; each file inside becomes a child suite nested under it. This is the **only** working approach for nesting.

### What to flag

- *"Suite has 8 tests in flat MD but groups into 2 natural sections (CRUD: 5, Permissions: 3) — must be nested."*
- *"Suite has 22 tests in flat MD but groups into 4 natural sections (CRUD: 8, Search: 6, Permissions: 5, Boundaries: 3) — must be nested."*
- *"Suite is nested with 4 sections but 'Edge Cases' has only 2 tests — auto-merge into Boundaries during regeneration."*

### Anti-patterns

- Splitting alphabetically (`A-M`, `N-Z`) — sections must be semantic, not lexical
- Splitting by priority or automation status — those are tag dimensions, not suite structure
- Forcing 5 sections when 3 fit naturally — symmetry over clarity is wrong
- Asking the user on borderline cases — auto-merge undersized sections instead

### Blocking

- Any suite with ≥ 2 natural sections of ≥ 3 tests in flat layout → blocking, must be re-laid-out as nested before publishing
- Any nested layout with a section < 3 tests → blocking, must auto-merge during regeneration

### How this links to Phase 1

Phase 1 Grouping pass writes a 1-line decision header at the top of the checklist:
```
Output: nested | sections: 3 (CRUD: 5, Permissions: 4, Validation: 3)
```
or
```
Output: flat | reason: only 1 natural section
```
Phase 3 cross-checks this header against the actual MD layout produced in Phase 2 — mismatch is a violation.

---

## Output Format

```
Coverage Self-Review:

UI elements: 12/14 buttons, 3/3 toggles, 5/7 toasts
  ! Unused: **'Import'**, **'Export'**
AC coverage: 8/10 ACs covered
  ! AC-4 NOT COVERED

Cross-cutting: 2/2 concerns covered (Multi-env: t.15, Multi-user: t.8)
  — or —
Cross-cutting: 1/2 concerns covered
  ! "Multi-environment" affects this sub-feature but has 0 dedicated tests

Scope compliance: OK

Balance: happy 45%, negative 25%, boundary 15%, state 10%, role 5% — OK
Priority: critical 2, high 7, normal 9, low 2 — OK

Step quality: atomic 20/20, observable 19/20, independent 20/20, min-steps 18/20
  ! t.14 "Label is saved" → rewrite as observable
  ! t.12 has 1 step — merge with t.11

E2E: 18/20 OK
  ! t.3 "Creator is auto-assigned" → merge into t.1
Parameterization: OK

Automation: candidate 15 (75%), deferred 3 (15%), manual-only 2 (10%) — OK

Suggestions:
  - Add test for AC-4
  - Rewrite t.14 expected result
  - Consolidate t.3 into t.1
```
