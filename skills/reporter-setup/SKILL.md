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
- Set up Testomat.io reporting to project from scratch.
- Add Testomat.io reporter to existing framework/project.
- Configure specific report options.
- Push test results to Testomat.io TMS.

---

## Workflow: Setup testomatio/reporter

### Step 1: Detect Project Framework

Identify which testing framework is used in the project: `Playwright`, `CodeceptJS`, `Jest`, `Mocha`, `WebdriverIO` (supported frameworks).

> If the framework is unclear, inspect the repository structure, dependencies, configuration files, and `package.json` scripts to determine which framework is used or ask the user which framework the project uses.

**If framework and Config detected:**
- Proceed to Step 2 (Install reporter).
- Configure based on detected framework.

**If no framework and Config detected:**
Ask user in "Interactive Setup" mode: 
```
❓ No test framework detected. Do you want to:
1. **Specify framework manually** to set up in current project.
2. **Configure Framework** by Testomat.io reporter - Yes?.
```

> Move to Step 2 (Install reporter) after filling all gaps.

#### Step 1 Summary (Log)

After completing framework detection and/or interactive setup, output a short log-style summary. 
Include:
- Test framework.
- Config file found (if any).
- Testomatio API key source (`.env` / user input / missing).
- Next action.

### Step 2: Testomat.io Reporter Setup

#### NPM Packages install

Install `@testomatio/reporter` package:

```bash
npm install @testomatio/reporter --save-dev
```

#### Configure Framework Config File

**Playwright:**

```js
reporter: [
  ['@testomatio/reporter/playwright'],
  // another user's reports...
],
```

**CodeceptJS:**

```js
plugins: {
  testomatio: {
    enabled: true,
    require: '@testomatio/reporter/codecept',
  }
}
// user's conf...
```

> **More examples or extra framework configuration** you can find in [Testomat.io Reporters Configuration](./references/TESTOMATIO_REPORTERS_CONFIG.md)
 
### Step 3: Configure Credentials

<<<<<<< HEAD:skills/reporter-setup/SKILL.md
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
=======
Check if "TESTOMATIO" API key exists in `.env`:
- **If exists**: Use it (no action needed).
- **If missing**: Add to `.env` token placeholder (format: `tstmt_xxxxx`) :

```env
TESTOMATIO=tstmt_xxxxx
...
```

And ask user to manually replace the placeholder by "Project Reporting API key" value.
>>>>>>> [REPORTER SETUP SKILL] Review fixes:plugins/test-management/skills/reporter-setup/SKILL.md

#### Get API Key (if user doesn’t have it)

<<<<<<< HEAD:skills/reporter-setup/SKILL.md
Run tests with reporter to verify configuration:

- First run: use HTML report mode for quick verification (by "HTML Reports" references instruction).
=======
Ask the user to manually replace the placeholder by correct Testomat.io API key.
They can find it in users' Testomat project:
```
Settings -> Project -> copy "Project Reporting API key" value

( <project-id> link - https://app.testomat.io/projects/<project-id>/settings/project )
```
OR Create a new project: `Navigate to Settings -> Project -> copy "Project Reporting API key" value`

### Step 4: Verify Setup

Run your tests with the Testomat.io reporter to ensure everything is configured correctly.
>>>>>>> [REPORTER SETUP SKILL] Review fixes:plugins/test-management/skills/reporter-setup/SKILL.md

#### ✅ Debug Mode (Preferred)

Use Debug mode to capture reporter output locally **for only 1-2 tests** to verify that data is generated correctly before sending it to Testomat.io.
Enable debug pipe by setting the environment variable and check that debug file was created:

```bash
TESTOMATIO_DEBUG=1 npx <your-test-command> replay ./debug-file.json
```

**More info** you can find in [Testomat.io DEBUG Pipe](./references/TESTOMATIO_DEBUG_PIPE.md) 

#### 🧾 HTML Report Mode (Alternative)

You can generate a local HTML report **for only 1-2 tests** to verify test execution without sending data to Testomat.io and check that html file was created:

```bash
TESTOMATIO_HTML_REPORT_SAVE=1 npx <your-test-command>
```

**More info** you can find in [Testomat.io HTML Pipe](./references/TESTOMATIO_HTML_REPORT.md) 

### Step 5: Import Tests to TMS

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

### Final Summary Example

After verifying the setup, output a short log-style summary of what was configured.

Testomatio Reporter configuration complete:

- Framework: Playwright
- Reporter: @testomatio/reporter installed
- Config updated: playwright.config.ts
- Debug or HTML: enabled
<!-- - Artifacts storage: not configured -->
- Testomatio API key: detected (.env)

Verification:
✔ Tests executed successfully
✔ Reporter generated HTML report
✔ Reporter ready to push results to Testomatio

Next steps:
1. Execute tests and push run results to TMS:

```bash
TESTOMATIO=tstmt_xxxxx npx playwright test --grep "@smoke"
```

> Documentation: https://docs.testomat.io/getting-started/

---

## References

| Description            | File                                        |
| ---------------------- | ------------------------------------------- |
| Reporter Configuration | ./references/TESTOMATIO_REPORTERS_CONFIG.md |
| HTML Pipe | ./references/TESTOMATIO_HTML_REPORT.md |
| Debug Pipe | `TESTOMATIO_DEBUG=1 <test-command>` |
| Artifacts (S3) | ./references/TESTOMATIO_ARTIFACTS.md |

---

## Error Handling

### Recovery

For each error type, retry up to **3 attempts** before stopping.

- **Package not installed**
  - Offer to install it.

* **Unsupported or unclear framework errors**
  - Ask user to clarify framework or provide more details.

* **Invalid TESTOMATIO API key**
  - Ask user to provide or correct the key.


If the error still persists after 3 attempts:
* ❌ Stop execution
* Clearly explain:
  - What failed?
  - Why it failed?
  - What the user should do to fix it manually?
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
Agent: Please replace API token in `.env` file
Agent: Run tests with: npx playwright test and push results to TMS
```

---

## Quick Commands

| Action | Command |
|--------|---------|
| Install | `npm install @testomatio/reporter --save-dev` |
| Import to TMS | `npx check-tests@latest ...` |
