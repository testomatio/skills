---
name: requirements-specification
description: Business Analyst workflow that discovers requirements and produces implementation-ready functional specifications.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

## When to Use

Use this skill when a feature, product, or business process needs clear and complete requirements before implementation. It helps discover missing information, clarify ambiguities, document business rules, and produce a structured requirements specification ready for review and approval.

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

- Do not create `Feature Overview` until sufficient discovery is complete.
- Every generated artifact must trace back to the knowledge model.
- Every generated artifact must be reviewed and approved before it becomes the current working version.

## Artifact Lifecycle

- `Draft`: created from discovery inputs.
- `Review`: checked for completeness and consistency.
- `Approved`: accepted as the current working version.
- `Changed`: updated after new discovery inputs or gap closure.
- `Obsolete`: superseded by a newer approved version.

- If an artifact changes, re-review it before approval.
- Do not treat a draft as a final output.

## Output Persistence

- Keep the generated Markdown in the project workspace so it can be reviewed and updated later.
- Write sections in this order:
  - Feature Overview
  - Requirement Review
  - Gap Analysis
  - Open Questions and Assumptions
  - Approval Gate
- The final deliverable **must** be generated as a Markdown (`.md`) file in the current project.

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
- Notes

### Gap Analysis

- Gap
- Why it matters
- Next question

### Open Questions and Assumptions

- Open questions
- Confirmed assumptions

### Approval Gate

- Status
- Approved by
- Notes

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
→ Review

## Operating Rules

- Ask one focused question at a time when requirements are unclear.
- Do not invent business rules.
- Separate facts, assumptions, and open questions.
- Stop and confirm before writing final artifacts if the request is ambiguous.
- Follow the artifact dependency rules strictly.
- Prefer concrete examples over abstract wording.

## Requirement Review

Review the captured knowledge for:

- Completeness
- Consistency
- Clarity

Check for:

- Missing actors, goals, or scope boundaries
- Contradictory rules or outcomes
- Unclear validations or exceptions

## Gap Analysis

Identify what is still unknown before moving forward.

For each gap, record:

- What is missing
- Why it matters
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

Use these groups as needed.

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
4. **Open Questions and Assumptions**
5. **Approval Gate**

## Feature Overview Format

- Problem statement
- Goal
- Target users
- In scope
- Out of scope
- Success criteria
- Dependencies

## Approval Gate

Before finishing, ask for explicit approval of the Feature Overview.

If approval is missing or partial, stop and ask only the minimum follow-up questions needed to close the gap.

## Quality Bar

- Every requirement must map to a business goal.
- Business rules must be explicit.
- Scope boundaries must be clearly defined.
- Assumptions must never be presented as facts.
