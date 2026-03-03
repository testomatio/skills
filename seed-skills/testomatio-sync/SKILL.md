---
name: testomatio-sync
description: Synchronize Markdown test scenarios between local project and Test Management Tool (Testomat.io)
inputs:
  action:
    description: "Operation Sync command: push | pull (optional - inferred from user intent if not provided)"
    required: false
  testDir:
    description: "Directory for manual tests (default: manual-tests)"
    required: false
---

## TESTOMATIO-SYNC SKILL: What I do

Synchronization Markdown test scenarios between local project and Testomat.io:
- **pull**: Download test scenarios from Testomat.io to local Markdown files
- **push**: Upload local Markdown files to Testomat.io

If action is not provided, infer from user intent:
- words like `pull`, `export`, `download`, `get tests` => pull action
- words like `push`, `upload`, `sync to server`, `import` => push action

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

**Do not retry automatically**.
**Do NOT continue after system-level failure**.
**Return a clear human-readable error message describing the actual failure**.

---

## Precondition: Environment Handling Logic

### Check Testomatio Token

1. Check if `TESTOMATIO` token was provided as input.
2. If not provided, check for `.env` file in project root for `TESTOMATIO` token.
3. If still not found => ask user for token.

### Configure Testomatio env

| Key | Description | Default Value |
|-----|-------------|---------------|
| TESTOMATIO | System API token (format: tstmt_xxxxx) | Required, No default value |
| TESTOMATIO_URL | Testomatio server url | https://app.testomat.io/   |

`TESTOMATIO` token must be available for the next steps:
* If user does NOT provide token in `.env` file or by typing it => STOP skill immediately and return error like `ERROR: TESTOMATIO token is required. Operation aborted.`
* If token not found, ask: `TESTOMATIO` token is required. Please enter your Testomat API token (format: tstmt_xxxxx):`
* If token provided or defined during conversation => create/update `.env` file in project root:

```
TESTOMATIO=tstmt_your_api_key
...
```

**Continue execution if all required variables are defined**.

---

## Testomatio Sync Actions: What I execute

The sync process supports two operations:
- **Pull** - Retrieve the latest test scenarios from Testomat.io and update the local project.
- **Push** - Send local Markdown test updates to Testomat.io.

(Use `npx ... pull/push -d {{folder-name}}` in case if we have the folder name**).

### Pull Changes

1) Ensure `testDir` exists; otherwise create `manual-tests` folder in the project.
2) Download tests in Markdown format from the Testomat.io:

```bash
npx -y check-tests@latest pull
```

---

### Warning Before Push

Before push, warn user about potential risks:
- Save and commit local changes.
- Pull latest changes from Testomat.io first to avoid overwriting.

### Push Changes

Import local Markdown tests into Test Management Tool (Testomat.io).

```bash
npx -y check-tests@latest push
```

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

---

## Example Real Usage

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
