---
name: requirements-traceability-matrix
description: >-
  Builds a requirements traceability matrix (RTM): maps requirements (and their acceptance criteria) to the test cases that verify them, or test cases back to requirements.
  Shows which requirements, acceptance criteria are covered, partially covered, or not covered, which tests trace to no requirement (orphan tests).
  Use when asked for an RTM, traceability matrix, requirements coverage or test coverage of requirements, untested requirements or acceptance criteria, orphan tests, or to check whether test cases cover an issue,ticket, story, epic, or spec.
metadata:
  author: Testomat.io
  version: 0.0.1
---

# Requirements Traceability Matrix

Maps each requirement to the test cases that verify it, and each test case back to its requirements.
Input: the requirements and test cases the user points to.
Output: one markdown file (path given by the user, defined by context or `traceability-matrix.md` by default).

Build `forward` traceability matrix by default (requirements to test cases). But if user asks for a `backward` or `bidirectional` matrix, do it.

## What is a requirement

`Requirement` is anything describing a capability, feature, change, etc. It may be a requirement, acceptance criteria, user story, epic, spec or other artifact.

The most atomic entity with identifier is used (until user asks for a different level of granularity).
E.g. if user story contains ACs without identifiers, use the story as the requirement. If ACs have identifiers, use the ACs as the requirement.
If amount of low level entities is too high, decide based on context or ask user.

## Flow

1. Make sure required artifacts exist:
  a. requirements
  b. test cases

2. Requirements should be "good enough"

  If requirements do not satisfy the "good enough" criteria (atomic, clear, complete, consistent, testable), suggest user to work on them first. E.g. user `write-user-story` skill.

3. Identifiers should be unique and consistent

  Each requirement and test case should have a unique identifier. Make sure they: exist, are unique. If not – suggest/ask user to create/update them first.

4. Build the matrix

## Rows

- **One row per requirement** (What is a requirement). Its ACs without identifiers stay inside that row.
- Keep values, limits, roles, and messages as the source states them.
- Requirements not to be built (Won't Do, Duplicate, future phase, out of scope) → no rows; list them under Excluded.

## Evidence rule

A test covers a requirement only when **its expected results check the requirement's outcome under its conditions**: every AC, condition, and value it states. Automated tests: the assertions, not the test name.

Not coverage:

- Same feature, similar title, or matching tag only.
- The requirement's action appears in the steps, but no expected result checks its outcome.
- A positive test for a negative requirement or AC (cannot, error, limit exceeded, no access), or the reverse.
- The behavior used as setup or a precondition of another test.

Partial:

- Some of its ACs are not checked.
- The outcome is checked, but not every condition (role, plan, state, platform).
- Another value or limit: the requirement says up to 5 cards, the test saves 3 and never tries the 6th.
- Vague expected result ("works correctly", "is displayed") where the requirement states a message or value.

Several tests may cover one requirement together: Covered when together they check every AC, condition, and value. One test may cover several requirements.

## Verdicts

| Verdict     | Requirement                                                                                         |
| ----------- | --------------------------------------------------------------------------------------------------- |
| Covered     | Tests check every AC, condition, and value                                                          |
| Partial     | Some ACs, conditions, or values are not checked; the note names them                                |
| Not covered | No test checks it                                                                                   |
| Unclear     | Not good enough to check (Flow › 2) and the user chose to go on; the note says what is missing      |

## Backward

`backward` and `bidirectional` only.

- One row per test case: the requirements it covers, fully or partially, by the evidence rule.
- Orphan test: covers no requirement in scope. List it; it may verify a requirement outside the scope, so never call it useless.

## IDs

Requirement and test case IDs as the sources give them: issue key, AC key, `@T` ID. **Never invent an ID.**

## Output

- Forward: Requirements → test cases.
- Backward: Test cases → requirements, Orphan tests.
- Bidirectional: both.
- Omit empty Gaps subsections.

```markdown
# Traceability matrix: {scope}

Direction: {forward | backward | bidirectional}. Requirements: {source, scope}. Test cases: {source, scope}. Date: {date}.

## Summary

| Verdict     | Requirements |
| ----------- | ------------ |
| Covered     |              |
| Partial     |              |
| Not covered |              |
| Unclear     |              |

Test cases: {n} in scope, {n} orphan.

## Gaps

### Not covered
- {requirement ID}: {title}

### Partial
- {requirement ID}: {title}. Not checked: {ACs, conditions, values}. Tests: {test IDs}

### Unclear
- {requirement ID}: {title}. Missing: {what}

### Orphan tests
- {test ID}: {title}

## Requirements → test cases

| Requirement | Verdict | Test cases | Note |
| ----------- | ------- | ---------- | ---- |

## Test cases → requirements

| Test case | Requirements | Note |
| --------- | ------------ | ---- |

## Excluded
- {requirement ID}: {reason}
```

## Check

- [ ] Every requirement in scope has a row or is under Excluded
- [ ] Backward, bidirectional: every test case in scope has a row
- [ ] Summary counts match the matrix

## Next actions

- Not covered and Partial requirements → `qa-write-test-cases`
- Vague expected results → `improve-test-cases`
- Unclear requirements → `write-user-story`
