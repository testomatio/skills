---
name: manual-to-automated-tests
description: Convert manual test cases into automation test scripts. Analyze existing test architecture and generate scalable, maintainable automated tests following Page Object Model (POM) and automation patterns.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# ACTIVE STEP: 1/5 (Analyze Project Architecture)
# Previous: ⏳ (not started)
# Next: → Step 2: Understand Manual Test

# MANUAL-TO-AUTOMATED-TESTS SKILL: What I do

This skill converts manual test cases into production-ready automation test scripts. I analyze your existing automation framework, follow manual test steps, and generate maintainable tests using automation testing best practices.

## When to Use

Trigger this skill when user wants to:
- Convert manual test cases to automated scripts.
- Cover a full end-to-end flow with automation testing.
- Expand existing test suite with new test coverage.
- User ask to: "automate manual cases", "write auto script by manual flow", etc.

---

## Skill Checklist

Complete ALL items in order:

1. [ ] **Analyze Project Architecture** => Detect framework (1.1), identify excluded paths (1.2), find reusable components (1.3).
2. [ ] **Understand Manual Test** => Normalize input (2.0), handle ambiguous steps (2.1), detect inconsistencies (2.2).
3. [ ] **Write Test Code** => Implement using existing POM/patterns (3.1-3.2), add assertions (3.3), output code (3.4).
4. [ ] **Verify & Heal** => Execute test (4.1), heal if fails - locators → timing → assertions → flow (4.2), max 3 attempts.
5. [ ] **Code Review & Align** => Ensure structure compliance (5.1), manage test data & fixtures (5.2), run related tests and output summary (5.3 & 5.4).

---

## Available Sub-Skills

The skill orchestrates these specialized capabilities:

| Skill                               | Purpose                                             |
| ----------------------------------- | --------------------------------------------------- |
| **automation-debug-tests**          | Step-by-step debug instruction to fix failed steps in test |

---

## Workflow: Convert Manual Tests to Automation

### Step 1: Analyze Project Architecture

#### 1.1 Detect Automation Framework

**If user provides framework** (e.g., "use CodeceptJS" or "Playwright project"):
- Trust user's choice => Skip to Step 2.

**If no framework provided:**
- Inspect project: `package.json`, config files, test directory structure (supported: `Playwright`, `CodeceptJS`, `Cypress`, `WebdriverIO`, `Jest`, `Mocha`).
  - If unclear => Ask user: `❓ Which automation framework should I use?`

> For Playwright/CodeceptJS => apply corresponding best practices from references

**Framework references** (apply after Step 1.1 detection):
> See [CODECEPTJS Best Practices](./references/CODECEPTJS_BEST_PRACTICES.md)
> See [PLAYWRIGHT Best Practices](./references/PLAYWRIGHT_BEST_PRACTICES.md)

#### 1.2 Identify Excluded Paths

Before scanning the project, identify folders that may contain deprecated or irrelevant code based on naming patterns:
- `deprecated/`, `legacy/`, `old/`, `backup/`, `__backup__/`.
- `archive/`, `tmp/`, `temp/`.
- files with `...outdated` suffix.
- Versioned folders like `v1/`, `v2/` (if newer versions exist).

> Limit analysis depth to 2-3 directory levels unless deeper traversal is required. Stop scanning once sufficient reusable components are identified.

List all potentially excluded paths and ask the user to confirm: `Should these folders be excluded from analysis? You can also specify additional paths to ignore.`

Rules:
- Do not automatically exclude ambiguous folders without confirmation.
- If the user does not respond, exclude only clearly deprecated folders (e.g., `__backup__/`, `deprecated/`, `outdated/`, `legacy`, etc).

**Always prioritize user-specified exclusions over auto-detected ones**.

#### 1.3 Analyze Existing Solutions

Explore the project to identify reusable components:
- **Page Objects**: Find existing locators and methods that can be reused (like `src/pages`, `pages/`, `page-objects/`, etc).
- **Fixtures/Hooks**: Identify setup/teardown patterns.
- **Test Data**: Check for existing data management (constants, CSV, JSON from `test-data`, `src/testData`, etc).
- **Utils Functions**: Look for helper functions that can be reused (like `utils/`, `helpers/`, etc).

> Prioritize files and folders with names containing: `test`, `spec`, `page`, `fixture`, `helper`, `test-data`.

**Automatically exclude from analysis:**
- Dependency folders (like `node_modules`, etc).
- Build artifacts (`dist`, `build`, `out`, etc).
- Hidden/system folders (`.git`, `.cache`, etc).

If project structure is unclear or no relevant files are found:
- Ask the user: `Which directories contain your test files, page objects, and shared utilities?`
(Allowing to override or specify custom paths)

**Step 1 Summary (Log):** After completing analysis, output a short overview:
- Detected framework (or user-specified).
- Reusable components found (Page Objects, fixtures, utils).
- Excluded paths (if any).
- Next action.

---

### Step 2: Understand Manual Test Cases Task

Receive manual test case input from user **or from extracted comment blocks in source files (see "2.0 Normalize Input Structure")**.

Supported input formats:
- Plain text manual test cases.
- Markdown-formatted steps.
- Comment-based test cases extracted from code files (e.g., `//`, `/* */`).

#### 2.0 Normalize Input Structure

Before parsing, normalize input into a consistent structure:
- `summary` (or scenario title).
- `preconditions` (optional).
- `steps` (required).

For comment-based inputs:
- Treat comment markers (`//`, `*`, `-`) as structural hints.
- Convert bullet points into ordered steps.
- Bind `_Expected:_` or `Expected Results` blocks to the preceding step.
- Merge multiline expected results into a single logical expectation.

Example normalization:

```md
* Navigate to page  
  _Expected:_ Page opens
* Click once on the ${Custom statuses} block
  _Expected_: List includes "manual" option.
```

**Preserve Original Comments with user e2e steps/results (MANDATORY):** DO NOT delete or rewrite original manual test comments.
Instead:
- Keep them as-is in the file.
- Generate automation code below or alongside them.
- Add a marker: `// === AUTO-GENERATED TEST (based on steps above) ===` to separate a new automation code.

#### 2.1 Handle Ambiguous Steps

For each step, classify its clarity level:
- **Clear** => proceed normally.
- **Partially clear** => make a reasonable assumption and continue.
- **Unclear** => ask user for clarification.

For partially clear steps:
- Infer intent using context from previous steps.
- Use common UI patterns (buttons, inputs, navigation).
- Proceed with best-effort implementation.

Mark assumptions in output using ⚠️:
- Example: "⚠️ Assuming 'Submit' button triggers form submission".

For unclear steps: 
- Mark with ❓ and ask the user: `❓ Can you clarify what this step means?`.

**Avoid blocking the entire flow if only one step is unclear**.
**Continue processing other steps where possible**.

#### 2.3 Detect Potential Inconsistencies

While parsing steps, check for inconsistencies between:
- Step actions.
- Expected results.
- Known UI patterns.

If something seems inconsistent or unlikely:
- Flag it with ⚠️.
- Ask the user for confirmation: `It seems this step or expected result may not match typical system behavior. Should we proceed as described or adjust it?`.

**Do NOT stop processing unless the step is completely blocking**.

---

### Step 3: Write Test Code

#### 3.1 Adaptive Implementation Strategy

Choose the simplest implementation that aligns with the existing project architecture:
* **If reusable components exist (Page Objects, helpers, fixtures):**
  - Reuse them immediately.
  - Follow established project patterns and naming conventions.
  - Do not introduce inline locators or duplicate logic.

* **If partial structure exists:**
  - Extend existing components where appropriate.
  - Add missing methods or locators to existing POM classes or create a new one.
  - Keep consistency with current design.

* **If no structure exists:**
  - Use simple, readable locators.
  - Keep implementation minimal but organized.
  - Avoid over-engineering (no unnecessary abstractions).

Always prioritize:
1. Consistency with the project.
2. Readability.
3. Maintainability.

**Do NOT:**
- Ignore existing Page Objects in favor of inline locators.
- Duplicate selectors or logic that already exist.

#### 3.2 Follow Framework Patterns

Apply these principles when writing tests:
- **One test, one flow** - Each test validates a single scenario.
- **Separation of concerns:**
  - Tests => assertions and flow control.
  - Page Objects => UI interactions.
  - Utils => reusable logic.
- **Extend, don't modify** - Add to existing components without changing stable code.
- **Use fixtures** for setup, authentication, and shared state.

> See [POM Best Practices](./references/POM_BEST_PRACTICES.md) for detailed patterns

#### 3.3 Generate Assertions

* Add assertions based on expected results from manual steps.
* Prefer explicit, meaningful checks over generic ones.
* Validate:
  - UI state (visibility, text, attributes).
  - Data correctness.
  - Navigation outcomes.

Avoid:
- Weak assertions (e.g., only checking page load).
- Over-asserting irrelevant details.

#### 3.5 Save Suggested Test Code

- Generate complete, runnable test code.
- Ensure it integrates with the existing framework.
- Follow project formatting and style conventions.

---

### Step 4: Verify & Heal Test

Run the generated test to verify correctness:

#### 4.1 Execute Test

**Standard execution:**
- Run test command (`npx playwright test`, `npx codeceptjs run`, etc.)
- If **passes** => Proceed to "Step 5".
- If **fails** => Start healing (4.2).

**Optional: MCP Step-by-Step Execution (if MCP tools available)**
- Use "step-by-step" execution mode (Playwright MCP, CodeceptJS `run_step_by_step` MCP) for detailed execution tracking.
- Collect: step results, timing, trace files (DOM, screenshots, logs).
- Use this for debugging complex flows or when you need granular execution data.

#### 4.2 Heal Failed Tests

When a test has fails, apply fixes in priority order:
1. **Fix Locators** - Prefer stable selectors (`data-testid`, `aria-label`), avoid deeply nested XPath.
2. **Resolve Timing** - Use framework-native waits, avoid hard sleeps.
3. **Adjust Assertions** - Match actual app behavior, not assumptions.
4. **Fix Flow** - Verify navigation, preconditions, missing steps.

**Use MCP for healing (If Configured & Available): OPTIONALY (only Playwright, CodeceptJS based frameworks)** - Try to use MCP for complex UI (dropdowns, modals, toggles) checks, debugging and healing:
1. **DOM inspection** → `document.querySelector(...).outerHTML`.
2. **Steps mode** → `npx codeceptjs run --grep "@Tag" --steps`.
3. **Live replay** → Use MCP Playwright, call `browser_snapshot()` after each action.

**(Use MCP only when standard fixes are insufficient, not as a first step)**.

**Rules:**
- Apply updates one-by-one: one issue, error at a time, re-run after each.
- **Max 3 healing attempts** total.
- After 3 failures => stop, document issues, ask user for guidance.
- Finish when test passes.

> When you don't understand the root cause of test problem/-s, ask the about using **automation-debug-tests** skill to diagnose and fix. 
**!!!Use only in critical situations**.

#### 4.3 Stability Criteria & Save
Test is **stable** when:
- Passes 1-2 consecutive runs.
- No hard waits.
- Resilient locators.

**Save Fixed Code** to project location or user provided file location with proper naming conventions.

---

### Step 5: Code Review & Final Verification

#### 5.1 Code Review & Alignment

Verify generated code follows project conventions:
- **POM** => UI interactions only.
- **Tests** => flow + assertions only.
- **Utils** => reusable helper logic.

Move misplaced code to correct locations. **Do NOT refactor existing code.**

#### 5.2 Test Data & Fixtures

Maximum reuse existing "test-data" variables if exist:
- Use centralized test data if project has it (JSON/CSV/constants).
- Reuse authentication/setup fixtures.
- Don't duplicate setup inside tests.

#### 5.3 Final Run & Mapping Table

Execute 1-2 related tests to confirm integration.

**Show Spec-to-Code Mapping:**

| Manual Step | Automation Action |
|-------------|-------------------|
| Navigate to Settings | `basePage.clickOnNavigationMenuButton("Settings")` |

**Exit condition:** Test passes 2 consecutive runs.

#### 5.4 Skill Summary

Output structured summary (see [Final Summary Template](./references/FINAL_SUMMARY_TEMPLATE.md))

---

## References

| Description | File |
|-------------|------|
| Final Summary Template | ./references/FINAL_SUMMARY_TEMPLATE.md |
| POM Best Practices | ./references/POM_BEST_PRACTICES.md |
| Playwright Best Practices | ./references/PLAYWRIGHT_BEST_PRACTICES.md |
| CodeceptJS Best Practices | ./references/CODECEPTJS_BEST_PRACTICES.md |
| Test Data Management | ./references/TEST_DATA_MANAGEMENT.md |

---

## Error Handling

### Recoverable Issues

* **Manual test case invalid/incomplete**
  - Mark with ❓ and ask user for clarification.
  - Report which steps are unclear.
  - Request complete test case before proceeding.

* **Framework detection failed**
  - ❓ Ask user to specify framework explicitly.

### Blocking Issues

* **Test Execution Problems**
  - If no option to execute test after 3 attempt => Stop and catch the error.

---

## User Interaction Guidelines

### Asking Questions

Use ❓ emoji for unclear items:

```
❓ Can you explain this step in details?

or

❓ Do you want to:
1. Use existing LoginPage
2. Create new LoginPage
3. Skip login step
```

---

## Examples

### Basic Conversion by Use Case Text

```
User: Convert this manual test to Playwright:
"Login with valid credentials:
1. Navigate to /login
2. Enter username: admin
3. Enter password: secret
4. Click login button"

Agent: Got it! Detected Playwright project.
Agent: Creating test using existing LoginPage...
Agent: ✅ Test created: tests/e2e/login.spec.ts
Agent: Verify test code...
Agent: ✅ Test passed!
Agent: Refactoring to match project standards...
Agent: ✅ All done!
```

### Basic Conversion by Comments in File

**User Request:**

```
Use manual-to-automated-tests skill for CodeceptJS framework to write automation 
script "tests/plan-for-guest.test.ts" based on manual steps below in this file as comments (leaving comments in the file for further analysis). Set a specific "smoke" tag for this test.  
Use as reference for an extra proper examples: 
* `tests/payment-methods.test.ts` - Canonical test file with team approved format.
* `src/pages/paymentMethods.page.ts`- Good described payment page object.
Avoid mistakes from legacy code examples:
* `src/pages/paymentOutdated.page.ts` - Outdated example with an old patterns.

Finally, verify that the generated test is passed on - `BASE_URL = 'https://test.com/'` and provide final review for user.

Agent: Got it! Detected Playwright project.
...
Agent: ✅ All done! See Summary report above...
```

### Framework Not Detected

```
Agent: Couldn't detect automation framework in your project.
❓ Which framework should I use?
1. Playwright
2. CodeceptJS
3. Cypress
4. Other (specify)
```

---

## Quick Reference

| Action | Command/Tip |
|--------|-------------|
| Ask for clarification | Use ❓ emoji |
| Simple start | Keep draft minimal first |
| Reuse components | Check for existing POMs |
| Rollback if stuck | Keep working version |
| Final verification | Run related suite only |
| Run single test | `npx playwright test path/to/spec.ts` |
| Run single test | `npx codeceptjs run path/to/test.js` |
