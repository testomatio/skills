# Test Data Management

## Core Principles

- Test data must support the test scenario, not define it.
- Keep test data minimal, relevant, and easy to understand.
- Ensure tests remain independent and do not rely on shared mutable data.
- Prefer clarity over reusability when in conflict.

## Data Placement Strategy

When deciding where to store test data:
1. If data is used only within a single test => Keep it simple or inline within that test.
2. If data is reused across multiple tests => Extract it into a shared test-data.
3. If data is large, structured, or tabular => Store it in external files (e.g., JSON, CSV).
  - LOAD data from external file.
  - ITERATE over dataset in tests.
4. If data depends on environment (URLs, credentials, configs) => Use environment variables or configuration files.
  - READ baseUrl from environment.
  - USE baseUrl in test.

**Priority:** Start local - Extract only when reuse is clear.

## Data Structure Guidelines

- Use clear, descriptive names for all data variables.
- Keep data structures simple and predictable.
- Avoid deeply nested or overly complex data unless required.
- Group related data logically (e.g., user profiles, product sets).

## Test Isolation Rules

- Each test must be fully independent.
- Tests must not share mutable data or state.
- Avoid dependencies between tests.
- Prefer framework-provided isolation over manual resource handling.

## Reusability Guidelines

- Reuse test data only when it reduces duplication and improves clarity.
- Do not over-centralize data if it makes tests harder to read.
- Keep frequently used data in shared modules.
- Keep unique or scenario-specific data close to the test.

## Anti-Patterns to Avoid

- Hardcoding credentials or secrets in test files.
- Using real user or production data.
- Sharing state between tests.
- Creating test data without cleanup.
- Over-engineering data structures for simple scenarios.

