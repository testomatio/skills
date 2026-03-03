# Testomat.io Markdown Test Format — Reference

This document defines the markdown format used by Test Management tools for importing/exporting test cases. All test cases MUST follow this format.

## File Structure

* Each markdown file represents a **test suite**. Tests within the file are individual test cases.
* Markdown file names use **kebab-case**: `login-flow.md`, `order-lifecycle.md`.
* Directory structure organizes suites by area/feature.

Example:

```
manual-tests/
├── e2e/
│   ├── user-onboarding/
│   │   ├── registration-flow.md
│   │   └── ...
|   |
│   └── account-management/
│       ├── profile-update.md
│       └── ...
├── api/
│   ├── auth/
│       ├── login.md
│       ├── ...
...
|
└── manual/
|   ├── regression/
|       └── full-regression.md
...
```

---

## Suite Header (Optional)

**Suite header fields:**
- `id` - unique system identificator
- `emoji` - visual identifier for the suite
- `labels` - comma-separated labels (must be existing project labels)

```md
<!-- suite
id: @S...
emoji: ...
labels: ...
-->

# ...(suite title)

...
```

---

## Test Case Format

```md
<!-- test
priority: ...
creator: ...
tags: ...
labels: ...
-->
# ...(test case title)

## Pre-conditions

...

## Steps

* ... (High-level step action derived from the automation logic)
    *Expected*: ... (Observable system behavior)

* ...
...
```

## Test Case Section Headers

Use these section headers within test cases:

| Section | Purpose | Required |
|---------|---------|----------|
| `## Summary` | High-level test overview in 1-3 sentences maximum of what the test validates | Optional |
| `## Pre-conditions` | Setup needed before test execution | Optional |
| `## Steps` | Numbered actions with expected results | Required |

## Test Case Fields

### Priority Values

| Value | Use For |
|-------|---------|
| `critical` | Must not fail - core business flows, payment, auth, main CRUD operations |
| `important` | Key user flows, authentication, authorization, primary features |
| `high` | Secondary business features, edge cases for critical flows, security-related scenarios |
| `normal` | Extended actions (help pages, export, settings, secondary features) |
| `low` | Nice-to-have - Cosmetic checks, boundary testing, minor UI interactions |

### Tags & Labels & Test IDs

* Tags use `@tag-name` format (lowercase, kebab-case), like: `@smoke`, `@regression`, `@e2e`, etc.
* Labels must be relates to the system standard labels in Testomat.io or by testing functionality: `Manual` (for all manual suggested cases), `Needs Review`, `User Flow`, etc.
* Format: `@Txxxxxxxx` (e.g., `@T123ff599`).

### Steps Format

Each step is a numbered action followed by an expected result:

```md
## Steps

* ... (High-level step action derived from the automation logic)
    *Expected*: ... (Observable system behavior: should be verifiable (not vague))

* ...
...
```
