---
name: manual-coverage
description: Map manual test cases (markdown) to source code files and produce a `coverage.manual.yml` mapping consumed by `@testomatio/reporter --filter "coverage:..."`. Use this skill when the user wants to run only the manual tests affected by a code change, generate a manual coverage file, build a traceability matrix between manual cases and source code, or set up change-aware regression for manual QA.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# MANUAL-COVERAGE SKILL: What I do

This skill analyzes **manual test cases in markdown format** and the project source code, then produces `coverage.manual.yml` — a mapping from source files (or globs) to manual test identifiers (suite IDs, test IDs, tags). The mapping is consumed by `@testomatio/reporter run --filter "coverage:file=coverage.manual.yml,diff=<branch>"` to create manual runs in Testomat.io that contain only the cases affected by the diff.

## When to Use

Trigger this skill when the user wants to:
- Map manual test cases to the source code that implements them.
- Generate `coverage.manual.yml` (or a similarly named file) for use with `@testomatio/reporter`.
- Run only manual regression tests relevant to a code change instead of the full suite.
- Build a code → manual-test traceability matrix.
- Find dead manual tests (tests with no matching source) or coverage gaps (source with no manual tests).
- Phrases: "manual test coverage", "map manual cases to code", "affected manual tests", "selective regression for manual tests", "generate coverage.manual.yml".

---

## CRITICAL CONSTRAINTS

This skill works **only with manual tests in markdown format**.

- **DO NOT** process unit, functional, or e2e test files.
- **DO NOT** suggest creating new automated tests.
- **Only touch two files in this repo.** This skill runs inside the user's source-code repo. It may write `coverage.manual.yml` (or the path the user gave) and add one `.testclaw-context/` line to `.gitignore` if it is missing. Nothing else — never a source file. Cases pulled from Testomat.io go into the gitignored `.testclaw-context/manual-tests/`, never into a tracked folder (see Step 1).
- **Use the bundled scripts. Never use Python. Don't write your own parser.** This skill ships small Node helpers next to this `SKILL.md`:
  - `scripts/parse-manual-tests.mjs [tests-dir]` — lists every `.test.md` file's suite ID, test IDs, and tags (Step 2).
  - `scripts/validate-coverage.mjs <coverage.yml>` — checks the file's structure, that the file keys exist, that no entry is empty, and lists the IDs it references (Step 5).
  Use these, or just read files with your file tool, or a `grep` one-liner. If none of that fits, a short `node -e '…'` line is the limit — never `python`, never a parser you write yourself.

If automated test files (e.g. e2e test, unit, api)  are encountered while exploring, ignore them and continue with the manual markdown set.

---

## Workflow: Build Manual Coverage Map

### Step 1: Discover the project (delegate to `project-scan`)

Run the **`project-scan`** skill to inventory the project. Use its output as the source of truth for both the manual test set and the high-level codebase overview — do not duplicate that scan here.

From the `project-scan` result, capture:
- **Manual Tests** — the list of `.test.md` files and their suite/test titles (the input to Step 2).
- **Project Overview** — languages, frameworks, complexity (the framing for Step 3).


If `project-scan` reports **no manual tests** (it checks the cache too, so this means nothing was pulled before):
- ❓ Ask the user how to proceed:
  1. Pull cases from Testomat.io — have **`sync-cases`** pull into the gitignored cache: `npx check-tests pull -d .testclaw-context/manual-tests`, then add `.testclaw-context/` to `.gitignore` if missing. Re-run `project-scan` and continue.
  2. Point to a directory the scan missed (then re-run `project-scan` there).
  3. Stop.

Never pull cases into a tracked folder. Don't repeat `sync-cases` pull logic here.

### Step 2: Extract test information

Each manual test markdown file follows the format described in [Classical Tests Markdown Format](../generate-cases/references/test-case-format.md) (canonical reference, owned by `generate-cases`). For every file extract:

- **Suite ID** — `@S` + 8 chars, found in the `<!-- suite ... id: @S... -->` block.
- **Test IDs** — `@T` + 8 chars, found in `<!-- test ... id: @T... -->` blocks.
- **Tags** — `@tag` markers in suite/test titles and `tags:` lines inside the metadata blocks.
- **Context** — suite title, test titles, steps, and expected results — used to reason about which source files implement each behavior.

**How to extract.** Run the bundled helper. It walks the directory and prints, for each `.test.md` file, the suite ID and title, every test ID and title, and the tags. Point it at wherever the cases are — `manual-tests/`, or the cache `.testclaw-context/manual-tests/`:

```bash
node scripts/parse-manual-tests.mjs manual-tests
# or, if the cases came from the cache:
node scripts/parse-manual-tests.mjs .testclaw-context/manual-tests
```

(A few files? Just read them — the metadata blocks are short. `grep -rnE 'id:[[:space:]]*@[ST][0-9a-f]{8}' <dir>/` works for a quick look too. Don't write a markdown parser. Never use `python`.)

If a file has no `@S` / `@T` IDs, the user has not yet pushed it to Testomat.io (the helper flags these). Ask whether to push first via `sync-cases` or skip those files (mappings without IDs are useless to the reporter).

### Step 3: Explore the codebase

Use the **Project Overview** from Step 1's `project-scan` result (languages, frameworks, complexity) as the starting frame, then identify business code that implements the behaviors described by the manual tests. Skip everything not part of the application — `project-scan` already excludes most of this, but reinforce when reading source:

- Test code: `*.test.*`, `*.spec.*`, `*_test.*`, `test_*.*`, `*.cy.*`, `__tests__/`, `__specs__/`, `tests/`, `spec/`, `specs/`.
- Markdown manual test directories themselves.
- Dependency / build / vendor folders.
- Framework configs and lock files.

Work with the project structure (controllers, models, services, components, pages, routes, etc.) — not the testing infrastructure.

❓ If the project structure is ambiguous or large (`project-scan` reports `large` / `very-large` complexity), ask the user which directories to focus on or to exclude.

### Step 4: Choose the best mapping per source file

For each candidate source file, pick **one** mapping strategy based on which option gives the cleanest, most stable selection:

**A) Map to Suite (`@S...`)** — when most tests in a suite relate to the file.

```yaml
app/models/user.rb:
  - "@S816410d6"  # Suite: User permissions
```

**B) Map to Test (`@T...`)** — when only one specific test matches the file.

```yaml
app/controllers/sessions_controller.rb:
  - "@T6f8e9174"  # Test: User is blocked after 5 failed login attempts
```

**C) Map to Tag (`@tag`)** — when a tag groups tests across multiple suites that all relate to the file.

```yaml
app/services/jira_service.rb:
  - "@jira"      # Tag: All JIRA integration manual tests
```

**Decision guidance:**
- Prefer Suite mapping over listing many individual Test IDs from the same suite.
- Prefer Test mapping when only one test in a large suite is relevant.
- Prefer Tag mapping when the relevant tests live across several suites.
- Globs (`app/services/jira/**`) are valid file keys when a whole subtree maps to the same identifiers.
- Avoid empty entries.

See [Coverage File Format](./references/COVERAGE_FILE_FORMAT.md) for the full YAML grammar.

### Step 5: Save and validate the coverage file

Write the YAML to the resolved output path (default `coverage.manual.yml`). If the user supplied a different path => use it.
Keep `#` comments next to each ID so future readers can audit the mapping without opening Testomat.io.

**Validate it with the bundled script** — don't write your own checker:

```bash
node scripts/validate-coverage.mjs coverage.manual.yml
```

It reports malformed lines, file keys that don't exist (for a glob key it checks the directory prefix), keys with no identifiers, and lists every `@S…` / `@T…` / tag it references. Then check those IDs against the set you extracted in Step 2 — only you know which IDs are real. Don't re-parse the markdown; use the set you already built. Never use `python`.

> The keys in the coverage file are paths to source files in this repo, never `.testclaw-context/...` paths. The cache holds the test cases; the coverage file points at the code they cover.

Then show the produced YAML to the user.

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

Recommend committing `coverage.manual.yml` to the repository so CI and teammates use the same mapping.

If you pulled the cases, tell the user they stay in the gitignored `.testclaw-context/manual-tests/`. A re-run or a follow-up question reuses them, and nothing was committed. Don't delete the cache or move it into a tracked folder.

### Step 7: Suggest follow-ups

Once the file is saved, propose any of:

- Scan the source for **coverage gaps** (features without manual tests). On approval, propose new manual cases (delegate to `generate-cases`).
- Scan for **dead tests** (manual tests whose features no longer exist in source).
- Answer questions like "do we have manual tests for X?" from the cached cases in `.testclaw-context/manual-tests/`.
- If the user wants to *edit* cases, not just analyze them, have `sync-cases` pull again into a tracked folder (`manual-tests/`) for editing and pushing back. The cache is read-only context, not an edit workspace.

---

## References

| Description                  | File                                                       |
| ---------------------------- | ---------------------------------------------------------- |
| Coverage YAML format         | ./references/COVERAGE_FILE_FORMAT.md                       |
| Manual test markdown format  | ../generate-cases/references/test-case-format.md           |

## Bundled scripts

| Script                                | Purpose                                                                                  |
| ------------------------------------- | ---------------------------------------------------------------------------------------- |
| `scripts/parse-manual-tests.mjs [dir]` | List the suite ID, test IDs, and tags in every `.test.md` under `dir` (default `manual-tests`; use `.testclaw-context/manual-tests` for pulled cases). |
| `scripts/validate-coverage.mjs <yml>`  | Validate a coverage file: structure, file keys exist, no empty entries; lists referenced IDs. |

Run with `node scripts/<name>.mjs …` from this skill's directory. Don't rewrite them in `python` or as a one-off parser.

---

## Error Handling

### Recovery

- **No manual tests found (cache included)** → have `sync-cases` pull into `.testclaw-context/manual-tests/`, or ask the user for a directory the scan missed.
- **Markdown files with no `@S`/`@T` IDs** → ask whether to push first via `sync-cases`, or skip those files.
- **Ambiguous source layout** → ask the user which directories are application code.

### Hard Fail (stop immediately)

- Cannot create or write the output file.
- User refuses to provide a tests directory or to pull from Testomat.io.
- The agent is asked to modify files other than the output file (refuse — see CRITICAL CONSTRAINTS).

---

## Examples

**Build the mapping in a source repo (cases pulled if needed):**
```
Use manual-coverage skill to build coverage.manual.yml for our manual cases
```
If there are no local `.test.md` files, it pulls them into the gitignored `.testclaw-context/manual-tests/` and works from there.

**Cases already local:**
```
Use manual-coverage skill for the cases in manual-tests/
```

**With a custom output path:**
```
Use manual-coverage skill, output to ops/coverage.qa.yml
```

**Full workflow (source repo):**
1. `manual-coverage` runs `project-scan`. No local cases, so it has `sync-cases` pull into `.testclaw-context/manual-tests/` (gitignored) and re-runs `project-scan`.
2. It maps source files to suite/test/tag IDs and writes `coverage.manual.yml`. The only tracked changes are that file and one line in `.gitignore`.
3. `npx @testomatio/reporter run --kind manual --filter "coverage:file=coverage.manual.yml,diff=main"` creates a pending run with only the affected cases.

---

## Quick Commands

| Action                                 | Command                                                                                              |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Pull cases into the gitignored cache  | `npx check-tests pull -d .testclaw-context/manual-tests`                                            |
| Create affected manual run             | `npx @testomatio/reporter run --kind manual --filter "coverage:file=coverage.manual.yml,diff=main"`  |
| Group runs                             | `TESTOMATIO_RUNGROUP="Regression 911" npx @testomatio/reporter run --kind manual --filter "..."`     |
