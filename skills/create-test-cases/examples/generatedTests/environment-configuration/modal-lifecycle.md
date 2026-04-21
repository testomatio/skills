<!-- suite -->
# Modal Lifecycle

Covers opening, dismissing, saving, and re-opening the Multi-Environment Configuration modal from the New Manual Run sidebar. Does NOT cover the launch action itself (owned by Launch Variants) or the content of the per-group environment checklist (owned by Group Management).

<!-- test
type: manual
priority: high
source: AC-45, ac-delta-1
automation: candidate
-->
## Open Multi-Environment Configuration modal from the sidebar @smoke

Opens the dedicated multi-environment configurator from the `+` affordance in the sidebar environment row.

## Preconditions
- Signed in as a user with access to a project
- The New Manual Run sidebar is open on the Runs page of the project

## Steps
- Click the `+` button in the environment row of the New Manual Run sidebar
  - _Expected_: the modal opens with the heading `"Multi-Environment Configuration"`
- Observe the body of the modal
  - _Expected_:
  - One env group slot is present and labeled `1`
  - The slot is expanded and shows a checklist of available environment options
  - A master `All` checkbox is visible above the environment options
- Observe the footer of the modal
  - _Expected_: `Save`, `Cancel`, `Add Environment`, and `Add all envs` controls are visible

<!-- test
type: manual
priority: high
source: ac-delta-5
automation: candidate
-->
## Dismiss Multi-Environment Configuration modal via ${dismiss_method} discards pending changes @negative

Verifies that both ways of dismissing the modal (Cancel button and close `×` icon) abandon any in-progress environment picks and leave the sidebar environment row unchanged.

## Preconditions
- Signed in as a user with access to a project
- The New Manual Run sidebar is open on the Runs page
- The Multi-Environment Configuration modal has just been opened with no prior selection

## Steps
- Expand env group `1` in the modal
  - _Expected_: the environment checklist is visible
- Check one environment option inside group `1`
  - _Expected_: the checkbox renders as selected
- Click the `${dismiss_method}` control
  - _Expected_: the modal closes
- Observe the New Manual Run sidebar
  - _Expected_:
  - The environment row shows the placeholder text `"Set environment for execution"`
  - No environment badge chips are rendered
  - The primary action footer shows a single `Launch` button

<!-- example -->
| dismiss_method |
| --- |
| Cancel |
| × close icon |

<!-- test
type: manual
priority: high
source: AC-45, AC-46, ac-delta-5
automation: candidate
-->
## Save one-group env selection commits it to the sidebar @smoke

Saves a single-group selection of one environment and verifies the sidebar reflects the committed value.

## Preconditions
- Signed in as a user with access to a project
- The New Manual Run sidebar is open on the Runs page
- The Multi-Environment Configuration modal is open with one empty group labeled `1`

## Steps
- Check one environment option inside group `1` (for example `Windows`)
  - _Expected_: the checkbox renders as selected
- Click the `Save` button in the modal footer
  - _Expected_: the modal closes
- Observe the environment row in the New Manual Run sidebar
  - _Expected_:
  - The selected environment value is rendered as a badge chip (e.g. `Windows`)
  - The placeholder `"Set environment for execution"` is no longer shown
- Observe the primary action footer of the sidebar
  - _Expected_: a single `Launch` button is shown (no Sequence or All variants)

<!-- test
type: manual
priority: high
source: ac-delta-15
automation: candidate
-->
## Re-open modal via the `N environments configured` button preserves the existing selection

After two env groups are saved, the sidebar env row becomes a button that re-opens the same modal populated with the prior selection.

## Preconditions
- Signed in as a user with access to a project
- The New Manual Run sidebar is open on the Runs page
- Two env groups have been configured and saved — group `1` with one environment checked and group `2` with a different environment checked

## Steps
- Observe the environment row in the sidebar
  - _Expected_: a `2 environments configured` button is shown in place of the badge chips
- Click the `2 environments configured` button
  - _Expected_: the Multi-Environment Configuration modal re-opens
- Observe the modal body
  - _Expected_:
  - Two group slots are present, labeled `1` and `2`
  - Each slot header reflects the previously selected environment value (e.g. `1 Windows`, `2 Chrome`)
- Expand group `1`
  - _Expected_: the previously checked environment option remains selected in the checklist
- Expand group `2`
  - _Expected_: the previously checked environment option remains selected in the checklist

<!-- test
type: manual
priority: normal
source: ac-delta-5, ac-delta-15
automation: candidate
-->
## Close modal via `×` after editing a saved selection discards the edits @negative

Re-opens the modal on a previously saved configuration, changes one environment, and verifies that closing via the `×` icon abandons the edit — the sidebar continues to show the original committed value.

## Preconditions
- Signed in as a user with access to a project
- The New Manual Run sidebar is open on the Runs page
- One env group has been saved with a single environment selected (the sidebar shows that environment as a badge chip)

## Steps
- Click the `+` button or the environment badge chip in the sidebar to re-open the modal
  - _Expected_: the Multi-Environment Configuration modal opens with group `1` populated with the prior selection
- Expand group `1` if not already expanded
  - _Expected_: the prior selection is visible in the checklist
- Uncheck the previously selected environment option
  - _Expected_: the checkbox renders as unselected
- Check a different environment option inside group `1`
  - _Expected_: the new option renders as selected
- Click the `×` close icon in the modal header
  - _Expected_: the modal closes
- Observe the environment row in the sidebar
  - _Expected_:
  - The badge chip shows the original committed environment value (unchanged from before the edit)
  - The newly checked environment is NOT shown as a badge chip
