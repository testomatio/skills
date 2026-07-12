---
name: qa-manual-tests-to-code-coverage
description: Map manual test cases (markdown) to source code files and produce a `coverage.manual.yml` mapping consumed by `@testomatio/reporter --filter "coverage:..."`. Use this skill when the user wants to run only the manual tests affected by a code change, generate a manual coverage file, build a traceability matrix between manual cases and source code, or set up change-aware regression for manual QA.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# Manual Tests to Code Coverage

Analyze manual test cases (markdown) and the project source code. Produce `coverage.manual.yml` — a map from source files (or globs) to manual test identifiers: suite IDs, test IDs, tags. `@testomatio/reporter run --filter "coverage:file=coverage.manual.yml,diff=<branch>"` consumes it to create manual runs in Testomat.io with only the cases affected by the diff.

## Critical Constraints

- **Only manual tests in markdown format.** Ignore unit, functional, and e2e test files encountered while exploring. Do not suggest creating automated tests.
- **Only touch two files.** This skill runs inside the user's source repo. It may write `coverage.manual.yml` (or the path the user gave) and add one `.testeiya/` line to `.gitignore` if missing. Never a source file — refuse anything else.
- Cases pulled from Testomat.io go into the gitignored `.testeiya/manual-tests/`, never a tracked folder (Step 1).
- **No ad-hoc scripts, no parsers, never Python.** Read `.test.md` files with your file tool. Extract IDs with `grep` (Step 2). Validate the finished file with `npx js-yaml coverage.manual.yml | node scripts/check-coverage.mjs` (Step 5) — the only bundled script.
- Stop immediately if you cannot write the output file, or the user declines both a tests directory and a pull.

## Workflow

### Step 1: Discover the project

- Run the `scan-automation-project` skill to inventory the project. Use its output as the source of truth — do not duplicate the scan.
- Capture from its result:
  - Manual Tests — the `.test.md` files and their suite/test titles (input to Step 2).
  - Project Overview — languages, frameworks, complexity (framing for Step 3).
- If it reports no manual tests (it checks the cache too, so nothing was pulled before):
- ❓ Ask the user how to proceed:
  1. Pull from Testomat.io — have `sync-test-cases-with-tms` pull into the cache: `npx check-tests pull -d .testeiya/manual-tests`, add `.testeiya/` to `.gitignore` if missing, then re-run `scan-automation-project`.
  2. Point to a directory the scan missed, then re-run `scan-automation-project` there.
  3. Stop.

### Step 2: Extract test information

Manual test files follow the [Classical Tests Markdown Format](../qa-write-test-cases/references/test-case-format.md). From every file extract:

- Suite ID — `@S` + 8 chars, in the `<!-- suite ... id: @S... -->` block.
- Test IDs — `@T` + 8 chars, in `<!-- test ... id: @T... -->` blocks.
- Tags — `@tag` markers in suite/test titles and `tags:` lines in metadata blocks.
- Context — suite title, test titles, steps, expected results. Use it to reason about which source files implement each behavior.

Read the files directly — the metadata blocks are short. For a quick overview, run in the cases directory (`manual-tests/`, or the cache `.testeiya/manual-tests/`):

```bash
grep -rnE 'id:[[:space:]]*@S' <dir>      # suite IDs (+ which file)
grep -rnE 'id:[[:space:]]*@T' <dir>      # test IDs
grep -rnE '^tags:' <dir>                 # tags from metadata blocks
grep -rhoE '@[A-Za-z0-9_-]+' <dir> | sort -u   # every @token (titles included)
```

❓ If a file has no `@S`/`@T` IDs, it was never pushed to Testomat.io. Ask whether to push first via `sync-test-cases-with-tms`, or skip it — a mapping without IDs is useless to the reporter.

### Step 3: Explore the codebase

- Start from the Project Overview. Find the business code that implements the behaviors described by the manual tests.
- Work with the project structure (controllers, models, services, components, pages, routes) — not the testing infrastructure.
- Skip: test code (`*.test.*`, `*.spec.*`, `*_test.*`, `test_*.*`, `*.cy.*`, `__tests__/`, `tests/`, `spec/`), manual test directories, dependency/build/vendor folders, framework configs, lock files.
- **Templates and views are mappable source — do not skip them because they aren't `.js`/`.ts`/`.py`.** A manual case walks through the rendered UI, so a template change alters the screen the tester checks. Cover at least:
  - HTML and component templates: `.html`, `.htm`, `.vue`, `.svelte`, Angular `*.component.html`.
  - Logic-in-markup engines: `.hbs`/`.handlebars`, `.ejs`, `.pug`/`.jade`, `.mustache`, `.liquid`.
  - Server-side views: `.erb`, `.haml`, `.slim` (Rails); `.blade.php`, `.twig` (PHP); `.j2`/`.jinja`/`.jinja2` (Python); `.cshtml`/`.razor` (.NET); `.jsp` (Java).
  - Map a template like code: `app/views/sessions/new.html.erb` → the login suite.
- ❓ If the structure is ambiguous, or the scan reports `large`/`very-large` complexity, ask the user which directories to focus on or exclude.

### Step 4: Choose the best mapping per source file

For each candidate source file, pick one strategy — whichever gives the cleanest, most stable selection.

A) Suite (`@S...`) — most tests in a suite relate to the file. Prefer this over listing many test IDs from the same suite.

```yaml
app/models/user.rb:
  - "@S816410d6"  # Suite: User permissions
```

B) Test (`@T...`) — only one test in a large suite matches the file.

```yaml
app/controllers/sessions_controller.rb:
  - "@T6f8e9174"  # Test: User is blocked after 5 failed login attempts
```

C) Tag (`@tag`) — the relevant tests live across several suites.

```yaml
app/services/jira_service.rb:
  - "@jira"      # Tag: All JIRA integration manual tests
```

Rules:

- Globs (`app/services/jira/**`) are valid file keys when a whole subtree maps to the same identifiers.
- No empty entries.
- Add a `#` comment next to each identifier explaining the mapping.

See [Coverage File Format](./references/COVERAGE_FILE_FORMAT.md) for the full YAML grammar.

### Step 5: Save and validate the coverage file

- Write the YAML to the output path (default `coverage.manual.yml`; use the user's path if given). Keep the `#` comments so future readers can audit the mapping without opening Testomat.io.
- Keys are paths to source files in this repo — never `.testeiya/...` paths. The cache holds the cases; the coverage file points at the code they cover.
- Check it — one command, run from the project root:

```bash
npx js-yaml coverage.manual.yml | node scripts/check-coverage.mjs
```

- `npx js-yaml` parses the file and fails loudly on malformed YAML. `check-coverage.mjs` (~25 lines, zero deps) flags keys whose path is missing on disk, keys with no identifiers, and prints every `@S`/`@T`/tag referenced.
- Cross-check that list against the IDs from Step 2 — only you know which are real. Don't re-parse the markdown.
- Show the produced YAML to the user.

### Step 6: Show next steps

Tell the user how to use the file with `@testomatio/reporter`:

```bash
# Create a pending manual run that includes only cases affected by the diff vs main
npx @testomatio/reporter run \
  --kind manual \
  --filter "coverage:file=coverage.manual.yml,diff=main"
```

For batched regression cycles, recommend grouping runs:

```bash
TESTOMATIO_RUNGROUP="Regression 911" npx @testomatio/reporter run \
  --kind manual \
  --filter "coverage:file=coverage.manual.yml,diff=main"
```

- Recommend committing `coverage.manual.yml` so CI and teammates use the same mapping.
- If you pulled the cases: they stay in the gitignored `.testeiya/manual-tests/` for re-runs and follow-ups; nothing was committed. Don't delete the cache or move it into a tracked folder.

### Step 7: Suggest follow-ups

- Coverage gaps — source features with no manual tests. On approval, propose new cases (delegate to `qa-write-test-cases`).
- Dead tests — manual tests whose features no longer exist in source.
- Answer questions like "do we have manual tests for X?" from the cached cases.
- Editing cases: edit them in `.testeiya/manual-tests/` and push back with `sync-test-cases-with-tms` — gitignored doesn't mean read-only.

## References

- [Coverage YAML format](./references/COVERAGE_FILE_FORMAT.md)
- [Manual test markdown format](../qa-write-test-cases/references/test-case-format.md) — canonical, owned by `qa-write-test-cases`
