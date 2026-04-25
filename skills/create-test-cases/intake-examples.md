# Intake Questionnaire — Example Filled Intakes

Reference examples for [intake-questionnaire.md](intake-questionnaire.md) Part 3 template.

---

## Example A — Minimal (all defaults)

User argument: `"покрити labels"`
User answered: `"use defaults"`

```markdown
# Intake: labels

**Date:** 2026-04-10

## Answers

| # | Question | Answer |
|---|----------|--------|
| Q1 | Feature / scope | labels (from argument) |
| Q1.1 | Feature location | Settings → Labels & Fields |
| Q1.2 | Sub-feature hint (optional) | pick after map |
| Q2 | Coverage depth | balanced |
| Q3 | Sources | UI only |
| Q4 | Special focus | none |

## Defaults applied
All questions (user said "use defaults"). Step 1 will produce the sub-feature map; user picks `S` from it before Step 2.
```

---

## Example B — Full interview

User argument: `"cover the new label-filter feature"`

```markdown
# Intake: label-filter

**Date:** 2026-04-10

## Answers

| # | Question | Answer |
|---|----------|--------|
| Q1 | Feature / scope | new label-filter in tests list |
| Q1.1 | Feature location | Tests page → top filter bar (next to Tags filter) |
| Q1.2 | Sub-feature hint (optional) | label-filter (verified against Step 1 map before Step 2) |
| Q2 | Coverage depth | balanced |
| Q3 | Sources | https://github.com/testomatio/docs/pull/412, https://figma.com/file/abc123/label-filter |
| Q4 | Special focus | validation, edge cases |

## Defaults applied
none
```
