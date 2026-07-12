---
name: e2e-test-coverage-mapping
description: Map automated end-to-end tests (Playwright, Cypress, WebdriverIO, CodeceptJS, Puppeteer, Appium) to source code files and produce a `coverage.e2e.yml` mapping consumed by `@testomatio/reporter --filter "coverage:..."`. Use this skill when the user wants to run only the e2e tests affected by a code change, generate an e2e coverage file, or build a traceability matrix between automated tests and source code.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# E2E Test Coverage Mapping

Analyze automated e2e tests and the project source code.
Produce `coverage.e2e.yml` — a map from source files (or globs) to test identifiers (suite IDs, test IDs, tags) embedded in the test code.
`@testomatio/reporter run "<runner>" --filter "coverage:file=coverage.e2e.yml,diff=<branch>"` consumes it to run only the e2e tests affected by the diff.

## Critical Constraints

- **Only automated e2e tests.** No unit tests. No manual markdown cases (that is `qa-manual-tests-to-code-coverage`, if available).
- **Do not suggest creating new tests.**
- **Only touch two files in this repo:** the coverage file (default `coverage.e2e.yml`, or the path the user gave) and one `.testeiya/` line in `.gitignore` if missing. Never a source or test file.
- **Never clone tests into a tracked folder.** External test repos go into the gitignored `.testeiya/e2e-tests/` (Step 1).
- **Don't write scripts. Never use Python.** Read test files with your file tool; pull out IDs and tags with `grep` (Step 3). The only script is the bundled checker: `npx js-yaml coverage.e2e.yml | node scripts/check-coverage.mjs` (Step 6). If you ever need more than a `grep`, a one-line `node -e '…'` is the limit — never a parser of your own.

## Workflow

### Step 1: Discover the project

Run the `scan-automation-project` skill to inventory the project. Use its output as the source of truth — do not duplicate its scans here. Capture:

- Frameworks — the automation framework(s) in use. See [E2E Frameworks](./references/E2E_FRAMEWORKS.md) for detection signals if the scan is ambiguous.
- Automated Tests — the list of e2e test files (the input to Step 3).
- Project Overview — languages, complexity (the framing for Step 4).

If the scan reports no automated tests or no e2e framework (it checks `.testeiya/e2e-tests/` too), ask the user to either:

1. Give the path to the e2e tests, then re-run `scan-automation-project` there.
2. Give the git URL of the tests repo: `git clone <url> .testeiya/e2e-tests`, add `.testeiya/` to `.gitignore` if missing, re-run the scan against `.testeiya/e2e-tests`.
3. Stop.

If two frameworks are detected (say Jest and Playwright), ask which one is the e2e framework — coverage filtering runs per runner.

### Step 2: Verify Testomatio IDs are present

Coverage filtering relies on `@S` / `@T` identifiers embedded in suite and test names (per-framework examples: [E2E Frameworks](./references/E2E_FRAMEWORKS.md)).

If most files have no `@S` / `@T` markers, stop and instruct the user to populate them first:

```bash
npx check-tests@latest <Framework> "<glob>" --update-ids
```

See the `qa-e2e-tests-reporting` skill for the full per-framework command. Without IDs in the source, the reporter cannot select tests by coverage.

### Step 3: Extract test information

For each test file extract:

- Suite IDs — `@S` + 8 chars in `describe` / `context` / `Feature` blocks.
- Test IDs — `@T` + 8 chars in `it` / `test` / `Scenario` blocks.
- Tags — other `@word` markers (`@smoke`, `@jira-123`, `@regression`).
- What is exercised — page objects imported, routes hit, fixtures used. This drives the mapping in Step 5.

Read the test files, or `grep` in whichever directory holds the tests (`tests/e2e`, or the cache `.testeiya/e2e-tests`):

```bash
grep -rnoE '@[ST][0-9a-f]{8}' <dir>             # suite/test IDs (+ which file/line)
grep -rnoE '@[A-Za-z0-9_-]+' <dir> | sort -u    # every @token, tags included
```

### Step 4: Explore the source codebase

Start from Step 1's Project Overview, then identify the business code the tests exercise. Skip:

- Test code itself.
- Dependency / build / vendor folders.
- Framework configs (`playwright.config.*`, `cypress.config.*`, `wdio.conf.*`, `codecept.conf.*`, lock files).

**Templates and views are source code — map them too.** E2E tests assert on the rendered UI, so a template change breaks or alters the page. Do not skip files because they aren't `.js`/`.ts`/`.py`. Cover at least:

- HTML & component templates: `.html`, `.htm`, `.vue`, `.svelte`, Angular `*.component.html`.
- Logic-in-markup engines: `.hbs`/`.handlebars`, `.ejs`, `.pug`/`.jade`, `.mustache`, `.liquid`.
- Server-side views: `.erb`, `.haml`, `.slim` (Rails); `.blade.php`, `.twig` (PHP); `.j2`/`.jinja`/`.jinja2` (Python); `.cshtml`/`.razor` (.NET); `.jsp` (Java).

Map a template the same way as code: to the suite/test/tag whose tests render and assert against that view (e.g. `app/views/sessions/new.html.erb` → the login suite).

If the project is large or ambiguous (scan reports `large` / `very-large` complexity), ask which directories to focus on or to exclude.

### Step 5: Choose the best mapping per source file

For each candidate source file, pick one strategy:

A) Map to Suite (`@S...`) — when most tests in a suite relate to the file.

```yaml
app/models/user.rb:
  - "@S92321384"  # Suite: user settings e2e tests
```

B) Map to Test (`@T...`) — when only one test matches the file.

```yaml
app/controllers/sessions_controller.rb:
  - "@Ta011dfa3"  # Test: login with valid credentials
```

C) Map to Tag (`@tag`) — when a tag groups tests across suites.

```yaml
tag:@smoke:
  - "@Ta011dfa3"
  - "@Tb022dfa4"
```

Rules:

- Prefer specific file paths when tests target a single file.
- Prefer globs (`app/services/jira/**`) when tests cover an entire subtree.
- Prefer Suite mapping when most of a suite relates — terser, survives test additions.
- Use Test mapping when only one test in a large suite is relevant.
- Use Tag mapping for cross-cutting concerns.
- Avoid empty entries.
- Add `#` comments next to each identifier explaining the mapping.

See [Coverage File Format](./references/COVERAGE_FILE_FORMAT.md) for the full YAML grammar.

### Step 6: Save and validate the coverage file

- Write the YAML to `coverage.e2e.yml` in the project root, or the path the user gave.
- Keys are paths to source files in this repo — never `.testeiya/...` paths. The cache holds the cloned tests; the coverage file points at the code they exercise.
- Check it, from the project root:

```bash
npx js-yaml coverage.e2e.yml | node scripts/check-coverage.mjs
```

- `npx js-yaml` parses the file and fails loudly on malformed YAML.
- `check-coverage.mjs` (~25 lines, zero deps; symlinked from `qa-manual-tests-to-code-coverage`) flags keys whose path is missing on disk, keys with no identifiers, and lists every `@S` / `@T` / tag referenced.
- Check that list against the IDs you extracted in Step 3 — only you know which are real. Don't re-parse the test files.
- Show the produced YAML to the user.

### Step 7: Show next steps

Tell the user how to use the file with `@testomatio/reporter`. The runner command **must** be passed in — `--filter` generates `--grep` that the runner consumes:

```bash
# Playwright
npx @testomatio/reporter run "npx playwright test" \
  --filter "coverage:file=coverage.e2e.yml,diff=main"

# Cypress
npx @testomatio/reporter run "npx cypress run" \
  --filter "coverage:file=coverage.e2e.yml,diff=main"

# WebdriverIO
npx @testomatio/reporter run "npx wdio" \
  --filter "coverage:file=coverage.e2e.yml,diff=main"

# CodeceptJS
npx @testomatio/reporter run "npx codeceptjs run" \
  --filter "coverage:file=coverage.e2e.yml,diff=main"
```

- Recommend committing `coverage.e2e.yml` so CI uses the same mapping.
- In CI, diff against the base branch — `diff=origin/main` — and checkout with `fetch-depth: 0`.
- Provide a GitHub Actions snippet on request — see [Coverage File Format](./references/COVERAGE_FILE_FORMAT.md) for the reporter contract and CI example.

### Step 8: Final summary

Report:

- Framework detected.
- Number of test files scanned.
- Number of tests with `@S` / `@T` IDs.
- Number of source files mapped.
- Output file path.

## References

- [Coverage File Format](./references/COVERAGE_FILE_FORMAT.md) — coverage YAML grammar, reporter contract, GitHub Actions example.
- [E2E Frameworks](./references/E2E_FRAMEWORKS.md) — framework detection signals, where IDs live, per-framework `check-tests` commands.
