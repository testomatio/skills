---
name: sync-cases
description: Synchronize Markdown test scenarios between local project and Test Management Tool (Testomat.io). Supports custom directories, labels, and advanced import/export options.
inputs:
  action:
    description: "Operation Sync command: push | pull (optional - inferred from user intent if not provided)"
    required: false
  testDir:
    description: "Directory for manual tests (default: manual-tests)"
    required: false
---

## SYNC-CASES SKILL: What I do

This skill enables synchronization of Markdown test scenarios between your local project and Testomat.io Test Management System.
Use when users want to pull tests from Testomat.io to local Markdown files, push local Markdown tests to Testomat.io (Importing or exporting test scenarios).

Test Cases Sync Jornay: 
- Export test cases from Testomat.io.
- Bulk editing manual tests in IDE or refactoring test cases.
- Further push back to the Testomat.io.

### When to Use This Skill

Trigger this skill when user mentions:
- **Pull/Export/Download**: "pull tests", "export from Testomat.io", "download tests", "get tests from TMS" => pull action.
- **Push/Upload/Import**: "push tests", "upload tests to Testomat.io", "import to Testomat.io" => push action.

> If any unclear state => ask user to clarify the initial action!

---

## Error Handling

### Recoverable Situations

Attempt recovery before failing when:
* **Missing `TESTOMATIO` token**
  - Ask the user to provide it.
  - Tell them they can obtain it from their Testomat.io project: **Settings -> Project -> "Project Reporting API key"** value
  - Example link: `https://testomat.io/projects/<project-id>/settings/project`
  - If the user cannot find the token:
    - Ask them to open an existing Testomat.io project and copy the key from **Settings → Project -> "Project Reporting API key"** value.
    - Or create a new project in Testomat.io and copy the **Project Reporting API key** from the same page.

* No markdown files found
  - Confirm directory or ask user to specify another path.

### Hard Fail (STOP immediately)

Stop execution and return a clear human-readable error if:
- User refuses to provide TESTOMATIO token.
- Cannot create `.env` file
- Directory creation fails.
- User repeatedly provides invalid action parameter after clarification.
- No markdown files found after confirming directory with user.
- CLI sync(push/pull) command fails (network/auth/401/403/etc.).

**If something fails after multiple attempts, return a clear, human-readable error message that describes the actual error/failure.**

---

## References

| Description | File |
|-------------|------|
| Testomat.io CLI Commands Documentation | ./references/TESTOMATIO_CLI.md |

---

## Prerequisites: Environment Setup

Before running sync operations, ensure the environment is properly configured.

### 1. Check Testomatio Token

1. Check if "TESTOMATIO" token was provided as input.
2. If not provided, check for `.env` file in project root for "TESTOMATIO" token.
3. If still not found => ask user for token.

### 2. Save Credentials to .env File

Save credentials to `.env` file:

```env
TESTOMATIO=tstmt_xxxxx
```

### 3. Install check-tests Package

To avoid using `npx` which triggers security warnings, install `check-tests` as a local dependency:

```bash
npm install check-tests --save-dev
```

### 4. Configure Testomat.io Sync Operations

Key environment variables:
| Variable | Description | Required |
|----------|-------------|----------|
| `TESTOMATIO` | API key (format: tstmt_xxxxx) | Yes |
| `TESTOMATIO_WORKDIR`| Working directory for relative file paths | No |
| `TESTOMATIO_PREPEND_DIR` | Directory to prepend to paths | No |

For complete CLI options, environment variables, and advanced examples, see **references** file.

---

## Testomatio Sync Testcase Supported Operations: What I execute

### Pull Changes

1) Ensure `testDir` exists; otherwise create `manual-tests` folder in the project.
2) Retrieves test scenarios from Testomat.io and saves them as Markdown files locally.

**Use Cases:**
- Export tests from TMS to markdown for bulk editing in IDE
- Backup test cases locally
- Refactoring test cases offline

**Basic Command:**
```bash
npx check-tests pull -d <directory>
# or if installed locally
./node_modules/.bin/check-tests pull -d <directory>
```

**Examples:**
```bash
# Pull tests to default manual-tests folder
npx check-tests pull -d manual-tests
# or if installed locally
./node_modules/.bin/check-tests pull -d manual-tests
```

**More examples**: See "Pull Basic Usage" section from references.

---

### Warning Before Push

Before push, warn user about potential risks:
- Save and commit local changes.
- Pull latest changes from Testomat.io first to avoid overwriting.

### Push Changes

1) Ensure the user has saved all updates and has files to send to the server.
2) Upload local Markdown tests into Testomat.io.

**Use Cases:**
- Mass create test cases in Testomat.io from markdown files
- Import bulk-edited tests back to TMS
- Sync refactored test cases to Testomat.io

**Pre-Push Validation**:
1. Ensure at least one test `.test.md` file exists.
2. Ensure file contains valid test blocks:

```md
<!-- test
priority: ...
creator: ...
tags: ...
labels: ...
-->
# ... (test case title)

... (test case description)

```

**Basic Command:**
```bash
npx check-tests push -d <directory>
# or if installed locally
./node_modules/.bin/check-tests push -d <directory>
```

**Examples:**
```bash
# Push tests from manual-tests folder
npx check-tests push -d manual-tests
# or if installed locally
./node_modules/.bin/check-tests push -d manual-tests
```

**More examples**: See "Push Basic Usage" section from references.

---

## Example: Skill Real Usage

**Pull tests:**
```
Use sync-cases skill to pull tests from Testomat.io
```

**Pull with custom folder:**
```
Use sync-cases to pull tests in folder "manual-tests"
```

**Push tests:**
```
Use sync-cases to push tests to Testomat.io
```

**Bulk test case edit workflow:**
- "Use sync-cases skill to pull tests from Testomat.io, I need to bulk edit them in IDE"
- (Save some user updates)
- "Use sync-cases skill to push the updated tests back to Testomat.io"

**Result:**

```
✔ Test scenarios successfully synced with the Test Management Tool!
```
