---
name: project-discovery
description: Discovery project source code and create a short test planning overview with actionable stages for generating test cases or automation scripts. Use this skill when user wants to analyze an application codebase and plan next testing actions.
license: MIT
metadata:
  author: Testomat.io
  version: 1.1.0
---

# PROJECT-DISCOVERY SKILL: What I do

This skill helps analyze project source code and create a test planning overview and scenarios for further testing activities. Focuses on source code, requirements, **system/E2E and UAT testing** approaches.

## When to Use

Trigger when user wants to:
- Analyze project for testing activities.
- Plan test coverage before writing test cases.
- Suggest test scenarios for E2E automation.
- Provides requirements, user stories, or acceptance criteria.
- Mentions QA activities or testing documentation needs.
- User asks to: "discovery project", "analyze codebase for testing", "plan test coverage", "analyze code for testing approaches", "plan test activities", etc.

---

## Workflow

### Step 1: Project Discovery

#### Auto-detect from source code

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

#### Project information

Gather information about the feature/functionality being tested from:
- User prompt
- Task Tracking systems (Jira, etc.)
- Requirements documents (Confluence, etc.)
- Design mockups (Figma, Miro, etc.)
- Existing test cases (Test Management tools like TestRail, Testomat, etc.)
(This information could be available as text files (copy-pasted), via links or via available tools and **MCP tools**. Use MCP when required and reasonable.)

> **Important**: This skill focuses on **system/E2E and UAT testing** scenarios. Do not analyze unit tests unless explicitly requested by user user ask about it.

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

### Step 2: Understand user needs

Understand what you're testing, what artifacts are provided, what the user wants to achieve.

If user request **does not contain** type of planning test approach => **Ask for coverage scope:**
- How much coverage can be suggested. This sets the _initial_ size of the scenarios generated.
Use exact values: 🚀 **Smoke**, ⚖️ **Balanced**, 🧨 **Exhaustive**, ✏️ **Other**.
(Selected type indicates the number and priority of tests that will be added to the plan. 
Compute approximate test counts per tier from your **analysis**. **Do not use generic or hardcoded ranges** — the numbers shown to the user must reflect the specific feature(s) under test and the context).

Show the question with your computed estimates inline. Example (replace `<N>` with your actual estimates for this feature):

```markdown
❓ What type of tests do you want to generate?

1. 🚀 Smoke — ~<N> tests — critical-path only.
2. ⚖️ Balanced — ~<N> tests — happy path, key negative and edge cases.
3. 🧨 Exhaustive — ~<N> tests — full coverage incl. error states, boundaries, and security/perf/i18n where relevant.
4. ✏️ Other — proceed to specific role selection, type a number of tests or describe scope in your own words.
```

[Wait for user approval/choose before proceeding to Step 3.]

### Step 3: Generate Test Overview

Create a short "Scope & Prioritization" planning overview based on the user's type of tests:
- Identify key user flows to test.
- Identify high-risk areas.
- Define possible scope for future testing.

Create a **hierarchical, categorized, well-structured planner** based on the gathered information, user choices and suggested scenarios.

**Example if smoke tests selected:**

```markdown
# Test Planner: ...[Project Name]

**Generated:** ...(Current Date)
**Resources:** ...(e.g: source code, requirements)
**Test Type:** smoke.
**Scenarios Count:** 15.
**Focus:** System/E2E Testing.

# Project Summary
[2-3 sentences about what this project does]

# Testing Scope & Prioritization

## Priority 1 - Smoke Tests
- Applicton Signup
  - Signup with valid email
  - Signup with valid phone number
  - ...
[Key smoke scenarios to cover high-level functionality(in bullet list of scenarios)]
...
```

Ask user about next steps:

```
❓ Next actions?

1. 💾 Save to `docs/test-planner.md`
2. ➡️ Proceed to cover planner cases by `generate-test-cases` skill
3. ✏️ Modify plan
```

#### Save File Location

- `docs/test-planner.md` (if `docs/` exists)
- `test-planner.md` (source root)

#### Modify Plan options

Based on the user's request, make changes to the initial "test planner" structure.