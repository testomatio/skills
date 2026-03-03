---
name: suggest-cases
description: Analyze existing test suites and project structure to identify coverage gaps. Generate new test cases in Test Management Tool markdown format to fill identified gaps.
---

## SUGGEST-CASES SKILL: What I do

Analyze project to find gaps in test coverage and generate new manual test cases in Test Management Tool Markdown format.

**What I analyze:**
- Existing manual test files in the project.
- Automated test files (spec, test, cy files, etc) for context.
- Project structure and source code for uncovered paths.

**What I generate:**
- New test cases addressing identified gaps
- Tag suggested tests with `@suggested` for easy filtering

If any unclear state => ask user to clarify what they want!

---

## Error Handling

### Recoverable Situations

Attempt recovery before failing when:
- No test files found in common locations => ask user to specify test directory path.
- No readable test content found => ask user to clarify location.

### Hard Fail (STOP immediately)

Stop execution and return a clear human-readable error if:
- Cannot analyze project structure after clarification.
- No test files or source code found to analyze after clarification.

**Do not retry automatically**.
**Do NOT continue after system-level failure**.
**Return a clear human-readable error message describing the actual failure**.

---

## Precondition: Finding Test Files

Analyze the project folder to find existing tests:
1. Look for markdown test files to define existing test files: `tests`, `test`, `manual-tests`, `manual`, `qa`, `spec`, etc.
2. Look for automated test files: `*.spec.ts`, `*.test.ts`, `*.cy.js`, `*.spec.js`, `*.test.js`, etc.
3. Look for source code to understand untested paths.

Build a mental map of what is tested and what is missing.

---

## Suggest-Cases Actions: What I execute

### 1. Identify Coverage Gaps

For each tested feature, check for missing:

**Missing test types:**
- No negative tests (only happy path).
- No boundary value tests.
- No error handling tests (API down, timeout, network error).
- No security tests (injection, unauthorized access).
- No empty states (no data, first-time user).
- No maximum capacity tests (max items, max file size).
- No data format variations (unicode, special characters).
- No state recovery (session expiry, back button).

### 2. Generate Suggested Test Cases

Use template from `./templates/TESTOMAT_MARKDOWN_FORMAT.md`

Generate test cases in Markdown format grouped by gap type:
- Identify feature name.
- Create or reuse suite.
- Generate structured test case.
- Follow the template structure exactly.

**Tag suggested tests with `@suggested` for easy filtering.**

### 3. New ID Handling

Generate local IDs (do NOT guess server IDs):
- For tests: `@Tsk` + 6 unique characters (e.g., `@Tsk7c7a92`).
- For suites: `@Ssk` + 6 unique characters (e.g., `@Ssk9af210`).

Ensure uniqueness within project.

### 4. Prioritize Suggestions

Rank by:
1. **Critical gaps** - missing negative tests for security-sensitive features.
2. **High-value gaps** - missing boundary tests for core business logic.
3. **Medium-value gaps** - missing edge cases, error handling.
4. **Nice-to-have** - accessibility, performance.

---

## Output Format

Provide:
1. **Gap summary** - what types of tests are missing.
2. **Suggested test cases** - complete tests in Test Management Tool Markdown format.
3. **Priority** - which suggestions to implement first.

---

## Example Real Usage

**Analyze project and suggest missing tests:**
```
Use suggest-cases to find gaps in test coverage
```

**Suggest tests for specific area:**
```
Use suggest-cases to suggest tests for login functionality
```

**Expand coverage:**
```
Use suggest-cases to expand test coverage for cases from the "/manual-test" folder only
```
