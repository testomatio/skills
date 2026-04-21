# create-test-cases — Lessons Learned

Non-obvious gotchas from real usage. Standard config is in SKILL.md.

**Publishing:** use `/publish-test-cases-batch` (a separate skill — local for now, not yet part of this repo) — this skill never pushes. All publish/branch/label gotchas live in that skill's `references/api-reference.md`. Until it is published, you can use the Testomat.io CLI (`npx check-tests` / `@testomatio/reporter`) or the [`sync-cases`](../sync-cases/SKILL.md) skill to push approved MD to Testomat.io.

## Intake: Check Feature Artifacts First

Under the feature-first flow the Resume Detector (see SKILL.md § Pre-step) probes feature artifacts before Step 0 on every invocation. If the argument references a sub-feature by number (e.g., `#5 Time Tracking`) and `test-cases/{F}/destructuring.md` + `_ac-baseline.md` + `_shared-ui.md` already exist and are valid → the intake is effectively done; the detector routes straight into Step 2 (sub-feature slice) for the requested `S`. You do NOT re-run Q1-Q4. Confirm the resolved `{F, S}` with the user and proceed.

If the feature artifacts are missing or partial → detector routes to Step 0 (intake) or Step 1 (feature phase) as appropriate. Never skip Step 1 just because an intake file exists — the feature phase produces `_shared-ui.md`, `_ac-baseline.md`, `_existing-steps.md`, and the destructuring map, all of which are required before any sub-feature slice can run.

## Playwright Login — Credentials

Always use:
- **Email:** `$TESTOMATIO_EMAIL` env var
- **Password:** `$TESTOMATIO_PASSWORD` env var
- Read via shell (`echo $TESTOMATIO_EMAIL`), then fill Playwright form
- **UI exploration:** pick a dedicated exploration project (e.g. `$TESTOMATIO_EXPLORATION_PROJECT`) — never explore against production data

## Browser Traps (Playwright MCP)

1. **Icon-only toolbar buttons** — use `aria-describedby` → popper content to identify
2. **Delete button proximity** — adjacent to extra menu button. Always verify button identity before clicking
3. **Detail panel blocks tree clicks** — press Escape to close the detail panel before clicking tree elements. Or use `browser_evaluate` to find and click elements programmatically
4. **Intercepted clicks on link buttons** — some link-styled buttons (e.g., Manual Run) can be intercepted by overlapping elements. If click fails with "intercepted pointer events", navigate directly to the target URL instead

## Nested Suites

1. **Multiple `<!-- suite -->` blocks in one file DO NOT nest** — parser uses single `currentSuite` variable, each block overwrites the previous. Creates duplicates and loses child names
2. **`## Steps` heading parsed as test** — when preceded by another heading, the parser treats `## Steps` as a test title, creating ghost test entries
3. **Directory structure is the only working approach** — `parent-dir/child.md` → `parent-dir` folder + child suite nested inside. Tested 2026-04-15

## MD Format Gotchas (affect generation, not publishing)

- **`tags:` / `labels:` / `id:` in `<!-- test -->` header** → server 422 on push → never include in generated MD. See [test-case-format.md](references/test-case-format.md).

All publish/branch/label gotchas (Import Lock, `--sync` collisions, `TESTOMATIO_PREPEND_DIR`, branch UI verification, labels-on-branch 404, etc.) are owned by `/publish-test-cases-batch` (separate skill — local for now, not yet part of this repo) — see its `references/api-reference.md`.
