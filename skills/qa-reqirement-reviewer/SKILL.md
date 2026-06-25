---
name: qa-requirement-reviewer
description: Review requirements before development. Identify ambiguity, missing information, contradictions, unclear acceptance criteria, logical gaps, edge cases, and testability issues. Determine whether the requirements are sufficiently clear for development and QA. Use this skill when a user provides requirements (BRD, user story, use case, feature ticket, specification, or prose) and asks for feedback, validation, review, or readiness assessment before implementation.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# QA-STATIC-REQUIREMENT-REVIEWER-SKILL: What I do

This skill reviews requirements before development begins. It evaluates requirement quality, completeness, consistency, clarity, and readiness for implementation and testing.

The primary goal is to identify defects, ambiguities, missing information, contradictions, assumptions, edge cases, and testability risks before development starts. The skill works with any requirement format, including BRDs, user stories, use cases, feature tickets, specifications, acceptance criteria, emails, and free-form text or raw requirements description.

Review requirements as written and identify issues, gaps, risks, and unanswered questions. When useful, suggest improved wording or additional acceptance criteria, but do not make assumptions or silently fill in missing information. Highlight what requires clarification so stakeholders can determine whether the requirements are ready for development, testing, or approval.

## When to Use

Trigger this skill when user wants to:
- **Review** requirements for quality, completeness, and consistency.
- **Verify** readiness for development, testing, or approval.
- **Identify** ambiguities, contradictions, assumptions, gaps, and risks.
- **Evaluate** requirement text, acceptance criteria and expected behavior.
- **Validate** whether requirements are testable and implementable.
- **Find missing** scenarios, edge cases, business rules, or error conditions.
- **Improve** requirement quality before implementation begins.
- **Receive** recommendations for clarifying or strengthening requirements.

---

## Review Criteria

Evaluate each requirement against the following criteria:

| Criterion      | What it means             | Failure signals |
| -------------- | ------------------------- | --------------- |
| **Atomic**     | Describes a single behavior, rule, or capability | Multiple behaviors combined in one requirement; difficult to verify independently           |
| **Clear**      | Meaning is understandable and specific           | Vague language, undefined terms, subjective wording, multiple possible interpretations      |
| **Complete**   | Contains enough information for implementation and testing | Missing business rules, acceptance criteria, inputs, outputs, error handling, or edge cases |
| **Consistent** | Does not conflict with related requirements      | Contradictory behavior, terminology, workflows, rules, or constraints                       |
| **Testable**   | Can be objectively verified                      | No measurable outcome, unclear success criteria, impossible to determine pass or fail       |

---

## Workflow: Requirement Review

### Step 1: Gather Requirements

Accept requirements in any form:
- Requirement document or file.
- Directory, repository, or collection of requirement documents and files.
- Raw text provided in the conversation.

> If the requirements are incomplete, inaccessible, or unclear, ask the user for clarification.

### Step 2: Identify Requirements

Regardless of format:
- Identify individual requirements, rules, behaviors, and acceptance criteria.
- Assign identifiers where helpful (`R1`, `R2`, ...), or reuse existing IDs.
- Separate requirements from background information, rationale, implementation details, and design discussions.

### Step 3: Review Requirements

Evaluate each requirement against the review criteria.

For each issue found:
1. **Identify** the affected requirement.
2. **Explain** the issue and its consequence.
3. **Classify** the issue (clarity, completeness, consistency, testability, etc.).
4. **Ask** the clarification question needed to resolve it.
5. **Optionally** suggest improved wording.

### Step 4: Review the Requirement Set

Evaluate the requirements as a whole for:
- Missing requirements, scenarios, or business rules.
- Missing acceptance criteria or expected outcomes.
- Missing actors, roles, states, dependencies, or constraints.
- Missing edge cases, alternative flows, or error conditions.
- Contradictions, overlaps, or inconsistencies between requirements.

### Step 5: Produce the Review Report

Return a structured review that summarizes findings, questions, risks, and recommendations, and clearly indicates whether the requirements appear ready for development and testing.

Use this exact structure:

```markdown
## Requirements Review

### Readiness Assessment

**Decision:** ✅ Ready for Development | ⚠️ Needs Clarification | ❌ Not Ready

**Summary:** ... (Brief assessment of overall requirement quality and readiness. 1-3 sentences verdict)

### Key Findings

| Requirement | Issue Type   | Finding | Question / Recommendation |
| ----------- | ------------ | ------- | ------------------------- |
| R1          | Completeness | ...     | ...                       |
| R2          | Clarity      | ...     | ...                       |

### Ambiguities & Open Questions

* ...
* ...

(Bullet list of Questions that should be answered before approval, implementation, or testing)

### Gaps & Issues

* ...
* ...

(Missing information, scenarios, business rules, constraints, dependencies, edge cases, or error conditions)

### Acceptance Criteria Review (optional)

* Assess whether acceptance criteria are clear, complete, and testable.
* Identify missing acceptance criteria where needed.

(Include **only if acceptance criteria exist** or are expected)

### Risks & Impact

* ...
* ...

(Potential consequences of proceeding without clarification).

### Recommendation

... (Recommended next action before approval or implementation)

```

---

## Success Criteria

The review succeeds when:
- Significant ambiguities, gaps, contradictions, and testability issues are identified.
- Every finding is tied to a specific requirement whenever possible.
- Open questions are clear and actionable.
- Risks and consequences of unresolved issues are explicit.
- The final decision provides a clear readiness assessment.
- Suggested improvements do not hide missing information or assumptions.

---

## Examples

See `./references/requirements_review.md` for a fully worked example with input (flawed draft BRD) and the corresponding review output.
