---
name: qa-manual-test-run-passing-helper
description: Guide a QA engineer through manual test case execution by opening the browser, navigating to pages, performing easy verifications, taking screenshots, and asking for help only on complex steps. Use when user wants to pass/execute manual test cases from a .md file or from existing test cases in the TMS, creating a test run and tracking results. The skill handles browser automation via Playwright MCP while the user assists with non-automatable actions like login credentials, complex validations, or ambiguous test steps.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# QA-MANUAL-TEST-RUN-PASSING-HELPER SKILL: What I Do

This skill helps QA engineers execute manual test cases by automating browser interactions where possible and requesting human assistance only for complex or ambiguous steps. It creates a test run in TMS (if applicable), executes test cases one-by-one via browser automation, updates results in real-time, and collects screenshots.

## When to Use

Trigger this skill when user wants to:
- **Execute manual test cases** from a `.md` file or from TMS (by IDs/names)
- **Create a manual test run** in Testomat.io TMS
- **Pass/execute test cases** with browser automation assistance
- **Track test execution progress** with real-time status updates

---

## Workflow: Manual Test Case Execution

### Step 0: MCP Availability Check (Preparation)

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
   |------------|--------------|-------------|
   | **Available & configured** | Full workflow: create runs, update statuses in TMS | None |
   | **Not configured** | Execute test cases from `.md` file only, take screenshots | Cannot create TMS runs, cannot update statuses automatically |

4. **If MCP not configured:**
   - Inform user: "MCP is not configured. I can help with local test case execution from .md files and screenshots, but status updates require manual setup in TMS."
   - Continue with local-only workflow
   - Skip TMS-specific steps

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

Start a Playwright browser session to navigate to the app under test.

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

**Screenshot save location (in order of priority):**
1. **Project folder**: `./screens/testomatio-screenshots/{run_id}/{test_id}/{timestamp}.png`
2. **Root folder**: `./testomatio-screenshots/{run_id}/{test_id}/{timestamp}.png`
3. **Temp folder** (last resort): `/tmp/testomatio-screenshots/{run_id}/{test_id}/{timestamp}.png`

> If project has no write permissions, fall back to temp folder.

#### 3.5 Update Test Result in TMS

**Only if MCP is available** (from Step 0).

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

### Step 4: Final Summary

After all test cases executed:

1. List execution summary:
   - Total cases: N
   - Passed: N
   - Failed: N
   - Blocked: N
   - Skipped: N

2. Provide screenshot locations for user to attach to TMS if needed

---

## Error Handling

### Recovery

- **Browser launch failed** → ask user to verify Playwright is installed
- **Page navigation failed** → ask user to confirm URL or manually navigate
- **Element not found** → ask user to verify page state
- **MCP call failed** → retry once, then inform user to set status manually in TMS

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
| List suites | `suites_list` | for grouping |

---

## Quick Commands

| Action | MCP Tool | Notes |
|--------|----------|-------|
| Check MCP status | Read config files | See Step 0 |
| Create manual run | `runs_create` | Only if MCP available |
| Update test result | `testruns_update` | Only if MCP available |
| Get test details | `tests_get` | Only if MCP available |
| Search TMS tests | `tests_search` | Only if MCP available |

---

## References

| Description | File |
|-------------|------|
| Examples of skill execution | [examples.md](./references/examples.md) |
| MCP Setup & Configuration | `../testomatio-mcp/references/MCP_SETUP.md` |