---
name: reporter-setup
description: Set up Testomat.io test reporting to project. Configure automation framework (like Playwright, CodeceptJS, Mocha, Jest, WebdriverIO, etc.) reporters to connect the local test suite with Testomat.io TMS.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# TESTOMATIO-REPORTER-SETUP SKILL: What I do

This skill configures Testomat.io reporter in your automation project and sends test results to your testing workspace.

## When to Use

Trigger this skill when user wants to:

- Set up test reporting in their project.
- Add Testomat.io reporter to existing framework/project.
- Configure HTML reports for local test results.
- Push test results to Testomat.io TMS.

---

## Workflow: Setup testomatio/reporter

### Step 1: Detect Project Framework

Identify which testing framework is used in the project:

- Supported frameworks: `Playwright`, `CodeceptJS`, `Jest`, `Mocha`, `WebdriverIO`.

> If the framework is unclear, inspect the repository structure, dependencies, configuration files, and `package.json` scripts to determine which framework is used or ask the user which framework the project uses.

**If config found:**

- Proceed to Step 2 (Install reporter).
- Configure based on detected framework.

**If no config found:**

- Ask user: "No test framework detected. Do you want to:"

1. **Specify framework manually** to set up in current project - use "Interactive Setup" mode to identify all needed information.
2. **Create a new demo project** with framework + reporter pre-configured.


#### Interactive Setup (Optionaly)

Ask User:

1. **Framework?** (auto-detected from config, or ask if not found)
2. **Replace or Add your Testomat.io API key to .env file?** (format: `tstmt_xxxxx`)
3. **Use HTML reports?** (for local-only results without pushing to TMS)
4. **Push identified tests to the Testomat.io TMS?**
   <!-- 4. **Push identified tests to the Testomat.io TMS?** - by testomatio-sync-cases skill??? -->
   <!-- 5. **Configure artifacts?** (S3 storage for screenshots/videos) - optional -->

> Move to Step 2 (Install reporter) after filling all gaps.

#### Create Demo Project (if requested)

For new demo project, scaffold with:

- Framework: Playwright (default), CodeceptJS.
- Add sample test file and framework config.
- Pre-configure reporter in config.
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
- **If no token**: DO NOT ask the user to paste the API key into the chat! This prevents sensitive tokens from being sent in the AI prompt. Instead, generate and instruct the user to run a terminal command to securely add the token to their `.env` file.

Provide the user with a command similar to this to run in their terminal:

```bash
echo "TESTOMATIO=<YOUR_API_KEY_HERE>" >> .env
echo "TESTOMATIO_URL=https://app.testomat.io" >> .env
```

Ask the user to confirm once they have executed the command or manually updated the `.env` file. Do not proceed to the next step until they confirm.

> **Best Practice:** Use `.env` file instead of passing token as command variable.

### Step 5: Verify Setup

Run tests with reporter to verify configuration:

- First run: use HTML report mode for quick verification (by "HTML Reports" references instruction).

### Step 6: Import Tests to TMS

After the reporter is successfully configured and the "TESTOMATIO" API token is added to the project, push the detected tests to Testomat.io.
**Do not run this step** if the reporter is not configured or the token is missing.

Playwright Example:

```bash
npx check-tests@latest Playwright "**/*{.,_}{test,spec,cy}.js"
# or If no `.env` used
TESTOMATIO=tstmt_xxxxx npx check-tests@latest Playwright "**/*{.,_}{test,spec,cy}.js" --no-empty
```

✅ If all steps finished successfully, the tests will appear in the Testomat.io project:

- Suggest the user go to the Testomat.io UI interface and check if the tests have been added to the project scope.

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
<!-- - Artifacts storage: not configured -->
- Testomatio API key: detected (.env)

Verification:
✔ Tests executed successfully
✔ Reporter generated HTML report
✔ Reporter ready to push results to Testomatio

Next steps:

1. Execute tests and push results to TMS:

```bash
TESTOMATIO=tstmt_xxxxx npx playwright test --grep "@smoke"
```

> Documentation: https://docs.testomat.io/getting-started/

---

## References

| Description            | File                                        |
| ---------------------- | ------------------------------------------- |
| Reporter Configuration | ./references/TESTOMATIO_REPORTERS_CONFIG.md |
| HTML Reports           | ./references/TESTOMATIO_HTML_REPORT.md      |
| Artifacts (S3)         | ./references/TESTOMATIO_ARTIFACTS.md        |

---

## Error Handling

### Recovery

- **Missing `TESTOMATIO` token**
  - Instruct the user to securely add the API key to the `.env` file using the terminal command provided in Step 4. DO NOT ask them to paste it in the chat.
  - Tell them they can obtain it from their Testomat project: **Settings -> Project -> "Project Reporting API key"**
  - Example link for user's steps: `https://app.testomat.io/projects/<project-id>/settings/project`
  - If the user cannot find the token:
    - Ask them to open an existing Testomat project and copy the key from **Settings -> Project -> "Project Reporting API key"** value.
    - Or create a new project in Testomat.io and copy the **Project Reporting API key** from the same page.

- **Package not installed**
  - Offer to install it.

- **Config syntax error**
  - Fix based on the detected framework.

- **Unsupported or unclear framework errors**
  - Ask the user to confirm the framework or provide additional project details.

### Blocking issues

- **Invalid API key format or value**
  - Stop the setup and ask the user to provide a valid Testomat.io API token.

---

## Examples

**Global Setup Command:** Install @testomatio/reporter to my project and import tests to TMS.

```
Use testomatio-reporter-setup skill to install reporter and import tests to TMS
```

### Basic Setup (Playwright)

```
User: Add testomatio reporter to my project
Agent: Detected Playwright project. Installing @testomatio/reporter...
Agent: We need to configure your Testomat.io API key. For security, please DO NOT paste it here in the chat. Instead, please run the following command in your terminal, replacing `<YOUR_API_KEY>` with your actual key: `echo "TESTOMATIO=<YOUR_API_KEY>" >> .env`
Agent: Please let me know when you have done this!
User: Done!
Agent: Thanks! Configuring playwright.config.js...
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

| Action       | Command                                        |
| ------------ | ---------------------------------------------- |
| Install      | `npm install @testomatio/reporter --save-dev`  |
| HTML Report  | `TESTOMATIO_HTML_REPORT_SAVE=1 <test-command>` |
| Run with TMS | `<test-command>` (requires TESTOMATIO in .env) |
