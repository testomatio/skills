---
name: qa-e2e-tests-reporting
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

Check if `TESTOMATIO` API key exists in `.env`:
- **If exists**: Use it (no action needed).
- **If missing**: Create or update `.env` file with a placeholder token:

```env
TESTOMATIO=tstmt_xxxxx
...
```

> And **ASK** user to manually replace the placeholder by "Project Reporting API key" value (this way os maximum safety).
(Below are instructions on how to do this)

### User's Hint: How to set API Key (if user doesn’t have it)

Ask the user to obtain it from Testomat.io project:
```md
1. **Open Testomat.io** => go to your project
2. **Get API key from Setting page**: Settings → Project → Project Reporting API key**
_( Project path example by "project-id": `https://app.testomat.io/projects/<project-id>/settings/project` )_
3. **Update `.env`**: Replace `tstmt_xxxxx` with your actual key
```

Example message to user:
```
✅ Added `TESTOMATIO=tstmt_xxxxx` placeholder to .env

To activate reporting:
1. Go to Testomat.io → your project → Settings → Project
2. Copy "Project Reporting API key"
3. Replace `tstmt_xxxxx` in .env with your actual key
4. Run tests: TESTOMATIO=tstmt_xxxxx npx <test-command>
```

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

It is required to ask the user to provide the TESTOMATIO environment variable before running tests.

Set up the Testomat API key as an environment variable:

```bash
export TESTOMATIO=<tstmt_api_key>
```

Verify that the environment variable is configured correctly and starts with tstmt_.

Add the dependency for your framework:

* **TestNG:**

```xml
<dependency>
  <groupId>io.testomat</groupId>
  <artifactId>java-reporter-testng</artifactId>
  <version>{LATEST_STABLE_VERSION}</version>
</dependency>
```

* **JUnit:**

```xml
<dependency>
  <groupId>io.testomat</groupId>
  <artifactId>java-reporter-junit</artifactId>
  <version>{LATEST_STABLE_VERSION}</version>
</dependency>
```

* **Cucumber:**

```xml
<dependency>
  <groupId>io.testomat</groupId>
  <artifactId>java-reporter-cucumber</artifactId>
  <version>{LATEST_STABLE_VERSION}</version>
</dependency>
```

* **Karate:**

```xml
<dependency>
  <groupId>io.testomat</groupId>
  <artifactId>java-reporter-karate</artifactId>
  <version>{LATEST_STABLE_VERSION}</version>
</dependency>
```

#### Run tests and generate a report link

```bash
mvn clean test
```

After tests finish, scan the output for a run ID. If found, output the link to the user:

```
View results: https://app.testomat.io/projects/{project-id}/runs/{run-id}
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

It's required after every test execution.

Use `testomatio.jar` CLI to import Java test code into Testomat.io.

Supported Java Frameworks:
- **JUnit** ✅
- **TestNG** ✅

#### Quick Setup (One-Liner)

Run ONLY from project root.

```bash
cd <project-root>

export TESTOMATIO=tstmt_xxxxx && \
curl -L -O https://github.com/testomatio/java-check-tests/releases/latest/download/testomatio.jar && \
java -jar testomatio.jar sync
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

## Step 6: Configure Artifacts (Optional - Trigger on User Request)

After successfully running your first tests and checking results in Testomat.io, you can suggest the user configure artifacts storage to save screenshots, videos, traces, and logs alongside test results.

**Important Notes:**
- Only trigger this "Configure Artifacts"" if the user explicitly asks for artifacts configuration or mentions wanting to save screenshots, videos, traces, or logs.
- Artifacts are optional but highly recommended — they help debug failing tests by providing visual evidence.

**Prerequisites:** First test report executed successfully ✅

### Check for Existing Configuration

First, check if S3 credentials already exist in `.env` file:

```
# Look for these variables:
S3_ACCESS_KEY_ID=...
S3_BUCKET=...
S3_REGION=...
```

- **If credentials exist**: Proceed to verify configuration (Stage 2)
- **If missing**: Proceed to Stage 1 to create bucket and configure

### Stage 1.1: Create S3 Bucket (if needed)

If project doesn't have S3 bucket yet, **provide step-by-step instructions** for their chosen provider based on official documentation.
(**Recommendation: Use one S3 bucket per project** to keep artifacts organized and isolated).

| Provider | Link |
|----------|------|
| **AWS S3** | https://s3.console.aws.amazon.com/s3 |
| **DigitalOcean** | https://cloud.digitalocean.com/spaces |
| **Google Cloud Storage** | https://console.cloud.google.com/storage |
| **Cloudflare R2** | https://dash.cloudflare.com/ |
| **Minio** | Self-hosted or cloud instance |

**After creating the bucket, the user needs to:**
1. Obtain S3 credentials (Access Key ID, Secret Access Key) from the provider.
2. Choose configuration method below (Option A or B).
3. Show summary about configured bucket store.

### Stage 1.2: Configure Bucket Credentials

Choose one of the following options:
- Option A: Testomat.io UI Configuration.
- Option B: Project Environment Variables

#### Option A: Testomat.io UI Configuration (Recommended - Secure)

> ⚠️ **AI Agent cannot perform this action due to security restrictions:** Instruct the user to do this manually.

**Tell the user:**

```
Due to security restrictions, I cannot access your Testomat.io project settings directly.
Please configure artifacts manually:

1. Navigate to: https://app.testomat.io/projects/<project-id>/settings/artifacts
2. Enable "Share credentials" toggle
3. Enter your S3 credentials:
- Access Key ID
- Secret Access Key
- Bucket name
- Region
- Endpoint (for non-AWS providers like DigitalOcean, Cloudflare R2, GCS)
```

**After completing, let me know and we'll verify the configuration.**

#### Option B: Environment Variables

Add S3 credentials to your `.env` file or CI pipeline:

```env
# Required for all providers
S3_ACCESS_KEY_ID=your_access_key
S3_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET=your_bucket_name
S3_REGION=us-west-1

# Optional: For non-AWS providers (DigitalOcean, Minio, Cloudflare R2, GCS)
S3_ENDPOINT=https://your-endpoint-url

# Optional: Enable private access mode (recommended for security)
TESTOMATIO_PRIVATE_ARTIFACTS=1
```

To disable artifacts upload:
```env
TESTOMATIO_DISABLE_ARTIFACTS=1
```

**Configuration Examples:**

#### AWS

```env
S3_ACCESS_KEY_ID=xxx
S3_SECRET_ACCESS_KEY=xxx
S3_BUCKET=testomatio-artifacts
S3_REGION=us-west-1
```

#### Cloudflare R2

```env
S3_ACCESS_KEY_ID=xxx
S3_SECRET_ACCESS_KEY=xxx
S3_BUCKET=testomatio-artifacts
S3_REGION=auto
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
S3_FORCE_PATH_STYLE=true
```

> More configuration options: [Testomat.io Artifacts](https://docs.testomat.io/test-reporting/artifacts/)

### Stage 2: Verify Configuration

After configuring credentials (either via UI or environment variables), verify artifacts are being uploaded correctly:

1. **Run tests with artifacts** - Execute a test run that produces screenshots, videos, or traces:

```bash
TESTOMATIO=tstmt_xxxxx npx <your-test-command>
```

2. **Ask To Check Testomat.io UI Runs** - Navigate to the run results:
`https://app.testomat.io/projects/<project-id>/runs`

3. **Verify artifacts presence by user comments** - Click on a test with artifacts (failed tests typically have screenshots):
- Look for 📎 attachment icon or "Artifacts" section
- Screenshots, videos, or traces should be visible and clickable
- For Playwright: traces should open in Playwright trace viewer

> **Success indicator:** Artifacts (screenshots, videos, traces) are displayed in test results and are clickable/viewable.

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
- Artifacts storage: configured (optional step)
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
Use qa-e2e-tests-reporting skill to install reporter and import tests to TMS
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
