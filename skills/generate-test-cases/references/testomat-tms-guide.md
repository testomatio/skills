---
title: Testomat.io TMS Integration Guide
description: Essential reference for generating Testomat.io-compatible test cases. Covers structure, MCP tools, conventions, and best practices.
---

# Testomat.io TMS Integration Guide

Quick reference for generating test cases compatible with Testomat.io Test Management System.

Follow this guide along with [Test Case Format](./test-case-format.md).

## Structure

```
Folder (top-level)
└── Suite (@S{id})
    └── Test (@T{id}) → has tags (e.g. @smoke), labels, priority (e.g. high)
    └── Shared Steps (reusable components)
```

## Priority values: critical, high, normal, low

## Key MCP Tools

| Purpose         | Entities / tools                                                                           |
| --------------- | ------------------------------------------------------------------------------------------ |
| **Structure**   | `suites_list`, `suites_search`, `tests_list`, `tests_search`, `steps_list`, `steps_search` |
| **Conventions** | `tags_list`, `labels_list`                                                                 |

**Key actions:**

- `tests_search` - **Always use before creating new cases** to avoid duplicates
- `steps_search` - Find reusable shared steps before writing new ones

## Use tags and labels

Add them based on context, user prompt, existing tags and labels.

Split tests by module, testing type, scope and other criteria which helps to organize and filter tests.

### When to use Tags vs Labels

| Aspect          | Tags                                   | Labels                                |
| --------------- | -------------------------------------- | ------------------------------------- |
| **Best for**    | Broad categorization                   | Specific metadata                     |
| **Use for**     | Test type (@smoke, @regression, @e2e)  | Priority, severity, status, ownership |
| **Flexibility** | Constant, embedded in code             | Flexible, easy to change via UI       |
| **Values**      | Single tag per category                | Multiple values per label allowed     |
| **Examples**    | `@smoke`, `@api`, `@auth`, `@checkout` |                                       |

**Rule of thumb:** Use tags for test categorization and automation; use labels for test metadata, workflow tracking, and manual test management.

## Deduplication Workflow

```
1. tests_search() → Find existing tests
2. Compare → Exact match? → Notify user, let user decide to skip or not
3. Partial overlap? → Ask user
4. No match? → Create new test cases
```

## Quality Checklist

- [ ] Followed template format
- [ ] Priority set
- [ ] Tags/labels added
- [ ] Clear steps
- [ ] No duplicates

## References

- [Testomat.io Docs](https://testomat.io/docs)
- [Test Case Format](./test-case-format.md) - Full Markdown format reference
