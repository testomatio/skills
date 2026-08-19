# User Stories & Workflows for Testomatio AI Skills

## Overview

This document provides detailed Business Analyst perspective on each skill including user stories, workflows, and value propositions.

---

## 1. 🎯 GENERATE-CASES Skill

### Purpose
Generate comprehensive test cases and checklists for software testing from requirements, user stories, designs, or freestyle input.

### User Stories

**Story 1.1: QA Engineer Creates Test Cases from Ticket**
- **As a** QA Engineer
- **I want to** generate test cases from a Jira ticket
- **So that** I have structured test coverage without manual documentation

**Story 1.2: Product Manager Validates User Flows**
- **As a** Product Manager
- **I want to** create a comprehensive checklist for a feature from a design mockup
- **So that** I ensure all user journeys are covered before development

**Story 1.3: Dev Team Plans Testing Strategy**
- **As a** Development Team Lead
- **I want to** generate different coverage levels (smoke, balanced, exhaustive)
- **So that** I can match testing scope to sprint capacity

### Workflow

```
Step 1: Gather Context & Goals
├─ User provides: requirements, ticket, design, or freestyle description
├─ Skill analyzes context
├─ User approves: sources and any additions

Step 2: Select Coverage Scope
├─ 🚀 Smoke Test (minimal coverage)
├─ ⚖️  Balanced (comprehensive)
├─ 🧨 Exhaustive (maximum coverage)
└─ User selects scope

Step 3: Choose Role/Perspective (Optional)
├─ ⚙️  Default (Happy path)
├─ 🔍 QA Lead (Quality-focused)
├─ 😈 Pessimist (Edge cases)
├─ 🎭 User (User-centric)
└─ User selects role or keeps default

Step 4: Generate & Approve Checklist
├─ Skill generates categorized checklist
├─ User reviews and approves/modifies
└─ User confirms ready for test cases

Step 5: Generate Detailed Test Cases
├─ Skill converts checklist to markdown test cases
├─ Each test case includes: title, description, steps, expected results
└─ Test cases ready for use/upload
```

### Output
- Structured checklist with categorized test items
- Markdown test cases in Testomatio format
- Optional: Test case IDs and metadata

### Value Proposition
- **Saves time**: 4-6 hours of manual test case writing per feature
- **Ensures consistency**: Standardized format across team
- **Improves coverage**: No missed user flows or edge cases
- **Enables collaboration**: Clear, structured documentation

---

## 2. 📝 IMPROVE-TEST-CASES Skill

### Purpose
Enhance existing markdown manual test cases for clarity, structure, and compliance with Test Management Tool format.

### User Stories

**Story 2.1: QA Lead Standardizes Legacy Test Cases**
- **As a** QA Lead
- **I want to** standardize all manually-written test cases to TMS format
- **So that** the team has consistent documentation and can easily search/filter

**Story 2.2: Test Author Fixes Formatting Issues**
- **As a** Test Author
- **I want to** improve clarity of ambiguous test steps
- **So that** other QA engineers can execute tests without confusion

**Story 2.3: Quality Audit Before Migration**
- **As a** QA Manager
- **I want to** audit test cases before importing to new TMS
- **So that** we don't carry forward quality issues

### Workflow

```
Step 1: Locate Test Files
├─ Scan common directories: ./manual-tests, ./tests/manual, ./docs/tests
└─ Ask user if no files found

Step 2: Analyze Test Quality
├─ Title clarity (vague vs. specific)
├─ Description completeness
├─ Step formatting & ordering
├─ Expected results clarity
├─ Metadata consistency
└─ Generate issue summary

Step 3: Show Summary & Get Approval
├─ Display issues found per test
├─ Show specific recommendations
└─ Wait for user confirmation

Step 4: Apply Improvements
├─ Clarify titles to action-result format
├─ Enhance descriptions
├─ Fix markdown syntax
├─ Ensure expected results per step
├─ Standardize metadata
└─ Preserve original test IDs

Step 5: Save & Summarize
├─ Overwrite original files with improved versions
├─ Report: files modified, tests improved, key improvements
└─ Suggest next steps
```

### Output
- Improved markdown test files
- Summary of changes made
- Ready for upload to TMS

### Common Improvements
- Unclear title → "Verify user can save profile with valid data"
- Missing expected results → Added specific, measurable outcomes
- Inconsistent formatting → Standardized to TMS markdown
- Vague language → Replaced subjective terms with specific conditions

### Value Proposition
- **Improves executability**: Tests are clear and unambiguous
- **Reduces execution time**: QA spends less time interpreting steps
- **Enables automation**: Clear tests are easier to automate
- **Professional quality**: Standardized format for stakeholder presentations

---

## 3. 🔍 FIND-DUPLICATE-CASES Skill

### Purpose
Detect and manage duplicate, near-duplicate, and overlapping test cases; provide cleanup recommendations.

### User Stories

**Story 3.1: QA Lead Audits Test Suite**
- **As a** QA Lead
- **I want to** identify duplicate tests across our manual and automated test suites
- **So that** we reduce maintenance burden and avoid redundant execution

**Story 3.2: Consultant Evaluates Test Quality**
- **As a** QA Consultant
- **I want to** analyze a large test suite for redundancy
- **So that** I can recommend consolidation and improve team efficiency

**Story 3.3: Team Prepares for TMS Migration**
- **As a** QA Team
- **I want to** clean up tests before migrating to new TMS
- **So that** we start fresh without technical debt

### Workflow

```
Step 1: Detect Test Files
├─ Identify manual tests (*.test.md, *.feature)
├─ Identify automated tests (*.spec.ts, *.test.js, *.cy.js)
└─ Parse test metadata: title, steps, expected results, tags

Step 2: Analyze for Duplicates
├─ Normalize content (lowercase, remove punctuation, ignore framework syntax)
├─ Compare: title, steps, expected results, preconditions, tags
├─ Calculate similarity scores
├─ Classify into levels:
│  ├─ Level 1: Exact duplicates (identical titles)
│  ├─ Level 2: Semantic duplicates (same intent, similar steps)
│  ├─ Level 3: Overlapping/Subset (superset/subset relationship)
│  └─ Level 4: Redundant variations (same logic, different data)
└─ Build duplicate groups

Step 3: Generate Report
├─ Summary statistics
├─ Duplicate groups with:
│  ├─ All related tests
│  ├─ Similarity percentage
│  ├─ Detection level
│  ├─ Proposed canonical test
│  └─ Recommendation (keep/merge/remove)
└─ Wait for user approval

Step 4: Execute Actions
├─ Merge: Combine into one test, retain metadata from all
├─ Remove: Delete duplicates, add reference in canonical
├─ Keep: Document relationship with cross-references
└─ Preserve all traceability metadata
```

### Output
- Duplicate analysis report
- Classification and recommendations
- Merged/cleaned test suite

### Value Proposition
- **Reduces maintenance**: 20-30% fewer tests to maintain
- **Faster test runs**: Eliminates redundant execution
- **Better coverage**: Real coverage visibility without noise
- **Team efficiency**: QA focuses on new scenarios, not duplicates

---

## 4. 🔄 SYNC-CASES Skill

### Purpose
Synchronize test cases between local Markdown files and Testomat.io Test Management System.

### User Stories

**Story 4.1: QA Team Bulk Edits Tests Offline**
- **As a** QA Team
- **I want to** pull test cases from Testomat.io, edit them in my IDE, and push them back
- **So that** I can use powerful IDE features for bulk editing

**Story 4.2: Developer Imports Generated Tests**
- **As a** Developer
- **I want to** generate test cases locally and upload them to Testomat.io
- **So that** the team can see the tests in our TMS immediately

**Story 4.3: Backup & Version Control**
- **As a** QA Manager
- **I want to** maintain local backups of tests from Testomat.io
- **So that** we have version history and disaster recovery

### Workflow - Pull Operation

```
Step 1: Setup Environment
├─ Check for TESTOMATIO token in .env
├─ If missing, ask user for API key
└─ Save token to .env file

Step 2: Pull Tests
├─ Ensure .testclaw-context/ directory exists
├─ Add .testclaw-context/ to .gitignore if needed
├─ Run: npx check-tests pull -d .testclaw-context/manual-tests
└─ Tests downloaded as markdown files

Step 3: Summary
├─ Number of tests pulled
├─ File locations
└─ Ready for editing
```

### Workflow - Push Operation

```
Step 1: Validate Files
├─ Check for *.test.md files
├─ Verify valid test blocks (<!-- test ... -->)
├─ Exclude documentation files (README, docs/)
└─ Build list of files to push

Step 2: Push Tests
├─ Run: npx check-tests push --files <files>
└─ Tests uploaded to Testomat.io

Step 3: Summary
├─ Number of tests pushed
├─ Status of each test (created/updated)
└─ Links to TMS
```

### Complete Workflow: Bulk Edit Cycle

```
1. Pull tests → 2. Edit locally → 3. Push back
```

### Output
- Markdown test files (pull)
- Uploaded tests in Testomat.io (push)
- Summary report

### Value Proposition
- **Flexible editing**: Use IDE for advanced editing tasks
- **Batch operations**: Update multiple tests at once
- **Version control**: Keep local copies in git
- **Team collaboration**: Merge changes from team members

---

## 5. 📊 MANUAL-COVERAGE Skill

### Purpose
Map manual test cases to source code files; generate `coverage.manual.yml` for affected-only test runs.

### User Stories

**Story 5.1: QA Lead Runs Selective Regression**
- **As a** QA Lead
- **I want to** run only manual tests affected by a code change
- **So that** we reduce regression testing time from 8 hours to 2 hours

**Story 5.2: DevOps Creates Smart Test Pipelines**
- **As a** DevOps Engineer
- **I want to** automatically select manual tests based on code diff in CI
- **So that** PR pipelines are faster and provide relevant feedback

**Story 5.3: QA Manager Tracks Traceability**
- **As a** QA Manager
- **I want to** see which manual tests cover which source files
- **So that** I can identify coverage gaps and validate completeness

### Workflow

```
Step 1: Discover Project
├─ Run project-scan skill
├─ Identify manual tests (.test.md files)
├─ Get codebase overview
└─ If no manual tests found, ask to pull from Testomat.io

Step 2: Extract Test Information
├─ Parse *.test.md files
├─ Extract: Suite IDs (@S), Test IDs (@T), Tags (@tag)
├─ Build mapping of test metadata to files
└─ If no IDs found, ask user to sync with Testomat.io first

Step 3: Explore Codebase
├─ Scan source files
├─ Identify code areas (auth, checkout, profile, etc.)
├─ Build code map
└─ Identify file patterns and naming conventions

Step 4: Map Tests to Code
├─ For each test, analyze steps and expected results
├─ Match test scenarios to source files they exercise
├─ Build mapping: source file → test IDs
├─ Handle edge cases and ambiguous mappings
└─ Get user approval for mappings

Step 5: Generate coverage.manual.yml
├─ Create YAML mapping file
├─ Format: source files/globs → suite/test IDs
├─ Validate coverage file
└─ Save to project root or specified path

Step 6: Summary
├─ Coverage statistics
├─ Identified gaps
├─ Recommendations
└─ Ready for use with reporter
```

### Output
- `coverage.manual.yml` file
- Coverage report (% of code covered)
- Gap analysis

### Coverage File Format
```yaml
src/auth/login.ts:
  - "@T12345abc"
  - "@tag.smoke"
  
src/checkout/**:
  - "@S87654def"
  - "@tag.critical"
```

### Value Proposition
- **Faster feedback**: Run only relevant tests
- **Better ROI on testing**: No time wasted on irrelevant tests
- **Traceability**: Clear requirements-to-code-to-test mapping
- **Quality insights**: Identify untested code areas

---

## 6. 🤖 AUTOMATION-COVERAGE Skill

### Purpose
Map automated e2e tests to source code files; generate `coverage.e2e.yml` for affected-only test runs.

### User Stories

**Story 6.1: CI/CD Pipeline Optimization**
- **As a** DevOps Engineer
- **I want to** run only e2e tests relevant to a PR change
- **So that** CI pipelines run 5x faster while maintaining quality

**Story 6.2: QA Team Prioritizes Test Execution**
- **As a** QA Lead
- **I want to** understand which e2e tests validate which features
- **So that** we can run the right tests at the right time

**Story 6.3: Traceability Matrix**
- **As a** QA Manager  
- **I want to** build a traceability matrix between code and e2e tests
- **So that** we can validate coverage against requirements

### Workflow (Similar to manual-coverage, but for automated tests)

```
Step 1: Discover Project
├─ Run project-scan skill
├─ Detect e2e framework (Playwright, Cypress, WebdriverIO, CodeceptJS)
├─ Identify e2e test files
└─ If no tests found, ask for git URL to clone tests repo

Step 2: Verify Testomatio IDs
├─ Check for @S/@T IDs in test code
├─ Example: describe('login @S123abc', () => {})
├─ If missing, instruct user to run: npx check-tests <framework> --update-ids
└─ Stop if IDs cannot be populated

Step 3-6: [Same as manual-coverage]
```

### Output
- `coverage.e2e.yml` file
- Used with: `@testomatio/reporter run --filter "coverage:file=coverage.e2e.yml,diff=main"`

### Value Proposition
- **Massive speed improvement**: 10-20x faster CI for large suites
- **Smart feedback**: Developers get relevant test results immediately
- **Cost savings**: Fewer test hours = lower infrastructure costs
- **Better quality**: Tests run more frequently, bugs caught sooner

---

## 7. 🔧 REPORTER-SETUP Skill

### Purpose
Detect framework and set up Testomat.io reporting for test automation projects.

### User Stories

**Story 7.1: Team Integrates New Test Suite**
- **As a** QA Lead
- **I want to** set up Testomat.io reporting for our Playwright tests
- **So that** test results automatically appear in our TMS

**Story 7.2: Multi-Framework Project Setup**
- **As a** QA Architect
- **I want to** configure reporting for Jest (unit tests), Playwright (e2e), and Pytest (API tests)
- **So that** all test results are centralized in one place

**Story 7.3: Developer Onboarding**
- **As a** New Developer
- **I want to** quickly set up test reporting without manual configuration
- **So that** I can contribute tests on day one

### Workflow

```
Step 1: Detect Project Language & Framework
├─ Scan package.json, requirements.txt, pom.xml, etc.
├─ Identify language (JavaScript, Python, Java, C#, PHP, Ruby, etc.)
├─ Detect test framework:
│  ├─ JS: Playwright, CodeceptJS, WebdriverIO, Jest, Mocha, Cypress
│  ├─ Python: Pytest, Robot Framework
│  ├─ Java: JUnit, TestNG
│  └─ XML: Generic XML reporter
├─ If framework unknown, ask user to specify
└─ Proceed to Step 2

Step 2: Install Reporter Package
├─ Install @testomatio/reporter package
├─ Or install framework-specific reporter
└─ Add to package.json/requirements.txt

Step 3: Configure Reporter
├─ Get TESTOMATIO API key from user
├─ Update configuration file (playwright.config.ts, jest.config.js, etc.)
├─ Add reporter initialization code
└─ Set environment variables

Step 4: Verify Setup
├─ Run sample test
├─ Confirm results appear in Testomat.io
└─ Provide summary and next steps

Step 5: Documentation
├─ Generate setup instructions
├─ Explain how to run tests with reporting
├─ Provide CI/CD examples
└─ Done
```

### Output
- Installed and configured reporter
- Example test run with reporting
- CI/CD setup instructions

### Supported Frameworks
- **JavaScript/TypeScript**: Playwright, CodeceptJS, WebdriverIO, Jest, Mocha, Cypress
- **Python**: Pytest, Robot Framework
- **Java**: JUnit, TestNG
- **Other**: XML report format

### Value Proposition
- **Zero manual configuration**: AI detects and configures automatically
- **Centralized reporting**: All test results in one place
- **Better visibility**: Team sees all test metrics
- **CI integration ready**: Reporting works in CI/CD pipelines

---

## 8. 🔎 PROJECT-SCAN Skill

### Purpose
Scan project source code to inventory languages, frameworks, and existing tests.

### User Stories

**Story 8.1: QA Lead Audits Project**
- **As a** QA Lead  
- **I want to** understand what tests already exist and which frameworks are used
- **So that** I can plan new automation without duplicating existing work

**Story 8.2: New Team Member Onboarding**
- **As a** New QA Engineer
- **I want to** quickly understand the project's testing infrastructure
- **So that** I can contribute test cases within the first day

**Story 8.3: Testing Architecture Decision**
- **As a** Tech Lead
- **I want to** see all testing frameworks in use across the project
- **So that** I can make informed decisions about standardization

### Workflow

```
Step 1: Understand Project Context
├─ Scan root directory
├─ Look for source code files
├─ If no source found, ask user:
│  ├─ Provide path to source code
│  ├─ Clone from git repo
│  └─ Or stop
└─ Continue if source found

Step 2: Detect Languages
├─ Scan for package.json → JavaScript/TypeScript
├─ Scan for requirements.txt → Python
├─ Scan for pom.xml → Java
├─ Scan for Go, Rust, C#, Ruby, PHP files
└─ List all detected languages

Step 3: Detect Frameworks
├─ JavaScript: Look for Jest, Mocha, Playwright, Cypress, CodeceptJS configs
├─ Python: Look for pytest, robot, unittest
├─ Java: Look for TestNG, JUnit, Maven/Gradle
└─ Identify each framework's test files

Step 4: Inventory Manual Tests
├─ Find *.test.md files
├─ Count and list them
├─ Group by directory
└─ Show summary

Step 5: Inventory Automated Tests
├─ Find test files by pattern: *.spec.ts, *.test.js, *.cy.js, etc.
├─ Count by framework and type (unit, e2e, integration)
├─ Group by directory
└─ Show summary

Step 6: Generate Report
├─ Project overview
├─ Language/framework matrix
├─ Test inventory (manual + automated)
├─ Recommendations for next steps
└─ Done
```

### Output
- Project inventory report
- Languages and frameworks detected
- List of existing tests
- Test coverage overview

### Value Proposition
- **Quick onboarding**: New team members understand project in minutes
- **Gap identification**: See what's tested and what's not
- **Architecture visibility**: Understand test infrastructure
- **Planning basis**: Informed decisions on next testing steps

---

## 9. 🚀 AUTOMATE-TEST-CASES Skill

### Purpose
Convert manual test cases into production-ready automated test scripts.

### User Stories

**Story 9.1: QA Engineer Automates Key Flows**
- **As a** QA Engineer
- **I want to** convert our critical manual test cases into automation
- **So that** they run automatically in every build

**Story 9.2: Increase Automation Coverage**
- **As a** QA Lead
- **I want to** automate 50% of our manual test cases
- **So that** we reduce manual execution time and catch bugs faster

**Story 9.3: Maintain Quality During Transition**
- **As a** QA Manager
- **I want to** ensure automated tests match the intent of manual tests
- **So that** we don't lose coverage during the transition

### Workflow (5-Step Process)

```
Step 1: Analyze Project Architecture
├─ Detect framework (Playwright, CodeceptJS, etc.)
├─ Find reusable components (Page Object Model, helpers)
├─ Identify test execution patterns
└─ Build understanding of project structure

Step 2: Understand Manual Test
├─ Normalize test steps
├─ Handle ambiguous or unclear steps
├─ Detect any inconsistencies
└─ Get clarification if needed

Step 3: Write Test Code
├─ Implement using existing patterns
├─ Add assertions
├─ Follow project conventions
└─ Output generated test script

Step 4: Verify & Heal (up to 3 attempts)
├─ Execute test
├─ If fails:
│  ├─ Try locator fixes
│  ├─ Try timing adjustments
│  ├─ Try assertion corrections
│  └─ Try flow adjustments
├─ If passes 3 times → Stop loop
└─ If fails 3 times → Ask user for help

Step 5: Finalization
├─ Ensure structure compliance
├─ Manage test data & fixtures
├─ Run related tests to check for side effects
└─ Output summary
```

### Output
- Automated test script in project framework
- Test passes locally
- Ready for CI integration

### Value Proposition
- **Dramatically reduces automation effort**: Manual → Automated in minutes
- **Maintains quality**: AI ensures tests match manual intent
- **Prevents defects**: Auto-healing fixes common issues automatically
- **Faster delivery**: Team gets automation without extra training

---

## 10. 🐛 AUTOMATION-DEBUG-TESTS Skill

### Purpose
Diagnose and fix failing automated tests systematically.

### User Stories

**Story 10.1: Fix Flaky Tests**
- **As a** QA Engineer
- **I want to** fix tests that pass locally but fail in CI
- **So that** our pipeline is reliable and developers trust test results

**Story 10.2: Rapid Test Healing**
- **As a** Tech Lead
- **I want to** quickly diagnose why a test failed
- **So that** we can fix issues and merge code faster

**Story 10.3: Improve Test Stability**
- **As a** QA Team
- **I want to** systematically fix timing issues in our e2e tests
- **So that** tests run reliably across all environments

### Workflow (4-Step Process)

```
Step 1: Analyze Failure
├─ Identify error type: locator, timing, assertion, flow, infrastructure
├─ Capture test name, file, line number
├─ Collect stack trace, screenshot, video, logs
├─ Diagnose environment: browser, viewport, CI/local
└─ Form initial hypothesis

Step 2: Inspect & Diagnose
├─ DOM inspection: check element presence/visibility
├─ Network logs: check for failed requests
├─ Console logs: look for JavaScript errors
├─ Trace analysis: review timing of actions
└─ Identify root cause

Step 3: Apply Fix (Priority Order)
├─ First: Locator issues (update selectors)
├─ Second: Timing issues (adjust waits, retry logic)
├─ Third: Assertion issues (fix expected values)
├─ Fourth: Flow issues (check navigation, preconditions)
└─ Apply chosen fix

Step 4: Verify & Stabilize
├─ Re-run test
├─ Confirm it passes consistently
├─ Run related tests to check side effects
├─ Document the fix
└─ Done
```

### Output
- Fixed test
- Documented fix explanation
- Verification that fix is stable

### Common Fixes
- **Locator**: `cy.get('.btn-save')` → `cy.get('[data-test="save-btn"]')`
- **Timing**: Add `cy.wait(500)` before assertion
- **Assertion**: Update expected value to match actual behavior
- **Flow**: Add missing login step before checking profile

### Value Proposition
- **Saves hours of debugging**: AI diagnoses root cause automatically
- **Reduces flakiness**: Systematic approach to stabilization
- **Team productivity**: Engineers focus on features, not test failures
- **Pipeline reliability**: CI/CD becomes trustworthy

---

## 11. 🎯 TESTOMATIO-FLOW Skill

### Purpose
Orchestrate the complete test case lifecycle from requirements to uploading to TMS.

### User Stories

**Story 11.1: End-to-End Feature Testing**
- **As a** QA Lead
- **I want to** manage the complete testing workflow for a new feature in one session
- **So that** nothing falls through the cracks and tests are ready for automation

**Story 11.2: Bulk Test Management**
- **As a** QA Manager
- **I want to** generate, improve, and upload test cases in one coordinated workflow
- **So that** tests reach the TMS quickly without manual handoff

**Story 11.3: Smart Task Routing**
- **As a** QA Engineer
- **I want to** get intelligent suggestions on what to do next in the testing workflow
- **So that** I don't need to decide between multiple skills manually

### Workflow (Dynamic & Context-Aware)

```
Entry: User provides request
├─ User: "Generate test cases for user registration"
│
├─ Skill analyzes request
├─ Skill gathers context (project structure, existing tests)
├─ Skill routes to appropriate sub-skill
│
├─ Flow 1: Generate → Suggest Upload & Reporter
│ ├─ Use generate-cases
│ └─ Suggest: Upload to Testomat.io, Add reporter, Add edge cases
│
├─ Flow 2: Improve → Suggest Upload
│ ├─ Use improve-test-cases
│ └─ Suggest: Upload updated cases to Testomat.io
│
├─ Flow 3: Setup → Suggest Generate
│ ├─ Use reporter-setup
│ └─ Suggest: Generate test cases, Map coverage
│
├─ Flow 4: Coverage → Suggest Report Review
│ ├─ Use manual-coverage / automation-coverage
│ └─ Suggest: Review gaps, Run affected tests
│
└─ And more...
```

### Supported Workflows

**Test Generation Flow**
```
Generate → Improve → Upload → Setup Reporter → Map Coverage
```

**Test Automation Flow**
```
Generate → Automate → Debug → Setup Reporter → Map Coverage
```

**Coverage Optimization Flow**
```
Scan → Manual Coverage → Automation Coverage → Review Results
```

**Bulk Edit Flow**
```
Pull → Edit → Push → Verify in TMS
```

### Output
- Completed test cases in TMS
- Configured reporter
- Coverage mappings
- Intelligent next steps

### Value Proposition
- **Simplified workflow**: One entry point instead of choosing between 7+ skills
- **Intelligent guidance**: AI suggests logical next steps
- **Reduced context switching**: Flow guides you through related tasks
- **Complete lifecycle**: From requirement to automation in one session

---

## 12. 🔗 TESTOMATIO-MCP Skill

### Purpose
MCP (Model Context Protocol) integration with Testomat.io for direct TMS access and automation.

### User Stories

**Story 12.1: Real-Time TMS Operations**
- **As a** QA Engineer
- **I want to** query tests, suites, and requirements directly from Testomat.io
- **So that** I have live data for test generation and planning

**Story 12.2: Automated Sync in Workflows**
- **As a** QA Team
- **I want to** integrate Testomat.io data into our AI-powered workflows
- **So that** we work with live TMS data instead of exported files

**Story 12.3: Rich Context for Test Creation**
- **As a** QA Engineer
- **I want to** leverage existing TMS structure (suites, tags, requirements) when generating tests
- **So that** new tests integrate seamlessly with existing organization

### Workflow

```
Step 1: Connect to Testomat.io
├─ Authenticate with API key
└─ Establish MCP connection

Step 2: Query TMS Data
├─ List projects, suites, tests
├─ Search tests by criteria
├─ Get shared steps
├─ Retrieve tags and labels
└─ Access requirements/traceability

Step 3: Integrate with Skills
├─ Generate-cases: Pull structure, avoid duplicates
├─ Sync-cases: Automatic bidirectional sync
├─ Coverage: Link to TMS requirements
└─ Reporter: Direct result submission

Step 4: Maintain Sync
├─ Real-time TMS updates
├─ Automatic ID assignment
└─ Metadata consistency
```

### Output
- Direct TMS integration
- Live data-driven workflows
- Automated sync

### Value Proposition
- **Live data**: Always working with current TMS state
- **Seamless integration**: No manual export/import
- **Rich context**: AI understands TMS structure
- **Reduced friction**: Automatic sync and ID management

---

## Cross-Skill Value Proposition

### Complete Testing Lifecycle

| Phase | Skills Used | Outcome |
|-------|------------|---------|
| **1. Plan** | project-scan, generate-cases | Test cases ready for execution |
| **2. Design** | generate-cases, improve-test-cases | Polished test documentation |
| **3. Organize** | find-duplicate-cases, sync-cases | Clean test suite in TMS |
| **4. Automate** | automate-test-cases, reporter-setup | Automation running in CI |
| **5. Optimize** | manual-coverage, automation-coverage | Smart test selection |
| **6. Maintain** | automation-debug-tests, improve-test-cases | Healthy test suite |

### Time Savings Examples

- **Generate test cases**: 4-6 hours → 15 minutes (AI generates, you review)
- **Improve test suite**: 2-3 days → 1 hour (bulk improvements)
- **Find duplicates**: 4-8 hours → 10 minutes (AI detects, you decide)
- **Set up automation**: 8-16 hours → 30 minutes (auto framework detection)
- **Fix flaky tests**: 2-4 hours per test → 15 minutes (AI diagnoses root cause)

### Quality Improvements

- **Coverage**: 70% → 90%+ (comprehensive generation catches gaps)
- **Execution time**: 2 hours → 15 minutes (smart test selection via coverage)
- **Maintenance burden**: 30% reduction (deduplication and standardization)
- **Flakiness**: 20-30% reduction (systematic healing methodology)

---

## Recommended Workflows by Role

### QA Engineer
1. **Start**: `project-scan` → understand what exists
2. **Create**: `generate-cases` → write new tests
3. **Improve**: `improve-test-cases` → polish before upload
4. **Upload**: `sync-cases` → push to Testomat.io
5. **Automate**: `automate-test-cases` → create automation

### QA Lead
1. **Audit**: `project-scan` + `find-duplicate-cases` → assess quality
2. **Plan**: `generate-cases` → create comprehensive test strategy
3. **Organize**: `sync-cases` + `improve-test-cases` → standardize
4. **Optimize**: `manual-coverage` + `automation-coverage` → smart execution
5. **Monitor**: `reporter-setup` → centralized visibility

### DevOps Engineer
1. **Discover**: `project-scan` → identify frameworks
2. **Integrate**: `reporter-setup` → add reporting to CI/CD
3. **Optimize**: `automation-coverage` + `manual-coverage` → smart pipelines
4. **Fix**: `automation-debug-tests` → stabilize failing tests

### QA Manager
1. **Assessment**: `project-scan` → current state
2. **Planning**: `generate-cases` + `testomatio-flow` → strategy
3. **Execution**: `reporter-setup` + `sync-cases` → infrastructure
4. **Insight**: `manual-coverage` + `automation-coverage` → metrics
5. **Improvement**: `find-duplicate-cases` → optimization opportunities

---

## Key Success Metrics

### Efficiency Metrics
- Time to generate test suite (target: 80% reduction)
- Time to set up automation (target: 85% reduction)
- Time to identify duplicates (target: 90% reduction)

### Quality Metrics
- Test case clarity score (target: 95%+)
- Test execution success rate (target: 98%+)
- Code coverage by tests (target: +20% improvement)

### Team Metrics
- Team satisfaction with test documentation (target: 90%+)
- Time spent debugging vs. developing features (target: 20% → 5%)
- New team member onboarding time (target: 3 days → 1 day)

---

## Integration Points

### Pre-Integration Checklist
- [ ] Testomat.io account and API key ready
- [ ] Project repository structure understood
- [ ] Testing framework identified
- [ ] Team trained on basic skill usage

### Post-Integration Wins
- Test generation becomes fast and comprehensive
- Manual tests are standardized and clean
- Coverage is mapped and visible
- CI/CD pipelines are optimized
- Team has centralized test management

---

## Next Steps

1. **Prioritize**: Which skills are most valuable for your team?
2. **Pilot**: Start with 1-2 skills in a non-critical project
3. **Train**: Team members learn through hands-on usage
4. **Expand**: Gradually integrate more skills into workflows
5. **Optimize**: Collect feedback and refine processes

