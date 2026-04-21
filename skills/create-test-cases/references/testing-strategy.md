# Testing Strategy & Reference Data

Reference guide for designing high-quality manual test cases. Covers what to test, how to write steps, and all reference data (tags, labels, roles).

## Section map (anchor-based — stable across edits)

Extract ONE section via a single `awk` call — never Read the whole file:

```bash
awk '/^START_PATTERN/,/^END_PATTERN/' .claude/skills/create-test-cases/references/testing-strategy.md
```

| § | Topic | START pattern | END pattern (exclusive) |
|---|---|---|---|
| 1 | Test Design Principles (1.1-1.6) | `^## 1\. Test Design` | `^## 2\. ` |
| 1.3 | E2E Format (mandatory) | `^### 1\.3 E2E Format` | `^### 1\.4 ` |
| 1.6 | Cross-Screen Outcome Verification | `^### 1\.6 Cross-Screen` | `^## 2\. ` |
| 2 | Coverage Approach | `^## 2\. Coverage` | `^## 3\. ` |
| 2.3 | Scenario Balance Thresholds | `^### 2\.3 Scenario Balance` | `^### 2\.4 ` |
| 3 | Step Writing Rules | `^## 3\. Step Writing` | `^## 4\. ` |
| 4 | Naming Conventions | `^## 4\. Naming` | `^## 5\. ` |
| 5 | Scenario Design Patterns (5.1-5.8) | `^## 5\. Scenario Design` | `^## 6\. ` |
| 5.5 | Parameterized Pattern | `^### 5\.5 Parameterized` | `^### 5\.6 ` |
| 5.6 | Negative Test Pattern | `^### 5\.6 Negative` | `^### 5\.7 ` |
| 6 | Common Pitfalls | `^## 6\. Common Pitfalls` | `^## 8\. ` |
| 8 | Priority Matrix | `^## 8\. Priority Matrix` | `^$` (end of file — use `,0` or drop END pattern) |

**Last-section trick:** for sections that extend to end-of-file, use `awk '/^## 8\. /{p=1} p'` instead of the range pattern.

---

## 1. Test Design Principles

### 1.1 One test = one scenario

Each test case verifies **one specific behavior**. If a test title contains "and" — consider splitting.

- **Good:** "Finish run updates status to Passed when all tests passed"
- **Bad:** "Finish run and check status and verify report"

### 1.2 Independence

Each test must be executable **independently** — no dependency on another test's outcome.

- **Data preconditions** ("At least one label exists") go in the **Preconditions** section — specify how to create or reference setup
- **State preconditions** ("User is on the Labels page") become the first steps of the test
- If test B logically follows test A (e.g., "Edit label" after "Create label") — test B must include creation in its own preconditions or first steps. Never assume test A ran first
- Shared test data (e.g., a label used by multiple tests) → describe in preconditions of each test that uses it

### 1.3 E2E Format (mandatory)

This project is an **E2E automation** project. Every test case must be a complete **end-to-end scenario** — a user journey from entry point to verifiable outcome. Tests describe what a user **does**, not what the UI **looks like**.

**The pattern:** Navigate → Act → Verify → (next action → Verify) → Final outcome

**Rules:**
- Every test MUST start with a user navigation or action, never with "Verify..." or "Check..."
- Every test MUST end with a verifiable outcome (toast, page state, data visible)
- Static UI checks ("X is visible by default", "Y is active by default") are NOT standalone tests — they become verification steps inside a larger E2E scenario
- If 3+ tests in a suite all verify different elements on the same screen after the same action → **consolidate** them into one E2E scenario with multiple verification steps
- Each test must answer: **"What does the user DO, and what HAPPENS as a result?"**
- **Minimum 3 steps per test** — every standalone test must have at least 3 steps (navigate → act → verify). A test with 1-2 steps is either too granular (merge with related test) or missing navigation context (add entry-point steps). Exception: individual rows in a parameterized test may have fewer steps since navigation is shared

**Good (E2E):**
```
## Verify New Manual Run form default state after opening from Runs page

Steps:
- Navigate to the **'Runs'** page
  _Expected_: Runs page is displayed with the **'Manual Run'** button visible
- Click the **'Manual Run'** button
  _Expected_: New Manual Run sidebar opens with **'New Manual Run'** header and `manual` badge
- Inspect the form controls
  _Expected_: **'Title'** input, **'Rungroup'** dropdown, **'Environment'** list, **'Description'** textarea and **'Run as checklist'** toggle are all visible. Creator is shown as `as manager`. **'All tests'** tab is active with read-only tree. **'Launch'**, **'Save'**, **'Cancel'** buttons are visible at the bottom
```

**Bad (isolated UI state checks — NOT E2E):**
```
## All configuration controls are visible by default          ← no user action
## Form opens as a sidebar with header and manual badge       ← no journey
## Creator is auto-assigned as manager by default             ← static assertion
## All tests tab is active by default                         ← static assertion
## Launch, Save and Cancel buttons are visible at the bottom  ← static assertion
```
These 5 separate "tests" should be **one E2E scenario** (as shown in the Good example above).

**Consolidation heuristic:** If removing one test from a group doesn't change the entry point, setup, or first N steps of the remaining tests — they belong together as one scenario.

See also § 1.6 — an E2E test must follow through to the **resulting screen** when the action has a downstream effect.

### 1.4 Reproducibility

Steps must be precise enough that **any team member** can execute them and get the same result. No "check that everything works" — specify what exactly to check.

### 1.5 Real UI language

Use **exact UI element names** as they appear in the app — bold with `**`. Never paraphrase button text.

- **Good:** Click the **'Run Automated as Manual'** toggle
- **Bad:** Enable the automated tests toggle

### 1.6 Cross-Screen Outcome Verification (mandatory)

When an action produces an effect **visible on another screen** — Launch → execution page, Save → detail page, Delete → list view, Assign → test tree — the test MUST continue to that screen and verify the effect with a **concrete, observable** check (specific element + specific value).

Stopping at the modal/form after clicking the action button is only acceptable when the test is **explicitly about the modal's internal behavior** — e.g., "Strategy button text updates when toggling options". Such tests should be the minority; make the modal-only scope obvious in the title.

**Concrete verification** means naming the element AND the value you expect to see — not vague descriptions.

**Bad (outcome test that stops at the modal):**
```
## Launch run with Randomly Distribute strategy and verify distribution

- Click 'Launch' button
  _Expected_: Execution page opens. Tests are approximately equally distributed
              among team members.
```
The test claims to verify distribution but the result is vague (`approximately`) and never names a specific test or user. Distribution could be 100/0 and still "pass" this check.

**Good (outcome test that follows through with concrete checks):**
```
## Launch run with Randomly Distribute strategy and verify distribution

- Click 'Launch' button
  _Expected_: Execution page opens with test tree visible and all tests in Pending status
- Inspect the test tree
  _Expected_: Every assigned non-manager user has at least 1 test. Test 'Login flow'
              shows the avatar of one of the assigned users. The run creator
              (manager) is NOT shown as assignee on any test
- Navigate to the run detail page
  _Expected_: 'Assigned to' metadata row shows all 3 users (creator + 2 selected)
              with avatars and names
```

**Rules:**
- If the test's `source` references an AC with outcome verbs (`applied`, `distributed`, `assigned`, `saved`, `created`, `deleted`, `updated`) → the test MUST continue past the action button to the resulting screen
- Verification must name the element AND the value — ban `approximately`, `correctly`, `appropriately`, `properly`, `as expected`, `works fine` (see § 3.3)
- When the outcome is visible on two screens (e.g., execution page + run detail), pick the stronger one or verify both — vague coverage is the problem, not scope

---

## 2. Coverage Approach

### 2.1 Test Types

| Category | Description | Example |
|----------|-------------|---------|
| **Happy path** | Main flow, expected input, successful outcome | Create a run with all tests, finish it |
| **Alternative path** | Valid but non-default flow | Create a run with test plan instead of all tests |
| **Negative** | Invalid input, error handling | Launch run without selecting any tests |
| **Boundary** | Edge values: 0, 1, max, empty | Run with 1000+ tests, empty title |
| **State transitions** | Moving between states | Pending → Passed → re-mark as Failed |
| **Permissions/roles** | Different user roles | Read-only user cannot finish a run |
| **Data persistence** | Data survives refresh/navigation | Reload page — run status preserved |
| **Bulk operations** | Multi-select + batch action | Select 5 tests → bulk delete → all removed |
| **Cross-feature** | Action in feature A affects feature B | Delete label → tests with that label update |
| **Recovery** | Behavior after errors/interruptions | Refresh during save, back button after submit |

### 2.2 Mandatory Coverage Checklist

- [ ] All entry points to the feature
- [ ] All tabs/modes
- [ ] All interactive elements from the UI catalog (buttons, links, menus)
- [ ] All form fields: valid, empty, boundary values
- [ ] All dropdown/menu items exercised at least once
- [ ] All toggle states: on → off, off → on
- [ ] Success messages / toasts — exact text verified
- [ ] Error messages — most common ones
- [ ] Loading states and empty states
- [ ] Data persistence — refresh page, navigate away and back
- [ ] Bulk operations — if the feature supports multi-select
- [ ] Search/filter — if the feature has search or filter controls
- [ ] Role-based access — at minimum: owner (happy) + read-only (denied). See [product-context.md](product-context.md)
- [ ] Post-action effects verified on the **downstream screen** (not just the modal/form) — see § 1.6

### 2.3 Scenario Balance Thresholds (mandatory)

The generated test suite MUST meet these minimum thresholds:

| Type | Minimum % | If below |
|------|-----------|----------|
| Negative | ≥ 20% | Add error/validation/permission-denied scenarios |
| Boundary | ≥ 10% | Add min/max/empty/overflow/special-char tests |
| Happy path | ≤ 50% | Too many happy paths — convert some to parameterized |

These thresholds are checked in Step 2 Phase 3 (built-in quality checks). Violations are **blocking** — fix during generation before presenting to user.

### 2.4 What NOT to Test (in manual tests)

- API internals (use API tests)
- CSS pixel-perfect layout (use visual regression)
- Performance benchmarks (use load tests)
- Third-party integrations deeply (mock boundary, verify connection)

---

## 3. Step Writing Rules

### 3.1 Atomic Steps

Each step = **one user action** + **one expected result**.

```
- Click the **'Finish Run'** button
  _Expected_: Confirmation dialog appears asking "Are you sure?"
```

**Bad (compound):** "Click Finish Run and confirm the dialog"

### 3.2 Expected Result Formatting

- Single outcome → plain text
- **Multiple checkpoints** → list as sentences separated by periods: `First thing. Second thing. Third thing`
- Do NOT number checkpoints (1. 2. 3.) — Testomat renders them poorly

### 3.3 Observable Expected Results

| Type | Good | Bad |
|------|------|-----|
| Visual | "Toast 'Run saved' appears" | "Run is saved" |
| Counter | "Passed counter shows '5'" | "Counter updates" |
| Navigation | "Run execution page is displayed with title 'My Run'" | "Page opens" |
| State | "Toggle changes to active (blue)" | "Toggle is enabled" |
| Absence | "Delete button is not visible" | "Feature is disabled" |
| List/table | "List shows 5 items sorted by date" | "List is correct" |
| Form state | "**'Save'** button becomes enabled" | "Form is valid" |
| URL/redirect | "URL changes to `/runs/{id}`" | "Navigated to run page" |
| Outcome on next screen | "Execution page: Test 'Login flow' shows avatar of User A" | "Tests are approximately distributed" |

**Banned vague words.** The following are never acceptable in `_Expected_:` — they are not observable, cannot be verified objectively:

`approximately`, `correctly`, `appropriately`, `properly`, `as expected`, `works fine`, `is saved`, `is correct`, `works`, `should work`, `updates`

Replace every occurrence with a concrete check: element + value. See § 1.6 for the full cross-screen rule.

### 3.4 Step Format

- Bullet list (`-` or `*`), not numbered
- `_Expected_:` after each step (italic — Testomat import format)
- Use exact UI element names (bold) from the UI element catalog
- Include waits for loading states
- Check `steps_search` for reusable shared steps

### 3.5 Preconditions

Two categories — always include both:

**Data preconditions** — what must exist before the test starts:
- "At least one label exists in the project."
- "A test plan with 3+ tests exists."

**State preconditions** — who the user is and where they are:
- "User is logged in as owner." (always specify exact role, never just "user")
- "User is on the Runs page."

**Rules:**
- If data must exist → specify how to create it or state it as given
- Always specify exact role name from [product-context.md](product-context.md): `owner`, `manager`, `QA`, `read-only user`
- Default role: `owner` — use when role doesn't matter for the test
- Role-based tests: write separate preconditions per role

**Good:** "User is logged in as owner. At least one test plan with 3+ tests exists in the project."
**Bad:** "User is ready to test." / "User is logged in." (which role?)

---

## 4. Naming Conventions

Descriptive phrases, no "TC-NNN" prefix. Patterns:
- `{action} {object} {context}` — `Login with invalid credential`
- `{object} is {state} when {condition}` — `Folder is searchable after renaming`
- Parameterized: `${variable}` syntax — `User can create ${project type} project`

Structure: `Feature Folder (@domain-tag) → Sub-feature Suite → Tests` (see SKILL.md Hierarchy Model)

---

## 5. Scenario Design Patterns

### 5.1 CRUD Pattern

For any entity (run, plan, suite, test), cover the full lifecycle:

1. **Create** — with minimum fields, with all fields
2. **Read** — view details, list view, search/filter
3. **Update** — edit title, change status, modify fields
4. **Delete** — single delete, bulk delete, undo if available

### 5.2 State Machine Pattern

Map transitions and test each valid + at least one invalid:

```
[Saved] → Launch → [In Progress] → Finish → [Finished]
                                  → Abort → [Aborted]
[Finished] → Relaunch → [In Progress]
```

### 5.3 Role-Based Pattern

| Action | Owner | Manager | QA | Read-only |
|--------|-------|---------|-----|-----------|
| Create run | yes | yes | yes | no |
| Finish run | yes | yes | yes | no |
| Delete run | yes | yes | no | no |
| View run | yes | yes | yes | yes |

### 5.4 Multi-Entity Interaction Pattern

When a feature involves **multiple related entities** (e.g., run group with environments, plan with test selections, label assigned to tests):

1. **Create** the parent with N children/related items
2. **Modify** children — verify parent reflects changes
3. **Remove** a child — verify parent updates (count, display, behavior)
4. **Delete** parent — verify children are handled (cascade delete? orphaned? error?)
5. **Cross-feature** — action on entity A affects entity B (e.g., delete label → tests with that label update)

See entity relationships in [product-context.md](product-context.md).

### 5.5 Parameterized Pattern (mandatory for identical flows)

**Rule:** If 3+ tests share the **same entry point and identical steps** and differ ONLY in input data or user role → they **MUST** be a single parameterized test with a data table. This is critical for automation efficiency — each separate test = a new browser session with login + navigation overhead.

Use when: identical flow, different data/roles. Don't use when: different step logic or different expected results per parameter.

**Mandatory parameterization triggers:**
- 3+ tests filling the same form field with different values (e.g., title: empty, short, max-length, special chars, unicode)
- 3+ tests performing the same action with different user roles
- 3+ tests selecting different options from the same dropdown/tab and verifying similar outcomes

**Before (5 separate tests = 5 browser sessions):**
```
Test: Create run with empty title          — 2 steps
Test: Create run with short valid title    — 2 steps
Test: Create run with max-length title     — 2 steps
Test: Create run with special characters   — 2 steps
Test: Create run with Unicode title        — 2 steps
```

**After (1 parameterized test = 1 browser session):**

```markdown
<!-- test
priority: high
source: AC-5
automation: candidate
-->
## User can create run from ${source} page @runs @smoke

**Preconditions:** User is logged in as owner.

## Steps

- Navigate to **${source}** page
  _Expected_: ${source} page is displayed
- Click the **'Manual Run'** button
  _Expected_: New Manual Run sidebar is displayed

<!-- example -->

| source |
|--------|
| Runs |
| Tests |
| Plans |
```

### 5.6 Negative Test Pattern

The strategy requires ≥ 20% negatives (§ 2.3). Systematically identify them by category:

| Category | What to test | Example |
|----------|-------------|---------|
| **Validation** | Empty, too long, invalid chars, duplicate, special chars | Create label with 256+ chars → error |
| **Permission** | Wrong role attempts action | Read-only user clicks **'Create'** → button not visible or action denied |
| **State** | Action on deleted/archived/locked entity | Edit a label that was just deleted by another user |
| **Dependency** | Delete entity that's used elsewhere | Delete label assigned to 10 tests → label removed from all tests |
| **Constraint** | Exceed limits, violate business rules | Create 2 labels with same name → "Name already exists" error |
| **Input boundary** | 0, 1, max, max+1, empty string, whitespace-only | Title with only spaces → treated as empty |

**Rules:**
- Every happy-path CRUD action should have at least one corresponding negative
- Validation negatives are the easiest source — check each form field for empty + invalid
- Permission negatives: at minimum test read-only user for each write action (see [product-context.md](product-context.md))

### 5.7 Bulk Operations Pattern

If the feature supports multi-select or batch actions:

1. **Select** — select all, select some, deselect all, select via checkbox vs shift-click
2. **Act** — bulk delete, bulk label, bulk status change, bulk move
3. **Mixed validity** — bulk action on items where some succeed and some fail (e.g., bulk delete including a protected item)
4. **Scale** — large selection (50+ items) — does the action complete? is there a progress indicator?
5. **Cancel/undo** — cancel mid-bulk-action, undo if available

**Key test:** select multiple items → perform bulk action → verify ALL items updated (not just the first/last).

### 5.8 Search & Filter Pattern

If the feature has search input or filter controls:

1. **Text search** — exact match, partial match, case sensitivity, special chars, empty query
2. **Filter by category** — single filter, combine 2+ filters, filter with 0 results
3. **Clear/reset** — clear search field, reset all filters, verify full list returns
4. **Persistence** — do filters survive page refresh? navigate away and back?
5. **No results** — empty state displayed, helpful message, clear action available

**Key test:** apply filter → verify results match → clear filter → verify full list restored.

---

## 6. Common Pitfalls

| Pitfall | Fix |
|---------|-----|
| Vague steps ("Check the page") | Specify exact element and expected state |
| Missing loading waits | Add "Wait for..." steps for async operations |
| Hardcoded data ("Click on 'My Project'") | Use preconditions or describe how to create data |
| Testing implementation ("Verify API returns 200") | Focus on UI-observable behavior |
| Duplicate coverage | Search existing tests before writing new ones |
| Overly long tests (20+ steps) | Split into focused scenarios |

E2E, parameterization, balance, and priority pitfalls are enforced by their respective sections (§ 1.3, § 5.5, § 2.3, § 8) and checked mechanically in [self-review-checks.md](self-review-checks.md).

---

## 8. Priority Matrix

Every test gets a priority using **impact × frequency**. Do not assign by gut feeling — use the matrix.

|                  | High frequency (used daily) | Low frequency (used rarely) |
|------------------|-----------------------------|------------------------------|
| **High impact**  | `critical`                  | `high`                       |
| **Low impact**   | `high`                      | `normal` / `low`             |

**Definitions:**

| Priority | When | Examples |
|----------|------|----------|
| `critical` | Core user flow, used daily, breaks business if broken | Login, create run, finish run, save plan |
| `high` | Important flow used weekly, or critical edge case | Edit plan, filter tests, role-based access |
| `normal` | Secondary flow, used occasionally | Bulk rename, export CSV, reorder folders |
| `low` | Rare edge case, unlikely to trigger | Cancel during save, network flake recovery |

**Rules:**
- Smoke test suites = only `critical` + `high`
- If >40% of a suite is `critical` — the criteria are too loose, recalibrate
- **If >40% of a suite is `high` — the criteria are too loose, downgrade weekly-use and secondary flows to `normal`**
- **Healthy pyramid:** `critical` ≤ 15%, `high` ≤ 35%, `normal` ≥ 35%, `low` ≥ 5%. Violations are flagged in Step 2 Phase 3
- Negative / boundary tests inherit priority from the positive flow they test, minus one step (e.g., happy path is `critical` → negative is `high`)
- New tests default to `normal` if unclear, let reviewer upgrade
- Tag `@smoke` on every `critical` test + `high` happy-path tests — these form the smoke suite for CI
