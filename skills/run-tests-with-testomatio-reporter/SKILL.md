---
name: run-tests-with-testomatio-reporter
description: Create and launch Testomat.io test runs with the `@testomatio/reporter` CLI. Covers manual runs for testers, mixed manual+automated runs, local test execution with reported results, and remote launches through a Testomat.io CI profile (`--remote`). Use when the user asks to start or create a test run from the command line, run a group of tests scoped to changed files, launch tests remotely, or report results into an existing run.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# Run Tests with Testomat.io Reporter

`npx @testomatio/reporter` creates test runs in Testomat.io and launches groups of tests — locally or remotely through a CI profile. Every value in angle brackets is a placeholder.

## Pick the command by intent

| Intent                                              | Command                       |
| --------------------------------------------------- | ----------------------------- |
| Create a run, execute nothing — testers start on it | `start`                       |
| Execute tests locally and report results            | `run "<runner command>"`      |
| Launch tests remotely via a Testomat.io CI profile  | `run --remote <profile-name>` |

Every command requires the `TESTOMATIO` env var (the project API key) and exits 1 without it.

## Run kinds

`--kind` declares what the run contains:

| Kind      | Flag            | Behavior                                                                                        |
| --------- | --------------- | ----------------------------------------------------------------------------------------------- |
| manual    | `--kind manual` | manual cases only — pending for testers, complete without any launch                            |
| mixed     | `--kind mixed`  | manual + automated in one run — testers work it while the automated part is launched separately |
| automated | *(no flag)*     | automated tests only                                                                            |

A run created with `start` executes nothing: manual cases are pending immediately; an automated part stays scheduled until launched. `--format id` prints only the run id to stdout (banner and logs go to stderr), so capture is clean:

```bash
RUN_ID=$(npx @testomatio/reporter start --kind mixed \
  --filter "coverage:file=<coverage-map>,diff=<git-ref>" --format id)
```

## Scope the run to changed files

```
--filter "coverage:file=<path-to-coverage-map>,diff=<git-ref>"
```

- `file=` — the coverage map produced by `qa-test-code-coverage` (default `coverage.tests.yml`). May be absolute; it is read with `fs`, independent of the working directory.
- `diff=` — git ref to diff against; defaults to `master`. The reporter runs `git diff <ref> --name-only` **in `process.cwd()`** — launch it from inside the repo whose changes are being detected.
- Changed files are mapped through the YAML; the matching suite/test IDs and tags become the run's scope.
- Zero matching tests → no run is created (`No tests found.`); treat that as success in scripts and CI jobs.

### Picking the diff base

- Changes on a branch → diff against its target branch (e.g. `origin/<default-branch>`). Full git history must be available (`fetch-depth: 0` or the CI's equivalent).
- After a merge the target branch equals `HEAD`, so diffing against it yields nothing — use the previous mainline tip: `HEAD~1` for squash merges, `HEAD^1` for merge commits.

## Name and group the run

- `TESTOMATIO_TITLE` — the run title (e.g. `PR <number>: <title>`).
- `TESTOMATIO_RUNGROUP_TITLE` — groups related runs (per week / release / milestone).
- `TESTOMATIO_ENV` — optional environment labels.

## Report into an existing run

- `TESTOMATIO_RUN=<run-id>` — the command reports or launches into that run instead of creating a new one. Works across pipelines and even across repos — pass it (with `TESTOMATIO` and the title env) into whatever process executes the tests.
- No id at hand → shared-run title matching. Set on both sides:
  - `TESTOMATIO_SHARED_RUN=1` — match the run by `TESTOMATIO_TITLE` instead of creating a new one;
  - `TESTOMATIO_TITLE` — the match key, identical on both sides;
  - `TESTOMATIO_SHARED_RUN_TIMEOUT` — minutes the title stays matchable, **default 20**; size it to the expected gap between create and launch.

## Remote launch (`run --remote`)

`--remote <profile-name>` asks Testomat.io to dispatch a CI profile configured on the project (Settings → CI) instead of executing tests locally:

```bash
TESTOMATIO_RUN=$RUN_ID npx @testomatio/reporter run --remote <profile-name> \
  --filter "coverage:file=<coverage-map>,diff=<git-ref>"
```

- With `TESTOMATIO_RUN`, the profile is triggered for that run; without it, a new run is created.
- No `--filter` → a prepared run's stored scope from creation time is reused; a fresh `--filter` replaces it.
- `--remote-param <key>=<value>` forwards a parameter to the profile config (repeat for several) — e.g. a preview URL or target branch.
- Guards: cannot combine with `--filter-list`; any positional command is ignored with a warning; a missing profile fails with `CI launch failed: <message>` and exit 1.

### List the CI profiles (info API)

Read-only:

```bash
curl -s -H "Authorization: Bearer $TESTOMATIO" \
  "https://app.testomat.io/api/v2/<project-id>/info"
```

Self-hosted instances replace the host with the instance URL. Relevant `data` fields:

| Field                        | Use                                                                  |
| ---------------------------- | -------------------------------------------------------------------- |
| `project_id`                 | the project slug                                                     |
| `ci_profiles[].profile_name` | the value `--remote` takes                                           |
| `ci_profiles[].service`      | which CI the profile dispatches                                      |
| `ci_profiles[].pass_run_id`  | the dispatched workflow receives the run id and reports into the run |
| `environments`               | candidates for `TESTOMATIO_ENV`                                      |

Empty `ci_profiles` → remote launch needs a profile created in Testomat.io first (Settings → CI).

## Local execution (`run "<runner command>"`)

Wrap the runner — the coverage filter generates the grep the runner consumes, and results report into the run:

```bash
TESTOMATIO_RUN=$RUN_ID npx @testomatio/reporter run "<runner command>" \
  --filter "coverage:file=<coverage-map>,diff=<git-ref>"
```

## PR/MR comments

When results report, the reporter posts and updates the PR/MR summary comment itself — never script a comment API call. Enable the pipe by setting its token:

| Platform  | Env var                  | Note                                               |
| --------- | ------------------------ | -------------------------------------------------- |
| GitHub    | `GH_PAT`                 | the workflow's built-in token works inside PR runs |
| GitLab    | `GITLAB_PAT`             | access token with `api` scope                      |
| Bitbucket | `BITBUCKET_ACCESS_TOKEN` | repository access token                            |

No pipe for the platform (e.g. Azure DevOps) → no comment; results remain visible in Testomat.io.

## Related skills

`qa-test-code-coverage` (produces the coverage map for scoped runs), `setup-pr-testing` (wires these commands into a CI pipeline), `qa-e2e-tests-reporting` (install and configure the reporter in an automation project).
