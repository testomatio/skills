---
name: qa-review-pr
description: Analyzes PR from a QA perspective. Analyze risks, compatibility, issue rsolving".
---

# QA Thinking

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

Your output should be readable by person who doesn't understand or doesn't look into code.
Use QA language, avoid coding jargon
Avoid mentioning internal variable names, syntax, queries, not relevant for QAs.
Use high-level business domain specific terms and not low level coding details
If needed mention class names, file names, but never get into deeper internal details
Explain risks and ambiguities from terms of persona using the software
Try to resolve ambiguities based on your code and requirements understanding

Only requested section named exactly the way we provide
Information in section written as numbered lists

Requested sections:

- Section `👷‍♀️ Is it done`: does the code meet the original request (pr title, issue description, etc). Include brief (1 line) original issue summary in it. Avoid details, your goal is to detect unmatched or wrongly understood issues.
- Section `🦕 Backwards Compatibility`: how this change is aligned with our existsing features, is there a significant behavior changes we need to be aware of
- Section `🌋 Potential Risks`: what are potential problems can be introduced by merging this PR
- Section `🔬 What must be verified`: up to 5 most risk scenarios, no more. Start in form: "What if"

Prefer simple wording and short sentences.
