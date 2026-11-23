---
name: qa-run-report
description: Turn a test run into a shareable report presentation — failures first, passed tests linked to their test cases, diagrams, steps and descriptions, exportable as HTML, CSV or PDF. Use when the user asks to present run results, build a report from a run, show what failed or passed with their test cases, or export run results to CSV or PDF.
license: MIT
metadata:
  author: Testomat.io
  version: 0.1.0
---

# QA Run Report

Build a report presentation for a Testomat.io run, focused on what the reader needs now.

## Fetch data

- Accept a run ID, run URL or an existing Markdown report.
- `TESTOMATIO` env var holds the project key; `TESTOMATIO_URL` is needed for domains other than app.testomat.io.
- Store pulled data in `.testeiya/run-reports/<run>/`.
- Run `npx @testomatio/reporter@latest fetch <command> --help` before using other options.

```bash
npx @testomatio/reporter@latest fetch status <run> --format json > status.json
npx @testomatio/reporter@latest fetch count <run> > count.txt
npx @testomatio/reporter@latest fetch report <run> --only-failed --stack --all > failed.md
npx @testomatio/reporter@latest fetch report <run> --only passed --all > passed.md
```

- Warn when the run is not finished.
- Add `--artifacts --out <dir>` only for tests shown in detail; artifacts need `S3_*` access.
- Test case description and steps: local test case Markdown files if present, otherwise Testomat.io MCP `tests_get` by the result's test ID.
- **Never invent results, steps or links.** A result without a matching test case is shown as "no linked test case".

## Ask for focus

Ask what the report should focus on; preselect the default from the data:

1. 🔴 Detailed failures — error, failing step, screenshot, linked test case.
2. 📋 Tests ↔ test cases table — every result with its test case, suite, tags, status.
3. 📝 Test descriptions — test case description and steps next to each result.
4. 📊 Summary — totals, pass rate, by suite and environment.

- Failures exist → default to 1 + 4.
- No failures → default to 2 + 3.
- The user may pick several; sections follow the order above.

## Failures

- **Failures first, always.**
- Cluster, classify and rate severity the way `analyze-run-report` does; reuse its output when it already exists for this run.
- Over ~50 failures → each cluster with 3 example tests; the full list goes to CSV.

## Passed tests

- Over ~200 passed → group by suite with counts; detailed rows only for suites the user names.
- Link each result to its test case in Testomat.io.

## Diagrams

- When the environment renders charts: status pie, failures by cluster, suite → test → test case link graph.

## Output

- Default: one self-contained HTML file `report-<run-title>-<YYYY-MM-DD>.html` in the current folder.
- Start with the full run URL.
- CSV: one row per result — test, test case, suite, status, error message, steps, run link.
- PDF: print the HTML with a headless browser available in the environment; none available → hand over the HTML and say so.
- Ask which exports the user wants after the HTML is ready.
- Redact secrets and PII.
