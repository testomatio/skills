---
name: automation-coverage
description: Map automated end-to-end tests (Playwright, Cypress, WebdriverIO, CodeceptJS, Puppeteer, Appium) to source code files and produce a `coverage.e2e.yml` mapping consumed by `@testomatio/reporter --filter "coverage:..."`. Use this skill when the user wants to run only the e2e tests affected by a code change, generate an e2e coverage file, or build a traceability matrix between automated tests and source code.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# AUTOMATION-COVERAGE SKILL: What I do

This skill analyzes **automated e2e tests** and the project source code, then produces `coverage.e2e.yml` — a mapping from source files (or globs) to test identifiers (suite IDs, test IDs, tags) embedded in the test code. The mapping is consumed by `@testomatio/reporter run "<runner>" --filter "coverage:file=coverage.e2e.yml,diff=<branch>"` to run only the e2e tests affected by the diff.

## When to Use

Trigger this skill when the user wants to:
- Map automated e2e tests to the source code they exercise.
- Generate `coverage.e2e.yml` (or a similarly named file) for use with `@testomatio/reporter`.
- Run only the e2e tests affected by a change instead of the full suite.
- Build a code → e2e-test traceability matrix.
- Speed up CI by limiting the e2e run to tests affected by the PR diff.
- Phrases: "e2e coverage", "automated test coverage", "map tests to code", "affected e2e tests", "selective e2e run", "generate coverage.e2e.yml".

---

## CRITICAL CONSTRAINTS

This skill works **only with automated e2e tests** (Playwright, Cypress, WebdriverIO, Puppeteer, CodeceptJS, Appium, etc.).

- **DO NOT** process unit tests.
- **DO NOT** process manual markdown test cases (use `manual-coverage` instead).
- **DO NOT** suggest creating new tests.
- **Only touch two files in this repo.** It may write `coverage.e2e.yml` (or the path the user gave) and add one `.testclaw-context/` line to `.gitignore` if it is missing. Nothing else — never a source or test file. If the e2e tests live in another repo, clone it into the gitignored `.testclaw-context/e2e-tests/`, never into a tracked folder (see Step 1).
- **Don't write scripts. Never use Python.** Read test files with your file tool; pull out IDs and tags with `grep` (Step 3). The skill ships one tiny helper, `scripts/check-coverage.mjs` (symlinked from `manual-coverage`), for the one fiddly bit — checking the finished coverage file (Step 6). That's the only script. If you ever need more than a `grep`, a one-line `node -e '…'` is the limit — never `python`, never a parser of your own.

---

## Workflow: Build E2E Coverage Map

### Step 1: Discover the project (delegate to `project-scan`)

Run the **`project-scan`** skill to inventory the project. Use its output as the source of truth for framework detection, the e2e test set, and the high-level codebase overview — do not duplicate those scans here.

From the `project-scan` result, capture:
- **Frameworks** — automation framework(s) in use (Playwright, Cypress, WebdriverIO, CodeceptJS, Puppeteer, Appium, Mocha, Jest…). See [E2E Frameworks](./references/E2E_FRAMEWORKS.md) for detection signals if `project-scan` is ambiguous.
- **Automated Tests** — the list of e2e test files (the input to Step 3).
- **Project Overview** — languages, complexity (the framing for Step 5).

If `project-scan` reports **no automated tests** (it checks `.testclaw-context/e2e-tests/` too, so this means nothing was cloned before), or no e2e framework is detected:
- ❓ Ask the user to either:
  1. Give the path to the e2e tests (then re-run `project-scan` there).
  2. Give the git URL of the e2e tests repo → `git clone <url> .testclaw-context/e2e-tests`, add `.testclaw-context/` to `.gitignore` if missing, and re-run `project-scan` against `.testclaw-context/e2e-tests`.
  3. Stop.

Never clone the tests into a tracked folder in this repo.

If two frameworks are detected (say Jest and Playwright), ask which one is the e2e framework — coverage filtering runs per runner.

### Step 2: Verify Testomatio IDs are present

Coverage filtering relies on `@S` / `@T` identifiers embedded in the test code:

```javascript
describe('user settings @S92321384', () => {
  it('updates avatar @Ta011dfa3', () => { ... });
});
```

```javascript
test('login @smoke @T6f8e9174', async ({ page }) => { ... });
```

If most files have no `@S` / `@T` markers, stop and instruct the user to populate them first by running:

```bash
npx check-tests@latest <Framework> "<glob>" --update-ids
```

(see the `reporter-setup` skill for the full per-framework command). Without IDs in the source, the reporter cannot select tests by coverage.

### Step 3: Extract test information

For each test file extract:

- **Suite IDs** — `@S` + 8 chars in `describe` / `context` / `Feature` blocks.
- **Test IDs** — `@T` + 8 chars in `it` / `test` / `Scenario` blocks.
- **Tags** — other `@word` markers (`@smoke`, `@jira-123`, `@regression`).
- **What is exercised** — page objects imported, routes hit, fixtures used — used to reason about which source files each test covers.

**How to extract.** Read the test files, or `grep` for the IDs and tags in test/suite names. Run these in whichever directory holds the tests (`tests/e2e`, or the cache `.testclaw-context/e2e-tests`):

```bash
grep -rnoE '@[ST][0-9a-f]{8}' <dir>             # suite/test IDs (+ which file/line)
grep -rnoE '@[A-Za-z0-9_-]+' <dir> | sort -u    # every @token, tags included
```

Don't write a parser. Never use `python`. If there are no `@S`/`@T` IDs, add them first with `npx check-tests@latest <Framework> "<glob>" --update-ids` (see Step 2).

### Step 4: Explore the source codebase

Use the **Project Overview** from Step 1's `project-scan` result (languages, frameworks, complexity) as the starting frame, then identify business code the tests exercise. Skip:

- Test code itself.
- Dependency / build / vendor folders.
- Framework configs (`playwright.config.*`, `cypress.config.*`, `wdio.conf.*`, `codecept.conf.*`, lock files).

❓ If the project structure is large or ambiguous (`project-scan` reports `large` / `very-large` complexity), ask which directories to focus on or to exclude.

### Step 5: Choose the best mapping per source file

For each candidate source file, pick **one** strategy:

**A) Map to Suite (`@S...`)** — when most tests in a suite relate to the file.

```yaml
app/models/user.rb:
  - "@S92321384"  # Suite: user settings e2e tests
```

**B) Map to Test (`@T...`)** — when only one test matches the file.

```yaml
app/controllers/sessions_controller.rb:
  - "@Ta011dfa3"  # Test: login with valid credentials
```

**C) Map to Tag (`@tag`)** — when a tag groups tests across suites.

```yaml
tag:@smoke:
  - "@Ta011dfa3"
  - "@Tb022dfa4"
```

**Rules:**
- Prefer specific file paths when tests target a single file.
- Prefer globs (`app/services/jira/**`) when tests cover an entire subtree.
- Prefer Suite mapping when most of a suite relates — terser, survives test additions.
- Use Test mapping when only one test in a large suite is relevant.
- Use Tag mapping for cross-cutting concerns.
- Avoid empty entries.
- Add `#` comments next to each identifier explaining the mapping.

See [Coverage File Format](./references/COVERAGE_FILE_FORMAT.md) for the full YAML grammar.

### Step 6: Save and validate the coverage file

Write the YAML to the resolved output path (default `coverage.e2e.yml` in the project root). If the user supplied a different path => use it.

**Check it** — two steps, no script of your own:

```bash
npx js-yaml coverage.e2e.yml > /dev/null && echo "valid YAML"   # parses?
node scripts/check-coverage.mjs coverage.e2e.yml                 # keys exist? empties? list IDs
```

`check-coverage.mjs` flags any key whose path is missing on disk, any key with no identifiers, and prints every `@S…` / `@T…` / tag it references. Check that list against the IDs you extracted in Step 3 — only you know which are real. Don't re-parse the test files; use the set you already have. Never use `python`.

> The keys in the coverage file are paths to source files in this repo, never `.testclaw-context/...` paths. The cache holds the cloned tests; the coverage file points at the code they exercise.

Then show the produced YAML to the user.

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

Recommend committing `coverage.e2e.yml` to the repository so CI uses the same mapping. Provide a GitHub Actions snippet on request — see [Coverage File Format](./references/COVERAGE_FILE_FORMAT.md) for the reporter contract.

### Step 8: Final summary

Report:
- Framework detected.
- Number of test files scanned.
- Number of tests with `@S` / `@T` IDs.
- Number of source files mapped.
- Output file path.

---

## References

| Description                  | File                                          |
| ---------------------------- | --------------------------------------------- |
| Coverage YAML format         | ./references/COVERAGE_FILE_FORMAT.md          |
| E2E framework detection      | ./references/E2E_FRAMEWORKS.md                |

## Bundled script

`scripts/check-coverage.mjs <coverage.yml>` (symlinked from `manual-coverage`) — flags keys whose path is missing on disk and keys with no identifiers, and lists every `@S`/`@T`/tag the file references. ~30 lines, zero deps. Run it with `node scripts/check-coverage.mjs <yml>` from this skill's directory. It's the only script — everything else is `grep`, your file tool, or `npx js-yaml`. Don't rewrite it in `python`.

---

## Error Handling

### Recovery

- **No e2e tests found (cache included)** → ask for the path, or a git URL to clone into the gitignored `.testclaw-context/e2e-tests/`.
- **Tests have no `@S`/`@T` IDs** → instruct the user to run `npx check-tests <Framework> "<glob>" --update-ids` (cross-link `reporter-setup`).
- **Ambiguous source layout** → ask which directories are application code.

### Hard Fail (stop immediately)

- Cannot create or write the output file.
- User refuses to provide a tests directory or to clone a repo.
- The agent is asked to modify files other than the output file (refuse — see CRITICAL CONSTRAINTS).

---

## Examples

**Playwright project, default output:**
```
Use automation-coverage skill to map our Playwright tests to source code
```

**Custom directory + output:**
```
Use automation-coverage skill, tests in e2e/playwright, output to ops/coverage.e2e.yml
```

**Full workflow (CI):**
1. Run `reporter-setup` to install `@testomatio/reporter` and import tests via `check-tests --update-ids` (so suite/test IDs land in the source).
2. Run `automation-coverage` — internally delegates to `project-scan` for framework detection and inventory, then produces `coverage.e2e.yml`.
3. Commit `coverage.e2e.yml`.
4. In CI, run `npx @testomatio/reporter run "npx playwright test" --filter "coverage:file=coverage.e2e.yml,diff=origin/main"` — only the affected tests execute.

---

## Quick Commands

| Action                              | Command                                                                                                |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Populate IDs in test source         | `npx check-tests@latest <Framework> "<glob>" --update-ids`                                             |
| Run affected Playwright tests       | `npx @testomatio/reporter run "npx playwright test" --filter "coverage:file=coverage.e2e.yml,diff=main"` |
| Run affected Cypress tests          | `npx @testomatio/reporter run "npx cypress run" --filter "coverage:file=coverage.e2e.yml,diff=main"`   |
| Run affected CodeceptJS tests       | `npx @testomatio/reporter run "npx codeceptjs run" --filter "coverage:file=coverage.e2e.yml,diff=main"` |
