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

## Step 1: Detect Project Framework

Identify which testing framework is used in the project: `Playwright`, `CodeceptJS`, `Jest`, `Mocha`, `WebdriverIO`, JUnit, Pytest, XML, etc.

> If the framework is unclear, inspect the repository structure, dependencies, configuration files, and `package.json` scripts to determine which framework is used or ask the user which framework the project uses.

**If framework and Config detected:**
- Proceed to Step 2 (Install reporter).
- Configure based on detected framework.

**If no framework and Config detected:**
Ask user in "Interactive Setup" mode:

```
❓ No test framework was detected in your project.

To continue, please choose how to proceed:

**Specify a framework manually**. Available frameworks:  
  - Playwright
  - CodeceptJS
  - WebdriverIO
  - Jest
  - Mocha
  - JUnit
  - Pytest
  - XML
  - ...
```

> Move to Step 2 (Install reporter) after filling all gaps.

### Step 1 Summary (Log)

After completing framework detection and/or interactive setup, output a short log-style summary:
```
- Test framework: ...
- Program Language: ...
- Config file found (if any).
- Testomatio API key source (`.env` / user input / missing).
```

## Step 2: Testomat.io Reporter Setup

### JavaScript / TypeScript

Use `@testomatio/reporter` for NodeJS test frameworks.

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
  // other reporters...
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
```

**WebdriverIO:**

```js
const testomatio = require('@testomatio/reporter/webdriver');

exports.config = {
  // ...
  reporters: [
    [testomatio, { apiKey: process.env.TESTOMATIO }],
  ],
};
```

**Jest:**

Add the following line to jest.config.js:

```js
// jest.config.js
module.exports = {
  reporters: ['default', ['@testomatio/reporter/jest', { apiKey: process.env.TESTOMATIO }]],
};
```

**Mocha:**

```bash
mocha --reporter @testomatio/reporter/mocha --reporter-options apiKey=tstmt_xxx
```

> **More examples or extra framework configuration** you can find in [Testomat.io Reporters NodeJS Test Frameworks Configuration](https://docs.testomat.io/test-reporting/frameworks/)

### Java

Use JUnit XML reports with `@testomatio/reporter` for Java test frameworks (JUnit, TestNG):

1. **Generate JUnit XML report** with your test runner (e.g., Maven/Surefire):

```bash
mvn clean test
```

2. **Import report** into Testomat.io:

```bash
TESTOMATIO={API_KEY} npx report-xml "target/surefire-reports/*.xml" --java-tests
```

- Use `--java-tests` flag when tests are in a non-standard location
- Test IDs can be assigned in test names: `test name @T8acca9eb`
- File attachments: print `file://{path}` to stdout, Test ID: `tid://@T8acca9eb`

> **More examples or extra framework configuration** you can find in [Testomat.io Reporters Java Test Frameworks Configuration](https://docs.testomat.io/test-reporting/junit/)

### Python

Use `pytestomatio` plugin for pytest-based Python projects:

1. **Install**:

```bash
pip install pytestomatio
```

2. **Sync tests** with Testomat.io:

```bash
TESTOMATIO={API_KEY} pytest --testomatio sync
```

3. **Run and report** tests:

```bash
TESTOMATIO={API_KEY} pytest --testomatio report
```

> **Full documentation** see [Testomat.io Python Test Reporting](https://docs.testomat.io/test-reporting/python/)

### Others

XML/JUnit format reporters (C#, PHP, Ruby, etc.) can use `report-xml` CLI tool. See [Testomat.io Reporters Configuration](https://docs.testomat.io/test-reporting/frameworks/) for details.
- **C#/.NET**: NUnit, xUnit with JUnit XML output
- **PHP**: PHPUnit XML reports
- **Ruby**: Minitest with JUnit reporter

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
| Import to TMS (Java) | `npx report-xml "target/surefire-reports/*.xml" --java-tests` |
| Import to TMS (XML) | `npx report-xml "report.xml" --lang java` |