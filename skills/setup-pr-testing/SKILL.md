---
name: setup-pr-testing
description: Wire a project's CI so pull requests drive coverage-based selective testing with Testomat.io — on PR open create a pending manual run and a scheduled automated run scoped to the diff (via the coverage map from `qa-test-code-coverage`), then launch the automated tests after a preview deploy or on merge through a Testomat.io CI profile (`reporter run --remote`), inline in the pipeline, or by dispatching another repo. Use this skill when the user wants to integrate a coverage map into CI, set up PR-triggered testing, run only affected tests per PR or on merge, launch e2e via Testomat.io CI profiles, or wire preview-deploy test runs. CI-agnostic — adapts to whatever CI the project uses (GitHub Actions, GitLab CI, Azure Pipelines, Jenkins, Bitbucket, CircleCI, etc.).
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# Setup PR Testing

I wire a project's CI so each pull request drives coverage-based selective testing with Testomat.io. Runs are created the moment a PR opens — a pending manual run for testers and a scheduled automated run — and executed later, after a preview deploy or on merge.

> **GOAL: a working pipeline committed to the project's own CI system.** That CI configuration is the one and only finished result. **I run locally to author it — I am never part of CI.** Do not create runs or execute `@testomatio/reporter` to "see it work". The single network call allowed while authoring is the read-only project info API (Step 2). Every other command below is something the pipeline executes later.

```
PR opened   ──▶ create runs scoped to the PR diff — nothing executes
                  manual    → reporter start --kind manual --filter coverage:…  (pending, testers begin)
                  automated → reporter start --filter coverage:… --format id    (scheduled; RUN_ID persisted)

PR updated  ──▶ nothing is recreated — the scope refreshes at execution time

preview up  ──▶ only if each commit deploys to a preview environment:
                  after the deploy-finished signal, launch the scheduled run
                  against the preview (remote profile · inline · another repo)

PR merged   ──▶ launch the prepared run with the final diff
                  TESTOMATIO_RUN=$RUN_ID reporter run --remote <profile> --filter coverage:…
```

## The coverage map drives everything

A coverage map maps source files/globs to test identifiers; the reporter filters it by the PR diff so only impacted tests are prepared and run. It is produced by the `qa-test-code-coverage` skill — default `coverage.tests.yml`, one file serving both manual and automated tests. Missing map → delegate to `qa-test-code-coverage`; never hand-write one here. Without a map nothing can be filtered and no pipeline can be wired.

## Method, not snippets

The valuable knowledge here is the phase model, the reporter command contract ([references/REPORTER_CONTRACT.md](references/REPORTER_CONTRACT.md)), and the decisions to confirm with the user. Translating a trigger into a specific CI's YAML/Groovy is not — you already know how every CI expresses "on PR open", "after deploy finished", "on merge", "carry a value between pipelines", and "don't fail the pipeline". Write that config yourself for the CI in front of you; never bake per-CI workflow files or CLI calls into this skill.

## When to use

- "Integrate the coverage map into our CI."
- "Create test runs for every pull request."
- "Run only the affected tests on preview / after merge."
- "Launch affected e2e through a Testomat.io CI profile" / "use `--remote`".
- "Testers should get a manual run per PR."

---

## Critical Constraints

- **The deliverable is committed CI config — never execute the reporter while authoring.** Only the read-only project info API call is allowed.
- **Discovery first.** Delegate to `scan-automation-project` before writing anything.
- **Never assume or hardcode the CI system.** Read the repo; if unclear, ask.
- **No coverage map → no pipeline.** Delegate map creation to `qa-test-code-coverage`; filtering is never skipped.
- **PR open creates runs, it executes nothing.** Manual runs are complete at creation; automated runs stay scheduled.
- **Preview launches gate on a deploy-finished signal** — never on the push itself.
- **Execution jobs never block a PR and never fail a merge/release pipeline.** They are observation, not gates.
- **PR comments come from the reporter's own pipes** (GitHub / GitLab / Bitbucket) — never script a PR-comment API call.
- **Every run gets a PR-based title and a rungroup** — `TESTOMATIO_TITLE` from the PR, `TESTOMATIO_RUNGROUP_TITLE` per the user's grouping strategy.
- **Only touch CI config files.** Never source or test files.

---

## Workflow

### Step 1 — Discover

- Delegate to `scan-automation-project`: which e2e framework exists (unit/integration don't count), are there manual `.test.md` cases, do automated tests live in this repo or elsewhere.
- Read the repo's CI config files to identify the CI system. Several CIs or none → ask which one runs PRs.
- Locate the coverage map (default `coverage.tests.yml`). Missing → propose creating it and delegate to `qa-test-code-coverage`.

### Step 2 — Pull the project info from Testomat.io

The read-only info API describes the project — its CI profiles, environments, and slug:

```bash
curl -s -H "Authorization: Bearer $TESTOMATIO" \
  "https://app.testomat.io/api/v2/<project-id>/info"
```

- Requires the project API key available locally (env var or `.env`); on a self-hosted instance replace the host with the instance URL.
- Capture from `data`:
  - `project_id` — the project slug, used to name the CI secret (Step 6);
  - `ci_profiles` — each entry's `profile_name`, `service`, and whether it passes the key/run id (`pass_testomatio_key`, `pass_run_id`) — drives Step 3;
  - `environments` — candidates for `TESTOMATIO_ENV`.
- ❓ No key at hand or the call fails → ask the user for the project slug and CI profile name instead.

### Step 3 — Choose how automated tests execute

Three execution modes exist. If a `ci_profiles` entry matches the e2e suite, `--remote` is the simplest start — recommend it. **If unsure, present all three to the user:**

| Mode                              | When it fits                                                                                     | Launch command shape                                             |
| --------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| Remote — Testomat.io CI profile   | a profile matching the e2e suite exists (Settings → CI); Testomat.io owns runner, env, secrets    | `reporter run --remote <profile-name>`                           |
| Inline — this pipeline            | mobile/simulators, services this pipeline spins up, or an e2e job that already works in this repo | `reporter run "<runner command>" --filter "coverage:…"`          |
| Cross-repo dispatch               | the e2e suite lives in another repo and no CI profile covers it                                   | CI-native cross-pipeline trigger, passing `TESTOMATIO_RUN` along |

- Match profiles to the e2e suite by `profile_name` and `service` against the framework found in Step 1.
- ❓ Several plausible profiles, or none clearly e2e → ask the user which profile to use.
- No profile but the user wants remote → creating one in Testomat.io (Settings → CI) is a prerequisite; wire the launch step ready to enable.
- No e2e suite anywhere → wire only the manual phase; never fabricate an e2e job.

### Step 4 — Ask the unknowns

Read the CI files first so you don't ask what's already answered:

1. **Preview environments** — is every commit deployed to a preview server? If yes: what is the observable deploy-finished signal, and where does the preview URL surface?
2. **Post-merge timing** — launch right on merge, or wait for a staging/production deploy to finish? A deploy gate needs its own observable signal.
3. **Rungroup strategy** — week / day / release / milestone.
4. **Diff base** — the PR's target branch is the natural default for PR jobs; post-merge jobs need a different base (see the contract).

### Step 5 — Wire the phases into CI

Write the jobs in the CI's own syntax. The skill-specific parts are the reporter commands and env vars ([references/REPORTER_CONTRACT.md](references/REPORTER_CONTRACT.md)); triggers and value-passing are ordinary CI config.

**(a) PR opened → create the runs.**

Required env on both calls: `TESTOMATIO` (from the secret, Step 6), `TESTOMATIO_TITLE` (PR-based, e.g. `PR <number>: <title>`), `TESTOMATIO_RUNGROUP_TITLE`.

Manual run — created pending, complete at creation; testers pick it up while the PR is open:

```bash
npx @testomatio/reporter start --kind manual \
  --filter "coverage:file=<coverage-map>,diff=<target-branch>"
```

Automated run — scheduled, not executed; `--format id` keeps stdout to just the run id:

```bash
RUN_ID=$(npx @testomatio/reporter start \
  --filter "coverage:file=<coverage-map>,diff=<target-branch>" --format id)
```

- Persist `$RUN_ID` with the CI's native mechanism for passing a value to a later pipeline (artifact, variable, output). Fallback: shared-run title matching (contract §4).
- Run once per PR (on open); pushes to the PR don't recreate runs — the scope refreshes at launch time.
- A diff affecting zero tests creates no run — treat that as success; this job never blocks the PR.

**(b) Preview deployed → launch against the preview** (only when Step 4 confirmed previews).

Triggered by the deploy-finished signal, never by the push. Remote mode passes the preview URL as a profile param; inline mode points the runner's own env at it:

```bash
TESTOMATIO_RUN=$RUN_ID npx @testomatio/reporter run --remote <profile-name> \
  --remote-param <param-name>=<preview-url>
```

The manual run needs no launch — its pending cases are tested against the preview by hand.

**(c) PR merged → launch the prepared run with the final diff.**

```bash
TESTOMATIO_RUN=$RUN_ID npx @testomatio/reporter run --remote <profile-name> \
  --filter "coverage:file=<coverage-map>,diff=<post-merge-base>"
```

- The fresh `--filter` refreshes the scope to the final merged diff; without it the run's stored scope from PR open is reused.
- Post-merge, the target branch is no longer a usable diff base — use the previous mainline tip (contract §2).
- Inline and cross-repo modes: same `TESTOMATIO_RUN` carry, launch shape per contract §6.
- Keep this job non-blocking and off the release's critical path.

### Step 6 — Provision secrets and enable the PR-comment pipe

- Store the project API key in the CI's secret store as `TESTOMATIO_<project_slug>` — slug from Step 2.
- Map that secret to the `TESTOMATIO` env var inside every job that calls the reporter.
- Enable the PR-comment pipe by provisioning its token: GitHub → `GH_PAT` (the workflow's built-in token works), GitLab → `GITLAB_PAT` (`api` scope), Bitbucket → `BITBUCKET_ACCESS_TOKEN` (repository variable).
- CI platform without a reporter pipe (e.g. Azure DevOps) → no PR comment; results are visible in Testomat.io.
- The CI profile for `--remote` is configured in Testomat.io (Settings → CI), not stored as a repo secret.

### Step 7 — Summarize and hand off

Report: the CI targeted and files written; which phases are wired and which were skipped (no previews / no e2e / no CI profile); the chosen execution mode; title scheme and rungroup; how the launch steps find the prepared run (`RUN_ID` carrier or shared title); secrets and prerequisites still to provision; assumptions to confirm. Recommend committing the coverage map alongside the CI config.

---

## Examples

**Example 1 — previews + a configured CI profile**
Info API lists a profile matching the Playwright suite; the user confirms every commit deploys to a preview. → Wire all three phases: runs created on PR open, preview launch gated on the deployment-success event with the preview URL as a `--remote-param`, merge launch with a fresh post-merge filter. Enable the platform's comment pipe.

**Example 2 — e2e lives in another repo, no CI profile**
Unsure how to execute → present all three modes. User picks cross-repo dispatch: the merge job triggers the e2e repo's pipeline via the CI's native mechanism, passing `TESTOMATIO_RUN` so results land in the prepared run. Note the remote-profile option as the simpler future path.

**Example 3 — no coverage map yet**
No `coverage*.yml` found → explain nothing can be filtered without a map; delegate to `qa-test-code-coverage`; wire CI only after the map exists.

**Example 4 — manual-only project**
`scan-automation-project` finds `.test.md` cases and no e2e framework → wire only the PR-open manual run. No preview or merge launch phases; explain the automated phases need an e2e suite first.

---

## References

| Description                                             | File                                                             |
| ------------------------------------------------------- | ---------------------------------------------------------------- |
| Reporter command contract, info API, pipes, `--remote`  | [references/REPORTER_CONTRACT.md](references/REPORTER_CONTRACT.md) |

## Related skills

`qa-test-code-coverage` (creates the coverage map this skill consumes), `scan-automation-project` (mandatory discovery), `qa-e2e-tests-reporting` (install the reporter if the project has no Testomat.io integration yet), `sync-test-cases-with-tms` (manual cases not yet in Testomat.io).
