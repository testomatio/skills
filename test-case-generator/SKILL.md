---
name: test-case-generator
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

## Workflow (IMPORTANT: how AI tool (Claude, Cursor etc) should work with user)

This skill follows an **iterative approach**.  
**Don't omit steps and strictly ask for user approval/feedback before proceeding to the next step**.
Generate **checklist** prior to **test cases** generation even if user request sounds like "generate test cases".

1. **Gather context and goals**
   Understand what you're testing, what artifacts are provided, what the user wants to achieve.  
   Then **show sources** from which you gathered the information. **Ask user** if he wants to add or change anything. Go to step 2 only after approval.

2. **Ask user to choose mode**.
   **Ask if user wants to enable specific mode** (refer to [modes](#modes)) or just proceed with default one.  
   Show each mode name and short description thus user can make proper decision. Go to step 3 only after approval.

3. **Generate checklist**.
   **Generate and show a categorized structured checklist**. **Wait for user approval:** ask if the user wants to add/remove/change anything in the checklist or proceed to test cases generation. Go to step 4 only after approval.

4. **Generate detailed test cases**.
   Convert approved checklist into detailed test cases.

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

If any unclear state => ask user to clarify what he want.

If not enough information => ask user to provide more information.

**Ask user about type of tests required: smoke, regression, feature acceptance, etc.**

[Wait for user confirmation about sources and test type before proceeding to Step 2.]

### Step 1.1: Show gathered context to user and ask for approval

**Show all the sources, you've gathered information from, to the user and ask user if he wants to add/remove/modify anything.**

Example:

```markdown
I've gathered information from the following sources:

- Jira issue ABC-123
- Confluence
- Figma
- Existing test cases: [ABC-123-1, ABC-123-2]
- Source code: [filename]
- Type: smoke
- Mode: drama queen (focus on negative flows)

Do you want to:

1. Proceed to checklist generation
2. Add/remove/modify anything
3. Type something else
```

[Wait for user approval before proceeding to Step 2.]

### Step 2: Ask for specific mode

**Notify user** that he can choose specific mode/role in generation process.

**Show the modes names and short description and let user choose** the default one or the specific one.

### Modes

- **default** – balanced approach (focus on positive flows, also includes negative, edge cases)
- **optimist** – focus on positive flows, happy path
- **drama-queen** – negative flows mostly
- **sherlock** – dive deep into details, dependencies
- **paranoid** – edge cases, non-obvious cases
- **psycho** – tries to violate user journey, do unexpected, strange things
- **pentest** – security checks
- **picasso** – ui/ux
- **lawyer** – texts, error messages, typos, etc.
- **polyglot** – localization, translations
- **big-bang** – performance, load, stress, etc.
- **nerd** – perfectionist, detailed, pedantic, try to cover all possible cases

[Wait for user approval before proceeding to Step 3.]

### Step 3: Generate Checklist

Create a **hierarchical, categorized, well-structured checklist** based on the gathered information and user choices.

Example:

```markdown
- Signup
  - Signup with email
  - Signup with phone number

- Login
  - Login with email
  - Login with phone number
  - Login with invalid credentials
```

**Show generated checklist to user and ask for approval.**

### Step 3.1: Wait for Approval

**Show the checklist and ask if checklist is good or user wants to modify it.**

**Wait for user approval**.
If user modifies checklist => go to step 3.
If user approves checklist => go to step 4.

### Step 4: Generate Detailed Test Cases

**Proceed with this step only after user approval of checklist.**

Rules:

- When generating steps, **strictly follow the format described in the `references/test-case-format.md` file.**
- If multiple features to test or whole product => put generated test cases of each feature in separate file.
- Step should consist of **action** (with optional test data) and **expected result**.
- All checks/verifications/assertions should be in **expected result**, not as separate steps.
- **Be thorough but practical**. Cover important scenarios without overwhelming detail (unless user asks for it or select appropriate mode e.g. "nerd").
- **Use clear language**. Test steps should be unambiguous and easy to follow.
- If user provides **existing test cases**, follow their **style**.
- **Think like a tester**. Consider not just what works, but what could break.
- **Consider the user**. Focus on user-facing functionality first.
- **Be adaptable**. Adjust depth, detail, testing type and other parameters based on user feedback.

Don't change the user's source code. Only generate .md files with test cases.

## Output formats

### Checklist format (displayed in terminal)

Checklist should have hierarchical and categorized structure.

### Test cases format (saved to .md file)

- Strictly follow the `references/test-case-format.md` format.
  Exception: user specify format in the prompt. In this case, follow the user's format.

- **IMPORTANT: NEVER generate test or suite IDs** - Do NOT include `id: @T...` or `id: @S...` fields in your output.
  These IDs are server-generated and should NOT be created by this skill.
  The format reference file shows IDs in examples, but you must NOT generate them.

- If reasonable, add test metadata like priority, preconditions, test data, labels, tags based on analyzed information and context.

- Files naming: `test-cases-feature-name.md`

### Matching Existing Test Case Formats

When the user provides an existing test cases example and/or asks for "similar" test cases:

**DO match:**

- Writing style and level of detail
- Field structure (Priority, Preconditions, Type, Test Data, etc.)
- Additional fields like labels, tags etc

**DON'T copy:**

- Feature-specific ID prefixes (e.g., if example shows `TC-R001`)

## Example Interaction

**User:** "generate test cases for feature X"

**You (AI agent, Claude, Cursor, etc.):**

1. Gather information about feature X
    - analyze all available sources
    - interact with user
    - ask for test type (smoke, regression, feature acceptance, etc.)
2. Show information from step 1 to user and ask for approval or changes
3. Ask for generation mode/role (default, optimist, drama-queen, etc.)
4. Generate hierarchical structured checklist for feature X
5. Display checklist in terminal and ask for user approval
6. On approval, generate detailed test cases for feature X and save to `test-cases-feature-x.md`