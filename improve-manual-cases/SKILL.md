---
name: improve-manual-cases
description: Analyze and improve existing markdown manual test cases for clarity, structure, and Test Management Tool format compliance.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# IMPROVE-MANUAL-CASES SKILL: What I do

Analyze and improve existing markdown manual test cases to make them clearer and more understandable for QA team:
- Improve test titles for clarity.
- Enhance test descriptions.
- Fix broken formatting and markdown syntax issues.
- Standardize test structure to Test Management Tool format.
- Ensure consistent terminology and language.
- Update tags and labels.

**CRITICAL - DO NOT CHANGE:**
- Original test/suite IDs.
- Original test intent.
- Original language (fix only clarity/grammar/typo).

---

## When to Use

Trigger this skill when user wants to:
- Improve clarity and readability of manual test cases.
- Standardize test format to TMS markdown format.
- Fix broken markdown or formatting issues.
- Enhance test descriptions and steps.
- Improve specific test files or folders.
- User possible phrases: "improve test cases", "rewrite test cases", "fix markdown formatting".

---

## Workflow: Improve Manual Cases

### Step 1: Locate Test Files

Find existing manual "test.md" markdown test files in the project:
- Common locations: `./manual-tests`, `./tests/manual`, `./docs/tests`, etc.
- Look for `.md` files with test case content.

> If no test files found in common locations, ask user to specify test directory path.

### Step 2: Analyze Test Quality

Read test cases and analyze current format, quality, and identify issues:

**Title Clarity:**
- Unclear or vague test title.
- Missing action-object format.
- Not specific enough to understand what is being tested.

**Description Issues:**
- Vague or unclear test purpose.
- Missing or incomplete description.
- Ambiguous language.

**Step Issues & Expected Results:**
- Missing Expected Results.
- Inconsistent step format.
- Unclear actions.
- Steps not ordered logically.
- Expected results not relevant to the steps.
- Missing pass/fail criteria.

**Formatting Issues:**
- Broken markdown syntax.
- Missing sections.
- Inconsistent header hierarchy.

**Unambiguity:**
- Generic or subjective terms ("should work", "might fail").
- Vague language that could be interpreted multiple ways.
- Steps that cannot be verified objectively.
- Missing specific values, data, or conditions.

### Step 3: Show Summary to User

Present a summary of what can be improved:
- List of issues found per test.
- Specific recommendations for improvements.
- Ask user to confirm before proceeding.

> If user does not confirm, do not proceed with changes.

### Step 4: Improve Tests

Apply improvements to each test:

**Title Improvements:**
- Make clear and specific.
- Use action-result format: "Verify [action] results in [expected]".
- Ensure title reflects actual test purpose.

**Description Improvements:**
- Make purpose clear and concise.
- Include context from parent suite when relevant.
- Fix grammar and spelling only.

**Step Improvements:**
- Ensure each step has explicit expected result:
  - Use nested format: "- Step action..." with indented "_Expected_: ..."
- Make actions specific and reproducible
- Add measurable pass/fail criteria
- Ensure results are directly relevant to the step action
- Make results measurable and verifiable
- Avoid vague terms - use specific values/conditions

**Unambiguity Improvements:**
- Replace generic terms with specific, testable language.
- Avoid subjective terms ("should work", "might fail").
- Ensure steps can be verified objectively.
- Mention proper test metadata fields:
  - Include type: `manual` in test metadata.
  - Use proper priority values: `low`, `normal`, `important`, `high`, `critical`.

### Step 5: Save Changes

Overwrite original files with improved versions:
- Keep same file names and directory structure.
- Preserve all original test/suite IDs.

### Step 6: Show Final Summary

Output a summary of what was improved:
- Number of files modified.
- Number of tests improved.
- Key improvements made.
- Next steps for the user.

---

## References

| Description | File |
|-------------|------|
| Test Management Tool Format Reference | ./references/TESTOMAT_MARKDOWN_EXAMPLE.md |

---

## Error Handling

### Recoverable Situations

* **No test files found in common locations**
  - Ask user to specify test directory path
  - Or scan entire project for .md files containing test content

* **Unclear test intent**
  - Ask user to clarify what the test is supposed to verify
  - Do not guess or assume test purpose

* **Ambiguous improvements**
  - Present options to user
  - Ask for clarification before making changes

### Blocking Issues

* **Missing test content**
  - Stop and inform user that no valid test cases found
  - Ask user to provide test files

---

## Examples

**Improve all test cases:**
```
Use improve-manual-cases to enhance my test descriptions
```

**Standardize test format:**
```
Use improve-manual-cases to standardize all test cases to Testomat.io format
```

**Improve specific folder:**
```
Use improve-manual-cases to improve test cases from the "./manual-test" folder only
```

**Improve specific file:**
```
Use improve-manual-cases to improve test cases from the "./manual-test/home-page.test.md" file
```

---

## Quick Actions

| Action | Description |
|--------|-------------|
| Analyze | Scan test files and identify issues |
| Summary | Show user what can be improved |
| Improve | Apply fixes to test cases |
| Save | Write improved versions to disk |
