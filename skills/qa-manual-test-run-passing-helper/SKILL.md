---
name: qa-manual-test-run-passing-helper
description: Assist a QA engineer executing manual test cases in the browser with real-time TMS updates. Reads test cases from .md files or TMS, opens the browser, navigates to pages, performs automated verifications, asks for help on complex steps (login, 2FA, ambiguous UI), classifies each case as PASS/FAIL/BLOCKED/OBSERVATION, takes screenshots, and posts results to Testomat.io TMS via MCP when available. Use when user says "run/pass/execute manual tests", "start a manual run", "test in browser", or "pass test cases". The user executes non-automatable steps and records verdicts; you handle browser automation and TMS updates.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# QA-MANUAL-TEST-RUN-PASSING-HELPER SKILL: What I Do

This skill helps QA engineers execute manual test cases by browser interactions where possible and requesting human assistance only for complex or ambiguous steps. It creates a test run in TMS (if applicable), executes test cases one-by-one via browser automation, updates results in real-time, and collects screenshots.

## Workflow: Manual Test Case Execution

## Possible flows

Execution branches based on available tools:
- **MCP available** → Create run in TMS, use browser automation, update statuses
- **MCP not available** → Work locally, no TMS updates

Browser options:
- **Claude browser extention** → Execute step by step instruction in browser automatically.
- **Playwright MCP** → Full automation (navigate, verify, screenshot, update TMS)
- **CLI only** → Guided mode (you describe actions, I take screenshots)
- **No browser tools** → Guide only (I parse cases, you perform steps)

## Critical rules

- **You are the assistant, not the tester.** The user executes tests and records verdicts.
- **Never guess.** If URL, API base, or endpoint is unclear — ask the user.
- **End your turn after handoff.** Wait for the user's verdict before continuing.

---

### Step 0.1: MCP Availability Check

Check if Testomat.io MCP is available. If configured, use it for TMS operations. If not, inform user and suggest configuring for full functionality:

```
"MCP is not configured. Configure Testomat.io MCP for full functionality (create runs, update statuses). 
Alternatively, I can help with local test execution from .md files and screenshots only."
```

Skip TMS-specific steps if MCP unavailable.

---

### Step 0.2: Browser Automation Tools Check

Check if browser automation tools are available (try `browser_navigate`). If no tools available, offer "guide only" mode where you describe steps and user performs them.

Ask user preference: "Run in headless mode (faster, no visible window) or with visible browser?" Default to headless unless user requests otherwise.

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

Ask user preference: `❓ Run in headless mode (faster, no visible window) or with visible browser?` Default to headless unless user requests otherwise.

#### 3.2 Navigate to Target Page

Use test case steps to determine navigation:
- If test case specifies a URL path → navigate directly
- If test case says "login first" → ask user for credentials or skip if already logged in
- If test case says "go to page X" → attempt navigation; if failed, ask user for help

**Never guess a URL or API endpoint.** If unclear, ask the user and list the candidates you found.

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
 - Action required: {specific request}
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
| Passed, but defect/anomaly outside test scope noticed | `pass` + note as observation |

**Rules:**
- **In doubt → FAIL.** A fail with description is safer than marking pass when unsure.
- **BLOCKED is not FAIL.** The test couldn't run, it didn't fail.
- **OBSERVATION doesn't replace FAIL.** If expected result doesn't match, that's a fail.

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

**IMPORTANT**: Always clean up after test execution:
- Close browser session
- Remove temporary scripts and files created during session
- Remove browser cache and HAR files if created

> Provide final summary only after cleanup is complete.

## Error Handling

On failure: close browser, remove temp files, then attempt recovery or inform user.

**Hard Fail conditions:**
- Invalid test case format (cannot parse)
- MCP authentication failed (continue without TMS features)
- All test cases blocked (no progress possible)

> Inform user if we have such kind of issues without extra attempts.
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
| MCP Setup & Configuration | `../testomatio-mcp/references/MCP_SETUP.md` |