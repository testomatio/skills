# Testeiya pipelines

A pipeline runs several stages from one YAML file: agent tasks and shell commands like Explorbot or the Testomat.io reporter. A summary written by the `pipeline-report` skill is the only thing it posts.

## Pick one

- `npx testeiya@latest pipeline` lists the bundled pipelines.
- Pick by the user's goal: `pr-review`, `web-testing`, `api-testing`, `regression`.
- A flow none of them fits: copy the closest from the package's `pipelines/` into the repo, e.g. `.github/testeiya/<name>.yml`, and pass the path. Never into `.testeiya/`: it ignores itself in git.
- **Read the pipeline file before wiring it.** Its `gates:` list every variable, file and tool a stage needs; each stage names the ones it needs in `when:`. The format is in the testeiya package's `PIPELINES.md`.

## Wire the job

- One job runs `npx testeiya@latest pipeline <name|path>`. Never split its stages into separate jobs.
- Map each gate to the job: `env` gates → variables and secrets, `file` gates → files in the repo, `run` gates → an install step (e.g. `npx playwright install --with-deps chromium` for `browser`).
- A gate left unmet skips its stage with a message in the report. Say which stages that drops.
- Always set `TESTEIYA_MODEL` and a provider key. Without them the pipeline exits 2.
- Post with `-o gh:pr-comment` on GitHub. GitLab and Bitbucket post through `GITLAB_TOKEN` / `BITBUCKET_ACCESS_TOKEN`.
- Give each pipeline its own `--thread <name>` when several post to one pull request.
- Add `--exit-zero`, so a negative verdict never blocks a merge.
- Variables a pipeline reads, like `TEST_COMMAND` or `BASE_BRANCH`, go in with `--set KEY=VALUE` or the job's env.
- A condition only the job knows goes in as `--gate 'name:<shell check>'`. When it fails the run is skipped and exits 0. Use it instead of an `if … exit 0` block around the command.
- Look up what the job knows once, in a step before the run, and write it to `$GITHUB_ENV`. The gate, `--set` and `-o` then read the same variables:

```yaml
- run: |
    gh api "repos/$GITHUB_REPOSITORY/commits/$GITHUB_SHA/pulls" \
      --jq '.[0] // empty | "PR_NUMBER=\(.number)\nPR_TITLE=\(.title)"' >> "$GITHUB_ENV"
  env:
    GH_TOKEN: ${{ github.token }}
- run: |
    npx -y testeiya@latest pipeline regression \
      --gate 'pr:test -n "$PR_NUMBER"' \
      --set "TESTOMATIO_TITLE=PR #$PR_NUMBER $PR_TITLE" \
      -o "gh:pr#$PR_NUMBER"
```

## Keep rounds between pushes

- Cache `--dir` per pull request. A new commit then runs a new round that knows what changed and updates its comment; a re-run of a stopped job retries from the stage that stopped.
- GitHub: restore with the prefix, save with the run id, and save even when the job failed:

```yaml
- uses: actions/cache/restore@v4
  with:
    path: ${{ runner.temp }}/qa
    key: qa-<name>-pr-${{ github.event.number }}-${{ github.run_id }}
    restore-keys: qa-<name>-pr-${{ github.event.number }}-
- run: npx testeiya@latest pipeline <name> --dir ${{ runner.temp }}/qa --output gh:pr-comment --thread <name> --exit-zero
- uses: actions/cache/save@v4
  if: always()
  with:
    path: ${{ runner.temp }}/qa
    key: qa-<name>-pr-${{ github.event.number }}-${{ github.run_id }}-${{ github.run_attempt }}
```

- GitLab: `cache:` with `key: qa-<name>-mr-$CI_MERGE_REQUEST_IID`, `when: always`, and the `--dir` path inside the project.
- Checkout with full history: the pipeline diffs against the target branch and the last round's commit.

## Verify

- `npx testeiya@latest pipeline <name> --dry-run` with the job's variables shows every gate and which stages run. It spends nothing — run it before opening the PR.
