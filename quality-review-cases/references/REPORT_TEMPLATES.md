# Report Templates

This document contains templates for generating Quality Review reports.

---

## Quality Report Overview Template

Use this template to compile all findings into a structured Quality Report.

```md
# Test Quality Report Overview

**Date:** [YYYY-MM-DD]
**Scope:** [Path to test files]
**Key Metrics:**
    - Total test cases: [N]
    - Automated: [N] ([X]%)
    - Manual only: [N] ([X]%)
    - Tests with expected results on all steps: [N] ([X]%)
    - Tests with tags: [N] ([X]%)
**Overall Score:** [X.X] / 10.0 ⭐⭐⭐

## Manual Key Quality Dimensions

| Dimension | Score | Status |
|-----------|-------|--------|
| Title Clarity | X.X/10 | ... |
| Steps Defined | X.X/10 | ... |
| Expected Results | X.X/10 | ... |
| Viability | X.X/10 | ... |
| Unambiguity | X.X/10 | ... |

## Automation Key Quality Dimensions

| Dimension | Score | Status |
|-----------|-------|--------|
| Test Logic Clarity | X/10 | ... |
| Code Maintainability | X/10 | ... |
| Code Smells & Stability | X/10 | ... |
| Assertion Quality | X/10 | ... |

## Top 5 Tests For Improvements

### 1. 🔴 [Test Name] [Path]
**Impact:** [High/Medium/Low] — [Description of issue]
**Recommendation:** [Specific action to improve]

### 2. 🟡 [Test Name] [Path]
...

## Improvement Roadmap

### Stage 1 (Critical)
- [ ] [Action item 1]
- [ ] [Action item 2]

### Stage 2 (Important)
- [ ] [Action item 1]
- [ ] [Action item 2]

### Stage 3 (Nice to Have)
- [ ] [Action item 1]
```

---

## Scoring Methodology

### Overall Score Calculation

**Automation Tests Score (0-10):**
```
(Logic Score / 3 * 25) + (Structure Score / 3 * 25) + (Smell Score / 2 * 25) + (Coverage Score / 2 * 25)
```

**Manual Tests Score (0-10):**
```
(Title Score / 2 * 20) + (Steps Score / 2 * 20) + (Results Score / 2 * 20) + (Viable Score / 2 * 20) + (Clarity Score / 2 * 20)
```

**Combined Score:**
```
(Automation Count * Auto Score + Manual Count * Manual Score) / Total Count
```

### Health Rating Thresholds

| Score Range | Rating |
|-------------|--------|
| 8.0 - 10.0 | ⭐⭐⭐⭐⭐ Excellent |
| 6.0 - 7.9  | ⭐⭐⭐⭐ Good |
| 4.0 - 5.9  | ⭐⭐⭐ Fair |
| 2.0 - 3.9  | ⭐⭐ Poor |
| 0.0 - 1.9  | ⭐ Critical |

---

## Quick Commands Reference

| Action | Command |
|--------|---------|
| Full Review | Use quality-review-cases skill on `/tests` directory |
| Quick Scan | Review only automation tests |
| Manual Only | Review only `.md` test cases |
| Summary | Generate executive summary only |

---