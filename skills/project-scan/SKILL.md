---
name: project-scan
description: Scan project source code to inventory languages, frameworks, and existing tests (manual `*.test.md` and automated test files). Use this skill whenever analyzing codebase for test planning, detecting test frameworks, or preparing for test automation. Specifically, when user mentions "scan project", "what tests exist", "analyze codebase", "detect frameworks", "test matrix", or needs codebase inventory before QA workflow.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# PROJECT-SCAN SKILL: What I do

This skill scans project source code to produce a QA-focused inventory: languages, frameworks, and existing tests.

Test Scanner Journey:
- Analyze source code structure in project root.
- Detect programming languages used.
- Identify test frameworks (automated tests).
  * Avoid deep parsing unit test and integration system files.
- Inventory manual test cases from `.test.md` files.

**CONSTRAINT (large projects):**
- Do not perform deep analysis: no full import resolution, no line-by-line parsing, no inference of complex code relationships.

**Focus only on high-level structure**.

## When to Use

Trigger this skill when user wants to:
- **Scan/Analyze/Discovery** project source code for QA planning.
- **Detect** what frameworks are used.
- **Find** existing automated and manual tests in `.test.md` format.
- **Inventory** codebase before testing procedures.

---

## Workflow: Scan Project (QA-Focused)

### Step 1: Understand Project Context

Scan root dir to understand which files we will analyze in the future:

**Option-1**
- If folder includes non-empty source code folders or files => Go to "Step 2".

**Option-2**
- If **no source** files are found in any of the listed directories, stop scanning and ask the user:

```
❓ No application source code detected (folder may be empty or missing).
Where is the source code?
1. Use local project from another folder (I will create a symlink)
2. Clone from Git repo
3. I don't know yet (stop here)
```
[Waits for the user's reply.]

- If user provides `Git repo` or `another folder` variant => Check if cache directory `.testclaw-context/code` already exists. If not, create it and save files or symlink to this `code/` folder.
*The command is a no-op when the directory already exists.*

---

### Step 2: Project Analysis (Simplified)

Scan the project and collect a list of **source code files only**.

#### 1. Discover Files

- Traverse the project directory.
- Collect file paths only (**Do NOT read file contents at this point**).

#### 2. Filter to Source Code

Include:
- Application source files (e.g. `.js`, `.ts`, `.py`, `.java`, `.go`, etc.).

Exclude:
- Dependencies (e.g. `node_modules/`, `vendor/`, `.venv/`).
- Build/generated output (e.g. `dist/`, `build/`, `.next/`, `target/`).
- Coverage, reports, caches, config, lock, and environment files.
- Ignored paths from `.gitignore`.
- TestClaw internal files (e.g. `session-factory.ts`, `system-prompt.ts`).
[**If in doubt**, prefer excluding over including non-source files.]

#### 3. Detect Tech Stack

Infer program languages and frameworks from file extensions, structure, and config files. The result is a **single array** `frameworks` containing ALL observed application and testing frameworks.

#### 4. Extract Project Name

- Use, in priority order:
  1. Project config files (e.g. `package.json`, `Cargo.toml`, `pom.xml`).
  2. Root directory name.

#### 5. Estimate Project Complexity

Based on total number of source files, choose one variant.

**Calculate complexity table:**

| File Count | Complexity   |
|------------|--------------|
| 1-30       | `small`      |
| 31-150     | `moderate`   |
| 151-500    | `large`      |
| 500+       | `very-large` |

#### Output (Structured Result)

Produce and return a single structured markdown result directly. 
**Do NOT save to a file.** 

Use the following markdown format:

```markdown
# Project Overview

- **Project Name:** ...
- **Description:** ...
- **Languages:** TypeScript, SQL
- **Frameworks:** React, Express, Jest, Playwright
- **Complexity:** small (12 files)
```

[Field notes:
* **Project Name** - Project root folder name or repo name.
* **Description** - 1-2 sentence summary based ONLY on: detected source code and folder structure (including domain area if that make sense for current project).
* **Languages** - Detected programming languages.
* **Frameworks** - Application frameworks, Testing tools, etc.
* **Complexity** - One of: `small` | `moderate` | `large` | `very-large`, based on file count + structure.]

**Important:**
- Do NOT guess or infer missing data.
- Do NOT add fields not defined in the schema.
- All values must come from observable files.

**Show a summary** based on scan results.

---

### Step 3: Tests Inventory (optional)

Detect existing tests (automated and manual).
This step is **shallow** - **Do NOT read full test implementations**.

### Automated Tests

Detect test automation frameworks using:
- Config files (e.g. `jest.config.*`, `playwright.config.*`, `vitest.config.*`, `pytest.ini`, `pom.xml`, etc.).
- Dependencies in project configs.
- Common test file patterns (e.g. `*.test.*`, `*.spec.*`, `*_test.*`).

For each detected framework:
- Identify test file patterns.
- Count matching test files.

### Manual Tests

Find all `.test.md` files and parse test titles:

```bash
find . -name "*.test.md" -exec awk '
  /^<!-- test/   { in_block=1; kind="TEST";  next }
  /^<!-- suite/  { in_block=1; kind="SUITE"; next }
  in_block && /^-->/ { in_block=0; expect=1; next }
  expect && /^#+[[:space:]]+/ {
    title=$0; sub(/^#+[[:space:]]+/, "", title)
    if (kind == "SUITE") printf "SUITE: %s\n", title
    else             printf "|- %s\n",     title
    expect=0
  }
' {} +
```

---

### Step 5: Final Output

Merge all results into the structured markdown format.

- If **no tests are found**, return a note that the current version of the project does not contain any tests. The user may still use the `## Project Overview` section above for next steps.
- If **tests were inventoried**, append a `## Test Inventory` section.

**Full example:**

```markdown
# Project Overview

- **Project Name:** ...
- **Description:** ...
- **Languages:** TypeScript, SQL
- **Frameworks:** React, Express, Jest, Playwright
- **Complexity:** small (12 files)

## Test Inventory

- **Automated Tests:** 10 files
- **Manual Tests:** 37 cases

### Manual Tests (25 of 37 shown)

- SUITE: Authentication
  |- User can login
  |- User can reset password
- SUITE: Billing
  |- User can view invoice
  ...and 9 more

### Automated Tests (10 of 10 shown)

- home.page.spec.ts
...
```

[Extra Field Notes:
* **Manual Tests** — Preserve hierarchy as plain strings. Render SUITE items as parent bullets and test titles (`|-`) as nested children.]
* **Automated Tests** — List of identified test files.

**Report a summary to the user:**
* Provide a concise overview of the scan results (see example below).
* Do not include full test listings.

**Test listing constraint:**
If manual / automated tests are included in output:
- Limit displayed items to the first 20 entries.
- Keep original file order.
- Indicate truncation if more exist (e.g., `...and N more`).

---

## Error Handling

### Recovery

Attempt recovery before failing:

- **Symlink exists** => skip, use existing path.
- **No source found** => wait for user response.
- **Scanner fails** => fallback to simple file listing.

### Hard Fail

Stop if:
- Cannot create context directory
- Cannot access source path
- No read permissions

---

## Examples

### Example: Scan Project

User Prompt: `Use project-scan to analyze this project codebase`
Skill Output:

```markdown
# Project Overview

- **Project Name:** acme-web-app
- **Description:** A React-based customer dashboard. Uses TypeScript for the frontend and Express for the API.
- **Languages:** TypeScript, JavaScript
- **Frameworks:** React, Express, Jest
- **Complexity:** moderate (87 files)

## Test Inventory

- **Automated Tests:** 24 files
- **Manual Tests:** 0 cases

> No manual tests (`.test.md`) found in the project.

### Automated Tests (20 of 24 shown)

- home.page.spec.ts
...
```

### Example: Get Test Inventory

User Prompt: `List all automated and manual tests in this project`
Skill Output:

```markdown
# Project Overview

- **Project Name:** acme-web-app
- **Description:** A React-based customer dashboard.
- **Languages:** TypeScript
- **Frameworks:** React, Playwright, Jest
- **Complexity:** moderate (87 files)

## Test Inventory

- **Automated Tests:** 0 files
- **Manual Tests:** 37 cases

### Manual Tests (20 of 37 shown)

- SUITE: Authentication
  |- User can login
  |- User can reset password
- SUITE: Billing
  |- User can view invoice
  ...and 34 more

> No automation tests found in the project.
```

