---
name: testomatio-flow
description: Orchestrate the complete test case lifecycle from requirements to Testomat.io TMS. Generate test cases, improve existing ones, add reporters, upload to TMS, write new autotests, fix autotests, analyze coverage. Use this skill when you need to manage the entire testing workflow including generation, improvement, coverage, and sync with Testomat.io or do one of the tasks mentioned above.
---

# Testomatio Flow - Complete Test Lifecycle Management

This powerful skill orchestrates your entire testing workflow, guiding you from initial requirements to final test case management in Testomat.io TMS.

## 🎯 When to Use

Trigger this skill when you need to:

- Generate test cases from requirements and push them to Testomat.io
- Improve existing test cases and upload updates
- Add Testomat.io reporter to your project
- Write new autotests
- Fix autotests and sync coverage
- Manage the complete test lifecycle in one go

## 🚀 Dynamic Workflow

This skill uses a **flexible, logic-based approach** that adapts to your specific needs. It intelligently connects related tasks and suggests next steps based on context.

### Smart Task Orchestration

The skill analyzes your request and intelligently routes tasks to appropriate sub-skills, then suggests logical next steps:

#### **Test Generation Flow**

```
User: "Generate test cases for user registration"
↓
Uses test-case-generator skill
↓
Skill suggests: "Test cases generated! Would you like to:
1. ⬆️ Upload to Testomat.io now
2. 🔧 Add Testomat.io reporter to your automation project
3. ✨ Improve test quality
4. 📊 Analyze coverage gaps"
```

#### **Test Improvement Flow**

```
User: "Improve existing tests"
↓
Uses test-case-improver skill
↓
Skill suggests: "Tests improved! Next steps:
1. ⬆️ Upload updated tests to Testomat.io
2. 🔧 Fix failing autotests
3. 📊 Check coverage improvements
4. ✨ Generate more edge cases"
```

#### **Autotest Fixing Flow**

```
User: "Fix failing UI tests"
↓
Uses autotests-fixer skill
↓
Skill suggests: "Tests fixed! Ready to:
1. 🔄 Re-run tests to verify
2. ⬆️ Upload fixes to Testomat.io
3. ✨ Add more test coverage
4. 🔧 Optimize test performance"
```

#### **Test Coverage Analysis Flow**

```
User: "Analyze test coverage gaps"
↓
Uses coverage-analyzer skill
↓
Skill suggests: "Coverage analysis complete! Next steps:
1. ✨ Generate more test cases
2. 🔧 Fix missing test cases
3. ⬆️ Upload updated tests to Testomat.io
4. 📊 Monitor coverage trends"
```

#### **Write new autotests Flow**

```
User: "Write new autotests"
↓
Uses autotests-generator skill
↓
Skill suggests: "Autotests generated! Next steps:
1. 🔧 Add Testomat.io reporter to your automation project"
```

## 🛠️ Available Sub-Skills

The skill orchestrates these specialized capabilities:

| Skill                     | Purpose                                            |
| ------------------------- | -------------------------------------------------- |
| **test-case-generator**   | Generate new test cases from requirements          |
| **test-case-improver**    | Improve existing test cases quality                |
| **traceability-matrix**   | Create traceability between requirements and tests |
| **testomatio-tests-sync** | Upload test cases to Testomat.io TMS               |
| **autotests-fixer**       | Fix failing automated tests                        |
| **coverage-analyzer**     | Analyze and improve test coverage                  |

## 🎯 Smart Task Routing

Instead of fixed steps, this skill intelligently routes your request to the appropriate workflow and suggests logical next steps.

### Context-Aware Analysis

**When triggered, the skill:**

1. **Analyzes your request** to understand the core need
2. **Gathers relevant context** (project structure, existing tests, requirements)
3. **Selects appropriate sub-skills** for the task
4. **Executes the task** efficiently
5. **Suggests logical next steps** based on results

### Example Request Flows

#### Request: "Generate test cases for user registration"

```
🎯 User Request: "Generate test cases for user registration"

📊 Context Analysis:
- Project: React + TypeScript + Cypress
- Existing: 5 profile-related tests
- Requirements: Jira story USR-123
- Testomat.io: Configured

✨ Action: Uses test-case-generator skill
📋 Output: 8 comprehensive test cases created

💡 Smart Suggestion:
"Test cases generated! Ready to:
1. ⬆️ Upload to Testomat.io now
2. 🔧 Add Testomat.io reporter (if not installed)
3. ✨ Add edge cases and security tests
4. 📊 Create traceability matrix"
```

### Step 3: Execute Selected Workflows

**Goal**: Perform the requested testing tasks using specialized sub-skills.

**Available Workflows**:

#### 🆕 New Test Generation Workflow

1. Use **test-case-generator** to create test cases
2. Optionally use **traceability-matrix** for requirements mapping
3. Generate comprehensive checklists
4. Create detailed test cases

#### ✨ Test Improvement Workflow

1. Use **test-case-improver** to enhance existing tests
2. Apply quality checks and best practices
3. Maintain consistency with existing patterns

#### 🔧 Autotest Fixing Workflow

1. Use **autotests-fixer** to identify issues
2. Analyze failure patterns
3. Provide fixes and improvements
4. Test the fixes

#### 📊 Coverage Analysis Workflow

1. Use **coverage-analyzer** to identify gaps
2. Suggest additional test scenarios
3. Improve test coverage

### Step 4: Prepare for Testomat.io Integration

**Goal**: Ensure your tests are ready for TMS upload.

**Actions**:

- Check if Testomat.io reporter is installed
- Install if missing
- Configure reporter settings
- Validate test case format
- Prepare upload manifest

**Example Status**:

```
📋 Testomat.io Integration Status:
✅ Testomat.io CLI installed
✅ Reporter configuration found
✅ Test cases properly formatted
✅ Ready for upload

❓ Do you want to:
1. ⬆️ Upload test cases to Testomat.io now
2. 📝 Review generated test cases first
3. 🔧 Modify configuration
```

### Step 5: Upload to Testomat.io TMS

**Goal**: Sync your test cases with Testomat.io TMS.

**Actions**:

- Use **testomatio-tests-sync** to upload
- Map test cases to requirements
- Set priorities and metadata
- Verify successful upload
- Provide TMS links

**Example Success Message**:

```
🎉 Test cases successfully uploaded to Testomat.io!

📊 Upload Summary:
- Test suites created: 5
- Test cases uploaded: 23
- Requirements mapped: 8
- Coverage: 95%

🔗 View in Testomat.io: https://app.testomat.io/project/xyz

📝 Next Steps:
1. Execute tests with Testomat.io reporter
2. View results in TMS
3. Track test execution progress
```

## 🔄 Advanced Features

### Smart Context Awareness

- Automatically detects project type and framework
- Suggests appropriate testing strategies
- Adapts to your project's testing patterns

### Integration Capabilities

- Works with Jira, Confluence, Figma via MCP
- Supports multiple automation frameworks
- Compatible with various CI/CD pipelines

### Quality Assurance

- Validates test case formats
- Checks for best practices
- Ensures consistency across tests
- Provides quality metrics

## 🎨 Best Practices

### For New Projects

1. Start with comprehensive test generation
2. Create traceability matrices early
3. Establish Testomat.io integration from day one

### For Existing Projects

1. Gradually improve existing test cases
2. Focus on coverage gaps
3. Maintain TMS synchronization

### For CI/CD Integration

1. Use Testomat.io reporter in test runs
2. Upload results automatically
3. Monitor test trends over time

## 📞 Getting Help

If you encounter issues:

1. Check project structure and dependencies
2. Verify Testomat.io credentials
3. Ensure proper file permissions
4. Review test case formats
5. Check MCP configuration for external tools

---

This skill orchestrates your testing workflow, but you can also use individual sub-skills directly for specific tasks!
