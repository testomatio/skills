---
name: test-consolidation
description: Detect redundant tests, duplicated test logic, semantic overlaps, and parameterization opportunities across the entire test suite. Present recommendations and request user approval before refactoring.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

## Objective

Analyze the entire test suite and continuously identify opportunities to reduce duplication, consolidate similar tests, and extract reusable test logic.

The goal is to minimize maintenance cost while preserving test coverage and business validation.

This analysis must be language-agnostic and framework-agnostic.

---

## Core Principle

Prioritize behavioral similarity over code similarity.

Two tests should be considered related when they validate the same business behavior, even if they:

* Use different programming languages.
* Use different testing frameworks.
* Have different structures.
* Use different variable names.
* Use different helper functions.
* Execute steps in slightly different ways.

Focus on intent, behavior, and expected outcomes.

---

## Test Analysis Model

For each test, identify:

### Preconditions (Given)

What state, data, permissions, configuration, or setup is required?

### Actions (When)

What behavior is being exercised?

### Expected Outcome (Then)

What business result is being validated?

Compare tests using these behavioral components rather than source code structure.

---

## Detection Rules

### Duplicate Tests

Identify tests that validate the same behavior and business rule.

Examples:

* Same scenario implemented multiple times.
* Same assertions with different naming.
* Same workflow with minor variations.

Group these tests together and recommend consolidation.

---

### Semantic Duplicates

Identify tests that appear different but validate the same outcome.

Examples:

* Different APIs validating the same rule.
* Different user flows leading to the same business validation.
* Different implementations of the same scenario.

Prioritize business intent over implementation details.

---

### Duplicate Test Logic

Identify reusable patterns across tests, including:

* Setup logic
* Data preparation
* Mock configuration
* Action execution
* Assertions
* Cleanup logic

Recommend extraction into reusable components.

---

### Parameterization Opportunities

Identify tests that differ only by:

* Input values
* Expected values
* Configuration values
* User roles
* Data combinations

Recommend conversion into parameterized or data-driven tests.

---

### Business Rule Overlap

Identify situations where multiple tests validate the same requirement.

Examples:

* Authorization rules
* Validation rules
* State transitions
* Error handling behavior

Recommend consolidation where coverage would remain unchanged.

---

## User Approval Requirement

Before modifying, consolidating, deleting, parameterizing, or extracting any test logic, present a summary of findings to the user.

The summary should include:

* Finding type
* Affected tests
* Confidence level
* Proposed changes
* Expected maintenance benefits
* Potential risks

After presenting the findings, explicitly ask the user whether the proposed changes should be applied.

Example:

The following tests appear to be duplicates:

* testCreateUser
* testCreateRegularUser

Confidence: High (96%)

Recommended action:

* Merge into a single parameterized test.
* Remove redundant implementation.

Expected impact:

* Reduced maintenance effort.
* No expected coverage loss.

Would you like me to apply this refactoring?

Do not modify tests until the user explicitly approves the proposed changes.

--- 

## Refactoring Strategy

When opportunities are found:

1. Consolidate duplicate tests.
2. Extract reusable logic.
3. Introduce parameterization where appropriate.
4. Remove redundant coverage.
5. Preserve readability and maintainability.

Never remove coverage for unique business behavior.

---

## Iterative Analysis Requirement

Do not stop after the first refactoring opportunity.

After each consolidation:

1. Re-analyze the modified test suite.
2. Search for newly exposed duplication.
3. Search for additional extraction opportunities.
4. Search for newly parameterizable scenarios.

Repeat until no further consolidation opportunities with confidence greater than 80% remain.

---

## Output Requirements

For every finding provide:

### Type

* Duplicate Test
* Semantic Duplicate
* Duplicate Logic
* Parameterization Opportunity
* Business Rule Overlap

### Confidence

* High
* Medium
* Low

### Evidence

Include:

* Test names
* Locations
* Shared behavior
* Shared business rule

### Recommendation

Describe:

* What should be merged
* What should be extracted
* What should be parameterized
* Expected maintenance reduction

---

## Success Criteria

The task is complete only when:

* No significant duplicate tests remain.
* No significant duplicated test logic remains.
* No obvious parameterization opportunities remain.
* No overlapping business-rule validations remain.
* Further consolidation would risk losing meaningful coverage.

Continue identifying consolidation opportunities until the test suite reaches this state.

Apply approved changes after user confirmation and re-analyze the updated test suite.
