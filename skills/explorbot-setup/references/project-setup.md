# Project-local setup

Only when the user wants Explorbot's config **in their repository** — checked into version control, with hooks, rules, custom `dirs:`, or generated tests kept next to the code. Otherwise use the global install in [SKILL.md](../SKILL.md).

A project config wins over `~/.explorbot/config.js` and over `EXPLORBOT_*`, and puts `knowledge/`, `experience/`, and `output/` in the project instead of `~/.explorbot/sites/<host>/`.

## 1. ESM package

The generated config uses `import`, so `package.json` must be ESM. `npm init -y` produces CommonJS.

```bash
npm init -y
npm pkg set type=module
```

If `package.json` exists with `"type"` missing or `"commonjs"`, ask before changing it. If the user declines, write `explorbot.config.mjs` and pass `--config explorbot.config.mjs` to every command.

## 2. Install and init

```bash
npm i explorbot --save
npx playwright install chromium
npx explorbot init
```

`init` writes `explorbot.config.js`, `.env`, and `output/`. With `--config-path`, `--path`, or no TTY it skips the wizard. Flags: `npx explorbot init --help`.

## 3. Configure

Read the generated `explorbot.config.js` and edit it in place — never paste a config from memory.

- `web.url` — the app host, no path.
- The three `ai` models and the provider import: the template ships one provider. To switch, follow `docs/basics/providers.md` in the [Explorbot docs](https://github.com/testomatio/explorbot/tree/main/docs) — it names the package to install and the model ids. `models.json` in the repo holds the current recommendations.
- Keys are referenced as `process.env.<KEY_NAME>` and live in the project `.env`. Confirm it is gitignored.

`~/.explorbot/.env` still fills in keys the project `.env` does not set.

## 4. Knowledge and verification

Same rungs as [SKILL.md](../SKILL.md) step 4, without the `EXPLORBOT_URL` prefix — `web.url` names the site:

```bash
npx explorbot learn "/login" 'Sign in with ${env.APP_USER} / ${env.APP_PASSWORD}'
npx explorbot navigate /login --session
```

Artifacts are project-relative: `knowledge/`, `experience/`, `output/{reports,plans,states,research,tests}`, log at `output/explorbot.log`.

## CI

Provider key as a pipeline secret, `npx playwright install --with-deps chromium` in the job, commit `knowledge/`, cache `experience/` and `output/`, upload `output/reports/` as artifacts. `explore` exits non-zero only when the run fails to start, so gate on the report, not the exit code.
