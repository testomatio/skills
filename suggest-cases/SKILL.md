---
name: suggest-cases
description: Analyze existing test suites  and suggest new test cases to improve coverage. Identify gaps in edge cases, negative scenarios, boundary values, error handling, accessibility, and performance. Generates ready-to-use test cases in Test Management system markdown format. Triggers include "suggest tests", "suggest cases", "what else should I test", "expand coverage", "missing tests", "gap analysis", "more test cases".
inputs:
  reqDir:
    description: "Directory containing requirements (default: requirements)"
    required: false
  testDir:
    description: "Directory containing manual tests (default: manual-tests)"
    required: false
---

# TASK: What I do

Analyze existing test suites, test cases and proactively suggest new test cases that fill coverage gaps and can be use in Test Management Tool in Markdown format:
* Analyze existing test suites, test cases or project requirements.
* Detect coverage gaps.
* Suggest new manual test cases.
* Improve and normalize existing tests.
* Convert automation tests into manual test format.
* Organize tests into suites.
* Apply consistent test projectstructure:
- generate safe local test_ids (with prefix `@Tsk`).
- generate safe local suite_ids (with prefix `@Ssk`).
- reuse existing labels and tags logically.
(Focus on edge cases, negative scenarios, boundary conditions, error handling, security, and cross-cutting concerns)

## When to Use

- User asks "what else should I test?".
- User wants to expand test coverage.
- User wants AI to identify blind spots in their test suite.
- User mentions "suggest", "more tests", "gaps", "missing coverage", "improve test description",

---

## Error Handling

Fail immediately and **STOP** execution on any error:

* NO existing suite/test in markdown format 
* Can't understand the requirements by project structure
* Test directory does not exist  
* No readable files found  
* Invalid action parameter  
* Markdown structure cannot be generated

**Do not retry automatically**.
**Do NOT continue after failure**.
**Return a clear human-readable error message describing the actual failure**.

---

## Directory Resolution

Determine:
* `reqDir` => default: `requirements`  TODO: should we have the requirement folder??? or only based on the existing one?
* `testDir` => default: `manual-tests`
- If you can't find the tests in `testDir`, `reqDir` with needed information or they don't exist, ask the user: `Where are the manual tests for analysis?`.
-- If the user can't give an answer => stop execution with an appropriate error.

---

## Approach

### 1. Read Existing Tests

Read all test cases in the project:

```bash
# Find markdown test files
find . -name "*.md" -path "*/tests/*" -o -name "*.md" -path "*/manual-cases/*"

# Also check automated test files for context
find . -name "*.spec.ts" -o -name "*.test.ts" -o -name "*.cy.js"
```

Read requirements in the project (if exists):

```bash
# Find markdown requirements files TODO: if need???
find . -name "*.md" -path "*/requirements/*"

```

Build a mental map of:
- What features are tested.
- What missing or untested.
- What types of tests exist (happy path, negative, boundary, etc.).
- What areas have dense coverage vs. sparse coverage.

### 2. Identify Coverage Gaps

For each tested feature, check for missing:

**Missing test types:**
- ❌ No negative tests (only happy path)
- ❌ No boundary value tests
- ❌ No error handling tests (API down, timeout, network error)
- ❌ No concurrent/race condition tests
- ❌ No security tests (injection, unauthorized access, CSRF)
- ❌ No accessibility tests
- ❌ No performance-related tests (large data, slow network)

**Missing scenarios:**
- ❌ Empty states (no data, first-time user)
- ❌ Maximum capacity (max items in cart, max file size, max users)
- ❌ Data format variations (unicode, special characters, very long strings)
- ❌ State recovery (browser refresh, session expiry, back button)
- ❌ Multi-user scenarios (two users editing same resource)
- ❌ Timezone and locale variations

**Missing feature areas:**
- Compare tested features vs. application sitemap/routes
- Check if all CRUD operations are tested for each resource
- Verify all user roles are tested
- Check all integration points (third-party APIs, webhooks)

### 3. Also Read Source Code

If source code is available, analyze it for untested paths:

- Read route definitions to find untested endpoints
- Read validation logic to identify untested validation rules
- Read error handlers to find untested error paths
- Read feature flags to find untested feature combinations

### 4. Generate Suggested Test Cases

Load and use the template file: `templates/suggested-test-cases.md`

Generate test cases in Markdown format grouped by gap type.

Requirements:
* Identify feature name.
* Create or reuse suite.
* Generate structured test case.
* Follow the template structure exactly.
* Preserve the suite metadata comment block.
* Assign logical tags and labels.
* Do not modify formatting.
* Output valid Markdown.

> Tag suggested tests with `@suggested` for easy filtering and review in Testomat.io.

Example:
<!-- test
priority: high
tags: @suggested, @negative
-->

### 5. New ID Handling Policy

If you suggest, create a new test case, you should suggest suite/test id based on this rules:
* Do NOT guess server IDs  
* Generate local IDs:
- For tests: `@Tsk` + 6 unique characters  
Example: `@Tsk7c7a92` 
- For suites: `@Ssk` + 6 unique characters  
Example: `@Ssk9af210`

> Ensure uniqueness within project.

### 6. Prioritize Suggestions

Rank suggestions by:

1. **Critical gaps** - missing negative tests for security-sensitive features
2. **High-value gaps** - missing boundary tests for core business logic
3. **Medium-value gaps** - missing edge cases, concurrency, error handling
4. **Nice-to-have** - accessibility, performance, cross-browser, locale

### 7. Output Format

Provide:
1. **Gap summary** - what types of tests are missing and where
2. **Suggested test cases** - complete tests in Test Management Tool Markdown format
3. **Priority** - which suggestions to implement first
4. **Estimated effort** - how many tests to add per area

## Example Real Usage

* Check user/system requirements and generate a new manual test cases ".md" files to cover feature gaps:

```text
Use suggest-cases to analyze project and suggest a new tests`
```

* Fill suite/requirement gaps:

```text
Use suggest-cases to fill gaps in suite="Login page"`
```
---