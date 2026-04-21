# Feature Destructuring — reference procedure for Step 1 (Feature Phase)

**Used by:** [steps/01-feature-phase.md](../steps/01-feature-phase.md) substeps 1.1 (sub-feature map) and 1.4 (cross-cutting concerns).

**Purpose:** explore the feature UI, identify ALL logical sub-features, record cross-cutting concerns, and produce an approved `destructuring.md` map. The map is a feature-level artifact (A2) consumed by every sub-feature conversation — each sub-feature is then covered in a separate conversation to keep context clean.

**Always on:** under the feature-first flow there is no "single-suite mode". Even a feature with one sub-feature runs Step 1 so the `_shared-ui.md`, `_ac-baseline.md`, and destructuring map exist as shared baselines.

---

## Procedure

1. **Login & Navigate** — use Playwright MCP (invoked via the `ui-explorer` subagent in `mode: feature-baseline`). Login with `TESTOMATIO_EMAIL` / `TESTOMATIO_PASSWORD`. Navigate to the Q1.1 entry point URL.

2. **Explore the feature surface** — systematically catalog all distinct functional areas:
   - Identify tabs, sections, panels, dialogs, settings groups
   - Click through each top-level interactive area
   - Use `browser_evaluate` for DOM inspection and `browser_snapshot` for accessibility tree when needed

3. **Apply decomposition criteria** — an area warrants its own suite when it meets **2+ of these**:
   - Has a **form with 3+ fields** (inputs, dropdowns, toggles)
   - Has its own **CRUD lifecycle** (create, read, update, delete)
   - Has **3+ distinct states or modes** (e.g., pending/in-progress/finished)
   - Has **its own entry point or navigation** (separate tab, panel, dialog)
   - Has **interactions with 2+ other entities** (e.g., environment selection affects run + report)
   - If an area meets only 1 criterion → it's likely a section within a larger suite, not its own suite
   - If an area meets 4+ → it's deep, flag as `estimated tests: 30+`

4. **Draft sub-feature map with scope boundaries** — each sub-feature gets explicit ownership:
   ```
   Feature: {feature-name}
   Entry point: {Q1.1 URL}

   Sub-features identified:

   1. **{Sub-feature Name}** — {1-line description}
      Owns: {what this suite tests — specific actions, UI areas, states}
      Does NOT own: {adjacent functionality tested elsewhere}
      Key elements: {main buttons/forms/controls}
      Estimated tests: {10-15 / 20-30 / 30+}
      Criteria met: {which decomposition criteria from step 3}

   2. **{Sub-feature Name}** — {1-line description}
      Owns: ...
      Does NOT own: ...
      ...
   ```

   **Overlap rules:**
   - If two sub-features share a UI element → one OWNS it (tests CRUD), the other USES it (precondition only)
   - If a workflow spans two sub-features → the one that initiates the action owns the test
   - Flag any unresolved overlaps for user decision in step 5

5. **Identify cross-cutting concerns (mandatory)** — after drafting the sub-feature map, analyze which elements **change behavior across multiple sub-features** when activated. These are **structural modifiers** — not simple fields, but mode switches that create variant flows throughout the feature.

   **How to identify:**
   - Review each sub-feature's key elements for **multi-select fields, mode toggles, or entity multipliers**
   - For each candidate, ask: "If this is set to a non-default value, does it change the behavior of 2+ sub-features?"
   - If yes → it's a cross-cutting concern

   **Common structural modifiers:**
   - Multi-environment selection (creates N parallel runs → affects creation, execution, detail, list, archive)
   - Multi-user assignment (changes who sees/executes what → affects creation, execution, detail)
   - Checklist mode toggle (changes execution UX → affects creation, execution)
   - Bulk operations mode (multi-select + batch action → affects execution, detail, list)

   **Document each cross-cutting concern:**
   ```
   Cross-cutting concerns:

   A. **{Concern Name}** — {what it does}
      Trigger: {what activates it — e.g., "selecting 2+ environments in run creation form"}
      Affects: #{sub-feature-1} ({how}), #{sub-feature-2} ({how}), ...
      Must-test scenarios: {key variant scenarios that each affected sub-feature must include}
   ```

   **Enforcement rule:** During test generation for each sub-feature (Step 3), the cross-cutting concerns list is a **mandatory input**. For each concern that lists the current sub-feature in "Affects" → at least 1 dedicated test must exist. This is checked in Phase 3 quality checks (self-review-checks.md § 1b Cross-cutting coverage).

6. **Recommend execution order** — propose order with rationale:
   - **Core first:** sub-features with the main workflow (create, execute, complete)
   - **Variations next:** sub-features that modify or extend the core (configuration, filtering, bulk)
   - **Edge last:** sub-features that handle exceptions (error recovery, permissions, archiving)
   - Rationale: earlier suites establish patterns and preconditions that later suites build on

7. **Present to user for approval (Step 1.5 HARD STOP)** — numbered list with recommended order + cross-cutting concerns. Options: confirm and start #1, edit the list/order, pick specific sub-feature to start with.

8. **Save to file:** `test-cases/{feature-slug}/destructuring.md` with the approved map + cross-cutting concerns section + timestamp + user's chosen order.

9. **Track & hand off:** each sub-feature is covered in a **separate skill invocation** (separate conversation) to avoid context overflow. The map file tracks progress:
   ```markdown
   - [x] Sub-feature 1 — completed 2026-04-14
   - [ ] Sub-feature 2
   - [ ] Sub-feature 3
   ```
   On next invocation, the Resume Detector reads `destructuring.md`, sees which sub-features are done, and proposes the next unchecked one. Intake answers (Q2-Q4) carry over — only `S` changes per suite. Reuse the feature directory under `test-cases/{feature-slug}/` — do NOT recreate it.

---

## Publishing

This skill never publishes. Once all sub-features are `[x]`, the user runs:

```
/publish-test-cases-batch test-cases/{feature-slug}/
```

That skill handles batch publish (one branch per suite, `tc/{feature}/{suite-slug}`).

---

## File structure under feature-first flow

```
test-cases/{feature-slug}/
  intake.md                     ← A1 (Step 0)
  destructuring.md              ← A2 (Step 1.1 + 1.4)
  _ac-baseline.md               ← A-base (Step 1.2)
  _shared-ui.md                 ← A-shared-ui (Step 1.1, ui-explorer feature-baseline)
  _existing-steps.md            ← A-steps (Step 1.3)
  _style.md                     ← A-style (Step 4, first approval)
  {suite-1-slug}-ac-delta.md    ← A3 (Step 2.1)
  {suite-1-slug}-ui-delta.md    ← A4 (Step 2.2, ui-explorer sub-feature-delta)
  {suite-1-slug}-scope.md       ← A5 (Step 2.4)
  {suite-1-slug}-test-cases.md  ← A6 (Step 3, flat) — OR {suite-1-slug}/*.md for nested
  {suite-1-slug}-review.md      ← A7 (test-case-reviewer, ≥15 tests)
  ...
```
