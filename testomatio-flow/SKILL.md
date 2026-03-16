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
– Write new autotests
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
2. 🔧 Add Testomat.io reporter first
3. ✨ Improve test quality
4. 📊 Analyze coverage gaps"
```

#### **Test Improvement Flow**
```
User: "Improve existing API tests"
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
User: "Fix failing Cypress tests"
↓
Uses autotests-fixer skill
↓
Skill suggests: "Tests fixed! Ready to:
1. 🔄 Re-run tests to verify
2. ⬆️ Upload fixes to Testomat.io
3. ✨ Add more test coverage
4. 🔧 Optimize test performance"
```

## 🛠️ Available Sub-Skills

The skill orchestrates these specialized capabilities:

| Skill | Purpose |
| ----- | ------- |
| **test-case-generator** | Generate new test cases from requirements |
| **test-case-improver** | Improve existing test cases quality |
| **traceability-matrix** | Create traceability between requirements and tests |
| **testomatio-tests-sync** | Upload test cases to Testomat.io TMS |
| **autotests-fixer** | Fix failing automated tests |
| **coverage-analyzer** | Analyze and improve test coverage |

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

#### Request: "My tests are failing, help me fix them"
```
🎯 User Request: "My tests are failing, help me fix them"

📊 Context Analysis:
- Framework: Cypress
- Failures: 3 tests in auth/
- Issues: Element not found, timeouts
- Testomat.io: Connected

🔧 Action: Uses autotests-fixer skill
✨ Output: Fixes provided and validated

💡 Smart Suggestion:
"Tests fixed! Next steps:
1. 🔄 Re-run tests to verify fixes
2. ⬆️ Upload fixes to Testomat.io
3. ✨ Add better error handling
4. 📊 Improve test coverage"
```

#### Request: "Upload tests to Testomat.io"
```
🎯 User Request: "Upload tests to Testomat.io"

📊 Context Analysis:
- Test files: Found 23 test files
- Testomat.io: Configured
- Last sync: 2 days ago

⬆️ Action: Uses testomatio-tests-sync skill
📊 Output: 23 test cases uploaded

💡 Smart Suggestion:
"Upload complete! Consider:
1. 🔄 Set up CI/CD integration
2. ✨ Generate test reports
3. 📊 Monitor test execution trends
4. 🔧 Add more test coverage"
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

## 💡 Usage Examples

### Example 1: Complete Test Creation & Upload
```
User: "I need test cases for the new checkout feature and upload them to Testomat.io"

🎯 Smart Routing:
1. Analyzes request (generation + upload)
2. Gathers requirements from Jira + design files
3. Uses test-case-generator skill → Creates 12 comprehensive test cases
4. Checks Testomat.io status → Reporter already configured
5. Uses testomatio-tests-sync skill → Uploads all test cases
6. Provides success summary and TMS links

💡 Suggested Next Steps:
"Ready to execute! Run: npm run test:e2e -- --env reporter=testomatio"
```

### Example 2: Emergency Test Fix
```
User: "My Cypress tests are failing, help me fix them"

🎯 Smart Routing:
1. Identifies failing tests from logs/project
2. Uses autotests-fixer skill → Provides immediate fixes
3. Validates fixes work locally
4. Suggests quick upload to Testomat.io
5. Recommends additional coverage for similar issues

💡 Suggested Next Steps:
"Critical issues fixed! Run full test suite to verify no regressions"
```

## 🎯 Smart Best Practices

### Context-Aware Approach
- **Let the skill adapt** to your specific needs rather than following rigid steps
- **Accept suggestions** for next steps based on what you've accomplished
- **Mix and match** workflows as needed (generation + improvement + upload)

### For Different Project Types
**New Projects:**
- Start with test generation using test-case-generator
- Use the upload suggestion to establish TMS integration early
- Build comprehensive coverage gradually

**Existing Projects:**
- Focus on specific improvements (test-case-improver)
- Use autotests-fixer for immediate issues
- Maintain sync with Testomat.io regularly

**CI/CD Integration:**
- Use Testomat.io reporter in automated test runs
- Upload results after each successful build
- Monitor test execution trends and coverage metrics

### Smart Workflow Tips
- **Be specific** in your requests for better routing
- **Accept suggestions** for logical next steps
- **Combine workflows** for complex needs
- **Iterate** as needed - the skill adapts to your feedback

## 📞 Getting Help

If you encounter issues:

1. Check project structure and dependencies
2. Verify Testomat.io credentials
3. Ensure proper file permissions
4. Review test case formats
5. Check MCP configuration for external tools

---

**Remember**: This skill orchestrates your testing workflow, but you can also use individual sub-skills directly for specific tasks!