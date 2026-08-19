---
name: epic-requirements-specification
description: Use this skill when a business initiative or project must be defined, scoped, validated, and delivered as an Epic with User Stories in the tracking system.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

## Discovery

Ask one focused question at a time to collect the information required for the initiative.

Use these topics as needed. Do not ask questions that are already answered or irrelevant to the initiative.

1. Business problem
2. Business goal
3. Target users / actors
4. Scope (What is included)
5. Out of scope (What is explicitly excluded)
6. Business value
7. High-level capabilities (Functional blocks)
8. Dependencies (External blockers, team mappings)
9. Constraints (Hard boundaries: deadlines, compliance, budgets, platforms)
10. Risks (Potential threats, technical or process bottlenecks)
11. Success criteria (Measurable metrics or validation states)

Do not invent missing information.

Separate confirmed information, assumptions, and open questions.

Capture open questions and assumptions as they arise.

Reuse previously captured context. Do not ask the user to repeat confirmed information.

Do not collect implementation details, acceptance criteria, field level validation rules, or UI details. Defer them to User Stories.

## Completion Criteria

Discovery is complete when the following is documented:

- Business problem and goal
- Target users / actors
- Scope boundaries (Explicit In/Out splits)
- Business value
- High-level capabilities mapped as standalone modules
- Success criteria
- Dependencies and constraints
- Key risks
- Assumptions
- Open questions, either resolved or explicitly accepted with an assigned owner and a resolution target date

## Epic Review

Before approval, check:

- Problem and goal are clear.
- Target users are identified.
- Scope boundaries are explicit.
- Business value is clear.
- Major capabilities are identified.
- Success criteria are defined.
- Important dependencies and constraints are known.
- Critical risks are identified.
- No critical open questions remain. Any minor open questions must have an assigned owner and a resolution target date.
- The specification contains no implementation-level details.

## Output

Create the specification as a Markdown file in the project workspace.

Use the structure defined in:

`./references/requirements-structure.md`

Use this document title:

# Initiative / Epic / Project: <name>

After the shared structure, add:

## Approval

- Status: Draft | Approved | Changes Requested
- Approved by:
- Notes:

## Approval Gate

Do not treat the document as final until the user explicitly approves it.

If changes are requested:

1. Update the specification.
2. Review it again.
3. Request approval again.

After the document is approved, create the Epic (or equivalent parent entity)
in the connected tracking system using available MCP connections, if possible.
Report the created item key and link to the user.

After the Epic is created, offer to create the first User Story using the User Story Requirements Specification reference.

Reference:

`./references/user-story-requirements-specification.md`

## User Story Handoff

After approval, ask:

> The initiative is approved. Would you like to create the first User Story?

If the user agrees, use the User Story Requirements Specification reference and provide the approved specification as context.

After the approved User Story has completed its tracking system duplicate check, create the User Story in the connected tracking system under or linked to the created Epic, using native platform relationship links (`Child`, `Blocks`, `Sub-issue`), when possible. Report the created item key and link to the user.

Then offer to create the next User Story for the same initiative. If the user declines, do not create another User Story and continue to the final delivery step.

## Final Epic Delivery

When the Epic/Project and all selected User Stories are approved and created, present a final delivery summary to the user: the list of created item keys, titles, and direct links in the tracking system.

If no tracking-system MCP connection was available, use the approved specification Markdown file from the Output step and add all approved User Stories to it (or to a combined `epic-<slug>.md` / `project-<slug>.md`), retaining the structures from this skill and its User Story reference. Present the file path as the delivery summary.

Do not create tracking-system items before the Epic/Project and selected User Stories have explicit approval.