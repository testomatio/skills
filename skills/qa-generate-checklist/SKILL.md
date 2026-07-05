---
name: qa-generate-checklist
description: Generate a structured checklist of test case titles organized by feature, functionality, user flow, or logical section for further test case description development. Use this skill when the user wants to plan/structure test cases coverage before writing detailed test case descriptions. This skill analyzes requirements, determines coverage scope, applies testing roles, and produces a categorized, hierarchical checklist of test case titles. The output is used as input for a subsequent test case description generation step.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# QA-PLAN-TEST-CASES SKILL: What I do

This skill generates a structured list of test case titles organized by feature, functionality, user flow, or logical section.

**Output:** A categorized, hierarchical **test case checklist** for planning test coverage.

**Does not include:** Detailed test case descriptions such as preconditions, test steps, expected results, or test data.

## When to Use

Trigger this skill when the user:
- Wants a **checklist** for testing a feature or product.
- Wants a **test outline** or **test case titles** (not full test cases) for further test planning.
- Wants to **plan** test cases before writing detailed descriptions.
- User **Asks** to `plan test case list for feature X` based on the requirememnts, design, feature description, etc.
- Needs to **structure** testing approach before implementation.
- Wants to get a checklist for **review and select** which scenarios to cover.

### Prerequisites

- You already checked the project structure and identified what is in this folder (source code, e2e tests, test cases) using `/scan-automation-project` skill
- You pulled existing Testomat.io tests using `/sync-test-cases-with-tms` skill if available

## Workflow

**This skill follows an iterative approach. Don't omit steps and strictly ask for user approval/feedback before proceeding to the next step.**

**When available use Ask tool when asking user for input with choices.**

**Ask user for clarification if you are not sure about something, don't suggest.**

### Workflow Steps

1. **Gather context and goals** -Understand what you're testing, what artifacts are provided, what the user wants to achieve.Then **show sources** (briefly, no details) from which you gathered the information. **Ask user** if he wants to add or change anything. Go to step 2 only after approval.
2. **Ask for coverage scope** — Ask the user how much coverage they want: 🚀 smoke, ⚖️ balanced, 🧨 exhaustive, or ✏️ other. Go to step 3 only after approval.
3. **Ask user to choose role** - Skipped if user picked "Smoke" in Step 2 (auto-applies ⚙️ default). Otherwise, **ask if user wants to enable a specific role** (refer to [roles](#roles)) or just proceed with the default one. Show each role name and short description thus user can make proper decision. Go to step 4 only after approval.
4. **Generate checklist** - Generate a categorized structured checklist. If a multi-select / checkbox Ask tool is available, present the checklist items as **checkboxes** (recommended items pre-checked) and let the user **select which tests to generate**; otherwise show the markdown checklist and ask the user to add/remove/change anything or proceed. **Wait for the user's selection/approval** before going to step 5.
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

#### Testomat.io TMS Detection

**Option 1: Using MCP:**

Check if `testomatio` MCP available. If available, gather:
- `suites_list`, `suites_search` to understand existing structure
- `tests_search`, `tests_list` to find existing tests and avoid duplicates
- `tags_list`, `labels_list` to understand project conventions

**Option 2: Using `sync-test-cases-with-tms` skill:**

Use `sync-test-cases-with-tms` skill with `pull` action to download existing tests and analyze:
- Existing structure and suites
- Current test cases (to avoid duplicates)
- Project conventions (tags, labels, priority levels)

> Notify user about existing cases which intersect with the feature/functionality being tested.

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

This information could be available as text files (copy-pasted), via links or via MCP tools. Use MCP when required and reasonable. Ask user for mcp configuration if needed.

If **unclear** state => Ask user to clarify what they want.
If **not enough information** => Ask user to provide more information.

### Step 1.1: Show Gathered Context

**Show list of sources, you've gathered information from (not full content, just list of sources), to the user and ask user if he wants to add/remove/modify anything.**

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

You must also look for existing test cases to avoid duplicating test cases. If existing test cases found report this to user and suggest expanding them or creating a new suite.

[Wait for user approval before proceeding to Step 2.]

### Step 2: Ask for Coverage Size

**Ask the user how much coverage they want.** This sets the size of the checklist generated in Step 4. The user can still fine-tune up/down in Step 4.1 after seeing the result.

Use exact values: 🚀 **Smoke**, ⚖️ **Balanced**, 🧨 **Exhaustive**, ✏️ **Other**.

**Compute approximate test counts per tier from your Step 1 analysis**. **Do not use generic or hardcoded ranges** — the numbers shown to the user must reflect the specific feature(s) under test and the context.

Show the question with your computed estimates. Put each option on its own block: the **bold label with the test count on the first line**, and the description indented on the next line. Example (replace `<N>` with your actual estimates for this feature):

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

Keep each description easy to read and understand.

If you can't reasonably estimate (e.g. feature is too vague or context too thin), say so and either omit the numbers or go back to Step 1 for more info.

If the user picks **✏️ Other**, accept either a number (e.g. "around 10") or a free-form description (e.g. "just the API contract, no UI"), and use it to size the checklist.

[Wait for user approval before proceeding to Step 3.]

### Step 3: Ask for Specific Role

Check condition and select next step accordingly:

**If user picked "smoke" scope in Step 2:**
- **skip this step**, auto-apply the "⚙️ default" role and **go straight to Step 4** without asking for role. A smoke suite is too small to benefit from a specialized role.

**If the user picked "balanced", "exhaustive" or "other" scope in Step 2:**
- **show the roles names and short description (as markdown table) and let user choose** the default one or the specific one. And ask user if he wants to select any specific role.

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

#### Role Selection

Ask the user to choose a testing role:

1. Show the available roles as a table.
2. Ask the user to select one role:
  - If the user does not specify, use **⚙️ default**.
  - If the user selects "🔧 other", ask them to define a custom role.

Better to give user **select options**. Also propose recommended role based on context.

Example:

```
❓ Choose role:

1. ⚙️ default (recommended)
2. ☰ Show all available roles
3. ✏️ Type role name
```

Choose **default** in case user does not specify role.

[Wait for user approval before proceeding to Step 4.]

### Step 4: Generate Checklist

Create a **hierarchical, categorized, well-structured checklist** based on:
- Gathered information from Step 1
- Coverage tier chosen in Step 2 (🚀 smoke → only critical paths; ⚖️ balanced → happy + key negative + common edge cases; 🧨 exhaustive → full coverage)
- Role selected in Step 3

Example:

```markdown
## Signup Flow
- Signup by email address
  -- Signup with valid email address
  -- Signup with existing email (negative)
  -- Signup with invalid email format (negative)
- Signup by valid phone number
- Signup by Google account

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

**Show the checklist and ask if checklist is good or user wants to modify it.**

**IMPORTANT: Ask about amount of cases / level of details** regarding the result user sees now. **Give user the choice:** 1. Keep as is, 2. More details, 3. Less details.  
In case user wants more details, enable **nerd role**.

**Wait for user approval**.
If user modifies checklist => go to step 4.
If user not satisfied with result => go to step 1 and ask for more details about feature(s) under test or testing type, role, etc.
If user approves checklist => go to step 5.

Example:

```
❓ Do you want to:

1. 👍 Keep as is
2. ➖ Less details
3. ➕ More details
4. ✏️ Type anything you want to change
```

[Wait for user approval.]

### Step 5: Return Checklist

Once the checklist is approved, **return the final checklist** in a structured format.

**Output format:**

```markdown
# Test Case Plan: [Feature Name]

**Coverage:** [Smoke|Balanced|Exhaustive|Other]
**Role:** [Role Name]
**Total test cases:** <N>

# Checklist

<!-- checklist -->
## Category/Group 1
- Test case title 1
- Test case title 2
## Category/Group 2
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
