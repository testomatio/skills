---
name: qa-plan-test-cases
description: Generate a structured checklist of test case titles for further test case description development. Use this skill when the user wants to plan/structure test cases before writing detailed test case descriptions. This skill analyzes requirements, determines coverage scope, applies testing roles, and produces a categorized checklist of test case titles. The output is used as input for a subsequent test case description generation step.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# QA-PLAN-TEST-CASES SKILL: What I do

This skill generates a structured **checklist of test case titles** that serves as the planning artifact for subsequent test case description development.

**What this skill produces:** A categorized, hierarchical checklist where each leaf item is a test case title separate by tested feature/functionality flow/logical section.

**What this skill does NOT produce:** Detailed test case descriptions (steps, preconditions, expected results). That is handled by a separate "generate test case descriptions" step after approving check list.

## When to Use

Trigger this skill when the user:
- Wants to **plan** test cases before writing detailed descriptions.
- User **Asks** to `plan test cases for feature X` based on the requirememnts, design, feature description, etc.
- Wants a **checklist** or **test outline** or **test case titles** (not full test cases) for further testing.
- Needs to **structure** testing approach before implementation.outline
- Wants to **review and select** which scenarios to cover.

## Workflow

**This skill follows an iterative approach. Don't omit steps and strictly ask for user approval/feedback before proceeding to the next step.**

### Workflow Steps

1. **Gather context and goals** — Understand what you're testing and show sources.
2. **Ask for coverage scope** — 🚀 smoke, ⚖️ balanced, 🧨 exhaustive, or ✏️ other.
3. **Ask user to choose role** — default, optimist, nerd, psycho, pentest, picasso, lawyer, polyglot, performance.
4. **Generate checklist** — Create categorized checklist of test case titles.
5. **Return checklist** — Output the checklist for the next step (test case description generation).

---

## Workflow in Details

### Step 1: Gather Context

Understand what you're testing.
- Requirements in raw text or some specific format.
- Functionality description.
- Designs, screens, mockups.
- Stakeholder or business instructions/goals.
- Test suite/check-list/test-cases purpose.
- Main testing flows and e2e user journeys.

Ask clarifying questions if you have some gaps after analyzing input data:
- What is the feature/functionality being tested?
- What are the key user flows?
- Are there any specific areas of concern?

#### Information Sources

Gather all information about the feature from **only the sources you have access to**:

| Source | Access Condition |
|--------|------------------|
| User prompt | Always available |
| Task Tracking systems (Jira, etc.) | Only if MCP or API access available |
| Requirements documents (Confluence, etc.) | Only if MCP or API access available |
| Design mockups (Figma, Miro, etc.) | Only if MCP or API access available |
| Existing test cases (Test Management tools) | Only if MCP or file access available |
| **Source code** | Only if file access available |

**Source code analysis (only if accessible):**
- Existing manual test files in the project.
- Automated test files (spec, test, cy files, etc.).
- Project structure.
- Search for test-related directories: `manual-tests`, `tests`, `manual`, `qa`, `spec`.
- Look for Markdown-based test files (`.test.md` or `.md`).

If **unclear** state => ask user to clarify what they want.
If **not enough information** => ask user to provide more information.

### Step 1.1: Show Gathered Context

**Show list of sources** (not full content, just list of sources) and ask user if they want to add/remove/modify anything.

Example:

```markdown
I've gathered information from the following sources:

- Jira issue ABC-123
- Confluence page XYZ
- Figma design link

❓ Do you want to:

1. ➡️ Go to next step
2. ✏️ Type changes
```

You must also look for existing test cases to avoid duplicating. Report this to user and suggest expanding them or creating a new suite.

[Wait for user approval before proceeding to Step 2.]

### Step 2: Ask for Coverage Size

**Ask the user how much coverage they want.** This sets the size of the checklist generated in Step 4.

Use exact values: 🚀 **Smoke**, ⚖️ **Balanced**, 🧨 **Exhaustive**, ✏️ **Other**.

**Compute approximate test counts per tier** from your Step 1 analysis. Do not use generic or hardcoded ranges.

```markdown
❓ **How much coverage do you want?**

**1. 🚀 Smoke** ~<N> tests
Critical-path only

**2. ⚖️ Balanced** ~<N> tests
Happy path, key negative and common edge cases

**3. 🧨 Exhaustive** ~<N> tests
Full coverage incl. error states, boundaries, and security/perf/i18n where relevant

**4. ✏️ Other**
Proceed to specific role selection, type a number of tests, or describe scope in your own words
```

If user picks **✏️ Other**, accept either a number (e.g. "around 10") or a free-form description.

[Wait for user approval before proceeding to Step 3.]

### Step 3: Ask for Specific Role

Check condition and select next step accordingly:

**If user picked "smoke" scope in Step 2:**
- **skip this step**, auto-apply "⚙️ default" role and go straight to Step 4

**If user picked "balanced", "exhaustive" or "other" scope in Step 2:**
- **show the roles names and short description as markdown table** and let user choose

##### Roles

| Role               | Description                              |
| ------------------ | ---------------------------------------- |
| **⚙️ default**     | **balanced** approach                    |
| **🌈 optimist**    | **positive** flows, happy path           |
| **🤓 nerd**        | **details**, dependencies, perfectionist |
| **🔪 psycho**      | **edge cases**                           |
| **🔐 pentest**     | **security**                             |
| **🎨 picasso**     | **ui/ux**                                |
| **⚖️ lawyer**      | **texts**, error messages, typos, etc.   |
| **🌐 polyglot**    | **localization**, translations           |
| **📈 performance** | **performance**, load, stress, etc.      |
| 🔧 other           | **specify your own role**                |

Ask user to choose a role. If user does not specify, use **⚙️ default**. If user selects "🔧 other", ask them to define a custom role.

Example:

```
❓ Choose role:

1. ⚙️ default (recommended)
2. ☰ Show all available roles
3. ✏️ Type role name
```

[Wait for user approval before proceeding to Step 4.]

### Step 4: Generate Checklist

Create a **hierarchical, categorized, well-structured checklist** based on:
- Gathered information from Step 1
- Coverage tier chosen in Step 2 (🚀 smoke → only critical paths; ⚖️ balanced → happy + key negative + common edge cases; 🧨 exhaustive → full coverage)
- Role selected in Step 3

Example:

```markdown
## Signup Flow
- Signup with valid email address
- Signup with valid phone number
- Signup with existing email (negative)
- Signup with invalid email format (negative)

## Login Flow
- Login with valid email credentials
- Login with valid phone credentials
- Login with invalid password (negative)
- Login with non-existent user (negative)
- Password reset request

## Profile Settings
- Update display name
- Update avatar image
- Change password with valid current password
- Change password with invalid current password (negative)
```

**Show the checklist to the user and ask for approval.** If a multi-select / checkbox Ask tool is available, present the checklist items as **checkboxes** (recommended items pre-checked) and let the user **select which test case titles to keep**.

### Step 4.1: Wait for Approval

**Ask about amount of cases / level of details:**

```
❓ Do you want to:

1. 👍 Keep as is
2. ➖ Less details
3. ➕ More details
4. ✏️ Type anything you want to change
```

In case user wants more details, enable **nerd role**.

[Wait for user approval.]

### Step 5: Return Checklist

Once the checklist is approved, **return the final checklist** in a structured format.

**Output format:**

```markdown
# Test Case Plan: [Feature Name]

**Coverage:** [Smoke|Balanced|Exhaustive|Other]
**Role:** [Role Name]
**Total test cases:** <N>

## Checklist

<!-- checklist -->
- Category/Group 1
  - Test case title 1
  - Test case title 2
- Category/Group 2
  - Test case title 3
  - Test case title 4
<!-- /checklist -->
```

This checklist is now ready to be used as input for the next step: **generating detailed test case descriptions**.

---

## Example Interaction

**User:** "plan tests for the login feature"

**You (AI agent):**

1. Gather information about login feature
   - analyze all available sources
   - interact with user
2. Show gathered information and ask for approval
3. Ask for coverage scope (🚀 smoke, ⚖️ balanced, 🧨 exhaustive, or ✏️ other)
4. Ask for role (default, optimist, nerd, etc.)
5. Generate hierarchical structured checklist of test case titles
6. Display checklist and ask for approval
   - ask about amount of cases / level of details
7. Return final checklist for the next step (test case description generation)
