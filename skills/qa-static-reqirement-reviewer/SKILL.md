---
name: qa-static-requirement-reviewer
description: Perform static review of requirements documents — inspecting logic, quality, and completeness before development begins. Use this skill to detect defects, gaps, and ambiguities early, when fixing them is cheap. Evaluates whether requirements are valid, clear, and ready for development and testing. Trigger when someone shares draft requirements (BRD, user stories, use cases, feature tickets, or plain prose) and asks "are these testable", "can we approve this", "review this", or wants a static review before sign-off. QA/BA/PO can use this to validate requirements before implementation. Output as "## Static Requirements Review Overview" report with quality assessment, findings, questions, risks, and a clear readiness verdict (Ready / Needs Clarifications / Not Ready).
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# QA-STATIC-REQUIREMENT-REVIEWER-SKILL: What I do

This skill performs static review of requirements documents — inspecting logic, completeness, and quality before development begins. The goal is to detect defects, gaps, and ambiguities early, when fixing them is cheap.

Two things define this skill, and both matter:

- **You are reviewing the requirements, not rewriting them.** Find where a requirement is ambiguous, incomplete, untestable, or contradictory and surface the gap as a question — not quietly rewrite it. A tester who silently fixes a vague requirement hides the very gap the author needed to see.
- **Structure is not the point.** Requirements arrive as a formal BRD, user stories, use cases, a feature ticket, or three paragraphs in an email. The criteria are the same regardless. Work with whatever you are given.

## When to Use

Trigger this skill when user wants to:
- **Review** draft requirements for testability and quality.
- **Verify** if requirements are ready for development and testing.
- **Assess** a BRD, backlog of user stories, use cases, or feature tickets.
- **Find** ambiguities, gaps, and issues before implementation starts.
- **Validate** if acceptance criteria are sufficient.

## The Review Criteria

Test every requirement against these per-requirement quality criteria:

| Criterion | What it means | Failure signals |
| --------- | ------------- | --------------- |
| **Atomic** | One behavior or feature per statement | "and" / "also" joining distinct behaviors; cannot mark pass/fail without splitting |
| **Complete** | All functional rules defined, edge cases considered, inputs/outputs defined | Only happy path described; no error/empty/boundary behavior |
| **Consistent** | Does not conflict with other requirements | Same concept under different names; conflicting numbers/limits |
| **Unambiguous** | One interpretation only | Vague qualifiers (fast, quick, intuitive); undefined terms; "etc." |
| **Feasible** | Buildable within known constraints | Conflicts with stated constraints; absolutes like "100% uptime" |
| **Testable** | Can be objectively validated | No measurable acceptance criteria; subjective success statements |
| **Prioritized** | Importance is clear | No indication of must-have vs nice-to-have |

---

## Workflow: Static Requirement Review

### Step 1: Gather Requirements

Accept requirements in any form:
1. **File path** — single file (`.md`, `.txt`, `.brd`, etc.).
2. **Directory path** — folder with multiple requirement files (any `*.md` or `*.txt`).
3. **Raw text** — requirement text provided directly in conversation.

> If a directory is provided, read all `.md` and `.txt` files within it. If no files found, ask the user to clarify the requirenmen's source.

### Step 2: Extract and Label Requirements

Regardless of input format:
1. Identify discrete, testable claims.
2. Assign handles to each requirement (`R1`, `R2`, … or reuse existing IDs).
3. Separate genuine requirements from background, rationale, and design detail.
4. Note the format: BRD, user stories, use cases, or plain prose.

### Step 3: Evaluate Against Quality Criteria

For each requirement, check against the criteria table above. For each failure:
1. Name the criteria that fail.
2. State the **concrete consequence for testing** — not just a label, but *what blocks writing a pass/fail test*.
3. Convert into a **question for the author** or a **risk**.

**Example:**
- "Fast" alone → fail on Unambiguous + Testable.
- Concrete consequence: "No threshold distinguishes a pass from a fail".
- Question: "What is the maximum acceptable response time, and at what data volume?".

### Step 4: Evaluate the Set as a Whole

Check for set-level issues:
- Missing non-functional requirements (performance, security, accessibility).
- Missing error paths and edge cases.
- Unhandled states (logged-out, empty, offline).
- Missing roles or actors.
- No acceptance criteria anywhere.
- Contradictions across requirements.

### Step 5: Produce the Review Report

Output the structured review in markdown. **Do not save to a file** — return directly.

Use this exact structure:

```markdown
## Static Requirements Review Overview

### Impacted Areas
[Bullet list of meaningful business/technical areas affected. Omit if empty.]

### Quality Assessment (Core Analysis)

| Criterion | Assessment | Notes |
| --------- | ---------- | ----- |
| Atomic | ✅ Pass / ⚠️ Concern / ❌ Fail | [Specific requirement(s) if concern/fail] |
| Complete | ✅ Pass / ⚠️ Concern / ❌ Fail  | [Specific requirement(s) if concern/fail] |
| Consistent | ... | ... |
| Unambiguous | ... | ... |
| Feasible | ... | ... |
| Traceable | ... | ... |
| Testable | ... | ... |
| Prioritized | ... | ... |

### Ambiguities & Open Questions
[Bullet list of questions to ask the author before sign-off]

### Gaps & Issues Found
[Bullet list of specific issues with requirement references, e.g. "R3: missing error path for invalid input"]

### Risk Assessment

| Risk Type | Level | Description |
| --------- | ----- | ----------- |
| Implementation risk | Low / Medium / High | ... |
| Testing risk | Low / Medium / High | ... |
| Business impact risk | Low / Medium / High | ... |

### Acceptance Criteria Review
[
  - If acceptance criteria exist: assess their quality. 
  - If not: suggest AC for further testing/development]

### Executive Summary

**Decision:** ... (One of ✅ Ready for Development / ⚠️ Needs Minor Clarifications / ❌ Not Ready)

**Summary:** ... (1-3 sentences verdict. Example: "Requirements are clear and testable. No major gaps identified. Minor clarification needed for error handling cases.")

**Recommendation:** ... (What action to take before approval)
```

**Avoid:**
- Rewriting requirements into a "fixed" version — surface the gap as a question instead
- Vague findings ("unclear", "needs work") with no testing consequence
- Grading prose style or nitpicking format — the lens is testability and quality
- Inventing requirements the author never stated to "complete" the set — flag the gap instead
- Asking questions during the process — put them in the report's "Ambiguities & Open Questions" section

---

## Success Criteria

The review succeeds when:
- The approver can see at a glance whether requirements are testable.
- Every blocker is tied to a specific requirement and expressed as an answerable question.
- Risks of approving as-is are explicit.
- The decision section gives a clear go/no-go signal.
- You have not turned yourself into the author by rewriting what you were asked to review.

---

## Examples

| Trigger | What happens |
| ------- | ------------ |
| `Review this BRD for the search feature` | Full static review with verdict |
| `Are these user stories ready for development?` | INVEST assessment + readiness verdict |
| `Check if these requirements are testable` | Quality assessment table + gaps identified |
| `Analyze [file path or pasted text]` | Full review report in "## Static Requirements Review Overview" format |

See `./references/static_requirements_review.md` for a fully worked example with input (flawed draft BRD) and the corresponding review output.
