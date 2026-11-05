---
name: qa-pr-requirements-analyzer
description: Retrieve the requirements linked to a pull request and extract its documented expected behavior and unresolved decisions. Reuse existing requirement-review comments when available. Supplies intent to qa-review-pr; does not review code or infer requirements from implementation. Skip extraction when no linked issue exists.
license: MIT
metadata:
  author: Testomat.io
  version: 2.0.0
---

# QA PR Requirements Analyzer

Find the linked requirement, resolve relevant decisions, and extract what the PR is expected to deliver.

This skill supplies documented intent to `qa-review-pr`. It does not assess implementation, identify risks, generate test scenarios, or invent acceptance criteria.

## 1. Find linked requirements

- Accept a PR URL or number, or use the current branch's PR when available. If neither is identifiable, ask for the PR reference.
- Read the PR title, description, and relevant discussion to find issue references and the stated relationship to them. Check explicit linked issues and ticket references in the branch name where available.
- Resolve references with the available authorized tracker tools. Read the actual issues; a reference alone is not requirement content.
- Do not inspect diffs, changed files, or commits to reconstruct intent.
- If there is no linked issue, output exactly this and stop:

  > No linked requirement found. Requirements extraction skipped.

- If a linked issue exists but cannot be read, name the inaccessible source and state that extraction is blocked for that source. Continue with other accessible linked requirements. Do not treat inaccessible requirements as absent or substitute code-derived behavior.

## 2. Read the requirement and decisions

- Read each relevant issue's description and discussion.
- Read relevant subissue bodies and discussion when they define or clarify the requested behavior. Follow parent requirements when needed to understand a linked subtask.
- Retrieve omitted or truncated content before drawing conclusions from it.
- Keep the extraction relevant to the PR's explicitly stated task. Do not assume that one PR must deliver an entire linked epic. If its intended slice is unclear, preserve that as an unresolved decision rather than guessing from code.

### Existing requirement review available

- Read the review comment and later discussion, not just the issue description.
- Reuse the applicable feature breakdown and documented acceptance criteria.
- Check whether later decisions supersede the review.
- Keep suggestions distinct from agreed requirements. Posting a review does not approve its proposed criteria.
- Preserve relevant unresolved questions without repeating the full epic review.

### No requirement review available

- Extract the requested behavior and explicit acceptance criteria directly from the issue, relevant subissues, and discussion.
- Do not automatically run an epic requirement review.
- Include only missing information or conflicts that prevent understanding the requested behavior. Do not perform general ambiguity or edge-case discovery.

## 3. Return a concise requirements brief

Use these sections:

```markdown
## Linked requirements

- [Issue title](issue-url) — relevant task or capability.
- [Requirement review](comment-url) — when used.

## Expected behavior

- Documented behavior — [source](url).
  - Applicable rule or existing acceptance criterion, when useful.

## Unresolved decisions

- Specific unresolved decision or source conflict — [source](url).
```

- Omit `Unresolved decisions` when there are none; otherwise include at most three consequential items.
- Keep expected behavior brief and user-oriented. Link every behavior to its supporting issue or decision where possible.
- Rephrase existing requirements for clarity without changing their meaning. Do not add new conditions, thresholds, mappings, permissions, or expected outcomes.
- Existing acceptance criteria belong under `Expected behavior`; do not generate a separate new set.
- Attribute proposals, approvals, and conflicts accurately. Do not choose between conflicting sources without evidence of a decision.
- Do not include PR metadata inventories, affected files, scope verification, completion verdicts, implementation analysis, risks, or testing recommendations. Those belong to downstream review.
- Do not call code-analysis or test-generation skills as part of extraction.
- Do not edit issues or post comments. Save the brief only when explicitly requested, at the requested location.

## Example

See [summary-example.md](./references/summary-example.md) for the output shape and the no-linked-issue case.
