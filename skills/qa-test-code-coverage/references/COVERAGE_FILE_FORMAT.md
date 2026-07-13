# Coverage File Format

`coverage.tests.yml` (any path works) maps source files to manual and automated test identifiers — one grammar for both kinds. It is read by `@testomatio/reporter run --filter "coverage:file=<path>,diff=<branch>"`.

Every path and identifier in this document is a placeholder showing the shape. Real file keys come from the project's source tree; real IDs come from its test inventory. Never copy a value from here into a coverage file.

## Top-level shape

A YAML map. Keys are file paths or globs relative to the repository root. Values are lists of identifiers — Suite IDs, Test IDs, or tags.

```yaml
<file or glob>:
  - "@S<8 chars>"   # Suite ID
  - "@T<8 chars>"   # Test ID
  - "@<tag>"        # Tag (matches anything tagged with that label)
```

## Identifier types

| Identifier | Format       | Shape         | Meaning                                  |
| ---------- | ------------ | ------------- | ---------------------------------------- |
| Suite ID   | `@S` + 8 hex | `@S1a2b3c4d`  | All tests inside the suite are selected. |
| Test ID    | `@T` + 8 hex | `@T5e6f7a8b`  | Only this specific test is selected.     |
| Tag        | `@<word>`    | `@smoke`      | All tests tagged with the label.         |

For automated tests, IDs live in describe / it / test names:

```javascript
describe('<suite title> @S1a2b3c4d', () => {
  it('<test title> @T5e6f7a8b', () => { ... });
});
```

They are populated by `npx check-tests <Framework> "<glob>" --update-ids` after the tests are imported into Testomat.io.

## File keys

Either an exact path or a glob:

```yaml
# Exact file
<path/to/file>:
  - "@S1a2b3c4d"

# Glob — any file under the directory
<path/to/dir>/**:
  - "@<tag>"

# Multiple identifiers per file
<path/to/file>:
  - "@S1a2b3c4d"
  - "@T5e6f7a8b"
```

## Comments

Use `#` to annotate each identifier with its human-readable title or purpose:

```yaml
<path/to/file>:
  - "@S1a2b3c4d"  # Suite: <suite title>
  - "@T5e6f7a8b"  # Test: <test title>
```

## Reporter usage

For automated tests the runner command **must** be the first positional argument — `--filter` generates a `--grep` that the runner consumes.

```bash
# Playwright
npx @testomatio/reporter run "npx playwright test" \
  --filter "coverage:file=coverage.tests.yml,diff=main"

# Cypress
npx @testomatio/reporter run "npx cypress run" \
  --filter "coverage:file=coverage.tests.yml,diff=main"

# WebdriverIO / Mocha / Jest / CodeceptJS — pass the corresponding runner command
npx @testomatio/reporter run "npx codeceptjs run" \
  --filter "coverage:file=coverage.tests.yml,diff=main"
```

For manual tests pass `--kind manual` instead of a runner — the reporter creates a pending run in Testomat.io with only the affected cases:

```bash
npx @testomatio/reporter run --kind manual \
  --filter "coverage:file=coverage.tests.yml,diff=main"
```

The `diff` value must be a stable branch (`main`, `origin/main`) the reporter can run `git diff` against.

## GitHub Actions example

```yaml
name: Run Tests Based on Changes

on:
  pull_request:
    branches: [main]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      # install browsers and prepare app for testing here

      - name: Run affected E2E tests
        env:
          TESTOMATIO: ${{ secrets.TESTOMATIO }}
        run: |
          npx @testomatio/reporter run "npx playwright test" \
            --filter "coverage:file=coverage.tests.yml,diff=origin/main"
```

## Checking the coverage file

One command — no parser of your own. Run it with the project root as working directory (file keys resolve against it), but the checker itself lives in the skill's `scripts/` directory, not in the project:

```bash
npx js-yaml coverage.tests.yml | node <path-to-this-skill>/scripts/check-coverage.mjs
```

`npx js-yaml` parses the YAML (it fails loudly on a malformed file, so a broken one never reaches the script). `check-coverage.mjs` (~25 lines, zero deps) reads that parsed map on stdin, flags any key whose path is missing on disk, flags any key with no identifiers, lists every `@S…` / `@T…` / tag the file references, and exits non-zero on a problem.

The script can't tell which identifiers are real — check the listed ones against the set you extracted earlier in the workflow. Don't re-parse the test set, don't write your own YAML parser, and never use `python`.

## Authoring tips

- Prefer Suite IDs when most of a suite relates to a file.
- Use tags for cross-cutting concerns that span suites.
- Use Test IDs only when one or two tests in a suite are relevant — a long test-ID list goes stale as tests are added, a suite or tag keeps selecting new ones.
- Never list a test ID whose suite is already in the entry — the suite ID already selects it.
- Avoid empty entries.
- Commit the coverage file to the repo so CI and teammates use the same mapping.
