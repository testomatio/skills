# Duplicate Detection Guide

Quick reference for identifying and scoring duplicate test cases.

## Detection Levels

| Level | Type | Description | Example |
|-------|------|-------------|---------|
| 1 | Exact Duplicates | Identical titles | "Verify login" appears in 3 files |
| 2 | Semantic Duplicates | Same intent, similar steps | "Check user can sign in" vs "Validate user authentication" |
| 3 | Overlapping / Subset | One test contains another | Cart test (3 steps) inside Checkout test (8 steps) |
| 4 | Redundant Variations | Same logic, different data | Login with john@example.com vs jane@example.com |

## Similarity Scoring

Compare test pairs on: **Title** -> **Steps** -> **Expected results** -> **Preconditions** -> **Tags**

| Score | Category |
|-------|----------|
| 100% | Exact duplicate |
| 80-99% | Semantic duplicate |
| 50-79% | Overlapping |
| <50% | Different tests |

## Report Template

```markdown
# Duplicate Analysis Report

**Scanned:** {N} tests across {M} files
**Duplicates found:** {X} tests in {Y} groups

## Summary
- Exact: {N} groups | Semantic: {N} groups | Overlapping: {N} groups | Variations: {N}

## Group {N}: {Type} — {Test Name}

**Tests:**
- `{file}` -> "{title}" ({id})
- `{file}` -> "{title}" ({id})

**Similarity:** {X}%
**Recommendation:** {Keep / Merge / Remove}
```

## Actions

| Action | When to Use |
|--------|-------------|
| **Merge** | Tests duplicate the same intent — combine into one canonical test |
| **Remove** | One test is redundant — keep the more complete one |
| **Keep** | Tests serve different purposes (different environments, data, coverage) |

## Manual & Automated

Handles both:
- **Manual**: `*.md` in `/tests/`, `*.feature` files
- **Automated**: `*.spec.ts`, `*.test.js`, `*.cy.js`, etc.

For automated tests, also consider code-level duplicates in assertions and shared setup/teardown.
