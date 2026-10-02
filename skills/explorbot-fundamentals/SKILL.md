---
name: explorbot-fundamentals
description: Use when running or debugging Explorbot from the command line — which command to run, what a flag does, where results were written, why a run failed, or how to run it with nothing installed in the project.
license: MIT
metadata:
  author: Testomat.io
  version: 1.3.0
---

# Explorbot Fundamentals

Explorbot is an autonomous AI web-testing CLI. It drives its own browser through cycles of research → plan → test, and an agent drives it like `git` or `npm`.

**Answer command and flag questions from the installed CLI, never from memory.**

```bash
npx explorbot --help                  # commands, and the EXPLORBOT_* variables
npx explorbot <command> --help        # flags for one command
```

## Running it with nothing installed

Explorbot needs no project install: `npx` plus a provider is enough, and nothing is written into the working directory. Reach for this when the user wants to try Explorbot, or is pointing it at an app that has no repo here.

```bash
npx explorbot init --global --provider <name>          # once per machine, key in ~/.explorbot/.env
npx explorbot explore https://app.example.com/login --max-tests 3
```

Details, including the per-command `EXPLORBOT_*` form for CI: [references/no-install.md](references/no-install.md).

Installing into the project instead — config, knowledge, and generated tests in the repo — is [[explorbot-setup]].

## What a run needs

Explorbot does not bring these itself. Check them before the first command on any new machine or CI runner:

- **A browser.** `npx playwright install --with-deps chromium`. Without it every command that opens a page fails.
- **A provider key** in the environment, and a provider chosen by config or `EXPLORBOT_AI_PROVIDER`.
- **A known output folder** when something must collect the report. Set `EXPLORBOT_OUTPUT`; without a project config the default is `~/.explorbot/sites/<host>/`, not the working directory.

CI recipes for each platform: `docs/workflow/ci.md`.

## Knowledge for one run

Login details and one-off facts go in per-run knowledge. Nothing is saved to the repo. Two channels, pick one:

- `--knowledge '<markdown>'` — repeatable. Plain text applies to every page. To scope it, start the text with a real frontmatter block:

  ```markdown
  ---
  url: /users/sign_in
  ---
  Sign in as ${env.LOGIN_EMAIL} / ${env.LOGIN_PASSWORD}
  ```

- `EXPLORBOT_KNOWLEDGE` — plain text only, always every page. Frontmatter inside it is not read. For scoped knowledge from the environment use `EXPLORBOT_KNOWLEDGE_FILE`.

Rules:

- A `url:` line without the `---` fences is body text, not a scope.
- Scope keys are `url:` for pages and `endpoint:` for the API boat.
- `${env.NAME}` is resolved by Explorbot, so secrets stay out of the text.
- Never set the variable and pass the same text through the flag. It is applied twice.

Format and URL patterns: `docs/workflow/knowledge.md`.

## Docs

`node_modules/explorbot/docs/` after a local install, the repo's `docs/` when working inside Explorbot itself, otherwise `https://raw.githubusercontent.com/testomatio/explorbot/main/docs/<path>`. `docs/index.json` lists every page with a description — read it to pick the page, then open that page.

## Where results land

Explorbot writes into the project directory when the run used a project `explorbot.config.js`, and into `~/.explorbot/sites/<host>/` otherwise. Under that root:

| Path | Contents |
|---|---|
| `output/reports/` | session report: coverage, defects, execution issues |
| `output/plans/` | the plan generated or executed |
| `output/states/` | per-state HTML, ARIA snapshots, screenshots |
| `output/research/` | UI maps from the Researcher |
| `output/tests/` | generated Playwright / CodeceptJS files |
| `output/explorbot.log` | run log — start here on a failure |
| `knowledge/`, `experience/` | what you taught it, and what it learned |

**Reporting is `@testomatio/reporter`.** Explorbot runs it inside and hands it every reporter variable, so `TESTOMATIO` sends the run to that Testomat.io project and the reporter's PR token posts the result to the open pull or merge request. Nothing else to wire. Variables: `testomatio-reporter` skill, or `docs/workflow/reporting.md`.

**Exit codes are not pass/fail.** `explore` and `test` exit `0` whenever the session completes; a failing scenario is a result, not a crash. Read the report. `navigate` is the exception — `1` means unreachable, which makes it a pre-flight check.

## Naming the site

A target is either **absolute** — starting with `http://` or `https://` — or a **relative path** starting with `/`. Anything else is ambiguous and not a valid target.

A relative path needs a site to resolve against: `web.url` from a project config, or `EXPLORBOT_URL`. Without either, pass the absolute URL. Commands that take no target at all — `test`, `learn`, `knows`, `experience`, `compact` — read the same two sources. `npx explorbot sites` lists what has been explored so far.

## Cheap before expensive

- `npx explorbot context <url>` — headings, matched knowledge, interactive elements. No AI calls.
- `npx explorbot shell <url> '<codecept command>'` — run one command and exit.
- `npx explorbot knows <url>` — what knowledge matches a page.
- `npx explorbot navigate <url> --session` — reachability, and it saves the session.

## Rules

- `explorbot start` is an interactive TUI — an agent cannot operate it. Ask the user to run it. Everything else runs headless and exits.
- If `--help` does not show a command or flag, it does not exist.
- Explorbot needs CRUD; a landing page, blog, or CMS is out of scope.

## Related skills

- [[explorbot-setup]] — install into a project: config, provider, login knowledge, verified navigation.
- [[explorbot-plan]] — hand-author a test plan and run it with `explorbot test`.
