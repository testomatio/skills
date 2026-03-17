---
name: quality-review-cases
description: Perform comprehensive quality assessment of test suites. Detect automation and manual test cases, analyze each by quality criteria, and generate a detailed Quality Summary Review with health score and improvement plan.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# QUALITY-REVIEW-CASES SKILL: What I do

This skill performs a comprehensive quality assessment of test suites, providing a quantitative health score, detailed findings, and a prioritized improvement plan.

## When to Use

**Trigger this skill whenever user mentions:**
- Test quality assessment, test health check, test audit
- "How good are my tests?", "test quality review", "review test suite quality", "test audit", "test health check", or similar.
- Test case review, test case audit, analyze test quality
- Any variation of: test suite health, test quality score.

---

## Workflow: Quality Review of Test Cases

### Step 1: Detect Automation Tests

Identify automation tests in the project:
- Supported frameworks: `Playwright`, `CodeceptJS`, `Jest`, `Mocha`, `WebdriverIO`, `Cypress`, `Robot Framework`, etc.
- Detect test file like: `test/*.spec.ts`, `tests/**/*.js`, `cypress/e2e/**/*.cy.js`, etc.

> If framework is unclear, inspect repository structure, dependencies to determine the framework.

**Output:**
- List of automation test files with their paths.
- Detected framework(s) & Programming language(s).

### Step 2: Detect Manual Test Cases

Identify manual test cases in `.md` format:
- Scan for markdown files: `**/*.md` (excluding README, CHANGELOG, docs)
    - Common locations: `tests/manual/`, `test-cases/`, `docs/test-cases/`, `**/test-cases/**/*.md`, etc.
- Look for test case patterns in markdown (step-by-step format, expected results).

**Output:**
- List of manual test case files.
- Test case count per file.

### Step 3.1: Analyze Automation Tests (if their exist)

Evaluate each automation test using criteria from `./references/QUALITY_CRITERIA.md`:

**Automation Criteria (see QUALITY_CRITERIA.md):**
- Test Logic Clarity (max 3 pts).
- Code Maintainability & Structure (max 3 pts).
- Code Smells & Stability (max 2 pts).
- Assertion Quality & Coverage (max 2 pts).

**Analysis Rules:**
- Evaluate only code clarity, maintainability, stability, and assertion quality.
- Do NOT assess functional correctness or rewrite code.
- Score each criterion and calculate weighted average.
- Identify specific issues for "Top Tests For Improvements".

### Step 3.2: Analyze Manual Test Cases (if their exist)

Evaluate each manual test using criteria from `./references/QUALITY_CRITERIA.md`:

**Manual Test Criteria (see QUALITY_CRITERIA.md):**
- Title Clarity (max 2 pts).
- Steps Defined (max 2 pts).
- Expected Results (max 2 pts).
- Viability (max 2 pts).
- Unambiguity (max 2 pts).

**Analysis Rules:**
- Parse markdown structure to identify test steps and expected results.
- Score each criterion per test case.
- Calculate aggregate scores per dimension.

### Step 4: Generate Quality Report Overview

Compile all findings into a structured Quality Report using the template from `./references/REPORT_TEMPLATES.md`.

### Step 5: Present Quality Review Summary

Deliver the final Quality Review summary to the user with:
- Executive summary of test suite health.
- Key findings and critical issues.
- Prioritized improvement recommendations.
- Overall health score with star rating.

> Based on the Quality Review Summary, determine and propose concrete next actions.

**Next Steps:**
1. Improve test cases:
  * Apply fixes based on identified quality issues and recommendations.
  * Incorporate any user-provided comments or notes (if available).
  * If `improve-cases` skill is available, invoke it with:
    - The prioritized list of issues.
    - Target test cases or suites.
    - Expected improvements (e.g., coverage, readability, stability).

2. Clarify scope (if needed):
  * Ask the user for confirmation before making large-scale or breaking changes.
  * Request missing context if recommendations cannot be applied directly.

---

## Quality Scoring Methodology

See `./references/REPORT_TEMPLATES.md` for detailed scoring methodology and health rating thresholds.

---

## Error Handling

### Recoverable Issues

* **No test files found**
  - Ask user to confirm test file locations.
  - Suggest common test directory patterns.

* **Unclear test framework**
  - Inspect package.json, config files
  - Ask user to specify framework

* **Markdown parsing issues**
  - Handle non-standard markdown formats gracefully.
  - Flag unparseable tests for manual review.

### Blocking Issues

* **Empty project with no tests**
  - Report that no tests were found.

* **Insufficient access to test files**
  - Report access denied.
  - Request proper permissions.

---

## Example Outputs

### Basic Quality Review

```
User: Review quality of my test suite
Agent: Detecting test cases...
Agent: Found 45 automation tests (Playwright) and 12 manual test cases (.md)
Agent: Analyzing automation tests...
Agent: Analyzing manual test cases...
Agent: Generating Quality Report...

# Test Quality Report Overview

**Date:** 2026-03-17
**Scope:** /project/tests/*
**Key Metrics:**
    - Total test cases: 57
    - Automated: 45 (79%)
    - Manual only: 12 (21%)
**Overall Score:** 7.2 / 10.0 ⭐⭐⭐⭐

[Full report presented]
```

### Mixed Test Suite Review

```
User: Audit my e2e tests quality
Agent: Scanning for test files...
Agent: Found Playwright (32 tests), Manual .md (28 cases)
Agent: Analyzing...

Quality Review Complete:
- Automation Tests: 7.5/10 (Good)
- Manual Tests: 6.8/10 (Fair)
- Overall: 7.2/10 ⭐⭐⭐⭐

Top Improvements:
1. Add expected results to 8 manual tests
2. Reduce hardcoded waits in 5 automation tests
3. Standardize test naming convention
```

---

## References

| Description | File |
|-------------|------|
| Quality Criteria Definitions | ./references/QUALITY_CRITERIA.md |
| Report Templates & Scoring Methodology | ./references/REPORT_TEMPLATES.md |
