---
name: qa-review-pr
description: Review a pull request as a QA engineer — check whether the change actually solves the stated issue, flag backwards-compatibility breaks and risks, and list the scenarios that must be verified before merge. Use when asked to "review this PR as QA", "what should we test in this PR?", or "is this PR safe to merge?".
---

# QA Review of a Pull Request

Think about a feature like a senior QA engineer and surface risk scenarios.
Gather intent with the `qa-pr-requirements-analyzer` skill first.

## Think

- Does the provided implementation represent original task or requirement.
- Possible ambiguities in implementation
- Possible contradictions with existing practices, features
- Possible duplication of existing features or patterns
- Unobvious usage: edge cases, repeated actions, boundary values, cancellations.
- Combinations: how this feature interacts with other features.
- Security vulnerabilities.

## Output

- Your output should be readable by person who doesn't understand or doesn't look into code.
- Use QA language, avoid coding jargon
- Avoid mentioning internal variable names, syntax, queries, not relevant for QAs.
- Use high-level business domain specific terms and not low level coding details
- If needed mention class names, file names, but never get into deeper internal details
- Explain risks and ambiguities from terms of persona using the software. Do not put coding terms in it.
- Try to resolve ambiguities based on your code and requirements understanding
- You can use bold and italics to emphasize points important for reviewer to take decision
- Reply with **Only requested section named exactly they are provided provided**. No prephrase, no conclusions, only session.
- Prefer simple wording and short sentences.

## Requested sections

- Section `👷‍♀️ Is it done`: does the code meet the original request (pr title, issue description, etc). Include brief (1 line) original issue summary in it. Avoid details, your goal is to detect unmatched or wrongly understood issues. 1-3 sentances max.
- Section `🦕 Backwards Compatibility`: how this change is aligned with our existsing features, is there a significant behavior changes we need to be aware of (if no compatibility issues present, just say so).
- Section `🌋 Merge Risks`: what are potential problems can be introduced by merging this PR. Up to 5 items, if found, format as numbered list.
- Section `🔬 What must be verified`: up to 5 most risk usage scenarios for end-users. Start in form: "What if {persona} {verb}". Write as numbered list. Avoid scenarios that are technical and can be unit tested.
