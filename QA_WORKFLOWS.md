# QA Workflows Using Testomatio Skills

A practical guide for QA engineers showing how to use skills in real testing scenarios.

---

## 1. 🚀 New Feature Testing Workflow

**Scenario**: A new feature is being developed. You need to create comprehensive tests.

### Workflow Steps

```
1. Understand Feature Requirements
   └─ Get requirements doc, design mockup, user story

2. Generate Test Cases
   └─ Use: generate-cases skill
      • Input: Requirements/design
      • Output: Checklist + detailed test cases
      • Time: 15-20 min (vs. 4-6 hours manual)

3. Review & Refine Tests
   └─ Improve: improve-test-cases skill
      • Input: Generated test cases
      • Output: Polished, standardized tests
      • Time: 10-15 min

4. Upload to Testomat.io
   └─ Use: sync-cases skill
      • Input: Markdown test files
      • Output: Tests in TMS
      • Time: 2-3 min

5. Set Up Automation
   └─ Use: automate-test-cases skill
      • Input: Test cases
      • Output: Automated test scripts
      • Time: 30-45 min per test

6. Configure Reporting
   └─ Use: reporter-setup skill
      • Input: Project framework info
      • Output: Reporting configured
      • Time: 10-15 min (one-time)

Total Time: ~2-3 hours (vs. 3-4 days manual)
```

### Output
✅ Comprehensive test cases in Testomat.io  
✅ Automated tests running in CI/CD  
✅ Test results visible to the team  

---

## 2. 🔄 Bulk Test Improvement Workflow

**Scenario**: You have 100+ legacy test cases that are poorly documented and inconsistent.

### Workflow Steps

```
1. Assess Current State
   └─ Use: project-scan skill
      • Identify all test files
      • Count manual tests
      • Time: 5 min

2. Find Duplicates
   └─ Use: find-duplicate-cases skill
      • Identify redundant tests
      • Get merge recommendations
      • Time: 10-15 min

3. Remove/Merge Duplicates
   └─ Manual action
      • Execute recommendations
      • Time: 1-2 hours (saved 8+ hours of analysis)

4. Improve Remaining Tests
   └─ Use: improve-test-cases skill
      • Standardize format
      • Clarify ambiguous steps
      • Fix markdown issues
      • Time: 20-30 min (vs. 2-3 days)

5. Upload to Testomat.io
   └─ Use: sync-cases skill
      • Push improved tests
      • Time: 3-5 min

Total Time: ~3-4 hours (vs. 3-4 weeks manual)
```

### Output
✅ Clean, standardized test suite  
✅ 20-30% fewer redundant tests  
✅ Tests ready for automation or TMS  

---

## 3. 🎯 Quick Feature Test Checklist Workflow

**Scenario**: Friday before release - need a quick test checklist for a small feature.

### Workflow Steps

```
1. Quick Checklist Generation
   └─ Use: generate-cases skill
      • Input: Simple feature description
      • Coverage: "Smoke" (minimal)
      • Output: Quick checklist (5-10 items)
      • Time: 2-5 min

2. Execute Tests Manually
   └─ Go test the feature
      • Use checklist as guide
      • Time: 10-30 min

3. Optional: Expand Coverage
   └─ Use: generate-cases skill again
      • Coverage: "Balanced" or "Exhaustive"
      • Get more edge cases
      • Time: 5-10 min

Total Time: ~20-40 min (vs. 1-2 hours planning manually)
```

### Output
✅ Quick, structured testing  
✅ Comprehensive coverage with minimal effort  
✅ Clear test documentation  

---

## 4. 🏗️ Full Test Automation Setup Workflow

**Scenario**: Starting test automation from scratch for a mature project.

### Workflow Steps

```
1. Scan Project
   └─ Use: project-scan skill
      • Detect framework (Playwright, Jest, etc.)
      • Identify existing tests
      • Time: 5 min

2. Set Up Reporting
   └─ Use: reporter-setup skill
      • Auto-detect framework
      • Install reporter package
      • Configure reporting
      • Time: 10-15 min (vs. 4-8 hours manual)

3. Pull Existing Manual Tests
   └─ Use: sync-cases skill
      • Pull from Testomat.io
      • Time: 2-3 min

4. Automate Key Flows
   └─ Use: automate-test-cases skill
      • Convert manual → automated
      • Run & verify
      • Time: 30-45 min per test

5. Create Coverage Maps
   └─ Use: automation-coverage skill
      • Map tests to source code
      • Generate coverage.e2e.yml
      • Time: 15-20 min

6. Verify Setup
   └─ Run tests locally and in CI
      • Time: 10-15 min

Total Time: ~3-4 hours (vs. 2-3 days manual setup)
```

### Output
✅ Automated tests in CI/CD  
✅ Reporting configured and working  
✅ Coverage mappings for smart test selection  

---

## 5. 🐛 Fix Failing Test Workflow

**Scenario**: A test passed locally but fails in CI. Need to fix it fast.

### Workflow Steps

```
1. Diagnose Failure
   └─ Use: automation-debug-tests skill
      • Analyze error type
      • Check DOM, logs, screenshots
      • Identify root cause
      • Time: 5-10 min (vs. 30+ min manual)

2. Apply Fix
   └─ automation-debug-tests continues
      • Update locators / timing / assertions
      • Auto-heals up to 3 times
      • Time: 5-10 min

3. Verify Fix
   └─ Re-run test
      • Check it passes consistently
      • Time: 2-3 min

4. Document
   └─ Understand what broke and why
      • Time: 2-3 min

Total Time: ~15-20 min (vs. 2-4 hours manual)
```

### Output
✅ Fixed, stable test  
✅ Understanding of root cause  
✅ Confidence in CI/CD  

---

## 6. 📊 Smart Regression Testing Workflow

**Scenario**: PR changes only checkout flow. Don't want to run full 2-hour test suite.

### Workflow Steps

```
1. Setup Coverage Maps (one-time)
   └─ Use: manual-coverage skill
      • Map manual tests to code
      • Generate coverage.manual.yml
      • Time: 20-30 min (one-time setup)

2. Generate E2E Coverage (one-time)
   └─ Use: automation-coverage skill
      • Map e2e tests to code
      • Generate coverage.e2e.yml
      • Time: 20-30 min (one-time setup)

3. Run Smart Regression
   └─ For any PR:
      • Run: npx reporter run --filter "coverage:file=coverage.e2e.yml,diff=main"
      • Automatically runs only affected tests
      • Time: 5-15 min (vs. 2 hours)

Per PR Time: ~10 min (vs. 2+ hours)
```

### Output
✅ Only relevant tests run  
✅ 10-15x faster feedback  
✅ Lower CI cost  
✅ Developers get instant feedback  

---

## 7. 🔗 Map Tests to Requirements Workflow

**Scenario**: You need to show which tests cover which requirements.

### Workflow Steps

```
1. Scan Project
   └─ Use: project-scan skill
      • Understand test structure
      • Time: 5 min

2. Create Manual Coverage Map
   └─ Use: manual-coverage skill
      • Analyze test steps
      • Map to source code areas
      • Generate coverage.manual.yml
      • Time: 20-30 min

3. Create Automation Coverage Map
   └─ Use: automation-coverage skill
      • Analyze e2e tests
      • Map to code areas
      • Generate coverage.e2e.yml
      • Time: 20-30 min

4. Create Traceability Report
   └─ Manual or tool-based
      • Show requirements → tests mapping
      • Identify coverage gaps
      • Time: 30-45 min

Total Time: ~2 hours (vs. 1-2 days manual analysis)
```

### Output
✅ Traceability matrix  
✅ Clear coverage visibility  
✅ Gap analysis  
✅ Compliance documentation  

---

## 8. 🎭 Multi-Role Test Coverage Workflow

**Scenario**: Need different test scenarios for different user perspectives.

### Workflow Steps

```
1. Generate Default Tests
   └─ Use: generate-cases skill
      • Select role: Default (⚙️)
      • Generate happy path tests
      • Time: 15-20 min

2. Generate Pessimist Tests
   └─ Use: generate-cases skill again
      • Select role: Pessimist (😈)
      • Generate error scenarios
      • Time: 15-20 min

3. Generate User-Centric Tests
   └─ Use: generate-cases skill again
      • Select role: User (🎭)
      • Generate real user workflows
      • Time: 15-20 min

4. Combine & Upload
   └─ Use: improve-test-cases + sync-cases
      • Consolidate all tests
      • Remove actual duplicates
      • Upload to Testomat.io
      • Time: 20-30 min

Total Time: ~1.5-2 hours (vs. 1-2 days with different perspectives)
```

### Output
✅ Comprehensive test coverage  
✅ Multiple perspectives covered  
✅ Happy path + edge cases + user scenarios  

---

## 9. 📱 Prepare Tests for Automation Workflow

**Scenario**: Manual test suite is ready, now convert to automation.

### Workflow Steps

```
1. Audit Existing Tests
   └─ Use: find-duplicate-cases skill
      • Find duplicates before automating
      • Remove redundant tests
      • Time: 10-15 min (saves 10+ hours later)

2. Improve Test Quality
   └─ Use: improve-test-cases skill
      • Clarify ambiguous steps
      • Standardize format
      • Time: 20-30 min

3. Automate Core Flows
   └─ Use: automate-test-cases skill
      • Prioritize: critical + frequently-used tests
      • Convert to automation
      • Time: 30-45 min per test

4. Debug & Stabilize
   └─ Use: automation-debug-tests skill
      • Fix any failures
      • Stabilize flaky tests
      • Time: 5-10 min per test

Total Time: ~3-4 hours for 5-6 tests (vs. 1-2 days)
```

### Output
✅ Stable, maintainable automated tests  
✅ No wasted effort on duplicate automation  
✅ High quality before automation  

---

## 10. 🔍 Pre-Release Quality Check Workflow

**Scenario**: Before release, ensure test coverage and quality is good.

### Workflow Steps

```
1. Scan for Framework & Tests
   └─ Use: project-scan skill
      • See what exists
      • Identify gaps
      • Time: 5 min

2. Find Duplicates
   └─ Use: find-duplicate-cases skill
      • Identify redundancy
      • Get cleanup recommendations
      • Time: 10-15 min

3. Analyze Coverage
   └─ Use: manual-coverage + automation-coverage skills
      • Map tests to code
      • Identify untested areas
      • Time: 30-40 min

4. Create Report
   └─ Manual:
      • Summary: Total tests, coverage %, gaps
      • Recommendations for coverage improvements
      • Time: 15-20 min

5. Fix Critical Gaps
   └─ Use: generate-cases skill
      • Generate tests for uncovered areas
      • Time: 20-30 min

Total Time: ~1.5-2 hours (vs. 1-2 days manual audit)
```

### Output
✅ Pre-release quality assessment  
✅ Coverage report  
✅ Risk areas identified  
✅ Ready-to-merge confidence  

---

## 11. 👥 Onboard New QA Team Member Workflow

**Scenario**: New QA engineer joining team. Need to get them up to speed.

### Workflow Steps

```
Day 1: Understanding the Project

1. Scan Project
   └─ Use: project-scan skill
      • Show all languages, frameworks, tests
      • Time: 5 min
      • Output: "Here's what exists"

2. Find Duplicates (informational)
   └─ Use: find-duplicate-cases skill
      • Explain code organization
      • Time: 10-15 min
      • Output: "This is our test landscape"

Day 2-3: Create Tests

3. Generate Sample Test Cases
   └─ Use: generate-cases skill
      • Generate tests for a small feature
      • Learn the skill
      • Time: 20-30 min

4. Improve Tests
   └─ Use: improve-test-cases skill
      • See best practices applied
      • Time: 10-15 min

5. Upload to TMS
   └─ Use: sync-cases skill
      • See workflow end-to-end
      • Time: 5 min

Day 4-5: Automation Basics

6. Set Up Reporting
   └─ Use: reporter-setup skill
      • See automation infrastructure
      • Time: 10-15 min

7. Automate a Test
   └─ Use: automate-test-cases skill
      • Hands-on automation
      • Time: 30-45 min

8. Fix a Failing Test
   └─ Use: automation-debug-tests skill
      • Debugging skills
      • Time: 15-20 min

Total Time: ~3-4 hours training + 2-3 hours hands-on
```

### Output
✅ New team member comfortable with skills  
✅ Understands testing landscape  
✅ Can generate, improve, and automate tests  
✅ Ready to contribute independently  

---

## 12. 📈 Continuous Improvement Workflow

**Scenario**: Recurring process to keep test suite healthy.

### Workflow Steps (Monthly)

```
Week 1: Assessment

1. Scan Project
   └─ Use: project-scan skill
      • Check test count trends
      • Time: 5 min

2. Find Duplicates
   └─ Use: find-duplicate-cases skill
      • Identify new duplicates
      • Time: 10-15 min

Week 2: Cleanup

3. Remove Duplicates
   └─ Manual execution of recommendations
      • Time: 30-60 min

4. Improve Quality
   └─ Use: improve-test-cases skill
      • Address new quality issues
      • Time: 15-20 min

Week 3: Coverage Analysis

5. Update Coverage Maps
   └─ Use: manual-coverage + automation-coverage skills
      • Refresh code-to-test mappings
      • Time: 20-30 min

Week 4: Reporting & Planning

6. Generate Report
   └─ Manual:
      • Test metrics
      • Coverage trends
      • Improvement recommendations
      • Time: 15-20 min

Total Monthly Time: ~2-3 hours (automated, repeatable)
```

### Output
✅ Healthy, efficient test suite  
✅ Continuous quality improvement  
✅ Metrics tracking  
✅ Data-driven decisions  

---

## Quick Reference: Skill Use Cases by Frequency

### Daily Use
- **automation-debug-tests**: When tests fail in CI/CD
- **project-scan**: When exploring unfamiliar code

### Weekly Use
- **generate-cases**: Creating tests for new features
- **improve-test-cases**: Polishing test documentation
- **automate-test-cases**: Converting manual to automated

### Monthly Use
- **find-duplicate-cases**: Quality audit
- **manual-coverage**: Coverage analysis
- **automation-coverage**: Coverage optimization

### Setup (One-time)
- **reporter-setup**: Initial project configuration
- **sync-cases**: First sync to Testomat.io
- **testomatio-flow**: Planning testing strategy

---

## Time Savings Summary

| Workflow | Manual Time | With Skills | Savings |
|----------|------------|-------------|---------|
| New feature testing | 3-4 days | 2-3 hours | **90%** |
| Bulk test improvement | 3-4 weeks | 3-4 hours | **95%** |
| Test automation setup | 2-3 days | 3-4 hours | **80%** |
| Fix failing test | 2-4 hours | 15-20 min | **85%** |
| Smart regression | 2 hours per PR | 10 min | **90%** |
| Coverage analysis | 1-2 days | 1-2 hours | **85%** |

---

## Pro Tips for QA Engineers

### 1. **Always Start with project-scan**
   - Understand what exists first
   - Identify frameworks and current tests
   - Avoid duplicating work

### 2. **Find Duplicates Before Improving**
   - Run find-duplicate-cases before improve-test-cases
   - Save effort improving tests you'll delete anyway

### 3. **Leverage Coverage Maps**
   - Set up once, use forever
   - Makes PR testing 10x faster

### 4. **Use Smoke Tests for Quick Checks**
   - generate-cases with "Smoke" coverage for Friday afternoon testing
   - 2-5 minute quick checklist

### 5. **Combine Skills for Maximum Efficiency**
   - generate → improve → sync → automate is a powerful pipeline
   - Use testomatio-flow to guide the process

### 6. **Automate Debugging**
   - Don't manually debug failing tests
   - Let automation-debug-tests do the analysis
   - You review and approve the fix

### 7. **Keep Testomat.io in Sync**
   - Use sync-cases regularly
   - Pull, edit, push workflow is powerful
   - TMS becomes source of truth

### 8. **Review AI Output, Don't Trust Blindly**
   - Skills are 90%+ accurate
   - Always review generated tests
   - Flag edge cases the AI might have missed

---

## Workflow Decision Tree

```
What do you need to do?

├─ Create new tests?
│  └─ Use: generate-cases
│     └─ Then: improve-test-cases → sync-cases
│
├─ Improve existing tests?
│  └─ Use: find-duplicate-cases first
│     └─ Then: improve-test-cases → sync-cases
│
├─ Automate tests?
│  └─ Use: automate-test-cases
│     └─ If fails: automation-debug-tests
│
├─ Fix failing test?
│  └─ Use: automation-debug-tests
│
├─ Understand project?
│  └─ Use: project-scan
│
├─ Optimize test execution?
│  └─ Use: manual-coverage + automation-coverage
│
├─ Set up reporting?
│  └─ Use: reporter-setup (one-time)
│
└─ Manage complete lifecycle?
   └─ Use: testomatio-flow
```

---

## Common Questions

**Q: When should I use generate-cases vs. testomatio-flow?**
A: Use generate-cases for focused test creation. Use testomatio-flow when you need end-to-end guidance through the entire testing workflow.

**Q: How often should I run find-duplicate-cases?**
A: Monthly during continuous improvement, or before major refactoring. Also before migrating to new TMS.

**Q: Do I need to set up coverage maps?**
A: Only if you want smart test selection and faster CI/CD. One-time setup, huge payoff for large test suites.

**Q: Can I use these skills for API testing?**
A: Most skills work for manual tests. For automation, focus on framework support (Playwright, CodeceptJS, Jest, Pytest, etc.).

**Q: What if a skill makes a mistake?**
A: Review output before committing. Skills are ~90% accurate. Flag issues for improvement and manually fix critical items.

