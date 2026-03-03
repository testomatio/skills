---
name: improve-cases
description: Analyze existing markdown manual test cases and improve their clarity, structure, and readability for QA team. Update test titles, descriptions, steps, and tags/labels to match Testomat.io format. Use good example tests as reference. Triggers include "improve tests", "enhance cases", "clean up tests", "format tests", "fix test descriptions", "standardize tests".
inputs:
  testDir:
    description: "Directory containing manual test cases (default: manual-tests)"
    required: false
  exampleFile:
    description: "Path to a well-written test file to use as reference (optional)"
    required: false
---

# TASK: What I do

Analyze and improve existing markdown manual test cases to make them clearer and easily understandable by QA team:

* Read and analyze existing manual test cases in markdown format
* Improve test titles for clarity
* Enhance test descriptions
* Fix broken formatting and markdown syntax issues
* Standardize test structure to Test Management Tool format (like Testomat.io)
* Enhance step clarity with proper Expected Results
* Ensure consistent terminology and language
* Update tags and labels
* Preserve original test intent, and IDs
* Do NOT modify test/suite IDs - keep them as-is

## When to Use

- User asks "improve my test cases"
- User wants to standardize test format
- User mentions "fix test descriptions", "format tests", "clean up tests"
- User wants to make tests more understandable for QA team
- User mentions "enhance cases", "update tests", "improve readability"

---

## Error Handling

Fail immediately and **STOP** execution on any error:

* Test directory does not exist
* No readable markdown files found
* Cannot parse test structure

**Do not retry automatically**.
**Do NOT continue after failure**.
**Return a clear human-readable error message describing the actual failure**.

---

## Directory Resolution

Determine:
* `{{testDir}}` => default: `manual-tests`

1. If `{{testDir}}` exists => use it.
2. If not:
- Search the repository for `.md` files in directories like `test`, `tests`, `manual`, `qa`, or `spec`.
- If found => use the most relevant directory.
3. If still not found:
- Ask the user:`Where are the manual tests to improve?`
- If the user can't give an answer => stop execution with an appropriate error.

---

## Reference Format

Use these files as reference for proper Test Management Tool format:

1. File: `./templates/TESTOMAT_MARKDOWN_EXAMPLE.md` - Well-structured format example.
3. `{{exampleFile}}` (if provided by user) - Good test to reference.

---

## Approach

### 1. Find and Read Existing Tests

```bash
# Find markdown test files
find . -name "*.md" -path "*/manual-tests/*" -o -name "*.md" -path "*/tests/*"

# List test directory
ls -la manual-tests/
```

Read all test files and analyze:
- Current test format and sections
- Quality of test descriptions
- Step clarity and completeness
- Tags and labels usage
- Missing sections or formatting issues

### 2. Analyze Test Quality

For each test, identify:

**Description Issues:**
- Vague or unclear test purpose
- Missing or incomplete description
- Ambiguous language

**Step Issues:**
- Missing Expected Results
- Inconsistent step format
- Unclear actions

**Formatting Issues:**
- Broken markdown syntax
- Improper code formatting
- Missing sections

**Tag/Label Issues:**
- Missing priority in header
- Inconsistent or missing tags
- Labels not following Testomat.io format

### 3. Improve Tests (In-Place)

For each test, apply improvements:

**Title Improvements:**
- Make clear and specific
- Use action-result format: "Verify [action] results in [expected]"

**Description Improvements:**
- Make purpose clear and concise
- Use specific, measurable language
- Fix grammar and spelling only

**Step Improvements:**
- Ensure each step has Expected Result
- Make actions specific and reproducible
- Use consistent bullet format `* `

**Tag/Label Improvements:**
- Add priority: critical/high/normal/low
- Add tags: @smoke, @regression, @happy-path, @negative, etc.
- Add label: Manual, Automated, Needs Review

**Formatting Improvements:**
- Fix code blocks with proper ``` fences
- Use inline code ` for technical elements
- Ensure consistent header hierarchy

### 4. Preserve Original Content

**CRITICAL - DO NOT CHANGE:**
- Original test/suite IDs
- Original test intent
- Original language
- Original wording (fix only clarity/grammar)
- Original environment
- Attached files or references

### 5. Save Changes

Overwrite original files with improved versions. Keep same file names and directory structure.

---

## Example Real Usage

* Improve all manual test cases:

```text
Use improve-cases to enhance my test descriptions
```

* Improve with specific example reference:

```text
Use improve-cases with exampleFile: login-flow.md
```

* Standardize test format:

```text
Use improve-cases to standardize all test cases to Testomat.io format
```
