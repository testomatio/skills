# Reporter Contract — prepared runs, launches, info API, pipes

How `@testomatio/reporter` consumes the coverage map, creates runs without executing them, launches a prepared run later, and posts PR comments. CI-independent — the CI config wraps these commands. Every value in angle brackets is a placeholder.

## 1. The coverage filter

```
--filter "coverage:file=<path-to-coverage-map>,diff=<git-ref>"
```

- `file=` — path to the coverage map (default `coverage.tests.yml`, produced by `qa-test-code-coverage`). May be absolute; it is read with `fs`, independent of the working directory.
- `diff=` — git ref to diff against; defaults to `master` if omitted. The reporter runs `git diff <ref> --name-only` **in `process.cwd()`** — it must be launched from inside the repo whose changes are being detected.
- The changed files are mapped through the YAML; the matching suite/test IDs and tags become the run's scope.
- One mixed map serves both kinds; the `--kind` flag on the command decides the run type (`--kind manual`, `--kind mixed`, or no flag for automated).
- A filter resolving to zero tests creates no run (`No tests found.`) — the CI job must treat that as success.

## 2. Diff base rules

- **PR jobs** — diff against the PR's target branch (e.g. `origin/<default-branch>`). Checkout with full history (`fetch-depth: 0` or the CI's equivalent) so the ref resolves.
- **Post-merge jobs** — the target branch now equals `HEAD`, so diffing against it yields nothing. Use the previous mainline tip instead: `HEAD~1` for squash merges, `HEAD^1` for merge commits.
- The diff base is computed where the job runs; confirm the repo history is available there.

## 3. PR opened — create the runs

Required env on every call: `TESTOMATIO` (project API key), `TESTOMATIO_TITLE` (PR-based, identical across all phases, e.g. `PR <number>: <title>`), `TESTOMATIO_RUNGROUP_TITLE`. `TESTOMATIO_ENV` optional.

**Manual run — pending, complete at creation.** No runner; the affected manual cases wait for testers:

```bash
npx @testomatio/reporter start --kind manual \
  --filter "coverage:file=<coverage-map>,diff=<target-branch>"
```

**Automated run — scheduled, not executed.** `start` creates the run scoped to the affected tests and returns its id. `--format id` prints only the run id to stdout (banner and logs go to stderr), so capture is clean:

```bash
RUN_ID=$(npx @testomatio/reporter start \
  --filter "coverage:file=<coverage-map>,diff=<target-branch>" --format id)
```

The stored scope is a snapshot of the diff at creation time; a fresh `--filter` at launch (§5) replaces it.

## 4. Carrying `RUN_ID` between pipelines

The launch phases need the run id created at PR open.

- **Preferred: the CI's native value-passing mechanism** — artifact, pipeline variable, workflow output, whatever the CI at hand provides. A direct id has no expiry.
- **Fallback: shared-run title matching.** Set on both the create and launch calls:
  - `TESTOMATIO_SHARED_RUN=1` — report/launch into the run matching `TESTOMATIO_TITLE` instead of creating a new one;
  - `TESTOMATIO_TITLE` — the match key, must be identical on both sides;
  - `TESTOMATIO_SHARED_RUN_TIMEOUT` — minutes the title stays matchable, **default 20**. A PR stays open for days — size it to the PR's expected lifetime or the launch will create a fresh run instead.

## 5. Launching a prepared run (`run --remote`)

`--remote <profile-name>` asks Testomat.io to dispatch a CI profile configured on the project (Settings → CI) instead of executing tests locally. With `TESTOMATIO_RUN` pointing at the prepared run, no new run is created — the named profile is triggered for the existing one:

```bash
TESTOMATIO_RUN=$RUN_ID npx @testomatio/reporter run --remote <profile-name> \
  --filter "coverage:file=<coverage-map>,diff=<post-merge-base>"
```

- With no `--filter` at launch, the server greps the run's stored scope from creation time. Passing a fresh `--filter` overrides it — this is how the final merged diff decides what actually runs.
- `--remote-param <key>=<value>` forwards a parameter to the CI profile config (repeat for several) — the carrier for a preview URL or target branch.
- Guards: requires `TESTOMATIO` (exits 1 otherwise); cannot combine with `--filter-list`; any positional command is ignored with a warning; a missing profile surfaces as `CI launch failed: <message>` and exit 1.
- Keep the launch job non-blocking — it observes the change, it does not gate the merge or release.

## 6. Inline and cross-repo execution

**Inline — the suite runs in this pipeline.** Wrap the runner; the filter generates the grep the runner consumes:

```bash
TESTOMATIO_RUN=$RUN_ID npx @testomatio/reporter run "<runner command>" \
  --filter "coverage:file=<coverage-map>,diff=<git-ref>"
```

For a preview launch, point the project's own base-URL env var at the preview before the runner starts.

**Cross-repo — the suite lives in another repo.** Trigger that repo's pipeline with the CI's native cross-pipeline mechanism and pass `TESTOMATIO_RUN` (plus `TESTOMATIO` and the title env) into it, so its reporter lands results in the prepared run instead of creating a new one.

## 7. Project info API

Read-only; the one network call permitted while authoring the pipeline:

```bash
curl -s -H "Authorization: Bearer $TESTOMATIO" \
  "https://app.testomat.io/api/v2/<project-id>/info"
```

Self-hosted instances replace the host with the instance URL. Relevant `data` fields:

| Field                       | Use                                                                                        |
| --------------------------- | ------------------------------------------------------------------------------------------ |
| `project_id`                | the project slug — names the CI secret `TESTOMATIO_<project_slug>`                         |
| `ci_profiles[].profile_name`| the value `--remote` takes                                                                 |
| `ci_profiles[].service`     | which CI the profile dispatches — match against the e2e suite's home                       |
| `ci_profiles[].pass_run_id` | confirms the dispatched workflow receives the run id and reports into the prepared run     |
| `environments`              | candidates for `TESTOMATIO_ENV`                                                            |

Empty `ci_profiles` → remote launch needs a profile created in Testomat.io first (Settings → CI).

## 8. PR comments — reporter pipes only

The reporter posts and updates the PR/MR summary comment itself when results report. Enable the pipe matching the platform by provisioning its token — never script a comment API call in CI config:

| Platform  | Env var to set           | Note                                                  |
| --------- | ------------------------ | ----------------------------------------------------- |
| GitHub    | `GH_PAT`                 | the workflow's built-in token works inside PR runs    |
| GitLab    | `GITLAB_PAT`             | personal or project access token with `api` scope     |
| Bitbucket | `BITBUCKET_ACCESS_TOKEN` | repository access token stored as a repo variable     |

No pipe exists for the platform (e.g. Azure DevOps) → no PR comment; results remain visible in Testomat.io.

## 9. Secrets naming

- Store each project's API key as `TESTOMATIO_<project_slug>` in the CI's secret store — collision-free across projects and org-level stores.
- Map it to the plain `TESTOMATIO` env var at job level; the reporter only reads `TESTOMATIO`.
- The pipe token (§8) is a second, separate secret.
