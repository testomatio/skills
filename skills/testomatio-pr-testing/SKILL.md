---
name: testomatio-pr-testing
description: Analyze git diff/pull request changes and generate manual test cases for code changes. Use this skill when the user wants to create test cases based on code changes in a PR/branch, detect what changed (code vs tests vs test cases), avoid duplicating existing test cases, or prepare manual testing for a feature branch. This skill orchestrates project-scan, generate-cases, and sync-cases skills to provide end-to-end test case creation workflow.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# TESTOMATIO-PR-TESTING SKILL: What I Do

This skill analyzes git diff/pull request changes to understand what code was modified and generates appropriate manual test cases for testing. It intelligently distinguishes between code changes, test changes, and test case changes to avoid unnecessary work.

**Test Case Creation Journey:**
- Detect current branch and determine main/base GIT branch.
- Fetch code changes via git diff.
- Analyze changed files to determine change type:
   * If code changes: generate manual test cases for further testing (avoiding case duplicates).
   * If test changes: skip manual case generating.
- Push generated test cases to Testomat.io via `sync-cases` skill.

---

## When to Use

Trigger this skill when user wants to:
- **Create test cases from code diff** or **Review user's pull request changes** - generate test cases for this PR changes.
- **Test a feature branch** - suggest a new cases to test branch before merging.
- **Analyze what changed** - check, what was modified in this PR.
- **Prepare manual testing** - I need to manually test these PR changes.
- **Covere code by tests** - generate test cases based on the code changes.

---

## Workflow: PR/Code Diff Test Case Generation

### Step 1: Detect Branch Context

#### Determine Current Branch

Get the current working branch by simple command: `git branch --show-current`

#### Detect Main/Base Branch

Auto-detect the main branch (master, main, dev, develop):
```bash
git branch -r | grep -E "(origin/HEAD|main|master|dev|develop)" | head -5
```

If multiple candidates exist, ask the user which branch to use as base:
```
❓ Which branch should I compare against?
- main
- master
- dev
- ✏️ Other branch name (specify by manual input)
```

---

### Step 2: Get Code Changes

#### Get Changed Files List

**Option A: Uncommitted changes (working directory)**
```bash
git diff --name-only
```

**Option B: Branch comparison (all commits ahead of base)**
```bash
git diff main...HEAD --name-only
# or
git diff origin/main...HEAD --name-only
```

**Option C: Specific PR (if PR number provided)**
```bash
git diff main...HEAD --name-only
# For GitHub PR: fetch PR and diff
git fetch origin pull/{PR_NUMBER}/head
git diff main...FETCH_HEAD --name-only
```

#### Excluded Files from diff

**Filter patterns** (if user provides excludePatterns):
- Exclude test files: `*.test.ts`, `*.spec.js`, `*.test.py`.
- Exclude config files: `*.json`, `*.yaml`, `*.yml`.
- Exclude documentation: `*.md`, `docs/`.
_We work only with developer feature updates/code changes/etc_

---

### Step 3: Analyze Change Types

For each changed file, determine the type:
- **File Test Changes:** `*.test.ts`, `*.spec.ts`, `*_test.js` => Skip execution (automated test modification).
- **Test Case Change:** `*.test.md` with `<!-- test -->` blocks => Skip (manual test case modification).
- **Code Changes:** `src/**`, `lib/**`, `app/**`=> Generate manual test cases
- **Code Changes:** `controllers/**`, `services/**`, `models/**` => Generate manual test cases.
- **Code Changes:** `pages/**`, `components/**`, `views/**` => Generate manual test cases.
- **Config Changes:** `*.config.js`, `*.config.ts` => Generate test cases for config impact.

#### Categorization Logic

1. **Test File Detection:**
- Contains test frameworks (jest, mocha, pytest, rspec, etc.)
- File name contains `.test.`, `.spec.`, `_test.`
- Contains test assertions (`expect`, `assert`, `should`)

2. **Test Case File Detection:**
- Extension: `.test.md`
- Contains `<!-- test -->` or `<!-- suite -->` blocks

3. **Code File Detection:**
- Application source code in `src/`, `lib/`, `app/`, `controllers/`, `services/`, `models/`
- UI components in `pages/`, `components/`, `views/`
- Configuration in `config/`, `settings/`

#### Conditional Workflow

Based on the analysis results:
- **If code changes detected** => Proceed to **Step 4: Generate Test Cases**
- **If test changes detected** => Skip Step 4, go to **Step 5: Skip Manual Case Crafting**
- **If mixed changes** => Only generate test cases for code changes, skip test file changes.

---

### Step 4: If Code Changes → Generate Test Cases

#### Step 4.1: Scan Existing Test Cases (Avoid Duplicates)

Before generating new test cases, analyze existing tests to avoid duplicates:

**Option A: Use project-scan skill**
```
Use project-scan skill to inventory existing manual tests
```

**Option B: Use sync-cases skill (pull)**
```
Use sync-cases skill to pull existing test cases from Testomat.io
```

**Option C: Scan local .test.md files**
```bash
find . -name "*.test.md" -exec grep -l "feature-name" {} \;
```

**Option D: Use find-duplicate-cases skill (Recommended)**

Use `find-duplicate-cases` skill to analyze existing test cases for potential duplicates:
- Identifies exact duplicates by title.
- Finds semantic duplicates (same intent, similar steps).
- Detects overlapping/subset tests.
- Provides similarity scores and recommendations.
- Helps avoid creating redundant test cases.

When using find-duplicate-cases:
1. Run find-duplicate-cases to find duplicates related to the changed code
2. Use the results to skip creating tests that would be duplicates

#### Step 4.2: Analyze Changed Code

For each changed code file, understand:
- What functionality changed.
- What user-facing impact exists.
- What edge cases might be affected.

**Read changed files** to understand:
- Function signatures changed.
- New parameters added.
- Business logic modifications.
- API endpoint changes.
- UI component changes.

#### Step 4.3: Use generate-cases Skill

Trigger the `generate-cases` skill with the analyzed code changes:

```
Use generate-cases skill to create test cases for the following changed files:
- src/services/auth.ts (login logic changed)
- src/controllers/user.ts (user profile update)
- src/pages/LoginPage.tsx (login UI updated)
```

**Pass context to generate-cases:**
- Changed files list
- Summary of what was modified
- Existing test cases to avoid duplicating

---

### Step 5: If Test Changes → Skip Manual Case Crafting

When only test files changed:
```
ℹ️ Changed files are all test-related. Skipping manual test case generation.

Changed files:
- tests/api/auth.spec.ts
- tests/e2e/login.test.ts

These are automated test modifications, not code changes requiring manual testing.
```

---

### Step 6: Push Generated Tests to Testomat.io

After test cases are generated, use `sync-cases` skill to push them to TMS system:
```
Use sync-cases skill to push generated test cases to Testomat.io
```

---

## Integration with Other Skills

This skill orchestrates:

| Skill | Purpose |
|-------|---------|
| **project-scan** | Scan codebase structure, detect frameworks, inventory existing tests |
| **generate-cases** | Generate test cases from analyzed code changes |
| **sync-cases** | Push/pull test cases to/from Testomat.io |
| **find-duplicate-cases** | Find duplicates among existing tests before generating new ones |
| **testomatio-mcp** | (Optional) Query existing tests in Testomat.io to avoid duplicates |

---

## Output Summary

After completing the workflow, provide:

```
## Test Case Generation Summary

### Code Changes Detected: X files
- src/services/auth.ts (login logic)
- src/controllers/user.ts (profile update)

### Test Cases Generated: X new cases
- login-with-valid-credentials.test.md
- login-with-invalid-password.test.md
- profile-update-validation.test.md

### Duplicate Avoidance: X existing tests analyzed
- Found 2 similar tests, skipped to avoid duplicates

### Status: Ready for push to Testomat.io
```

---

## Error Handling

### Recovery

Attempt recovery before failing when:
- **No git repository detected** — Ask user to confirm they're in a git project.
- **No changes detected** — show message "No code changes found to analyze".
- **Base branch not found** — ask user to specify base branch manually.

### Hard Fail

Stop execution if:
- Cannot read git diff output.
- `generate-cases` skill fails to create test cases.
- `sync-cases` skill fails to push test cases.

---

## User Interaction Examples

### Example 1: Generate Tests from Branch

**User:** "Use /testomatio-pr-testing to create test cases from my current feature branch"

**Agent Response:**
```
1. Detected branch: feature/new-checkout
2. Base branch: main
3. Changed files (5):
   - src/services/checkout.ts
   - src/controllers/CartController.ts
   - src/pages/CheckoutPage.tsx
   - tests/unit/checkout.test.ts (skip - test file)
   - docs/changelog.md (skip - documentation)

4. Code changes to test: 3 files
5. Analyzing code changes...

ℹ️ Running generate-cases skill with analyzed changes...
   - 6 manual cases were generated and saved 
```

### Example 2: Skip When Only Tests Changed

**User:** "Create manual test cases for this PR"

**Skill Response:**
```
1. Changed files (3):
   - tests/e2e/auth.spec.ts
   - tests/unit/user.test.ts
   - tests/integration/payment.test.ts

2. All changed files are test-related.

✅ No manual test case generation needed.
   These are automated test modifications, not code changes.
```

---

## Quick Commands

| Action | Command |
|--------|---------|
| Detect branch | `git branch --show-current` |
| Get changed files | `git diff main...HEAD --name-only` |
| Find main branch | `git branch -r \| grep -E "(origin/HEAD\|main\|master)"` |
| List .test.md files | `find . -name "*.test.md"` |

---

## References

| Description | File |
|-------------|------|
| Generate Cases Skill | ../generate-cases/SKILL.md |
| Sync Cases Skill | ../sync-cases/SKILL.md |
| Project Scan Skill | ../project-scan/SKILL.md |
| Find Duplicate Cases Skill | ../find-duplicate-cases/SKILL.md |
| Testomat.io MCP | ../testomatio-mcp/SKILL.md |