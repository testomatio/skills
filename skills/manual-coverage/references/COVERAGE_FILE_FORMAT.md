# Coverage File Format

`coverage.manual.yml` and `coverage.e2e.yml` share the same grammar. Both are read by `@testomatio/reporter run --filter "coverage:file=<path>,diff=<branch>"`.

## Top-level shape

A YAML map. Keys are file paths or globs relative to the repository root. Values are lists of identifiers — Suite IDs, Test IDs, or tags.

```yaml
<file or glob>:
  - "@S<8 chars>"   # Suite ID
  - "@T<8 chars>"   # Test ID
  - "@<tag>"        # Tag (matches anything tagged with that label)
```

## Identifier types

| Identifier | Format       | Example       | Meaning                                  |
| ---------- | ------------ | ------------- | ---------------------------------------- |
| Suite ID   | `@S` + 8 hex | `@S92321384`  | All tests inside the suite are selected. |
| Test ID    | `@T` + 8 hex | `@Ta011dfa3`  | Only this specific test is selected.     |
| Tag        | `@<word>`    | `@smoke`      | All tests tagged with the label.         |

For automated tests, IDs live in describe / it / test names:

```javascript
describe('user settings @S92321384', () => {
  it('updates avatar @Ta011dfa3', () => { ... });
});
```

They are populated by `npx check-tests <Framework> "<glob>" --update-ids` after the tests are imported into Testomat.io.

## File keys

Either an exact path or a glob:

```yaml
# Exact file
app/models/user.rb:
  - "@S92321384"

# Glob — any file under the directory
app/services/jira/**:
  - "@jira"

# Multiple identifiers per file
app/controllers/users_controller.rb:
  - "@S92321384"
  - "@Tb022dfa4"
```

## Comments

Use `#` to annotate each identifier with its human-readable title or purpose:

```yaml
app/models/user.rb:
  - "@S92321384"  # Suite: user settings
  - "@Ta011dfa3"  # Test: avatar upload
```

## Reporter usage

The runner command **must** be the first positional argument — `--filter` generates a `--grep` that the runner consumes.

```bash
# Playwright
npx @testomatio/reporter run "npx playwright test" \
  --filter "coverage:file=coverage.e2e.yml,diff=main"

# Cypress
npx @testomatio/reporter run "npx cypress run" \
  --filter "coverage:file=coverage.e2e.yml,diff=main"

# WebdriverIO / Mocha / Jest / CodeceptJS — pass the corresponding runner command
npx @testomatio/reporter run "npx codeceptjs run" \
  --filter "coverage:file=coverage.e2e.yml,diff=main"
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
            --filter "coverage:file=coverage.e2e.yml,diff=origin/main"
```

## Checking the coverage file

One command, run from the project root — no parser of your own:

```bash
npx js-yaml coverage.manual.yml | node scripts/check-coverage.mjs   # or coverage.e2e.yml
```

`npx js-yaml` parses the YAML (it fails loudly on a malformed file, so a broken one never reaches the script). `scripts/check-coverage.mjs` (~25 lines, zero deps; ships with both `manual-coverage` and `automation-coverage`, the latter as a symlink) reads that parsed map on stdin, flags any key whose path is missing on disk, flags any key with no identifiers, lists every `@S…` / `@T…` / tag the file references, and exits non-zero on a problem.

The script can't tell which identifiers are real — check the listed ones against the set you extracted earlier in the workflow. Don't re-parse the test set, don't write your own YAML parser, and never use `python`.

## Authoring tips

- Prefer Suite IDs when most of a suite relates to a file.
- Use Test IDs only when one test in a large suite is relevant.
- Use tags (`@smoke`, `@billing`, `@jira-…`) for cross-cutting concerns.
- Avoid empty entries.
- Commit the coverage file to the repo so CI and teammates use the same mapping.
