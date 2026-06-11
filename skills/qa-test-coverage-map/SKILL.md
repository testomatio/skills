---
name: qa-test-coverage-map
description: Map tests to the source code they cover and generate a per-project coverage map (`coverage.<project>.yml`) consumed by `@testomatio/reporter --filter "coverage:..."`. Handles manual markdown test cases and automated e2e tests (Playwright, Cypress, WebdriverIO, CodeceptJS, Puppeteer, Appium) in one file. Use this skill when the user wants to run only the tests affected by a code change, generate a coverage file (any coverage*.yml), build a code-to-test traceability matrix, or set up change-aware regression — for manual QA, automated suites, or both. Replaces the separate qa-manual-tests-to-code-coverage and e2e-test-coverage-mapping skills.
license: MIT
metadata:
  author: Testomat.io
  version: 2.0.0
---

# QA-TEST-COVERAGE-MAP SKILL: What I do

I analyze a project's tests — manual cases in markdown, automated e2e tests, or
both — and produce a **coverage map**: YAML mapping source files (or globs) to
the Testomat.io identifiers of the tests that cover them (`@S` suite IDs, `@T`
test IDs, `@tag`s). `@testomatio/reporter` consumes the map to count, create,
or run only the tests affected by a git diff:

```bash
npx @testomatio/reporter run --filter "coverage:file=<map>,diff=main" ...
```

Manual and automated tests living in one project go into **one map**. Files are
split per *project*, never per test kind.

## File naming is the contract

One file per Testomat.io project, in the repo root. The name tells every
consumer — CI, the `setup-pr-testing` skill — what kinds of tests are inside
without opening the file:

| Project's tests    | File                                |
| ------------------ | ----------------------------------- |
| manual + automated | `coverage.<projectSlug>.yml`        |
| manual only        | `coverage.<projectSlug>.manual.yml` |
| automated e2e only | `coverage.<projectSlug>.e2e.yml`    |

`<projectSlug>` is a kebab-case identifier of the Testomat.io project (e.g.
`billing-app`). Most repos serve one project and get one file; a monorepo or a
split manual/e2e setup may serve several projects — one file each. Legacy
`coverage.manual.yml` / `coverage.e2e.yml` files (no slug) are single-kind maps
from the old scheme; offer to migrate them when you touch them.

## Constraints

- **Write only the coverage file(s)**, plus one `.testclaw/` line in
  `.gitignore` if missing. Never modify source or test files.
- **Pulled or cloned material lives in the gitignored `.testclaw/`**:
  manual cases pulled from Testomat.io → `.testclaw/manual-tests/`, an
  external e2e repo → `.testclaw/e2e-tests/`. Never into a tracked
  folder. Tests already in the repo are used where they are.
- **Only tests carrying Testomat.io IDs can be mapped.** A map without real
  `@S`/`@T` IDs is useless to the reporter.
- **Unit and integration tests are out of scope** — map manual cases and e2e
  tests only.
- **No ad-hoc scripts, never Python.** File reads, `grep`, `npx js-yaml`, and
  the bundled `scripts/check-coverage.mjs` cover everything this skill needs.

## Workflow

### 1. Discover (delegate to `scan-automation-project`)

Run **`scan-automation-project`**. It reports which test kinds exist (manual `.test.md`
files, automated e2e frameworks), the languages, and the project shape — that
determines the file name(s) and everything after.

If a kind the user expects is missing locally:

- manual cases → have `sync-test-cases-with-tms` pull them:
  `npx check-tests pull -d .testclaw/manual-tests`
- e2e tests in another repo → `git clone <url> .testclaw/e2e-tests`
- otherwise ask for the directory, or stop.

If several automated frameworks are detected, ask which one is the e2e suite.

### 2. Pick the file name(s)

Confirm which Testomat.io project the tests belong to and its slug (ask if you
cannot tell). Choose the file name from the table above based on what Step 1
found. Multiple projects → split the tests by project and build one map each.
If the user supplied an output path, use it.

### 3. Extract test identifiers

- **Manual cases** carry IDs in metadata comments —
  `<!-- suite ... id: @S... -->`, `<!-- test ... id: @T... -->`, plus `tags:`
  lines ([format reference](../qa-write-test-cases/references/test-case-format.md)).
- **Automated tests** carry IDs in test titles —
  `describe('user settings @S92321384')`, `it('updates avatar @Ta011dfa3')`
  (per-framework syntax: [E2E_FRAMEWORKS.md](./references/E2E_FRAMEWORKS.md)).

`grep` is enough — don't write a parser:

```bash
grep -rnoE '@[ST][0-9a-f]{8}' <dir>            # suite/test IDs
grep -rhoE '@[A-Za-z0-9_-]+' <dir> | sort -u   # every @token, tags included
```

Also read the tests themselves — titles, steps, page objects, routes — to
understand which source files each one exercises.

**Missing IDs?** The tests haven't been synced with Testomat.io yet. Manual
cases: push via `sync-test-cases-with-tms` first. Automated tests:
`npx check-tests@latest <Framework> "<glob>" --update-ids` (see
`qa-e2e-tests-reporting`). Don't map tests without IDs.

### 4. Map source files to identifiers

Explore the business code — controllers, models, services, components, routes.
Skip test code, dependencies, build output, and framework configs.

**Templates and views are source too** (`.html`, `.vue`, `.svelte`, `.erb`,
`.blade.php`, `.twig`, `.cshtml`, …): a template change alters the screen a
test checks, so map them like any other file.

Per source file or glob, pick the identifier that gives the most stable
selection:

- **Suite `@S...`** — most tests of a suite relate to the file (preferred,
  survives test additions).
- **Test `@T...`** — only one test in a large suite is relevant.
- **Tag `@tag`** — the related tests are spread across suites.

In a mixed project, manual and automated identifiers sit side by side under
the same key:

```yaml
app/controllers/sessions_controller.rb:
  - "@S816410d6"  # Suite: Login (manual)
  - "@Ta011dfa3"  # Test: login with valid credentials (e2e)
```

Use globs (`app/services/jira/**`) for whole subtrees, annotate every
identifier with a `#` comment, avoid empty entries. Full grammar:
[COVERAGE_FILE_FORMAT.md](./references/COVERAGE_FILE_FORMAT.md).

If the codebase is large or ambiguous, ask which directories to focus on.

### 5. Validate

```bash
npx js-yaml coverage.<slug>.yml | node scripts/check-coverage.mjs
```

`js-yaml` fails loudly on malformed YAML; the checker flags keys whose path is
missing on disk and keys with no identifiers, and lists every referenced ID —
cross-check that list against the set you extracted in Step 3. Map keys are
repo paths, never `.testclaw/...` paths. Show the final YAML to the
user.

### 6. Hand off

Show how the map is used — the suffix decides the `--kind` flag:

```bash
# manual-only map → pending manual run with the affected cases
npx @testomatio/reporter run --kind manual \
  --filter "coverage:file=coverage.<slug>.manual.yml,diff=main"

# mixed map → one run holding affected manual cases and automated tests
npx @testomatio/reporter run --kind mixed \
  --filter "coverage:file=coverage.<slug>.yml,diff=main"

# automated-only map → wrap the runner, no --kind needed
npx @testomatio/reporter run "npx playwright test" \
  --filter "coverage:file=coverage.<slug>.e2e.yml,diff=main"
```

Recommend committing the map so CI and teammates share one mapping, and
**`setup-pr-testing`** to wire it into CI (PR comments with affected counts,
post-merge regression runs). If cases were pulled, they stay in the gitignored
cache for reuse — don't delete or commit them.

Useful follow-ups: scan for coverage gaps (source with no tests → delegate to
`qa-write-test-cases`) or dead tests (tests whose feature no longer exists).

## References

| Description                 | File                                             |
| --------------------------- | ------------------------------------------------ |
| Coverage YAML format        | ./references/COVERAGE_FILE_FORMAT.md             |
| E2E framework detection     | ./references/E2E_FRAMEWORKS.md                   |
| Manual test markdown format | ../qa-write-test-cases/references/test-case-format.md |

## Bundled script

`scripts/check-coverage.mjs` (~25 lines, zero deps) — sanity-checks a parsed
map from stdin. It is the only script; everything else is `grep`, file tools,
or `npx js-yaml`. Don't rewrite it, don't add others, never use `python`.

## Examples

**Mixed project:** "Build a coverage map for our manual cases and Playwright
tests" → one `coverage.billing-app.yml` mapping source files to both kinds of
identifiers.

**Manual-only, nothing local:** cases are pulled into
`.testclaw/manual-tests/`, mapped, and written to
`coverage.billing-app.manual.yml`. Tracked changes: that file and one
`.gitignore` line.

**Two projects in a monorepo:** `apps/shop` and `apps/admin` sync to different
Testomat.io projects → `coverage.shop.yml` + `coverage.admin.yml`.

## Related skills

`scan-automation-project` (mandatory first), `sync-test-cases-with-tms` (pull/push manual cases),
`qa-e2e-tests-reporting` (reporter install + `--update-ids`), `qa-write-test-cases` (author
missing cases), `setup-pr-testing` (consume the map in CI).
