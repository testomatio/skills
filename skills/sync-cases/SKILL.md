---
name: sync-cases
description: Synchronize test scenarios and cases between a local project and Testomat.io. Use this skill whenever the user wants to pull/export/download tests from Testomat.io; or push/import/sync new or updated test cases back to the TMS in corresponding `*.test.md` format. Supports custom directories, markdown test format and advanced import/export workflows.
inputs:
  testDir:
    description: "Target directory for pulled tests"
    required: false
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

### Step 2: Pull or Push Operations

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

**Where to pull:** into the gitignored cache `.testclaw/manual-tests/`, and add `.testclaw/` to the project `.gitignore` if it is not there yet. Pulled cases must never land in a tracked folder (`manual-tests/`, etc.) — that pollutes the repo. You can still edit them there and push back; being gitignored doesn't stop that. (If the repo *already* keeps its `*.test.md` files in a tracked folder, you don't need to pull at all — work with them where they are, or pass `-d <that folder>` for an in-place refresh.) This matches `project-scan`, which pulls the *code* into `.testclaw/code/` when it runs inside a manual-tests repo.

**Pre-Pull:**

- If `testDir` is specified pull tests into it. Otherwise:
- If this workspace is empty or is for manual-tests only, test must be pulled to root
- If this is end-to-end testing project test cases must be generated in `manual-tests` directory
- In any other case test cases must be pulled to `.testclaw/manual-tests` (ensure `.testclaw` directory exists and git ignored)

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
# Default — pull into the gitignored cache
npx check-tests pull -d .testclaw/manual-tests

# Repo that already keeps its test cases tracked — refresh them in place
npx check-tests pull -d manual-tests

# Pull specific suites by IDs
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

If directory contains manual test cases + something else, move test cases into `.testclaw/manual-tests`


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

**Examples:**
```bash
# Specific files (preferred when known)
npx check-tests push --files login.test.md checkout.test.md

# Custom glob
npx check-tests push --files "**/*.test.md"

# Default glob (**/*.test.md) under -d
npx check-tests push

# Specify directory with manual test cases
npx check-tests push -d .testclaw/manual-tests

# Specify directory with manual test cases and specific files
npx check-tests push -d .testclaw/manual-tests --files new_tests.md
```

**Important constraints:**
- Only use options explicitly documented in this skill or in the "Testomat.io CLI Documentation" ref file.
- If you are unsure about available CLI options, run `npx check-tests --help` and use only options listed there.
- Do **not** use an option unless it is mentioned in the documentation or in the `--help` option (e.g., `--pattern`, `--forces`).
- Ensure you use -d when `.testclaw` or `manual-tests` directories exist. 
- Ensure you push only the test cases directory (e.g `.testclaw/manual-tests` not `.testclaw`).

**More examples** you can find in "Push" section [Testomat.io CLI Documentation](./references/TESTOMATIO_CLI.md)

---

## Final Summary Example

After completing sync operations, output a short log-style summary:

```
Sync Complete:
- Action: pull/push
- Directory: .testclaw/manual-tests
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

**Pull tests** (lands in the gitignored `.testclaw/manual-tests/`):
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
| Pull            | `npx check-tests pull -d manual-tests` (the default; gitignored) |
| Push (files)    | `npx check-tests push --files <file1.test.md> <file2.test.md>`       |
| Push (glob)     | `npx check-tests push --files "<dir>/**/*.test.md"`                  |
| Push (default)  | `npx check-tests push -d <directory>` (glob: `**/*.test.md`)         |
