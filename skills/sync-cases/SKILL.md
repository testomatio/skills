---
name: sync-cases
description: Synchronize Markdown test scenarios between a local project and Testomat.io. Use this skill whenever the user wants to pull/export/download tests from Testomat.io; or push/import/sync updated test cases back to the TMS. Supports custom directories and advanced import/export workflows.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# SYNC-CASES SKILL: What I do

This skill enables synchronization of Markdown test scenarios between your local project and Testomat.io Test Management System.

Test Cases Sync Jornay: 
- Export test cases from Testomat.io.
- Bulk editing manual tests in IDE or refactoring test cases.
- Further push back to the Testomat.io.

## When to Use

Trigger this skill when user wants to:
- **Pull/Export/Download** tests from Testomat.io to local Markdown files.
- **Push/Upload/Import** local Markdown tests to Testomat.io.
- Bulk edit manual tests in IDE or refactor test cases in local files and upload to TMS.
- Sync refactored test cases back to Testomat.io.
- Synchronize test cases between local `.md` files and Testomat.io TMS.
- Cover user bulk edit workflow: pull cases -> edit test cases -> push cases to TMS.

---

## Workflow: Sync Test Cases

### Step 1: Environment Setup

#### Check Testomat.io Token

Check if "TESTOMATIO" token was provided as input:
- If not provided, check for `.env` file in project root.
  - If still not found => ❓ ask user for token.

#### Save Credentials to .env File

Best Practice to save credentials into `.env` file:

```env
TESTOMATIO=tstmt_xxxxx
...
```

#### Get API Key (if user doesn't have it)

Ask the user to obtain it from Testomat.io project:
- Navigate to **Settings → Project → Project Reporting API key**
_( Project path example by "project-id": `https://app.testomat.io/projects/<project-id>/settings/project` )_

### Step 2: Install check-tests Package

Install the `check-tests` package from the official npm registry:

```bash
npm install check-tests --save-dev
```

Then run `pull` or `push` commands using the local version.

### Step 3: Pull or Push Operations

#### Pull Changes

Retrieves test scenarios from Testomat.io and saves them as Markdown files locally.

**Use Cases:**
- Export tests from TMS to markdown for bulk editing in IDE
- Backup test cases locally
- Refactor test cases offline

**Pre-Pull:**
- Ensure `testDir` exists; otherwise create `manual-tests` folder

**Command:**
```bash
npx check-tests pull -d <directory>
# or if installed locally
./node_modules/.bin/check-tests pull -d <directory>
```

**Examples:**
```bash
# Pull tests to default manual-tests folder
npx check-tests pull -d manual-tests
```

**More examples** you can find in "Pull" section [Testomat.io CLI Documentation](./references/TESTOMATIO_CLI.md)

#### Warning Before Push

Before push, warn user about potential risks:
- Save and commit local changes.
- Pull latest changes from Testomat.io first to avoid overwriting.

#### Push Changes

Uploads local Markdown tests into Testomat.io.

**Use Cases:**
- Mass create test cases in Testomat.io from markdown files.
- Import bulk-edited tests back to TMS.
- Sync refactored test cases to Testomat.io.

**Pre-Push Validation:**
1. Ensure at least one test `.test.md` file exists
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

#### Labels Handling (Intent-Based)

- Use `TESTOMATIO_LABELS` **only if the user explicitly requests to set or override labels** in their query.
- Example triggers:
  - "push tests with labels smoke"
  - "upload tests and set labels to regression,api"
- Format: comma-separated values (supports `label:value` - `TESTOMATIO_LABELS="smoke,updated" npx check-tests push`).

**Command:**
```bash
npx check-tests push -d <directory>
# or if installed locally
./node_modules/.bin/check-tests push -d <directory>
```

**Examples:**
```bash
# Push tests from manual-tests folder
npx check-tests push -d manual-tests
```

**More examples** you can find in "Push" section [Testomat.io CLI Documentation](./references/TESTOMATIO_CLI.md)

---

## Final Summary Example

After completing sync operations, output a short log-style summary:

```
Sync Complete:
- Action: pull/push
- Directory: manual-tests
- Tests synced: 15
- Status: Success
```

---

## Error Handling

### Recovery

Attempt recovery before failing when:
- **Missing `TESTOMATIO` token**
  - Ask the user to provide it
  - Show where to find it in Testomat.io

- **No markdown files found**
  - Confirm directory or ask user to specify another cases path

### Hard Fail (Stop immediately)

Stop execution if:
- Cannot create `.env` file by system.
- Directory creation fails.
- CLI sync command fails (network/auth/401/403).

---

## References

| Description                  | File                                |
| ---------------------------- | ----------------------------------- |
| Testomat.io CLI Commands     | ./references/TESTOMATIO_CLI.md     |

---

## Examples

**Pull tests:**
```
Use sync-cases skill to pull tests from Testomat.io in folder manual-tests
```

**Push tests:**
```
Use sync-cases to push tests to Testomat.io
```

**Bulk test case edit workflow:**
1. Use sync-cases to pull tests from Testomat.io
2. Edit tests in IDE
3. Use sync-cases to push the updated tests back to Testomat.io

---

## Quick Commands

| Action | Command |
|--------|---------|
| Install | `npm install check-tests --save-dev` |
| Pull | `npx check-tests pull -d <directory>` |
| Push | `npx check-tests push -d <directory>` |