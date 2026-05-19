---
name: explorbot-fundamentals
description: Core operating reference for Explorbot — the autonomous AI web-testing CLI. Use this skill whenever the user runs or debugs Explorbot via the command line: choosing freesail/explore/test, any `explorbot` CLI command or flag, config sections, knowledge/rules/experience, the output/ artifacts, reporting, secure credentials, providers, or troubleshooting a failing run. Guide-only — present the exact commands/paths/config; the user runs them. For first-time install/config use `explorbot-setup`.
license: MIT
metadata:
  author: Testomat.io
  version: 0.0.1
---

# EXPLORBOT-FUNDAMENTALS: What I do

Explorbot explores a web app like a curious human — clicking, filling forms, finding bugs,
learning — with no test scripts. It drives its own browser via CodeceptJS → Playwright (no
MCP). Workflow: **research → plan → test → repeat**. It learns from experience and from the
knowledge you give it.

This skill is the operating reference: how to run and **debug** Explorbot from the command
line, what each config/dir/output does, and where to read deeper docs. **Guide-only** —
present commands and config; the user runs them. Do not edit files or run commands unless
explicitly asked.

## Execution mode: CLI only

**A coding agent can run Explorbot only through its non-interactive CLI commands** (e.g.
`explorbot explore`, `explorbot test`, `explorbot plan`, `explorbot research`). These run
headless and exit.

**`explorbot start` launches the interactive terminal UI (TUI). An agent cannot drive a
TUI — never attempt to launch or operate it.** TUI slash commands (`/explore`, `/plan`,
`/test`, `I.click(...)`, …) are for a human at the keyboard. If the user wants interactive
mode, tell them to run `explorbot start [path]` themselves; everything an agent does for them
uses the CLI equivalents below.

Before anything: check `explorbot.config.{js,mjs,ts}` exists (also `config/`, `src/config/`).
If none exists and the user wants to set up, defer to the **`explorbot-setup`** skill.

## Main testing flows — widest to narrowest

| Flow | Command | Scope | Notes |
| --- | --- | --- | --- |
| **freesail** | `explorbot freesail <path> --max-tests N` | Whole app, page by page, continuously | `--max-tests` required (it never stops on its own). `--deep` depth-first, `--shallow` breadth-first, `--scope /admin` to fence it |
| **explore** | `explorbot explore /page --max-tests N` | One area + its subpages: research → plan → test → exit | `--max-tests` required. `--focus <feature>`, `--dry-run`, `--configure` to reuse/mix plans |
| **test** | `explorbot test plan.md 1` | A single scenario from a plan | Narrowest. Author the plan with the `explorbot-plan` skill |

Pick the widest flow the user actually wants: freesail for unattended coverage, explore for a
section, test for one scenario. Always set `--max-tests` for freesail and explore.

`--configure` spec (semicolon pairs):
`new:0%-100%;from:<plan>;style:normal,psycho,curious;priority:critical,high;pick_by:priority|random|index;subpages:none|same|new|both`.
`explorbot test` index syntax: `1`, `1-5`, `1,3,7`, `*`/`all`, `"pattern"`.

## Other CLI commands

| Command | Purpose |
| --- | --- |
| `explorbot plan <path> [feature]` | Generate a test plan (AI explores the live page) |
| `explorbot plan:load <file> [i]` | Load a plan and list its tests (no run) |
| `explorbot research <url>` | Analyze a page, print the UI map |
| `explorbot drill <url>` | Drill components to learn interactions |
| `explorbot context <url>` | Print page snapshot (HTML/ARIA/data) |
| `explorbot learn [url] [desc]` | Add knowledge |
| `explorbot knows [url]` | List/show knowledge |
| `explorbot experience [filter] [i]` | Inspect learned experience |
| `explorbot rerun <file> [i]` | Re-run generated tests with AI healing |
| `explorbot runs [file]` | List generated tests / dry-run a file |
| `explorbot extract-rules <agent>` | Scaffold editable agent rules / planner styles |
| `explorbot browser start\|stop\|status` | Manage a persistent browser server |

Common flags (all CLI): `-v, --verbose` / `--debug`, `-c, --config <path>`,
`-p, --path <dir>`, `-s, --show` / `--headless`, `--incognito` (no experience),
`--session [file]` (persist cookies/localStorage; default `output/session.json`).

## Credentials & secrets — never hardcode

All secrets load from the environment (`.env` or the shell), never literals in config or
knowledge:

| Secret | How |
| --- | --- |
| AI provider API key | `.env` (`OPENROUTER_API_KEY` / `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `GROQ_API_KEY` / `CEREBRAS_API_KEY`); referenced as `process.env.X` in `explorbot.config.js` |
| App / user login | Knowledge file body using `${env.USER}` / `${env.PASSWORD}`; real values in `.env`. Or `--session` to log in once and reuse cookies |
| Testomat.io | `TESTOMATIO=<key>` env (plus `TESTOMATIO_TITLE/_ENV/_SHARED_RUN/_RUNGROUP_TITLE`) |
| Langfuse | `.env` `LANGFUSE_PUBLIC_KEY` / `LANGFUSE_SECRET_KEY` (`LANGFUSE_BASE_URL` if self-hosted) |

Confirm `.env` is git-ignored. In knowledge/config interpolate `${env.X}` / `${config.a.b}`;
do not paste raw credentials.

## Teaching Explorbot — knowledge, rules, experience

| Dir | Who writes | What |
| --- | --- | --- |
| `./knowledge/` | You | Credentials, form rules, nav quirks. MD + YAML frontmatter: `url:` (pattern: `/exact`, `/path/*`, `*`, `^regex$`, `~contains`), `wait:`, `waitForElement:`, `code:` (CodeceptJS, `await tryTo/retryTo/within`), `statePush:`. Interpolate `${env.X}`, `${config.a.b}`. Add via `explorbot learn`. See `docs/knowledge.md` |
| `./rules/<agent>/` | You | Per-agent instructions; `rules/planner/styles/*.md` planning styles. Wire via `ai.agents.<a>.rules: ['name', {'/path/*':'name'}]`. Scaffold: `explorbot extract-rules <agent>`. See `docs/configuration.md` |
| `./experience/` | Explorbot | Memory layer - Auto-saved working locators/flows (FLOW/ACTION blocks + `related:` URLs). Inspect via `explorbot experience` |

Planning styles cycle `normal → psycho → curious` (outcome strength: data-change >
state-change > UI-only). Reorder via `ai.agents.planner.styles`; add custom styles under
`rules/planner/styles/`. See `docs/planner.md`.

## output/ — what you get

| Path | Contents |
| --- | --- |
| `output/explorbot.log` | **Always-on activity log — start debugging here** |
| `output/plans/*.md` | Generated test plans |
| `output/tests/*.spec.ts` \| `*.js` | Runnable Playwright / CodeceptJS tests (commit to CI) |
| `output/reports/<mode>-<session>.html` | HTML report (always created) |
| `output/reports/<mode>-<session>.md` | Analyst session report (defects clustered by root cause) |
| `output/reports/<mode>-<session>-tests.md` | Per-test markdown (when `reporter.markdown`) |
| `output/research/<hash>.{html,aria.yaml,png}` | What Researcher saw |
| `output/states/`, `states/rerun_<ts>/` | Per-step snapshots; rerun `trace.md` + aria/html/png/console |
| `output/screencasts/*.webm` | Per-scenario video (when `historian.screencast`) |
| `output/requests/` | API request/response logs |
| `output/session.json` | Saved cookies/localStorage for `--session` |

Dirs relocatable via `dirs: { knowledge, experience, output }`.

## Reporting & generated code

- HTML report and the Analyst markdown are written every run under `output/reports/`.
- **Recommended:** `reporter: { enabled: true, html: true, markdown: true }` → adds per-test
  `…-tests.md`.
- Runnable code: `ai.agents.historian.framework: 'playwright' | 'codeceptjs'` →
  `output/tests/`. **Recommended:** `ai.agents.historian.screencast: true` (or
  `{ size, quality }`) → `.webm` per scenario.
- Testomat.io cloud via `TESTOMATIO` env or `reporter.enabled`; group with
  `reporter.runGroup`. See `docs/reporting.md`. Rerun/healing tuning:
  `ai.agents.rerunner.{healLimit,healMaxIterations,recipes}`, `docs/rerun.md`.
- API testing: `api: { baseEndpoint, spec, headers, bootstrap, teardown }`;
  `explorbot api plan|test|explore`. See `docs/api-testing.md`.

## Troubleshooting — work the ladder in order

**1 · Check the basics first.**
- Playwright browsers installed (`npx playwright install`).
- Target site reachable from this machine (try the URL in a normal browser).
- AI reachable: provider key set in `.env`, model resolves. The error
  `AI model is not configured. Set ai.model in your config file.` means key/model missing;
  `Missing required configuration: web.url or playwright.url` means no base URL;
  `No configuration file found...` → run `explorbot-setup`. For
  `Playwright output is not compatible with this Playwright version...` set
  `ai.agents.historian.framework: 'codeceptjs'`.

**2 · Read the logs.** Everything is on disk under `output/` — start with
`output/explorbot.log` (always-on). Then the relevant artifact: `output/reports/<mode>-*.md`
(defects clustered), `output/research/<hash>.*` (what Researcher saw — for wrong-element /
poor-plan issues), `output/states/rerun_<ts>/trace.md` + `*_screenshot.png` (rerun
regressions). Re-run the failing command with `-v/--verbose` (or `DEBUG=explorbot:*`, or a
namespace like `DEBUG=explorbot:tester,explorbot:navigator`) for more detail. Hanging? Check
the last `explorbot.log` timestamp and `explorbot browser status`.

**3 · Detailed debugging via Langfuse.** Prompt-level and agent-flow inspection (what each
agent saw and decided) requires **Langfuse installed and configured** (`LANGFUSE_PUBLIC_KEY`
/ `LANGFUSE_SECRET_KEY` in `.env`, or `ai.langfuse`). Then open the failed `tester.loop`
trace, export it, and analyze it with the `explorbot-debug` Claude skill. Without Langfuse
configured this depth of debugging is not available — recommend enabling it. See
`docs/observability.md`.

## Where to read more (docs/)

In the installed package / repo `docs/`: `commands.md` · `configuration.md` (config+rules) ·
`knowledge.md` · `planner.md` · `reporting.md` · `rerun.md` · `observability.md` (Langfuse) ·
`providers.md` (AI providers) · `agents.md` · `page-interaction.md` · `prerequisites.md` ·
`api-testing.md` · `automated-tests.md` · `scripting.md` (programmatic API) · `hooks.md`.
