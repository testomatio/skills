---
name: testomatio-sync-testcases
description: Synchronize Markdown test scenarios between local project and Test Management Tool (Testomat.io). Supports custom directories, labels, and advanced import/export options.
inputs:
  action:
    description: "Operation Sync command: push | pull (optional - inferred from user intent if not provided)"
    required: false
  testDir:
    description: "Directory for manual tests (default: manual-tests)"
    required: false
---

## TESTOMATIO-SYNC-TESTCASES SKILL: What I do

This skill enables synchronization of Markdown test scenarios between your local project and Testomat.io Test Management System.
Use when users want to pull tests from Testomat.io to local Markdown files, push local Markdown tests to Testomat.io (Importing or exporting test scenarios).

### When to Use This Skill

Trigger this skill when user mentions:
- Pulling, exporting, downloading, or getting tests from Testomat.io => pull action.
- Pushing, uploading, sending, or syncing tests to Testomat.io => push action.

If any unclear state => ask user to clarify the initial action!

---

## Error Handling

### Recoverable Situations

Attempt recovery before failing when:
- TESTOMATIO token is missing => ask user to provide it.
- No markdown files found => confirm directory or ask user to specify another path.

### Hard Fail (STOP immediately)

Stop execution and return a clear human-readable error if:
- User refuses to provide TESTOMATIO token.
- Cannot create `.env` file
- Directory creation fails.
- User repeatedly provides invalid action parameter after clarification.
- No markdown files found after confirming directory with user.
- CLI sync(push/pull) command fails (network/auth/401/403/etc.).

**If something fails after multiple attempts, return a clear, human-readable error message that describes the actual error/failure.**.

---

## Precondition: Environment Handling Logic

### Check Testomatio Token

1. Check if `TESTOMATIO` token was provided as input.
2. If not provided, check for `.env` file in project root for `TESTOMATIO` token.
3. If still not found => ask user for token.

### .env File Best Practice

Save credentials to `.env` file:

```env
TESTOMATIO=tstmt_xxxxx
...
```

### Configure Testomat.io cli configuration

Use file: `./references/TESTOMATIO_CLI.md` to get all extra information for proper Test Management Tool action you need.

---

## Testomatio Sync Testcase Supported Operations: What I execute

### Pull Changes

1) Ensure `testDir` exists; otherwise create `manual-tests` folder in the project.
2) Retrieves test scenarios from Testomat.io and saves them as Markdown files locally.

**Basic Command:**
```bash
npx -y check-tests@latest pull -d <directory>
```

**Examples:**
```bash
# Pull tests to default manual-tests folder
npx -y check-tests@latest pull -d manual-tests
```

More commands and examples available in `./references/TESTOMATIO_CLI.md` file - "Pull Basic Usage" section. 
---

### Warning Before Push

Before push, warn user about potential risks:
- Save and commit local changes.
- Pull latest changes from Testomat.io first to avoid overwriting.

### Push Changes

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
# Successful login ...

...

```

1) Ensure the user has saved all updates and has files to send to the server
2) Upload local Markdown tests into Test Management Tool (Testomat.io) by corresponding "Push Basic Usage" command.

**Basic Command:**
```bash
npx -y check-tests@latest push -d <directory>
```

**Examples:**
```bash
# Push tests from manual-tests folder
npx -y check-tests@latest push -d manual-tests
```

More commands and examples available in `./references/TESTOMATIO_CLI.md` file - "Push Basic Usage" section.

---

## Example: Skill Real Usage

**Pull tests:**
```
Use testomatio-sync to pull tests
```

**Pull with custom folder:**
```
Use testomatio-sync to pull tests in folder "manual-tests"
```

**Push tests:**
```
Use testomatio-sync to push tests
```

**With custom token:**
```
Use testomatio-sync to push tests with TESTOMATIO=tstmt_xxx
```

**Result:**

```
✔ Test scenarios successfully synced with the Test Management Tool!'
```
