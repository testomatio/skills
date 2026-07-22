---
name: run-affected-tests-in-ci
description: Wire a project's CI to execute only the automated tests affected by a change — filtered through the coverage map from `qa-test-code-coverage` — at the trigger the team picks (after a preview deploy, on merge, on a schedule). Three execution modes — a Testomat.io CI profile (`reporter run --remote`), inline in the pipeline, or dispatching the repo where the e2e suite lives. Launches the run prepared per PR by `setup-pr-test-runs` when one exists, or creates its own. Use this skill when the user wants to run only the affected tests on preview or after merge, launch e2e through a Testomat.io CI profile or `--remote`, wire preview-deploy test runs, or integrate the coverage map into CI execution. CI-agnostic — adapts to whatever CI the project uses (GitHub Actions, GitLab CI, Azure Pipelines, Jenkins, Bitbucket, CircleCI, etc.).
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# Run Affected Tests in CI

I wire a project's CI to execute the automated tests affected by a change — the coverage map filtered by the diff decides what runs. Launch happens at the trigger the team picks: after a preview deploy, on merge, or on a schedule. When `setup-pr-test-runs` prepared a run for the PR, the launch lands in it; otherwise the launch creates its own run.

> **GOAL: a working launch pipeline committed to the project's own CI system.** That CI configuration is the one and only finished result. **I run locally to author it — I am never part of CI.** While authoring, the single network call allowed is the read-only project info API (Step 2). The one exception is the final battle-test (Step 8): with the user's approval, on a merged PR they picked, run the pipeline's own commands once to prove the setup works.

```
preview up   ──▶ only if each commit deploys to a preview environment:
                   after the deploy-finished signal, launch against the preview
                   reporter run --remote <profile> --remote-param <param>=<preview-url>

PR merged    ──▶ launch with the final diff
                   reporter run --remote <profile> --filter coverage:…

either launch ─▶ TESTOMATIO_RUN=$RUN_ID targets the run prepared per PR;
                   without it the launch creates its own run
```

## The coverage map drives everything

A coverage map maps source files/globs to test identifiers; the reporter filters it by the diff so only impacted tests run. It is produced by the `qa-test-code-coverage` skill — default `coverage.tests.yml`, one file serving both manual and automated tests. Missing map → delegate to `qa-test-code-coverage`; never hand-write one here. Without a map nothing can be filtered and no pipeline can be wired.

## Method, not snippets

The valuable knowledge here is the launch contract ([references/REPORTER_CONTRACT.md](references/REPORTER_CONTRACT.md)) and the decisions to confirm with the user. Translating "after deploy finished", "on merge", or "trigger another repo's pipeline" into a specific CI's YAML/Groovy is not — you already know how every CI expresses those, and how to keep a job from failing the pipeline. Write that config yourself for the CI in front of you; never bake per-CI workflow files or CLI calls into this skill.

## Critical Constraints

- **The deliverable is committed CI config — never execute the reporter while authoring.** Only the read-only project info API call is allowed; the sole exception is the user-approved battle-test (Step 8).
- **Battle-test safety: execution is allowed only for a PR that is already merged.**
- **Discovery first.** Delegate to `scan-automation-project` before writing anything.
- **Never assume or hardcode the CI system.** Read the repo; if unclear, ask.
- **No coverage map → no pipeline.** Delegate map creation to `qa-test-code-coverage`; filtering is never skipped.
- **No e2e suite anywhere → nothing to wire.** Never fabricate an e2e job; runs per PR for manual testers are `setup-pr-test-runs`.
- **Preview launches gate on a deploy-finished signal** — never on the push itself.
- **Execution jobs never block a PR and never fail a merge/release pipeline.** They are observation, not gates.
- **PR comments come from the reporter's own pipes** (GitHub / GitLab / Bitbucket) — never script a PR-comment API call.
- **Every run gets a change-based title and a rungroup** — `TESTOMATIO_TITLE` from the PR/change, `TESTOMATIO_RUNGROUP_TITLE` per the user's grouping strategy.
- **Only touch CI config files.** Never source or test files.

## Workflow

### Step 1 — Discover

- Delegate to `scan-automation-project`: which e2e framework exists (unit/integration don't count), do the automated tests live in this repo or elsewhere.
- No e2e suite → stop; if the goal is runs for manual testers, suggest `setup-pr-test-runs`.
- Read the repo's CI config files to identify the CI system. Several CIs or none → ask which one to wire.
- Locate the coverage map (default `coverage.tests.yml`). Missing → propose creating it and delegate to `qa-test-code-coverage`.
- Check whether `setup-pr-test-runs` already wired a PR-open job — if so, the launch must target its prepared run (contract §4).

### Step 2 — Pull the project info from Testomat.io

The read-only info API describes the project:

```bash
curl -s -H "Authorization: Bearer $TESTOMATIO" \
  "https://app.testomat.io/api/v2/<project-id>/info"
```

- Requires the project API key available locally (env var or `.env`); on a self-hosted instance replace the host with the instance URL.
- Capture from `data`: `project_id` (the project slug, names the CI secret in Step 6), `ci_profiles` (drives Step 3 — fields in contract §6), `environments` (candidates for `TESTOMATIO_ENV`).
- ❓ No key at hand or the call fails → ask the user for the project slug and CI profile name instead.

### Step 3 — Choose how the tests execute

Three execution modes exist. If a `ci_profiles` entry matches the e2e suite, `--remote` is the simplest start — recommend it. **If unsure, present all three to the user:**

| Mode                            | When it fits                                                                                      | Launch command shape                                             |
| ------------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Remote — Testomat.io CI profile | a profile matching the e2e suite exists (Settings → CI); Testomat.io owns runner, env, secrets     | `reporter run --remote <profile-name>`                           |
| Inline — this pipeline          | mobile/simulators, services this pipeline spins up, or an e2e job that already works in this repo  | `reporter run "<runner command>" --filter "coverage:…"`          |
| Cross-repo dispatch             | the e2e suite lives in another repo and no CI profile covers it                                    | CI-native cross-pipeline trigger, passing `TESTOMATIO_RUN` along |

- Match profiles to the e2e suite by `profile_name` and `service` against the framework found in Step 1.
- ❓ Several plausible profiles, or none clearly e2e → ask the user which profile to use.
- No profile but the user wants remote → creating one in Testomat.io (Settings → CI) is a prerequisite; wire the launch step ready to enable.

### Step 4 — Choose the triggers and ask the unknowns

Read the CI files first so you don't ask what's already answered:

1. **Preview environments** — is every commit deployed to a preview server? If yes: what is the observable deploy-finished signal, and where does the preview URL surface?
2. **Post-merge timing** — launch right on merge, or wait for a staging/production deploy to finish? A deploy gate needs its own observable signal.
3. **Rungroup strategy** — week / day / release / milestone; reuse the one `setup-pr-test-runs` chose if it is wired.
4. **Diff base** — the PR's target branch for preview jobs; post-merge jobs need a different base (contract §2).

### Step 5 — Wire the launch jobs into CI

Write the jobs in the CI's own syntax. The skill-specific parts are the reporter commands and env vars ([references/REPORTER_CONTRACT.md](references/REPORTER_CONTRACT.md)); triggers and value-passing are ordinary CI config.

**Prepared run or standalone.** A prepared run (from `setup-pr-test-runs`) is targeted with `TESTOMATIO_RUN=$RUN_ID` — results land in the run testers already work in (contract §4). Without one, drop the variable — the same command creates its own run, which then needs `TESTOMATIO_TITLE` and `TESTOMATIO_RUNGROUP_TITLE` set on the launch itself (contract §3).

**(a) Preview deployed → launch against the preview** (only when Step 4 confirmed previews).

Triggered by the deploy-finished signal, never by the push. Remote mode passes the preview URL as a profile param; inline mode points the runner's own env at it:

```bash
TESTOMATIO_RUN=$RUN_ID npx @testomatio/reporter run --remote <profile-name> \
  --remote-param <param-name>=<preview-url>
```

Manual cases in a prepared run need no launch — testers work through them against the preview by hand.

**(b) PR merged → launch with the final diff.**

```bash
TESTOMATIO_RUN=$RUN_ID npx @testomatio/reporter run --remote <profile-name> \
  --filter "coverage:file=<coverage-map>,diff=<post-merge-base>"
```

- The fresh `--filter` scopes to the final merged diff; without it a prepared run's stored scope from PR open is reused.
- Post-merge, the target branch is no longer a usable diff base — use the previous mainline tip (contract §2).
- Inline and cross-repo modes: same `TESTOMATIO_RUN` carry, launch shape per contract §5.
- Keep every launch job non-blocking and off the release's critical path.

### Step 6 — Ensure secrets are set

- Store the project API key in the CI's secret store as `TESTOMATIO_<project_slug>` — slug from Step 2.
- Tell the user exactly where to add it: name the secret-store location the CI at hand uses for this repo/pipeline and the exact secret name to type.
- Map that secret to the `TESTOMATIO` env var inside every job that calls the reporter.
- Enable the PR-comment pipe by provisioning its token the same way (contract §7): GitHub → `GH_PAT` (the workflow's built-in token works), GitLab → `GITLAB_PAT` (`api` scope), Bitbucket → `BITBUCKET_ACCESS_TOKEN` (repository variable).
- The key itself is already proven valid — the Step 2 info call succeeded with it.
- ❓ Ask the user to confirm the secrets are in place before the pipeline PR merges — a pipeline with missing secrets fails on its first launch.
- CI platform without a reporter pipe (e.g. Azure DevOps) → no PR comment; results are visible in Testomat.io.
- The CI profile for `--remote` is configured in Testomat.io (Settings → CI), not stored as a repo secret.

### Step 7 — Suggest a PR with the new workflow

- Commit the CI config on a branch and suggest opening a PR through the project's normal flow — the pipeline lands reviewed, never pushed straight to the default branch.
- Put in the PR description: the triggers wired, the execution mode chosen, and the secrets/prerequisites the reviewers must provision before merging.

### Step 8 — Battle-test the setup (on approval)

Prove the pipeline's commands work before the CI ever runs them — by running them once, locally, on a real change. **Execution only for a merged PR** — its change is already in mainline, so running tests against it is safe.

- ❓ Ask the user for an already-merged PR to validate with and for approval to launch a real run.
- Reproduce the pipeline's diff locally: check out the merge commit and diff against the pre-merge tip (contract §2).
- Launch exactly as the merge job does — `TESTOMATIO_RUN` if a prepared run exists, same filter — with a title that marks it as a battle-test.
- Report every run created or launched — id and the tests it scoped — and ask the user to review it in Testomat.io: does the scope match what that diff should affect?
- Zero tests matched → report it as a finding, then pick a PR that touches mapped source files together with the user.

### Step 9 — Summarize and hand off

Report: the CI targeted and files written; the execution mode chosen; which triggers are wired and which were skipped (no previews / no deploy signal); how the launch finds the prepared run, or that it runs standalone; title scheme and rungroup; the battle-test outcome and the runs awaiting the user's review; secrets and prerequisites still to provision. Recommend committing the coverage map alongside the CI config. Testers should get a run per PR too → continue with `setup-pr-test-runs`.

## Examples

**Example 1 — previews + a configured CI profile**
Info API lists a profile matching the e2e suite; every commit deploys to a preview → wire the preview launch gated on the deployment-success event with the preview URL as a `--remote-param`, and the merge launch with a fresh post-merge filter. Enable the platform's comment pipe.

**Example 2 — e2e lives in another repo, no CI profile**
Unsure how to execute → present all three modes. User picks cross-repo dispatch: the merge job triggers the e2e repo's pipeline via the CI's native mechanism, passing `TESTOMATIO_RUN` so results land in the prepared run. Note the remote-profile option as the simpler future path.

**Example 3 — standalone merge launch, no PR-open phase**
Automated-only project, no prepared runs → wire a single post-merge job without `TESTOMATIO_RUN`; the launch creates its own run scoped by the fresh filter. Suggest `setup-pr-test-runs` if testers later need runs per PR.

## References

- [references/REPORTER_CONTRACT.md](references/REPORTER_CONTRACT.md) — coverage filter, diff base, `run --remote`, standalone launches, inline & cross-repo, finding the prepared run, info API, pipes, secrets.

## Related skills

`qa-test-code-coverage` (creates the coverage map this skill consumes), `scan-automation-project` (mandatory discovery), `setup-pr-test-runs` (creates the per-PR run this skill launches), `qa-e2e-tests-reporting` (install the reporter if the project has no Testomat.io integration yet).
