# UI Element Catalog Format

Under the feature-first flow there are TWO catalogs per feature, both produced by the `ui-explorer` subagent:

| File | Scope | Producer | ui-explorer mode |
|---|---|---|---|
| `test-cases/{F}/_shared-ui.md` | **Feature-baseline:** shared chrome reused across every sub-feature (top nav, breadcrumbs, sidebar, shared modals, bulk bars, global toasts) | Step 1.1 | `feature-baseline` |
| `test-cases/{F}/{S}-ui-delta.md` | **Sub-feature delta:** ONLY elements specific to this sub-feature that are NOT already in `_shared-ui.md` | Step 2.2 | `sub-feature-delta` |

Step 3 checklist, Phase 3 element-name check, and ui-validator all read the combined pool (shared ∪ delta). Never duplicate a shared element into the delta file — treat `_shared-ui.md` as read-only once Step 1 is approved.

Both catalogs follow the same section schema below. The delta file additionally carries `references: _shared-ui.md` and `scope: sub-feature-delta` in its frontmatter so the reviewer can confirm it layers on top of the baseline (see [artifacts.md § A-shared-ui and § A4](artifacts.md)).

> **Scope reminder — LLM cross-check context only.**
> CSS class names, icon class names (`md-icon-*`), `data-test-id`, `aria-describedby`, raw HTML tags, and any other selector-flavored detail captured here exist so the ui-validator subagent and the generator can identify elements during exploration and validation. **They MUST NEVER be copied into generated test cases** (titles, Steps, `_Expected_:` lines). Test cases describe elements semantically — by label, tooltip, role, or visual state. See [test-case-format.md § Anti-patterns in test case bodies](test-case-format.md) for the full rule + rewrite table.

## Schema

```markdown
# UI Element Catalog: {Feature Name}

**Last updated:** YYYY-MM-DD
**Env:** prod
**Collected by:** Playwright MCP

## Screen: {Screen Name}

**URL:** /projects/{project-slug}/{path}
**Entry points:** from {where} via {action}

### Buttons
- **'Create Run'** — primary, opens New Manual Run sidebar
- **'Multi-Select'** — toolbar icon button (tooltip via aria-describedby)
- **'Delete'** — danger, requires confirmation dialog

### Toggles
- **'Run Automated as Manual'** — default off, affects test type in new run
- **'Include archived'** — default off

### Inputs
- **Title** input — required, max 255 chars, placeholder "Run title"
- **Description** textarea — optional, markdown supported

### Tabs
- **All**, **Passed**, **Failed**, **Skipped**, **Blocked** — on Run execution page

### Dropdowns
- **Assignee** — lists project members
- **Priority** — low / normal / high / critical

### Toasts
- Success: `"Run has been saved"` (after Save)
- Success: `"Run has been finished"` (after Finish Run)
- Error: `"Title can't be blank"` (validation)
- Error: `"Failed to save run"` (server error)

### Modals / Dialogs
- **Delete confirmation** — "Are you sure you want to delete this run?"
- **Unsaved changes** — "You have unsaved changes. Leave anyway?"

### Empty states
- List page, no runs: message `"No runs yet. Create your first one."`

### Loading states
- List page: skeleton rows while fetching
- Run execution: spinner on test status change

## Happy-path sequence

1. Navigate to **Runs** page
2. Click **'Manual Run'** button
3. Fill **Title** input with `"Smoke run"`
4. (optional) Select **Plan** from dropdown
5. Click **'Save'** button
6. Verify toast `"Run has been saved"` appears
7. Verify new run is visible in runs list
```

## Rules

- **Every UI element referenced in a test step MUST exist in either catalog (shared ∪ delta)** — enforced by Step 3 Phase 3 element-name check
- **Toast text in quotes** — tests assert the exact string, not paraphrase
- **Icon-only buttons** — always grab tooltip via `aria-describedby`, never guess label from context
- **One screen per `## Screen:` section** — if a feature spans 5 screens, the shared catalog has 5 sections; sub-feature deltas add screens only when the sub-feature introduces a screen not in the shared pool
- **Depth-first exploration** — every interactive element (button, dropdown, filter trigger, menu) must be clicked to catalog what opens behind it. Panels, sidebars, modals, dropdown options — all cataloged as nested sub-sections under the parent element
- **Reuse existing catalog** — Step 2.2 (ui-explorer `sub-feature-delta`) always reads `_shared-ui.md` first and writes ONLY new elements. Do NOT re-list shared chrome in the delta file. If a shared element turned out to be wrong → fix it in `_shared-ui.md`, not in the delta
- Store any feature-wide rules (e.g., "all destructive actions require confirmation") under a `## Conventions` section at the bottom of `_shared-ui.md`
