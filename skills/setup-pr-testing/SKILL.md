---
name: setup-pr-testing
description: Set up change-aware PR regression testing — wire CI so each pull request posts a comment listing how many manual and automated tests its diff affects, and so that after the PR is merged and deployed only those affected tests are actually run, via Testomat.io coverage maps and @testomatio/reporter. Use this skill when the user wants PR-triggered regression, "comment affected test counts on PRs", "run only affected tests after merge/deploy", selective manual runs per PR, post-deploy e2e, a coverage-driven CI pipeline, weekly/grouped regression runs in a rungroup, launching automated regression on Testomat.io CI via `--remote`, or to connect coverage.manual.yml / coverage.e2e.yml to their CI. CI-agnostic — adapts to whatever CI the project already uses (GitHub Actions, GitLab CI, Jenkins, Bitbucket, CircleCI, etc.). Trigger it even if the user only says "make PRs comment affected tests" or "run the right tests after merge".
license: MIT
metadata:
  author: Testomat.io
  version: 2.0.0
---

# SETUP-PR-TESTING SKILL: What I do

I wire a project's CI so a pull request's change drives testing in **three
phases** — a cheap notice while the PR is open, real runs once it is merged, and
execution once it is deployed. Nothing heavy happens until the change is
actually going somewhere.

> **GOAL: produce a working pipeline inside the project's own CI system.** That
> committed CI configuration is the one and only finished result — reaching it
> means the skill is done.
>
> **I run locally to set up that pipeline — I am never part of CI.** This skill
> executes on a developer's machine (or wherever an agent is invoked); it does
> **not** run tests, create runs, post comments, or call `@testomatio/reporter`
> itself. Every command shown here is something I *write into the pipeline* for
> CI to execute later. If you find yourself running a reporter command to "see
> it work", stop — that is not the goal; a correct pipeline in the target CI is.

```
PR opened   ──▶ NOTICE ONLY — comment the affected test counts on the PR
                reporter run --filter-list  (manual map + e2e map) → counts
                posted via the CI's native PR-comment API (GitHub / GitLab / Bitbucket)
                no runs created · never blocks the PR
                  e.g. "0 automated tests, 10 manual tests are affected by this PR"

PR merged   ──▶ Manual regression run (created, pending)
                reporter start --kind manual --filter "coverage:file=coverage.manual.yml,diff=<base>"
                titled by the merge commit · in a rungroup · testers pick it up

            ──▶ Automated regression run (created, NOT executed)
                reporter start --filter "coverage:file=coverage.e2e.yml,diff=<base>"
                TESTOMATIO_SHARED_RUN=1 · TESTOMATIO_TITLE="report for commit <sha>"
                TESTOMATIO_SHARED_RUN_TIMEOUT=<covers the merge→deploy gap>
                → capture RUN_ID

deploy done ──▶ Launch automated execution on Testomat.io CI
                reporter run --remote <ci-profile>
                  (TESTOMATIO_RUN=$RUN_ID  +  same shared-run title + TESTOMATIO_SHARED_RUN=1)
                Testomat.io dispatches the project's CI profile; the affected e2e
                tests run there and report back into the same prepared run.
```

Every phase is **change-aware**: a coverage map (`coverage.*.yml`) maps source
files → test/suite IDs, and `@testomatio/reporter` filters by the PR diff so
only impacted tests are counted, prepared, and run.

The big shift from older setups: **execution moved to after merge+deploy**, the
**PR-open step is now just an informational comment**, and **automated tests are
launched through Testomat.io's `--remote` CI profile** instead of this repo
reaching into another repo's pipeline. If the e2e tests live elsewhere, the CI
profile points there — the reporter never triggers a foreign repo directly.

I do **not** invent tests, write CI from guesswork, or assume a CI system. I
discover the project, confirm the unknowns with the user, reuse existing
coverage maps (or delegate creating them), and express the three phases in
whatever CI the project actually uses.

## What this skill is and isn't

This skill is the **method**, not a catalogue of CI snippets. The valuable,
non-obvious knowledge is:

1. the three-phase model and why each phase is gated where it is (comment =
   harmless, on open; manual run = on merge, no deploy needed; automated run =
   prepared on merge, executed only after deploy, never blocking the release);
2. the `@testomatio/reporter` command contract — `--filter-list` for the notice
   counts, `reporter start` to create runs without executing, the shared-run
   env vars (`TESTOMATIO_SHARED_RUN`, `TESTOMATIO_TITLE`,
   `TESTOMATIO_SHARED_RUN_TIMEOUT`), and `reporter run --remote <profile>` to
   launch a prepared run on Testomat.io CI (see
   [references/REPORTER_CONTRACT.md](references/REPORTER_CONTRACT.md));
3. the decisions — coverage maps required, whether a Testomat.io CI profile
   exists for `--remote`, and what to ask the user (deploy trigger, completion
   signal, rungroup strategy, diff base, shared-run timeout).

Translating a trigger into a specific CI's YAML/Groovy/config is **not** special
knowledge — you already know how GitHub Actions, GitLab CI, Jenkins, or any
other CI express "run on PR open", "run on merge", "run after deploy", "post a
PR comment", and "don't fail the pipeline". Write that yourself for the CI in
front of you. **Do not write explicit per-CI workflow files into this skill or
expect a per-CI recipe file** — give the agent the contract and let it author
the config for whatever CI it finds.

## When to use

- "Comment how many tests a PR affects", "show affected test counts on PRs".
- "Run only the affected tests after a PR is merged and deployed".
- "Create a pending manual regression run per merged PR with just the relevant cases".
- "Launch affected e2e on Testomat.io CI after deploy", "use `--remote` for regression".
- "Hook coverage.manual.yml / coverage.e2e.yml into our CI".

---

## CRITICAL CONSTRAINTS

- **The goal is a working pipeline in the project's CI — nothing else.** Reaching
  that committed CI configuration is the final goal; the task is complete only
  when it exists. This skill runs locally to *author* that config; it is never a
  CI step and never executes the reporter itself. Do not run tests, create runs,
  or call `@testomatio/reporter` to "verify" — your output is committed CI config
  the target system runs later.
- **Discovery first, always.** Never write CI before delegating to `project-scan`
  (frameworks, manual + automated tests, where e2e tests live). Decisions below
  depend on its result.
- **Never assume the CI system, and never hardcode one.** Identify the CI the
  project already uses by reading the repo; if you cannot tell, ask. Then write
  config for *that* CI from your own knowledge of it. Do not bake per-CI
  workflow files into this skill.
- **Regression cannot work without a coverage map.** If the needed
  `coverage.*.yml` is missing, the only correct move is to propose creating it
  via the coverage skills — not to hand-write a mapping or skip filtering. The
  PR-open comment also needs the maps to count affected tests.
- **PR open is a NOTICE ONLY.** On PR open/update, compute affected counts with
  `--filter-list` and post a PR comment. **Never create runs and never block the
  PR** in this phase. Counts only — e.g. `0 automated tests, 10 manual tests are
  affected by this PR`. Must work on GitHub, GitLab, and Bitbucket using each
  one's native PR/MR comment API.
- **Regression runs are created on MERGE, not on PR open.** When the PR merges:
  create the manual run (pending) and create the automated run (prepared, not
  executed). Nothing executes until deploy.
- **Automated run is prepared, then launched separately.** On merge, create it
  with `reporter start` as a **shared run** keyed by the merge commit
  (`TESTOMATIO_SHARED_RUN=1`, `TESTOMATIO_TITLE="report for commit <sha>"`) and
  do **not** execute it. After deploy, launch it with `reporter run --remote
  <profile>`.
- **Set the shared-run timeout to span the merge→deploy gap.** The shared run is
  matched by title only within `TESTOMATIO_SHARED_RUN_TIMEOUT` minutes (default
  20). If deploy takes longer, the execute step won't attach to the prepared run
  and a stray new run appears. Ask how long deploys take and set the timeout
  above it (e.g. `TESTOMATIO_SHARED_RUN_TIMEOUT=120`).
- **Execute automated through `--remote`, never by triggering another repo.**
  `reporter run --remote <profile>` asks Testomat.io to dispatch the project's
  configured CI profile. Do not reach into a foreign repo's pipeline with a PAT
  and `{grep, run, env}` inputs anymore — that responsibility now lives in the
  Testomat.io CI profile (configured under **Settings → CI**).
- **The automated execute step must never fail the deploy/release pipeline.** It
  is observation, not a gate. Isolate it (a non-failing job keyed off the deploy
  signal).
- **Every created run gets a meaningful title.** Set `TESTOMATIO_TITLE` on every
  `start`/`run` call that creates or launches a run. Derive it from the merge
  commit (subject + short SHA), e.g. `report for commit <sha>`. The automated
  prepare and execute steps MUST use the **same** title so they converge on one
  shared run.
- **Every created run lands in a rungroup.** Set `TESTOMATIO_RUNGROUP_TITLE` on
  the manual and automated runs. The grouping strategy (week / day / milestone /
  release / submodule) is the user's choice; ask in Step 4.
- **Only touch CI config and (if asked) coverage files.** Do not modify
  application or test source.

---

## Workflow

### Step 1 — Discover the project (delegate to `project-scan`)

Run **`project-scan`**. From its result capture:

- **Frameworks** — is there an automated **e2e** framework here (Playwright,
  Cypress, CodeceptJS, WebdriverIO, Puppeteer, Appium)? Unit/integration
  frameworks do **not** count as e2e.
- **Manual tests** — are there `*.test.md` cases (here or pullable from Testomat.io)?
- **Automated tests** — present in this repo, or only elsewhere?

This tells you which maps you can build counts from, and which phases apply
(manual-only vs manual + automated).

### Step 2 — Identify the CI system (do not assume)

Read the repo to see which CI it already uses — its CI config files / dotfiles
make this obvious. If nothing is configured, or several CIs are present, **ask
the user which CI runs their PRs**. Once you know the CI, you know how to write
its triggers and how to post a PR/MR comment with it.

### Step 3 — Locate or create the coverage maps

Look for existing coverage files in the repo root: `coverage.manual.yml`,
`coverage.e2e.yml`, or any `coverage*.yml`. Inspect the keys to confirm they map
this repo's source.

For each kind of test the user has:

- **Map exists** → reuse it. Validate it still resolves (the coverage skills
  bundle a checker) before wiring CI to it.
- **Map missing** → both the affected-count comment and the regression run for
  that kind **will not work**. Propose creating it and, on agreement, delegate:
  - manual → **`manual-coverage`** → `coverage.manual.yml`
  - automated/e2e → **`automation-coverage`** → `coverage.e2e.yml`

You need a map for each kind you want to report or run. The PR-open comment can
list only the kinds whose maps exist.

### Step 4 — Ask the unknowns

Read their CI files first so you don't ask what's already there, then confirm:

1. **When does a deploy that should trigger automated execution happen?** Offer
   the common options:
   - on merge to the main/deploy branch (deploy is part of that pipeline),
   - on a release event (GitHub Release published, GitLab release created),
   - on a git tag (e.g. `v*`),
   - on every push to a deploy branch,
   - never automated — deploy is manual, launch e2e on demand.
2. **How does that deploy signal its completion?** This gates the execute step.
   Need a concrete, observable signal — a deploy job/stage completing, a
   `workflow_run`/pipeline-finished event, a deployment event, a status check
   going green, a release/tag created, or a health endpoint returning 200.
3. **How long does merge → deploy-complete usually take?** This sets
   `TESTOMATIO_SHARED_RUN_TIMEOUT` (minutes, default 20) so the execute step
   still matches the prepared shared run. Pick a value comfortably above the
   typical deploy duration.
4. **What rungroup strategy should regression runs use?** Every created run goes
   into a rungroup; the question is what defines a group:
   - **week** — e.g. `Regression W2 May 2026`
     (`W$(( ($(date +%-d) - 1) / 7 + 1 )) $(date +'%B %Y')`),
   - **day** — e.g. `Regression 2026-05-27`,
   - **milestone** — the active sprint/milestone,
   - **release** — the upcoming release/version tag,
   - **submodule** — the project area touched (monorepos).
   Default to one strategy for both the manual and automated runs unless the
   user splits them.
5. **Diff base** for "what changed": for the PR-open comment and the on-merge
   runs, the PR's target branch (`main`/`master`) is the natural base. For a
   post-deploy range see the one-commit-per-deploy caveat in
   [references/REPORTER_CONTRACT.md](references/REPORTER_CONTRACT.md).

**The PR-open comment needs none of the deploy answers (Q1–Q3).** It only needs
the coverage maps and a base branch (Q5). **The manual run needs only the
rungroup answer (Q4)** — it is created pending on merge regardless of deploy.

### Step 5 — Confirm how automated execution is launched (`--remote`)

Automated execution runs through a **Testomat.io CI profile** triggered by
`reporter run --remote <profile>`. Decide and confirm:

- **Is there a CI profile configured on the project?** (Testomat.io → **Settings
  → CI**.) It names the workflow Testomat.io dispatches — in this repo or in a
  dedicated e2e repo. If none exists, that is a prerequisite the user must set up
  (point them at the CI configuration page); `--remote` cannot work without it.
- **The CI profile owns the runner, browsers, environment URLs, and secrets.**
  This is exactly why `--remote` replaces cross-repo dispatch: the source repo
  only needs its coverage map + git history to *prepare* the scoped run; the CI
  profile decides *where and how* the suite actually executes. No PAT, no
  foreign-repo trigger, no `{grep, run, env}` inputs to maintain.
- **Exceptions — run inline in this pipeline instead of `--remote`:**
  - **Mobile (Appium, Detox, native simulators)** — bound to specific OS images
    and signing material on the test job; keep it in this pipeline.
  - **API / contract tests** that exercise a server this repo can spin up — run
    against `localhost`; not gated on a remote deploy or a CI profile.
  - **An existing same-repo e2e job that already works** — don't fight it; you
    can still prepare the run here and let that job execute it.
  For these, after deploy run the reporter wrapping the runner directly
  (`reporter run "<runner cmd>" --filter "coverage:file=coverage.e2e.yml,diff=<base>"`) on the
  prepared run instead of `--remote`.
- **No e2e suite anywhere (only unit/integration here).** Do not stand up an e2e
  job. Set up the comment (manual only) and the manual run; tell the user the
  automated phase needs an e2e suite first (point at `automation-coverage` / test
  authoring).

### Step 6 — Wire the three phases into the project's CI

Express each applicable phase in the CI from Step 2, in that CI's own syntax —
you know it. The skill-specific parts are the reporter commands, the env vars,
and the structural rules; the trigger/secret/job scaffolding and the PR-comment
call are ordinary CI config you write for whatever system it is.

**(a) PR opened → affected-counts comment (notice only).**

- Trigger: PR/MR opened (add reopened/synchronize if the user wants the comment
  to refresh on new commits).
- For each coverage map that exists, compute the affected count with a
  `--filter-list` dry run — it lists matching IDs without running anything:
  ```
  npx @testomatio/reporter run \
    --filter-list "coverage:file=coverage.manual.yml,diff=<base>" --format ids
  npx @testomatio/reporter run \
    --filter-list "coverage:file=coverage.e2e.yml,diff=<base>" --format ids
  ```
  Count the IDs (empty output = `0`). Assemble a one-line comment, e.g.
  `0 automated tests, 10 manual tests are affected by this PR`.
- Post it with the CI's native PR/MR comment mechanism (GitHub PR comment,
  GitLab MR note, Bitbucket PR comment). Prefer updating a single existing
  comment over adding a new one on every push.
- This phase **creates no runs** and must **never fail the PR check**.

**(b) PR merged → create the regression runs.**

- Trigger: PR merged into the main/deploy branch.
- Required env on these calls: `TESTOMATIO` (API key), `TESTOMATIO_TITLE`,
  `TESTOMATIO_RUNGROUP_TITLE`. Title derives from the merge commit
  (e.g. `report for commit <short-sha>`); rungroup from Step 4.

  **Manual run** — created pending, testers pick it up; nothing executes:
  ```
  npx @testomatio/reporter start --kind manual \
    --filter "coverage:file=coverage.manual.yml,diff=<base>"
  ```

  **Automated run** — prepared as a shared run, **not executed**:
  ```
  TESTOMATIO_SHARED_RUN=1 \
  TESTOMATIO_TITLE="report for commit <short-sha>" \
  TESTOMATIO_SHARED_RUN_TIMEOUT=<minutes covering deploy> \
  npx @testomatio/reporter start \
    --filter "coverage:file=coverage.e2e.yml,diff=<base>"
  ```
  Capture the printed run id as `RUN_ID` and carry it to the execute step
  (pipeline output/artifact). The shared title + timeout let the execute step
  (and any parallel executors) converge on this same prepared run.

**(c) Deploy done → launch automated execution via `--remote`.**

- Trigger: the deploy-completion signal from Step 4 — never "PR opened".
- Launch the prepared run on the Testomat.io CI profile, reusing the same title
  and shared-run flag, and pointing at the prepared run:
  ```
  TESTOMATIO_RUN=$RUN_ID \
  TESTOMATIO_SHARED_RUN=1 \
  TESTOMATIO_TITLE="report for commit <short-sha>" \
  npx @testomatio/reporter run --remote <ci-profile>
  ```
  `TESTOMATIO_RUN=$RUN_ID` ties the launch to the run prepared in (b); with no
  fresh `--filter`, Testomat.io greps that run's own stored scope, so only the
  affected e2e tests run. Testomat.io dispatches the CI profile; the suite runs
  there and reports back into the same run.
- If the deploy pipeline is fully decoupled and cannot carry `RUN_ID`, the
  execute step matches the prepared run by its shared-run **title** instead —
  which is why the title must be identical and the shared-run timeout must still
  be open. Keep `TESTOMATIO_SHARED_RUN=1` and the same `TESTOMATIO_TITLE`.
- **Isolation:** keep this off the release's critical path — a separate
  job/pipeline keyed off the deploy signal, set non-failing for the release
  (`continue-on-error`, `allow_failure: true`, etc.). It reports to Testomat.io;
  it must not gate the deploy.
- **Inline exception (Step 5):** when not using a CI profile, replace the
  `--remote` call with the runner wrapped directly, on the prepared run:
  ```
  TESTOMATIO_RUN=$RUN_ID npx @testomatio/reporter run "<runner cmd>" \
    --filter "coverage:file=coverage.e2e.yml,diff=<base>"
  ```

State the secrets the user must provision — the `TESTOMATIO` API key on the jobs
that talk to Testomat.io, and a token allowed to post PR/MR comments for phase
(a) (the CI's built-in token usually suffices for same-repo comments). A CI
profile for `--remote` is configured in Testomat.io, not via a repo secret.

### Step 7 — Summarize and hand off

Report concisely:

- CI system targeted; files written in this repo.
- Which phases are wired (comment / manual run / automated prepare / automated
  execute) and which were skipped and why (missing coverage map / no e2e suite /
  no CI profile).
- The comment format and where its counts come from (which maps, which base).
- Title scheme (merge commit) and that the automated prepare + execute steps
  share one title; rungroup strategy and where it is computed.
- Shared-run timeout chosen and the deploy duration it must cover.
- How automated execution is launched: the `--remote <profile>` CI profile (or
  the inline-runner exception), and that `RUN_ID` (or the shared title) links
  the prepare and execute steps.
- Secrets/tokens to add before it works; that a Testomat.io CI profile must
  exist for `--remote`.
- Any assumption needing confirmation (deploy signal, diff base, timeout,
  rungroup recipe).
- Recommend committing the coverage map(s) so CI and the team share one mapping.

---

## Examples

**Example 1 — comment on open, regression after merge+deploy, e2e via CI profile**
Input: "Comment how many tests each PR touches, then after we merge and deploy,
run the affected e2e and create a manual run."
Output: ask the rungroup (weekly), deploy signal, and deploy duration. On PR
open, a non-blocking job posts `N automated, M manual tests affected` computed
with `--filter-list`. On merge: a pending manual run (`report for commit <sha>`
in `Regression W<n> <Month> <Year>`) and a prepared automated shared run with the
same title and `TESTOMATIO_SHARED_RUN_TIMEOUT` above the deploy time; `RUN_ID`
captured. On deploy-complete: a non-failing job runs `reporter run --remote
<profile>` with that `RUN_ID` + shared title, launching the affected e2e on
Testomat.io CI. All written in the project's own CI.

**Example 2 — no coverage files yet**
Input: "Set up selective regression on our pull requests."
Output: find no `coverage.*.yml`; explain the comment and the regression runs
can't work without them; delegate to `manual-coverage` / `automation-coverage`;
only then wire the CI.

**Example 3 — only unit tests in repo**
Input: "Run affected e2e on PRs."
Output: project-scan finds no e2e framework anywhere; set up the PR-open comment
(manual count only) and the on-merge manual run if manual cases exist; explain
the automated phase needs an e2e suite first; do not fabricate an e2e job.

**Example 4 — no CI profile configured**
Input: "Use `--remote` to run our e2e after deploy."
Output: confirm there is no Testomat.io CI profile yet; explain `--remote`
dispatches a configured profile and cannot work without one; point the user at
Testomat.io **Settings → CI** to add the profile that runs the e2e suite; wire
the prepare step now and the `--remote` execute step once the profile exists.
Until then, offer the inline-runner exception (Step 5) if the e2e suite can run
in this pipeline.

---

## References

| Description                            | File                            |
| -------------------------------------- | ------------------------------- |
| Reporter command contract & `--remote` | references/REPORTER_CONTRACT.md |

## Related skills

`project-scan` (mandatory first), `manual-coverage` and `automation-coverage`
(create the maps this skill consumes), `reporter-setup` (install the reporter if
the project has no Testomat.io integration yet).
