---
name: generate-test-cases
description: Generate test cases and checklists for software testing. Use this skill whenever the user asks to create test cases, test scenarios, test plans, checklists, QA documentation, or mentions testing activities like "write tests for feature", "create a test checklist", "generate test scenarios from requirements", or similar. This skill works better if user provides documentation, requirements etc or it can create test cases based on the user prompt without any additional context.
---

# Test Case & Checklist Generator

This skill helps you to generate comprehensive test cases and checklists for software testing. It adapts to the context provided by the user and generates appropriate testing artifacts.

## When to Use

Trigger this skill when the user:

- Asks to create test cases, test scenarios, or test plans
- Wants a checklist for testing a feature or product
- Provides requirements, user stories, or acceptance criteria
- Shares designs (Figma, Miro, screenshots, etc.) and wants test coverage
- Mentions QA activities or testing documentation needs

### User interaction

- When user interaction required, good to highlight it with question mark emoji ❓. Example:

```
❓ Do you want to:

1. action 1
2. action 2
3. type something else
```

- Use emojis sometimes to make the output more readable and UI friendly.

- Use non-formal language to attract user attention. Try to be liked by the user.

- Fill input fields with suggestions when asking user to provide input.

## Workflow (IMPORTANT: how AI tool (Claude, Cursor etc) should work with user)

This skill follows an **iterative approach**.  
**Don't omit steps and strictly ask for user approval/feedback before proceeding to the next step**.
Generate **checklist** prior to **test cases** generation even if user request sounds like "generate test cases".

1. **Gather context and goals**
   Understand what you're testing, what artifacts are provided, what the user wants to achieve.  
   Then **show sources** (briefly, no details) from which you gathered the information. **Ask user** if he wants to add or change anything. Go to step 2 only after approval.

2. **Ask for type of testing**.
   **Ask user about type of tests required** (smoke, regression, acceptance, etc.). Go to step 3 only after approval.

3. **Ask user to choose role**.
   **Ask if user wants to enable specific role** (refer to [roles](#roles)) or just proceed with default one.  
   Show each role name and short description thus user can make proper decision. Go to step 4 only after approval.

4. **Generate checklist**.
   **Generate and show a categorized structured checklist**. **Wait for user approval:** ask if the user wants to add/remove/change anything in the checklist or proceed to test cases generation. Go to step 5 only after approval.

5. **Generate detailed test cases**.
   Convert approved checklist into detailed test cases.

---

## Workflow in details:

### Step 1: Gather Context

First, understand what you're testing.

- Test suite/check-list/test-cases purpose and business goals.
- Main testing flows and user journeys.

Ask clarifying questions if needed:

- What is the feature/functionality being tested?
- What are the key user flows?
- Are there any specific areas of concern?

Gather all information about the feature/functionality being tested from:

- User prompt.
- Task Tracking systems (Jira, etc.)
- Requirements documents (Confluence, etc.)
- Design mockups (Figma, Miro, etc.)
- Existing test cases (Test Management tools like TestRail, **Testomat**, etc.)
- Source code
  - Existing manual test files in the project.
  - Automated test files (spec, test, cy files, etc).
  - Project structure.
  - Search for test-related directories such as: `tests`, `manual-tests`, `manual`, `qa`, `spec` or similarly named folders.
  - Within those directories, look specifically for Markdown-based test files, especially files ending with `.test.md`

This information could be available as text files (copy-pasted), via links or via MCP tools. Use MCP when required and reasonable. Ask user for mcp configuration if needed.

**Analyzing the source code**
Note: in most cases user will run this skill from automation project and usually such projects do not contain the application code. Thus, you should check if this is just automation project or application+automation project. If automation only – scan source code briefly, pay attention to test files mostly; if application code is present too – scan it thoroughly, but do not dive into unit testing unless user explicitly asks for it.

If any **unclear** state => ask user to clarify what he want. Ask to connect to relevant MCP tools if needed or provide more information.

If **not enough information** => ask user to provide more information.

[Wait for user confirmation about sources before proceeding to Step 2.]

### Step 1.1: Show gathered context to user (briefly) and ask for approval

**Show list of sources, you've gathered information from (not full content, just list of sources), to the user and ask user if he wants to add/remove/modify anything.**

Example:

```markdown
I've gathered information from the following sources:

- Jira issue ABC-123
- Confluence
- Figma

❓ Do you want to:

1. ➡️ Go to next step
2. ✏️ Type changes
```

[Wait for user approval before proceeding to Step 2.]

### Step 2: Ask for type of testing

**Ask user about type of tests required: smoke, regression, feature acceptance, etc.**

Suggest more types based on gathered context.

Example:

```markdown
❓ What type of tests do you want to generate?

1. smoke
2. regression
3. acceptance
4. ✏️ other
```

[Wait for user approval before proceeding to Step 3.]

### Step 3: Ask for specific role

**Show the roles names and short description (as markdown table) and let user choose** the default one or the specific one.

##### Roles

| Role               | Description                              |
| ------------------ | ---------------------------------------- |
| **⚙️ default**     | **balanced** approach                    |
| **🌈 optimist**    | **positive** flows, happy path  |
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

1. default (or propose recommended based on context)
2. ✏️ Type role name
```

**If you show not all roles to the user, add "_Show all available roles_" option.**

Example:

```
❓ Choose role:

1. default (or propose recommended based on context)
2. ☰ Show all available roles
3. ✏️ Type role name
```

Choose **default** in case user does not specify role.

[Wait for user approval before proceeding to Step 4.]

### Step 4: Generate Checklist

Create a **hierarchical, categorized, well-structured checklist** based on the gathered information and user choices.

Example:

```markdown
- Signup
  - Signup with valid email
  - Signup with valid phone number

- Login
  - Login with valid email
  - Login with valid phone number
  - Login with invalid password
```

**Show generated checklist to user and ask for approval.**

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

### Step 5: Generate Detailed Test Cases

**Proceed with this step only after user approval of checklist.**

If user prompted checklist generation only (not test cases), ask user if he wants to generate test cases (e.g. **"Do you want to generate test cases for this checklist?"**) or proceed to test case generation.

Rules:

- If multiple features to test or whole product => put generated test cases of each feature in separate file.
- Step should consist of **action** (with optional test data) and **expected result**.
- All checks/verifications/assertions should be in **expected result**, not as separate steps.
- **Be thorough but practical**. Cover important scenarios without overwhelming detail (unless user asks for it or select appropriate role e.g. "nerd").
- **Use clear language**. Test steps should be unambiguous and easy to follow.
- If user provides **existing test cases**, follow their **style**.
- **Think like a tester**. Consider not just what works, but what could break.
- **Consider the user**. Focus on user-facing functionality first.
- **Be adaptable**. Adjust depth, detail, testing type and other parameters based on user feedback.
- **Keep scope**. Test only the functionality under test but not the related entities. If feature linked to other features, don't test them if user didn't ask for it explicitly.

**Don't change the user's source code. Only generate .md files with test cases.**

### Step 6: Show summary results

Show summary results to user terminal. Include any relevant information you think is important. E.g. amount of test cases generated, amount of test suites, etc. Better to use markdown table. It should be concise and easy to read.

Show the generated files list and destination folder.

Ask user to review generated files and ask if he want to change something to achieve the satisfactory result.

## Output formats

### Checklist format (displayed in terminal)

Checklist should have hierarchical and categorized structure.

### Test cases format (saved to .md file(s))

- Strictly follow the `./references/test-case-format.md` format. Exception: user specify format in the prompt. In this case, follow the user's format.
- Files naming: `test-cases-feature-name.md`.
- **IMPORTANT:** **Strictly follow the `./references/test-case-format.md` format** for **suites**, **tests** and **steps**.
- Always use suite block. (e.g. `<!-- suite ... -->`).
- If required, put `tags:` and `labels:` inside **each** `<!-- test ... -->` metadata block (see [test metadata](./references/test-case-format.md#test-metadata)). Not only on the suite block.
- If reasonable, add test metadata like priority, preconditions, test data, labels, tags based on analyzed information and context. For **priority** use values from the [reference metadata](./references/test-case-format.md#test-metadata)
- **IMPORTANT: NEVER generate Testomat.io test or suite IDs** - Do NOT include `id: @T...` or `id: @S...` fields in your output. These IDs are server-generated and should NOT be created by this skill. The format reference file shows IDs in examples, but you must NOT generate them.

### Matching Existing Test Case Formats

When the user provides an existing test cases example and/or asks for "similar" test cases:

**DO match:**

- Writing style and level of detail
- Field structure (Priority, Preconditions, Type, Test Data, etc.)
- Additional fields like labels, tags etc
- Original case language

**DON'T copy:**

- Feature-specific ID prefixes (e.g., if example shows `TC-R001`)
- Original test case intent

## Example interactions

### Example 1

**User:** "generate test cases for feature X"

**You (AI agent, Claude, Cursor, etc.):**

1. Gather information about feature X
   - analyze all available sources
   - interact with user
2. Show gathered information to user and ask for approval or changes
   - ask if user wants to add/remove/modify anything
3. Ask for test type (smoke, regression, feature acceptance, etc.)
4. Ask for role (default, optimist, drama-queen, etc.)
5. Generate hierarchical structured checklist for feature X
6. Display checklist in terminal and ask for user approval
   - ask about amount of cases / level of details (more, less, keep as is)
7. On approval, generate detailed test cases for feature X and save to `test-cases-feature-x.md`

### Example 2

**User:** "generate checklist for feature X"

**You (AI agent, Claude, Cursor, etc.):**

1. Gather information about feature X
   - analyze all available sources
   - interact with user
2. Show gathered information to user and ask for approval or changes
   - ask if user wants to add/remove/modify anything
3. Ask for test type (smoke, regression, feature acceptance, etc.)
4. Ask for generation role (default, optimist, drama-queen, etc.)
5. Generate hierarchical structured checklist for feature X
6. Display checklist in terminal and ask for user approval
   - ask if user wants to proceed
   - ask about amount of cases / level of details (more, less, keep as is)
