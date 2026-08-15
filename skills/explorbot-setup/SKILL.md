---
name: explorbot-setup
description: Install and configure Explorbot with the least setup that works, then prove it reaches the user's app. Use for first-time install, "set up explorbot", "configure explorbot", picking an AI provider, global vs local config, or when neither `~/.explorbot/config.js` nor a project `explorbot.config.js` exists. Installs globally by default — no project files. Ends when `explorbot navigate` exits 0, then hands off to `explorbot-fundamentals`. Runs the commands itself and asks the user only for provider, API key, app URL, and credentials.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# Explorbot Setup

Explorbot needs a provider key, a browser, and the app URL. Set them up globally, then prove the install with one navigation.

**Scope ends when `npx explorbot navigate <url>` exits `0`** — exploring and testing belong to [[explorbot-fundamentals]].

## Mode

| Mode | Use when | Config |
|---|---|---|
| Global (default) | almost always | `~/.explorbot/config.js` + `~/.explorbot/.env` |
| Env vars | CI, containers, nothing may be written | `EXPLORBOT_*`, see [references/env-mode.md](references/env-mode.md) |
| Project-local | config belongs in the repo: hooks, rules, custom dirs, generated tests in VCS | `explorbot.config.js`, see [references/project-setup.md](references/project-setup.md) |

Global mode writes nothing into the user's project — no `package.json`, no `npm i explorbot`, no provider packages, no config to hand-edit. Use it unless the user asks for a config in their repo.

## 1. Requirements

- Node ≥ 24 or Bun. If neither exists, stop — do not install a runtime.
- `npx playwright install chromium` — cached machine-wide in `~/.cache/ms-playwright`, so once per machine.
- Explorbot is for CRUD-heavy apps. Warn before installing if the target is a landing page, blog, CMS, or static site.

## 2. Global install

**Providers, models, and key variable names live in Explorbot, never in this skill.** `npx explorbot init --help` lists what `--provider` accepts; `init` picks the model ids from the version's `models.json` and reports the env variable it stored.

```bash
npx explorbot init --global --provider <name>
```

- Ask the user which provider they have an account with. If they have no preference, point them at `docs/basics/providers.md` in the [Explorbot docs](https://github.com/testomatio/explorbot/tree/main/docs).
- The global config holds models and keys, never a site — every command names the site it runs against.
- If init warns that a role has no recommended model, tell the user: that provider needs model ids filled in by hand, or a different provider.
- `--force` overwrites an existing global config and keeps the stored key.

The key: ask the user to paste it into `~/.explorbot/.env` in their editor and say "continue", then verify with `grep -q "^<KEY>=." ~/.explorbot/.env`. Use `--api-key <key>` only if they prefer it — say that it lands in shell history and the transcript.

`~/.explorbot/.env` is read on every run in every mode, without overriding variables already set. Provider keys and app credentials belong there.

## 3. App URL

Ask for it. Explain that Explorbot clicks, fills, and submits on its own, so staging beats production.

Do not guess it. Look for evidence in the project — `package.json` scripts, `.env` files, framework ports — and suggest what you find with its source. Otherwise ask in plain text. Never propose a URL from this skill or from memory.

How the site is named in global mode:

- Commands with a URL argument use it: `navigate`, `explore`, `plan`, `research`, `context`, `shell`, `freesail`, `docs collect`.
- Commands without one — `test`, `learn`, `knows`, `experience`, `compact` — need `EXPLORBOT_URL=<app-url>` in front.
- After the first run: `npx explorbot explore app.example.com/dashboard`, `npx explorbot sites`.

Artifacts live in `~/.explorbot/sites/<host>/`: `knowledge/`, `experience/`, `output/` (`reports/`, `plans/`, `states/`, `research/`, `tests/`, `explorbot.log`). Nothing lands in the working directory.

## 4. Verify

Walk the rungs in order. Stop at the first failure, fix it, resume.

1. `curl -sS -o /dev/null -w "%{http_code}\n" <url>` — `000` is DNS/VPN/wrong host, `5xx` is the app itself, `200` skips to rung 3.
2. `curl -sIL -o /dev/null -w "%{url_effective}\n" <url>` after a `3xx`/`401`/`403`. A login-looking final URL means credentials are needed: do rung 4 first.
3. `npx explorbot navigate <url> --session` — exit `0` ends setup. `--session` saves cookies to the site's `output/session.json`. On exit `1`, read `~/.explorbot/sites/<host>/output/explorbot.log`: an auth wall sends you to rung 4, anything else is a wrong path or a broken page.
4. Teach auth, knowledge first, values second:

   ```bash
   npx explorbot knows /login      # reuse existing variable names if auth knowledge exists
   npx explorbot learn "/login" 'Sign in with ${env.APP_USER} / ${env.APP_PASSWORD}'
   ```

   Name only the credentials — no selectors or DOM hints; the Navigator finds the fields. Then have the user add the two variables to `~/.explorbot/.env`, verify with `grep`, and repeat rung 3. Ask for a test account on a non-production environment.

   Still failing on auth: add one sentence to the knowledge with `learn` (real form URL, SSO, second factor), never a rewrite.

`npx explorbot context <url>` prints headings, matched knowledge, and interactive elements with no AI calls — use it to debug a rung for free.

## 5. Handoff

Report what exists: config and key paths, the site folder, the saved session. Then hand off to [[explorbot-fundamentals]] with a first command:

```bash
npx explorbot explore <url-of-a-crud-page> --max-tests 10
```

## Anti-patterns

- Naming providers, model ids, or key variables in conversation without reading them from `init --help` or `init` output.
- Running `npm i explorbot` or editing `package.json` before ruling out global mode.
- Reporting artifacts under `./output` in global mode.
- Putting secrets in knowledge files or config — always `${env.NAME}`, values in `.env`.
- Driving `explorbot start` — it is an interactive TUI; ask the user to run it.
- Asking upfront for target pages, features, or test counts.
