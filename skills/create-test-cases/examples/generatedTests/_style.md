# Feature Style Guide — manual-tests-execution

Captured from the first approved sub-feature (`run-creation`). Read this FIRST in Step 3 Phase 2 of every subsequent sub-feature so the whole feature stays stylistically consistent.

## Suite framing (top of each `.md`)

- Start with `<!-- suite -->`
- `# {Nested Suite Title}` in Title Case (e.g. "Dialog Lifecycle", "Form Fields and Defaults", "Scope Selection")
- One-paragraph suite intro under the heading — what this nested suite covers AND what it explicitly does NOT cover (ownership reference to the other sub-feature that owns it)

## Test frontmatter block

```
<!-- test
type: manual
priority: critical|high|normal|low
source: AC-x, AC-y, ac-delta-z
automation: candidate|deferred
automation-note: {only when automation=deferred — why it's deferred}
-->
```

- `source:` lists comma-separated IDs — baseline `AC-n` first, then `ac-delta-n`
- `automation-note:` ONLY present for `deferred`; explains the blocker (project-setting, server-error simulation, timing-sensitive, cross-sub-feature coordination, @unclear locator)

## Test heading conventions

- `## {Test title}` — sentence-style, describes the behavior, not the mechanic
- Parameterized tests use `${col}` tokens in the title (e.g. `Dismiss the sidebar via ${dismiss_method} restores the runs list`)
- Scenario tags appended to the title: `@smoke`, `@negative`, `@boundary`, `@unclear`, `@needs-project-setting`
- No implementation leakage in titles (no CSS class names, no XPath fragments, no raw AC-ids in the title itself)

## Test body structure

1. Optional short descriptive paragraph under the title stating the intent / contract
2. `## Preconditions` — bullet list of fixture requirements (existing runs/groups/users). OMIT the section entirely if none are needed.
3. `## Steps` — dash-list of imperative actions, each step followed by an `_Expected_:` line
4. For parameterized tests, an `<!-- example -->` marker + markdown table directly below the test body

## Step writing rules

- **Atomic actions:** one verb per step (no "click X and verify Y and fill Z")
- **Concrete expected text:** quote exact UI strings when known (e.g. `"Run has been started"`, `"Without rungroup"`)
- **Multi-bullet Expected allowed:** when one action has multiple visible consequences, use a nested bullet list under `_Expected_:`
- **No raw payloads:** "string of 5 space characters", not `"     "`; "10 000-character paragraph", not literal 10k chars
- **URL patterns are parameterized:** `/projects/{project}/runs/launch/{id}/` — use `{token}` for dynamic IDs, literal path otherwise
- **Ownership notes are inline:** if an expected behavior is partially owned by another sub-feature, cite it in-line (e.g. "runtime behavior around description hiding is owned by #2 test-execution-runner; here we only verify persistence")

### Expected block format (Variant C — NORMATIVE)

Decided 2026-04-20 after a POC comparing 6 format variants. Testomat.io's markdown renderer collapses `_Expected_:` onto the same visual line as the preceding step unless it's a **nested bullet**. Use this exact shape:

**Single-line Expected:**
```
- Click the "Launch" button
  - _Expected_: The dialog closes and "Run has been started" toast appears
```

**Multi-bullet Expected:**
```
- Click the Apply button
  - _Expected_:
     - The modal closes
     - The bulk-action toolbar disappears
     - Multi-Select mode stays active
```

Rules:
- Indent `- _Expected_:` by **2 spaces** (nested under the step bullet)
- For multi-bullet, indent the inner bullets by **5 spaces** (`     -`) so they render as a second-level list under Expected
- Underscore `_Expected_` italic markers are kept (renders as italic label, visually distinct from the step text)
- Do NOT use `**Expected:**` (bold), blockquotes (`>`), or blank-line variants — they either fail to render as nested or introduce vertical-space inconsistency across tests

## Parameterized test conventions

- Parameter tokens use `${snake_case}` inside titles, steps, and expected text
- `<!-- example -->` block is pipe-delimited markdown table immediately after the test
- Table columns are the parameter names; each row is one concrete execution
- Keep rows ≤ 4 per table — if more are needed, split into two parameterized tests

## Cross-cutting suite

- One nested suite file named `cross-cutting.md` when a sub-feature participates in ≥ 2 cross-cutting concerns
- Each cross-cutting test cites BOTH the relevant baseline AC and the delta AC in `source:`
- Title + intro paragraph makes clear which concern (A/B/C/D from destructuring map) the test covers

## Unclear / partial-ownership handling

- Tag with `@unclear` when the affordance name/location is not fully confirmed
- Keep the test (don't delete) — document the uncertainty in the body as "exact locator to be confirmed with product"
- For behavior partially owned by another sub-feature, the test verifies ONLY the creation-side slice and cites the ownership in the body

## Language / tone

- UK/US English acceptable (be consistent within a single test)
- "Navigate to the 'Runs' page" not "Go to runs" — imperative + quoted UI label
- Click targets use exact visible label in quotes: `Click the 'Launch' button`, not `Click launch`
- Avoid "the user" / "you" — the steps are already imperative

## Per-file test-count shape (reference only — don't pad to match)

run-creation ended with:
- dialog-lifecycle.md: 6
- form-fields.md: 11
- scope-selection.md: 10
- launch-and-save.md: 7
- entry-points-and-extras.md: 4
- cross-cutting.md: 6

Shape was driven by AC density + natural section grouping, not by a target. Other sub-features will land differently.
