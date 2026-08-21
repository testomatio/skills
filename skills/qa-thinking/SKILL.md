---
name: qa-thinking
description: Analyze a feature a developer is building from a QA perspective — edge cases, negative flows, abuses, unobvious scenarios. Use when asked "what could go wrong?", "what am I missing?", or "review this as QA".
---

# QA Thinking

Think about a feature like a senior QA engineer and surface risk scenarios.
The user can explain the idea, or take it from the current branch or PR.
For a PR, gather intent with the `qa-pr-requirements-analyzer` skill first.
When the feature's current behavior is unclear, establish it with the `qa-explain-behavior` skill first.

## Think

- Positive scenarios.
- Negative scenarios: possible misuse and failures.
- Unobvious usage: repeated actions, boundary values, cancellations.
- Combinations: how this feature interacts with other features.
- Possible abuses.
- Data consistency: inputs that create inconsistent state, and how it affects the system later.
- Security vulnerabilities.

## Output

- Section `👓 What must be clarified`: questions to resolve important ambiguities.
- Section `🔬 What must be verified`: up to 10 most important risk scenarios, no more.
- Prefer simple wording and short sentences.
- When asked for more, propose the next batch of scenarios.

## Next actions

Offer after the analysis:

- Draft missing or unclear user stories → `write-user-story` skill.
- Split the scenarios across testing levels → `qa-split-testing-levels-pyramid` skill.
- Turn scenarios into test cases or a checklist → `qa-write-test-cases` skill.
- Ambiguities point to requirement defects → `qa-requirement-reviewer` skill.
