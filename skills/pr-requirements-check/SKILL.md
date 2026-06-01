---
name: pr-requirements-check
description: Analyze a pull request's context — title, description, comments, linked Jira/GitHub issues, attached images — to understand the original intent, verify scope against the linked ticket, surface ambiguities and edge cases, and produce a structured requirements summary with testable acceptance criteria saved as a markdown file. Use this skill when the user wants to understand WHAT a PR is supposed to do (not just what code changed), check whether the PR matches its linked ticket/task, find gaps or missing requirements, or generate acceptance criteria from PR/ticket context rather than from code.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# PR-REQUIREMENTS-CHECK SKILL: What I Do

This skill reviews a pull request's **context** - the human-written parts: title, description, comments, linked tickets, attached images - to extract the original requirements, verify scope, and produce a requirements summary that downstream skills (`generate-cases`) can consume.

**Core Workflow:**
- Read the PR's human-written context (title, description, comments, images, linked tickets).
- Resolve linked issues via Jira MCP / GitHub MCP / `gh` CLI — read original ticket description, acceptance criteria, comments.
- Verify whether the PR scope matches the original ticket scope.
- Surface ambiguities (unclear requirements, missing edge cases, open questions in comments).
- Save a structured requirements summary `.md` to **available cahce (if exist - `.testclaw/`)** or root folder.

**Full PR knowledge by available skills**

It is the **complement** of `pr-diff`:

| Skill | Input | Output | Focus |
|-------|-------|--------|-------|
| `pr-diff` | git diff, changed files | AC from code changes | "what the code does" |
| `pr-requirements-check` | PR title, description, comments, linked Jira/GitHub issue | requirements `.md` with scope verification, ambiguities, edge cases, AC | "what the PR is supposed to do" |

> Use them together for a full picture. Use `pr-requirements-check` alone when the question is "is this PR doing the right thing?" rather than "what does this PR do?".

---

## When to Use

Trigger this skill when the user wants to:
- **Understand the original intent** of a PR from its description and linked ticket, not just the code.
- **Verify scope** — does the code in this PR actually address what the linked Jira/GitHub issue asked for?
- **Find ambiguities or missing requirements** in the PR description before generating test cases.
- **Generate acceptance criteria from ticket context** (especially when the PR description is thin but the ticket is detailed).
- **Review a PR before review/merge** from a requirements/completeness angle, not a code-quality angle.

Do **not** trigger this skill when the user only wants to know what code changed — that is `pr-diff`. Trigger it when the user's words include things like "requirements", "ticket", "Jira", "issue", "scope", "what is this PR supposed to do", "does this match the ticket", "missing acceptance criteria", "ambiguities in this PR".

---

## Workflow: PR Requirements Check

### Step 1: Detect PR Context

Identify which PR to analyze and where it lives.

#### Determine PR Identifier

Accept any of these inputs (in priority order):
1. A GitHub PR number / URL passed in by the user (e.g. `#1234`, `https://github.com/org/repo/pull/1234`).

2. The PR for the current branch — auto-detect:

```bash
gh pr view --json number,title,baseRefName,headRefName,url
```
3. A user-provided ticket key (Jira `PRJ-123`, GitHub Issue `#123`) without a PR — in that case the skill still runs but pivots to "analyze ticket, then check if any open PR references it".

If no PR is detectable, ask the user:

```
❓ No pull request detected. Provide one of:
1. PR number or URL (e.g. https://github.com/org/repo/pull/1234)
2. A branch name (I will find its open PR)
3. A ticket key only (e.g. PRJ-123) — I will analyze the ticket and any linked PR
```

#### Detect Working Directory Convention

Before pulling or writing anything, check if the project uses the `.testclaw/` convention (see [References](#references)).
---

### Step 2: Read PR Human-Written Context

Collect everything the developer wrote about the PR — **not** the code itself.

#### 2.1 Title, Description, Comments

Fetch via GitHub MCP if available, else `gh` CLI:
```bash
gh pr view {PR_NUMBER} --json title,body,comments,labels,milestone,assignees
gh pr view {PR_NUMBER} --comments
```

Extract from the response:
- **Title** — short summary, the developer's own framing.
- **Body** — the PR description. Look for: summary, motivation, screenshots, "How to test", "Acceptance Criteria", "Fixes #N" / "Closes PRJ-123", checkbox lists, embedded images (`![](...)`).
- **Comments** — review feedback, scope changes, design decisions, edge cases the reviewer raised.
- **Labels, milestone, assignees** — signal priority and ownership.

#### 2.2 Attached Images and Diagrams

If the PR body contains image URLs (Markdown `![](...)` or HTML `<img>`), read them — they often show UI changes, expected error states, or flow diagrams that text does not capture. Prefer a vision-capable agent or `fetch` + describe.

#### 2.3 Linked Tickets

Parse the PR body and branch name for ticket references. Common patterns:

| Pattern | Source | Example |
|---------|--------|---------|
| `Fixes #N`, `Closes #N`, `Resolves #N` | GitHub Issues | `Closes` |
| `JIRA: PRJ-123`, `[PRJ-123]`, `PRJ-123 in body` | Jira | `Implements PRJ-4567` |
| Branch name with ticket key | Jira | `feature/PRJ-789-user-export` |
| Linear / Asana / ClickUp patterns | various | `LIN-123`, `ASA-456` |

Collect **all** detected ticket references. Do not stop at the first one.

---

### Step 3: Resolve Linked Tickets

Fetch the **full** original requirements from each linked ticket. This is the most important step — the PR description is often a thin summary; the ticket has the real requirements.

#### 3.1 If a Jira MCP is Available

Use it to fetch:
- Issue summary and description (often contains the original AC, mockups, links).
- Acceptance Criteria section (if the team uses a convention like "AC:" or a child checklist).
- Comments — product/QA may have added scope, edge cases, or "out of scope" notes.
- Linked issues — epics, related bugs, blockers.
- Attachments — additional specs or designs.

Example of possible MCP calls (adapt to the Jira MCP actually configured):
- `get_issue({ issue_key: "PRJ-xxx", include_comments: true })`

#### 3.2 If a GitHub MCP is Available

Use available Mcp's tools to fetch the linked GitHub issue:
- `get_issue({ owner, repo, issue_number: xxx })`

#### 3.3 Fallback — `gh` CLI

```bash
gh issue view {NUMBER} --json title,body,comments,labels
gh issue view {NUMBER} --comments
```

For Jira without an MCP, ask the user to paste the issue content — do not silently skip it.

#### 3.4 No MCP and No Access

If no MCP is available and `gh` cannot reach the ticket source, note it explicitly in the output and continue with what you have. 
**Do not fabricate ticket content or add incorrect information**.

---

### Step 4: Verify Scope and Detect Ambiguities

Now compare **what the PR description + code says it does** against **what the ticket says it should do**.

#### 4.1 Scope Verification

Build three lists:

- **In scope** - requirements from the ticket that appear to be addressed (by PR description OR by code, see Step 5).
- **Out of scope / missing** - requirements from the ticket that have **no** corresponding change in the PR.
- **Extra / out of ticket** - changes in the PR that are **not** mentioned in the ticket. Flag these for review — they may be intentional or accidental.

#### 4.2 Ambiguity Detection

Surface places where the requirements are unclear. Categories:

- **Underspecified behavior** - the ticket says "support export" but does not say which formats, what the file naming convention is, what happens with empty data, etc.
- **Unanswered comments** - questions in the PR comments or ticket comments that have no reply.
- **Conflicting requirements** - different parts of the ticket (or ticket vs. PR description) say different things.
- **Missing edge cases** - common edge cases (empty input, error path, permissions, concurrency, large data) that neither ticket nor PR address.

#### 4.3 Edge Case Surfacing

For each affected area, list likely edge cases the developer may have missed. These are **questions to raise**, not assertions that the code is wrong:

- Empty / null / boundary inputs.
- Permission / role checks (does this work for admins vs. regular users?).
- Error paths and how they are surfaced to the user.
- Performance with realistic data volumes.
- Backward compatibility — does existing data still work?
- Localization / timezone / currency where relevant.

---

### Step 5: Identify Affected Files (Briefly)

This skill is **not** `pr-diff` — do not do a deep code review. But the summary needs an accurate "Affected Files" list, so:
- Prefer files **mentioned in the PR description or ticket** (the developer usually lists them).
- Cross-check against `git diff {base}...HEAD --name-only` from `pr-diff` only if the description does not enumerate them. Call out: `> File list cross-checked against git diff (pr-diff skill)`.
- Categorize each file: source code, config, test, docs, migration, dependency. This helps the reader of the summary see at a glance whether config-only or docs-only changes snuck in.

#### When to Short-Circuit (no full analysis)

If **every** changed file is non-source-code (`*.md`, `docs/**`, `tests/**`, configs, CI, dependency bumps, lock files), the PR does **not** describe new behavior. In that case:
- Do **not** invent acceptance criteria.
- Do **not** invoke `pr-diff` for AC extraction.
- Still produce a short summary `.md` with:
  - PR title and type (`docs` | `chore` | `ci` | `deps`).
  - One-sentence `Changes` describing what was updated.
  - The full file list.
  - An explicit note: `> No source code behavior changed. Acceptance criteria generation is not applicable for this PR.`

**Stop after this — there is nothing else to verify or test.**

#### When the PR Description is Empty or Missing

If the PR has no body and the branch name does not encode intent:
- Pull the **commit messages** of the branch:

```bash
git log {base}..HEAD --pretty=format:"%s%n%b"
```

- Combine commit messages + changed files + branch name into a **tentative** one-sentence `Changes` line.
- Mark it explicitly: `> PR description was empty. Summary derived from branch name, commits, and changed files only.`

> If a linked ticket exists, prefer the ticket's title/description as the source of truth and note the empty PR body as a finding under "Ambiguities".

---

### Step 6: Generate the Requirements Summary `.md`

Compose the final output and save it to disk.

#### Filename

Slugify the PR title (lowercase, dashes, no special characters, max 40 chars). 
Example: `Add user export to CSV` => `add-user-export-to-csv-pr-1234.md`. Include the PR number to avoid collisions.

#### Output Template

```md
## PR Requirements Summary

**PR:** {title}
**Branch:** {headRefName} → {baseRefName}
**Type:** ... (feature | bugfix | refactor | deps)
**Linked Tickets:** {list of PRJ-123 or "none detected"}

**Source of Truth:**
- PR description: {present | empty — derived from commits/branch}
- Jira/GitHub ticket: {resolved | not resolved — no MCP available}
- Most reliable source: {PR description | ticket | commits}

**Changes:** ... (one sentence describing the overall purpose of this PR)

**Affected Files:**
- `path/to/file.ts` — source
- `path/to/config.yml` — config
- `docs/readme.md` — docs
- ... (categorized: source | config | test | docs | migration | deps)

**Impacted Areas:**
- item-1 ... (1-3 bullet points, only real impact areas in pr)
- ...

**Scope Verification:**
- ✅ In scope: {ticket requirement → where in PR it is addressed}
- ⚠️ Out of scope / missing: {ticket requirement not addressed in PR}
- ➕ Extra (not in ticket): {change present in PR but not in ticket}

**Ambiguities, Edge Cases & Open Questions:**
- {underspecified behavior / unanswered comment / conflicting requirement / missing edge case}
- {empty input / permissions / error path / performance / backward compatibility / ...}
- ...

**Acceptance Criteria:**
- action to perform → expected result
- ...
```

**Summary Rules:**
- **Concise and high-level.** This summary is a requirements document, not a code review.
- **`Changes` is ONE sentence.** Not a paragraph. Capture intent, not implementation.
- **`Impacted Areas` only meaningful business/technical impact.** 1–3 bullets. Omit the section if there is nothing meaningful.
- **`Source of Truth`** is required — it tells the reader (and downstream skills) what to trust when sources disagree.
- **Scope Verification** — be honest. `⚠️ Out of scope` items are the most valuable output of this skill.
- **Acceptance Criteria** — testable and user-oriented. Written as "action → expected result" so they map directly to test steps. If no source-code behavior changed, replace this entire section with the explicit "not applicable" note described in Step 5.
- **Omit empty sections** instead of writing `None` / `N/A` — except the special case of "no source code behavior changed" which must be explicit.
- **Avoid generic statements** like "code cleanup", "minor fixes", "various improvements". Either name what was cleaned up or do not mention it.

---

### Step 7: Save and Report

1. Print the "overview summary" version in the chat so the user can read it immediately.
3. Tell the user the saved file path and explicitly mention:
  - Whether scope matched the linked ticket (`✅ all in scope` / `⚠️ N items missing` / `➕ N extra changes`).
  - Whether ambiguities were found and how many.
  - Whether downstream skills (`generate-cases`) can consume this file as input.

---

## Error Handling

### Recovery

Attempt recovery before failing:
- **No `gh` CLI** — check for a GitHub MCP; if neither, ask the user to paste the PR title/description manually.
- **No Jira MCP and no `gh` access to the issue** — note it, continue with PR description, ask user to paste the ticket content if they want full scope verification.
- **PR not found** — confirm the number, repo, and that the user has access.
- **Branch not pushed** — fetch the latest and retry.

### Hard Fail

Stop if:
- The user repeatedly refuses to provide any PR identifier or ticket content.
- A required MCP returns repeated auth/permission errors.
- The skill cannot write to corresponding folder and the user will not allow a different path.

---

## User Interaction Examples

### Example 1: Well-Documented Feature PR with Linked Jira Ticket

**User:** `Check the requirements for PR ...`

**Output (abbreviated):**

```md
## PR Requirements Summary

**PR:** Add user export to CSV
**Branch:** feature/PRJ-789-user-export → main
**Type:** feature
**Linked Tickets:** PRJ-111

**Source of Truth:**
- PR description: present (detailed, includes AC checklist)
- Jira ticket: resolved (PRJ-111)
- Most reliable source: PR description + ticket (consistent)

**Changes:** Adds a CSV export action on the user list page that streams all matching users to a downloadable file.

**Affected Files:**
- `src/pages/UserList.tsx` — source
- `src/services/ExportService.ts` — source
- `src/api/export.ts` — source
- `i18n/en.json` — config
- `tests/e2e/export.test.ts` — test

**Impacted Areas:**
- User list page UI.
- User data export pipeline.
- Permission checks for export (admin only).

**Scope Verification:**
- ✅ In scope: PRJ-111 AC1 (export button on list) — addressed in UserList.tsx
- ✅ In scope: PRJ-111 AC2 (admin-only) — addressed in ExportService.ts permission check
- ⚠️ Out of scope / missing: PRJ-111 AC3 (email notification when export is ready for >10k users) — no implementation found
- ➕ Extra (not in ticket): i18n string added for "Export ready" toast

**Ambiguities, Edge Cases & Open Questions:**
- Ticket does not specify CSV column order — needs product confirmation.
- PR comment from @reviewer: "What happens for users with no email?" — unanswered.
- Empty user list (zero rows).
- User without an email address.
- Export of 50k+ users (memory/timeout).

**Acceptance Criteria:**
- Admin clicks "Export" on user list with filters applied → CSV file downloads with matching users
- Non-admin clicks "Export" → action is hidden / returns 403
- Export of >10k users → email notification is sent when file is ready
- Export contains columns: id, name, email, created_at → in that order

> Saved to: `.testclaw/pr-summaries/add-user-export-to-csv-pr-1234.md`

(If `.testclaw/pr-summaries/` - yes, follow it. If not, create `.testclaw/pr-summaries/` at the repo root and add `.testclaw/` to `.gitignore` if not already there)
```

### Example 2: Docs-Only PR (No Source Code Changes)

**User:** `Check the requirements for PR ...`

**Output (abbreviated):**

```md
## PR Requirements Summary

**PR:** ... — Update README with new install steps
**Branch:** docs/update-install → main
**Type:** docs
**Linked Tickets:** none detected

**Source of Truth:**
- PR description: present (one-line)
- Jira ticket: not resolved
- Most reliable source: PR description

**Changes:** Updates README install instructions to reflect the new Node 20 requirement and adds a Docker quick-start section.

**Affected Files:**
- `README.md` — docs
- `docs/install.md` — docs

**Impacted Areas:** (omitted — no business/technical impact beyond documentation)

> No source code behavior changed. Acceptance criteria generation is not applicable for this PR.

> Saved to project root: `update-readme-with-new-install-steps-pr-1240.md`
```

---

## References

| Description | File |
|-------------|------|
| Filled example of the output summary | [summary-example.md](./references/summary-example.md) |
| `.testclaw/` directory convention | inherited from `project-scan` (see project-scan SKILL.md) |
| Code-focused PR analysis (companion skill) | `../pr-diff/SKILL.md` |
| Downstream: generate test cases from requirements | `../generate-cases/SKILL.md` |
| Downstream: sync generated cases to Testomat.io | `../sync-cases/SKILL.md` |

---

## Quick Commands

| Action | Command |
|--------|---------|
| Detect PR for current branch | `gh pr view --json number,title,baseRefName,headRefName,url` |
| Read PR description + comments | `gh pr view {N} --json title,body,comments,labels` |
| Read PR diff (delegate to pr-diff) | `gh pr diff {N}` |
| Read linked GitHub issue | `gh issue view {N} --json title,body,comments` |
| Read branch commits | `git log {base}..HEAD --pretty=format:"%s%n%b"` |
| Files changed | `git diff {base}...HEAD --name-only` |
