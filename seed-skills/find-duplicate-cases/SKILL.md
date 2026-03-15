---
name: find-duplicate-cases
description: Find duplicate, near-duplicate, and overlapping test cases across the test suite. Identifies exact matches, semantically similar tests, and tests that are subsets of other tests. Provides recommendations for which tests to keep, merge, or remove.
---

# FIND-DUPLICATE-CASES SKILL: What I do

Detect and manage duplicate test cases in user project. Provide clear recommendations for cleanup actions.

## When to Use

Triggers this skill when user wants to:
- Mentions duplicate, similar, overlapping, or redundant tests.
- Before a test review or quality audit.
- User ask phrases: "find duplicates", "duplicate tests", "remove duplicates", "overlapping tests", "similar tests", "clean up tests", "deduplicate", "identify duplicates".

---

## Workflow: find duplicats cases in user project

### 1. Detect Automation and Manual Case Files

1) Identify all manual and automated test cases in the repository.

* Manual test cases include:
    - Markdown files inside `/tests/`;
    - `.feature` files (Gherkin).
* Automated tests include, like: `*.spec.ts`, `*.test.js`, `*.cy.js`, etc...

_(If needed, based on the original test framework, you may use shell commands such as: `find . -path "*/tests/*.md"`...)_

2) Parse each test to extract: title, steps, expected results, tags, and suite location.

### 2. Analyze Duplicates

Compare all extracted tests to identify potential duplicates.

1) Normalize test content before comparison:
- Convert titles to lowercase.
- Remove punctuation and formatting differences.
- Normalize step wording where possible.
- Ignore framework syntax (`describe`, `Scenario`, `it`, etc.) when analyzing intent.
- Treat parameterized values (emails, IDs, usernames) as variable data.

2) Compare tests using multiple similarity signals:
- **Title similarity**.
- **Step similarity**.
- **Expected result similarity**.
- **Preconditions or setup**.
- **Shared tags or metadata**.
- **Test location or suite context**.

3) Calculate similarity scores for test pairs using the scoring rules from  
`./references/IDENTIFY_DUPLICATE_INSTRUCTION.md`.

4) Classify duplicates according to the detection levels defined in
`./references/IDENTIFY_DUPLICATE_INSTRUCTION.md`:
- **Level 1 - Exact duplicates** — identical titles.
- **Level 2 - Semantic duplicates** — same intent, similar steps.
- **Level 3 - Overlapping / subset tests** — superset/subset relationship.
- **Level 4 - Redundant variations** — same logic, different data.

5) Build **duplicate groups** where multiple tests represent the same testing intent.

Each duplicate group should include:
- All related tests.
- Similarity score.
- Detection level.
- Proposed canonical test.

### 3. Generate Overview Report

Output a structured report with:
- Summary statistics (total scanned, duplicates found by category).
- Each duplicate group with test details and locations.
- Similarity percentage.
- Recommendation for each group (`keep`/`merge`/`remove`).
- Suggested actions.

### 4. Execute Actions

When the user approves recommendations, apply the selected action while preserving the integrity of the original tests.

- **Merge**: Combine duplicate or highly similar tests into one canonical test.
  - Preserve the original test structure used by the framework (e.g., Gherkin, Markdown, Jest, Cypress).
  - Retain the primary test ID from the canonical test.
  - Merge tags, labels, and metadata from all source tests (deduplicate where possible).
  - Preserve important assertions, steps, and expected results.
  - Add references to the original test files or IDs that were merged.

- **Remove**: Delete duplicate or redundant test files or test entries.
  - Ensure the canonical or replacement test already exists.
  - Add a reference in the canonical test noting which tests were removed.
  - Do not remove tests that contain unique steps, tags, or coverage.

- **Keep**: Keep both tests but document their relationship.
  - Add cross-reference notes between related tests.
  - Indicate the reason both tests remain (e.g., different environments, data sets, or coverage).

### Preservation Rules

When merging or rewriting tests, always preserve the original metadata and structure:
- **Test IDs** - keep the canonical ID and reference any merged IDs.
- **Tags / Labels** - retain and merge all relevant tags.
- **Framework structure** - keep the original format (e.g., `Scenario`, `describe/it`, Markdown sections).
- **File organization** - maintain the existing test directory conventions.
- **Traceability metadata** - preserve links to requirements, issues, or tickets if present.

Never rewrite tests in a way that breaks the test framework syntax or removes traceability metadata.

---

## Output Format

Follow the report template in `./references/IDENTIFY_DUPLICATE_INSTRUCTION.md` for consistent duplicate analysis output.

## References

| Description | File |
|-------------|------|
| Detection Levels & Algorithm | ./references/IDENTIFY_DUPLICATE_INSTRUCTION.md |

## Examples

**User**: 
```
I think we have duplicate tests in our suite, can you find them by find-duplicate-cases skill?
```

