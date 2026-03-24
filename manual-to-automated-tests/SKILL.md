---
name: manual-to-automated-tests
description: Convert manual test cases into automation test scripts. Analyze existing test architecture and generate scalable, maintainable automated tests following Page Object Model (POM) and automation patterns.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# MANUAL-TO-AUTOMATED-TESTS SKILL: What I do

This skill converts manual test cases into production-ready automation test scripts. I analyze your existing automation framework, follow manual test steps, and generate maintainable tests using automation testing best practices.

## When to Use

Trigger this skill when user wants to:
- Convert manual test cases to automated scripts.
- Cover a full end-to-end flow with automation testing.
- Expand existing test suite with new test coverage.
- User ask to: "automate manual cases", "write auto script by manual flow", etc.

---

## Workflow: Convert Manual Tests to Automation

### Step 1: Analyze Project Architecture

#### 1.1 Detect Automation Framework

* Identify which testing framework is used in the project:
    - Supported frameworks: `Playwright`, `CodeceptJS`, `Cypress`, `WebdriverIO`, `Jest`, `Mocha`

> If the framework is unclear, inspect the repository structure, dependencies, configuration files, and `package.json` scripts to determine which framework is used or ask the user which framework the project uses.

**If framework is specified by user:**
    - Trust user's choice and proceed.

**If no framework detected:**
    - Ask user to confirm the automation framework.

If framework is PLAYWRIGHT or CODECEPTJS use corresponding best pracices from the references.
> See [CODECEPTJS Best Practices](./references/CODECEPTJS_BEST_PRACTICES.md)
> See [PLAYWRIGHT Best Practices](./references/PLAYWRIGHT_BEST_PRACTICES.md)

#### 1.2 Identify Excluded Paths

Before scanning the project, identify folders that may contain deprecated or irrelevant code based on naming patterns:
- `deprecated/`, `legacy/`, `old/`, `backup/`, `__backup__/`.
- `archive/`, `tmp/`, `temp/`.
- Versioned folders like `v1/`, `v2/` (if newer versions exist).

> Limit analysis depth to 2-3 directory levels unless deeper traversal is required. Stop scanning once sufficient reusable components are identified.

List all potentially excluded paths and ask the user to confirm: `Should these folders be excluded from analysis? You can also specify additional paths to ignore.`

Rules:
- Do not automatically exclude ambiguous folders without confirmation.
- If the user does not respond, exclude only clearly deprecated folders (e.g., `__backup__/`, `deprecated/`).
- Always prioritize user-specified exclusions over auto-detected ones.

#### 1.3 Analyze Existing Solutions

Explore the project to identify reusable components:
- **Page Objects**: Find existing locators and methods that can be reused (like `src/pages`, `pages/`, `page-objects/`, etc).
- **Fixtures/Hooks**: Identify setup/teardown patterns.
- **Test Data**: Check for existing data management (constants, CSV, JSON from `test-data`, `src/testData`, etc).
- **Utils Functions**: Look for helper functions that can be reused (like `utils/`, `helpers/`, etc).

> Prioritize files and folders with names containing: `test`, `spec`, `page`, `fixture`, `helper`.

**Automatically exclude from analysis:**
- Dependency folders (like `node_modules`, etc).
- Build artifacts (`dist`, `build`, `out`, etc).
- Hidden/system folders (`.git`, `.cache`, etc).

If project structure is unclear or no relevant files are found:
- Ask the user: `Which directories contain your test files, page objects, and shared utilities?`
(Allowing to override or specify custom paths)

**Step 1 Summary (Log):** After completing analysis, output a summary:
- Detected framework (or user-specified)
- Reusable components found (Page Objects, fixtures, utils)
- Excluded paths (if any)
- Next action

---

### Step 2: Parse Manual Test Cases

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
- Bind `_Expected:_` blocks to the preceding step.
- Merge multiline expected results into a single logical expectation.

Example normalization:

```md
* Navigate to page  
  _Expected:_ Page opens
* Click once on the ${Custom statuses} block
   _Expected_: List includes "manual" option.
```

**Preserve Original Comments (MANDATORY):** DO NOT delete or rewrite original manual test comments.
Instead:
- Keep them as-is in the file
- Generate automation code below or alongside them
- Add a marker:
    - `// === AUTO-GENERATED TEST (based on steps above) ===` to separate a new code

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

Avoid blocking the entire flow if only one step is unclear.
Continue processing other steps where possible.

#### 2.3 Detect Potential Inconsistencies

While parsing steps, check for inconsistencies between:
- Step actions.
- Expected results.
- Known UI patterns.

If something seems inconsistent or unlikely:
- Flag it with ⚠️.
- Ask the user for confirmation: `It seems this step or expected result may not match typical system behavior. Should we proceed as described or adjust it?`.

Do NOT stop processing unless the step is completely blocking.

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
  - Add missing methods or locators in the correct places.
  - Keep consistency with current design.

* **If no structure exists:**
  - Use simple, readable locators.
  - Keep implementation minimal but organized.
  - Avoid over-engineering (no unnecessary abstractions).

Always prioritize:
1. Consistency with the project
2. Readability
3. Maintainability

**Do NOT:**
- Ignore existing Page Objects in favor of inline locators
- Duplicate selectors or logic that already exist
- Generate “temporary” code that requires refactoring later

#### 3.2 Follow Framework Patterns

Apply these principles when writing tests:
- **One test, one flow** - Each test validates a single scenario
- **Separation of concerns:**
  - Tests => assertions and flow control.
  - Page Objects => UI interactions.
  - Utils => reusable logic.
- **Extend, don't modify** - Add to existing components without changing stable code
- **Use fixtures** for setup, authentication, and shared state

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

#### 3.4 Output Test Code

- Generate complete, runnable test code.
- Ensure it integrates with the existing framework.
- Follow project formatting and style conventions.

---

### Step 4: Verify Test Script

#### 4.1 Execute Test

Run the generated test to verify correctness:
- If test **passes consistently** => Proceed to Step 5.
- If test **fails** => Start healing process.

#### 4.2 Heal Failed Tests

Apply fixes in the following priority order:

**1. Fix Locators (Highest Priority)**
- Check if selectors are incorrect, outdated, or too brittle.
- Prefer stable selectors (`data-testid`, `aria-label`, etc).
- Avoid overly complex or deeply nested selectors.

> See [POM Best Practices - Locator Strategy](./references/POM_BEST_PRACTICES.md#locator-strategy)

**2. Resolve Timing Issues**
- Add explicit waits for elements to be visible, enabled, or attached.
- Use framework-native waiting mechanisms (avoid hard sleeps).
- Ensure proper page/state synchronization before actions.

**3. Adjust Assertions**
- Verify expected results match actual application behavior.
- Replace overly strict or incorrect assertions with meaningful checks.
- Ensure assertions validate real outcomes, not assumptions.

**4. Fix Flow Issues**
- Validate navigation steps and action sequence.
- Ensure preconditions (login, setup, data state) are correct.
- Check for missing steps in the flow.

**Healing Rules:**
- Apply one category of fix at a time and re-run the test.
- Do not apply multiple unrelated fixes in a single attempt.
- Limit healing to 3 iterations total.
- After 3 failed attempts, stop and ask user for guidance.

#### 4.3 Handle Unresolved Failures

If the test is still failing after 3 attempts:

- Stop further modifications.
- Provide the best current version of the test.
- Clearly document unresolved issues:
  - What failed
  - What was attempted
  - Possible reasons
- Ask the user for clarification or guidance.

#### 4.4 Define Stability Criteria

A test is considered **stable** if:
- It passes multiple consecutive runs (at least 1-2 times).
- It does not rely on hard waits (`sleep`, `timeout` hacks).
- Locators are resilient and not overly fragile.
- Assertions validate meaningful outcomes.

#### 4.5 Save Stable Version

Once stability criteria are met:
- Save the automation script to the appropriate project location.
- Ensure consistency with project structure and naming conventions.

#### 4.6 Stop Conditions

Stop healing and ask user when:
- **Same locator fails 3 times** - UI may have changed significantly.
- **Timing issues persist** - Page may require different load strategy.
- **Flow doesn't match manual steps** - Test case or app may need adjustment.
- **Data/state issues** - Preconditions may be missing from test case.

Example prompt to user:
```
❓ Test keeps failing after 3 attempts. Last error: [brief description]
- Tried: [what was attempted]
- Possible causes: [your analysis]

Should we:
1. Continue debugging together
2. Save current version and mark as needs review
3. Skip this test case for now
```

#### 4.7 MCP Verification (If Available)

If the user has MCP Playwright configured, use these verification methods for complex UI elements:

**A — DOM Inspection Before Writing Locators**

Before creating new locators, inspect the actual DOM to ensure accuracy:
```typescript
// Use MCP browser_evaluate:
document.querySelector('.some-class').outerHTML
document.querySelectorAll('[role="switch"]').length
```

**B — Steps Mode Execution**

Run tests with verbose step output to verify XPath targeting:
```bash
npx codeceptjs run --grep "@TxxxxxxX" --steps
# or
npx playwright test --grep "@TxxxxxxX" --ui
```

**C — MCP Live Replay (Required for Complex Components)**

For dropdowns, modals, toggles, and any complex UI components:
1. Reproduce each test step in MCP Playwright browser
2. After each action, call `browser_snapshot()` to confirm UI state matches expected behavior

**D — Assertions as Proof of Correctness**

Map action types to required assertions:

| Action type | Required assertion |
|------------|-------------------|
| Save / submit | Toast or success message visible |
| Open dialog / dropdown | Dialog or dropdown visible |
| Fill field | `I.seeInField` inside method |
| Navigation | Page header or URL confirms destination |
| Move / assign / counter change | Updated counter or list entry visible |

When verifying against Expected Results, ensure assertions prove the ER literally:
- ER says **"each"** => check ALL items, not just one.
- ER says **"shared view"** => check the combination of elements that together prove it.
- ER says **"independent results"** => check every environment panel, not just the first.

**E — Spec-to-Code Mapping Table**

Present verification results as a two-column table:

| Step (from spec comments) | Actions in test |
|---------------------------|-----------------|
| 1. Navigate to the 'Settings' page | `basePage.clickOnNavigationMenuButton("Settings")` |
| 2. Click the 'Settings' button | `runsPage.clickOnSettingsButton()` |

Left column = step exactly as written in the manual test.
Right column = the actual method call(s) that implement it.
Every spec step must have a row. If a step has no implementation — flag it explicitly.

**Exit Condition:** Run the test twice in a row without failures before marking verification complete.

---

### Step 5: Align & Integrate Test Code

#### 5.1 Ensure Project Structure Compliance

Verify that generated code follows project conventions:
- Page Objects contain only UI interaction logic.
- Tests contain flow and assertions only.
- Utilities contain reusable helper logic.

If minor adjustments are needed:
- Move misplaced locators or methods to correct locations.
- Align naming with existing conventions.

**Do NOT perform large-scale refactoring.**

#### 5.2 Manage Test Data

Handle test data based on existing project patterns:
- If project uses centralized test data (constants, JSON, CSV):
  - Follow the same approach.

- If no such pattern exists:
  - Keep test data inline.

Do NOT introduce new data management patterns unless explicitly requested.

> See [Test Data Management](./references/TEST_DATA_MANAGEMENT.md) for details.

#### 5.3 Validate Fixtures and Hooks Usage

Ensure proper use of existing fixtures/hooks:
- Reuse authentication flows if available.
- Use shared setup/teardown mechanisms.
- Avoid duplicating setup logic inside tests.

#### 5.4 Verify Post-Integration Stability

Re-run the test after adjustments:

- If **passes** => Proceed to Step 6
- If **fails**:
  - Apply minimal fixes (max 1-2 attempts).
  - Focus only on issues introduced during this step.

#### 5.5 Save Integrated Test

When integration is complete:
- Save final test file to project
- Follow naming conventions (e.g., `*.spec.ts`, `*.test.js`)
- Use consistent folder structure

---

### Step 6: Final Verification

Execute a minimal set of related tests to ensure integration:
- Tests in the same file or directory.
- Tests covering the same feature or module.

> Avoid running the entire test suite unless explicitly required.

**Do NOT modify unrelated tests.**

---

### Final Summary

After completing the conversion, output a structured summary:

> See [Final Summary Template](./references/FINAL_SUMMARY_TEMPLATE.md) for reference

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

* **Unclear step in manual test**
  - Mark with ❓ and ask user for clarification.
  - Do not guess; request more context.

* **Missing Page Object**
  - Create a new Page Object following project conventions.
  - Ask user to confirm the structure.

* **Test data not found**
  - Ask user where test data should come from.
  - Use placeholder values with warning if needed.

### Blocking Issues

* **Framework detection failed**
  - Ask user to specify framework explicitly.
  - Stop conversion until framework is confirmed.

* **Manual test case invalid/incomplete**
  - Report which steps are unclear.
  - Request complete test case before proceeding.

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

### Language Style

- Use emojis occasionally for readability (✅ ❌ ❓ 🚀 💡).
- Use non-formal, friendly language.
- Be concise and direct.

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

### Basic Conversion by Specific Files

**User Request:**

```
User: Use manual-to-automated-tests skill for CodeceptJS framework to write automation 
script "tests/prod/test-payment-1.ts" based on manual steps below. Use "good-test.ts"
as reference for proper patterns and avoid mistakes from "bad-test.ts" legacy code example.

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
