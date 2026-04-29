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
- Inventory manual test cases from `.test.md` files.
- Generate project scan JSON for test planning.

**CONSTRAINT (large projects):**
For large codebases, do not perform deep analysis:
- Do not resolve full imports/dependencies.
- Do not analyze code line-by-line.
- Do not infer complex code relationships.
Focus only on high-level structure.

## When to Use

Trigger this skill when user wants to:
- **Scan/Analyze/Discovery** project source code for QA planning.
- **Detect** what frameworks are used.
- **Find** existing automated and manual tests in `.test.md` format.
- **Inventory** codebase before testing procedures.

---

## Workflow: Scan Project (QA-Focused)

### Step 1: Setup Context

Scan root dir and create `.testclaw-context/code/` **only if missing**:

```bash
mkdir -p .testclaw-context/code
```

---

### Step 2: Source Code Discovery

**Check if current directory has source files** — detect via:
- File extensions: `.ts`, `.js`, `.py`, `.go`, `.rs`, `.java`, `.cs`, etc.
- Directories: `app/`, `src/`, `backend/`, `frontend/`, `lib/`, `packages/`, etc.

**If test frameworks detected BUT no source folders found:**

If `testFrameworks` is detected (Playwright, Vitest, etc.) but no source folders (`app/`, `src/`, `frontend/`) exist — ask user:

```
❓ This project has test automation (${testFramework}) but no application source detected.
How should I proceed?

- **1.** Use local app source from another folder (create symlink).
- **2.** Clone app source from Git repo.  
- **3.** Continue with test-only project.
- **4.** Skip source code detecting.
```
[Wait for user input before proceeding].

---

### Step 3: Project Analysis (Simplified)

Scan user's project and collect:

1. **Discover files** - Use the most appropriate method based on project context:
- Prefer `git ls-files` if the project is a Git repository (respects `.gitignore`).
- Otherwise, perform recursive file listing from project root.

2. **Exclude non-source files and directories** - Apply the following exclusion rules:
- **Dependency directories:** like `node_modules/`, `vendor/`, `.venv/`, `__pycache__/`.
- **Build and generated artifacts:** like `dist/`, `build/`, `out/`, `target/`, `.next/`, `.cache/`, `.turbo/`.
- **Coverage and reports:** `coverage/`, `reports/`.
- **Lock and generated files:** like `*.lock`.
- **Ignored files:** Respect `.gitignore` if available.
- **Configuration and env files:** like `.git/`, `.env`, `tsconfig.json`.

**Skip these entirely during scanning.**
[**If in doubt**, prefer excluding over including non-source files.]

3. **Detect frameworks** — separate application and test frameworks:

**PRIORITY: Application frameworks first, then test frameworks.**

**A) Application Frameworks** (from source code/configs):

| Config/Source | Framework |
|----------------|------------|
| `package.json` deps | React, Vue, Angular, Svelte, Next.js, Nuxt, Express, NestJS, Fastify, Koa |
| `Cargo.toml` | Rust (actix, axum, rocket) |
| `go.mod` | Go (gin, echo, fiber) |
| `pyproject.toml` | Django, Flask, FastAPI |
| `app/` folder | As initial application folder |
| `src/` folder | Source code present |
| `backend/` folder | Backend structure |
| `frontend/` folder | Frontend structure |
[This table contains only basic examples and actual names may vary.]

**B) Test Frameworks** (from test configs):

| Config File | Test Framework |
|-------------|-----------------|
| `codecept.conf.js/ts` | CodeceptJS |
| `playwright.config.ts` | Playwright |
| `vitest.config.ts` | Vitest |
| `jest.config.js` | Jest |
| `pytest.ini`, `pyproject.toml` | pytest |
| `*_test.go` | Go tests |

**IMPORTANT:** 
- List **application** frameworks in `frameworks` field.
- List **test** frameworks in `testFrameworks` field.

4. **Extract project name** from `package.json`, `Cargo.toml`, or directory name

5. **Calculate complexity:**

| File Count | Complexity   |
|------------|--------------|
| 1-30       | `small`      |
| 31-150     | `moderate`   |
| 151-500    | `large`      |
| 500+       | `very-large` |

Output to `.testclaw-context/scan-result.json`:

```json
{
  "name": "project-name",
  "description": "...",
  "languages": ["typescript", "javascript"],
  "projectFrameworks": ["Vanilla JS"],        // Application frameworks or source folders
  "testFrameworks": ["Playwright"],    // Test frameworks
  "estimatedComplexity": "small",
  "totalFiles": 12
}
```

**Important:** 
- `frameworks` = app frameworks or source folders (Vanilla JS if app/ exists)
- `testFrameworks` = testing tools (Playwright, Vitest, Jest, etc.)

**Show a summary** based on scan results.

---

### Step 4: Existing Tests Inventory

**A) Automated tests:**

Detect test configs and count:

| Test Framework | Config File | Test Pattern |
|---------------|------------|-------------|
| CodeceptJS | `codecept.conf.js/ts` | `**/*.test.ts` |
| Playwright | `playwright.config.ts` | `**/*.spec.ts` |
| Vitest | `vitest.config.ts` | `**/*.test.ts` |
| Jest | `jest.config.js` | `**/*.test.ts`, `**/*.spec.ts` |
| pytest | `pytest.ini`, `pyproject.toml` | `**/*_test.py` |
| Go | `*_test.go` files | `**/*_test.go` |
| JUnit | `pom.xml`, `build.gradle` | `**/src/test/**` |

Count files in each pattern.

**B) Manual tests:**

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

Merge all results into `.testclaw-context/scan-result.json`:

```json
{
  "name": "project-name",
  "description": "...",
  "languages": ["typescript", "javascript"],
  "frameworks": ["React", "Vite"],        // Application frameworks
  "testFrameworks": ["Playwright"],     // Test frameworks (optional)
  "estimatedComplexity": "moderate",
  "totalFiles": 42,
  "testCounts": {
    "automated": 25,
    "manual": 12
  },
  "manualTests": [
    "SUITE: Authentication",
    "|- User can login",
    "|- User can reset password"
  ]
}
```
**(This `scan-result.json` file must includes full list of available tests)**

**Important:** 
- `frameworks` = application frameworks (React, Vue, Express, Django, etc.)
- `testFrameworks` = test tools (Playwright, Vitest, Jest, CodeceptJS, pytest, etc.)

**Report a summary to the user:**
* Provide a concise overview of the scan results (see example below).
* Do not include full test listings.

**Test listing constraint:**
If manual/automated tests are included in output:
- Limit displayed items to the first 25 entries.
- Keep original file order.
- Indicate truncation if more exist (e.g., `...and N more`).

---

## Final Summary Example

```
Scan Complete:
- Project: ...
- Languages: TypeScript
- Frameworks: Vanilla JS (from `app/` folder)
- Test Frameworks: Playwright
- Complexity: small (12 files)
- Automated Tests: 2 files
- Manual Tests: 9 cases
```

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

**Scan project:**
```
Use project-scan to analyze this codebase for test planning
```

**Find test frameworks:**
```
What test frameworks exist in this project?
```

**Get test inventory:**
```
List all automated and manual tests in this project
```

---

## Quick Commands

| Action            | Command                           |
|-------------------|-----------------------------------|
| Create context    | `mkdir -p .testclaw-context/code` |
| Scan files        | `git ls-files` or `find . -type f -name "*.ts"` |
| Find test configs | `find . -name "codecept.conf.*"` |
| Find test files   | `find . -name "*.test.ts" -o -name "*.spec.ts"` |
| Find manual tests | `find . -name "*.test.md"` |