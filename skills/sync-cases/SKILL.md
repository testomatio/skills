---
name: sync-cases
description: Synchronize test scenarios and cases between a local project and Testomat.io. Use this skill whenever the user wants to pull/export/download tests from Testomat.io; or push/import/sync new or updated test cases back to the TMS in corresponding `*.test.md` format. Supports custom directories, markdown test format and advanced import/export workflows. Automatically detects project type and stores test cases in `manual-tests/` (for simple/test projects) or `.testclaw-context/manual-tests/` (for projects with source code).
inputs:
  testDir:
    description: "Override auto-detected test directory. By default: `manual-tests/` for simple projects, `.testclaw-context/manual-tests/` for big projects with additional backend, frontend logic"
    required: false
license: MIT
metadata:
  author: Testomat.io
  version: 1.1.0
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
- Synchronize test cases between local `*.test.md` files and TMS (Testomat.io).
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

### Step 2: Detect Project Type and Choose Test Directory

Before pulling or pushing, detect the project type to determine the correct test case location.

#### Test Directory Rules

| Project Type | Test Cases Location | Gitignored? |
| ------------ | ------------------- | ----------- |
| **Manual-only** (empty project, no backend, frontend logic) OR **E2E/test project** (`tests/`, `playwright/`, `cypress/`, `e2e/`) | `manual-tests/` | No |
| **Has additional source code** (has backend, frontend logic) or **big project** (monorepo, multiple test types) | `.testclaw-context/manual-tests/` | **Yes** — add to `.gitignore` if missing |
| **Folder from the user's prompt/request** | `testDir` | No |

#### Detection Logic

1. Has backend, frontend, extra logic code? => Use `.testclaw-context/manual-tests/`
2. Has `tests/`, `playwright/`, `cypress/`, `e2e/`, `tests-e2e/`? => Use `manual-tests/`
3. Otherwise => Default to `manual-tests/`

> **Override:** If `testDir` input is provided or user specifies `-d <path>` in command, use that path instead.

---

### Step 3: Pull or Push Operations

#### Always use latest version of check-tests

Use `npx` to invoke `check-tests` so users automatically pick up the newest version from npm.
- Do **not** install `check-tests` as a project dependency.
- **The very first `check-tests` call in the current agent session must be invoked as `npx check-tests@latest …`** to force npx to resolve and install the latest version from the registry.
- **All subsequent calls** in the same session use the plain form (`npx check-tests …`) shown in the examples below — npx reuses the just-cached version, so no extra registry round-trip.

#### Pull Changes

Download/Retrieves test scenarios from Testomat.io and saves them as Markdown files locally.

**Use Cases:**
- Export tests from TMS to markdown for bulk editing in IDE.
- Backup test cases locally.
- Refactor test cases offline.
- Export only some specific suites by id.

**Where to pull:** Determined by [Step 2: Detect Project Type](#step-2-detect-project-type-and-choose-test-directory). The target directory is created if it doesn't exist.

**Pre-Pull:**
1. Run detection (if `testDir` not provided)
2. Create target directory if it doesn't exist
3. If target is `.testclaw-context/` → ensure it's gitignored

**Command:**
```bash
npx check-tests pull -d <directory>
```

Optional variant - **pull by specific suite-ids**

**When to use `--suite-ids`:**
- User wants to pull only specific suites (not the entire project).
- Initial request mentions a specific suite name or suite ID.
- Need to export one or several specific suites without triggering a full project sync.

> **Options to use:** `--suite-ids <ids>` for comma-separated suite IDs to pull (e.g. `@S12345678, @S87654321`)

**Pull Examples:**
```bash
# Auto-detected location
npx check-tests pull

# Manual-only or E2E project → manual-tests/
npx check-tests pull -d manual-tests

# Big project with extra source code → gitignored cache
npx check-tests pull -d .testclaw-context/manual-tests

# Specific suite IDs
npx check-tests pull --suite-ids "@S12345678,@S87654321"
```

**More examples** you can find in "Pull" section [Testomat.io CLI Documentation](./references/TESTOMATIO_CLI.md)

#### Push Changes

Uploads/Imports local Markdown tests into Testomat.io:
- Upload only test case files.
- Avoid uploading any project documentation/requirements files in `.md` format.

**Use Cases:**
- Mass create test cases in Testomat.io from markdown files.
- Import bulk-edited tests back to TMS.
- Sync refactored test cases to Testomat.io.

**Pre-Push File Filtering**

Before uploading, scan the project/target folder and **include only**:
- Files matching `*.test.md` pattern.
- Files containing valid test blocks: `<!-- test ... -->` markers.

**Exclude** all other `.md` files — especially:
- `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`.
- Project documentation (`docs/requirements.md`, `architecture.md`, etc.).

> If a directory contains mixed content, skip documentation files and upload only test case files.

**Pre-Push Validation:**
1. Ensure at least one test `*.test.md` file exists.
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

**Command:**
```bash
npx check-tests push [-d <directory>] [--files <files...>]
```

**IMPORTANT:** When the files to push are known (e.g. just produced by `generate-cases` / `improve-test-cases`), pass them explicitly via `--files` (alias `-f`). Without `--files` the CLI falls back to the default glob `**/*.test.md`, which may pick up unrelated files. Quote glob patterns. Paths resolve relative to `--dir`.

**Push Examples:**
```bash
# Push from manual-tests/
npx check-tests push -d manual-tests

# Push from gitignored cache
npx check-tests push -d .testclaw-context/manual-tests

# Specific files from cache folder (preferred when known — e.g. just produced by generate-cases)
npx check-tests push --files .testclaw-context/manual-tests/login.test.md .testclaw-context/manual-tests/checkout.test.md

# Custom glob
npx check-tests push --files ".testclaw-context/manual-tests/**/*.test.md"

# Specific files not from cache .testclaw-context folder
npx check-tests push --files login.test.md checkout.test.md
```

**Important constraints:**
- Only use options explicitly documented in this skill or in the "Testomat.io CLI Documentation" ref file.
- If you are unsure about available CLI options, run `npx check-tests --help` and use only options listed there.
- Do **not** use an option unless it is mentioned in the documentation or in the `--help` option (e.g., `--pattern`, `--forces`).

**More examples** you can find in "Push" section [Testomat.io CLI Documentation](./references/TESTOMATIO_CLI.md)

#### Labels Handling (Intent-Based)

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
- Directory: <auto-detected path>
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
| Testomat.io CLI Commands     | ./references/TESTOMATIO_CLI.md      |

---

## Examples

**Pull tests:**
```
Use sync-cases skill to pull tests from Testomat.io
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

| Action          | Command                                                              |
| --------------- | -------------------------------------------------------------------- |
| Pull            | `npx check-tests pull -d <dir>`                                      |
| Push            | `npx check-tests push -d <dir>`                                      |
| Push (files)    | `npx check-tests push --files <file1.test.md> <file2.test.md>`       |
| Push (glob)     | `npx check-tests push --files "<dir>/**/*.test.md"`                  |
| Push (default)  | `npx check-tests push -d <directory>` (glob: `**/*.test.md`)         |
