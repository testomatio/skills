---
name: setup-pr-testing
description: Set up CI so pull requests drive selective testing with Testomat.io. When a PR opens, a test run scoped to its changes is created for testers. The affected automated tests launch after a preview deploy or on merge. Use when the user wants to integrate Testomat.io runs into a CI pipeline, create test runs per pull request, or trigger affected tests from CI events.
license: MIT
metadata:
  author: Testomat.io
  version: 2.0.0
---

# Setup PR Testing

I set up a project's CI for PR-driven testing: when a PR opens, a run scoped to its diff is created; the affected automated tests launch after a preview deploy or on merge. Every reporter command the jobs execute is documented in `run-tests-with-testomatio-reporter` — read it before wiring.

> **GOAL: a working pipeline committed to the project's own CI system.** That CI configuration is the one and only finished result. **I run locally to author it — I am never part of CI.** Do not execute reporter commands while authoring; the one exception is the final battle-test (Step 8), on a PR the user picked.

```
PR opened   ──▶ create one run scoped to the PR diff — nothing executes
                  (kind per the project's tests · run id persisted for the launch phases)

PR updated  ──▶ nothing is recreated — the scope refreshes at launch time

preview up  ──▶ only if each commit deploys to a preview environment:
                  after the deploy-finished signal, launch the automated part
                  against the preview (remote profile · inline · another repo)

PR merged   ──▶ launch with the final merged diff
```

## The coverage map drives everything

A coverage map maps source files/globs to test identifiers; the reporter filters it by the diff so only impacted tests are prepared and run. It is produced by the `qa-test-code-coverage` skill — default `coverage.tests.yml`, one file serving both manual and automated tests. Missing map → delegate to `qa-test-code-coverage`; never hand-write one here. Without a map nothing can be filtered and no pipeline can be wired.

## Method, not snippets

The valuable knowledge here is the phase model and the decisions to confirm with the user. The reporter commands come from `run-tests-with-testomatio-reporter`; translating triggers into a specific CI's YAML/Groovy is yours — you already know how every CI expresses "on PR open", "after deploy finished", "on merge", "carry a value between pipelines", and "don't fail the pipeline". Write that config for the CI in front of you; never bake per-CI workflow files into this skill.

## Critical Constraints

- **The deliverable is committed CI config — never execute the reporter while authoring.** The sole exception is the user-approved battle-test (Step 8).
- **Never guess a CI profile name.** Pick from a list (Testomat.io MCP) confirmed by the user, or ask the user for the name.
- **Battle-test safety:** an open PR only gets a run created — executing tests is allowed only for a PR that is already merged.
- **Discovery first.** Delegate to `scan-automation-project` before writing anything.
- **Never assume or hardcode the CI system.** Read the repo; if unclear, ask.
- **No coverage map → no pipeline.** Delegate map creation to `qa-test-code-coverage`; filtering is never skipped.
- **The PR-open job creates the run and executes nothing.**
- **Preview launches gate on a deploy-finished signal** — never on the push itself.
- **Launch jobs never block a PR and never fail a merge/release pipeline.** They are observation, not gates.
- **PR comments come from the reporter's own pipes** — never script a PR-comment API call.
- **Every run gets a PR-based title and a rungroup.**
- **Only touch CI config files.** Never source or test files.

## Workflow

### Step 1 — Discover

- Delegate to `scan-automation-project`: which e2e framework exists (unit/integration don't count), are there manual `.test.md` cases, do automated tests live in this repo or elsewhere.
- Read the repo's CI config files to identify the CI system. Several CIs or none → ask which one runs PRs.
- Locate the coverage map (default `coverage.tests.yml`). Missing → propose creating it and delegate to `qa-test-code-coverage`.

### Step 2 — Identify the project and its CI profiles

- Testomat.io MCP connected → fetch the project's CI profiles and environments through it (`testomatio-mcp` skill to connect).
- ❓ No MCP → ask the user for the project slug (it names the CI secret, Step 6) and whether CI profiles exist in Settings → CI.

### Step 3 — Choose how automated tests execute

| Mode                            | When it fits                                                                                      |
| ------------------------------- | ------------------------------------------------------------------------------------------------- |
| Remote — Testomat.io CI profile | a profile matching the e2e suite exists (Settings → CI); Testomat.io owns runner, env, secrets    |
| Inline — this pipeline          | mobile/simulators, services this pipeline spins up, or an e2e job that already works in this repo |
| Cross-repo dispatch             | the e2e suite lives in another repo and no CI profile covers it                                   |

- Profiles listed in Step 2 → remote is the simplest start; ❓ present the list and ask the user to choose — profiles differ by workflow and job names, never pick one silently.
- ❓ No profile known → present the three modes and ask; for remote, ask the user for the exact profile name.
- No profile but the user wants remote → creating one in Testomat.io (Settings → CI) is a prerequisite; wire the launch step ready to enable.
- No e2e suite anywhere → wire only the PR-open phase with a manual run; never fabricate an e2e job.

### Step 4 — Ask the unknowns

Read the CI files first so you don't ask what's already answered:

1. **Preview environments** — is every commit deployed to a preview server? If yes: what is the observable deploy-finished signal, and where does the preview URL surface?
2. **Post-merge timing** — launch right on merge, or wait for a staging/production deploy to finish? A deploy gate needs its own observable signal.
3. **Rungroup strategy** — week / day / release / milestone.
4. **Diff base** — the PR's target branch for PR jobs; post-merge jobs need the previous mainline tip (diff-base rules in `run-tests-with-testomatio-reporter`).

### Step 5 — Wire the phases into CI

Write the jobs in the CI's own syntax; take every command and env var from `run-tests-with-testomatio-reporter`.

**(a) PR opened → create the run.**

- Use `start` with the coverage filter; pick the run kind matching the project's tests.
- Persist the printed run id with the CI's native value-passing mechanism (artifact, variable, output); fallback is shared-run title matching.
- Run once per PR (on open); pushes to the PR don't recreate runs.
- A diff affecting zero tests creates no run — the job still succeeds.

**(b) Preview deployed → launch against the preview** (only when Step 4 confirmed previews).

- Trigger on the deploy-finished signal, never on the push.
- Remote mode forwards the preview URL as a remote param; inline mode points the runner's own base-URL env at it.
- Manual cases need no launch — testers work through them against the preview by hand.

**(c) PR merged → launch with the final diff.**

- Target the persisted run id; pass a fresh coverage filter with the post-merge diff base so the final merged diff decides what runs.
- Cross-repo mode: trigger the e2e repo's pipeline with the CI's native mechanism, passing the run id, API key, and title env into it.
- Keep the job non-blocking and off the release's critical path.

### Step 6 — Ensure secrets are set

- Store the project API key as `TESTOMATIO_<project_slug>` in the CI's secret store; map it to the `TESTOMATIO` env var in every job that calls the reporter.
- Tell the user exactly where to add it: name the secret-store location the CI at hand uses for this repo/pipeline and the exact secret name to type.
- Provision the PR-comment pipe token the same way (tokens per platform in `run-tests-with-testomatio-reporter`).
- ❓ Ask the user to confirm the secrets are in place before the pipeline PR merges — a pipeline with missing secrets fails on its first PR.
- The CI profile for remote launches is configured in Testomat.io (Settings → CI), not stored as a repo secret.

### Step 7 — Suggest a PR with the new workflow

- Commit the CI config on a branch and suggest opening a PR through the project's normal flow — the pipeline lands reviewed, never pushed straight to the default branch.
- Put in the PR description: the phases wired, the execution mode chosen, and the secrets/prerequisites the reviewers must provision before merging.
- Where the CI runs PR-triggered workflows from the branch itself, point out that this very PR will exercise the PR-opened phase.

### Step 8 — Battle-test the setup (on approval)

Prove the pipeline's commands work before the CI ever runs them — by running them once, locally, on a real change.

- ❓ Ask the user for a real PR to validate with — open or already merged — and for approval to create real runs.
- Reproduce the pipeline's diff locally: open PR → check out its branch and diff against the target branch; merged PR → check out the merge commit and diff against the pre-merge tip.
- Create the run exactly as phase (a) does — same kind, same filter — with a title that marks it as a battle-test.
- Open PR → stop here: the run stays scheduled, nothing executes.
- Merged PR → the change is already in mainline, so launching is safe: run the phase (c) launch against the created run.
- Report every run created — id, kind, and the tests it scoped — and ask the user to review it in Testomat.io: does the scope match what that diff should affect?
- Zero tests matched → report it as a finding, then pick a PR that touches mapped source files together with the user.

### Step 9 — Summarize and hand off

Report: the CI targeted and files written; which phases are wired and which were skipped (no previews / no e2e / no CI profile); the chosen execution mode; title scheme and rungroup; how the launch steps find the prepared run (run id carrier or shared title); the battle-test outcome and the runs awaiting the user's review; secrets and prerequisites still to provision; assumptions to confirm. Recommend committing the coverage map alongside the CI config.

## Examples

**Example 1 — previews + a configured CI profile**
MCP lists the project's CI profiles and the user picks the one running the e2e suite; the user confirms every commit deploys to a preview. → Wire all three phases: one mixed run created on PR open, preview launch gated on the deployment-success event with the preview URL as a remote param, merge launch with a fresh post-merge filter. Enable the platform's comment pipe.

**Example 2 — e2e lives in another repo, no CI profile**
Unsure how to execute → present the modes. User picks cross-repo dispatch: the merge job triggers the e2e repo's pipeline via the CI's native mechanism, passing the run id so results land in the prepared run. Note the remote-profile option as the simpler future path.

**Example 3 — no coverage map yet**
No `coverage*.yml` found → explain nothing can be filtered without a map; delegate to `qa-test-code-coverage`; wire CI only after the map exists.

**Example 4 — manual-only project**
`scan-automation-project` finds `.test.md` cases and no e2e framework → wire only the PR-open phase with a manual run, complete at creation. No preview or merge launch phases; explain those need an e2e suite first.

## Related skills

`run-tests-with-testomatio-reporter` (the reporter commands every job executes), `qa-test-code-coverage` (creates the coverage map this skill consumes), `scan-automation-project` (mandatory discovery), `qa-e2e-tests-reporting` (install the reporter if the project has no Testomat.io integration yet), `sync-test-cases-with-tms` (manual cases not yet in Testomat.io).
