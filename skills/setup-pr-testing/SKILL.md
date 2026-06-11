---
name: setup-pr-testing
description: Set up change-aware PR regression testing — wire CI so each pull request posts a comment listing how many manual and automated tests its diff affects, and so that after the PR is merged and deployed only those affected tests are actually run, via Testomat.io coverage maps and @testomatio/reporter. Use this skill when the user wants PR-triggered regression, "comment affected test counts on PRs", "run only affected tests after merge/deploy", selective manual runs per PR, post-deploy e2e, a coverage-driven CI pipeline, weekly/grouped regression runs in a rungroup, launching automated regression on Testomat.io CI via `--remote`, or to connect coverage*.yml maps to their CI. CI-agnostic — adapts to whatever CI the project already uses (GitHub Actions, GitLab CI, Jenkins, Bitbucket, CircleCI, etc.). Trigger it even if the user only says "make PRs comment affected tests" or "run the right tests after merge".
license: MIT
metadata:
  author: Testomat.io
  version: 3.0.0
---

# SETUP-PR-TESTING SKILL: What I do

I wire a project's CI so a pull request's change drives testing in **three
phases** — a cheap notice while the PR is open, runs created once it is merged,
execution once it is deployed. Nothing heavy happens until the change is
actually going somewhere.

> **GOAL: a working pipeline inside the project's own CI system.** That
> committed CI configuration is the one and only finished result.
> **I run locally to author it — I am never part of CI.** Do not run tests,
> create runs, or call `@testomatio/reporter` to "see it work"; every command
> below is something the pipeline executes later.

```
PR opened   ──▶ NOTICE ONLY — comment the affected test counts on the PR
                reporter run --filter-list per coverage map → counts
                posted via the CI's native PR-comment API
                no runs created · never blocks the PR

PR merged   ──▶ One regression run per coverage map (created, NOT executed)
                  coverage.<slug>.manual.yml → reporter start --kind manual
                  coverage.<slug>.yml        → reporter start --kind mixed   (shared run)
                  coverage.<slug>.e2e.yml    → reporter start                (shared run)
                titled by the merge commit · in a rungroup
                manual cases sit pending for testers · automated tests wait for deploy

deploy done ──▶ Launch automated execution on Testomat.io CI
                reporter run --remote <ci-profile>     (runs containing automated tests)
                  TESTOMATIO_RUN=$RUN_ID · TESTOMATIO_SHARED_RUN=1 · same shared title
```

## Coverage maps drive everything

A coverage map maps source files → test identifiers; the reporter filters it by
the PR diff so only impacted tests are counted, prepared, and run. **One map
per Testomat.io project, named by content** — created by the `qa-test-coverage-map`
skill, never hand-written here:

| Map                          | Contains           | On merge                                                    | After deploy                          |
| ---------------------------- | ------------------ | ----------------------------------------------------------- | ------------------------------------- |
| `coverage.<slug>.manual.yml` | manual only        | `start --kind manual` — run is complete, testers pick it up | nothing                               |
| `coverage.<slug>.yml`        | manual + automated | `start --kind mixed`, prepared as a shared run              | launch automated tests via `--remote` |
| `coverage.<slug>.e2e.yml`    | automated only     | `start` (no `--kind`), prepared as a shared run             | launch via `--remote`                 |

The suffix is the whole contract: it tells CI which `--kind` to pass and
whether a deploy-time execute phase exists. Legacy `coverage.manual.yml` /
`coverage.e2e.yml` (no slug) mean manual-only / automated-only. A repo serving
several Testomat.io projects has several maps — repeat the per-map commands
for each.

## Method, not snippets

The valuable knowledge here is the three-phase model, the reporter command
contract ([references/REPORTER_CONTRACT.md](references/REPORTER_CONTRACT.md)),
and the decisions to confirm with the user. Translating a trigger into a
specific CI's YAML/Groovy is not — you already know how every CI expresses "on
PR open", "on merge", "after deploy", "post a PR comment", and "don't fail the
pipeline". Write that config yourself for the CI in front of you; never bake
per-CI workflow files into this skill.

## When to use

- "Comment how many tests a PR affects."
- "Run only the affected tests after a PR is merged and deployed."
- "Create a pending manual regression run per merged PR."
- "Launch affected e2e on Testomat.io CI after deploy" / "use `--remote`".
- "Hook our coverage*.yml into CI."

---

## CRITICAL CONSTRAINTS

- **The deliverable is committed CI config — never execute the reporter
  yourself.**
- **Discovery first.** Delegate to `scan-automation-project` before writing anything.
- **Never assume or hardcode the CI system.** Read the repo; if unclear, ask.
- **No coverage map → no regression.** Missing maps are created via the
  `qa-test-coverage-map` skill, never hand-written; filtering is never skipped.
- **PR open is a notice only.** Counts in a comment; no runs; never blocks the
  PR.
- **Runs are created on merge, executed after deploy.** Manual-only runs are
  complete at creation; runs containing automated tests are prepared as shared
  runs (`TESTOMATIO_SHARED_RUN=1`, title from the merge commit,
  `TESTOMATIO_SHARED_RUN_TIMEOUT` above the merge→deploy gap — the 20-minute
  default is usually too short).
- **Automated execution goes through `reporter run --remote <profile>`** — a
  Testomat.io CI profile (Settings → CI), never by reaching into another
  repo's pipeline. The prepare and execute steps MUST share the same
  `TESTOMATIO_TITLE` so they converge on one run.
- **The execute step never fails the deploy/release pipeline.** It is
  observation, not a gate — isolate it as a non-failing job.
- **Every run gets a meaningful title and a rungroup.** `TESTOMATIO_TITLE`
  from the merge commit; `TESTOMATIO_RUNGROUP_TITLE` per the user's grouping
  strategy.
- **Only touch CI config** (and coverage maps if delegated). Never source or
  test files.

---

## Workflow

### Step 1 — Discover (delegate to `scan-automation-project`)

Capture: is there an e2e framework (unit/integration don't count), are there
manual `.test.md` cases, do automated tests live here or elsewhere. This tells
you which maps to expect and which phases apply.

### Step 2 — Identify the CI

Read the repo's CI config files. Several CIs or none → ask which one runs PRs.

### Step 3 — Locate the coverage maps

Look for `coverage*.yml` in the repo root. The filename tells you what each
map contains (table above). Validate that a map still resolves before wiring
CI to it (the `qa-test-coverage-map` skill bundles a checker). If the map for a test
kind the user wants is missing → propose creating it and delegate to
**`qa-test-coverage-map`**; the phases for that kind cannot be wired without it.

### Step 4 — Ask the unknowns

Read the CI files first so you don't ask what's already answered:

1. **What triggers a deploy** that should launch automated execution — merge
   to main, release event, tag, push to a deploy branch, or manual?
2. **How does the deploy signal completion?** A concrete observable event —
   a job finishing, a pipeline event, a status check, a health endpoint.
3. **How long is merge → deploy-complete?** Sets
   `TESTOMATIO_SHARED_RUN_TIMEOUT` comfortably above it.
4. **Rungroup strategy** — week / day / milestone / release / submodule.
5. **Diff base** — the PR's target branch is the natural base; for post-deploy
   ranges see the caveat in REPORTER_CONTRACT.md.

The PR comment needs only the maps and the base (Q5). Manual-only runs need
only the rungroup (Q4). Q1–Q3 matter only when a map contains automated tests.

### Step 5 — Confirm how automated execution launches

`reporter run --remote <profile>` dispatches a **Testomat.io CI profile**
(Settings → CI) that owns the runner, browsers, environment URLs, and secrets —
whether the e2e suite lives in this repo or a dedicated one. No profile yet →
that is a prerequisite for the user; wire the execute step so it can be enabled
once the profile exists.

**Run inline instead of `--remote`** when the suite must run in this pipeline:
mobile (simulators, signing), API tests against a server this repo spins up, or
an existing same-repo e2e job that already works. The execute step then wraps
the runner directly on the prepared run.

**No e2e suite anywhere** → wire only the comment and manual phases; explain
the automated phase needs a suite first. Never fabricate an e2e job.

### Step 6 — Wire the phases into the CI

Write the jobs in the CI's own syntax. The skill-specific parts are the
reporter commands and env vars; triggers, secrets, and the PR-comment call are
ordinary CI config.

**(a) PR opened → counts comment (notice only).**

For each map, a `--filter-list` dry run lists the matching IDs without running
or creating anything:

```bash
npx @testomatio/reporter run \
  --filter-list "coverage:file=<map>,diff=<base>" --format ids
```

Count the IDs (empty output = 0) and post one comment via the CI's native
PR/MR comment API, e.g. `0 automated tests, 10 manual tests are affected by
this PR`. Per-kind numbers come from `.manual`/`.e2e` maps; a mixed map yields
one combined count (`12 tests (manual + automated)`). Update one existing
comment rather than re-posting. Never fail the PR check.

**(b) PR merged → create one run per map.**

Required env on every call: `TESTOMATIO`, `TESTOMATIO_TITLE` (merge commit,
e.g. `report for commit <short-sha>`), `TESTOMATIO_RUNGROUP_TITLE`.

Manual-only map — created pending, done:

```bash
npx @testomatio/reporter start --kind manual \
  --filter "coverage:file=coverage.<slug>.manual.yml,diff=<base>"
```

Map containing automated tests — prepared as a shared run, **not executed**.
Mixed maps add `--kind mixed`; e2e-only maps take no `--kind`:

```bash
RUN_ID=$(TESTOMATIO_SHARED_RUN=1 \
TESTOMATIO_TITLE="report for commit <short-sha>" \
TESTOMATIO_SHARED_RUN_TIMEOUT=<minutes covering deploy> \
npx @testomatio/reporter start --kind mixed \
  --filter "coverage:file=coverage.<slug>.yml,diff=<base>" --format id)
```

`--format id` prints only the run id, so `RUN_ID` captures it cleanly — carry
it to the execute step (pipeline output/artifact). In a mixed run the manual
cases are immediately pending for testers; the automated part waits for
deploy.

**(c) Deploy done → launch automated execution.**

For each run prepared in (b), triggered by the deploy-completion signal —
never by PR open:

```bash
TESTOMATIO_RUN=$RUN_ID \
TESTOMATIO_SHARED_RUN=1 \
TESTOMATIO_TITLE="report for commit <short-sha>" \
npx @testomatio/reporter run --remote <ci-profile>
```

With no fresh `--filter`, Testomat.io reuses the run's stored scope — only the
affected automated tests run on the CI profile and report back into the same
run. If the deploy pipeline can't carry `RUN_ID`, the identical shared title
(within the timeout) matches the prepared run instead. Keep this job
non-failing and off the release's critical path.

Inline exception (Step 5) — wrap the runner instead of `--remote`:

```bash
TESTOMATIO_RUN=$RUN_ID npx @testomatio/reporter run "<runner cmd>" \
  --filter "coverage:file=<map>,diff=<base>"
```

State the secrets to provision: `TESTOMATIO` on jobs that talk to Testomat.io,
and a token able to post PR/MR comments (the CI's built-in token usually
suffices). The CI profile for `--remote` is configured in Testomat.io, not as
a repo secret.

### Step 7 — Summarize and hand off

Report: the CI targeted and files written; which phases are wired per map and
which were skipped (missing map / no e2e suite / no CI profile); the comment
format and its maps; title scheme and rungroup; the shared-run timeout and the
deploy duration it covers; how the execute step finds the prepared run
(`RUN_ID` or shared title); secrets and prerequisites still needed; assumptions
to confirm. Recommend committing the coverage maps.

---

## Examples

**Example 1 — one project, manual + automated (`coverage.shop.yml`)**
"Comment how many tests each PR touches, then after merge+deploy run the
affected e2e and give testers their cases." → Ask rungroup, deploy signal,
deploy duration. PR open: a non-blocking job posts the combined affected
count. On merge: one `start --kind mixed` shared run titled
`report for commit <sha>` — manual cases pending immediately, `RUN_ID`
captured. On deploy-complete: a non-failing job runs
`reporter run --remote <profile>` with that `RUN_ID`, executing the affected
automated tests into the same run.

**Example 2 — no coverage maps yet**
"Set up selective regression on our PRs." → Find no `coverage*.yml`; explain
nothing can be counted or filtered without a map; delegate to `qa-test-coverage-map`;
only then wire CI.

**Example 3 — manual-only project**
scan-automation-project finds `.test.md` cases and no e2e framework → wire the PR comment
(manual count) and the on-merge `start --kind manual` run from
`coverage.<slug>.manual.yml`. No deploy phase at all; explain the automated
phase needs an e2e suite first. Never fabricate an e2e job.

**Example 4 — no CI profile for `--remote`**
Confirm none exists; explain `--remote` dispatches a configured profile
(Testomat.io → Settings → CI) and cannot work without one. Wire phases (a) and
(b) now and the (c) execute step ready to enable once the profile exists;
offer the inline-runner exception meanwhile.

---

## References

| Description                            | File                            |
| -------------------------------------- | ------------------------------- |
| Reporter command contract & `--remote` | references/REPORTER_CONTRACT.md |

## Related skills

`scan-automation-project` (mandatory first), `qa-test-coverage-map` (creates the maps this skill
consumes), `qa-e2e-tests-reporting` (install the reporter if the project has no
Testomat.io integration yet).
