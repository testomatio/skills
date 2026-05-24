---
name: explorbot-fundamentals
description: Use whenever the user runs, configures, or debugs Explorbot from the command line — choosing freesail/explore/test/plan/research, asking what a flag does, asking where an artifact lives, or troubleshooting a failed run. Guide-only — you present the commands/paths and the user runs them.
license: MIT
metadata:
  author: Testomat.io
  version: 0.1.0
---

# Explorbot Fundamentals

Explorbot is an autonomous AI web-testing CLI. It drives its own browser (CodeceptJS → Playwright) and works in cycles of **research → plan → test**.

This skill is intentionally short. **The installed CLI and the installed package's `docs/` tree are the source of truth — do not paraphrase them from memory.** Discover commands and read docs at the moment of use.

## Where the docs actually live

Docs ship inside the npm package. After `npm i explorbot`, they're at:

```
<project root>/node_modules/explorbot/docs/
```

That's the *only* place to read them from in a typical user project. Do **not** look in the skill's own folder, do **not** look in a project-level `docs/` (that belongs to the user's app), do **not** fetch from the web. If `node_modules/explorbot/docs/` doesn't exist, Explorbot isn't installed → route the user to **`explorbot-setup`**.

(For an Explorbot contributor working in the explorbot repo itself, docs are at `<repo root>/docs/`. Detect this by checking for `package.json` with `"name": "explorbot"` at the project root. Everyone else: `node_modules/explorbot/docs/`.)

## Rule 1 — Discover commands via the CLI

Always run the CLI's own help before answering a "how do I…" or "what flag…" question:

```bash
npx explorbot --help                  # list every command
npx explorbot <command> --help        # flags and options for one command
```

These outputs match the installed version. Any hardcoded list (in skills, blog posts, or your own memory) can be stale.

## Rule 2 — Read docs on demand, do not summarize ahead

Pick the file that matches the topic *when the question comes up* — do not pre-load summaries. All paths below are relative to `node_modules/explorbot/docs/` (or the repo's `docs/` for contributors).

| Topic the user is asking about | Open |
|---|---|
| Is this app even suitable for explorbot? | `prerequisites.md` |
| Full list of CLI + TUI commands and flags | `commands.md` |
| Config file shape, `dirs:`, rules wiring | `configuration.md` |
| AI providers (OpenRouter / OpenAI / Anthropic / Groq / Cerebras / Azure) | `providers.md` |
| Knowledge files (URL patterns, frontmatter, interpolation) | `knowledge.md` |
| Planner, planning styles, plan markdown format | `planner.md`, `test-plans.md` |
| Researcher (page analysis) | `researcher.md` |
| Page interaction model (locators, ARIA, iframes) | `page-interaction.md` |
| Re-running generated tests with healing | `rerun.md` |
| Generated test code (Playwright / CodeceptJS) | `automated-tests.md` |
| Hooks | `hooks.md` |
| Reporting (HTML/MD/Testomat.io) | `reporting.md` |
| Tracing / Langfuse / observability | `observability.md` |
| Library / programmatic use | `scripting.md`, `npm-package.md` |
| API testing | `api-testing.md` |
| Doc collector | `doc-collector.md` |

If the topic isn't in this table, `ls node_modules/explorbot/docs/` and pick the matching file by name. Cite the file in your reply so the user can verify (e.g. "from `node_modules/explorbot/docs/knowledge.md`").

## Rule 3 — CLI only; never drive the TUI

An agent can run only the non-interactive CLI (`explorbot explore`, `explorbot test`, `explorbot plan`, `explorbot research`, `explorbot navigate`, etc.). These run headless and exit.

**`explorbot start` launches an interactive terminal UI (TUI). An agent cannot operate a TUI — never try to launch or drive it.** If the user wants interactive mode, tell them to run `explorbot start [path]` themselves.

## Order of operations for every question

1. Verify `node_modules/explorbot/` exists. If not → route to **`explorbot-setup`**.
2. Identify whether the user is asking about a **command/flag** (→ run `npx explorbot … --help`) or a **concept/config/feature** (→ open the matching file in `node_modules/explorbot/docs/`).
3. Read the relevant source.
4. Answer using what you just read, and cite it (`node_modules/explorbot/docs/knowledge.md`, `npx explorbot explore --help`).

## Related skills

- [[explorbot-setup]] — install + config + verify reachability of one page (curl → navigate → credentials). Use this when `node_modules/explorbot/` is missing.
- [[explorbot-plan]] — write a test plan markdown by hand without exploring a live page.
- [[explorbot-debug]] — diagnose a failed session from `output/explorbot.log` + Langfuse traces.
- [[explorbot-fix-session]] — once a session is diagnosed, propose a single minimal fix.

## Anti-patterns

- ❌ Listing commands or flags from memory → run `npx explorbot --help`.
- ❌ Pasting big config snippets without opening `node_modules/explorbot/docs/configuration.md` first.
- ❌ Looking for `docs/` in the skill's folder, in the user's project root, or on the web — they live in `node_modules/explorbot/docs/`.
- ❌ Inventing a command that "should exist" — if `--help` doesn't show it, it doesn't exist.
- ❌ Attempting to launch or "type into" `explorbot start` — you cannot drive the TUI.
- ❌ Telling the user to use explorbot for a landing page / blog / CMS — `node_modules/explorbot/docs/prerequisites.md` says it's for CRUD-heavy apps.
