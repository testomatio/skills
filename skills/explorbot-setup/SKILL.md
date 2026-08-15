---
name: explorbot-setup
description: Use to install and configure Explorbot for an app — first-time setup, connecting an AI provider, choosing where the config lives, teaching it how to log in, or when a command fails because nothing is configured. Ends once `explorbot navigate` reaches the app.
license: MIT
metadata:
  author: Testomat.io
  version: 1.1.0
---

# Explorbot Setup

Install Explorbot, connect a provider, teach it how to reach the user's app, and prove it with one navigation.

**Ask the user where the setup should live — both answers are valid, and it is their call.**

| | Local | Global |
|---|---|---|
| Install | `npm i explorbot --save`, `npx explorbot init` | `npx explorbot init --global --provider <name>` |
| Config | `explorbot.config.js` in the project | `~/.explorbot/config.js` |
| Knowledge, experience, output | project directories | `~/.explorbot/sites/<host>/` |
| Pick it when | the app is in this repo: config, knowledge, and generated tests belong in version control, CI runs it, hooks and rules are wanted | trying Explorbot out, running against apps that have no repo here, or driving it from an agent |

Local is the fuller setup and the one a project usually keeps. Global is the short path: a provider and a key, and every directory can run Explorbot.

Running Explorbot needs no setup at all when nothing may be written — see [references/env-mode.md](references/env-mode.md).

**Scope ends when `npx explorbot navigate <url>` exits `0`** — exploring and testing belong to [[explorbot-fundamentals]].

## 1. Requirements

- Node ≥ 24 or Bun. If neither exists, stop — do not install a runtime.
- `npx playwright install chromium` — cached machine-wide in `~/.cache/ms-playwright`, so once per machine.
- Explorbot is for CRUD-heavy apps. Warn before installing if the target is a landing page, blog, CMS, or static site.

## 2. Install

Local — the config uses `import`, so `package.json` must be ESM. `npm init -y` produces CommonJS; if `"type"` is missing or `"commonjs"` in an existing file, ask before changing it, and write `explorbot.config.mjs` (passed as `--config`) if the user declines.

```bash
npm pkg set type=module
npm i explorbot --save
npx explorbot init          # writes explorbot.config.js, .env, output/
```

Global:

```bash
npx explorbot init --global --provider <name>
```

## 3. Provider

**Providers, model ids, and key variable names live in Explorbot, never in this skill.** `npx explorbot init --help` lists what `--provider` accepts, and `init` picks model ids from the version's `models.json` and reports the variable it stored.

- Ask which provider the user has an account with. No preference: point them at `basics/providers.md` in the docs.
- If init warns that a role has no recommended model, say so — that provider needs model ids filled in by hand.
- Local setup: the generated config imports one provider. To switch, follow `basics/providers.md` for the package to install and the model ids.

The key: ask the user to paste it into `.env` (local) or `~/.explorbot/.env` (global) in their editor and say "continue", then verify with `grep -q "^<KEY>=." <file>`. `--api-key <key>` writes it for them, at the cost of leaving it in shell history and the transcript. Confirm `.env` is gitignored.

`~/.explorbot/.env` is read on every run, in any directory, without overriding variables already set.

## 4. App URL

Ask for it. Explorbot clicks, fills, and submits on its own, so staging beats production.

Do not guess it. Look for evidence in the project — `package.json` scripts, `.env` files, framework ports — and suggest what you find with its source. Otherwise ask in plain text. Never propose a URL from this skill or from memory.

Local: write it to `web.url` in the config, host only. Global: the config holds no site — each command names it, and the ones with no URL argument (`test`, `learn`, `knows`) read `EXPLORBOT_URL`.

## 5. Verify

Walk the rungs in order. Stop at the first failure, fix it, resume.

1. `curl -sS -o /dev/null -w "%{http_code}\n" <url>` — `000` is DNS/VPN/wrong host, `5xx` is the app itself, `200` skips to rung 3.
2. `curl -sIL -o /dev/null -w "%{url_effective}\n" <url>` after a `3xx`/`401`/`403`. A login-looking final URL means credentials are needed: do rung 4 first.
3. `npx explorbot navigate <url> --session` — exit `0` ends setup. `--session` saves cookies to `output/session.json`. On exit `1`, read `output/explorbot.log`: an auth wall sends you to rung 4, anything else is a wrong path or a broken page.
4. Teach auth, knowledge first, values second:

   ```bash
   npx explorbot knows /login      # reuse existing variable names if auth knowledge exists
   npx explorbot learn "/login" 'Sign in with ${env.APP_USER} / ${env.APP_PASSWORD}'
   ```

   Name only the credentials — no selectors or DOM hints; the Navigator finds the fields. Then have the user add the two variables to `.env`, verify with `grep`, and repeat rung 3. Ask for a test account on a non-production environment.

   Still failing on auth: add one sentence to the knowledge with `learn` (real form URL, SSO, second factor), never a rewrite.

`npx explorbot context <url>` prints headings, matched knowledge, and interactive elements with no AI calls — use it to debug a rung for free.

## 6. Handoff

Report what exists: config and key locations, where artifacts will land, the saved session. Then hand off to [[explorbot-fundamentals]] with a first command:

```bash
npx explorbot explore <url-of-a-crud-page> --max-tests 10
```

## Anti-patterns

- Choosing local or global for the user, or installing into the project before asking.
- Naming providers, model ids, or key variables without reading them from `init --help` or `init` output.
- Putting secrets in knowledge files or config — always `${env.NAME}`, values in `.env`.
- Driving `explorbot start` — it is an interactive TUI; ask the user to run it.
- Asking upfront for target pages, features, or test counts.
