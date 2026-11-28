# HTML rules for RTM

One self-contained file: inline CSS and JS, no external requests. Light and dark themes: follow `prefers-color-scheme` by default, with a light/dark switcher in the header that remembers the viewer's choice. Works at phone width with no horizontal page scroll.

Show less details by default, provide more details on hover/expand.

Sections, top to bottom, each full width (not side by side):

1. Header: title and theme switcher.
2. Status tiles
3. Matrix
4. Orphan tests (forward only)
5. Excluded
6. Next actions
7. Footer

Omit empty sections.

#### Status tiles

- One tile per verdict plus Total: count and % of requirements; a stacked bar below with the same colors.
- Tiles are clickable filters for the matrix: click a verdict tile to show only its requirements; Total resets filter. The active tile is highlighted.
- Verdict colors, the same in tiles, bar, and badges: Covered green, Partially covered amber, Not covered red, Unclear purple.

#### Matrix

- **Group requirements by their parent** (story, epic, feature) when requirements are ACs or child items. Group header: parent ID and title, number of requirements, number of distinct test cases covering them, and a count per verdict. Grouping can be switched off with a toggle.
- Columns: Req ID, Requirement (short), Coverage badge, number of test cases, test case IDs. Hide the Requirement (title) column at phone width.
- Number of test cases per requirement and per group (distinct tests, so a test covering two ACs counts once in the group). A "Test case count" toggle (off by default) shows or hides these counts.
- Sorting: by Req ID (default), by coverage in both directions (worst first: Not covered, Partially covered, Unclear, Covered; best first: the reverse), by number of test cases. Sorting applies inside groups when grouping is on.
- Forward: show only test case IDs; show the title on hover (tooltip) and on expand. Mark automated tests.
- Click a row to expand it: full requirement text, test cases with titles and type (manual/automated), and the evidence (Covered) or the gap note (other verdicts).
- One "Expand all"/"Collapse all" toggle button; its label shows the next action.
- Controls share one style (border, radius, height, hover, focus ring): on/off settings (grouping, test case count) are toggle switches, sorting is a dropdown with its label and a chevron inside one control. No raw browser checkboxes or selects; set `color-scheme` so native popups follow the theme.
- ID chips: `display: inline-block; white-space: nowrap`. The background must never wrap or clip; tooltips must not change the layout.

#### Next actions

One block per action, with the skill and the IDs it applies to (if applicable), as a ready prompt in a code block with a Copy button. Example:

```text
/qa-write-test-cases Write test cases for SHOP-101-AC4 (removing a product recalculates the subtotal without reload).
```

#### Footer

Separated by a line.

Gray-colored text.

Requirements (source, scope), Test cases (source, scope), Matrix (direction), Date. One line each.
