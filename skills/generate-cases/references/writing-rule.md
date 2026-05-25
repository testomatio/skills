## Test Suite Writing Rules

Important: Refer to user provided test cases first, then use these rules.

Formulas, business rules, edge-case reasoning, and feature context live in the suite/test description.
Prerequisites which are common to all test cases must be written as bullet points in the suite description.
Formulas, diagrams, relavant to all test cases can be included as codeblocks in the suite description.

## Test Case Writing Rules

Test case consist of description and steps.
Add the intent of the test case to the description if title is not fully enough to explain the intent.
Description must be clear and concise.
Focus on black-box testing, thus each operation and observable results must be obtained via public apis or UI (unless user specifies otherwise).
Prefer using UI over public apis when possible.
**If this is a web app** ask user to discover it
- by looking its frontend source code
- by accessing it on non-production environment via browser (URLs and credentials)
- by looking at screenshots of related pages
  Understand UI pages and components or API endpoints from source code or design or requirements.
  Add system checks only if it not clear how to test via public apis or UI.
  It is not a unit test, usually no direct server or code access is allowed.

Golden rule: "Why" in description, "what" in steps.

Put preparations into **preconditions**/**description** section, not as steps.

## Title

Title states the behavior under test from the user's perspective.

Title structure: "<role> <action> <object> <qualifier>"

Examples:

- Editor can change description of a blogpost in admin panel
- User can report a bug using widget on a web page
- Blocked user must not be able to log in into app workspace
- Admin can invite up to 10 user to a project via Settings Page
- User can not edit a comment it doesn't own
- User can retry operation when NetworkError occurs
- User can not retry operation when network connection is disabled

Avoid:

- Filler prefixes: `Verify that ...`, `Test that ...`, `Check ...`, `Should ...`
- Multi-intent titles joined by `and` / `then`
- Restating the suite name in every title
- Embedding IDs or numbers: `TC-001: Login`
- Vague outcomes: `Successful login`, `Login works`

Good vs bad:

- `Verify successful login` → `User can log in with valid email and password`
- `Wrong password test` → `User cannot log in with invalid password`
- `Login and update profile` → split into two tests
- `Email validation` → `User sees error when email format is invalid`

## Preconditions

Add preconditions for actions which do not belong to actions, but are required for the test to run.
Do not include preconditions like "service is running" if it's not explicitly mentioned by user or is not actually what the test is about.
Define the pre-conditions and initial state of the system as bullet points.
Avoid if not needed or is the same as the suite description.
If relevant, include the user role.

## Steps

````suggestion
Step should consist of **action** (with optional test data) and **expected result**.

Test steps use the `## Steps` header section with a nested markdown list format:

```markdown
## Steps

* (Step Action)
  *Expected*: ... (Observable behavior)
* ...
  *Expected*: ...
````

e.g.

```markdown
## Steps

- Navigate to the login page
  *Expected*: Login form is displayed with username and password fields
- Enter a valid username and password
  *Expected*: Credentials are entered without errors
- Click the "Login" button
  *Expected*: User is redirected to the dashboard
```

Step format rules:

Steps must be under a `## Steps` heading
Use nested markdown lists (bulleted * or numbered 1.)
Top-level items describe the action to perform
Nested items with *Expected* (or *Expected*:, *Expected result\*) describe the observable behavior
Expected results should be specific and verifiable

Each step must be simple sentences.
Avoid using commas, sub-sentences.
Steps are mechanical: click, send, read, assert.
Each step must include exact instructions
Prefer placeholder variable names like `${domain}` or `${company-title}` over specific values.
Prefer using URL paths over full urls If its url path, e.g. `${domain}/auth/login`.
Use specific values when they are important for the scenario (e.g. boundary values, format validation, locale-specific input).
Avoid vague qualifiers like "small", "known", "around", "e.g.", "like", "(…)"; replace them with concrete placeholders or, when required, literal values.
Avoid general statements in steps. Move general statements to the description.
Do not chain multiple distinct actions or use unnecessary And / Or combinations in a single sequence.
All step actions must be clear to perform via PUBLIC API or UI
All checks/verifications/assertions should be in **expected result**, not as step **action**.
You may add a codeblock after a step if needed to:

- write API request
- write SQL
- write shell command
- to illustrate the point using pseudocode
- etc

If expected result has multiple conditions split them into separate lines:

Instead of:

`*Expected*: Comment appears in the Run's comment list with the current user as author`

Use:

`*Expected*: Comment appears in the Run's comment list`
`*Expected*: Current user is the author`

### Bold and italic in steps

Use sparingly. Each style serves one purpose; otherwise write plain text.

- **bold** — UI elements the user interacts with: buttons, links, fields, tabs, checkboxes, modals (e.g. `Click **Save**`, `Open **Settings** tab`).
- *italic* — names of pages/screens/documents referenced as context (e.g. `Open the *Privacy Policy* page`).

Avoid:

- Bold/italic on full sentences or whole steps.
- Combining bold and italic (`***...***`).
- Emphasis for visual weight; rephrase or split the step instead.
- Bold/italic in place of a placeholder (`[url]`) or a code block.

## AI Writing Patterns to Avoid

Be specific, not grandiose. Say what it actually does. Avoid marketing language and emojis (unless explicitly intended).

Avoid:

- Puffery: pivotal, crucial, vital, testament, enduring legacy, indelible mark, deeply rooted, profound heritage, steadfast dedication, key turning point
- Promotional adjectives: groundbreaking (figurative), seamless/seamlessly, robust, cutting-edge, vibrant, nuanced, multifaceted, intricate/intricacies, stunning natural beauty
- Overused AI vocabulary: delve/delves, leverage/leveraging, foster/fostering, realm, tapestry, landscape, interplay, streamline, shed light on, garnered, notably, key (as adjective)
- Empty "-ing" phrases: ensuring, showcasing, highlighting, emphasizing, reflecting, underscoring, aligning with, contributing to, enhancing, underpinning
- Filler frames: stands/serves as, is a testament/reminder, plays a vital/significant/crucial/pivotal role, underscores/highlights its importance, reflects broader, symbolizing its ongoing/enduring/lasting impact, continues to captivate, nestled in the heart of, boasts a
- Hedges and closers: it's important/critical/crucial to note/remember/consider, may vary, In summary, In conclusion, Overall
- "Challenges/Legacy" framing: Despite its... faces several challenges, Despite these challenges, Challenges and Legacy, Future Outlook
- Parallel "not/but/however" constructions: "Not only ... but ...", "It is not just about ..., it's ..." — common in LLM writing but unsuitable for a neutral tone
- Formatting overuse: excessive bullets, emoji decorations, bold on every other word
