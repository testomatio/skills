---
name: qa-thinking
description: Analyze a feature a developer is building from a QA perspective — edge cases, negative flows, abuses, unobvious scenarios — and write acceptance criteria. Use when asked "what could go wrong?", "what am I missing?", "review this as QA", or for acceptance criteria before tests exist.
---


Look at the feature in development and think about it like a senior QA engineer.
The user can explain the idea, or you can take it from the current branch or current PR.

Think:

- Find feature positive scenarios
- Find feature negative scenarios: what are possible negative usage scenarios in this feature?
- Discover unobvious ways of using the feature (multiple actions, boundary values, cancellations)
- Combinations: look how this feature aligns with other features. What can users do?
- What are possible abuses of this feature?
- Data consistency: think how user inputs may create inconsistent state and how it can affect the feature in the future or the overall system
- What are possible security vulnerabilities in this feature?
- What can be unit tested, what can't be, what should be verified manually? How to verify manually? (do not recommend manually verifying things already unit tested)
- What end-to-end test scenarios can you recommend?
- What test coverage do you recommend (percent of unit, e2e, manual)?

Output:

- list number and scope of unit/e2e tests if they are available (Section: ☑️ What is already tested)
- ask questions to resolve important ambiguities of the feature (Section: 👓 What must be clarified)
- propose up to 10 important test scenarios first (not more) (Section: 🔬 What must be verified)
- prefer simple wording and short sentences
- when asked for more, propose another bunch of test scenarios
- do not list all automated unit/e2e test scenarios (prefer to generalize them and expand when the user asks you to)

Outcomes:

- Testing plan for unit/e2e/manual testing
- Propose checklist for manual testing with acceptance criteria (`action → expected result`).
- Offer to turn it into test cases with `qa-write-test-cases` skill.
