---
name: run-tests-with-testomatio-reporter
description: Create and launch Testomat.io test runs with the `@testomatio/reporter` CLI. Covers manual runs for testers, mixed manual+automated runs, local test execution with reported results, and remote launches through a Testomat.io CI profile (`--remote`). Runs can include the whole suite or be filtered by tag, plan, label, Jira ticket, or changed source files. Use when the user asks to start or create a test run from the command line, run a filtered group of tests, launch tests remotely, or report results into an existing run.
license: MIT
metadata:
  author: Testomat.io
  version: 1.1.0
---

# Run Tests with Testomat.io Reporter

`npx @testomatio/reporter` creates test runs in Testomat.io and launches groups of tests — locally or remotely through a CI profile. Every command requires the `TESTOMATIO` env var (the project API key, `tstmt_*`) and exits 1 without it. Every value in angle brackets is a placeholder.

## Pick the command by intent

| Intent                                              | Command                                     |
| --------------------------------------------------- | ------------------------------------------- |
| Create a run, execute nothing — testers start on it | `start`                                     |
| Execute tests locally and report results            | `run "<runner command>"`                    |
| Launch tests remotely via a Testomat.io CI profile  | `run --remote <profile-name>`               |
| List which tests a filter matches, run nothing      | `run --filter-list "<filter>" --format ids` |
| Close a run created earlier                         | `finish` (run id via `TESTOMATIO_RUN`)      |

## Run kinds

`--kind` declares what the run contains:

| Kind      | Flag            | Behavior                                                                                        |
| --------- | --------------- | ----------------------------------------------------------------------------------------------- |
| manual    | `--kind manual` | manual cases only — pending for testers, complete without any launch                            |
| mixed     | `--kind mixed`  | manual + automated in one run — testers work it while the automated part is launched separately |
| automated | *(no flag)*     | automated tests only                                                                            |

A run created with `start` executes nothing: manual cases are pending immediately; an automated part stays scheduled until launched. `--format id` prints only the run id to stdout (banner and logs go to stderr), so capture is clean:

```bash
RUN_ID=$(npx @testomatio/reporter start --kind manual --format id)
```

## What goes into the run

Without a filter, nothing is scoped:

- `start` creates a run with no predefined test list — results land in it later, when tests report with `TESTOMATIO_RUN=<run-id>`.
- `run "<runner command>"` executes the full suite and reports every result.
- `run --remote <profile-name>` dispatches the CI profile with its default scope.

`--filter "<pipe>:<criteria>"` narrows the run to the matching tests instead. Two filter pipes exist — `testomatio:` (match by test metadata stored in the project) and `coverage:` (match by changed source files); any other prefix is rejected. `start` and `run` accept the same filters, so a filtered run can be prepared first and launched later.

### Filter by tag, plan, label, or Jira ticket (`testomatio:`)

| Criteria                   | Filter                                       |
| -------------------------- | -------------------------------------------- |
| tag                        | `"testomatio:tag-name=<tag>"`                |
| plan (Testomat.io plan id) | `"testomatio:plan=<plan-id>"`                |
| label                      | `"testomatio:label=<label>"`                 |
| label with value           | `"testomatio:label=<label>:<value>"`         |
| Jira ticket                | `"testomatio:jira-ticket=<ticket-id>"`       |

- The value must match exactly — the tag name, plan id, label, or ticket as stored in the project.
- Local filtered execution is supported for Playwright and CodeceptJS runners. Remote launches and `--filter-list` work with any framework — they only resolve test ids.

### Filter by changed source files (`coverage:`)

```
--filter "coverage:file=<path-to-coverage-map>,diff=<git-ref>"
```

This is how "run only the tests affected by a code change" works — and it needs a **coverage map**: a YAML file mapping source files/globs to test IDs and tags. The reporter cannot know by itself which tests cover which code; the map provides that link, and the diff selects which of its entries are affected. Create the map with the `qa-test-code-coverage` skill (default `coverage.tests.yml`, one file serving both manual and automated tests).

- `file=` — path to the coverage map. May be absolute; it is read with `fs`, independent of the working directory.
- `diff=` — git ref to diff against; defaults to `master`. The reporter runs `git diff <ref> --name-only` **in `process.cwd()`** — launch it from inside the repo whose changes are being detected.
- Changed files are mapped through the YAML; the matching suite/test IDs and tags become the run's scope.
- Zero matching tests → no run is created (`No tests found.`); treat that as success in scripts and CI jobs.

#### Picking the diff base

- Changes on a branch → diff against its target branch (e.g. `origin/<default-branch>`). Full git history must be available (`fetch-depth: 0` or the CI's equivalent).
- After a merge the target branch equals `HEAD`, so diffing against it yields nothing — use the previous mainline tip: `HEAD~1` for squash merges, `HEAD^1` for merge commits.

### List matching tests without running (`--filter-list`)

`--filter-list` resolves a filter and prints the matching test IDs — nothing executes, no run is created. `--format` picks the encoding: `ids` (comma-separated, default), `grep` (alternation pattern), `json`, `newline`. Exit code 0 when at least one test matched, 1 when nothing did — scripts can branch on it:

```bash
GREP=$(npx @testomatio/reporter run --filter-list "coverage:file=<coverage-map>" --format grep)
[ -n "$GREP" ] && npx playwright test --grep "$GREP"
```

Cannot be combined with `--remote`.

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
- Works with every filter form — the resolved test ids are forwarded to the CI workflow as a grep pattern. No filter → no grep; the workflow runs its default scope, or a prepared run's stored scope from creation time. A fresh `--filter` at launch replaces the stored scope.
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

Wrap the runner and results report into the run as they come. Without a filter the whole suite runs; with one, the filter generates the grep the runner consumes:

```bash
TESTOMATIO_RUN=$RUN_ID npx @testomatio/reporter run "<runner command>" \
  --filter "testomatio:tag-name=<tag>"
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

`qa-test-code-coverage` (creates the coverage map the `coverage:` filter needs), `setup-pr-testing` (wires these commands into a CI pipeline), `qa-e2e-tests-reporting` (install and configure the reporter in an automation project).
