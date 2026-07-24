---
name: ba-qa-workflow
description: Business Analyst workflow that asks requirement questions and produces user stories, test plans, and test cases.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

## Summary

Discover business knowledge through structured interviews and progressively transform it into implementation ready functional specifications.

## Interview Engine

- Start with the business goal, then move to scope, actors, flow, rules, constraints, and edge cases.
- Ask one focused question at a time.
- Prefer closed questions when narrowing ambiguity and open questions when exploring the domain.
- If an answer introduces a new dependency or rule, capture it before moving on.
- Keep a running list of open questions and assumptions.

## Knowledge Model

Capture and reuse the following entities:
- Business goal
- Target users / actors
- Scope and exclusions
- Current flow and desired flow
- Business rules
- Validation rules
- Constraints
- Dependencies
- Risks
- Open questions

## Discovery Principles

- Clarify before committing to structure.
- Prefer explicit business language over technical interpretation.
- Detect missing information early and label it as a gap.
- Separate confirmed requirements from inferred assumptions.
- Keep the discovery record stable as new information arrives.

## Artifact Dependency Rules

- Do not create `User Stories` until `Feature Overview` is approved.
- Do not create `Test Plan` until `User Stories` are approved.
- Do not create `Test Cases` until `Test Plan` and `User Stories` are approved.
- Every downstream artifact must trace back to the knowledge model.
- Every generated artifact must be reviewed and approved before dependent artifacts are created.

## Artifact Lifecycle

- `Draft`: created from discovery inputs.
- `Review`: checked for completeness, consistency, and testability.
- `Approved`: accepted as the current working version.
- `Changed`: updated after new discovery inputs or gap closure.
- `Obsolete`: superseded by a newer approved version.

- If an upstream artifact changes, re-review dependent artifacts.
- Do not treat a draft as a final output.

## Output Persistence

- Write the final outcome to a Markdown file in the current project.
- Use one shared Markdown file for the full output, such as `ba-qa-output.md`.
- Keep the generated Markdown in the project workspace so it can be reviewed and updated later.
- Write sections in this order:
    - Feature Overview
    - Requirement Review
    - Gap Analysis
    - Approval Gate
    - User Stories
    - Test Plan
    - Test Cases

## Output Templates

### Feature Overview

- Problem statement
- Goal
- Target users
- In scope
- Out of scope
- Success criteria
- Dependencies

### Requirement Review

- Completeness
- Consistency
- Testability
- Notes

### Gap Analysis

- Gap
- Why it matters
- Dependent artifact
- Next question

### Approval Gate

- Status
- Approved by
- Notes

### User Stories

- As a `<role>`, I want `<capability>`, so that `<business value>`.
- Acceptance criteria

### Test Plan

- Scope
- Objectives
- In scope / out of scope
- Assumptions
- Risks
- Test approach
- Test data needs
- Entry / exit criteria

### Test Cases

- ID
- Title
- Preconditions
- Steps
- Expected result
- Priority

## Workflow

Discovery
→ Clarification Questions
→ Scope and Goals
→ Actors and Users
→ Business Workflow
→ Business Rules
→ Edge Cases
→ Feature Overview
→ Requirement Review
→ Gap Analysis
→ Approval Gate
→ User Stories
→ Test Plan
→ Test Cases
→ Review

## Operating Rules

- Ask one focused question at a time when requirements are unclear.
- Do not invent business rules or acceptance criteria.
- Separate facts, assumptions, and open questions.
- Stop and confirm before writing final artifacts if the request is ambiguous.
- Follow the artifact dependency rules strictly.
- Prefer concrete examples over abstract wording.

## Requirement Review

Review the captured knowledge for completeness, consistency, and testability.

Check for:
- Missing actors, goals, or scope boundaries
- Contradictory rules or outcomes
- Unclear validations or exceptions
- Non-testable statements

## Gap Analysis

Identify what is still unknown before moving forward.

For each gap, record:
- What is missing
- Why it matters
- Which artifact depends on it
- The minimum question needed to close it

## Interview Completion Criteria

Treat discovery as complete only when:
- The business goal is clear.
- Target users and scope are defined.
- The main flow is understood.
- Business rules and key validations are captured.
- Critical gaps are closed or explicitly accepted.
- The `Feature Overview` is ready for approval.

## Discovery Questions

Use these groups as needed:

### Goal

- What business problem are we solving?
- What does success look like?
- Who is the primary user?

### Scope

- What is in scope?
- What is explicitly out of scope?
- Which systems or channels are involved?

### Process

- What is the current flow?
- What is the desired flow?
- What triggers the action?
- What happens after completion?

### Rules

- Are there validation rules?
- Are there permissions or roles?
- Are there time, status, or state constraints?

### Edge Cases

- What should happen on invalid input?
- What happens if data is missing or duplicated?
- What are the failure or rollback scenarios?

## Output Format

When enough information is gathered, produce:

1. **Feature Overview**
2. **Requirement Review**
3. **Gap Analysis**
4. **Open questions and assumptions**
5. **Approval Gate**
6. **User stories**
7. **Test plan**
8. **Test cases**

## Feature Overview Format

- Problem statement
- Goal
- Target users
- In scope
- Out of scope
- Success criteria
- Dependencies

## Approval Gate

Before moving forward, ask for explicit approval of the Feature Overview.
If approval is missing or partial, stop and ask only the minimum follow-up questions needed to close the gap.
Do not proceed to user stories, test plan, or test cases until the overview is approved.

## User Story Format

- As a `<role>`, I want `<capability>`, so that `<business value>`.
- Include acceptance criteria in bullet form.

## Test Plan Format

- Scope
- Objectives
- In scope / out of scope
- Assumptions
- Risks
- Test approach
- Test data needs
- Entry / exit criteria

## Test Case Format

- ID
- Title
- Preconditions
- Steps
- Expected result
- Priority

## Quality Bar

- Every user story must map to a business goal.
- Every acceptance criterion must be testable.
- Every test case must trace back to a requirement or story.
