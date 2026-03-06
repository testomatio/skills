# Skill Creation Guidelines

## General Template for New Skills

<!-- TODO: Some things can be improved during the skill development process -->
Every skill should include these key sections:

## {NAME} SKILL: What I do

A short, clear 1-2 sentence description of what the skill does.

[if that make sense] **Key actions** (bullet points):
- Action 1: What it accomplishes
- Action 2: What it accomplishes


[if that make sense] **Intent inference** (if applicable):
- Words indicating this action => actual action
- Words indicating that action => actual action

**Clarification**: If unclear what user wants => ask user to clarify.

---

## References

| Description | File |
|-------------|------|
| [Reference name](./path/to/reference.md) | ./references/REFERENCE.md |

---

## Error Handling

### Ask User First

When to do:
- Ask user to clarify intent uncertain about what
- Ask user for required information (tokens, paths, etc.)
- Confirm before proceeding with potentially destructive actions

### Recoverable Situations

Attempt recovery before failing:
- Missing optional parameters => use defaults or ask user
- Minor configuration issues => try to fix or prompt user
- Unclear requirements => ask user for clarification

### Critical Errors (STOP immediately)

Stop execution and return clear error only when:
- User refuses to provide required credentials
- CLI command fails with critical error (network/auth/permission)
- Cannot create required files/directories
- User repeatedly provides invalid input after clarification

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

1. **No input validation** - Validate all inputs before processing
2. **Unclear intent inference** - When inferring user intent, be conservative; ask if unclear
3. **Hardcoded values** - Use environment variables or configurable parameters
4. **No rollback/cleanup** - Clean up temporary files on failure
5. **Ignoring existing files** - Check if files exist before overwriting
6. **Missing prerequisites** - Verify all required tools are installed
7. **No user confirmation** - Ask before destructive operations
8. **Vague error messages** - Return specific, actionable error descriptions
9. **Incomplete documentation** - Include all edge cases in examples
