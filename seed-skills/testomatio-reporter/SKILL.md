---
name: testomatio-reporter
description: Configure Testomat.io reporter in an existing automation project. Add test reporting to Playwright, CodeceptJS, Mocha, Jest, or WebdriverIO projects.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# TESTOMATIO-REPORTER SKILL: What I do

This skill configures Testomat.io reporter in your automation project and sends test results to your testing workspace.

## When to Use

Trigger this skill when user wants to:
- Set up test reporting in their project
- Add Testomat.io reporter to existing tests
- Configure HTML reports for local test results
- Push test results to Testomat.io TMS

---

## Workflow: Setup testomatio/reporter

### Step 1: Detect Project Framework

First, check for existing test framework config in project:
- Playwright: `playwright.config.*`;
- CodeceptJS: `codecept.conf.*`;
- Jest: `jest.config.*`;
- WebdriverIO: `wdio.conf.*`;
- or some custom `package.json` with test scripts

**If config found:**
- Proceed to Step 2 (Install reporter).
- Configure based on detected framework.

**If no config found:**
* Ask user: "No test framework detected. Do you want to:"

1. **Specify framework manually** to set up in current project - use "Interactive Setup" mode to identify all needed information.
2. **Create a new demo project** with framework + reporter pre-configured.

#### Interactive Setup (Optionaly)

Ask User:
1. **Framework?** (auto-detected from config, or ask if not found)
2. **Testomatio API key?** (format: `tstmt_xxxxx`) - or use existing `.env`
3. **Configure artifacts?** (S3 storage for screenshots/videos) - optional
4. **Use HTML reports?** (for local-only results without pushing to TMS)

> Move to Step 2 (Install reporter) after filling all gaps.

#### Create Demo Project (if requested)

For new demo project, scaffold with:
- Framework: Playwright (default), CodeceptJS, or Jest
- Add sample test file
- Pre-configure reporter in config
- Create `.env` with placeholder for "TESTOMATIO" token.

**Step 1 Summary (Log):** After completing framework detection and/or interactive setup, output a short log-style summary. Include:
- Detected framework (or user-selected framework)
- Config file found (if any)
- Testomatio API key source (.env / user input / missing)
- Optional features selected (artifacts, HTML reports)
- Next action

### Step 2: Install Reporter

Install `@testomatio/reporter` package:
```bash
npm install @testomatio/reporter --save-dev
```

### Step 3: Configure Framework

Add reporter configuration based on framework type. See `references/TESTOMATIO_REPORTERS_CONFIG.md`.

### Step 4: Configure Credentials

Check for existing `.env` file with "TESTOMATIO" token:
- **If token exists**: Use it (no action needed)
- **If no token**: Ask user for API key (format: `tstmt_xxxxx`) and create `.env`:

```env
TESTOMATIO=tstmt_xxxxx
TESTOMATIO_URL=https://app.testomat.io
```

> **Best Practice:** Use `.env` file instead of passing token as command variable.

### Step 5: Verify Setup

Run tests with reporter to verify configuration:
- First run: use HTML report mode for quick verification (by "HTML Reports" references instruction).

### Step 6: Push tests to TMS

Push tests to TMS based with the "TESTOMATIO" token.

Playwright Example:

```bash
npx check-tests@latest Playwright "**/*{.,_}{test,spec,cy}.js"
# or If no `.env` used
TESTOMATIO=tstmt_xxxxx npx check-tests@latest Playwright "**/*{.,_}{test,spec,cy}.js" --no-empty
```

> After that, you can go to the Testomat.io UI and check that the tests have been added to the project scope.

### Final Summary

After verifying the setup, output a short log-style summary of what was configured. Include:
- Framework used.
- Reporter installation status.
- Configuration file updated.
- Optional features enabled.
- Verification of setup and test import.
- Next actions for the user.

#### Output Example

Testomatio Reporter configuration complete:
- Framework: Playwright
- Reporter: @testomatio/reporter installed
- Config updated: playwright.config.ts
- HTML reports: enabled
- Artifacts storage: not configured
- Testomatio API key: detected (.env)

Verification:
✔ Tests executed successfully
✔ Reporter generated HTML report
✔ Reporter ready to push results to Testomatio

Next steps:
1. Suggets a new automation tests
2. Push a new test to TMS:

```bash
TESTOMATIO=tstmt_xxxxx npx playwright test --grep "@smoke"
```

> Documentation: https://docs.testomat.io/getting-started/

---

## References

| Description | File |
|-------------|------|
| Reporter Configuration | ./references/TESTOMATIO_REPORTERS_CONFIG.md |
| HTML Reports | ./references/TESTOMATIO_HTML_REPORT.md |
| Artifacts (S3) | ./references/TESTOMATIO_ARTIFACTS.md |

---

## Error Handling

### Recoverable

- Missing "TESTOMATIO" token => Ask user to provide
- Package not installed => Offer to install
- Config syntax error => Fix based on framework

### Hard Fail

- Invalid API key format => Stop, ask for valid token
- Unsupported framework => Stop, explain supported frameworks

---

## Examples

### Global Setup Command

Install @testomatio/reporter to my project and import tests to TMS.

```
Use testomatio-reporter skill to install reporter and import tests to TMS
```

### Basic Setup (Playwright)

```
User: Add testomatio reporter to my project
Agent: Detected Playwright project. Installing @testomatio/reporter...
Agent: Please provide your Testomat.io API key (format: tstmt_xxxxx)
User: tstmt_abc123
Agent: Created .env file. Configuring playwright.config.js...
Agent: Run tests with: npx playwright test
```

### HTML Report Only (No TMS)

```
User: I want local HTML reports by @testomatio/reporter
Agent: Setting up HTML reports...
Agent: Run: TESTOMATIO_HTML_REPORT_SAVE=1 npx playwright test
Agent: Report saved to testomatio-report/testomatio-report.html
```

### Full Integration

```
User: Connect my Jest tests to Testomat.io
Agent: Detected Jest project. Adding reporter to jest.config.js...
Agent: Run: npx jest
Agent: ✓ Tests pushed to Testomat.io. View at: https://app.testomat.io/run/xxx
```

---

## Quick Commands

| Action | Command |
|--------|---------|
| Install | `npm install @testomatio/reporter --save-dev` |
| HTML Report | `TESTOMATIO_HTML_REPORT_SAVE=1 <test-command>` |
| Run with TMS | `<test-command>` (requires TESTOMATIO in .env) |
