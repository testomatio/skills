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
- **DO NOT** edit any file other than the output coverage file (default `coverage.manual.yml`).
- **DO NOT** write or execute ad-hoc scripts (Python, Node, shell heredocs, etc.) to parse the markdown **or to validate the output**. These projects are mostly JS environments and a stray interpreter is an unnecessary risk. Read the `.test.md` files directly with your file-reading tool; if the set is large, use `grep` to pull just the lines you need (see Step 2); validate against what you already gathered (see Step 5).

If automated test files (e.g. e2e test, unit, api)  are encountered while exploring, ignore them and continue with the manual markdown set.

---

## Workflow: Build Manual Coverage Map

### Step 1: Discover the project (delegate to `project-scan`)

Run the **`project-scan`** skill to inventory the project. Use its output as the source of truth for both the manual test set and the high-level codebase overview — do not duplicate that scan here.

From the `project-scan` result, capture:
- **Manual Tests** — the list of `.test.md` files and their suite/test titles (the input to Step 2).
- **Project Overview** — languages, frameworks, complexity (the framing for Step 3).


If `project-scan` reports **no manual tests**:
- ❓ Ask the user how to proceed:
  1. Pull cases from Testomat.io — delegate to **`sync-cases`** (`npx check-tests pull -d <dir>`); after it returns, re-run `project-scan` and continue.
  2. Point to a directory the scan missed (then re-run `project-scan` scoped to it).
  3. Stop.

Do not duplicate `sync-cases` pull logic here.

### Step 2: Extract test information

Each manual test markdown file follows the format described in [Classical Tests Markdown Format](../generate-cases/references/test-case-format.md) (canonical reference, owned by `generate-cases`). For every file extract:

- **Suite ID** — `@S` + 8 chars, found in the `<!-- suite ... id: @S... -->` block.
- **Test IDs** — `@T` + 8 chars, found in `<!-- test ... id: @T... -->` blocks.
- **Tags** — `@tag` markers in suite/test titles and `tags:` lines inside the metadata blocks.
- **Context** — suite title, test titles, steps, and expected results — used to reason about which source files implement each behavior.

**How to extract — no scripts.** Prefer reading the `.test.md` files directly with your file-reading tool; the metadata blocks are small and self-describing. If there are many files, narrow it down first with `grep` instead of writing a parser, e.g.:

```bash
# IDs (suite + test) with file and line
grep -rnE 'id:[[:space:]]*@[ST][0-9a-f]{8}' manual-tests/

# tags lines inside metadata blocks
grep -rnE '^tags:' manual-tests/

# @tags used in titles
grep -rhoE '@[A-Za-z0-9_-]+' manual-tests/ | sort -u
```

Do **not** spawn `python`, `node -e`, or heredoc scripts to do this.

If a file has no `@S` / `@T` IDs, the user has not yet pushed it to Testomat.io. Ask whether to push first via `sync-cases` or skip those files (mappings without IDs are useless to the reporter).

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

**Validate — no scripts.** You wrote the file and you already have the project inventory and the ID set from Steps 1–3, so check against what you know rather than re-scanning:

- **Well-formed YAML** — re-read the file you just wrote with your file tool and eyeball the structure. If you genuinely want a parser to confirm, use the JS-native CLI: `npx js-yaml coverage.manual.yml` (prints the parsed structure, errors on bad YAML).
- **Keys resolve** — every file key must exist; cross-check against the files you saw in Step 1's `project-scan` result. For glob keys, a quick `ls <glob>` or `git ls-files <glob>` confirms at least one match.
- **Identifiers exist** — every `@S…` / `@T…` / `@tag` must be one you extracted in Step 2. Don't re-parse the markdown; use the set you already built.
- **No empty entries** — you control the output, so simply don't emit a key with an empty list.

Do **not** spawn `python`, `node -e`, or heredoc scripts to validate.

Then display the produced YAML to the user.

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

### Step 7: Suggest follow-ups

Once the file is saved, propose any of:

- Scan the source for **coverage gaps** (features without manual tests). On approval, propose new manual cases (delegate to `generate-cases`).
- Scan for **dead tests** (manual tests whose features no longer exist in source).
- Answer ad-hoc questions like "do we have manual tests for X?".
- After edits in the manual tests directory, push changes back via `sync-cases` (`npx check-tests push`).

---

## References

| Description                  | File                                                       |
| ---------------------------- | ---------------------------------------------------------- |
| Coverage YAML format         | ./references/COVERAGE_FILE_FORMAT.md                       |
| Manual test markdown format  | ../generate-cases/references/test-case-format.md           |

---

## Error Handling

### Recovery

- **Tests directory empty** → delegate to `sync-cases` to pull, or ask the user for a different directory.
- **Markdown files with no `@S`/`@T` IDs** → ask whether to push first via `sync-cases`, or skip those files.
- **Ambiguous source layout** → ask the user which directories are application code.

### Hard Fail (stop immediately)

- Cannot create or write the output file.
- User refuses to provide a tests directory or to pull from Testomat.io.
- The agent is asked to modify files other than the output file (refuse — see CRITICAL CONSTRAINTS).

---

## Examples

**Generate the mapping after pulling cases:**
```
Use manual-coverage skill to build coverage.manual.yml for our manual cases in manual-tests/
```

**With a custom output path:**
```
Use manual-coverage skill, output to ops/coverage.qa.yml
```

**Full workflow:**
1. `sync-cases` to pull cases from Testomat.io into `manual-tests/` (skip if cases are already local).
2. `manual-coverage` — internally delegates to `project-scan` for inventory, then produces `coverage.manual.yml`.
3. `npx @testomatio/reporter run --kind manual --filter "coverage:file=coverage.manual.yml,diff=main"` to create a pending run with only affected cases.

---

## Quick Commands

| Action                              | Command                                                                                              |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Pull manual cases (via sync-cases)  | `npx check-tests pull -d manual-tests`                                                               |
| Create affected manual run          | `npx @testomatio/reporter run --kind manual --filter "coverage:file=coverage.manual.yml,diff=main"`  |
| Group runs                          | `TESTOMATIO_RUNGROUP="Regression 911" npx @testomatio/reporter run --kind manual --filter "..."`     |
