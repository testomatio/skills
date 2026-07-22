---
name: setup-pr-test-runs
description: Create a test run in Testomat.io for every pull request, listing only the test cases affected by that PR. Testers open the run and know exactly what to check. Use when the user asks to create test runs per PR, wants manual testing scoped to each pull request, or wants the coverage map from `qa-test-code-coverage` connected to the PR pipeline. To also execute automated tests, follow up with `run-affected-tests-in-ci`. Works with any CI (GitHub Actions, GitLab CI, Azure Pipelines, Jenkins, Bitbucket, CircleCI, etc.).
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# Setup PR Test Runs

A pull request opens → one Testomat.io run appears for it, scoped to its diff. Manual cases are pending immediately, so testers begin. The automated part stays scheduled. Nothing executes here — launching the automated part later is `run-affected-tests-in-ci`'s job. My deliverable is the CI job that makes this happen.

> **GOAL: a working PR-open job committed to the project's own CI system.** That CI configuration is the one and only finished result. **I run locally to author it — I am never part of CI.** While authoring, the single network call allowed is the read-only project info API (Step 2). The battle-test (Step 7) may create real runs with the user's approval — `start` never executes tests, so it is safe on any PR.

```
PR opened   ──▶ create one run scoped to the PR diff — nothing executes
                  reporter start --kind mixed --filter coverage:… --format id
                  (manual cases pending — testers begin · automated part scheduled · RUN_ID persisted)

PR updated  ──▶ nothing is recreated — a later launch refreshes the scope
```

## The coverage map drives everything

A coverage map maps source files/globs to test identifiers; the reporter filters it by the PR diff so only impacted tests land in the run. It is produced by the `qa-test-code-coverage` skill — default `coverage.tests.yml`, one file serving both manual and automated tests. Missing map → delegate to `qa-test-code-coverage`; never hand-write one here. Without a map nothing can be filtered and no pipeline can be wired.

## Method, not snippets

The valuable knowledge here is the run-creation contract ([references/REPORTER_CONTRACT.md](references/REPORTER_CONTRACT.md)) and the decisions to confirm with the user. Translating "on PR open" into a specific CI's YAML/Groovy is not — you already know how every CI expresses that trigger, how it carries a value to a later pipeline, and how to keep a job from failing the PR. Write that config yourself for the CI in front of you; never bake per-CI workflow files or CLI calls into this skill.

## Critical Constraints

- **The deliverable is committed CI config — never execute the reporter while authoring.** Only the read-only project info API call is allowed; the sole exception is the user-approved battle-test (Step 7).
- **Discovery first.** Delegate to `scan-automation-project` before writing anything.
- **Never assume or hardcode the CI system.** Read the repo; if unclear, ask.
- **No coverage map → no pipeline.** Delegate map creation to `qa-test-code-coverage`; filtering is never skipped.
- **The PR-open job creates the run and executes nothing.** Manual cases are pending at creation; the automated part stays scheduled.
- **The job never blocks the PR.** A diff affecting zero tests creates no run — that is success, not failure.
- **Every run gets a PR-based title and a rungroup** — `TESTOMATIO_TITLE` from the PR, `TESTOMATIO_RUNGROUP_TITLE` per the user's grouping strategy.
- **Only touch CI config files.** Never source or test files.

## Workflow

### Step 1 — Discover

- Delegate to `scan-automation-project`: are there manual `.test.md` cases, is there an automated e2e suite (unit/integration don't count).
- Read the repo's CI config files to identify the CI system. Several CIs or none → ask which one runs PRs.
- Locate the coverage map (default `coverage.tests.yml`). Missing → propose creating it and delegate to `qa-test-code-coverage`.

### Step 2 — Pull the project info from Testomat.io

The read-only info API describes the project:

```bash
curl -s -H "Authorization: Bearer $TESTOMATIO" \
  "https://app.testomat.io/api/v2/<project-id>/info"
```

- Requires the project API key available locally (env var or `.env`); on a self-hosted instance replace the host with the instance URL.
- Capture from `data`: `project_id` (the project slug, names the CI secret in Step 5) and `environments` (candidates for `TESTOMATIO_ENV`).
- ❓ No key at hand or the call fails → ask the user for the project slug instead.

### Step 3 — Ask the unknowns

Read the CI files first so you don't ask what's already answered:

1. **Rungroup strategy** — week / day / release / milestone.
2. **Diff base** — the PR's target branch is the natural default (contract §2).
3. **Launch phases planned?** — if the automated part will be launched later (`run-affected-tests-in-ci`), the run id must reach that job; pick the carrier now (contract §4).

### Step 4 — Wire the PR-open job

Write the job in the CI's own syntax. Required env: `TESTOMATIO` (from the secret, Step 5), `TESTOMATIO_TITLE` (PR-based, e.g. `PR <number>: <title>`), `TESTOMATIO_RUNGROUP_TITLE`.

```bash
RUN_ID=$(npx @testomatio/reporter start --kind mixed \
  --filter "coverage:file=<coverage-map>,diff=<target-branch>" --format id)
```

- One run serves both kinds — manual cases pending immediately, automated part scheduled; `--format id` keeps stdout to just the run id.
- `--kind` follows the project's tests: `mixed` when manual and automated both exist, `manual` when manual-only, no flag when automated-only (contract §3).
- Persist `$RUN_ID` with the CI's native mechanism for passing a value to a later pipeline (artifact, variable, output). Fallback: shared-run title matching (contract §4).
- Run once per PR (on open); pushes to the PR don't recreate runs.
- A diff affecting zero tests creates no run — treat that as success.

### Step 5 — Ensure secrets are set

- Store the project API key in the CI's secret store as `TESTOMATIO_<project_slug>` — slug from Step 2.
- Tell the user exactly where to add it: name the secret-store location the CI at hand uses for this repo/pipeline and the exact secret name to type.
- Map that secret to the `TESTOMATIO` env var inside the job.
- The key itself is already proven valid — the Step 2 info call succeeded with it.
- ❓ Ask the user to confirm the secret is in place before the pipeline PR merges — a pipeline with a missing secret fails on its first PR.

### Step 6 — Suggest a PR with the new workflow

- Commit the CI config on a branch and suggest opening a PR through the project's normal flow — the pipeline lands reviewed, never pushed straight to the default branch.
- Put in the PR description: what the job does, the `--kind` chosen, and the secret reviewers must provision before merging.
- Where the CI runs PR-triggered workflows from the branch itself, point out that this very PR will exercise the new job.

### Step 7 — Battle-test the setup (on approval)

Prove the job's command works before the CI ever runs it — by running it once, locally, on a real change. `start` creates a run and executes nothing, so any PR is safe.

- ❓ Ask the user for a real PR to validate with and for approval to create a real run.
- Reproduce the job's diff locally: check out the PR branch and diff against the target branch.
- Create the run exactly as the job does — same `--kind`, same filter — with a title that marks it as a battle-test.
- Report the run created — id, kind, and the tests it scoped — and ask the user to review it in Testomat.io: does the scope match what that diff should affect?
- Zero tests matched → report it as a finding, then pick a PR that touches mapped source files together with the user.

### Step 8 — Summarize and hand off

Report: the CI targeted and files written; the `--kind` chosen; title scheme and rungroup; how a later launch finds the run (`RUN_ID` carrier or shared title); the battle-test outcome; secrets still to provision. Recommend committing the coverage map alongside the CI config. Automated tests to launch on preview or merge → continue with `run-affected-tests-in-ci`.

## Examples

**Example 1 — manual + automated project**
`scan-automation-project` finds `.test.md` cases and an e2e suite → wire the PR-open job with `--kind mixed`; persist `RUN_ID` for the launch phases; point the user to `run-affected-tests-in-ci` for preview/merge execution.

**Example 2 — manual-only project**
Manual cases, no e2e framework → wire the job with `--kind manual`; the run is complete at creation — testers work through it, nothing to launch later, no run id to persist.

**Example 3 — no coverage map yet**
No `coverage*.yml` found → explain nothing can be scoped without a map; delegate to `qa-test-code-coverage`; wire CI only after the map exists.

## References

- [references/REPORTER_CONTRACT.md](references/REPORTER_CONTRACT.md) — the coverage filter, diff base, `start` command, `--kind` rule, run-id carriers, secrets naming.

## Related skills

`qa-test-code-coverage` (creates the coverage map this skill consumes), `scan-automation-project` (mandatory discovery), `run-affected-tests-in-ci` (launches the run's automated part on preview/merge), `qa-e2e-tests-reporting` (install the reporter if the project has no Testomat.io integration yet), `sync-test-cases-with-tms` (manual cases not yet in Testomat.io).
