# Testomat.io Classical Tests Markdown Format

Native format for import into Testomat.io. **NEVER generate IDs** (`id: @S...` / `id: @T...`) — they are server-generated.

---

## Hierarchy: Folder → Suite → Test

| Level | Testomat Entity | MD Representation | Example |
|-------|----------------|-------------------|---------|
| Feature | Folder | `# Folder Title` (parent: null via API) | Manual Test Execution |
| Sub-feature | Suite | `# Suite Title` (parent: folder via API) | Environment Configuration |
| Test case | Test | `## Test Title` (inside suite) | Select custom environment for a run |

**Per-suite MD file:** each file contains ONE suite (sub-feature) with its tests. The folder (feature) is created via API during publishing — it does not appear in the MD file.

**File naming:**
- **Flat suite:** `test-cases/{feature-slug}/{suite-slug}-test-cases.md`
- **Nested suites:** `test-cases/{feature-slug}/{suite-slug}/{section-slug}.md` (one file per section — see § Nested Suites below)

---

## Document Structure

```
<!-- suite
key: value
-->
# Suite Title

Suite description (optional)

<!-- test
key: value
-->
## Test Title

Test description (optional)

## Steps

- Step action
  _Expected_: Observable result
```

---

## Suite Metadata (`<!-- suite ... -->`)

| Field | Description |
|-------|-------------|
| `emoji` | Emoji for the suite (e.g. `🔐`) |
| `assignee` | User email |

**Do NOT include `tags:` or `labels:` in suite metadata — they break `check-tests push` import.**

## Test Metadata (`<!-- test ... -->`)

| Field | Description | Parsed by push? |
|-------|-------------|-----------------|
| `type` | `manual` or `automated` | No (ignored) |
| `priority` | `low`, `normal`, `important`, `high`, `critical` | **Yes** |
| `assignee` | User email | No (ignored) |
| `source` | Comma-separated AC refs (e.g. `AC-1, AC-3`) or `exploratory`. Required by create-test-cases skill. | No (skill-only) |
| `automation` | `candidate` (can automate now), `deferred` (needs infrastructure first), or `manual-only` (keep manual). Required by create-test-cases skill. | No (skill-only) |
| `automation-note` | Short reason for the classification (e.g. `"straightforward form fill"`, `"requires multi-user setup"`, `"visual comparison needed"`). Required when `automation` is `deferred` or `manual-only`. | No (skill-only) |

**Do NOT include `tags:` or `labels:` in test metadata — they break `check-tests push` import.**
Tags go in the test title: `## Test title @tag1 @tag2`. Labels are applied after push via API v2.

### Example with source and automation fields

```markdown
<!-- test
type: manual
priority: high
source: AC-2, AC-3
automation: candidate
-->
## Cannot create label with duplicate name

<!-- test
type: manual
priority: normal
source: AC-51
automation: manual-only
automation-note: requires 2 concurrent users to verify distribution
-->
## Verify auto-assign distributes tests between assigned users
```

---

## Steps Format

```markdown
## Steps

- Navigate to the login page
  _Expected_: Login form is displayed
- Enter valid credentials and click **'Login'**
  _Expected_: User is redirected to the dashboard
```

Rules:
- Steps under `## Steps` heading
- Bulleted list (`-` or `*`)
- `_Expected_:` for expected results (italic)
- Expected results should be specific and verifiable

### Multi-bullet Expected (preferred when there are multiple observable results)

When a single step has more than one observable outcome, break the `_Expected_:` into indented sub-bullets — one checkable assertion per bullet. A wall of comma-separated facts is hard to read and harder to verify.

```markdown
- Click the **'PASSED'** button
  _Expected_:
  - Button shows active state
  - Header counter "Passed 1" increments; "Pending N-1" decrements
  - Three sub-status chips appear: "Expected behaviour", "Management decision", "Minor issue"
  - Attachment zone becomes visible below the Result message textbox
  - Result message textbox is visible with placeholder "Result message"
```

One-liner Expected is fine when there is truly one observation. As soon as a second "and …" sneaks in, switch to bullets.

---

## Anti-patterns in test case bodies

Never leak implementation details into `_Expected_`, Steps, or titles. These come from the `ui-elements.md` catalog and belong there **only** as LLM cross-check context for the ui-validator subagent — they are NEVER copied into published test cases.

| Forbidden in TC body | Why | Use instead |
|---|---|---|
| CSS class names (`bg-green-500`, `text-green-800`, `ring-green-500`, `.keyboard-shortcut-icon`) | Manual testers don't read CSS; tests become fragile to redesign | Describe the visual state in prose: "Button shows active state (filled green background with dark text)" |
| Icon class names (`md-icon-timer`, `md-icon-dots-horizontal`, `md-icon-file-tree-outline`) | Same — implementation detail | Reference icon by its role or tooltip: "timer icon", "extra-options menu", "tree view toggle" |
| `data-test-id`, `aria-describedby`, `<li>` tag names, selectors | Locator-flavored; for automation, not manual | Describe the element semantically: "tooltip popper", "history list row" |
| Inline AC refs (`(AC-4)`, `URL pattern asserts AC-10`) | AC traceability belongs in `<!-- test -->` frontmatter `source:` only | Keep `source: AC-4, AC-10` in the test header; strip inline mentions |
| Raw XSS / SQLi payloads (`<script>alert('xss')</script>`, `<img src=x onerror=alert(1)>`) | Noise in a manual checklist; testers can't visually parse escaping from raw markup | Describe in prose: "a message containing HTML/script markup (e.g. a `<script>` tag, an `<img>` tag with `onerror`, and a `<b>` tag)" |

If the `ui-elements.md` catalog is the **only** way to identify an element, treat that as a signal to describe it by proximity / label / tooltip instead.

---

## Parameterized title rule

If a test has an `<!-- example -->` block with parameter columns, the title **MUST** reference at least one column using `${col_name}` syntax. Otherwise every row renders with the same title in Testomat.io and becomes indistinguishable.

```markdown
## Mark test as PASSED with each ${sub_status} and result message  ← correct

<!-- example -->

| sub_status |
|---|
| Expected behaviour |
| Management decision |
| Minor issue |
```

Anti-pattern (do not do):

```markdown
## Mark test as PASSED with each sub-status and result message     ← title has no ${}
```

Multi-column example blocks: at least one `${col}` placeholder in the title; referencing two is fine when both are meaningful (e.g. `## Hotkey marks test as ${status} via ${hotkey}`).

---

## E2E Format (mandatory)

Every test = complete user journey: `Navigate → Act → Verify → (next action → Verify) → Final outcome`. No standalone static UI checks. If 3+ items share the same entry point → consolidate into one test.

**Full rules, anti-patterns, and examples:** [testing-strategy.md § 1.3](testing-strategy.md)

---

## Parameterized Tests

```markdown
<!-- test
type: manual
priority: high
-->
## User can login as ${role}

## Steps

- Login as ${role} user
  _Expected_: Dashboard is displayed

<!-- example -->

| role |
| --- |
| admin |
| user |
```

---

## Full Example

```markdown
<!-- suite
emoji: 🔐
-->
# Login Functionality

<!-- test
priority: high
source: AC-1, AC-2
automation: candidate
-->
## Successful login with valid credentials @smoke @critical

A user should be able to log in with valid credentials.

## Steps

- Navigate to the login page
  _Expected_: Login form is displayed with username and password fields
- Enter a valid username and password
  _Expected_: Credentials are entered without errors
- Click the **'Login'** button
  _Expected_: User is redirected to the dashboard

<!-- test
priority: normal
source: AC-3
automation: candidate
-->
## Login with invalid password shows error @negative

## Steps

- Navigate to the login page
  _Expected_: Login form is displayed
- Enter valid username and invalid password
  _Expected_: Credentials are entered
- Click the **'Login'** button
  _Expected_: Error message "Invalid email or password" is displayed. User stays on login page
```

---

## Tags

- **Always in title:** `@tag` format (e.g. `## Test @smoke @regression`)
- **NEVER in `<!-- test -->` header** — `tags:` field breaks `check-tests push` import (server 422 error)
- Tags in titles must NOT include suite/test IDs

## Nested Suites (file format)

**When to nest** (decision matrix, auto-merge, anti-patterns, "what counts as a natural section"): [self-review-checks.md § 8](self-review-checks.md#8-sub-suite-distribution) — single source of truth. This section only covers **how to lay the files out** once the decision is "nested".

**Only working approach:** directory structure. Multiple `<!-- suite -->` blocks in one file do not nest (parser bug — see `.claude/skills/create-test-cases/CLAUDE.md` § Nested Suites).

### File structure

```
test-cases/{feature-slug}/{suite-slug}/
├── {section-1-slug}.md      # Child suite 1
├── {section-2-slug}.md      # Child suite 2
└── {section-3-slug}.md      # Child suite 3
```

### Each section file — standard format

Each file is a normal single-suite MD file with `<!-- suite -->` + `# heading` + tests:

```markdown
<!-- suite -->
# Runs List

<!-- test
priority: high
source: AC-1
automation: candidate
-->
## Filter runs by Manual tab and verify run entries @smoke

## Steps

- Navigate to the Runs page
  _Expected_: Runs list is displayed with tabs
- Click the **'Manual'** tab
  _Expected_: Only manual runs are shown in the list
```

### How it maps to Testomat.io

| File system | Testomat entity |
|-------------|-----------------|
| `{suite-slug}/` directory | Parent suite (folder) |
| `{section-slug}.md` file | Child suite nested inside parent |
| `## Test` inside file | Test inside child suite |

### Publishing

Publishing is owned by `/publish-test-cases-batch`. It copies the nested-suite directory into a temp git dir that mirrors this structure:

```
/tmp/tc-publish-{suite-slug}/
└── {suite-slug}/
    ├── section-1.md
    └── section-2.md
```

`check-tests push` creates: parent suite `{suite-slug}` → child suites `Section 1`, `Section 2` nested inside.

### Quality checks apply per parent

All coverage thresholds (scenario balance, priority pyramid, AC coverage) are calculated across **all section files combined** — the parent suite is the unit of coverage, not individual sections.

---

## Labels

- **NEVER in `<!-- test -->` or `<!-- suite -->` header** — `labels:` field breaks `check-tests push` import (server 422 error)
- Labels are applied after publishing via API v2 `link` parameter (owned by `/publish-test-cases-batch` — see its `references/api-reference.md`)
