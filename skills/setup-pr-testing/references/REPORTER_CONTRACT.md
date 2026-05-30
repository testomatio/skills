# Reporter Contract: counts, prepared runs & `--remote`

How `@testomatio/reporter` consumes a coverage map, counts affected tests for
the PR comment, prepares runs without executing them, and launches a prepared
run on a Testomat.io CI profile. This is CI-independent — the CI config wraps
these commands.

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

The whole model rests on this: the repo that holds the coverage map + git
history is where the affected selection is computed — for the comment counts and
for scoping the prepared run alike.

## 2. Phase 1 — affected-counts comment (`--filter-list`)

`--filter-list` computes the affected tests **without executing or creating a
run** — exactly what the PR-open notice needs. Pair it with `--format` to get a
clean, parseable list on stdout (the banner is suppressed and logs go to
stderr):

```bash
npx @testomatio/reporter run \
  --filter-list "coverage:file=coverage.manual.yml,diff=$BASE" --format ids
npx @testomatio/reporter run \
  --filter-list "coverage:file=coverage.e2e.yml,diff=$BASE" --format ids
```

`--format` values: `ids` (comma-separated, default), `newline` (one per line —
easy to `wc -l`), `json`, `grep` (`(@Sxxxx|@Tyyyy|...)`).

- Count the entries per map; empty output = `0`.
- Assemble one line, e.g. `0 automated tests, 10 manual tests are affected by
  this PR`, and post it via the CI's PR/MR comment API (GitHub / GitLab /
  Bitbucket). Prefer updating one existing comment over re-posting.
- Needs `TESTOMATIO` (API key) for the `coverage:` resolution. Creates nothing,
  must never fail the PR check.

## 3. Phase 2 — create the regression runs on merge

### 3a. Manual run — created pending, not executed

No test runner; the reporter creates a manual run containing only the affected
cases for testers to pick up:

```bash
npx @testomatio/reporter start --kind manual \
  --filter "coverage:file=coverage.manual.yml,diff=$BASE"
```

- Required env: `TESTOMATIO`, `TESTOMATIO_TITLE` (merge commit, e.g. `report for
  commit <sha>`), `TESTOMATIO_RUNGROUP_TITLE` (the rungroup bucket; supports `/`
  nesting). `TESTOMATIO_ENV` optional.

### 3b. Automated run — prepared as a shared run, not executed

`start` creates the run scoped to the affected e2e tests and returns its id
**without running anything**. Created as a *shared* run so the later execute
step — and any parallel executors — converge on this one run by title:

```bash
RUN_ID=$(TESTOMATIO_SHARED_RUN=1 \
  TESTOMATIO_TITLE="report for commit $SHA" \
  TESTOMATIO_SHARED_RUN_TIMEOUT=$DEPLOY_MINUTES \
  npx @testomatio/reporter start --filter "coverage:file=coverage.e2e.yml,diff=$BASE" \
  | tail -n1)
```

- `--filter` scopes the prepared run to the affected tests; that scope is stored
  on the run and reused at launch time (§4).
- **Output:** the run id is the last line of stdout — capture with `tail -n1`.
- Required env: `TESTOMATIO`, `TESTOMATIO_TITLE`, `TESTOMATIO_RUNGROUP_TITLE`.

### Shared-run env vars (the convergence mechanism)

- `TESTOMATIO_SHARED_RUN=1` — report/launch into the run matching
  `TESTOMATIO_TITLE` instead of creating a new one. All parallel reporters with
  the same title land in the same run.
- `TESTOMATIO_TITLE` — the match key. The prepare step (§3b) and the execute
  step (§4) **must** use the identical title.
- `TESTOMATIO_SHARED_RUN_TIMEOUT` — minutes the title stays matchable, **default
  20**. After it elapses a new run is created instead. Set it above the typical
  merge→deploy duration, or the execute step won't attach to the prepared run.
  Example: `TESTOMATIO_SHARED_RUN_TIMEOUT=120` for a 2-hour window.

## 4. Phase 3 — launch the prepared run on CI (`reporter run --remote`)

`reporter run --remote <profile>` asks Testomat.io to dispatch the project's CI
profile (configured under **Settings → CI**) for an already-prepared run,
instead of executing tests locally. This replaces the old cross-repo dispatch:
the CI profile owns the runner, browsers, environment URLs and secrets — the
reporter just triggers it.

```bash
TESTOMATIO_RUN=$RUN_ID \
TESTOMATIO_SHARED_RUN=1 \
TESTOMATIO_TITLE="report for commit $SHA" \
npx @testomatio/reporter run --remote <profile>
```

- `TESTOMATIO_RUN=$RUN_ID` points the launch at the run prepared in §3b. With no
  fresh `--filter`, Testomat.io greps that run's **own stored scope**, so only
  the affected e2e tests run — no need to recompute the diff at deploy time.
- The CI profile name must exist on the project, otherwise the call fails with
  `CI launch failed: No settings for <profile>`. `--remote` cannot be combined
  with `--filter-list`.
- Testomat.io passes the run id into the dispatched workflow, so the e2e tests
  running there report back into the same prepared run.
- On success the CLI prints the launched profile and run URL, then exits 0; the
  run transitions as the CI reports results.

**Decoupled deploy (no `RUN_ID` to hand over).** If the deploy pipeline can't
carry `RUN_ID`, drop it and let the shared-run **title** match the prepared run
— keep `TESTOMATIO_SHARED_RUN=1` and the identical `TESTOMATIO_TITLE`, and make
sure the shared-run timeout (§3b) is still open. Carrying `RUN_ID` is the more
direct link when the same pipeline does merge→deploy; matching by title is the
fallback for a separate deploy pipeline.

**Optional CI overrides.** `--remote-param key=value` (repeatable) forwards
values into the CI profile config at launch (e.g. `--remote-param branch=main`).
The same launch config can be set via env: `TESTOMATIO_CI_PROFILE` (= the
profile) and `TESTOMATIO_CI_PARAMS` (= comma-separated `key=value` overrides).

## 5. Inline exception — execute in this pipeline (no CI profile)

When the e2e suite runs in this pipeline (mobile, API/contract, or an existing
same-repo job) rather than via a CI profile, launch the prepared run by wrapping
the runner directly after deploy:

```bash
TESTOMATIO_RUN=$RUN_ID npx @testomatio/reporter run "<runner cmd>" \
  --filter "coverage:file=coverage.e2e.yml,diff=$BASE"
```

Examples of `<runner cmd>`: `npx playwright test`, `npx cypress run`,
`npx codeceptjs run`, `npx wdio`. The reporter injects the framework-appropriate
grep for the matched IDs and reports into `$RUN_ID`.

## 6. Diff base caveats

- **Comment + on-merge runs**: `diff=<target-branch>` (e.g. `main`) — the
  natural "what this PR changes".
- **If you recompute at deploy time**: the meaningful diff is *what was just
  deployed*. On a squash/rebase merge that is one commit, so `diff=<sha>~1`
  works. With **multi-commit** pushes onto the deploy branch, `~1` under-selects
  — diff against the previously-deployed SHA (persist it between deploys).
  Preferably avoid recomputing: the prepared run already carries its scope, so
  the `--remote` launch reuses it (§4) and no deploy-time diff is needed.
  Surface this to the user rather than hard-coding silently.

## 7. Required environment

- `TESTOMATIO` — Testomat.io API key (every phase that talks to Testomat.io).
- `TESTOMATIO_TITLE` — run title; derive from the merge commit. The automated
  prepare (§3b) and execute (§4) steps MUST use the same value.
- `TESTOMATIO_RUNGROUP_TITLE` — rungroup for the created runs. Supports `/`
  nesting.
- `TESTOMATIO_SHARED_RUN` — `1` to converge on the title-matched run (automated
  prepare + execute).
- `TESTOMATIO_SHARED_RUN_TIMEOUT` — minutes the shared title stays matchable
  (default 20); set above the merge→deploy duration.
- `TESTOMATIO_RUN` — the prepared run id; set on the execute step to launch that
  specific run.
- `TESTOMATIO_CI_PROFILE` / `TESTOMATIO_CI_PARAMS` — env equivalents of
  `--remote` / `--remote-param`.
- `TESTOMATIO_ENV` (optional) — target environment label.
- A Testomat.io **CI profile** (Settings → CI) is required for `--remote`; it is
  configured in Testomat.io, not as a repo secret.
