# Quality Criteria Definitions

This document defines the quality assessment criteria for evaluating both automation and manual test cases.

---

## Automation Test Criteria

Evaluate each automation test using these criteria. Each criterion has a max point value and defined scoring levels.

### 1. Test Logic Clarity

- **Key:** Test Logic Clarity
- **Max Points:** 3
- **Description:** How clearly the test expresses its purpose and flow. Are test scenarios easy to interpret without deep digging into the code?

**Scoring Levels:**

| Points | Label | Description |
|--------|-------|-------------|
| 3 | ✅ Logical and easy to follow | Test flow is clear, purpose is obvious |
| 2 | 🔶 Some unclear or ambiguous steps | Some parts require investigation to understand |
| 1 | ❌ Confusing or hard-to-understand flow | Purpose or flow is difficult to discern |

---

### 2. Code Maintainability & Structure

- **Key:** Code Maintainability & Structure
- **Max Points:** 3
- **Description:** How clean, organized, and maintainable the test code is — focusing on structure, naming, and reuse.

**Scoring Levels:**

| Points | Label | Description |
|--------|-------|-------------|
| 3 | ✅ Well-structured and easy to maintain | Clean code, good naming, reusable patterns |
| 2 | 🔶 Some duplication or inconsistent structure | Minor issues with organization or naming |
| 1 | ❌ Hard to modify or poorly organized | Significant maintainability concerns |

---

### 3. Code Smells & Stability

- **Key:** Code Smells & Stability
- **Max Points:** 2
- **Description:** Whether the code contains fragile waits, hardcoded data, or patterns that could cause instability.

**Scoring Levels:**

| Points | Label | Description |
|--------|-------|-------------|
| 2 | ✅ Stable and free of code smells | No fragile patterns detected |
| 1 | 🔶 Some fragile waits or hardcoded data | Minor stability concerns |
| 0 | ❌ Brittle code or poor error handling | Significant stability issues |

---

### 4. Assertion Quality & Coverage

- **Key:** Assertion Quality & Coverage
- **Max Points:** 2
- **Description:** How effectively assertions verify expected behavior and validate outcomes.

**Scoring Levels:**

| Points | Label | Description |
|--------|-------|-------------|
| 2 | ✅ Clear and meaningful assertions | Assertions properly validate outcomes |
| 1 | 🔶 Some redundant or vague checks | Some unclear or redundant assertions |
| 0 | ❌ Missing or irrelevant validations | Missing or ineffective assertions |

---

## Manual Test Criteria

Evaluate each manual test case using these criteria. Each criterion has a max point value and defined scoring levels.

### 1. Title Clarity

- **Key:** Title Clarity
- **Max Points:** 2
- **Description:** Evaluates if the test case title is specific, clear, and meaningful, or if it is vague/missing.
- **Context:** Does the title accurately reflect the purpose and scope of the test case and suite?

**Scoring Levels:**

| Points | Label | Description |
|--------|-------|-------------|
| 2 | ✅ Clear & meaningful | Title is specific and descriptive |
| 1 | ⚠️ Partially unclear or incomplete | Title exists but lacks clarity |
| 0 | ❌ Missing or meaningless | No title or meaningless title |

---

### 2. Steps Defined

- **Key:** Steps Defined
- **Max Points:** 2
- **Description:** Evaluates whether the test steps are clear, sequential, and logically structured.
- **Context:** Do the steps clearly describe how to execute the test and align with the test objective?

**Scoring Levels:**

| Points | Label | Description |
|--------|-------|-------------|
| 2 | ✅ Clear, complete, and logical | Steps are well-defined and sequential |
| 1 | ⚠️ Partially incomplete or unclear | Some steps missing or unclear |
| 0 | ❌ Missing or insufficient | No steps or insufficient detail |

---

### 3. Expected Results

- **Key:** Expected Results
- **Max Points:** 2
- **Description:** Checks if the expected results are explicitly stated, measurable, and relevant to the steps.
- **Context:** Do the expected results align with the described steps and reflect the intended outcome?

**Scoring Levels:**

| Points | Label | Description |
|--------|-------|-------------|
| 2 | ✅ Clear & measurable | Results are explicit and measurable |
| 1 | ⚠️ Partially unclear or incomplete | Some results stated but unclear |
| 0 | ❌ Missing or vague | No expected results or very vague |

---

### 4. Viability

- **Key:** Viability
- **Max Points:** 2
- **Description:** Assesses whether the test case is executable, coherent, contextually relevant, and free from gaps or contradictions.
- **Context:** Is the test case logically consistent, relevant to the suite, and practically executable without blocking issues?

**Scoring Levels:**

| Points | Label | Description |
|--------|-------|-------------|
| 2 | ✅ Fully viable and coherent | Test can be executed as designed |
| 1 | ⚠️ Partially viable with minor gaps | Some issues but generally executable |
| 0 | ❌ Not viable, incoherent, or impossible | Cannot be executed as designed |

---

### 5. Unambiguity

- **Key:** Unambiguity
- **Max Points:** 2
- **Description:** Evaluates whether test steps and expected results use precise, testable, and unambiguous language, avoiding generic or subjective terms.
- **Context:** Are the steps and expected results written in a way that any tester would interpret and execute them the same way?

**Scoring Levels:**

| Points | Label | Description |
|--------|-------|-------------|
| 2 | ✅ Unambiguous and testable | Language is precise and testable |
| 1 | ⚠️ Some ambiguity or generic wording | Some terms are vague |
| 0 | ❌ Ambiguous, subjective, or open to interpretation | Multiple interpretations possible |

---

## Analysis Rules

### For Automation Tests

- Evaluate only code clarity, maintainability, stability, and assertion quality
- Do NOT assess functional correctness or rewrite code
- Score each criterion and calculate weighted average
- Identify specific issues for "Top Tests For Improvements"

### For Manual Test Cases

- Parse markdown structure to identify test steps and expected results
- Score each criterion per test case
- Calculate aggregate scores per dimension