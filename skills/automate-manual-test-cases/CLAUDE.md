# automate-manual-test-cases Skill

Converts manual test cases into automation test scripts following POM pattern.

## Step Tracking

Progress is tracked in the `### Progress` block of SKILL.md. After completing each step, update it:

```markdown
### Progress
* STEP: 2/5 (Understand Manual Test)
* Previous: ✅ Step 1: Analyze Project Architecture
* Next ➡️ Step 3: Write Test Code.
```

Step flow:
1. Analyze Project Architecture (detect framework, find reusable components)
2. Understand Manual Test (normalize input, handle ambiguous steps)
3. Write Test Code (implement, add assertions)
4. Verify & Heal (execute, fix if fails — max 3 attempts)
5. Finalization (align, run, summary)

Rules:
- **Never skip steps** — complete each before moving to the next.
- If the healing loop (Step 4.2) runs 3 times without success => stop and ask the user.
- After Step 5 completes => update Progress to "COMPLETED" and run the PostHook.

## When Starting Fresh

1. Read the `### Progress` block in SKILL.md to see the current step.
2. If "STEP: 1/5" => start from the beginning.
3. If already in progress => continue from that step.

## PostHook

After the skill completes, run the generated `$TEST_FILE` with the project's test framework and confirm it passes:

```bash
# Playwright case
npx playwright test "$TEST_FILE"
# or
./node_modules/.bin/playwright test "$TEST_FILE"

# CodeceptJS case
npx codeceptjs run "$TEST_FILE"

# Cypress case
npx cypress run --spec "$TEST_FILE"
```

## Files

| File | Purpose |
|------|---------|
| SKILL.md | Main skill instructions with step tracking |
| references/*.md | Best practices (POM, framework-specific) |
