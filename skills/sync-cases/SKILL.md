---
name: sync-cases
description: Synchronize test scenarios and cases between a local project and Testomat.io. Use this skill whenever the user wants to pull/export/download tests from Testomat.io; or push/import/sync updated test cases back to the TMS. Supports custom directories, markdown test format and advanced import/export workflows.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# SYNC-CASES SKILL: What I do

This skill enables synchronization of Markdown test scenarios between your local project and Testomat.io Test Management System.

Test Cases Sync Jornay: 
- Export test cases from Testomat.io.
- Bulk editing manual tests or refactoring test cases.
- Further push back test cases to the Testomat.io.

## When to Use

Trigger this skill when user wants to:
- **Pull/Export/Download** tests from Testomat.io to local Markdown files.
- **Push/Upload/Import** local Markdown tests to Testomat.io.
- Bulk edit manual tests or refactor test cases in local files and upload to TMS.
- Synchronize test cases between local `.md` files and TMS (Testomat.io).
- **Sync** test cases with the remote version in TMS (Testomat.io).
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

### Step 2: Pull or Push Operations

#### Ensure check-tests Package Installed

Ensure the `check-tests` package is available in the project before running `pull`, `push` or `sync` commands.
- If `check-tests` is already installed, **reuse the existing version**.
- If `check-tests` is **not installed**, install it:

```bash
npm install check-tests --save-dev --no-audit --no-fund
```

#### Pull Changes

Download/Retrieves test scenarios from Testomat.io and saves them as Markdown files locally.

**Use Cases:**
- Export tests from TMS to markdown for bulk editing in IDE.
- Backup test cases locally.
- Refactor test cases offline.

**Pre-Pull:**
- Ensure `testDir` exists; otherwise create `manual-tests` folder.

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

#### Push Changes

Uploads/Imports local Markdown tests into Testomat.io.

**Use Cases:**
- Mass create test cases in Testomat.io from markdown files.
- Import bulk-edited tests back to TMS.
- Sync refactored test cases to Testomat.io.

**Pre-Push Validation:**
1. Ensure a new test cases was created by user.
2. Ensure at least one test `.test.md` file exists
3. Ensure file contains valid test blocks:

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

**Command:**
```bash
npx check-tests push [-d <directory>] [--files <files...>]
```

**IMPORTANT:** When the files to push are known (e.g. just produced by `generate-cases` / `improve-test-cases`), pass them explicitly via `--files` (alias `-f`). Without `--files` the CLI falls back to the default glob `**/*.test.md`, which may pick up unrelated files. Quote glob patterns. Paths resolve relative to `--dir`.

**Examples:**
```bash
# Specific files (preferred when known)
npx check-tests push --files manual-tests/login.test.md manual-tests/checkout.test.md

# Custom glob
npx check-tests push --files "manual-tests/**/*.test.md"

# Default glob (**/*.test.md) under -d
npx check-tests push -d manual-tests
```

**More examples** you can find in "Push" section [Testomat.io CLI Documentation](./references/TESTOMATIO_CLI.md)

#### Labels Handling (Intent-Based)

Use `TESTOMATIO_LABELS` in sync/push **only if the user explicitly requests to set or override labels** in their query.

**Triggers:**
* "push tests with labels smoke".
* "import tests to TMS and set label=regression":
  - labels like `smoke,regression` example: `TESTOMATIO_LABELS="smoke,regression" npx check-tests push`

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

| Action          | Command                                                        |
| --------------- | -------------------------------------------------------------- |
| Install         | `npm install check-tests --save-dev`                           |
| Pull            | `npx check-tests pull -d <directory>`                          |
| Push (files)    | `npx check-tests push --files <file1.test.md> <file2.test.md>` |
| Push (glob)     | `npx check-tests push --files "<dir>/**/*.test.md"`            |
| Push (default)  | `npx check-tests push -d <directory>` (glob: `**/*.test.md`)   |