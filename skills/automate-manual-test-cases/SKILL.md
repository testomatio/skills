---
name: automate-manual-test-cases
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

1. [ ] **Analyze Project Architecture** => Detect framework (1.1), identify excluded paths (1.2), find reusable components (1.3), investigate the live target page (1.4).
2. [ ] **Understand Manual Test** => Normalize input (2.0), handle ambiguous steps (2.1), detect inconsistencies (2.2).
3. [ ] **Write Test Code** => Implement using existing POM/patterns (3.1-3.2), add assertions (3.3), output code (3.4).
4. [ ] **Verify & Heal** => Execute test (4.1); if the run is **blocked** (missing env/credentials, build/init error) stop and ask the user (4.1); heal real **failures** - locators → timing → assertions → flow (4.2), max 3 attempts.
5. [ ] **Finalization** => Ensure structure compliance (5.1), manage test data & fixtures (5.2), run related tests and output summary (5.3 & 5.4).

### Progress
* STEP: 1/5 (Analyze Project Architecture)
* Previous: ⏳ (none)
* Next ➡️ Step 2: Understand Manual Test Cases Task.

---

## Available Sub-Skills

The skill orchestrates these specialized capabilities:

| Skill                               | Purpose                                             |
| ----------------------------------- | --------------------------------------------------- |
| **debug-fix-failed-flaky-autotests**          | Step-by-step debug instruction to fix failed steps in test |

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

#### 1.4 Investigate the Live Target Page

**Never write UI automation from documents and code alone.** Locators invented from a manual test case, a description, or a *different* page are guesses — they will not run. Before writing selectors for a page, open that page and read its real DOM.

- **If a browser tool is available** (Playwright MCP, `playwright-cli`, or the host's browser skill) => open the exact page/feature under test, walk the flow the manual case describes, and read the **real** selectors, texts, and URLs from the live DOM.
- **Confirm the feature is where you think it is** before targeting it — e.g. a "Defects board" is its own page, not the Analytics page. Open it and verify; do not reuse a neighbouring page's objects by assumption.
- Prefer selectors the page actually exposes (`data-testid`, roles, stable `aria-*`) taken from the live DOM over anything inferred.
- **If no browser tool is available** => say so explicitly, base locators strictly on **existing** Page Objects / tests in the repo, and mark every unverified selector with ⚠️ so the user knows it was not confirmed against the running app.

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
- Invent selectors from manual steps, descriptions, or a different page — use the Page Objects or the live DOM you inspected in Step 1.4. Any selector not confirmed against the running app must be marked ⚠️.

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

**You MUST run the test you wrote — writing code is not "done".** A test that was never executed cannot be reported as implemented, working, passing, or complete.

**Preflight — required environment:** before running, check the credentials/env vars the project needs to execute (from Step 1.2: base URLs, auth tokens, `.env` keys). If a required value is missing, do **not** run-and-shrug — go straight to the ⛔ Blocked path below and ask the user.

**Standard execution:**
- Run **only the generated test**, not the full test suite.
- Use the project’s **test execution command** (`npx playwright test`, `npx codeceptjs run`, etc.).

**Classify the outcome — three states, not two:**
- ✅ **Passed** — a scenario actually executed and its assertions held → proceed to Step 5.
- ❌ **Failed** — the test ran but an assertion or app behaviour broke → start healing (4.2).
- ⛔ **Blocked** — the run never reached your test (missing env var/credential, build/compile/init error, app unreachable). This is **not** a pass and **not** a locator/timing issue to heal. **STOP and ask the user** for the missing piece (see Error Handling → Blocker), then rerun. Report it as the **headline**, never as a footnote under a "done" summary.

> ⚠️ **Do NOT run all tests**. Limit execution to the generated test to avoid excessive logs and noise.

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

> When the root cause of a failure remains unclear or requires deeper investigation, consider using the **debug-fix-failed-flaky-autotests** skill for structured, step-by-step diagnosis and fixes.

#### Optional: Advanced Debugging (MCP)

Use advanced debugging tools and MCPs **when available** to improve diagnosis efficiency.

**If MCP/debug tools are available:**
- Inspect DOM (`document.querySelector(...).outerHTML`).
- Use step-by-step execution.
- Capture logs, screenshots, or traces during debug.

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

* **Missing credentials / environment required to run** (a needed env var, API token, or secret is not set)
  - You **cannot** invent or assume a credential — STOP and ask the user for it:
    `❓ The test can't run because \`<ENV_VAR>\` is missing. Please provide it (or add it to the project env), then I'll rerun the affected scenario.`
  - Do **not** continue to Step 5, and do **not** claim the test is implemented/working, while the run is blocked. A blocked run is reported as blocked — as the headline, not a footnote.
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

- Minimize interruptions **for minor ambiguities** — prefer a ⚠️-marked assumption over a question.
- **Never assume a blocker away.** A missing credential/env var, or anything that stops the test from running, is not something to assume — STOP and ask (see Blocker). You cannot fabricate a secret.
- Clearly mark assumptions with ⚠️.
- Continue execution whenever possible — **except** when a blocker requires user input.

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

Agent: Detected Playwright project. Found existing LoginPage.
Agent: Opening /login in the browser to confirm the real selectors...
Agent: Writing test with LoginPage + verified selectors → tests/e2e/login.spec.ts
Agent: Running it: npx playwright test tests/e2e/login.spec.ts
Agent: ✅ Ran and passed (1 scenario). Summary below.
```

### Basic Conversion by Comments in File

**User Request:**

```
Use automate-manual-test-cases skill for CodeceptJS framework to write automation 
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

### Blocked by a Missing Credential

```
User: Automate the checkout manual cases.

Agent: Detected CodeceptJS. Opened the checkout page in the browser and confirmed selectors.
Agent: Wrote 4 scenarios reusing the project's page objects → tests/checkout/checkout.test.ts
Agent: Running: npx codeceptjs run tests/checkout/checkout.test.ts --steps
Agent: ⛔ The run stopped before any test executed — a required auth token env var is missing.
❓ I can't verify these tests until that token is set. Please provide the missing env var
   (or add it to the project env) and I'll rerun the scenarios. Not reporting this as done yet.
```

---

## Quick Reference

| Action | Command/Tip |
|--------|-------------|
| Ask for clarification | Use ❓ emoji |
| Before writing selectors | Open the target page live and read the real DOM (Step 1.4) — never invent them |
| Simple start | Keep draft minimal first |
| Reuse components | Check for existing POMs |
| Missing token/env to run | STOP and ask the user — never assume a credential |
| Blocked run (didn't execute) | Not a pass, not "done" — report it as the headline |
| Rollback if stuck | Keep working version |
| Final verification | Run related suite only |
| Execute single Playwright test | `npx playwright test path/to/spec.ts` |
| Execute single CodeceptJS test | `npx codeceptjs run path/to/test.js` |
