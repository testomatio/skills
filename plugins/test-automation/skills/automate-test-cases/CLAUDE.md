# automate-manual-cases Skill

## Overview
Converts manual test cases into automation test scripts following POM pattern.

## Step Tracking

**Current step is tracked in SKILL.md header.** After completing each step, UPDATE the "### Progress" step:

```markdown
### Progress
* STEP: 2/5 (Understand Manual Test)
* Previous: ✅ Step 1: Analyze Project Architecture
* Next: → Step 3: Write Test Code
```

**Step Flow:**
1. **Step 1:** Analyze Project Architecture (detect framework, find reusable components)
2. **Step 2:** Understand Manual Test (normalize input, handle ambiguous steps)
3. **Step 3:** Write Test Code (implement, add assertions)
4. **Step 4:** Verify & Heal (execute, fix if fails - max 3 attempts)
5. **Step 5:** Finalization (align, run, summary)

**Important:**
- NEVER skip steps - complete each before moving to next
- If healing loop (Step 4.2) runs 3 times without success → STOP and ask user
- After Step 4 passes → update header to Step 5
- After Step 5 complete → update to "COMPLETED" and run postHook

## When Starting Fresh

1. Read SKILL.md header to see current step
2. If "ACTIVE STEP: 1/5" → start from beginning
3. If already in progress → continue from that step

## PostHook

After skill completes successfully, run:
```bash
./scripts/post-hook.sh
```
Or manually verify:
1. Test file exists at expected path
2. Run test once more to confirm stability
3. Check for artifacts (screenshots, reports)

## Files

| File | Purpose |
|------|---------|
| SKILL.md | Main skill instructions with step tracking |
| references/*.md | Best practices (POM, framework-specific) |
| scripts/post-hook.sh | Verification after skill completes |
