---
name: testomatio-sync
description: Synchronize Markdown test scenarios between local project and Test Management Tool (Testomat.io)
inputs:
  action:
    description: "Operation type: pull (export from server) or push (import to server)"
    required: true
  testDir:
    description: "Directory for manual tests (default: manual-tests)"
    required: false
---

## TASK: What I do

A unified synchronization Test Management Tool (Testomat.io) skill that can:

* Pull test scenarios from management tool into a local folder in Markdown format.
* Push Markdown test scenarios from the local project to management tool.

---

## Error Handling

Fail immediately and **STOP** execution on any error:

* Missing TESTOMATIO token.
* User refuses to provide token.
* `.env` file cannot be created.
* Directory creation command fails.
* Invalid action parameter.
* No markdown files found during push.
* CLI sync(push/pull) command fails (network/auth/401/403/etc.).

**Do not retry automatically**.
**Do NOT continue after failure**.
**Return a clear human-readable error message describing the actual failure**.

---

## Precondition: Environment Handling Logic

### Step 0 — Validate or Create `.env`

Check if `.env` exists in project root. Possible user flows:

#### Case 1: `.env` exists

`.env` exists flow - read existing `.env` file:
* If `TESTOMATIO` variable is missing or empty => FAIL: `WARNING: TESTOMATIO token is missing in .env file. Please add: TESTOMATIO=tstmt_your_api_key`
- `TESTOMATIO_URL` is OPTIONAL. If missing => set and use `TESTOMATIO_URL=https://app.testomat.io/` as default one.

#### Case 2.1: `.env` does NOT exist

Ask the user: `TESTOMATIO token is required. Please enter your Testomat API token (format: tstmt_xxxxx):`

* If user provides token: 
- Validate it starts with `tstmt_`. If not => FAIL execution and STOP.
- If valid token => Create `.env` in project root with:

```
# if user enter `TESTOMATIO=...` only
TESTOMATIO=tstmt_user_api_key

OR

# if user enter `TESTOMATIO=...` and `TESTOMATIO_URL=...
TESTOMATIO_URL=https://your-account-testomat.io
TESTOMATIO=tstmt_your_api_key
```

* Continue execution.

> **If user does NOT provide token in `.env` file or by typing it => STOP skill immediately and return the appropriate error like `ERROR: TESTOMATIO token is required. Operation aborted.`**.

---

## What I execute

### Step 1 — Determine Working Directory

Determine `testDir` directory:
- If dir already exists => continue.
- If dir does NOT exist => create it (use default: `testDir="manual-tests"`)

Command for folder creation:

```bash
mkdir -p {{testDir}}
```

---

### Step 2 — ACTION = pull

#### Purpose

Export tests from Testomat server into Markdown.

#### Pull Execution

1) Change working directory:

```bash
cd {{testDir}}
```

2) Run **pull** command based on the system OS version:
- If `TESTOMATIO_URL` exists in .env:

```bash
# Linux or Mac
TESTOMATIO_URL=$TESTOMATIO_URL TESTOMATIO=$TESTOMATIO npx -y check-tests@latest pull

# Windows
set TESTOMATIO_URL=$TESTOMATIO_URL&&set TESTOMATIO=$TESTOMATIO&& npx check-tests@latest pull
```
- else:

```bash
# Linux or Mac
TESTOMATIO=$TESTOMATIO npx -y check-tests@latest pull

# Windows
set TESTOMATIO=$TESTOMATIO&& npx check-tests@latest pull
```

---

### Step 2 — ACTION = push

#### Purpose

Import local Markdown tests into Test Management Tool (Testomat.io).

#### Pre-Push Validation

1. Ensure manual test directory exists.
2. Ensure at least one test `.md` file exists.
3. Ensure file contains valid block:

```md
<!-- test
id: ...
priority: ...
-->
```
- If no valid tests found => Ask user: `No valid test blocks found. Create a sample test template? (yes/no)`. If NO => STOP execution.

#### Push Execution

1) Change working directory:

```bash
cd {{testDir}}
```

2) Run **push** command after updates based on the system OS version:
- If `TESTOMATIO_URL` exists in .env:

```bash
# Linux or Mac
TESTOMATIO_URL=$TESTOMATIO_URL TESTOMATIO=$TESTOMATIO npx -y check-tests@latest push

# Windows
set TESTOMATIO_URL=$TESTOMATIO_URL&&set TESTOMATIO=$TESTOMATIO&& npx check-tests@latest push
```
- else:

```bash
# Linux or Mac
TESTOMATIO=$TESTOMATIO npx -y check-tests@latest push

# Windows
set TESTOMATIO=$TESTOMATIO&& npx check-tests@latest push
```

---

#### Example Real Usage

* User **PULL** action:

```text
Use testomatio-sync to pull tests`
```

* User **PULL** action to custom user testDir:

```text
Use testomatio-sync to pull tests in folder `testDir="manual-tests"`
```

OR

```text
Use testomatio-sync to pull test files in folder `testDir="manual-tests" by TESTOMATIO=tstmt_xxx and TESTOMATIO_URL=https://app.testomat.io`
```

- Executed command:

```bash
# Linux or Mac
TESTOMATIO_URL=https://app.testomat.io TESTOMATIO=tstmt_your_api_key npx -y check-tests@latest pull
```

- Result:

```
✔ Test scenarios successfully pulled into '{{testDir}}'
```

* User **PUSH** action:

```text
Use testomatio-sync to push ".md" tests`
```

- Result:

```
✔ Test scenarios successfully pushed to Test Management Tool!'
```
