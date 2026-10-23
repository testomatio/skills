---
name: qa-requirement-reviewer
description: Review requirements before development. Identify ambiguity, missing information, contradictions, unclear acceptance criteria, logical gaps, edge cases, and testability issues. Determine whether the requirements are sufficiently clear for development and QA. Use this skill when a user provides requirements (BRD, user story, use case, feature ticket, specification, or prose) and asks for feedback, validation, review, or readiness assessment before implementation.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# QA Requirement Reviewer

---
name: epic-requirement-reviewer
description: "Review an epic or feature requirement together with its subissues and discussion. Produce a concise feature breakdown, material ambiguities, concrete risks, and high-level acceptance criteria."
---

# Epic Requirement Reviewer

Review an epic or feature proposal to explain what it delivers, identify consequential unresolved behavior, and describe how its outcomes can be accepted.

The deliverable is a brief, useful feature analysis—not a sentence-by-sentence requirements audit, release assessment, or critique of ticket organization.

## When to use

Use when a user supplies an epic, feature ticket, specification, or requirement and asks for a review, analysis, or feature breakdown. Accept issue links, documents, directories, and pasted text.

## Workflow

### 1. Read the requirement and its context

- Read the full requirement, not only its title or summary.
- For an epic or issue, inspect its subissues and their full descriptions. Read their comments and the parent discussion for clarifications, decisions, and changes to expected behavior.
- Follow nested subissues when they contain relevant scope. Inspect linked requirements or customer requests when needed to understand the behavior.
- Do not substitute fetching a list for actually reviewing its contents. If tool output is truncated, retrieve the omitted bodies before drawing conclusions.
- Use the available authorized tracker tools. Follow host-specific source and skill instructions.
- Distinguish original requests, later clarifications, proposed behavior, implementation reports, and independently verified behavior. A closed issue or a comment saying PASS is not your own execution evidence.
- If an important source is inaccessible, state the limitation briefly. Continue with available evidence unless the core requirement cannot be understood.

### 2. Build a functional feature breakdown

- Organize the work into user-visible capabilities with nested behaviors.
- Include relevant scope from subissues, not only the original epic description.
- Link capabilities and behaviors to the issues that describe them.
- Group related field handling and configuration rules under the capability they support rather than making every bug a top-level feature.
- Explain what users can accomplish and what the system must do. Do not merely repeat issue titles or dump a flat task inventory.
- Preserve discovery work as discovery; do not turn an investigation request into a promised implemented feature.

### 3. Identify material ambiguities and contradictions

Raise only questions whose answers could materially change user behavior, feature scope, permissions, dependencies, or acceptance expectations.

For each item:
- State exactly what is unresolved or conflicting.
- Explain the competing meanings or the missing governing rule when useful.
- Cite the source issue or discussion.
- Check that a subissue or comment has not already answered it.

Do not:
- Enumerate minor UI details, exact wording, exhaustive validation cases, or arbitrary edge cases.
- Treat features of different sizes in one epic as a problem by itself.
- Demand separate epics, dedicated delivery tickets, traceability matrices, or ticket restructuring without a demonstrated functional need.
- Present missing paperwork or an absent dedicated subtask as a missing product requirement.
- Treat existing defects as unresolved requirement decisions when their expected behavior is already explicit.
- Invent concerns just to fill the section. If none are material, say so.

### 4. Describe concrete risks

- Identify plausible user or business consequences supported by the requirement and its subissues.
- Prefer concrete outcomes such as wrong attribution, lost links, incorrect triage, inaccessible data, or failed creation over vague claims about quality or rework.
- Link risks to evidence where available.
- Distinguish reported defects from hypothetical risks.
- Do not invent severity or business-impact ratings without supporting context.
- Keep this section short; normally no more than four risks.

### 5. Propose high-level acceptance criteria

- Provide up to ten observable outcomes covering the principal capabilities.
- State what must happen, not a detailed test procedure or implementation design.
- Ground criteria in the requirement, subissues, and explicit decisions.
- Do not invent thresholds, mappings, credentials, formats, or policy decisions.
- When behavior is unresolved, refer to the agreed rule and explicitly flag that the relevant criterion depends on that decision.
- For investigation requirements, define an investigation deliverable rather than asserting that a working feature is required.
- Criteria are proposed acceptance expectations, not claims that the feature has been executed or passed.

## Output format

Use exactly these four headings, in this order. Do not add an executive summary, readiness verdict, recommendation, or offer unless requested.

```markdown
## Feature breakdown

- **Main capability** — [issue reference](url)
  - Concrete behavior — [supporting issue](url).
  - Related behavior.
    - Supporting rule where needed.

## Ambiguities & Contradictions

- **Specific unresolved behavior:** concise explanation, citing [source](url).

## Risks

- **Concrete consequence:** how it could affect users, citing [source](url).

## Acceptance Criterias

*Proposed acceptance criteria; identify any that depend on unresolved decisions.*

1. Observable outcome.
2. Observable outcome.
```

Output constraints:
- Feature breakdown must be a nested list, with issue links wherever possible.
- Ambiguities & Contradictions must be a list with at most five items; use fewer when appropriate.
- Risks must be concise and specific.
- Acceptance Criterias must be a numbered list with at most ten points. Preserve this heading spelling to match the requested format.
- Use plain, direct language. Every bullet must teach the reader something about the feature, a decision, a consequence, or an acceptance outcome.
- Avoid abstract filler such as "reconcile the epic," "assign a disposition," "capture this as a capability," or "define a completion boundary" when you can state the actual behavior or decision instead.
- Do not repeat the same concern across sections without adding a distinct purpose: feature = behavior; ambiguity = unresolved decision; risk = consequence; criterion = observable expected result.
- If the requested task is review only, do not edit issues, create subtasks, rewrite the source requirement, or execute tests.

## Quality check before responding

- Did I read the relevant subissue bodies and discussion, including omitted or truncated content?
- Does the breakdown explain the actual feature instead of merely evaluating ticket hygiene?
- Is every ambiguity genuinely unanswered in the sources?
- Is each concern consequential rather than cosmetic or procedural?
- Did I avoid treating mixed change sizes as a defect?
- Are acceptance criteria grounded, observable, and free of invented decisions?
- Is the result brief enough to be useful without losing meaningful scope?
