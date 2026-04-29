---
name: reporter-setup
description: Install and configure Testomat.io reporting in a test automation project when a user needs to integrate their tests with Testomat.io. Detect the testing framework (e.g., Playwright, CodeceptJS, Jest, Mocha, WebdriverIO, JUnit, Pytest, XML, etc) and automatically set up the appropriate reporter so test results are sent to the Testomat.io TMS.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# REPORTER-SETUP SKILL: What I do

This skill configures Testomat.io reporter in your automation project and sends test results to your testing workspace.

## When to Use

Trigger this skill when user wants to:
- Set up Testomat.io reporting to project from scratch.
- Add Testomat.io reporter to existing framework/project.
- Configure specific report options.
- Push test results to Testomat.io TMS.

---

# Workflow: Setup testomatio/reporter

## Step 1: Detect Project Language & Framework

### Phase 1: Detect Program Language

First, identify the primary programming language of the project by inspecting:
- `package.json` => JavaScript/TypeScript.
- `requirements.txt`, `pyproject.toml`, `setup.py` => Python.
- `pom.xml`, `build.gradle` => Java.
- `*.csproj` => C#/.NET.
- `composer.json` => PHP.
- `Gemfile` => Ruby.

### Phase 2: Detect Test Framework

Based on the detected language, identify the specific test framework:

#### JavaScript / TypeScript
- **Playwright** => `playwright.config.ts`, `playwright.config.js`.
- **CodeceptJS** => `codecept.conf.js`, `codecept.config.js`.
- **Jest** => `jest.config.js`, `jest.config.ts`.
- **Mocha** => `mocha.opts`, `.mocharc.*`.
- **WebdriverIO** => `wdio.conf.js`, `wdio.conf.ts`.

#### Python
- **pytest** => `pytest.ini`, `pyproject.toml`, `conftest.py`
- **unittest** => standard Python unittest

#### Java
- **JUnit** => `pom.xml` with junit dependency, `junit.jupiter`
- **TestNG** => `testng.xml`

#### Other
- **XML/JUnit** => XML report files for C#, PHP, Ruby, etc.

> If the framework is unclear, inspect the repository structure, dependencies, configuration files to determine which framework is used or ask the user which framework the project uses.

**If language and framework detected:**
- Proceed to Step 2 (Install reporter).
- Configure based on detected language and framework.

**If no framework and Config detected:**
Ask user in "Interactive Setup" mode:

```
❓ No test framework was detected in your project.

Detected Program Language: ...

To continue, please choose how to proceed:

**Specify a framework manually**. Available frameworks for [LANGUAGE]:  
  - JavaScript/TypeScript: Playwright, CodeceptJS, WebdriverIO, Jest, Mocha
  - Python: pytest, unittest
  - Java: JUnit, TestNG
  - Other: XML/JUnit format
```

> Move to Step 2 (Install reporter) after filling all gaps.

### Step 1 Summary (Log)

After completing language and framework detection and/or interactive setup, output a short log-style summary:
```
- Program Language: ...
- Test Framework: ...
- Config file found: ...
- Testomatio API key source (`.env` / user input / missing).
```

---

## Step 2: Testomat.io Reporter Setup

Based on the detected Program Language and Test framework, install and configure the appropriate reporter.

### JavaScript / TypeScript

Use `@testomatio/reporter` for NodeJS test frameworks.

#### Install Package

```bash
npm install @testomatio/reporter --save-dev
```

#### Configure by Framework

**Playwright** — Update `playwright.config.ts` or `playwright.config.js`:

```js
reporter: [
  ['@testomatio/reporter/playwright'],
  // other reporters...
],
```

**CodeceptJS** — Update `codecept.conf.js` or `codecept.config.js`:

```js
plugins: {
  testomatio: {
    enabled: true,
    require: '@testomatio/reporter/codecept',
  }
}
```

**WebdriverIO** — Update `wdio.conf.js`:

```js
const testomatio = require('@testomatio/reporter/webdriver');

exports.config = {
  // ...
  reporters: [
    [testomatio, { apiKey: process.env.TESTOMATIO }],
  ],
};
```

**Jest** — Update `jest.config.js` or `jest.config.ts`:

```js
module.exports = {
  reporters: ['default', ['@testomatio/reporter/jest', { apiKey: process.env.TESTOMATIO }]],
};
```

**Mocha** — Run with CLI flags:

```bash
mocha --reporter @testomatio/reporter/mocha --reporter-options apiKey=tstmt_xxx
```

> More configuration examples: [Testomat.io NodeJS Frameworks](https://docs.testomat.io/test-reporting/frameworks/)

---

### Python

Use `pytestomatio` plugin for pytest-based Python projects.

#### Install

```bash
pip install pytestomatio
```

#### Configure & Run

```bash
# Sync tests with Testomat.io
TESTOMATIO={API_KEY} pytest --testomatio sync

# Run and report tests
TESTOMATIO={API_KEY} pytest --testomatio report
```

> Full documentation: [Testomat.io Python Reporting](https://docs.testomat.io/test-reporting/python/)

---

### Java

Use JUnit XML reports with `@testomatio/reporter` for Java test frameworks (JUnit, TestNG).

#### Generate XML Report

```bash
mvn clean test
```

#### Import to Testomat.io

```bash
TESTOMATIO={API_KEY} npx report-xml "target/surefire-reports/*.xml" --java-tests
```

- Use `--java-tests` flag when tests are in a non-standard location
- Test IDs in test names: `test name @T8acca9eb`
- File attachments: print `file://{path}` to stdout, Test ID: `tid://@T8acca9eb`

> Full documentation: [Testomat.io Java/JUnit Reporting](https://docs.testomat.io/test-reporting/junit/)

---

### Other Languages (C#, PHP, Ruby)

XML/JUnit format reporters can use `report-xml` CLI tool:

| Language | Framework | Output Format |
|----------|-----------|---------------|
| C#/.NET | NUnit, xUnit | JUnit XML |
| PHP | PHPUnit | JUnit XML |
| Ruby | Minitest | JUnit reporter |

> Configuration details: [Testomat.io Reporters](https://docs.testomat.io/test-reporting/frameworks/)

## Step 3: Configure Credentials

Check if "TESTOMATIO" API key exists in `.env`:
- **If exists**: Use it (no action needed).
- **If missing**: Add to `.env` token placeholder (format: `tstmt_xxxxx`) :

```env
TESTOMATIO=tstmt_xxxxx
...
```

And ask user to manually replace the placeholder by "Project Reporting API key" value.

### Get API Key (if user doesn’t have it)

Ask the user to obtain it from Testomat.io project:
- Navigate to **Settings → Project → Project Reporting API key**
_( Project path example by "project-id": `https://app.testomat.io/projects/<project-id>/settings/project` )_

## Step 4: Verify Setup

Run your tests with the Testomat.io reporter to ensure everything is configured correctly.

### Debug Mode (Preferred)

Use Debug mode to capture reporter output locally **for only 1-2 tests**. This helps verify that data is generated correctly before sending it to Testomat.io.

Enable Debug pipe by setting the environment variable:

```bash
TESTOMATIO_DEBUG=1 npx <your-test-command>
```

**After running,** read the test execution logs to detect whether the Testomat.io reporter is enabled and configured correctly.

### HTML Report Mode (Alternative)

You can generate a local HTML report **for only 1-2 tests** to verify test execution without sending data to Testomat.io and check that html file was created:

```bash
TESTOMATIO_HTML_REPORT_SAVE=1 npx <your-test-command>
```

**More info** you can find in [Testomat.io HTML Pipe](https://docs.testomat.io/test-reporting/pipes/html/)

## Step 5: Import Tests to TMS

After the reporter is successfully configured and the "TESTOMATIO" API token is added to the project, push the detected tests to Testomat.io.
(Try to use `sync-cases` skill if available for synchronize tests)
**Do not run this step** if the reporter is not configured or the token is missing.

Playwright Example:

```bash
# Import test by JavaScript
npx check-tests@latest Playwright "**/*{.,_}{test,spec,cy}.js"

# Import test by TypeScript
npx check-tests@latest Playwright "**/*{.,_}{test,spec,cy}.js" --typescript

# or If no `.env` used
TESTOMATIO=tstmt_xxxxx npx check-tests@latest Playwright "**/*{.,_}{test,spec,cy}.js" --no-empty
```

**If all steps finished successfully**, the tests will appear in the Testomat.io project:
- Suggest the user go to the Testomat.io UI interface and check if the tests have been added to the project scope.

## Final Summary Example

After verifying the setup, output a short log-style summary of what was configured.

Testomatio Reporter configuration complete:

```
- Framework: Playwright
- Program Language: JS
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
TESTOMATIO=tstmt_xxxxx npx playwright test --grep "@smoke"
```

> Documentation: https://docs.testomat.io/getting-started/

---

## References

| Description            | File                                        |
| ---------------------- | ------------------------------------------- |
| Reporter Configuration | https://docs.testomat.io/test-reporting/frameworks/ |
| Python Test Reporting  | https://docs.testomat.io/test-reporting/python/ |
| Java/JUnit Reporting   | https://docs.testomat.io/test-reporting/junit/ |
| HTML Pipe              | ./references/TESTOMATIO_HTML_REPORT.md |
| Debug Pipe | `TESTOMATIO_DEBUG=1 <test-command>` |
| Artifacts (S3) | ./references/TESTOMATIO_ARTIFACTS.md |

---

## Error Handling

### Recovery

Attempt recovery before failing when:
- **Missing `TESTOMATIO` token**
  - Ask the user to provide it
  - Show where to find it in Testomat.io

- **Package not installed**
  - Offer to install it.

### Hard Fail (Stop immediately)

Stop execution if:
- System errors.
- CLI sync command fails (network/auth/401/403).

---

## Examples

**Global Setup Command:** Install @testomatio/reporter to my project and import tests to TMS.

```
Use reporter-setup skill to install reporter and import tests to TMS
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
| Install (JS/TS) | `npm install @testomatio/reporter --save-dev` |
| Import to TMS (Playwright) | `npx check-tests@latest Playwright "**/*{.,_}{test,spec,cy}.js"` |
| Import to TMS (Jest) | `npx check-tests@latest Jest "**/*.test.js"` |
| Import to TMS (Mocha) | `npx check-tests@latest Mocha "test/**/*_test.js"` |
| Import to TMS (CodeceptJS) | `npx check-tests@latest CodeceptJS "tests/**_test.js"` |
| Import to TMS (Python) | `pytest --testomatio sync` |