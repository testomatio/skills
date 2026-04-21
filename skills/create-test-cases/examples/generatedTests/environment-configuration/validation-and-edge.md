<!-- suite -->
# Validation and Edge Cases

Covers edge and negative paths of the Multi-Environment Configuration modal and the multi-env launch actions — silent-accept of empty groups, scope-level validation surfaced by `Launch All`, the boundary of removing the final env group, and two deferred scenarios that document gaps discovered during UI exploration (one waiting on product clarification, one waiting on project-level environment seed data).

<!-- test
type: manual
priority: normal
source: ac-delta-12
automation: candidate
-->
## Save modal with an empty env group is silently accepted @boundary

Documents the current behaviour that the modal's `Save` action does not validate against empty groups — a group with no selected envs is accepted without an error and carries through to the sidebar unchanged.

## Preconditions
- Signed in as a user with access to a project
- The New Manual Run sidebar is open on the Runs page
- The Multi-Environment Configuration modal is open with one empty group labeled `1`

## Steps
- Observe the environment checklist in group `1`
  - _Expected_: no environment options are selected
- Click the `Save` button
  - _Expected_:
  - The modal closes
  - No validation error is shown
- Observe the environment row in the sidebar
  - _Expected_:
  - No environment badge chip is rendered
  - The placeholder `"Set environment for execution"` is shown
- Observe the primary action footer of the sidebar
  - _Expected_: a single `Launch` button is shown

<!-- test
type: manual
priority: normal
source: ac-delta-12
automation: candidate
-->
## Clicking `Launch All` with `Without tests` scope surfaces the validation banner and blocks run creation @negative

Verifies that combining multi-env configuration with the `Without tests` scope blocks `Launch All` at the scope level — an in-sidebar banner explains the constraint and no run is created.

## Preconditions
- Signed in as a user with access to a project
- The New Manual Run sidebar is open on the Runs page
- Two env groups have been saved with at least one environment each
- The scope `Without tests` is currently selected

## Steps
- Observe the primary action footer of the sidebar
  - _Expected_: `Launch in Sequence` and `Launch All` buttons are visible
- Click the `Launch All` button
  - _Expected_:
  - The sidebar stays open
  - An informational banner with the text `"Select a plan or select all"` appears inside the sidebar
  - No new run or RunGroup is created on the Runs page
- Click the `Dismiss` button on the validation banner
  - _Expected_: the banner is no longer visible
- Switch the scope to `All tests`
  - _Expected_: the `All tests` scope tab is selected
- Click the `Launch All` button again
  - _Expected_:
  - A new RunGroup is created on the Runs page
  - No validation banner is shown
- Post-condition cleanup: delete the created RunGroup via its extra menu → `Purge` → confirm `Purge`
  - _Expected_: the banner `"This rungroup was deleted and the nested runs were moved to the Archive!"` is shown

<!-- test
type: manual
priority: normal
source: ac-delta-3, ac-delta-6
automation: candidate
-->
## Remove the last remaining env group clears selection and reverts to the single-`Launch` state @boundary

Exercises the boundary where every env group is removed — the sidebar must revert to the placeholder and the primary action must collapse from multi-env variants back to a single `Launch` button.

## Preconditions
- Signed in as a user with access to a project
- The New Manual Run sidebar is open on the Runs page
- Two env groups have been saved, each with at least one environment selected

## Steps
- Click the `2 environments configured` button in the sidebar
  - _Expected_: the Multi-Environment Configuration modal opens with two groups populated
- Click the minus `−` remove button on the header of group `2`
  - _Expected_: group `2` is no longer rendered
- Click the minus `−` remove button on the header of group `1`
  - _Expected_:
  - A single empty group labeled `1` remains in the modal body (the modal never renders zero groups)
  - No environment option is selected
- Click the `Save` button
  - _Expected_: the modal closes
- Observe the environment row in the sidebar
  - _Expected_:
  - No environment badge chip is rendered
  - The placeholder `"Set environment for execution"` is shown
- Observe the primary action footer of the sidebar
  - _Expected_:
  - A single `Launch` button is shown
  - Neither `Launch in Sequence` nor `Launch All` is shown

<!-- test
type: manual
priority: low
source: AC-48, ac-delta-8
automation: deferred
automation-note: "@unclear — the documented AC-48 single-run multi-environment mode was not observable in the current UI during exploration; deferred until product confirms whether the button exists, is hidden behind a toggle, or has been removed."
-->
## `One Run` single-run multi-environment mode — documented gap @unclear

Documents the ongoing investigation of the single-run multi-environment mode (see `source:` for AC traceability). The current UI exposes only `Launch in Sequence` and `Launch All` when 2+ env groups are configured — no button variant produces a single run whose results are grouped per environment. This test records the investigation path so regressions or product changes are caught in a future re-run; exact locator to be confirmed with product.

## Preconditions
- Signed in as a user with access to a project
- The New Manual Run sidebar is open on the Runs page
- Two env groups have been saved with at least one environment each

## Steps
- Observe the primary action footer of the sidebar
  - _Expected_:
  - `Launch in Sequence` and `Launch All` buttons are visible
  - No button labeled `Launch` (plain) or `Launch (One Run)` or similar is visible
- Inspect any split-button or dropdown affordance near the launch buttons
  - _Expected_: no split / dropdown control exists in the current UI — the two multi-env buttons are independent
- Record the absence of the `One Run` mode variant for follow-up with product
  - _Expected_: the gap is acknowledged; no run is launched in this test

<!-- test
type: manual
priority: low
source: ac-delta-4
automation: deferred
automation-note: "@needs-project-setting — verifying `Category:Value` grouping of environment options requires Settings → Environments seed data (e.g. `Browser:Chrome`, `OS:Windows`). The project under test currently has a flat list of predefined envs; seeded data is out of this sub-feature's ownership and lives under Settings → Environments."
-->
## `Category:Value` grouping of environments in the checklist @needs-project-setting

Documents the expected dropdown structure when project-level environments are seeded using the recommended `Category:Value` naming convention. Exact locator to be confirmed once the seed data is in place; ownership of the seed configuration itself lives under Settings → Environments (out of scope for this sub-feature).

## Preconditions
- Signed in as a user with access to a project whose Settings → Environments list contains entries formatted as `Category:Value` (for example `Browser:Chrome`, `Browser:Firefox`, `OS:Windows`, `OS:MacOS`)
- The New Manual Run sidebar is open on the Runs page

## Steps
- Click the `+` button in the environment row
  - _Expected_: the Multi-Environment Configuration modal opens
- Expand group `1` and observe the environment checklist
  - _Expected_:
  - Options with the same category prefix (e.g. `Browser:Chrome`, `Browser:Firefox`) are visually grouped or sorted together in the checklist
  - The category prefix is shown consistently on each option label
- Record the observed grouping behaviour for traceability
  - _Expected_: the grouping rendering matches the project's seeded categories (exact affordance to be confirmed once a project with seeded envs is available)
