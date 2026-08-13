# User Story Requirements Specification

## When to Use

Use this reference after an Epic is approved, and a high-level capability needs to be defined as an implementation ready User Story.

## Inputs

- An approved Epic
- A selected high-level capability from that Epic

If an approved Epic is unavailable, ask for it before starting. Do not invent Epic context, business goals, or scope.

## User Story Requirements

Every User Story should contain:

- Parent Epic
- Title
- User Story statement
- Business value
- In scope
- Out of scope
- Actors and permissions
- Preconditions
- Trigger
- Main flow
- Alternative flows and error handling
- Business rules
- Validation rules
- Acceptance criteria
- Dependencies
- Constraints
- Risks
- Open questions
- Assumptions

## Discovery

Ask one focused question at a time.

Reuse confirmed information from the approved Epic. Use the following topics as needed. Do not ask questions that are already answered or irrelevant to the User Story:

1. Selected capability and user outcome
2. Primary actor and permissions
3. Trigger and preconditions
4. Main flow
5. Business rules
6. Validation rules
7. Alternative flows and errors
8. Dependencies and constraints
9. Risks
10. Acceptance criteria

Capture open questions and assumptions as they arise.

Do not introduce implementation details unless they are necessary to make a business rule or acceptance criterion testable.

## Completion Criteria

Discovery is complete when:

- The story maps to the approved Epic and one of its capabilities.
- The user, desired outcome, and business value are clear.
- The main flow, permissions, business rules, and key validations are known.
- Acceptance criteria cover the expected behavior and important failures.
- Critical dependencies, constraints, risks, and open questions are resolved or explicitly accepted with an assigned owner and a resolution target date.

## Story Review

Before approval, check:

- The story contributes to the Epic goal.
- Scope is small enough to implement independently.
- The story statement describes a user outcome, not a technical solution.
- Business and validation rules are explicit and internally consistent.
- Acceptance criteria are clear, testable, and cover the main flow and key negative cases.
- No critical open questions remain. Any minor open questions must have an assigned owner and a resolution target date.

## Output

Create the User Story as a Markdown file in the project workspace.

Name the file using `user-story-<slug>.md`, for example `user-story-create-draft.md`.

Use this structure:

# User Story / Task / Issue: <name>

## Parent Epic

## User Story

As a <actor>, I want <capability>, so that <business value>.

## Business Value

## In Scope

## Out of Scope

## Actors and Permissions

## Preconditions

## Trigger

## Main Flow

## Alternative Flows and Error Handling

## Business Rules

## Validation Rules

## Acceptance Criteria

Use Given / When / Then format.

## Dependencies

## Constraints

## Risks

## Open Questions

## Assumptions

## Approval

- Status: Draft | Approved | Changes Requested
- Approved by:
- Notes:

## Approval Gate

Do not treat the User Story as final until the user explicitly approves it.

If changes are requested:

1. Update the User Story.
2. Review it again.
3. Request approval again.

## Tracking System Duplicate Check

After the User Story is approved, analyze its title, user outcome, scope, business rules, and acceptance criteria. Use available MCP connections to search connected tracking systems for existing User Stories with the same or substantially overlapping functionality.

If similar User Stories are found, present the matching items with their key, title, status, and a concise explanation of the overlap. Ask the user to choose one option:

1. Use an existing User Story.
2. Create the approved User Story as a new item.

Do not create a new tracking item or replace the approved User Story with an existing one without the user's explicit choice.

If no similar User Story is found, state that the duplicate check found no matches and proceed with the approved User Story.

If no tracking system MCP connection is available, state that the duplicate check could not be performed and ask whether to proceed with the approved User Story.

## Tracking System Creation

After the duplicate check is resolved and the approved User Story is selected, create the User Story in the connected tracking system under or linked to the parent entity created at approval, using its reported key and native platform relationship links (`Child`, `Blocks`, `Sub-issue`), when possible. Report the created item key and link to the user.

If no tracking-system MCP connection is available, state that the User Story will be delivered as Markdown in the final delivery step.

## Next Story Handoff

After the tracking-system duplicate check is resolved, ask:

> The User Story is approved. Would you like to create the next User Story for the same Epic?

If the user agrees, use the approved Epic as context and begin discovery for one new User Story. If the user declines, do not create another User Story and continue to the final delivery step in the Epic skill.

