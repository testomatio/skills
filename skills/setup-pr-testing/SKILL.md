---
name: setup-pr-testing
description: Set up change-aware PR regression testing — wire CI so every pull request runs only the manual and automated/e2e tests affected by the diff, via Testomat.io coverage maps and @testomatio/reporter. Use this skill when the user wants PR-triggered regression, "run only affected tests on PRs", selective manual runs per PR, post-deploy e2e on PRs, a coverage-driven CI pipeline, weekly/grouped PR regression runs in a rungroup, creating a Testomat.io run in CI and dispatching e2e tests to another repo, deploy-on-tag / on-release / on-merge regression, or to connect coverage.manual.yml / coverage.e2e.yml to their CI. CI-agnostic — adapts to whatever CI the project already uses (GitHub Actions, GitLab CI, Jenkins, Bitbucket, CircleCI, etc.). Trigger it even if the user only says "make PRs run the right tests" or "set up regression for pull requests".
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# SETUP-PR-TESTING SKILL: What I do

I wire a project's CI so each **pull request** (or deploy thereof) runs only the
tests affected by its change — not the whole suite. There are exactly two flows,
and they are independent:

```
PR open      ──▶ Regression Manual Tests      coverage.manual.yml ──▶ reporter run --kind manual
                                              + TESTOMATIO_TITLE + TESTOMATIO_RUNGROUP_TITLE

deploy done  ──▶ Regression Automated Tests   coverage.e2e.yml
   ├─ same repo:   ──▶ reporter run "<runner>"   + TITLE + RUNGROUP
   └─ cross repo:  ──▶ reporter run --filter-list … --format=grep    (compute selection)
                   ──▶ reporter start                                 (pre-create empty run, capture ID)
                   ──▶ dispatch e2e repo with {grep, run=<id>, env}   (tests there export TESTOMATIO_RUN)
```

Both flows are **change-aware**: a coverage map (`coverage.*.yml`) maps source
files → test/suite IDs, and `@testomatio/reporter` filters by the PR diff so
only impacted tests are selected.

Every run — manual or automated — lands in Testomat.io with a meaningful
**title** and inside a **rungroup**. The grouping strategy (week / day /
milestone / submodule / release) is the user's call; we ask, we do not invent.

For cross-repo e2e, the run is **pre-created in the source repo** (where the
diff and coverage map live) and the resulting run ID is passed into the e2e
repo so its test results attach to the same run instead of opening a new one.

I do **not** invent tests, write CI from guesswork, or assume a CI system. I
discover the project, confirm the unknowns with the user, reuse existing
coverage maps (or delegate creating them), and express the two flows in
whatever CI the project actually uses.

## What this skill is and isn't

This skill is the **method**, not a catalogue of CI snippets. The valuable,
non-obvious knowledge is:

1. the two-flow model and how they differ (manual = no deploy dependency;
   automated = after deploy, never blocks the release);
2. the `@testomatio/reporter` command contract — title/rungroup env vars, the
   `reporter start` "empty run" pattern, and the cross-repo `--filter-list
   --format=grep` → `start` → dispatch flow (see
   [references/REPORTER_CONTRACT.md](references/REPORTER_CONTRACT.md));
3. the decisions — coverage maps required, where e2e runs, what to ask the user
   (deploy trigger, completion signal, rungroup strategy, diff base).

Translating a trigger into a specific CI's YAML/Groovy/config is **not** special
knowledge — you already know how GitHub Actions, GitLab CI, Jenkins, or any
other CI express "run on PR open", "run after job X", and "don't fail the
pipeline". Write that yourself for the CI in front of you. Do not expect, or
add, a per-CI recipe file.

## When to use

- "Run only the tests affected by a PR", "selective regression on pull requests".
- "Create a pending manual run for each PR with just the relevant cases".
- "Run e2e tests after a PR is deployed, but only the affected ones".
- "Hook coverage.manual.yml / coverage.e2e.yml into our CI".

---

## CRITICAL CONSTRAINTS

- **Discovery first, always.** Never write CI before delegating to `project-scan`
  (frameworks, manual + automated tests, where e2e tests live). Decisions below
  depend on its result.
- **Never assume the CI system, and never hardcode one.** Identify the CI the
  project already uses by reading the repo; if you cannot tell, ask. Then write
  config for *that* CI from your own knowledge of it.
- **Regression cannot work without a coverage map.** If the needed
  `coverage.*.yml` is missing, the only correct move is to propose creating it
  via the coverage skills — not to hand-write a mapping or skip filtering.
- **Confirm the end system's PR flow with the user.** We do not know how their
  PRs deploy or how a deploy completion is observable. Ask — do not guess.
- **The automated-regression job must never fail the deploy/release pipeline.**
  It is observation, not a gate. Isolate it.
- **Every run gets a meaningful title.** Set `TESTOMATIO_TITLE` on every reporter
  call — manual and automated, same-repo and cross-repo. Derive it from the
  scope in hand: PR title + PR number for PR-triggered flows; commit subject +
  short SHA for commit-triggered flows; tag name for tag/release-triggered
  flows. Never leave the run untitled.
- **Every run lands in a rungroup.** Set `TESTOMATIO_RUNGROUP_TITLE` on every
  reporter call. The grouping strategy — week, day, milestone, submodule,
  release — is the user's choice; ask in Step 4. Reuse the same strategy for
  the manual and automated flows unless the user explicitly splits them.
- **Cross-repo e2e MUST pre-create the run here.** When the e2e suite lives in
  another repo, create the run in *this* repo with `reporter start` (carrying
  title + rungroup), capture the run ID, and pass it to the e2e repo as
  `TESTOMATIO_RUN`. The e2e repo must not create its own run — the title and
  rungroup belong with the diff, which lives here.
- **Only touch CI config and (if asked) coverage files.** Do not modify
  application or test source. When e2e tests live in another repo, do not edit
  that repo blindly — produce the change and tell the user where it goes.

---

## Workflow

### Step 1 — Discover the project (delegate to `project-scan`)

Run **`project-scan`**. From its result capture:

- **Frameworks** — is there an automated **e2e** framework here (Playwright,
  Cypress, CodeceptJS, WebdriverIO, Puppeteer, Appium)? Unit/integration
  frameworks do **not** count as e2e.
- **Manual tests** — are there `*.test.md` cases (here or pullable from Testomat.io)?
- **Automated tests** — present in this repo, or only elsewhere?

This tells you which of the two flows are even applicable.

### Step 2 — Identify the CI system (do not assume)

Read the repo to see which CI it already uses — its CI config files / dotfiles
make this obvious. If nothing is configured, or several CIs are present, **ask
the user which CI runs their PRs**. You do not need a lookup table or recipes
for this; once you know the CI, you know how to write for it.

### Step 3 — Locate or create the coverage maps

Look for existing coverage files in the repo root: `coverage.manual.yml`,
`coverage.e2e.yml`, or any `coverage*.yml`. Inspect the keys to confirm they
map this repo's source.

For each flow the user wants:

- **Map exists** → reuse it. Validate it still resolves (the coverage skills
  bundle a checker) before wiring CI to it.
- **Map missing** → regression for that flow **will not work**. Propose
  creating it and, on agreement, delegate:
  - manual flow → **`manual-coverage`** → produces `coverage.manual.yml`
  - automated/e2e flow → **`automation-coverage`** → produces `coverage.e2e.yml`

Do not proceed to CI for a flow whose map does not exist.

### Step 4 — Ask the unknowns about the end system's PR flow

We cannot see how their PRs deploy, and we do not know how they want runs
grouped. Before designing the flows, ask (skip whatever the project-scan / CI
config already clearly answers — read their CI files first so you don't ask
something already there):

1. **When does a deploy that should trigger e2e happen?** Surface the common
   options so the user can pick:
   - on merge to the main/deploy branch,
   - on a release event (GitHub Release published, GitLab release created,
     etc.),
   - on a git tag (e.g. `v*`),
   - on every commit / push to a deploy branch,
   - on each push to the PR branch (preview environment),
   - never — deploy is manual, run e2e on demand.
2. **How does that deploy signal its completion?** This gates the e2e run. We
   need a concrete, observable signal — for example a deploy job/stage
   completing, a `workflow_run`/pipeline-finished event, a deployment event, a
   status check turning green, a release/tag being created, or a health
   endpoint going 200. Ask which one their system actually exposes.
3. **What rungroup strategy should PR Regression runs use?** Every run goes
   into a rungroup; the question is *what defines a group*. Common choices to
   offer (let the user pick or write their own):
   - **week** — e.g. `PR Regression W2 May 2026` (one recipe:
     `W$(( ($(date +%-d) - 1) / 7 + 1 )) $(date +'%B %Y')`),
   - **day** — e.g. `PR Regression 2026-05-27`,
   - **milestone** — the active sprint/milestone label,
   - **release** — the upcoming release/version tag,
   - **submodule** — the project area touched (useful in monorepos).
   Default to one strategy for both manual and automated unless the user
   explicitly splits them.
4. **Diff base** for "what changed": usually the PR's target branch
   (`main`/`master`) for the PR-open manual run; for a post-deploy run it is
   the range that was just deployed (see
   [references/REPORTER_CONTRACT.md](references/REPORTER_CONTRACT.md) on the
   one-commit-per-deploy caveat).

**Manual regression does not need the deploy answers (Q1, Q2, and the
post-deploy half of Q4).** A manual run can be created and left pending the
moment the PR opens — testers pick it up whenever. It still needs the rungroup
answer from Q3.

### Step 5 — Decide WHERE the automated/e2e tests run

This is the key architectural choice. Use the project-scan result.

**Default — cross-repo dispatch (preferred for browser / UI e2e).**
For Playwright, Cypress, CodeceptJS, WebdriverIO, Puppeteer and similar
browser-driven suites, prefer running the tests in a **dedicated e2e repo**
even if a thin e2e folder also exists here. Reasons:

- the e2e repo already owns the heavy setup — browsers, fixtures, environment
  URLs, secrets, parallelism config;
- duplicating that setup in the source repo's pipeline causes secret sprawl
  and CI drift;
- the source repo only needs its own coverage map + git history to compute the
  selection.

Pattern: this repo computes the grep, pre-creates the run via `reporter start`,
and triggers the **existing workflow in the e2e repo** with `{grep, run, env}`.
Step 6(b) details the ordering; the contract is in
[references/REPORTER_CONTRACT.md](references/REPORTER_CONTRACT.md).

**Exceptions — run in this repo's pipeline instead:**

- **Mobile (Appium, Detox, native iOS/Android simulators).** The runner is
  bound to specific OS images, emulators and signing material that live with
  the test job. Remote-triggering a mobile pipeline rarely buys anything; keep
  it here.
- **Low-level / setup-heavy frameworks** where the e2e job is already wired
  into this repo for legitimate reasons (compiled-in test harnesses,
  fixtures generated from this repo's build, etc.). Don't fight an existing
  setup that works.
- **API / contract tests** that exercise a server this repo can spin up. Start
  the app locally, check out the API-tests repo if needed, run against
  `localhost`. They are not gated on a remote deploy.

**Same-repo path remains valid** when the e2e suite genuinely belongs here and
the setup cost is low. Run it directly with the reporter wrapping the runner.

**No e2e suite anywhere (only unit/integration here).** Do **not** stand up an
e2e job from this repo. Set up the manual flow only and tell the user the
automated flow needs an e2e suite first (point them at `automation-coverage` /
test authoring).

### Step 6 — Wire the two flows into the project's CI

Express each applicable flow in the CI identified in Step 2, in that CI's own
syntax — you know it. The skill-specific parts are the reporter commands, the
env vars, and the structural rules below; the trigger/secret/job scaffolding
is ordinary CI config you write for whatever system it is.

**Manual regression** — always safe, no deploy dependency:

- Trigger: PR opened (add reopened/synchronize if the user wants refreshes).
- Required env on the job: `TESTOMATIO` (API key), `TESTOMATIO_TITLE`,
  `TESTOMATIO_RUNGROUP_TITLE`.
  - `TESTOMATIO_TITLE` — derived from the PR: e.g. `PR <pr-title> #<pr-number>`.
  - `TESTOMATIO_RUNGROUP_TITLE` — computed from the strategy chosen in Step 4.
    One recipe for a week-bucket strategy:
    `PR Regression W<week-of-month> <Month> <Year>`. The expression itself is
    CI-shell trivia (use whatever date/expression syntax the CI gives you).
- Command (no runner — this only creates the run):
  ```
  npx @testomatio/reporter run --kind manual \
    --filter "coverage:file=coverage.manual.yml,diff=<base-branch>"
  ```
- Result: a pending manual run in Testomat.io, titled and grouped, containing
  only affected cases. Testers pick it up from the rungroup.

**Automated/e2e regression** — after deploy, never blocks the pipeline:

- Trigger: the deploy-completion signal from Step 4 — never "PR opened".
- Required env on every reporter call: `TESTOMATIO`, `TESTOMATIO_TITLE`,
  `TESTOMATIO_RUNGROUP_TITLE`.
  - Title derivation depends on the trigger: commit subject + short SHA for
    commit-triggered, tag name for tag/release-triggered.
  - Rungroup: reuse the same strategy as the manual flow unless the user
    split them in Step 4.

**(a) Same-repo run** — when Step 5 picked the same-repo path:

```
npx @testomatio/reporter run "<test runner cmd>" \
  --filter "coverage:file=coverage.e2e.yml,diff=<base>"
```

The reporter creates the run, runs the filtered tests, and closes it.

**(b) Cross-repo dispatch** — when Step 5 picked the cross-repo path. Four
explicit stages, in order:

1. **Compute the grep** from this repo using the `--filter-list --format=grep`
   dry-run (full mechanics in
   [references/REPORTER_CONTRACT.md](references/REPORTER_CONTRACT.md)):
   ```
   GREP=$(npx @testomatio/reporter run \
     --filter-list "coverage:file=coverage.e2e.yml,diff=<base>" --format=grep)
   ```
2. **Skip the dispatch if `$GREP` is empty.** Nothing was affected; do not
   trigger the e2e repo (most runners interpret an empty grep as "run
   everything").
3. **Pre-create the empty run here** with `reporter start`, carrying title +
   rungroup, and capture the ID from stdout:
   ```
   RUN_ID=$(npx @testomatio/reporter start --kind automated | tail -n1)
   ```
4. **Trigger the e2e repo's workflow** with `{grep: $GREP, run: $RUN_ID,
   test_env: <env name>}` as inputs (whatever the CI's cross-repo trigger
   mechanism is — repository_dispatch, pipeline trigger, project access token,
   etc.). The e2e repo's job must export `TESTOMATIO_RUN=<run input>` so its
   test results attach to this pre-created run.

- **Isolation:** keep the automated flow off the release's critical path —
  a separate workflow/pipeline triggered by the deploy signal, with the job
  set non-failing for the release (every CI has such a knob: `continue-on-error`,
  `allow_failure: true`, etc.). It reports to Testomat.io; it must not gate
  the deploy.

Always state the secrets/tokens the user must provision — the Testomat.io API
key (in both repos for the cross-repo path), and for cross-repo triggering a
token allowed to trigger the other repo (a CI's built-in token usually cannot
reach another repo; this typically means a PAT, project access token, or app
token with the appropriate scope).

#### When the e2e repo has no dispatchable workflow

If the e2e repo does not already accept a `grep` + `run` + `test_env` trigger,
do not silently restructure their pipeline. Propose a small dispatchable
workflow with this contract:

- **Inputs:**
  - `grep` — runner filter (e.g. `(@Sxxxx|@Tyyyy|@Tzzzz)`).
  - `run` — Testomat.io run ID to attach results to.
  - `test_env` (or `target_env`) — which environment the suite should hit
    (e.g. `beta`, `staging`, `preview-pr-123`).
- **Behavior:**
  - Set `TESTOMATIO_RUN=<run input>` in the test job's env.
  - Invoke the runner with the grep applied (the runner's `--grep` /
    `--testNamePattern` / equivalent), pointed at the chosen `test_env`.
  - Report results via `@testomatio/reporter` as normal — because
    `TESTOMATIO_RUN` is set, they attach to the pre-created run rather than
    creating a new one.

Produce a draft of this workflow in the e2e repo's CI syntax, name the file
path it belongs at, and tell the user to commit it there. Do not push to
another repo on the user's behalf.

### Step 7 — Summarize and hand off

Report concisely:

- CI system targeted; files written in this repo (and, for a separate e2e
  repo, the file the user must commit *there* — you cannot push it for them).
- Which flows are wired; which were skipped and why (missing coverage map / no
  e2e suite).
- Title scheme chosen for each flow (e.g. "PR title + #number" for manual,
  "commit subject + SHA" for automated).
- Rungroup strategy chosen and where the value is computed (the CI shell
  expression / script step).
- For cross-repo e2e: that the run is pre-created in **this** repo and the
  e2e repo's job exports `TESTOMATIO_RUN`; also whether a new dispatchable
  workflow was proposed for the e2e repo (and where it should be committed).
- Secrets/tokens to add before it works — `TESTOMATIO` in both repos for the
  cross-repo path; cross-repo trigger token (PAT/project token/app) on the
  source side.
- Any assumption that needs the user's confirmation (deploy signal, diff base,
  rungroup recipe).
- Recommend committing the coverage map(s) so CI and the team share one
  mapping.

---

## Examples

**Example 1 — e2e suite in a separate repo**
Input: "Make our PRs run the manual cases and, after deploy, the affected e2e
tests. E2E lives in a sibling repo."
Output: ask the rungroup question (user picks weekly). PR-opened job creates a
titled manual run (`PR <title> #<n>`) inside `PR Regression W<n> <Month> <Year>`.
A separate job keyed off the deploy-completion signal: computes the grep with
`--filter-list --format=grep`, pre-creates the run with `reporter start`
(same title scheme, same rungroup), captures the run ID, and triggers the e2e
repo's existing workflow with `{grep, run, test_env}`. Tokens listed; the
automated job set non-failing for the release. All written in the project's
own CI.

**Example 2 — no coverage files yet**
Input: "Set up selective regression on our pull requests."
Output: find no `coverage.*.yml`; explain regression can't work without them;
delegate to `manual-coverage` / `automation-coverage`; only then wire the CI.

**Example 3 — only unit tests in repo**
Input: "Run affected e2e on PRs."
Output: project-scan finds no e2e framework anywhere; set up the manual flow if
manual cases exist; explain the automated flow needs an e2e suite first; do not
fabricate an e2e job.

**Example 4 — deploy-on-tag, release-grouped runs, e2e repo has no dispatch yet**
Input: "We deploy when we push a `v*` tag. Group runs by release. Our e2e
tests are in a separate repo that doesn't have a workflow we can trigger."
Output: rungroup strategy = release (`PR Regression <tag>`). Tag-creation event
is the deploy trigger; deploy job completion is the signal. Source repo computes
grep, pre-creates the run titled with the tag, and would dispatch — but the e2e
repo has no dispatchable workflow yet. Propose a workflow file for the e2e repo
with inputs `{grep, run, test_env}` and `TESTOMATIO_RUN` wired into the runner
job; hand it to the user to commit in the e2e repo. Wire the source side once
the e2e workflow exists.

---

## References

| Description                            | File                            |
| -------------------------------------- | ------------------------------- |
| Reporter command contract & cross-repo | references/REPORTER_CONTRACT.md |

## Related skills

`project-scan` (mandatory first), `manual-coverage` and `automation-coverage`
(create the maps this skill consumes), `reporter-setup` (install the reporter if
the project has no Testomat.io integration yet).
