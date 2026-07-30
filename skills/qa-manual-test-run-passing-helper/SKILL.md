---
name: qa-manual-test-run-passing-helper
description: Guide a QA engineer through manual test case execution by opening the browser, navigating to pages, performing easy verifications, taking screenshots, and asking for help only on complex steps. Use when user wants to pass/execute manual test cases from a .md file or from existing test cases in the TMS, creating a test run and tracking results. The skill handles action/asserts via browser or Playwright MCP while the user assists with non-automatable actions like login credentials, complex validations, or ambiguous test steps. At the end - finish run to provide statistic in TMS.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# QA-MANUAL-TEST-RUN-PASSING-HELPER SKILL: What I Do

This skill helps QA engineers execute manual test cases by browser interactions where possible and requesting human assistance only for complex or ambiguous steps. It creates a test run in TMS (if applicable), executes test cases one-by-one via browser automation, updates results in real-time, and collects screenshots.

## When to Use

Trigger this skill when user wants to:
- **Execute manual test cases** from a `.md` file or from TMS (by IDs/names)
- **Create a manual test run** in Testomat.io TMS
- **Pass/execute test cases** with browser automation assistance
- **Track test execution progress** with real-time status updates

---

## Workflow: Manual Test Case Execution

## Possible flows

Never post a diagram to user's chat - follow it immediately with one short paragraph explaining it: this is the general schema of manual test execution, for the user to examine before anything is implemented; execution branches based on what tools are available - MCP for TMS integration, browser automation for navigation and screenshots - and the user will choose how to handle browser visibility.

```mermaid
flowchart LR
   START([Start]) --> MCP{Testomat.io<br/>MCP configured?}
   MCP -->|yes| TMS[Create test run<br/>in TMS]
   MCP -->|no| LOCAL[Work locally<br/>no TMS updates]
   TMS --> BROWSER{Browser<br/>automation?}
   LOCAL --> BROWSER agent tools
   BROWSER -->|Playwright MCP| FULL[Full automation — navigate,<br/>verify, screenshot, update TMS]
   BROWSER -->|CLI only| GUIDED[Guided mode — you describe actions,<br/>I take screenshots]
   BROWSER -->|none| GUIDE[Guide only — I parse cases,<br/>you perform steps manually]
   FULL --> CONFIRM[Confirm result with user]
   GUIDED --> CONFIRM
   GUIDE --> CONFIRM
   CONFIRM --> STATUS[Update TMS status<br/>if MCP available]
   STATUS --> SUMMARY[Final summary<br/>+ screenshot paths]
```

---

### Step 0.1: MCP Availability Check (Preparation)

Before starting, check if Testomat.io MCP is configured:

1. **Check for MCP configuration** in common locations:
   - `opencode.json` → `mcp.testomat` or `mcp.testomatio`
   - `.cursor/mcp.json` → `testomatio` or `testomat`
   - `claude_desktop_config.json` → `testomatio` or `testomat`

2. **Check environment variables:**
   - `TESTOMATIO_PROJECT_TOKEN`
   - `TESTOMATIO_PROJECT_ID`

3. **Decision matrix:**

   | MCP Status | Capabilities | Limitations |
   |------------|--------------|--------------|
   | **Available & configured** | Full workflow: create runs, update statuses in TMS | None |
   | **Not configured** | Execute test cases from `.md` file only, take screenshots | Cannot create TMS runs, cannot update statuses automatically |

4. **If MCP not configured:**
   - Inform user: "MCP is not configured. I can help with local test case execution from .md files and screenshots, but status updates require manual setup in TMS."
   - Continue with local-only workflow
   - Skip TMS-specific steps

---

### Step 0.2: Browser Automation Tools Check

Before starting test execution, verify browser automation tools are available:

1.1 **Check for AI browser available tools**:
   - Try `browser_navigate` — if it responds, browser is working

1.2 **Check for Playwright MCP** (if configured via MCP):
   - Try `browser_navigate` or `browser_evaluate` — if it responds, browser MCP is working
   - If timeout/error → browser MCP not available

2. **Check for Playwright CLI:**
   - `npx playwright --version` — if available, can use `playwright open`, `playwright codegen`
   - Check for `playwright.config.ts` or `playwright.config.js` in project

3. **Check for Selenium/WebDriver tools:**
   - `selenium-ide` or `webdriverio` if project uses these

4. **Decision matrix:**

   | Tool Status | Capabilities | Action |
   |-------------|--------------|--------|
   | **Playwright MCP available** | Full browser control via MCP | Use MCP browser tools |
   | **Playwright CLI available** | `playwright open`, `codegen`, screenshots | Use CLI with user assistance |
   | **Neither available** | Cannot automate browser | Inform user and abort |

5. **If no browser tools available:**
   - Inform user: "No browser automation tools detected. I can help parse test cases and guide you through manual execution, but cannot automate browser actions."
   - Offer to continue in "guide only" mode where you describe steps and user performs them

6. **Browser mode decision** (after tools confirmed):
   - Ask user: "Run in headless mode (faster, no visible window) or with visible browser (--ui)?"
   - Note preference for this session
   - Default to headless unless user requests otherwise

---

### Step 1: Parse Input and Detect Test Case Source

#### Source A: From TMS (by IDs or names)

If user provides test case IDs or names:
1. Use `tests_list` or `tests_search` via MCP to find matching test cases
2. Fetch full test case details with `tests_get` for each ID
3. Extract: title, steps, expected results, labels

#### Source B: From Local `.md` File

If user provides a file path (e.g., `tests/feature-xyz.test.md`):
1. Read the `.md` file from filesystem
2. Parse test cases from markdown structure (detect test case titles, steps, expected results)
3. Group by suite if present

---

### Step 2: Create Manual Test Run in TMS

Create a manual test run via MCP:

```
runs_create:
  title: "Manual-{YYYY-MM-DD}-{FeatureName}"
  mode: "manual"
```

**FeatureName extraction:**
- From `.md` filename (e.g., `feature-xyz.test.md` → `feature-xyz`)
- From TMS suite name if all cases from same suite
- Or use user-provided name

---

### Step 3: Iterate Through Test Cases

For each test case, perform this sequence:

#### 3.1 Open Browser Session

**Default mode: headless** — browser runs without visible window for faster execution.

**When to use headed mode (`--ui`):**
- First time executing a test suite for this project
- User requests to see what's happening
- Debugging flaky tests
- Complex navigation that needs visual verification

**When to use headless mode:**
- Repeat executions of known test cases
- CI/CD pipelines
- Faster execution when visual feedback not needed

**Startup sequence:**
```
1. Ask user preference if not clear from context: "Run in headless mode (faster) or with visible browser?"
2. If headed mode requested: launch with --ui flag
3. If headless: launch with headless: true
4. Always maximize window in headed mode for best visibility
```

#### 3.2 Navigate to Target Page

Use test case steps to determine navigation:
- If test case specifies a URL path → navigate directly
- If test case says "login first" → ask user for credentials or skip if already logged in
- If test case says "go to page X" → attempt navigation; if failed, ask user for help

#### 3.3 Perform Automated Verifications

For each step in the test case:

**EASY (automate directly):**
- Verify text content is present on page
- Verify UI element exists (button, input, link)
- Verify color, size, basic styling (via computed styles)
- Verify page loads without errors
- Verify modal/dropdown opens correctly

**HARD (ask user for help):**
- Login credentials (username/password)
- 2FA or CAPTCHA
- Complex business logic validation
- Anything requiring human judgment
- Navigation to ambiguous/unclear pages

**When asking for help:**
```
"I need your help with step #{N}: {step description}
 - Issue: {why I can't automate it}
 - Please: {specific request}
 - Expected result: {what test expects}"
```

#### 3.4 Handle Screenshots

**Take screenshot if:**
- Test case mentions "take screenshot" → take and note in TMS
- Test case mentions "network log" → capture HAR file
- Last step of test case reached with no screenshot taken → take final screenshot

**Screenshot save location — ALWAYS use project folder first:**
1. **Project folder (PRIMARY)**: `{project_root}/screens/testomatio-screenshots/{run_id}/{test_id}_{timestamp}.png`
2. **Root folder (fallback)**: `testomatio-screenshots/{run_id}/{test_id}_{timestamp}.png`

> **CRITICAL**: Before taking a screenshot, detect project root by checking for `package.json`, `.git`, or similar markers. Always prefer project folder. Only fall back if no write permissions.

**Screenshot filename format:** `{test_id}_{timestamp}.png`

#### 3.5 Update Test Result in TMS

**ONLY use MCP tools when available** — never fall back to API helper scripts.

After completing each test case, update status via MCP:

```
testruns_update:
  run_id: {created_run_id}
  test_id: {test_case_id}
  status: {pass|fail|in_progress|blocked|skipped}
  comment: {execution notes, screenshot paths if any}
```

**If MCP is NOT available:**
- Skip automatic TMS update
- Inform user to set status manually in TMS after session
- Display current status prominently so user can record it

**Status mapping:**
| Test Result | TMS Status |
|------------|------------|
| All steps passed, expected result matches | `pass` |
| Step failed, expected result did not match | `fail` |
| Blocked by missing info, credentials, etc. | `blocked` |
| Test case not yet complete | `in_progress` |
| User chose to skip this case | `skipped` |

#### 3.6 Ask User for Confirmation

Before marking final status, confirm with user:

```
"Test case '{title}' execution complete.
 Status: {proposed_status}
 Steps passed: {N}/{total}
 Steps failed: {M} (if any)

 Please confirm:
 - [pass] if everything looks good
 - [fail] if you found an issue
 - [blocked] if something blocked execution
 - [in_progress] if needs more work"
```

---

### Step 4: Finish Test Run in TMS

**ONLY if MCP is available.**

After all test cases executed AND cleanup complete, finish the run via MCP:

```
runs_update:
  run_id: {created_run_id}
  status_event: "finish"
```

**This step is MANDATORY** — it provides the final statistics to TMS and closes the run.

---

### Step 5: Final Summary

After cleanup and run finished:

1. List execution summary:
   - Total cases: N
   - Passed: N
   - Failed: N
   - Blocked: N
   - Skipped: N

2. Provide screenshot locations for user to attach to TMS if needed

---

### Step 6: Post-Condition Cleanup (MANDATORY)

**CRITICAL**: Cleanup MUST happen BEFORE providing final summary — all artifacts must be removed from the working directory before showing the finish result to user.

**Clean up in this order:**
1. **Close browser session** — ensure all Playwright/browser processes terminated
2. **Remove temporary scripts** — any `.js`, `.ts`, `.playwright.js` files created during session
3. **Remove browser cache files** — `.cache/` if created in working directory
4. **Remove HAR files** — any `.har` network logs saved during session
5. **Remove only created by durring test session script files** — if created by Playwright

**IMPORTANT**: After cleanup is complete AND run is finished via MCP, THEN provide final summary to user. Do NOT provide final summary while temp files still exist in the working directory.

## Error Handling

### Recovery

- **Browser launch failed** → ask user to verify Playwright is installed
- **Page navigation failed** → ask user to confirm URL or manually navigate
- **Element not found** → ask user to verify page state
- **MCP call failed** → retry once, then inform user to set status manually in TMS

### On Any Failure — ALWAYS run cleanup

Before attempting recovery or continuing:
```
1. Close browser session
2. Remove any scripts, temp files created during session
```
**Then** attempt recovery or inform user.

### Hard Fail

- Invalid test case format (cannot parse)
- MCP authentication failed (continue without TMS features)
- All test cases blocked (no progress possible)

---

## MCP Tools Reference

| Action | MCP Tool | Key Parameters |
|--------|----------|----------------|
| Create test run | `runs_create` | `title`, `mode: manual` |
| Get test case | `tests_get` | `test_id` |
| List tests | `tests_list` | `tql` filter |
| Search tests | `tests_search` | `search_text` |
| Update test result | `testruns_update` | `run_id`, `test_id`, `status`, `comment` |
| Finish test run | `runs_update` | `run_id`, `status_event: "finish"` |
| List suites | `suites_list` | for grouping |

---

## References

| Description | File |
|-------------|------|
| Examples of skill execution | [examples.md](./references/examples.md) |
| MCP Setup & Configuration | `../testomatio-mcp/references/MCP_SETUP.md` |