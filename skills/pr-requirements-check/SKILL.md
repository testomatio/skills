---
name: pr-requirements-check
description: Analyze a pull request's context - title, description, comments, linked issues, attached schemas/images — to understand the original intent, verify scope against the linked ticket, surface ambiguities and edge cases, and produce a structured requirements summary with testable acceptance criteria. Use this skill when the user wants to understand WHAT a PR is supposed to do (not just what code changed), check whether the PR matches its linked ticket/task or generate acceptance criteria from PR/ticket context rather than from code.
license: MIT
metadata:
  author: Testomat.io
  version: 1.1.0
---

# PR-REQUIREMENTS-CHECK SKILL: What I Do

This skill reviews a pull request's **context** - the human-written parts: title, description, comments, linked tickets, attached images - to extract the original requirements, verify scope, and produce a requirements summary that downstream skills (`generate-cases`) can consume.

**Core Workflow:**
- Read the PR's human-written context (title, description, comments, images, linked tickets).
- Resolve linked issues via enabled MCP's or CLI (like `gh`): read original ticket description, acceptance criteria, comments, attachemnts.
- Verify whether the PR scope matches the original ticket scope.
- Surface ambiguities (missing edge cases, open questions in comments).
- Save a structured requirements summary as a .md file in the user-specified folder **only if the original prompt explicitly requests** this action.

**Full PR knowledge by available skills**

It is the **complement** of `pr-diff`:

| Skill | Input | Output | Focus |
|-------|-------|--------|-------|
| `pr-diff` | git diff, changed files | AC from code changes | "what the code does" |
| `pr-requirements-check` | PR title, description, comments, linked issue | summary or requirements with scope verification, AC | "what the PR is supposed to do" |

> Use them together for a full picture. Use `pr-requirements-check` alone when the question is "is this PR doing the right thing?" rather than "what does this PR do?".

---

## When to Use

Trigger this skill when the user wants to:
- **Understand the original intent** of a PR from its description and linked ticket, not just the code.
- **Verify scope** — does the code in this PR actually address what the linked Jira/GitHub/etc issue asked for?
- **Find ambiguities or missing cases** in the PR description before generating test cases.
- **Generate acceptance criteria from ticket context** (especially when the PR description is thin but the ticket is detailed).

Do **not** trigger this skill when the user only wants to know what code changed - that is `pr-diff` skill. Trigger it when the user's words include things like "requirements", "ticket", "Jira", "issue", "scope", "what is this PR supposed to do", "does this match the ticket", "missing acceptance criteria", "ambiguities in this PR".

---

## Workflow: PR Requirements Check

### Step 1: Detect PR Context

Identify the PR to analyze and its location.

#### Determine PR Identifier

Accept, in priority order:
1. A PR number or URL from the user prompt/request (e.g. `https://github.com/org/repo/pull/1234`).
2. The open PR for the current branch (e.g. `gh pr view --json number,title,baseRefName,headRefName,url`)
3. A ticket key only (Jira `PRJ-123`, Linear, etc) - pivot to "analyze the ticket, then check for any open PR referencing it".

> If none are detectable, ask the user for a PR number/URL, branch name, or ticket key to continue work.

---

### Step 2: Read PR Context

Collect everything the developer/team members wrote — not the code itself. Detect available MCP/CLI tools and use them to pull:
- **PR metadata** (title, description, comments, labels, milestone, assignees) - via Jira/Linear/GitHub MCP if enabled, else `gh` CLI tools to extract PR "title", "body", "comments", "labels", "attachments", etc.
- **Embedded images/diagrams** in the body — read them (vision-capable agent or `fetch` + describe) when present; they often capture UI changes, error states, or flows that text misses.
- **Linked tickets** — parse the body and branch name for ticket references (table below). 

> Identify and collect all references available to you from the provided context and accessible sources.

**Do not fabricate ticket content or add incorrect information**.

---

### Step 3: Resolve Linked Tickets

Fetch the full original requirements from each linked ticket — the PR description is often a thin summary; the ticket has the real requirements.

Use the first available tool:

1. **Jira/Linear MCP** if enabled — fetch issue summary, description, AC, comments, linked issues, attachments.
2. **GitHub MCP** if enabled — fetch the linked issue.
3. **`gh` CLI** fallback — `gh issue view {N} --json title,body,comments,labels`. For Jira/Linear without an MCP, ask the user to paste the issue content.
4. **No access** — note the gap explicitly in the output and continue with what you have.

---

### Step 4: Verify Scope and Detect Ambiguities

Compare what the PR does against what the ticket asked for, and surface anything unclear. These are **questions to raise**, not assertions that the code is wrong.

**Scope Verification** — build three lists:
- **In scope** — ticket requirements addressed by the PR (description or code, see Step 5).
- **Out of scope / missing** — ticket requirements with no corresponding PR change. These are the most valuable output of this skill.
- **Extra / out of ticket** — PR changes not mentioned in the ticket. Flag for review (intentional or accidental?).

**Ambiguities & Edge Cases:**
- **Underspecified behavior** — ticket says "support export" but not format, naming, empty-data handling, etc.
- **Unanswered comments** — questions in PR or ticket comments with no reply.
- **Conflicting requirements** — different parts of the ticket (or ticket vs. PR description) disagree.
- **Missing edge cases** — empty/null inputs, permissions/roles, backward compatibility, localization/timezone/currency.

---

### Step 5: Identify Affected Files & Edge Cases

This skill is not `pr-diff` — do not do a deep code review. Prefer files **mentioned in the PR description or ticket**; cross-check with `git diff {base}...HEAD --name-only` only if the description doesn't enumerate them.

**Short-circuit (no source behavior):** if every changed file is non-source-code (`*.md`, `docs/**`, `tests/**`, configs, CI, deps, lock files), do not invent AC and do not invoke `pr-diff`. Produce a short summary with: PR title, type (`docs`/`chore`/`ci`/`deps`), one-sentence `Changes`, full file list. 
- Post explicit note `> No source code behavior changed. Acceptance criteria generation is not applicable for this PR.` Stop after this.

**Empty PR description:** if there's no body and the branch name doesn't encode intent, pull `git log {base}..HEAD --pretty=format:"%s%n%b"`, combine with changed files and branch name into a tentative one-sentence `Changes`, and mark `> PR description was empty. Summary derived from branch name, commits, and changed files only.` 
- If a linked ticket exists, prefer the ticket as source of truth and note the empty body under "Ambiguities".

---

### Step 6: Generate the Requirements Summary `.md`

Compose the final output and save it to disk only when the original prompt includes an instruction to save it.

**Filename:** slugify the PR title (lowercase, dashes, no special chars, max 40 chars) and append the PR number. Example: `Add user export to CSV` -> `add-user-export-to-csv-pr-1234.md`.

**Output Template:**

```md
## PR Requirements Summary

**PR:** {title}
**Branch:** {headRefName} → {baseRefName}
**Type:** {feature | bugfix | refactor | deps}
**Linked Tickets:** {list or "none detected"}

**Source of Truth:**
- PR description: {present | empty — derived from commits/branch}
- Jira/GitHub ticket: {resolved | not resolved — no MCP available}
- Most reliable source: {PR description | ticket | commits}

**Changes:** ... (one sentence — intent, not implementation)

**Affected Files:**
- `path/to/file.ts` — source
- `path/to/config.yml` — config
- `docs/readme.md` — docs
- ... (categorized: source | config | test | docs | migration | deps)

**Impacted Areas:**
- ... (1–3 bullets, only meaningful business/technical impact; omit if empty)

**Scope Verification:**
- ✅ In scope: {ticket requirement → where in PR it is addressed}
- ⚠️ Out of scope / missing: {ticket requirement not addressed in PR}
- ➕ Extra (not in ticket): {change present in PR but not in ticket}

**Ambiguities, Edge Cases & Open Questions:**
- ... (underspecified behavior / unanswered comment / conflicting requirement / missing edge case)
- ... (empty input / permissions / error path / performance / backward compatibility / ...)
- ...

**Acceptance Criteria:**
- {action to perform} → {expected result}
- ...
```

**Summary Rules:**
- Concise, high-level, requirements-not-implementation — this is a requirements document, not a code review.
- `Changes` is **one sentence**.
- `Impacted Areas` — 1–3 meaningful bullets; omit the section if empty.
- `Source of Truth` is required — tells downstream skills what to trust when sources disagree.
- Scope Verification — be honest; `⚠️ Out of scope` items are the most valuable output of this skill.
- Acceptance Criteria — testable, user-oriented, written as "action → expected result". If no source-code behavior changed, replace this section with the explicit "not applicable" note from Step 5.
- Omit empty sections instead of writing `None`/`N/A` — except the "no source code changed" note which must be explicit.
- Avoid generic statements like "code cleanup", "minor fixes", "various improvements" — name what changed or omit it.

---

## Error Handling

### Recovery

- **No MCP / `gh` access to the ticket** — note it, continue with the PR description, ask the user to paste the ticket if they want full scope verification.
- **PR not found** — confirm the number, repo, and access.
- **Branch not pushed** — `git fetch` and retry.

### Hard Fail (Stop immediately)

Stop execution if:
- the user repeatedly refuses to provide a PR identifier or ticket content.
- required MCP returns repeated auth/permission errors.
- skill cannot write to the output folder and the user won't allow a different path.

---

## User Interaction Examples

### Example 1: Feature PR with Linked Jira Ticket

**User:** "Check the requirements for PR ticket PRJ-1234 and save to cache `.testclaw/pr-summaries/` folder."

```md
## PR Requirements Summary

**PR:** Add user export to CSV
**Branch:** feature/PRJ-789-user-export → main
**Type:** feature
**Linked Tickets:** PRJ-789

**Source of Truth:**
- PR description: present (includes AC checklist + screenshot)
- Jira/GitHub ticket: resolved (PRJ-789)
- Most reliable source: PR description + ticket (consistent)

**Changes:** Adds a CSV export action on the user list page that streams filtered users to a downloadable file, with email notification when exports exceed 10k rows.

**Affected Files:**
- `src/pages/UserList.tsx` — source
- `src/services/ExportService.ts` — source
- `i18n/en.json` — config
- `tests/e2e/export.test.ts` — test

**Impacted Areas:**
- User list page UI (new "Export" action).
- User data export pipeline (CSV streaming, email delivery).
- Permission checks for export (admin-only).

**Scope Verification:**
- ✅ In scope: PRJ-789 AC1 (export button on list) — addressed in `UserList.tsx`
- ✅ In scope: PRJ-789 AC2 (admin-only) — addressed in `ExportService.ts`
- ⚠️ Out of scope / missing: PRJ-789 AC3 (email notification for >10k exports) — no implementation
- ➕ Extra (not in ticket): German locale strings

**Ambiguities, Edge Cases & Open Questions:**
- CSV column order not specified — needs product confirmation.
- Empty user list, users without email, 50k+ user export (memory/timeout).

**Acceptance Criteria:**
- Admin opens user list with filters and clicks "Export" → modal with row count
- Admin starts export with <10k rows → CSV downloads with `id, name, email, created_at` columns
- Non-admin opens user list → "Export" action is hidden (or 403 via API)
```

> Saved to: `.testclaw/pr-summaries/add-user-export-to-csv-pr-1234.md`

### Example 2: Docs-Only PR (Step 5 short-circuit)

When Step 5's short-circuit rule triggers, produce a minimal summary — no AC, no scope verification:

```md
## PR Requirements Summary

**PR:** Update README with new install steps
**Branch:** docs/update-install → main
**Type:** docs
**Linked Tickets:** none detected

**Source of Truth:**
- PR description: present (one-line)
- Jira/GitHub ticket: not resolved
- Most reliable source: PR description

**Changes:** Updates README install instructions for the new Node 20 requirement and adds a Docker quick-start section.

**Affected Files:**
- `README.md` — docs
- `docs/install.md` — docs

> No source code behavior changed. Acceptance criteria generation is not applicable for this PR.
```

> Not Saved as there is no user's explicit request or instruction.

---

## References

| Description | File |
|-------------|------|
| Filled example of the output summary | [summary-example.md](./references/summary-example.md) |
| `.testclaw/` directory convention | inherited from `project-scan` (see project-scan SKILL.md) |
| Code-focused PR analysis (companion skill) | `../pr-diff/SKILL.md` |
| Downstream: generate test cases from requirements | `../generate-cases/SKILL.md` |
| Downstream: sync generated cases to Testomat.io | `../sync-cases/SKILL.md` |
