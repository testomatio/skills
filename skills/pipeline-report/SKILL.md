---
name: pipeline-report
description: Write the final report of a finished testeiya pipeline — one summary of every stage's results for a pull request comment or a team. Use when a task names a pipeline folder with pipeline.json and stage reports and asks for the pipeline's final report.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# Pipeline Report

Turn the results of every pipeline stage into one report a reviewer reads in a minute.

## Read

- `pipeline.json` first: the round, each stage with its status and reason, the pipeline's verdict.
- Each stage's report (`<id>.md`). Read logs (`<id>.log`) and output folders only to back a finding.

## Write

- Open with the verdict and one line on why.
- On a later round, next say what changed since your last report: fixed, new, still open.
- Then what needs a human: real defects, risky changes, cases to check by hand. Most important first.
- One line per stage: what it did, or why it was skipped.
- A skipped stage keeps its message word for word, so the reader knows what to set up.
- A stage that broke or timed out: say where it stopped and that a re-run on the same commit picks up from there.
- Link to files and test ids. Never paste a whole log or report.

## Rules

- **The verdict is given. Explain it, never change it.** Do not call a result tool to set one.
- Report only what a stage found. Never add findings of your own.
- No section without content. A clean run is a short report.
