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
- **WebdriverIO** => `wdio.conf.js`, `wdio.conf.ts`.
- **Jest or Mocha** => `jest.config.js`, `jest.config.ts`, `mocha.opts`, `.mocharc.*`.

#### Python
- **pytest** => `pytest.ini`, `conftest.py`.
- **Robot Framework** => `.robot`, `robot.toml` (TOML or YAML config).

#### Java
- **JUnit or TestNG** => `pom.xml` with testng dependency, `junit.jupiter`, `testng.xml`.

#### Other
- **XML** => XML report files for C#, PHP, Ruby, etc.

**If language and framework detected:**
- Proceed to Step 2 (Install reporter).
- Auto-configure based on detected language and framework.

**If no framework and Config detected:**
Ask user in "Interactive Setup" mode:

```
❓ No test framework was detected in your project.

To continue, please choose how to proceed.

**Specify a framework manually:**  
- JavaScript/TypeScript: Playwright, CodeceptJS, WebdriverIO, Jest.
- Python: Pytest, Robot Framework.
- Java: JUnit, TestNG, Cucumber, Karate.
- ✏️ Specify a framework name manually: Playwright, XML format, etc.
```

> Move to Step 2 (Install reporter) after filling all gaps.

### Step 1 Summary (Log)

After completing language and framework detection and/or interactive setup, output a short log-style summary:
```
- Program Language: ...
- Test Framework: ...
- Config file found: ...
- Testomatio API key source: ... (`.env` / user input / missing).
```

---

## Step 2: Configure Credentials

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

---

## Step 3: Testomat.io Reporter Setup

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
import testomatio from '@testomatio/reporter/webdriver';

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

### Python by pytestomatio

Use `pytestomatio` plugin for pytest-based Python projects.

#### Install

```bash
pip install pytestomatio
```

#### Configure & Run

```bash
# Sync tests with Testomat.io
pytest --testomatio sync

# Run and report tests
pytest --testomatio report
```

> Full documentation: [Testomat.io Python Reporting](https://docs.testomat.io/test-reporting/python/)

---

### Python by Robot Framework

Use specific Robot Framework instruction to configure.

#### Install

```bash
pip install robot-framework-reporter
```

#### Configure & Run

```bash
# Sync tests with Testomat.io
robot --listener Testomatio.Import path/to/tests

# Run and report tests
robot --listener Testomatio.Report path/to/tests
```

**IMPORTANT:** Use `pip3` if Python `2.x` and `3.x` coexist.

---

### Java

Use the appropriate `@testomatio/reporter` for Java test frameworks (JUnit, TestNG).

#### Configure

Add the dependency for your framework:

* **TestNG:**

```xml
<dependency>
  <groupId>io.testomat</groupId>
  <artifactId>java-reporter-testng</artifactId>
</dependency>
```

* **JUnit:**

```xml
<dependency>
  <groupId>io.testomat</groupId>
  <artifactId>java-reporter-junit</artifactId>
</dependency>
```

* **Karate:**

```xml
<dependency>
  <groupId>io.testomat</groupId>
  <artifactId>java-reporter-karate</artifactId>
</dependency>
```

#### Run

```bash
mvn clean test
```

> Full documentation: [Testomat.io Java/JUnit Reporting](https://docs.testomat.io/test-reporting/junit/)

---

## Step 4: Import Automated Tests to Testomat.io TMS

Import your automated test source code into Testomat.io to see test structure, code, and enable synchronization between your codebase and TMS.

> Full documentation: [Testomat.io Import Overview](https://docs.testomat.io/project/import-export/)

### JavaScript / TypeScript

Use `check-tests` CLI tool to import tests from JavaScript/TypeScript projects.

```bash
# Install check-tests
npx check-tests@latest <framework> "<glob-pattern>" [options]
```

#### Supported Frameworks & Patterns

| Framework | Command Example |
|-----------|-----------------|
| **Playwright**  | `npx check-tests@latest Playwright "tests/**/*.spec.js"` |
| **CodeceptJS**  | `npx check-tests@latest CodeceptJS "tests/**_test.js"` |
| **Cypress**     | `npx check-tests@latest cypress "cypress/e2e/**/*.js"` |
| **Jest**        | `npx check-tests@latest Jest "tests/**/*.test.js"` |
| **Mocha**       | `npx check-tests@latest mocha "test/**/*_test.js"` |
| **WebdriverIO** | `npx check-tests@latest webdriverio "test/**/*.js"` |

For **TypeScript** projects, add `--typescript` flag:

```bash
npx check-tests@latest Playwright "tests/**/*.spec.ts" --typescript
npx check-tests@latest Jest "tests/**/*.test.ts" --typescript
```

#### Examples

```bash
# Basic import
npx check-tests@latest Playwright "tests/**/*.spec.js"

# Import TypeScript
npx check-tests@latest Jest "tests/**/*.test.ts" --typescript

# Sync and auto-assign IDs in source code
npx check-tests@latest CodeceptJS "tests/**_test.js" --update-ids
```

---

### Java

Use `testomatio.jar` CLI to import Java test code into Testomat.io.

Supported Java Frameworks:
- **JUnit** ✅
- **TestNG** ✅
- **Karate** (via java-reporter-karate)

#### Quick Setup (One-Liner)

```bash
export TESTOMATIO=tstmt_xxxxx && \
curl -L -O https://github.com/testomatio/java-check-tests/releases/latest/download/testomatio.jar && \
java -jar testomatio.jar import
```

[Commands:
- `import` - Import test code to Testomat.io (dry-run without API key).
- `clean-ids` - Import tests without system ids.
- `sync` -  Import tests + pull IDs into source code (alias: `update-ids`).]

---

### Python

#### Pytest

```bash
# Sync tests with Testomat.io
pytest --testomatio sync

# Run and report tests
pytest --testomatio report
```

#### Robot Framework

```bash
# Import tests
robot --listener Testomatio.Import path/to/tests

# Run and report
robot --listener Testomatio.Report path/to/tests
```

---

### XML / JUnit Reports (C#, PHP, Ruby, Go, Swift, etc)

For languages and frameworks that don't have native Testomat.io reporters (like C#, PHP, Ruby, Go, etc), use JUnit XML format to import test results.

#### Generate JUnit XML Report

Configure your test framework to output results in JUnit XML format:

**NUnit (C#):**
```bash
dotnet test --logger:"trx;LogFileName=results.xml"
# Convert to JUnit XML if needed
```

**PHPUnit (PHP):**
```bash
./vendor/bin/phpunit --log-junit=results.xml
```

**Ruby (RSpec):**
```bash
rspec --format json --out results.json  # Then convert to JUnit XML
```

#### Import & Report to Testomat.io

Use the JUnit XML importer to send results to Testomat.io:

```bash
# Basic import from JUnit XML
npx check-tests@latest junit "path/to/results.xml"

# Specify multiple XML files
npx check-tests@latest junit "results/*.xml"
```

---

## Step 5: Verify Setup

Run your tests with the Testomat.io reporter to ensure everything is configured correctly.

### By Testomat.io MCP (Preferred)

**IF Testomat.io MCP enabled:** Use the MCP to verify that test results were successfully sent to Testomat.io. After running tests, fetch the latest run to confirm data was received.

**Run tests first:**
```bash
TESTOMATIO=tstmt_xxxxx npx <your-test-command>
```

**Success Run indicators:**
- New run IDs appears in the logs.
- Run status shows passed/failed status as expected.
- You can get run informatiom by system ID.

**Install DONE**: When you can fetch the new run via MCP, the reporter is correctly configured and data is being sent to Testomat.io!

> More MCP tools: [Testomat.io MCP Run Management](https://github.com/testomatio/mcp/blob/main/docs/tools.md#run-management)

---

### Debug Mode (Alternative)

Use Debug mode to capture reporter output locally **for only 1-2 tests**. This helps verify that data is generated correctly before sending it to Testomat.io.

To enable debug logs, set `DEBUG` environment variable to required module name:

```bash
DEBUG=@testomatio/reporter:pipe:testomatio npx <your-test-command>
```

**After running,** read the test execution logs to detect whether the Testomat.io reporter is enabled and configured correctly.

> Extra debug documentation: [Testomat.io Debugging Logs](https://docs.testomat.io/not-in-use/debugging/)

---

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
✔ Reporter ready to push results to Testomatio
✔ Run was created and verify by MCP

```

> Documentation: https://docs.testomat.io/getting-started/

---

## References

| Description            | File                                        |
| ---------------------- | ------------------------------------------- |
| Reporter Configuration | https://docs.testomat.io/test-reporting/frameworks/ |
| Python Test Reporting  | https://docs.testomat.io/test-reporting/python/ |
| Python Robot Framework | https://github.com/testomatio/robot-framework-reporter/blob/master/README.md |
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

**User Request:**
```
Add testomatio reporter to my Playwright project
```

**Agent Workflow:**

1. **Detect Framework** - Scans project files:
```
Program Language: JavaScript/TypeScript
Test Framework: Playwright
Config file: playwright.config.ts found
```

2. **Install Reporter** - Installs npm package:
```
npm install @testomatio/reporter --save-dev
```

3. **Configure Playwright** - Updates `playwright.config.ts`:
```js
reporter: [
  ['@testomatio/reporter/playwright'],
],
```

4. **Import Tests** - Import test structure to TMS:
```
npx check-tests@latest Playwright "tests/**/*.spec.ts" --typescript
```

5. **Verify Setup** - Uses MCP to confirm data received:
```json
// Run tests first and check logs
TESTOMATIO=tstmt_xxxxx npx playwright test --grep @smoke

// ...Then fetch latest run via MCP to verify - by run ids
```

**Final Output:**
```
✅ Reporter installed and configured
✅ Tests imported to Testomat.io (X tests found)
✅ Verification: New run Rxxxxxxx created with X test results

Next steps:
1. View results: https://app.testomat.io/projects/{project_id}/runs
```
