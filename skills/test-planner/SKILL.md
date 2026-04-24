---
name: test-planner
description: Analyze project source code and create a short test planning overview with actionable stages for generating test cases or automation scripts. Use this skill when user wants to analyze an application codebase and plan next testing actions.
license: MIT
metadata:
  author: Testomat.io
  version: 1.1.0
---

# Test Planner Skill

This skill helps analyze project source code and create a short test planning overview for further testing activities. Focuses on **system/E2E and UAT testing**.

## When to Use

Trigger when user wants to:
- Analyze project for testing activities.
- Plan test coverage before writing test cases.
- Suggest test stages for E2E automation.
- User asks to: "analyze codebase for testing", "plan test coverage", "analyze code for testing approaches", "plan test activities", etc.

---

## Workflow

### Step 1: Project Discovery

Auto-detect from project:
1. **Tech Stack** - Frontend, backend, DB, integrations.
2. **Test Framework**:
- Trust user prompt and get framework from the request ("use CodeceptJS" or "Playwright project") 
- Inspect the project to determine the test framework, by config files like `playwright.config.js`, `codecept.conf.js`, `cypress.json`, etc.
3. **Existing Test Assets:**
- Manual tests in `.md` format (`manual-cases`, `manual-tests`, etc.).
- Automation tests (`tests`, `specs`, `e2e`, etc.).
- Test data and fixtures.
- Documentation and Requirements (`README.md`, `docs/`, `requirements/`, etc).
4. **Key Areas** - API routes, pages, user flows.

> **Important**: This skill focuses on **system/E2E and UAT testing**. Do not analyze unit tests unless explicitly requested by user user ask about it.

#### Discovery Summary

Present brief summary:

```markdown
**Project:** [Name]
**Stack:** [Tech]
**Test Framework:** [Detected or None]

**Existing Tests:**
- Automated: [location, count]
- Manual: [location, count]

**Key Areas for Testing:**
...
[high-level areas for system E2E testing]
```

### Step 2: Generate Start Test Overview

Create a short "Scope & Prioritization" planning overview:
- Identify key user flows to test.
- Define smoke test scope.
- Identify high-risk areas.
- Define possible regression test scope for future.

```markdown
# Start Test Planner: ...[Project Name]

**Generated:** ...(Current Date)
**Focus:** System/E2E Testing

# Project Summary
[2-3 sentences about what this project does]

# Testing Scope & Prioritization

## Priority 1 - Smoke Tests
[Key smoke tests to cover (in bullet list of scenarios)]

## Priority 2 - Critical Paths
[Critical user flows (in bullet list of scenarios)]

## Priority 3 - Extended Coverage
[Nice to have tests (in bullet list of scenarios)]
```

Ask user about next steps:

```
❓ Next actions?

1. 💾 Save to `docs/test-planner.md`
2. ➡️ Proceed to `generate-test-cases` skill
3. ✏️ Modify plan
```

#### Save File Location

- `docs/test-planner.md` (if `docs/` exists)
- `test-planner.md` (source root)

#### Modify Plan options

Based on the user's request, make changes to the initial "start test planner" structure.