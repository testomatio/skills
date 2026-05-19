---
name: explorbot-setup
description: Install and configure Explorbot for the first time. Use this skill ONLY when there is no `explorbot.config.{js,mjs,ts}` in the project and the user wants to set Explorbot up (install it, pick an AI provider, create the config, and teach it initial knowledge such as login credentials). If a config already exists, use `explorbot-fundamentals` instead. Guide-only — present the exact commands/snippets; the user runs them.
license: MIT
metadata:
  author: Testomat.io
  version: 0.0.1
---

# EXPLORBOT-SETUP SKILL: What I do

First-time install and configuration of Explorbot (the autonomous AI web-testing CLI).
**Guide-only**: present the commands and config; the user runs them. Do not run installs or
edit files unless the user explicitly asks.

**Precondition:** only proceed if there is no `explorbot.config.js` / `.mjs` / `.ts` (also
checked under `config/` and `src/config/`). If one exists, stop and point the user to
`explorbot-fundamentals`.

## 1. Install

```bash
npm i explorbot --save
npx playwright install
```

Requirements: Node ≥ 24 or Bun; an AI provider API key; a modern terminal (iTerm2, WARP,
Kitty, Ghostty, Windows Terminal — WSL on Windows). Not for landing/blog/static sites — see
`docs/prerequisites.md` (isolated/staging env, non-critical data, restricted permissions).

## 2. Initialize config

```bash
npx explorbot init
```

Generates `explorbot.config.js` + `.env`. Options: `-c, --config-path <path>`
(default `./explorbot.config.js`), `-f, --force`, `-p, --path <dir>`.

## 3. Set app URL and AI provider

Edit `explorbot.config.js`: set `web.url` to the app host (host only, no path), and choose a
provider. OpenRouter is recommended (one key, many models); any Vercel AI SDK provider works
(`docs/providers.md` for Groq/OpenAI/Anthropic/Cerebras/Google/Azure imports).

```javascript
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });

export default {
  web: { url: 'https://your-app.com' },
  ai: {
    model: openrouter('openai/gpt-oss-20b'),                          // fast/cheap: HTML+ARIA (Tester/Navigator/Researcher)
    visionModel: openrouter('meta-llama/llama-4-scout-17b-16e-instruct'), // screenshots
    agenticModel: openrouter('minimax/minimax-m2.5:nitro'),           // smart decisions (Captain/Pilot) — cheap to upgrade
  },
};
```

Put the API key in `.env` (`OPENROUTER_API_KEY=`, or `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` /
`GROQ_API_KEY` / `CEREBRAS_API_KEY`). The three models are distinct and all needed; per-agent
overrides via `ai.agents.<name>.model`.

## 4. Teach initial knowledge (do this — don't skip)

Most apps need login. Ask the user for: the app URL/path to start from, login credentials (or
that auth is not required), and any must-know quirks (required form fields, loading waits,
test data/roles). Then record it:

```bash
npx explorbot learn                                    # interactive
npx explorbot learn "/login" "Use credentials: admin@example.com / secret123"
npx explorbot learn "*" "General rule that applies to every page"
```

This writes markdown files to `./knowledge/` (frontmatter `url:` pattern + body). Prefer
referencing secrets as `${env.USER}` / `${env.PASSWORD}` and putting real values in `.env`.
URL patterns: `/login` exact, `/admin/*` glob, `*` all pages, `^/users/\d+` regex,
`~dashboard` contains. See `docs/knowledge.md`.

Tip: `--session` persists cookies/localStorage so login happens once:
`npx explorbot start /login --session` then later `npx explorbot start /app --session`.

## 5. Verify

Have the **user** launch the interactive TUI themselves (an agent cannot drive a TUI):

```bash
npx explorbot start /admin/users --show
```

Start from a small CRUD area so Explorbot grasps context fast. For agent-driven, headless
runs and all debugging, hand off to `explorbot-fundamentals` (CLI: `explorbot explore` /
`freesail` / `test`).
