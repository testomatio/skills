---
name: improve-cases
description: Analyze and improve existing markdown manual test cases for clarity, structure, and Test Management Tool format compliance.
---

## IMPROVE-CASES SKILL: What I do

Analyze and improve existing markdown manual test cases to make them clearer and more understandable for QA team:
- Improve test titles for clarity.
- Enhance test descriptions.
- Fix broken formatting and markdown syntax issues.
- Standardize test structure to Test Management Tool format.
- Ensure consistent terminology and language.
- Update tags and labels.

**CRITICAL - DO NOT CHANGE:**
- Original test/suite IDs
- Original test intent
- Original language (fix only clarity/grammar)

If any unclear state => ask user to clarify what they want!

---

## Error Handling

### Recoverable Situations

Attempt recovery before failing when:
- No test files found in common locations => ask user to specify test directory path.
- No readable test content found => ask user to clarify location.

### Hard Fail (STOP immediately)

Stop execution and return a clear human-readable error if:
- Cannot find or read test files after clarification.
- Cannot parse or understand test structure.

**Do not retry automatically**.
**Do NOT continue after system-level failure**.
**Return a clear human-readable error message describing the actual failure**.

---

## Improve-Cases Actions: What I execute

Analyze the project folder to find existing manual markdown test files.
Read test cases and analyze current format, quality, and possible issues for improving.

### 1. Analyze Test Quality

For each test, analyze parent/child tests and suite context, then identify issues:

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
- Broken markdown syntax
- Missing sections
- Inconsistent header hierarchy

**Unambiguity:**
- Generic or subjective terms ("should work", "might fail")
- Vague language that could be interpreted multiple ways
- Steps that cannot be verified objectively
- Missing specific values, data, or conditions

### 2. Improve Tests

First analyze the test suite context (parent suite, related tests), then apply improvements:

**Title Improvements:**
- Make clear and specific.
- Use action-result format: "Verify [action] results in [expected]".
- Ensure title reflects actual test purpose.

**Description Improvements:**
- Make purpose clear and concise.
- Include context from parent suite when relevant.
- Fix grammar and spelling only.

**Step Improvements:**
- Ensure each step has explicit Expected Result.
- Make actions specific and reproducible.
- Add measurable pass/fail criteria.
- Use numbered steps with clear order.
- Ensure results are directly relevant to the step action.
- Make results measurable and verifiable.
- Avoid vague terms - use specific values/conditions.

**Unambiguity Improvements:**
- Replace generic terms with specific, testable language.
- Avoid subjective terms ("should work", "might fail").
- Include specific data values, boundaries, or conditions.
- Ensure steps can be verified objectively.

### 3. Save Changes

Overwrite original files with improved versions. Keep same file names and directory structure.

---

## Reference Format

Use file: `./templates/TESTOMAT_MARKDOWN_EXAMPLE.md` as reference for proper Test Management Tool format.

---

## Example Real Usage

**Improve test descriptions:**
```
Use improve-cases to enhance my test descriptions
```

**Standardize test format:**
```
Use improve-cases to standardize all test cases to Testomat.io format
```

**Improve specific area:**
```
Use improve-cases to improve test clarity in login tests
```

**Improve specific folder:**
```
Use improve-cases to improve test cases from the the "./manual-test" folder only
```

**Improve specific file:**
```
Use improve-cases to improve test cases from the the "./manual-test/home-page.test.md" file
```
