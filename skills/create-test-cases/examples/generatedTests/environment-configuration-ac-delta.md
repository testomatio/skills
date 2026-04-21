---
feature: manual-tests-execution
suite: environment-configuration
references: _ac-baseline.md
baseline_acs_applicable: [AC-45, AC-46, AC-47, AC-48, AC-49, AC-50]
delta_ac_count: 15
source: mixed
generated_at: 2026-04-18T00:00:00Z
updated_at: 2026-04-18T15:00:00Z
---

## Baseline ACs applicable to environment-configuration

Pulled from `_ac-baseline.md`; kept only those inside #4's ownership from `destructuring.md`.

- **AC-45** (baseline) — In the New Manual Run dialog, user can click "+" in the environment section to configure one or more environments per run group.
- **AC-46** (baseline) — Each environment group supports selecting multiple environments from the dropdown.
- **AC-47** (baseline) — "Add Environment" creates an additional environment group inside the same run.
- **AC-48** (baseline) — Multi-environment run mode "One Run" — all selected groups apply to a single run; results grouped by environment.
- **AC-49** (baseline) — Multi-environment "Launch in Sequence" — each group runs sequentially as a separate run, collected under one parent.
- **AC-50** (baseline) — Multi-environment "Launch All" (parallel) — each group starts simultaneously as a separate run.

### Cross-cutting concern A (Multi-environment configuration) — owner

#4 is the OWNER of concern A. Delta ACs below cover the must-test scenarios for #4 specifically; concerns affecting downstream sub-features (#1, #6, #7, #8) remain their responsibility.

### Explicitly excluded (per A2 "Does NOT own")

- AC-44 (Settings → Environments seed list) — site-wide setting; assumed as precondition in scope.md
- TQL env filter on Runs list — owned by #7

---

## Delta ACs (sub-feature-specific)

Derived from A2 Key elements + cross-cutting A must-test scenarios. Each will be confirmed or adjusted after 2.2 UI exploration.

- **ac-delta-1** — The environment section in the New Manual Run dialog displays a primary selector plus a visible "+" affordance that opens the environment configuration modal / inline group configurator.
- **ac-delta-2** — An existing environment group can be edited after it is added (changing selected environments) without recreating the group.
- **ac-delta-3** — An existing environment group can be removed from the run configuration before launch (delete / remove affordance per group).
- **ac-delta-4** — The environment dropdown inside a group lists environments grouped / prefixed by category when the recommended `Category:Value` format is used (e.g. `Browser:Chrome`, `OS:Windows`).
- **ac-delta-5** — The environment configuration modal exposes a primary "Save" action that commits the selection and returns to the main creation dialog; Cancel / dismiss discards the draft.
- **ac-delta-6** — With only a single environment group configured, the creation dialog's primary launch button is "Launch" (no Sequence / All variants surfaced).
- **ac-delta-7** — With two or more environment groups configured, the primary "Launch" button is REPLACED by two explicit buttons side-by-side: "Launch in Sequence" and "Launch All". There is no plain single-Run "One Run" variant as a distinct button (confirmed in 2.2 UI).
- **ac-delta-8** — UNCLEAR — AC-48 "One Run" multi-environment mode is not surfaced as a distinct launch action in the current UI. Either (a) the mode was removed, (b) AC-48 describes the single-group Launch behaviour, or (c) the button is hidden behind an unseen toggle. Log as @unclear in scope; do not generate a concrete test until product confirms.
- **ac-delta-9** — "Launch in Sequence" produces one parent RunGroup with multiple child runs that execute one after another; only one child is active at a time.
- **ac-delta-10** — "Launch All" (parallel) starts every child run simultaneously; all are marked "New Run" (In-Progress) immediately after launch and appear together on the Runs list.
- **ac-delta-11** — Each resulting child run surfaces its environment value as a badge on the Runs list / RunGroup children and on the run header (presence-only; list rendering owned by #7).
- **ac-delta-12** — Saving an environment group with zero environments selected is silently accepted — the modal closes without validation error; empty groups carry through to launch (confirmed in 2.2). NOTE: "Launch All" with `Without tests` scope fails with a non-modal banner `"Select a plan or select all"` — that is scope-validation, not env-group validation.
- **ac-delta-13** — The Multi-Environment Configuration modal exposes an "All" master checkbox per group that toggles every environment option on/off at once.
- **ac-delta-14** — The modal footer exposes an "Add all envs" shortcut link that populates every environment checkbox of the currently expanded group in one click.
- **ac-delta-15** — When the env selector shows `N environments configured` (2+ groups saved), clicking that button re-opens the Multi-Environment Configuration modal with the existing selection preserved (round-trip edit).

### Confirmed in 2.2 UI exploration

- Env groups are configured via a dedicated modal titled **"Multi-Environment Configuration"** (overlay), not inline group rows.
- With 2+ groups the launch is **two separate side-by-side buttons** — "Launch in Sequence" + "Launch All" — neither split-button nor dropdown.
- Save is never disabled by empty env groups; only scope validation (no tests picked + Launch All) gates launch.

### Remaining UNCLEAR

- AC-48 / ac-delta-8 "One Run" single-run mode — not observable in UI; scope as @unclear.
- ac-delta-4 `Category:Value` prefix grouping — requires project-level Environments seed data, which `project-for-testing` does not currently have; scope as @needs-project-setting.

---

## Sources

- `_ac-baseline.md` (AC-44 through AC-50)
- A2 destructuring row #4 environment-configuration (Owns / Does NOT own / Key elements)
- A2 cross-cutting concern A (Multi-environment configuration)
- Feature docs (see baseline frontmatter) — `environments.md`, `running-tests-manually.md`
