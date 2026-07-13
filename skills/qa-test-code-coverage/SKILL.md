---
name: qa-test-code-coverage
description: Map test cases — manual (markdown) and automated e2e (Playwright, Cypress, WebdriverIO, CodeceptJS, Puppeteer, Appium) — to source code files and produce a `coverage.tests.yml` mapping consumed by `@testomatio/reporter --filter "coverage:..."`. Use this skill when the user wants to run only the tests affected by a code change, generate a coverage file (manual, e2e, or both), build a traceability matrix between tests and source code, or set up change-aware regression.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# Tests to Code Coverage

Analyze the project's tests — manual markdown cases and automated e2e tests — and its source code. Produce `coverage.tests.yml` — a map from source files (or globs) to test identifiers: suite IDs, test IDs, tags. Testomat.io keeps manual and automated tests in one project, so one coverage file serves both. `@testomatio/reporter` consumes it to run only the tests affected by a diff (Step 6).

## Critical Constraints

- **Map the tests that exist — manual markdown cases, automated e2e tests, or both.** No unit tests. Do not suggest creating new tests.
- You may write to exactly three places, nothing else:
  - the coverage file — default `coverage.tests.yml`, or the path the user gave;
  - the `.testeiya/` cache dir — clone automated test repos, pull manual cases from Testomat.io (Step 1);
  - `.gitignore` — add a `.testeiya/` line if it is missing.
- **Never modify a source or test file.**
- Never pull or clone tests into a tracked folder — only into the gitignored `.testeiya/`.
- **Everything in the coverage file must come from this project:** file keys from its source tree, identifiers from the Step 2 inventory. Never copy a path or ID from this skill's docs — they are placeholders.
- **No ad-hoc scripts, no parsers, never Python.** File reads and `grep` only; the single exception is the bundled checker (Step 5); beyond that a one-line `node -e '…'` is the limit.
- Stop if you cannot write the output file, or no tests are found and the user declines every option in Step 1.

## Workflow

### Step 1: Discover the project

- Run the `scan-automation-project` skill to inventory the project. Use its output as the source of truth — do not duplicate the scan.
- Capture from its result:
  - Manual Tests — the `.test.md` files and their suite/test titles.
  - Automated Tests — the e2e test files and framework(s). See [E2E Frameworks](./references/E2E_FRAMEWORKS.md) if the scan is ambiguous.
  - Project Overview — languages, frameworks, complexity (drives the subagent split in Step 4).
- Map whatever exists: both kinds go into one coverage file; a single kind is fine too.
- ❓ If the scan finds no tests at all (it checks the `.testeiya/` cache too), ask the user:
  1. Pull manual cases from Testomat.io — have `sync-test-cases-with-tms` pull into the cache: `npx check-tests pull -d .testeiya/manual-tests`, add `.testeiya/` to `.gitignore` if missing, re-run the scan.
  2. Clone the automated tests repo: `git clone <url> .testeiya/e2e-tests`, add `.testeiya/` to `.gitignore` if missing, re-run the scan.
  3. Point to a directory the scan missed, then re-run the scan there.
  4. Stop.
- ❓ If two automated frameworks are detected (say Jest and Playwright), ask which one is the e2e framework — coverage filtering runs per runner.

### Step 2: Extract test information

Build one inventory of identifiers across both kinds:

- Suite IDs — `@S` + 8 chars.
- Test IDs — `@T` + 8 chars.
- Tags — other `@word` markers.
- Context — titles, steps, page objects, routes hit. This drives the mapping in Step 4.

Where IDs live:

- Manual cases follow the [Classical Tests Markdown Format](../qa-write-test-cases/references/test-case-format.md) — IDs in `<!-- suite ... id: @S... -->` / `<!-- test ... id: @T... -->` blocks, tags in titles and `tags:` lines.
- Automated tests carry IDs in `describe` / `it` / `test` / `Feature` / `Scenario` titles — see [E2E Frameworks](./references/E2E_FRAMEWORKS.md).

Read the files, or `grep` the directories that hold the tests:

```bash
grep -rnE 'id:[[:space:]]*@[ST]' <dir>          # manual suite/test IDs
grep -rnoE '@[ST][0-9a-f]{8}' <dir>             # IDs in automated test titles
grep -rhoE '@[A-Za-z0-9_-]+' <dir> | sort -u    # every @token, tags included
```

Missing IDs mean the tests were never synced with Testomat.io — the reporter cannot select them:

- ❓ Manual files without IDs: ask whether to push them first via `sync-test-cases-with-tms`, or skip those files.
- Automated tests without IDs in most files: stop and instruct the user to run `npx check-tests@latest <Framework> "<glob>" --update-ids` first (per-framework commands: [E2E Frameworks](./references/E2E_FRAMEWORKS.md)).

### Step 3: Explore the codebase

- Find the business code that implements the behaviors the tests check — controllers, models, services, components, pages, routes.
- Skip test code, manual test directories, dependency/build/vendor folders, framework configs, lock files.
- **Templates and views are mappable source** (`.vue`, `.erb`, `.blade.php`, …) — tests check the rendered UI, so map them like code.
- ❓ If the structure is ambiguous, ask the user which directories to focus on or exclude.

### Step 4: Map source files to tests

Split the mapping by codebase size (complexity from Step 1):

- `small` / `medium` — map directly in this session.
- `large` / `very-large`, or many top-level source folders — spawn subagents in parallel, one per source folder. Give each subagent:
  - its folder path and the skip rules from Step 3;
  - the full test inventory from Step 2 — subagents must not re-extract it;
  - the mapping rules below and the [Coverage File Format](./references/COVERAGE_FILE_FORMAT.md);
  - the instruction to return a YAML fragment for files inside its folder only.
- Merge the fragments into one map, drop duplicate keys and empty entries. Only the main session writes the file (Step 5).

For each candidate source file, pick the identifier that keeps selecting the right tests as the test suite grows:

- Suite (`@S`) — the default. Most tests in the suite relate to the file.
- Tag (`@word`) — the relevant tests live across several suites.
- Test (`@T`) — the exception. Use only when just one or two tests in a suite match the file.

Rules:

- **More than a few test IDs from one suite or category → replace them with the suite or tag.** Tests added there later are picked up automatically; a list of test IDs goes stale.
- Never list a test ID whose suite is already in the same entry.
- Keys are source file paths or globs, relative to the repo root; use a glob when a whole subtree maps to the same identifiers.
- Manual and automated identifiers mix freely in one entry.
- No empty entries.
- Annotate each identifier with a `#` comment naming its suite/test/tag title.

YAML grammar: [Coverage File Format](./references/COVERAGE_FILE_FORMAT.md).

### Step 5: Save and validate the coverage file

- Write the YAML to the output path, keeping the `#` comments.
- Keys are paths to source files in this repo — never `.testeiya/...` paths.
- Check it from the project root:

```bash
npx js-yaml coverage.tests.yml | node scripts/check-coverage.mjs
```

- The checker flags keys missing on disk and empty entries, and prints every identifier referenced — cross-check them against the Step 2 inventory; only you know which are real.
- Show the produced YAML to the user.

### Step 6: Show next steps

Tell the user how to use the file with `@testomatio/reporter`:

```bash
# Automated tests — the project's runner command must be passed in
npx @testomatio/reporter run "npx playwright test" \
  --filter "coverage:file=coverage.tests.yml,diff=main"

# Manual tests — creates a pending run with only the affected cases
npx @testomatio/reporter run --kind manual \
  --filter "coverage:file=coverage.tests.yml,diff=main"
```

- Per-framework runner commands and a GitHub Actions example: [Coverage File Format](./references/COVERAGE_FILE_FORMAT.md).
- To group manual and automated runs of one regression cycle, set the same `TESTOMATIO_RUNGROUP` env var on both commands.
- Recommend committing the coverage file so CI and teammates use the same mapping.
- In CI, diff against the base branch — `diff=origin/main` — and checkout with `fetch-depth: 0`.
- Pulled or cloned tests stay in the gitignored `.testeiya/` cache for re-runs — don't delete it or move it into a tracked folder.

### Step 7: Suggest follow-ups

- Coverage gaps — source features no test maps to. On approval, propose new cases (delegate to `qa-write-test-cases`).
- Dead tests — tests whose features no longer exist in source.
- Answer questions like "do we have tests for X?" from the inventory.
- Editing pulled manual cases: edit them in `.testeiya/manual-tests/` and push back with `sync-test-cases-with-tms`.

## References

- [Coverage File Format](./references/COVERAGE_FILE_FORMAT.md) — coverage YAML grammar, reporter contract, GitHub Actions example.
- [E2E Frameworks](./references/E2E_FRAMEWORKS.md) — framework detection signals, where IDs live, per-framework `check-tests` commands.
- [Manual test markdown format](../qa-write-test-cases/references/test-case-format.md) — canonical, owned by `qa-write-test-cases`.
