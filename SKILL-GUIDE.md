# Skill Creation Guidelines

## General Template for New Skills

<!-- TODO: Some things can be improved during the skill development process -->
Every skill should include these key sections:

## {NAME} SKILL: What I do

A short, clear 1-2 sentence description of what the skill does.

**Key actions** (bullet points):
- Action 1: What it accomplishes
- Action 2: What it accomplishes

**Intent inference** (if applicable):
- Words indicating this action => actual action
- Words indicating that action => actual action

**Clarification**: If unclear what user wants => ask user to clarify.

---

## Error Handling

Fail immediately and **STOP** execution on any error:
- List specific error conditions relevant to this skill
- Network failures
- Missing required inputs/credentials
- Invalid parameters
- File system errors
- etc.

**Do not retry automatically.**
**Do NOT continue after failure.**
**Return clear human-readable error messages.**

---

## Action Execution: What I execute

### Configure Environment

| Key | Description | Default Value |
|-----|-------------|---------------|
| VAR_NAME | What it does | Default or "Required" |

List all required environment variables with their purpose.

### Step by Step Instruction

Describe each supported action with:
1. Prerequisites (files, folders, configs)
2. Validation steps before execution
3. Actual command or code to run
4. Expected output or result

---

## Purpose & File Format

### Purpose

Explain **why** this skill exists and **what problem** it solves. Describe the workflow or process it automates.

### Expected Input Format

Describe expected file formats, structures, or data patterns:
- Configuration files (JSON, YAML, etc.) if taht make sense
- Use link to specific file from the `./template` folder instead of large "wall of text"
- Code conventions or examples if thta some specific cases

### Output Format

Describe what the skill produces:
- Generated files
- Modified files
- Console output
- Return values

---

## Examples

Provide 2-3+ real usage examples:

```
Use {skill} to {action}
```

```
Use {skill} to {action} with {parameter}
```

```
Use {skill} to {action} in {specific context}
```

---

## Common Pitfalls to Avoid

When creating a new skill, pay attention to:

1. **Missing error handling** - Always handle failures gracefully
2. **No input validation** - Validate all inputs before processing
3. **Unclear intent inference** - When inferring user intent, be conservative; ask if unclear
4. **Hardcoded values** - Use environment variables or configurable parameters
5. **No rollback/cleanup** - Clean up temporary files on failure
6. **Ignoring existing files** - Check if files exist before overwriting
7. **Missing prerequisites** - Verify all required tools are installed
8. **No user confirmation** - Ask before destructive operations
9. **Vague error messages** - Return specific, actionable error descriptions
10. **Incomplete documentation** - Include all edge cases in examples
