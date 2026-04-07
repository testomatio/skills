---
name: automate-test-cases
description: This skill converts manual test cases into production-ready automated test scripts. It analyzes the existing automation framework, interprets manual test steps, and generates maintainable tests following automation best practices. Use this skill whenever the user want to automate manual test cases, expand test coverage, or create end-to-end automated flows from existing test documentation.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# AUTOMATE-TEST-CASES SKILL: What I do

This skill helps generate production-ready automated test scripts from manual test cases. It analyzes the existing automation framework, interprets manual test steps, and produces maintainable, scalable tests following automation best practices and patterns.

## When to Use

Trigger this skill when user wants to:
- Convert manual test cases to automated scripts.
- Cover a full end-to-end flow with automation testing.
- Expand existing test suite with new test coverage.
- User ask to: "automate manual cases", "write automation script from manual flow", etc.

---

## Skill Checklist

Complete ALL items in order:

1. [ ] **Analyze Project Architecture** => Detect framework (1.1), identify excluded paths (1.2), find reusable components (1.3).
2. [ ] **Understand Manual Test** => Normalize input (2.0), handle ambiguous steps (2.1), detect inconsistencies (2.2).
3. [ ] **Write Test Code** => Implement using existing POM/patterns (3.1-3.2), add assertions (3.3), output code (3.4).
4. [ ] **Verify & Heal** => Execute test (4.1), heal if fails - locators → timing → assertions → flow (4.2), max 3 attempts.
5. [ ] **Finalization** => Ensure structure compliance (5.1), manage test data & fixtures (5.2), run related tests and output summary (5.3 & 5.4).

### Progress
* STEP: 1/5 (Analyze Project Architecture)
* Previous: ⏳ (not started)
* Next: → Step 2: Understand Manual Test

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

- **If user specifies framework** (e.g., "use CodeceptJS" or "Playwright project") => Trust user's choice.
- **If no framework is detected** => Inspect the project to determine the test framework:
  - Analyze `package.json` dependencies and scripts.
  - Check configuration files (`playwright.config.js`, `codecept.conf.js`, `cypress.json`, etc.).

> For Playwright/CodeceptJS => apply corresponding best practices from references

**Framework references** (apply after Step 1.1 detection):
> See [CODECEPTJS Best Practices](./references/CODECEPTJS_BEST_PRACTICES.md)
> See [PLAYWRIGHT Best Practices](./references/PLAYWRIGHT_BEST_PRACTICES.md)

#### 1.2 Analyze Project Conventions

Analyze how the test project is organized and executed:
- **Test structure & naming conventions** - detect folders (`tests/`, `e2e/`) and file patterns (`*.spec.js`, etc).
- **Execution patterns** - analyze `package.json` scripts and test commands.
- **Configuration & environment** - identify base URLs, env variables, and global setup.
- **Assertion style** - detect assertion libraries and patterns used in existing tests.

#### 1.3 Identify Reusable Components

Scan the project to identify reusable components while excluding irrelevant or deprecated code.

**Identify reusable components:**
- **Page Objects**: Find existing locators and methods that can be reused (like `src/pages`, `pages/`, `page-objects/`, etc).
- **Fixtures/Hooks**: Identify setup/teardown patterns.
- **Test Data**: Check for existing data management (constants, CSV, JSON from `test-data`, `src/testData`, etc).
- **Utils/Helpers Functions**: Look for helper functions that can be reused (like `utils/`, `helpers/`, etc).

**Automatically exclude from analysis:**
- Dependency folders (`node_modules/`)  
- Build artifacts (`dist/`, `build/`, `out/`)  
- Hidden/system folders (`.git/`, `.cache/`)  
- Clearly deprecated or legacy folders:
  - `deprecated/`, `legacy/`, `old/`, `backup/`, `__backup__/`, `archive/`, `temp/`  
  - files/folders marked as `outdated`  
  - older versioned folders (`v1/`, `v2/`) when newer versions exist  

**Handling ambiguous cases:**
- Do not exclude folders with unclear purpose automatically.  
- If needed, ask the user:  
  `❓ Should any additional folders be excluded from analysis (e.g., legacy or unused code)?`

> **Priority:** Always prioritize user-specified exclusions over auto-detected ones.

#### Summary (Log) of Step 1

After analysis, output a short overview:
- Detected framework (or user-specified).
- Reusable components found (Page Objects, fixtures, utils).
- Excluded/Legacy files (if any).
- Next ➡️ Step 2: Understand Manual Test Cases Task.

---

### Step 2: Understand Manual Test Cases Task

Receive manual test case input from user **or from extracted comment blocks in source files (see "2.0 Normalize Input Structure")**.

Supported input formats:
- Plain text manual test cases.
- Markdown-formatted steps.
- Comment-based test description extracted from code files (e.g., `//`, `/* */`).

#### 2.0 Normalize Input Structure

**Convert input into a consistent structure:**
- `summary` (or scenario title).
- `preconditions` (optional).
- `steps` (required) - ordered actions with expected results.

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

For each step, classify clarity level:
- **Clear** => proceed normally.
- **Partially clear** => make a reasonable assumption and continue.
- **Unclear** (blocking) => Mark with ❓ and ask the user: `❓ Can you clarify what this step means?`.

Guidelines:
- Use context from previous steps.
- Apply common UI patterns (click, input, navigation). 
- Do not stop the flow for minor ambiguities.

Mark assumptions in output using ⚠️:
- Example: "⚠️ Assuming 'Submit' button triggers form submission".

**Avoid blocking the entire flow if only one step is unclear**.
**Continue processing other steps where possible**.

#### 2.3 Detect Potential Inconsistencies

While parsing steps, check for inconsistencies between:
- Step actions.
- Expected results.
- Known UI patterns.

If steps or expected results seem inconsistent:
- Proceed with best-effort interpretation  
- Flag with ⚠️ in output 

#### Summary (Log) of Step 2

After processing the manual test cases, output:

- Normalized test structure (summary, steps, expected results).
- Total steps detected.
- Assumptions made (⚠️), if any.
- Blocking questions (❓), if any.
- Next ➡️ Step 3: Write Test Code.

---

### Step 3: Write Test Code

#### 3.1 Choose Implementation Strategy

Select the simplest implementation that aligns with the existing project architecture:
* **If reusable components exist (Page Objects, helpers, fixtures):**
  - **Reuse them**.
  - Follow established project patterns and naming conventions.

* **If partial structure exists:**
  - Extend existing components where needed.
  - Keep consistency with current design.

* **If no structure exists:**
  - Use simple, readable locators.
  - Keep implementation minimal and organized.
  - Avoid over-engineering (no unnecessary abstractions).

**Priorities:**
1. Consistency with the project.
2. Readability.
3. Maintainability.

**Do NOT:**
- Ignore existing Page Objects.
- Duplicate selectors or logic.

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

- Add assertions based on expected results from manual steps.
- Prefer explicit, meaningful checks.

Validate:
  - UI state (visibility, text, attributes).
  - Data correctness.
  - Navigation outcomes.

Avoid:
- Weak assertions (e.g., only checking page load).
- Over-asserting irrelevant details.

#### 3.4 Generate Test Code Output

- Generate complete, runnable test code.
- Ensure it integrates with the existing framework.
- Follow project formatting and style conventions.
- Place code in the appropriate test file or suggest file location.

---

### Step 4: Verify & Heal Test

Verify the generated test by executing it and fixing issues if needed.

#### 4.1 Execute Test

**Standard execution:**
- Run **only the generated test**, not the full test suite.
- Use the project’s **test execution command** (`npx playwright test`, `npx codeceptjs run`, etc.).

**Result:**
- If test **passes** → proceed to Step 5  
- If test **fails** → start healing (4.2)  

> ⚠️ Do NOT run all tests. Limit execution to the generated test to avoid excessive logs and noise.

#### 4.2 Heal Failed Tests

Fix failures iteratively, one issue at a time.

**Healing priorities:**
1. **Locators** - Prefer stable selectors (`data-testid`, `aria-label`), avoid deeply nested XPath.
2. **Timing** - Use framework-native waits, avoid hard sleeps.
3. **Assertions** - Match actual app behavior, not assumptions.
4. **Flow** - Verify navigation, preconditions, missing steps.

**Process:**
- Identify a single failure.
- Apply one fix.
- Re-run the test. 
- Repeat.

**Limits:**
- Max **3 healing attempts**  
- If still failing => stop and report issues 

#### Optional: Advanced Debugging (MCP)

**Use only when standard healing is insufficient**.

If deeper debugging is needed and tools are available:
- Inspect DOM (`document.querySelector(...).outerHTML`).
- Use step-by-step execution.
- Capture logs, screenshots, or traces during debug. 

> When you don't understand the root cause of test problem/-s, ask the about using **automation-debug-tests** skill to diagnose and fix. 
**!!!Use only in critical situations**.

#### 4.3 Stability Criteria & Save

A test is considered stable when:
- Passes 1-2 consecutive executes.
- No hard waits.
- Resilient locators.

---

### Step 5: Finalization

#### 5.1 Save Final Test Code

- Save the working test to the appropriate project location.
- Follow naming conventions and structure.
- Ensure consistency with existing tests.

#### 5.2 Test Data & Fixtures

Maximum reuse existing "test-data" variables and fixtures if exist:
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

### Skill Summary

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

### Recovery

* **Manual test case is unclear, incomplete, or partially invalid**
  - Proceed with best-effort interpretation.
  - Mark assumptions with ⚠️.
  - Ask the user ❓ only if a step is blocking execution.

### Blocker

* **Test Execution Problems**
  - If no option to execute test after 3 attempt => Stop and catch the error.

---

## User Interaction Guidelines

### Asking Questions

Use ❓ only when necessary (blocking or critical ambiguity):

```
❓ Can you clarify this step?
```

or

```
❓ Do you want to:
1. Use existing LoginPage
2. Create new LoginPage
3. Skip login step
```

### Interaction Principles

- Minimize interruptions — prefer assumptions over questions.
- Clearly mark assumptions with ⚠️.
- Continue execution whenever possible.

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
Use automate-test-cases skill for CodeceptJS framework to write automation 
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
| Execute single Playwright test | `npx playwright test path/to/spec.ts` |
| Execute single CodeceptJS test | `npx codeceptjs run path/to/test.js` |
