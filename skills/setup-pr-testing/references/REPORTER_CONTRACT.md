# Reporter Contract & Cross-Repo Triggering

How `@testomatio/reporter` consumes a coverage map, and the exact mechanics for
the cross-repo e2e pattern. This is CI-independent — the CI recipes wrap these.

## 1. The coverage filter

A coverage map (`coverage.manual.yml` / `coverage.e2e.yml`) maps source globs →
test/suite IDs/tags. The reporter resolves *changed files* via git, maps them
through the YAML, and selects the matching tests.

```
--filter "coverage:file=<path-to-coverage.yml>,diff=<git-ref>"
```

- `file=` — path to the coverage map. **May be absolute.** It is read with
  `fs`, independent of the working directory.
- `diff=` — git ref to diff against. Defaults to `master` if omitted. The
  reporter runs `git diff <ref> --name-only` **in `process.cwd()`** (no `-C`).
  So the reporter must be launched from inside the repo whose changes you want
  to detect. Confirmed behavior, not configurable.

Implication for cross-repo: if the coverage map + source live in repo A but the
test runner runs in repo B, launch the reporter with cwd = repo A (so the diff
is repo A's), and let the runner command `cd` into repo B.

## 2. Manual flow — create a pending run

No test runner. The reporter just creates a manual run in Testomat.io
containing only the affected cases:

```
npx @testomatio/reporter run --kind manual \
  --filter "coverage:file=coverage.manual.yml,diff=<base-branch>"
```

- Needs `TESTOMATIO` (API key) in env.
- `<base-branch>` for a PR is normally the target branch (`main`/`master`).
- Safe to run the instant a PR opens. No deploy dependency. Non-blocking.
- **Required in practice for `setup-pr-testing`:**
  - `TESTOMATIO_TITLE` — meaningful run title. For PR-opened triggers derive
    from PR title + number (e.g. `PR Add invoice export #482`).
  - `TESTOMATIO_RUNGROUP_TITLE` — the rungroup bucket the run lands in
    (week / day / milestone / submodule / release — whichever the user picked
    in Step 4 of the skill). Supports `/` nesting for sub-grouping.
  - `TESTOMATIO_ENV` (optional) — target environment label.

## 3. Automated flow — run only affected tests

The reporter wraps the runner command and injects the framework-appropriate
grep (`--grep`, `--testNamePattern`, Cypress env, etc.) for the matched IDs:

```
npx @testomatio/reporter run "<runner cmd>" \
  --filter "coverage:file=coverage.e2e.yml,diff=<base>"
```

Examples of `<runner cmd>`: `npx playwright test`, `npx cypress run`,
`npx codeceptjs run`, `npx wdio`. Run this from the repo that holds the
coverage map + git history (see §1).

- **Required in practice for `setup-pr-testing`:**
  - `TESTOMATIO_TITLE` — for commit-triggered runs derive from the commit
    subject + short SHA; for tag/release-triggered runs use the tag name.
  - `TESTOMATIO_RUNGROUP_TITLE` — same strategy as the manual flow unless the
    user split them.
  - `TESTOMATIO_ENV` (optional) — target environment label.

## 4. Inspect-only (dry run) — get the selection without running

`--filter-list` is the documented mode to compute the affected tests **without
executing** them (docs: coverage pipe → "Retrieve a list of tests matching your
filter"). Use it when the selection must be computed in one repo and the tests
run elsewhere.

Pair it with `--format=grep` to get the alternation string directly on stdout
(no parsing needed):

```bash
GREP=$(npx @testomatio/reporter run \
  --filter-list "coverage:file=coverage.e2e.yml,diff=$BASE" --format=grep)
# -> GREP = "(@Sxxxx|@Tyyyy|...)";  use as: <runner> --grep "$GREP"
```

Other `--format` values: `json`, `newline`, `ids` (default: comma-separated).

Only proceed to trigger the run when `$GREP` is non-empty — an empty grep
means "nothing affected", and most runners treat an empty grep as "run
everything".

## 5. `reporter start` — pre-create an empty run

`start` initiates a new test run in Testomat.io and returns its identifier,
**without running any tests**. Use it when the selection is computed in one
repo (this one) but the tests run in another job or another repo, and you want
their results to attach to a single, pre-titled run that already lives in the
correct rungroup.

```bash
RUN_ID=$(npx @testomatio/reporter start --kind automated | tail -n1)
```

- `--kind` — `automated`, `manual`, or `mixed`.
- Required env: `TESTOMATIO`. In practice also set `TESTOMATIO_TITLE` and
  `TESTOMATIO_RUNGROUP_TITLE` so the run is created with the right metadata.
  `TESTOMATIO_ENV` optional.
- **Output:** the run ID is the last line of stdout — capture with `tail -n1`.
- **Pair:** the consuming job (whatever runs the tests — same repo or
  another) exports `TESTOMATIO_RUN=$RUN_ID`. Any subsequent `@testomatio/reporter`
  call there will attach to that run instead of creating a new one.

## 6. Cross-repo e2e pattern (preferred when e2e lives elsewhere)

Roles:

- **Source repo** (this one): owns `coverage.e2e.yml` + the diff + the run's
  identity (title, rungroup). After the deploy signal: computes `$GREP` via
  §4, pre-creates the run via §5, then triggers the e2e repo carrying both
  `$GREP` and `$RUN_ID`.
- **E2E repo**: already has a workflow that accepts a grep/filter input + a
  run ID and runs the suite against the deployed environment. We trigger that
  existing workflow — we do **not** duplicate it.

Why this split: the e2e repo holds the runner, browsers, environment URLs and
secrets. Reproducing all that in the source repo is duplication and a secret-
sprawl risk. The source repo only needs its own coverage map + git + a Testomat.io
API key.

**Four explicit stages:**

1. Compute the selection: `GREP=$(reporter run --filter-list … --format=grep)`
   (§4).
2. If `$GREP` is empty → stop. Nothing was affected.
3. Pre-create the run: `RUN_ID=$(reporter start … | tail -n1)` (§5).
4. Trigger the e2e repo's workflow with inputs `{grep: $GREP, run: $RUN_ID,
   test_env: <env name>}`. The e2e repo's runner job exports
   `TESTOMATIO_RUN=<run input>` so its reports attach to the pre-created run.

Triggering mechanism — whatever cross-repo pipeline/workflow trigger the CI
offers, carrying the grep + run + env as inputs/variables. The built-in CI
token usually cannot reach another repo — a PAT / project access token / app
token / deploy trigger token with permission on the e2e repo is required.
State this to the user as a provisioning step.

If the e2e repo's workflow does **not** yet accept `grep` + `run` + `test_env`
inputs, that is a small addition there — describe the contract (`SKILL.md` §6
"When the e2e repo has no dispatchable workflow") and hand the user a draft;
do not silently restructure their pipeline.

## 7. Diff base caveats

- **Manual, on PR open**: `diff=<target-branch>` (e.g. `main`) — the natural
  "what this PR changes".
- **Automated, after deploy**: the meaningful diff is *what was just deployed*.
  On a squash/rebase merge that is one commit, so `diff=<deployed_sha>~1`
  works. If the project lands **multi-commit** pushes onto the deploy branch,
  `~1` under-selects — instead diff against the previously-deployed SHA
  (carry/persist it between deploys). Always surface this assumption to the user
  rather than hard-coding silently.

## 8. Required environment

- `TESTOMATIO` — Testomat.io API key (both flows; in both repos for cross-repo).
- `TESTOMATIO_TITLE` — meaningful run title. Required in practice for every
  `setup-pr-testing` reporter call (manual, automated, `start`).
- `TESTOMATIO_RUNGROUP_TITLE` — rungroup the run lands in. Required in
  practice for every `setup-pr-testing` reporter call. Supports `/` nesting.
- `TESTOMATIO_RUN` — **cross-repo only.** Set in the e2e repo's runner job to
  the run ID returned by `reporter start` in the source repo, so its reports
  attach to the pre-created run.
- `TESTOMATIO_ENV` (optional) — target environment label.
- Cross-repo CI: a token authorized to trigger the e2e repo's CI (PAT /
  project access token / app token; the built-in CI token usually cannot).
