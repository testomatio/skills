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
- Bulk editing manual tests or refactoring test cases.
- Further push back test cases to the Testomat.io.

## When to Use

Trigger this skill when user wants to:
- **Pull/Export/Download** tests from Testomat.io to local Markdown files.
- **Push/Upload/Import** local Markdown tests to Testomat.io.
- Bulk edit manual tests or refactor test cases in local files and upload to TMS.
- **Sync** refactored cases: push back to Testomat.io with 
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

### Step 2: Pull or Push Operations

#### Ensure check-tests Package Installed

Ensure the `check-tests` package is available in the project before running `pull`, `push` or `sync` commands.
- If `check-tests` is already installed, **reuse the existing version**.
- If `check-tests` is **not installed**, install it:

```bash
npm install check-tests --save-dev --no-audit --no-fund
```

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

### Push Changes (Smart Sync Rules)

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

#### Smart Sync Rules

When using `push` command, choose the appropriate mode based on the changes in your `.test.md` files.

First of all - **analyze user changes/updates** and select needed command for `push` strategy:
- Only content updates.
- New test cases added (no system IDs).
- Mixed changes (updates + new tests).

**Only content updates:**
- Test description, title, or metadata changed.
- No new tests added
- No changes to existing test IDs
✅ Use standard push: `npx check-tests push -d <directory>`

**New test cases added (no system IDs):**
- New tests exist in `.test.md`.
- These tests do **not** contain system IDs.
✅ Use push with ID update: `npx check-tests push -d <directory> --update-ids`

**Mixed changes (updates + new tests):**
- Existing tests updated.
- AND new tests without IDs added.
✅ Use: `npx check-tests push -d <directory> --update-ids`
(`--update-ids` safely handles both updating existing tests and assigning IDs to new ones)

**Examples:**
```bash
# Push tests from manual-tests folder
npx check-tests push -d manual-tests

# Push with new test creation (assign IDs)
npx check-tests push -d manual-tests --update-ids
```

**More examples** you can find in "Push" section [Testomat.io CLI Documentation](./references/TESTOMATIO_CLI.md)

#### Labels Handling (Intent-Based)

- Use `TESTOMATIO_LABELS` in sync/push **only if the user explicitly requests to set or override labels** in their query.
- Example triggers:
  - "push tests with labels smoke"
  - "upload tests and set labels to regression,api"
- Format: comma-separated values (supports `label:value` - `TESTOMATIO_LABELS="smoke,updated" npx check-tests push`).

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