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
- **Understand what changed**, **Review user's PR and suggest cases for testing** - analyze PR diff to see what was modified and how we can test it.
- **Detect feature or fix** - determine if PR is a new feature, bug fix, or refactor.
- **Extract acceptance criteria** - get Acceptance Criteria from PR description and code changes.

---

## Workflow: PR Diff Analysis

### Step 1: Detect Branch Context & Scope Check

#### Determine Current Branch

Get the current working branch:
```bash
git branch --show-current
```

#### Detect Base Branch

Auto-detect based on available context:

1. **From PR context (preferred):** If a PR number is known, get the exact target branch from GitHub CLI:

```bash
gh pr view {PR_NUMBER} --json baseRefName
```

> `baseRefName` from the response => this is the PR's actual base branch.

#### Determine Changed Files

Compare the current branch against the detected base branch:

```bash
git diff {BASE_BRANCH}...HEAD --name-only
```

If working with uncommitted local changes only:

```bash
git diff --name-only
```

For GitHub PR with full diff view:

```bash
gh pr diff {PR_NUMBER}
```

**Skip to Step 3 with a short summary only (without acceptance criteria)** if:
- Current branch is `master`, `main`, `stable` or any detected **default branch in `baseRefName`**.
- No files changed.
- All changes are **non-source-code** updates only, such as:
   - documentation/requirements (`*.md`, `docs/**`)
   - test flows or test documentation (`*.test.md`, `test-flows/**`, `tests/e2e`)
   - config/infrastructure, CI/CD config  updates (`.github/workflows/**`, `Jenkinsfile`, tooling configs, dependency bumps, etc.)
   - lint/formatter/tooling configs
   - dependency version bumps without feature behavior changes
   - existing test updates.
- No application/source code behavior was changed.

**Proceed to Step 2** if source code changed (`src/**`, `lib/**`, `app/**`, or root `.ts`/`.js`/`.tsx`/`.jsx`/`.java`/`.py`/`.go`/`.rb`/`.php`/`.cs`/`.kt`/`.swift`/`.rs`, etc)

---

### Step 2: Analyze PR Context and Files

Collect feature and testing context from the PR.

#### Extract PR Metadata & Context

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
- Source Code Directories: `src/**`, `lib/**`, `app/**`, `controllers/**`, `services/**`, `models/**`, `pages/**`, `components/**`, `handlers/**`, `modules/**`, etc.
- Source Code files: `.ts`, `.js`, `.tsx`, `.jsx`, `.java`, `.py`, `.go`, `.rb`, `.php`, `.cs`, `.kt`, `.swift`, `.rs`

**Skip:** configs, dependencies, tests, docs, migrations, configs, other no related to source code updates.

**Detect PR Type:**
- **Feature** — new files, endpoints, components, modules
- **Fix** — bug fixes, patches, hotfixes (check commits for "fix", "bug", "hotfix")
- **Refactor** — code restructure without behavior change

#### Additional Project Context & Existing Tests Discovery (Optional)

Use `project-scan` only when additional project context is needed before writing acceptance criteria.
**Do not run `project-scan` by default**.

##### When to use project-scan extra knowledge

Run `project-scan` if:
- The PR introduces new functionality or a significant feature change.
- You need to check whether similar manual tests already exist.
- The user explicitly asks:
  - "check for duplicates"
  - "what tests already exist"
  - similar requests about existing test coverage.

##### When to skip project-scan

Do NOT run `project-scan` if:
- The PR is a small fix or minor UI/component update.
- The diff already provides enough context to write ACs confidently.
- Changes are limited to docs, requirements, tests, configs, or non-source-code updates.
- The project does not appear to contain manual tests.
- Existing test inventory is not relevant for the requested task.

##### If `project-scan` is unavailable

- Continue without checking existing tests.
- Add this note to the AC output: `Manual test inventory not checked — verify existing tests manually if needed.`
- Continue with `Step 3: Summary with Acceptance Criteria`

##### Goal of the scan
Use scan results only to:
- Avoid duplicating existing manual test cases.
- Understand project structure, frameworks, and test organization.
- Improve relevance and consistency of generated acceptance criteria.

**Only use it when the additional context provides clear value**.

---

### Step 3: Summary with Acceptance Criteria

From the analysis, generate structured acceptance criteria:

**Output Format:**

```md
## PR Diff Summary

**PR Type:** ... (feature | fix | refactor )
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

**Summary Rules:**
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
| Base branch (from PR) | `gh pr view {PR_NUMBER} --json baseRefName` |
