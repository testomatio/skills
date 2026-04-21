# Intake Questionnaire

Front-loaded interview that replaces scattered gates in Steps 2-3. Runs as Step 0 of the skill, before any gathering.

**See also:** [intake-examples.md](intake-examples.md) — filled-in intake samples to learn the expected shape before running.

**Purpose:**
- Collect all preferences in one sitting so the skill runs without interruption until Step 3
- Build an audit trail in `test-cases/{feature-slug}/intake.md`
- Let the skill adapt its behavior based on user answers (sources, depth, focus, language)

**Language rule:** questions are in English, user may answer in any language (English / Ukrainian / mix). Skill interprets natural answers.

---

## Part 1: Flow Rules

### Core rules
- Run once per invocation, before Step 1, after reading argument + memory
- Ask **one question at a time** — wait for answer, then ask next
- If a previous answer makes a later question unnecessary → skip silently
- `"use defaults"` / `"за замовчуванням"` / `"just go"` → skip all, use defaults
- `"not sure"` / `"не знаю"` → take the default silently, do NOT re-prompt

### Smart-skip (fill defaults silently)

| Skip | When |
|---|---|
| Q1 | Argument is a Testomat suite URL or clear feature name |
| Q1.1 | Argument is an app URL, or memory has `project_{feature}_*.md` with a path |
| Q1.2 | Argument names a specific sub-feature (e.g., "Manual Test Execution → Environment Configuration") — record as preferred starting point; still verified against map after Step 1 |
| Q3 | User's argument already contains resource links |

### Re-run handling
If `test-cases/{feature-slug}/intake.md` exists, show summary and ask:

```
I found previous intake for {feature-name}:

  Feature:   {Q1}     Coverage:  {Q2}
  Focus:     {Q4}     Sources:   {Q3 links or "UI only"}
  Saved:     {file mtime}

Use these answers?  [Y] Reuse  [N] Start fresh  [E] Edit specific
```

---

## Part 2: Questions

### Q1: Feature / scope
**Type:** free text
**Default:** from argument if present
**Prompt:**
```
Q1. What feature or scope are we covering?
    (feature name, Testomat suite URL, or short description)
```

---

### Q1.1: Feature location in the product
**Type:** free text | **Default:** none — always ask unless argument is a URL
**Prompt:**
```
Q1.1. Where in the product is this feature located?
      (menu path, URL, or short navigation hint — e.g.
      "Settings → Labels & Fields", "/projects/{slug}/runs", "right sidebar of test detail page")
```
Accept any form: menu path, URL, screen name. Multiple screens → comma-separated. Unknown → start from dashboard.

---

### Q1.2: Sub-feature (suite) hint (optional)
**Type:** free text | **Default:** `pick after map` — Step 1 (feature phase) will produce a sub-feature map and you can choose from it
**Prompt:**
```
Q1.2. Do you have a specific sub-feature in mind for the FIRST run? (optional)
      (I'll run the feature phase first and produce a sub-feature map + shared artifacts.
      After the map is approved, you pick ONE sub-feature per conversation — example:
      "Environment Configuration".)

      Answer with the sub-feature name, or "pick after map" / "не знаю" to decide later.
```
- `pick after map` / `suggest` / `не знаю` / empty → proceed to Step 1 (feature phase) and let the map drive the choice
- A specific sub-feature name → recorded as a preferred starting point; still verified against the Step 1 map before Step 2 begins
- Feature-first is always on — the feature phase produces `_shared-ui.md` + `_ac-baseline.md` + destructuring map even when the user knows which sub-feature they want, because those artifacts are reused by every subsequent sub-feature conversation

---

### Q2: Coverage depth
**Type:** single choice | **Default:** `balanced`
**Prompt:**
```
Q2. Coverage depth?
    [1] Smoke — only happy paths, skip negatives and edge cases
    [2] Balanced — happy + negatives + key edge cases, skip rare boundaries (default)
    [3] Regression — everything incl. boundaries, state transitions, role combos
    [4] Custom — tell me specifics

    Q2 picks the SHAPE of coverage, not a target count. Each skill run covers ONE sub-feature in depth.
```

On `[4]` → ask: *"Describe what to include/exclude in 1-2 sentences."*

Test count is driven by what's needed to fully cover the sub-feature (all ACs, scenario balance thresholds, UI elements in action steps) — there is no target range. If balanced naturally produces 8 tests or 40 tests, both are correct. Focus on what's included/excluded, not on hitting a count.

---

### Q3: Sources of truth

**Type:** single open question
**Default:** UI exploration only (Playwright MCP)
**Prompt:**
```
Q3. Any docs or specs I should use as input?
    Paste links (GitHub docs, Jira, Figma, Confluence — comma-separated), or "no" for UI-only.
    UI exploration via Playwright is always included unless you say "no UI".
```

**Rules:**
- UI exploration (Playwright) is always on by default — user must explicitly say "no UI" to disable
- Record each provided link in the intake file
- Fetch each link in Step 1.1 before AC extraction
- If user provides no links and says "no UI" → prompt: *"I need at least one source. Can I at least explore the UI?"*

---

### Q4: Special focus
**Type:** multi-select
**Default:** none (balanced output)
**Prompt:**
```
Q4. Any special focus areas? (pick 0 or more)
    [1] Security & permissions — role checks, unauthorized access, data leaks
    [2] Validation & error messages — exact texts, boundary values, required fields
    [3] Edge cases & race conditions — double-clicks, concurrent actions, network drops
    [4] Data persistence — survives refresh, re-login, navigate away and back
    [5] Bulk operations — multi-select, bulk actions, large selections
    [6] UI / UX — visual states, empty states, loading states
    [7] None — balanced (default)

    Answer with comma-separated numbers (e.g. "1, 2") or "none".
```

Multi-select is fine — multiple focus areas add emphasis to the generated checklist without excluding anything else.

**Slug rules** (for suite directory naming): lowercase, spaces → hyphens, strip special chars.

---

## Part 3: Output Template

Save to `test-cases/{feature-slug}/intake.md`:

```markdown
# Intake: {feature-name}

**Date:** YYYY-MM-DD

## Answers

| # | Question | Answer |
|---|----------|--------|
| Q1 | Feature / scope | {free text} |
| Q1.1 | Feature location | {menu path / URL / screen name(s)} |
| Q1.2 | Sub-feature hint (optional) | {sub-feature name or "pick after map"} |
| Q2 | Coverage depth | smoke (happy only) / balanced (+ negatives + key edges) / regression (+ boundaries + state + roles) / custom: "{text}" |
| Q3 | Sources | {links or "UI only"} |
| Q4 | Special focus | {list or "none"} |

## Defaults applied
{List defaults applied silently, or "none"}
```

Examples: [intake-examples.md](intake-examples.md)

