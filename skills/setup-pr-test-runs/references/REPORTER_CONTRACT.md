# Reporter Contract — creating a run per PR

How `@testomatio/reporter` consumes the coverage map and creates a run without executing anything. CI-independent — the CI config wraps these commands. Every value in angle brackets is a placeholder. Launch-side commands (`run --remote`, inline, cross-repo) live in the `run-affected-tests-in-ci` skill.

## 1. The coverage filter

```
--filter "coverage:file=<path-to-coverage-map>,diff=<git-ref>"
```

- `file=` — path to the coverage map (default `coverage.tests.yml`, produced by `qa-test-code-coverage`). May be absolute; it is read with `fs`, independent of the working directory.
- `diff=` — git ref to diff against; defaults to `master` if omitted. The reporter runs `git diff <ref> --name-only` **in `process.cwd()`** — it must be launched from inside the repo whose changes are being detected.
- The changed files are mapped through the YAML; the matching suite/test IDs and tags become the run's scope.
- A filter resolving to zero tests creates no run (`No tests found.`) — the CI job must treat that as success.

## 2. Diff base

- PR jobs diff against the PR's target branch (e.g. `origin/<default-branch>`).
- Checkout with full history (`fetch-depth: 0` or the CI's equivalent) so the ref resolves.
- The diff base is computed where the job runs; confirm the repo history is available there.

## 3. Creating the run

Required env: `TESTOMATIO` (project API key), `TESTOMATIO_TITLE` (PR-based, identical across all phases, e.g. `PR <number>: <title>`), `TESTOMATIO_RUNGROUP_TITLE`. `TESTOMATIO_ENV` optional.

One `start` call creates one run covering both kinds. Its manual cases are immediately pending for testers; its automated part stays scheduled until launched. `--format id` prints only the run id to stdout (banner and logs go to stderr), so capture is clean:

```bash
RUN_ID=$(npx @testomatio/reporter start --kind mixed \
  --filter "coverage:file=<coverage-map>,diff=<target-branch>" --format id)
```

### The `--kind` rule

The flag follows which kinds of tests the project has:

| Project tests      | Flag            | Launched later?                      |
| ------------------ | --------------- | ------------------------------------ |
| manual + automated | `--kind mixed`  | yes — the automated part             |
| manual only        | `--kind manual` | no — the run is complete at creation |
| automated only     | *(no flag)*     | yes — the whole run                  |

The stored scope is a snapshot of the diff at creation time; a launch may pass a fresh `--filter` to replace it.

## 4. Carrying `RUN_ID` to the launch phases

A later launch (see `run-affected-tests-in-ci`) needs the run id created here.

- **Preferred: the CI's native value-passing mechanism** — artifact, pipeline variable, workflow output, whatever the CI at hand provides. A direct id has no expiry.
- **Fallback: shared-run title matching.** Set on both the create and launch calls:
  - `TESTOMATIO_SHARED_RUN=1` — report/launch into the run matching `TESTOMATIO_TITLE` instead of creating a new one;
  - `TESTOMATIO_TITLE` — the match key, must be identical on both sides;
  - `TESTOMATIO_SHARED_RUN_TIMEOUT` — minutes the title stays matchable, **default 20**. A PR stays open for days — size it to the PR's expected lifetime or the launch will create a fresh run instead.

## 5. Secrets naming

- Store each project's API key as `TESTOMATIO_<project_slug>` in the CI's secret store — collision-free across projects and org-level stores.
- Map it to the plain `TESTOMATIO` env var at job level; the reporter only reads `TESTOMATIO`.
