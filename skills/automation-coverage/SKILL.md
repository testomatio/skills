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
- **DO NOT** edit any file other than the output coverage file (default `coverage.e2e.yml`).
- **Use the bundled scripts; never use Python; don't hand-roll parsers.** This skill ships small Node helpers in `scripts/` (paths below are relative to this skill's directory — they sit next to this `SKILL.md`):
  - `scripts/parse-tests.mjs <tests-dir>` — groups the `@S`/`@T` IDs and `@tag` markers found in describe / it / test / Scenario / Feature names, per file (Step 3).
  - `scripts/validate-coverage.mjs <coverage.yml>` — checks structure, that file keys exist, no empty entries, and lists referenced IDs (Step 6). (Same validator as `manual-coverage`, symlinked.)
  Prefer these (or just reading files with your file tool, or a `grep` one-liner) over writing anything. If a script genuinely doesn't cover a need, a short `node -e '…'` one-liner is the ceiling — never `python`/`python3` or another non-JS interpreter, and never a multi-line improvised parser.

---

## Workflow: Build E2E Coverage Map

### Step 1: Discover the project (delegate to `project-scan`)

Run the **`project-scan`** skill to inventory the project. Use its output as the source of truth for framework detection, the e2e test set, and the high-level codebase overview — do not duplicate those scans here.

From the `project-scan` result, capture:
- **Frameworks** — automation framework(s) in use (Playwright, Cypress, WebdriverIO, CodeceptJS, Puppeteer, Appium, Mocha, Jest…). See [E2E Frameworks](./references/E2E_FRAMEWORKS.md) for detection signals if `project-scan` is ambiguous.
- **Automated Tests** — the list of e2e test files (the input to Step 3).
- **Project Overview** — languages, complexity (the framing for Step 5).

If `project-scan` reports **no automated tests**, or no e2e framework is among the detected frameworks:
- ❓ Ask the user to either:
  1. Provide a path to the e2e tests directory (then re-run `project-scan` scoped to it).
  2. Provide a git URL of the repo containing the e2e tests; clone it and re-run `project-scan` against the clone.
  3. Stop.

If multiple frameworks are detected (e.g. Jest + Playwright), confirm with the user which one is the e2e framework — coverage filtering applies per runner.

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

**How to extract.** Run the bundled helper — it walks the tests directory and prints, per file, the `@S`/`@T` IDs and `@tag` markers found in test/suite names:

```bash
node scripts/parse-tests.mjs <tests-dir>
# e.g.  node scripts/parse-tests.mjs tests/e2e
```

(For a handful of files, just reading them with your file tool is fine too. A `grep -rnE '@[ST][0-9a-f]{8}' <tests-dir>` one-liner also works for a quick look. Don't write a parser; never use `python`.) If the helper reports no IDs, populate them first with `npx check-tests@latest <Framework> "<glob>" --update-ids` (see Step 2).

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

**Validate with the bundled script** — don't write your own checker:

```bash
node scripts/validate-coverage.mjs coverage.e2e.yml
```

It reports any malformed lines, file keys that don't exist on disk (glob keys: it checks the literal directory prefix), keys with no identifiers, and prints all referenced `@S…` / `@T…` / tags. Then **cross-check those identifiers against the set you extracted in Step 3** — the script can't know which IDs are real, only you do. Don't re-parse the test files to do that; use the set you already built. Never use `python`.

Then display the produced YAML to the user.

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

## Bundled scripts

| Script                                | Purpose                                                                                  |
| ------------------------------------- | ---------------------------------------------------------------------------------------- |
| `scripts/parse-tests.mjs <dir> [..suffixes]` | Group `@S`/`@T` IDs and `@tag` markers found in test/suite names, per file.        |
| `scripts/validate-coverage.mjs <yml>` | Validate a coverage file: structure, file keys exist, no empty entries; lists referenced IDs. (Symlinked from `manual-coverage`.) |

Run with `node scripts/<name>.mjs …` from this skill's directory. Never reimplement these with `python` or an improvised parser.

---

## Error Handling

### Recovery

- **No e2e tests found** → ask for the directory path or a git URL to clone.
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
