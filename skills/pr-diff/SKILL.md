---
name: pr-diff
description: Analyze git diff/pull request changes to detect feature implementations and fixes, extract acceptance criteria, and identify related tickets. Use this skill when the user wants to understand what changed in a PR/branch, determine if it's a feature or bug fix, and get acceptance criteria for manual test case generation.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# PR-DIFF SKILL: What I Do

This skill analyzes git diff/pull request changes to understand what was modified and extract acceptance criteria for manual testing. It focuses on **analysis only** — detecting change types, identifying features vs fixes, and generating AC.

**Core Workflow:**
- Detect current branch and base branch.
- Fetch code changes via git diff.
- Analyze changed files to determine change type (feature, fix, refactor).
- Read PR information (description, comments, linked tickets).
- Extract and return acceptance criteria for further testing.

---

## When to Use

Trigger this skill when user wants to:
- **Understand what changed** - analyze PR diff to see what was modified.
- **Detect feature or fix** - determine if PR is a new feature, bug fix, or refactor.
- **Extract acceptance criteria** - get Acceptance Criteria from PR description and code changes.
- **Prepare manual testing** - get Acceptance Criteria to create manual test cases later.
- **Review user's PR and suggest cases for testing** - analyze PR diff to see what was modified and how we can test it.
- **Test a feature branch** - analyze PR diff suggest a next steps for testing.

---

## Workflow: PR Diff Analysis

### Step 1: Detect Branch Context & Scope Check

#### Determine Current Branch

Get the current working branch:
```bash
git branch --show-current
```

#### Detect Base Branch

Auto-detect by checking in order:
1. `origin/HEAD` - default branch
2. `origin/main` or `origin/master`
3. `origin/dev` or `origin/develop`

```bash
git branch -r | grep -E "(origin/HEAD|origin/main|origin/master|origin/dev|origin/develop)" | head -1
```

> If multiple candidates exist, use the first match based on the priority order above.

#### Scope Check

Get changed files:

```bash
git diff {BASE_BRANCH}...HEAD --name-only
```

**Skip to Step 3 with a short summary without acceptence criteria** if:
- Branch is `master`, `main`, `dev`, or `develop`
- No files changed, or only `*.md`/`docs/`, or only test/config files

**Proceed to Step 2** if source code changed (`src/**`, `lib/**`, `app/**`, or root `.ts`/`.js`/`.tsx`/`.jsx`/`.java`/`.py`/`.go`/`.rb`/`.php`/`.cs`/`.kt`/`.swift`/`.rs`)

---

### Step 2: Get Code Changes

#### Get Changed Files

**Uncommitted changes (working directory):**
```bash
git diff --name-only
```

**Branch comparison (all commits ahead of base):**
```bash
git diff {BASE_BRANCH}...HEAD --name-only
```

**Specific PR (GitHub):**
```bash
gh pr diff {PR_NUMBER}
# or
git fetch origin pull/{PR_NUMBER}/head
git diff {BASE_BRANCH}...FETCH_HEAD --name-only
```

#### Extract PR Context

Get PR details:

```bash
gh pr view {PR_NUMBER} --json title,body,comments,reviews,issues
```

Extract testing-relevant info from PR title, description, comments:
- **Title** — feature/fix name, affected component.
- **Description** — criteria, test scenarios.
- **Comments** — test notes, edge cases, reproductions.

#### Analyze Changed Files

Only analyze **source code** files. Skip configs, deps, tests, docs.

**Include:**
- Directories: `src/**`, `lib/**`, `app/**`, `controllers/**`, `services/**`, `models/**`, `pages/**`, `components/**`, `handlers/**`, `modules/**`
- Root files: `.ts`, `.js`, `.tsx`, `.jsx`, `.java`, `.py`, `.go`, `.rb`, `.php`, `.cs`, `.kt`, `.swift`, `.rs`

**Skip:** configs, dependencies, tests, docs, migrations, configs, other no related to source code updates.

**Detect PR Type:**
- **Feature** — new files, endpoints, components, modules
- **Fix** — bug fixes, patches, hotfixes (check commits for "fix", "bug", "hotfix")
- **Refactor** — code restructure without behavior change
- **Config** — only env/deployment/infrastructure changes

---

### Step 3: Summary with Acceptance Criteria

From the analysis, generate structured acceptance criteria:

**Output Format:**

```md
## PR Diff Summary

**PR Type:** ... (feature | bugfix | refactor )
**Branch:** ... (feature | bugfix | refactor )
**Changes:** ... (one sentence describing the overall purpose of this PR)
**Affected Files:**
- ... (bullet list of all affected files in this PR)

**Impacted Areas:**
- item-1 ... (1-3 bullet points, only real impact files/areas in pr)

**Acceptance Criteria:**
- action to perform → expected result
- ...
```

**Rules:**
- Summary MUST be concise and includes high-level overview.
- "Changes" is ONE sentence. Not a paragraph.
- "Impacted Areas" should contain only meaningful business or technical impact.
- Omit empty sections instead of writing `None` or `N/A`.
- Acceptance criteria MUST be testable and user-oriented.
- Avoid generic statements like "code cleanup", "minor fixes", or "various improvements".
- Do NOT describe implementation details line-by-line.

---

## Error Handling

### Recovery

Attempt recovery before failing:
- **No git repo** — ask user to confirm they're in a git project
- **No changes** — show "No code changes found to analyze"
- **Base branch not found** — ask user to specify manually

### Hard Fail

Stop if:
- Cannot read git diff output
- Cannot parse PR information

---

## User Interaction Examples

### Example 1: Analyze Feature Branch

**User:** "Analyze this PR for acceptance criteria"

**Response:**

```md
## PR Diff Summary

**PR Type:** feature
**Branch:** feature/user-auth
**Changes:** Adds user authentication flow updates with JWT handling and password reset support.
**Affected Files:**
- src/services/AuthService.ts
- src/controllers/UserController.ts
- src/pages/LoginPage.tsx
- src/utils/jwt.ts

**Impacted Areas:**
- User authentication flow.
- JWT session handling.
- Password reset functionality.

**Acceptance Criteria:**
- User enters valid credentials → logged in successfully
- User enters invalid password → error message displayed
- User clicks forgot password → reset email sent
- JWT token expires → user redirected to login
```

---

## Quick Commands

| Action | Command |
|--------|---------|
| Current branch | `git branch --show-current` |
| Changed files | `git diff {base}...HEAD --name-only` |
| PR diff (GitHub) | `gh pr diff {PR_NUMBER}` |
| Find main branch | `git branch -r \| grep origin/HEAD` |
