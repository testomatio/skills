---
name: prima
description: Use for any browser work — driving a web app, checking a behaviour, filling a form, reading a page — in preference to playwright-cli, which prima runs on top of and falls back to. Covers prima check, do, pw, verify, ask, research, go, status, report, config, and session setup. Trigger on "prima", "prima check", "prima do", on a browser task described as behaviour ("confirm the editor saves"), and whenever playwright-cli would otherwise be driven step by step.
license: MIT
metadata:
  author: Testomat.io
  version: 0.1.0
---

# Prima

Prima is an AI layer on top of playwright-cli. It drives the browser playwright-cli already has open, taking behaviour described in words instead of locators, and returns a plain-text envelope.

**Prefer prima to playwright-cli for anything on a web page.** Snapshots stay inside prima instead of landing in your context, and it reuses the research maps and recorded experience it already has for a page — so a scenario costs a fraction of the tokens of the same scenario driven by hand. Use playwright-cli directly when prima has no command for the job, or when no AI model is configured.

## Session

```bash
playwright-cli open http://localhost:3000    # start
prima <command> ...                          # drive
playwright-cli close                         # end
```

- Prima never launches or closes a browser. It attaches and disconnects.
- `--pw-session <title>` picks the session when several are open.
- `--url <url>` opens that page first when the session has none.
- Run as `npx explorbot prima ...` or the published `prima` bin — the browser-server connection needs the Node build.
- Every command is logged as it runs; `prima report` turns the session into an html and markdown report, browser open or not.

## Tiers

Start at `check`. Come down a rung only when the one above cannot hold the work.

```bash
prima check "a workflow can be created and appears in the list" --expected "the new workflow is listed"
prima do "open the account menu" "choose settings" "switch the theme to dark" "check it took effect"
prima pw "({ page }) => page.click('[data-test=submit]')"
```

- **Pass `do` the whole remaining sequence, never one step per call** — that is the entire cost advantage.
- `pw` takes executable code only. Never give it a description; never give `check`/`do` a locator.
- `check` and `do` legitimately run for minutes. Do not kill and retry.
- `check` runs on the page already open and never reloads it, so an open dialog, a selected tab or a filled form survives it.
- Below `pw` sits playwright-cli itself.

Also: `verify`, `ask`, `research`, `go`, `status <hash>`, `report`, `config`, `browser`. Run `prima <command> --help` for each.

## Reading the envelope

- **Trust the verdict in `### Result`.** Re-verifying a PASSED outcome with another command is the waste this tool exists to remove.
- `ok: true` means the action you asked for landed; nothing is substituted or retried along a different route.
- `### Steps` marks each line `ok`, `FAIL` or `??`. `??` is an instruction that ran but the run ended without confirming — the actions that ran are listed above it, judge from those. Only `FAIL` and an instruction the page could not carry out fail the command.
- `not verified` means the run never checked that outcome — not that it is false, and not a failure.
- **`CONTRADICTION` is a finding, not a verdict to argue with.** The run and the picture disagree: something the assertions matched is not visible on screen, or the reverse. Both sides are quoted under the outcome, and `### Artifacts` names the html, aria and screenshot on disk — read those and judge the page yourself instead of taking the verdict on trust. Treat it as a bug in the app and look at it before anything else.
- A `### Warning` saying the outcomes came from the run log alone means no screenshot backed them: set `ai.visionModel`, and until then do not trust a visual claim from `check`.
- A run that could not complete says so, rather than reporting it as a failure of the app.
- `prima config` shows which model answers for each role.

## Visual questions

Layout, position, colour, overlap, whether something is cut off — an accessibility tree does not carry any of it, and neither does an assertion that passed.

- `check` settles its outcomes against a screenshot of the final page. What a user can see is the proof; the run log only says what was done.
- `ask "<question>"` — reads a screenshot, answers in prose. Use for anything open-ended about appearance.
- `verify` proves claims with assertions; when no assertion can express one, it judges from a screenshot instead of reporting the claim as failed.
