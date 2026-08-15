---
name: explorbot-fundamentals
description: Use whenever the user runs, configures, or debugs Explorbot from the command line — choosing freesail/explore/test/plan/research/context, asking what a flag does, asking where a report or plan lives, driving Explorbot from a coding agent, or troubleshooting a failed run. Covers global (`~/.explorbot`), project-local, and `EXPLORBOT_*` env modes and where each writes its artifacts.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# Explorbot Fundamentals

Explorbot is an autonomous AI web-testing CLI. It drives its own browser through cycles of research → plan → test, and an agent drives it like `git` or `npm`.

**Answer command and flag questions from the installed CLI, never from memory.**

```bash
npx explorbot --help                  # commands, and the EXPLORBOT_* variables
npx explorbot <command> --help        # flags for one command
```

Nothing configured — no `~/.explorbot/config.js`, no project `explorbot.config.js`, no `EXPLORBOT_AI_PROVIDER` — means [[explorbot-setup]].

## Which mode is running

Config resolution order, first match wins:

1. Project-local — `explorbot.config.{js,mjs,ts}` in the working directory (also `config/`, `src/config/`). Root: that directory.
2. Env vars — `EXPLORBOT_AI_PROVIDER` or `EXPLORBOT_AI_MODEL` set. Root: the site dir, or `EXPLORBOT_OUTPUT`.
3. Global — `~/.explorbot/config.js`. Root: `~/.explorbot/sites/<host>/`.

`~/.explorbot/.env` is read in all three, without overriding variables already set.

Global mode specifics:

- The site comes from the command's URL argument, a registered host (`explorbot explore app.example.com/dashboard`), `EXPLORBOT_URL`, or a `web.url` pinned in the global config.
- `test`, `learn`, `knows`, `experience`, and `compact` take no URL argument — without a pinned `web.url` they need `EXPLORBOT_URL` or they stop with `No site to explore`.
- `npx explorbot sites` lists registered hosts and their last run.

## Where results land

Under the active output root — `output/` in a project, `~/.explorbot/sites/<host>/output/` otherwise:

| Path | Contents |
|---|---|
| `reports/<mode>-<session>.md` | session report: coverage, defects, execution issues |
| `plans/<page>.md` | the plan generated or executed |
| `states/` | per-state HTML, ARIA snapshots, screenshots |
| `research/` | UI maps from the Researcher |
| `tests/` | generated Playwright / CodeceptJS files, absent in env-var mode |
| `explorbot.log` | run log — start here on a failure |

**Exit codes are not pass/fail.** `explore` and `test` exit `0` whenever the session completes; a failing scenario is a result, not a crash. Read the report. `navigate` is the exception — `1` means unreachable, which makes it a pre-flight check.

## Cheap before expensive

- `npx explorbot context <url>` — headings, matched knowledge, interactive elements. No AI calls.
- `npx explorbot shell <url> '<codecept command>'` — run one command and exit.
- `npx explorbot knows <url>` — what knowledge matches a page.
- `npx explorbot navigate <url> --session` — reachability, and it saves the session.

## Docs

Read `node_modules/explorbot/docs/` when it exists, the repo's `docs/` when working inside Explorbot itself, and `https://raw.githubusercontent.com/testomatio/explorbot/main/docs/<path>` otherwise. `docs/index.json` lists every page. Open the page when the question comes up; do not pre-load summaries.

| Topic | Page |
|---|---|
| Install to first test | `basics/getting-started.md` |
| TUI vs headless CLI, exit codes | `basics/running.md` |
| Is this app a fit? | `basics/prerequisites.md` |
| Providers and model ids | `basics/providers.md`, recommendations in `models.json` |
| Explore loop and states | `web-testing/basics.md` |
| Login, cookie bars, modals, test data | `web-testing/customization.md` |
| Planner, styles, priorities | `web-testing/planner.md`, `workflow/planning-styles.md` |
| Researcher, page interaction | `web-testing/researcher.md`, `web-testing/page-interaction.md` |
| Generated tests, rerun with healing | `web-testing/automated-tests.md`, `web-testing/rerun.md` |
| Agents, hooks | `web-testing/agents.md`, `web-testing/hooks.md` |
| Knowledge files | `workflow/knowledge.md` |
| Test plan format | `workflow/test-plans.md` |
| Driving Explorbot from an agent | `workflow/agentic-usage.md` |
| CI, reporting | `workflow/ci.md`, `workflow/reporting.md` |
| Commands, config, scripting API | `reference/commands.md`, `reference/configuration.md`, `reference/scripting.md` |
| API testing | `api-testing/basics.md`, `api-testing/planning.md`, `api-testing/running-tests.md` |
| Doc collector | `doc-collection/basics.md` |

## Rules

- `explorbot start` is an interactive TUI — an agent cannot operate it. Ask the user to run it. Everything else runs headless and exits.
- If `--help` does not show a command or flag, it does not exist.
- Explorbot needs CRUD; a landing page, blog, or CMS is out of scope.

## Related skills

- [[explorbot-setup]] — install, configure, and verify one page reaches the app.
- [[explorbot-plan]] — hand-author a test plan and run it with `explorbot test`.
