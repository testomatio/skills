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

By default build the `forward` matrix (requirements to test cases) and the orphan tests list. (The same for `bidirectional`: it shows gaps in both directions.) Build a `backward` matrix (test cases to requirements) only when the user asks for it.

## What is a requirement

`Requirement` is anything describing a capability, feature, change, etc. It may be a requirement, acceptance criteria, user story, epic, spec or other artifact.

The most atomic entity with identifier is used (until user asks for a different level of granularity).
E.g. if user story contains ACs without identifiers, use the story as the requirement. If ACs have unique identifiers, use the ACs as the requirements.
If number of low level entities is too high, decide based on context or ask user.

## Flow

1. Make sure required artifacts exist:
  a. requirements
  b. test cases

2. Requirements should be "good enough"

  If requirements do not satisfy the "good enough" criteria (atomic, clear, complete, consistent, testable), suggest user to work on them first. E.g. user `write-user-story` skill.

1. Identifiers should be unique

  Each requirement and each test case should have a unique identifier. Make sure they: exist, are unique. If not – suggest/ask user to create/update them first.

4. Build the matrix

## Matrix

- Requirement: the unit from "What is a requirement" section
- **One row per requirement–test case pair.** Merge cells which cover the same requirement/test case pair.
- Coverage: the requirement's verdict (Verdicts).
- No pair: `—` in the missing ID cell.

### Forward

Requirements → test cases. Every requirement.

| Req ID | Req Description                    | Coverage    | TC ID | TC Title                         |
| ------ | ---------------------------------- | ----------- | ----- | -------------------------------- |
| REQ-1  | Login to the app                   | Covered     | TC-1  | Login with valid credentials     |
|        |                                    |             | TC-2  | Login with wrong password        |
| REQ-2  | Reset password                     | Not covered | —     |                                  |
| REQ-3  | Lock account after 5 failed logins | Partial     | TC-4  | Lock account after failed logins |

### Orphan tests

Test cases that cover no requirement. (It may verify a requirement outside the scope, so don't call it useless.)

| TC ID | TC Title      |
| ----- | ------------- |
| TC-9  | Change avatar |

### Backward

On request only, instead of the forward matrix. Test cases → requirements. Every test case; orphan tests with `—`, no separate list.

| TC ID | TC Title                     | Req ID | Req Description  |
| ----- | ---------------------------- | ------ | ---------------- |
| TC-1  | Login with valid credentials | REQ-1  | Login to the app |
| TC-3  | Login, then log out          | REQ-1  | Login to the app |
|       |                              | REQ-4  | Log out          |
| TC-9  | Change avatar                | —      |                  |

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

| Verdict     | Requirement                                                                                    |
| ----------- | ---------------------------------------------------------------------------------------------- |
| Covered     | Tests check every AC, condition, and value                                                     |
| Partial     | Some ACs, conditions, or values are not checked; the note names them                           |
| Not covered | No test checks it                                                                              |
| Unclear     | Not good enough to check (Flow › 2) and the user chose to go on; the note says what is missing |

## IDs

Requirement and test case IDs as the sources give them: issue key, AC key, `@T` ID. **Never invent an ID.**

## Output

Omit empty Gaps subsections.

```markdown
# Traceability matrix: {scope}

Requirements: {source, scope}. Test cases: {source, scope}. Date: {date}.

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

## Matrix

{forward or backward table}

## Orphan tests

{orphan tests table (only for forward matrix)}

## Excluded
- {requirement ID}: {reason}
```

## Check

- [ ] Forward: every requirement has a row or is under Excluded
- [ ] Forward: every test case is in the matrix or under Orphan tests
- [ ] Backward: every test case has a row
- [ ] Summary counts match the matrix

## Next actions

- Not covered and Partial requirements → `qa-write-test-cases`
- Vague expected results → `improve-test-cases`
- Unclear requirements → `write-user-story`
