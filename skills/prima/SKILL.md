---
name: prima
description: Use for any browser work — driving a web app, checking a behaviour, filling a form, reading a page — via npx prima-cli, in preference to npx playwright-cli, which prima runs on top of and falls back to. Covers npx prima-cli check, do, pw, verify, ask, research, go, status, report, browser, config, recommended-models, and session setup. Trigger on "prima", "prima-cli", "npx prima-cli", on a browser task described as behaviour ("confirm the editor saves"), and whenever npx playwright-cli would otherwise be driven step by step.
license: MIT
metadata:
  author: Testomat.io
  version: 0.5.0
---

# Prima

Prima is an AI layer on top of playwright-cli. It drives the browser playwright-cli already has open, taking behaviour described in words instead of locators, and returns a plain-text envelope. Invoke prima through npx (`npx prima-cli ...`); invoke playwright-cli as installed — bare `playwright-cli ...` when it is installed globally, otherwise `npx -y @playwright/cli ...`. Never use `npx playwright-cli@latest`: that package name does not exist and fails with "could not determine executable to run".

**Prefer prima to playwright-cli for anything on a web page.** Snapshots stay inside prima instead of landing in your context, and it reuses the research maps and recorded experience it already has for a page — so a scenario costs a fraction of the tokens of the same scenario driven by hand. Use `playwright-cli` directly when prima has no command for the job, or when no AI model is configured (`pw` still works then).

## Models and Providers

Prima needs AI models taken from the environment — there is no init step. Multiple AI providers are supported (OpenRouter, OpenAI, Anthropic, Groq, Mistral, Google, Poolside).

To inspect all supported providers, their recommended models per role, and see which API keys are already configured in the environment, run:

```bash
npx prima-cli recommended-models
```

Always use `npx prima-cli recommended-models` to guide the user in setting up their keys and provider choice.

### 1. By Provider (recommended)

Export the API key and set the provider variable. Prima will automatically select that provider's recommended models for all three roles (`model` for fast execution, `visionModel` for screenshots, `agenticModel` for smart planning):

```bash
# OpenRouter
export OPENROUTER_API_KEY="sk-or-..."
export PRIMA_CLI_AI_PROVIDER=openrouter

# OpenAI
export OPENAI_API_KEY="sk-..."
export PRIMA_CLI_AI_PROVIDER=openai

# Anthropic
export ANTHROPIC_API_KEY="sk-ant-..."
export PRIMA_CLI_AI_PROVIDER=anthropic

# Groq
export GROQ_API_KEY="gsk_..."
export PRIMA_CLI_AI_PROVIDER=groq

# Mistral
export MISTRAL_API_KEY="..."
export PRIMA_CLI_AI_PROVIDER=mistral

# Google
export GOOGLE_GENERATIVE_AI_API_KEY="..."
export PRIMA_CLI_AI_PROVIDER=google
```

### 2. By Pinning Individual Models

To pin every role explicitly without a provider variable, or to mix providers, use `provider/model-id`:

```bash
export PRIMA_CLI_AI_MODEL=openrouter/openai/gpt-oss-20b:nitro        # fast / general
export PRIMA_CLI_VISION_MODEL=openrouter/openai/gpt-5.6-luna         # screenshots
export PRIMA_CLI_AGENTIC_MODEL=openrouter/openai/gpt-5.6-luna        # smart / agentic
```

### Vision Model

Screenshot analysis needs a vision model:
- When using `PRIMA_CLI_AI_PROVIDER`, the provider's recommended vision model is picked automatically (except Poolside, which does not serve vision).
- When pinning individual models, set `PRIMA_CLI_VISION_MODEL` (or pass `--vision-model <model>` for a single run). Without it prima still runs, but `check` settles outcomes from the run log rather than inspecting the screenshot.

### Inspecting Configuration

- `npx prima-cli config` prints what this directory resolves to; `--json` for machine form.
- Every `PRIMA_CLI_*` variable mirrors the `EXPLORBOT_*` variable (`PRIMA_CLI_AI_PROVIDER` / `EXPLORBOT_AI_PROVIDER`, `PRIMA_CLI_AI_MODEL` / `EXPLORBOT_AI_MODEL`, `PRIMA_CLI_VISION_MODEL` / `EXPLORBOT_VISION_MODEL`, `PRIMA_CLI_AGENTIC_MODEL` / `EXPLORBOT_AGENTIC_MODEL`) and wins over it, so an existing Explorbot setup is not disturbed.

## Session

Prima never launches a browser. It attaches to the session playwright-cli has open and disconnects when done, never closing it:

```bash
playwright-cli open <url>      # start
npx prima-cli <command> ...    # drive
playwright-cli close           # end
```

- With no session open, every prima command fails and prints the `playwright-cli open` command to run. Run it, then retry.
- `npx prima-cli browser start` only checks that a session is open and prints it.
- `--pw-session <title>` picks the session when several playwright-cli sessions are open. `--endpoint <ep>` attaches to a browser server directly, skipping discovery.
- Prima requires Node.js 22+.
- Every command is logged as it runs; `npx prima-cli report` turns the session into an html and markdown report, browser open or not.
- `npx explorbot prima <command>` runs the same tool if explorbot is already installed.

## Tiers

Start at `check`. Come down a rung only when the one above cannot hold the work.

```bash
npx prima-cli check "a workflow can be created and appears in the list" --expected "the new workflow is listed"
npx prima-cli do "open the account menu" "choose settings" "switch the theme to dark" "check it took effect"
npx prima-cli pw "({ page }) => page.click('[data-test=submit]')"
```

- **Pass `do` the whole remaining sequence, never one step per call** — that is the entire cost advantage.
- `pw` takes executable code only. Never give it a description; never give `check`/`do` a locator.
- **`check` settles outcomes; it does not report.** Asking it to "list the fields" or "report what is shown" gives it nothing to settle and comes back `not verified`. Questions go to `ask`, navigation to `do`.
- `verify` takes exactly **one** assertion — several arguments is an error, not several claims. Repeat the command, or write one sentence.
- `check` and `do` legitimately run for minutes. Do not kill and retry.
- `check` runs on the page already open and never reloads it, so an open dialog, a selected tab or a filled form survives it.
- `--expected` is repeatable for several outcomes; without it the scenario text is the single expected outcome.
- Below `pw` sits playwright-cli itself.

Also, with the argument each takes:

```bash
npx prima-cli ask "<question>"        # --no-vision answers from structure only
npx prima-cli verify "<assertion>"    # alias assert
npx prima-cli go "<target>"           # a url, a path, or a page described in words
npx prima-cli status <hash>
```

`research`, `report`, `config`, and `recommended-models` take no argument, and `browser` takes only its subcommand. `research` maps the whole page it is on — `--data` includes extraction, `--deep` expands hidden elements, `--fresh` re-maps past the cache; a question about that page goes to `ask` instead. Run `npx prima-cli <command> --help` for each.

## Reading the envelope

- **Trust the verdict in `### Result`.** Re-verifying a PASSED outcome with another command is the waste this tool exists to remove.
- `ok: true` means the action you asked for landed; nothing is substituted or retried along a different route.
- `### Steps` marks each line `ok`, `FAIL` or `??`. `??` is an instruction that ran but the run ended without confirming — the actions that ran are listed above it, judge from those. Only `FAIL` and an instruction the page could not carry out fail the command.
- `not verified` means the run never checked that outcome — not that it is false, and not a failure.
- **When the run and the picture disagree, the page structure breaks the tie.** An outcome followed by a `resolved:` line was disputed and settled: the accessibility tree sided with the screenshot, so the run log was wrong and the PASSED or FAILED stands. Trust it like any other verdict; both sides stay quoted beneath it.
- **`CONTRADICTION` is a finding, not a verdict to argue with.** It remains only when the tie could not be broken, or when the tree sided with the run: the page holds something it does not display, and its `resolved:` line names that as a likely rendering bug. Both sides are quoted under the outcome, and `### Artifacts` names the html, aria and screenshot on disk — read those and judge the page yourself. Treat it as a bug in the app and look at it before anything else.
- **`go` to a url does not chase redirects.** `(redirected: <target> → <url>)` under `### Page` is the result: a login wall or an access rule sent the browser elsewhere. When that is not what you are testing, sign in with `do` first and go again.
- A `### Warning` saying the outcomes came from the run log alone means no screenshot backed them: set `PRIMA_CLI_VISION_MODEL` (or pass `--vision-model`), and until then do not trust a visual claim from `check`.
- A run that could not complete says so, rather than reporting it as a failure of the app.
- `npx prima-cli config` shows which model answers for each role.

## Artifacts

Every command writes down what it saw. The envelope's last line names it — `details: prima status <hash>` — and `do` prints the directory outright as `page after each step:`. Under `<site>/output/prima/<hash>/`:

- `aria.yml` — the whole page's accessibility tree, **with values and states**: `switch "Click elements" [checked]`, `spinbutton "Max pages": "20"`, `combobox "Scope": Default`.
- `page.html` — the DOM as it stood.
- `status.json` — url, title, state, visit count.
- `page.png` — only when a vision model ran.
- `do` adds a set per step: `N-<action>.aria.yaml`, `N-<action>.html`, and `N-<action>.diff.yaml`, which names what that step changed as `toggled` / `added` / `removed`.

**Never take a `playwright-cli snapshot` after a prima command.** The tree is already on disk, it carries values and states that snapshot does not, and grepping it costs nothing:

```bash
grep -nE "Scope|Click elements|Advanced" <dir>/aria.yml
```

`prima status <hash>` prints the paths, but it drives the browser — read it while the session is still open, or go to the directory yourself.

## Before you drop to `pw`

Most `pw` calls are a question the tiers above have already answered.

- **A control's state or value** — grep `aria.yml` from the last command. Do not query the DOM for something already written down.
- **What a click changed** — `do`'s `N-*.diff.yaml`, not a snapshot before and after.
- **A locator** — `research` returns verified ones for the page.
- **Something missing from a screenshot** — the shot is the viewport, so anything below the fold is absent from it. Scroll it into view with `do`, or read `aria.yml`, which covers the whole page. A vision model that cannot see a control has not shown it is not there.

`pw` earns its place only where no wording can reach: seeding `localStorage`, reading a computed style, forcing a reload. It returns under `### Value`. A locator matching nothing costs a 3000ms timeout and fails the command, so read through `page.evaluate` and act through locators.

## Visual questions

Layout, position, colour, overlap, whether something is cut off — an accessibility tree does not carry any of it, and neither does an assertion that passed.

- `check` settles its outcomes against a screenshot of the final page. What a user can see is the proof; the run log only says what was done.
- `ask "<question>"` — reads a screenshot, answers in prose. Use for anything open-ended about appearance.
- `verify` proves claims with assertions; each comes back PASSED or FAILED with its playwright form, no overall verdict — read the lines and decide. A FAILED line carries its error beneath it: a missing text or element settles the claim as false, but a syntax or locator error means the assertion never ran, so the claim is still open. When no assertion can express a claim it reports "none ran" instead of judging it failed.
