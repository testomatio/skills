---
name: scan-automation-project
description: Scan a project and inventory what is available for QA work: project type, languages, frameworks, manual `*.test.md` cases, automated tests and automated references, and how Testomat.io is reachable (token, MCP, project settings). Use this skill whenever analyzing a codebase for test planning, detecting test frameworks, counting tests, or preparing for test automation. Specifically, when the user mentions "scan project", "what tests exist", "how many tests", "analyze codebase", "detect frameworks", "test matrix", or needs an inventory before a QA workflow.
license: MIT
metadata:
  author: Testomat.io
  version: 1.1.0
---

# Scan Automation Project

Scan the project and return a QA-focused inventory: project type, languages, frameworks, existing tests, and what Testomat.io access is available.

**Shallow scan only.** No full import resolution, no line-by-line parsing, no reading full test implementations. High-level structure only.

## Step 1: Locate Source Code

- If the project root has non-empty source folders or files, go to Step 2.
- If **no source** files are found, stop and ask the user:

```
❓ No application source code detected (folder may be empty or missing).
Where is the source code?
1. Use local project from another folder (I will create a symlink)
2. Clone from Git repo
3. I don't know yet (stop here)
```

- Wait for the user's reply.
- If the user gives a Git repo or another folder, clone or symlink it into `.testeiya/<name>/` (the source's basename; `extra-` prefix if taken). No-op if it is already there.

### The `.testeiya/` folder

All persistent QA metadata lives in `.testeiya/` in the project root.

- `<name>/`: a linked or cloned external project, named after its source. Read-only reference.
- `requirements/`: user stories and acceptance criteria (pdfs, docs, images).
- `docs/`: feature explanations, test planning and strategy files. Prose for humans, never data dumps.
- `manual-tests/`: markdown test cases pulled from Testomat.io.
- `auto-tests/`: references to the relevant automated (e2e) tests.
- `exploratory/`: explorbot setup.
- `project-info.json`: the project's settings as Testomat.io reports them, when cached.

Rules:

- It is a dot-folder. File-search tools skip it by default: search it with hidden:true or an explicit `.testeiya/` path prefix. A linked folder is a symlink; wildcard searches do not descend into it, so search it with its own `.testeiya/<name>/` prefix.
- It excludes itself from git: when you create `.testeiya/`, also create `.testeiya/.gitignore` containing a single `*`. **Never add `.testeiya/` to the repo's own `.gitignore`**: a repo-level entry hides the folder from search tools, so the next scan reports "no manual tests" while the cases sit right there.

### Rule for pulled data

**When you need to pull external data** (manual test cases, app code, e2e tests from another repo) into this project:

| This project has | Store pulled data in |
| ------------------ | ---------------------- |
| **Source code** (`src/` folder) or **big project** | `.testeiya/…` |
| **Only test infrastructure** (e2e dirs like `tests/`, `playwright/`, `cypress/` but no `src/`) | `manual-tests/` or `e2e-tests/` |
| **Empty / manual-only** | `manual-tests/` |

Detection logic:
1. Has `src/` folder or is a monorepo? → Use `.testeiya/`
2. Has e2e test dirs (`tests/`, `playwright/`, `cypress/`, `e2e/`)? → Use tracked folder (`manual-tests/`, `e2e-tests/`)
3. Otherwise → Default to `manual-tests/`

- The rule covers *pulled* data only. Output a skill *produces* and the user wants — a `coverage.*.yml`, new `*.test.md` files — goes in the repo as normal.
- On a source repo with no manual tests, this skill changes no tracked file: it only creates the self-ignored `.testeiya/` directory.
- **Only touch `.testeiya/` and tracked folders — never pollute the repo with cache in a wrong location.**

## Step 2: Project Analysis

Collect source file paths only. **Do NOT read file contents.**

Include:
- Application source files.
- View/template files: `.html`/`.htm`, `.vue`, `.svelte`, `.hbs`/`.handlebars`, `.ejs`, `.pug`/`.jade`, `.mustache`, `.liquid`, `.erb`, `.haml`, `.slim`, `.blade.php`, `.twig`, `.j2`/`.jinja`/`.jinja2`, `.cshtml`/`.razor`, `.jsp`. They are application source — coverage skills map UI changes through them.

Exclude:
- Dependencies, build output, coverage, reports, caches, config, lock, and environment files.
- Paths ignored by `.gitignore` — but **not** `.testeiya/<name>/`. In a manual-tests repo the app code lives there; scan it as source.
- Testeiya internal files (e.g. `session-factory.ts`, `system-prompt.ts`).
- **If in doubt**, exclude.

From the file list:
- Classify the **project type**, one of:
  - `source`: application source code. Never change it; use it for discovery.
  - `e2e`: a test automation project (e2e dirs, a test framework config, little or no app source). You can write tests for it.
  - `manual`: empty, or mostly `*.test.md` files. Test cases go into the project itself.
- Detect languages and frameworks. Collect one `frameworks` list with ALL application and testing frameworks.
- Extract the project name from a project config file (`package.json`, `Cargo.toml`, `pom.xml`, ...); fall back to the root directory name.
- Rate complexity by source file count:

| File Count | Complexity   |
|------------|--------------|
| 1-30       | `small`      |
| 31-150     | `moderate`   |
| 151-500    | `large`      |
| 500+       | `very-large` |

## Step 3: Test Inventory

Detect existing tests, automated and manual. Stay shallow.

### Manual tests

A `*.test.md` file is a suite. Each test inside it is a `<!-- test ... -->` block followed by an `#`/`##` heading (the title). The block's `type:` field says which kind of test it is:

- `type: manual`: a manual test case, authored and maintained here as markdown.
- `type: automated`: a **reference** to an automated test (see below).
- No `type:` line at all: treat as manual. This is common, so never count manual tests by grepping for `type: manual`; it silently undercounts.

Know the counts before you answer anything about project scope, coverage or progress. Read them straight from the files; this mirrors how Testomat.io parses them. `find .` also looks inside `.testeiya/manual-tests/`, so a re-run after a pull finds the cached cases instead of reporting "no manual tests":

```bash
# one line per suite or test: SUITE <title>, or <type> <title>
find . -name "*.test.md" -exec awk '
  /^<!-- suite/  { in_block=1; kind="SUITE"; next }
  /^<!-- test/   { in_block=1; kind="manual"; next }
  in_block && /^type:[[:space:]]*automated/ { kind="automated"; next }
  in_block && /^-->/ { in_block=0; expect=1; next }
  expect && /^#+[[:space:]]+/ {
    title=$0; sub(/^#+[[:space:]]+/, "", title)
    if (kind == "SUITE") printf "SUITE: %s\n", title
    else                 printf "|- [%s] %s\n", kind, title
    expect=0
  }
' {} +
```

Pipe the output into `grep -c '\[manual\]'` or `grep -c '\[automated\]'` to count one kind.

- If the only `.test.md` files are under `.testeiya/manual-tests/`, say so in the inventory: they came from Testomat.io, not from this repo.
- A source checkout with no `*.test.md` files has nothing to count. Say so; do not estimate.

### Automated tests

- Detect frameworks via config files (`jest.config.*`, `playwright.config.*`, `vitest.config.*`, `pytest.ini`, `pom.xml`, ...), project dependencies, and test file patterns (`*.test.*`, `*.spec.*`, `*_test.*`).
- For each framework: identify its test file pattern and count matching files.
- Unit and integration tests are inventory, not QA scope: note them, but flag e2e and acceptance suites as the ones QA work targets.

### Automated references

`type: automated` entries in `*.test.md` are references, not runnable code. They arrive via `check-tests pull --export-automated`, which exports the automated tests Testomat.io knows about as markdown. The real implementation lives in a **different repository**, the automation project, which is usually not this one.

- Never claim you ran an automated test because you found its reference here. Nothing here executes.
- Do not edit a reference's markdown to change the test's behaviour. The code is elsewhere, the edit gets overwritten on the next pull, and pushing it can clobber TMS data. Locate the real test in the automation repo instead.
- To actually run them, use a CI profile (Step 4): if the project has one configured, a run can be triggered through Testomat.io.
- They are still valuable context: they tell you what is already automated versus what is still manual, which is what coverage gaps and automation candidates need.

## Step 4: Testomat.io Access

Record how Testomat.io is reachable from this session. Check, do not assume:

- **Token:** `TESTOMATIO` in the environment (or in `.env`). With it, `npx check-tests` can pull and push test cases and the REST API answers under `$TESTOMATIO_URL/api/v2`.
- **MCP:** Testomat.io MCP tools are present (tools prefixed `testomatio-`, direct tools such as `tests_list` and `runs_list`, or one `mcp` tool that searches and calls operations). MCP needs `TESTOMATIO_PROJECT_ID` as well as the token; a token alone identifies no project. Setup lives in the `testomatio-mcp` skill.
- **Project settings:** `.testeiya/project-info.json`, when present: framework, language, environments, labels, tags, and **CI profiles** (runs can be triggered through them).

Never ask the user for the Testomat.io token when one is configured. Secrets the app under test needs are a different thing; a missing one blocks a run.

### Which source answers what

| Question is about | First action |
|---|---|
| Test content: steps, gherkin, description, file path, tags | `read`, `find`, `grep` in the project |
| Suite hierarchy, structure, which files exist | `ls`, `find` |
| Individual test metadata: priority, status flag, labels | the files; if missing, get the test from Testomat.io |
| Runs, testruns, plans, labels, issues, analytics | Testomat.io (MCP or REST); these are not files |
| Creating or updating tests or suites | edit the markdown file, then `npx check-tests push` (see `sync-test-cases-with-tms`) |
| Launching an automated or mixed run on CI | `npx -y @testomatio/reporter@latest run --remote <profile>`; raise an error if no CI profile is configured |
| Running automated tests locally | the local test runner with the Testomat.io reporter attached |

Statuses and counts in Testomat.io are live. Runs change them at any time, so fresh query results supersede numbers from earlier in the conversation.

## Step 5: Output

Return one structured markdown result directly. **Do NOT save to a file.**

```markdown
# Project Overview

- **Project Name:** acme-web-app
- **Description:** A React-based customer dashboard with an Express API.
- **Project Type:** source
- **Languages:** TypeScript, SQL
- **Frameworks:** React, Express, Jest, Playwright
- **Complexity:** small (12 files)

## Test Inventory

- **Automated Tests:** 10 files (Playwright)
- **Manual Tests:** 37 cases (`.testeiya/manual-tests/`, pulled from Testomat.io)
- **Automated References:** 12 (implementation lives in another repository)

### Manual Tests (20 of 37 shown)

- SUITE: Authentication
  |- User can login
  |- User can reset password
- SUITE: Billing
  |- User can view invoice
  ...and 17 more

### Automated Tests (10 of 10 shown)

- home.page.spec.ts
...

## Testomat.io

- **Token:** set (`TESTOMATIO`)
- **MCP:** available (`testomatio-*` tools)
- **Project settings:** `.testeiya/project-info.json`, framework playwright, CI profiles: "e2e" (github)
```

Field rules:
- **Description:** 1-2 sentences based only on detected source code and folder structure (include the domain area if that makes sense).
- **Project Type:** one of `source` | `e2e` | `manual`.
- **Complexity:** one of `small` | `moderate` | `large` | `very-large`, plus the file count.
- **Manual Tests:** preserve hierarchy as plain strings — SUITE items as parent bullets, test titles (`|-`) as nested children. Say where they live.
- **Automated Tests:** list of detected test files.
- **Testomat.io:** one line per access path, `available`/`not available`; omit the section only when none is present, and then say the project is not connected.
- All values must come from observable files and tools. Do NOT guess missing data or add fields not shown above.

Sections:
- If Step 3 found no tests, omit `## Test Inventory` and note that the project contains no tests; the `# Project Overview` section is still useful for next steps.
- If one test type is absent, note it with a blockquote, e.g. ``> No manual tests (`.test.md`) found in the project.``

Test listing truncation:
- Show at most the first 20 entries per list, in original file order.
- Mark truncation in the heading (`(20 of 37 shown)`) and with `...and N more`.
- Do not print full test listings beyond that.
