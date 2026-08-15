# Running Explorbot without installing it

Two ways, both `npx`. Neither writes anything into the working directory: knowledge, experience, and output go to `~/.explorbot/sites/<host>/`.

## Once per machine

```bash
npx explorbot init --global --provider <name>
```

Writes `~/.explorbot/config.js` with the model ids recommended by that Explorbot version, and `~/.explorbot/.env` with the provider's key variable — add the key there, or pass `--api-key`. `npx explorbot init --help` lists the accepted providers. With `--provider` there is no wizard, so an agent can run it unattended.

Every directory can then run Explorbot, and each app keeps what Explorbot learned about it between runs:

```bash
npx explorbot explore https://app.example.com/login --max-tests 3
npx explorbot explore app.example.com/dashboard        # host is registered after the first run
npx explorbot sites
```

## Per command

When nothing may be written — CI, containers, someone else's machine — `EXPLORBOT_AI_PROVIDER` builds the config from the environment:

```bash
EXPLORBOT_URL=https://app.example.com \
EXPLORBOT_AI_PROVIDER=<name> \
  npx explorbot explore /login --max-tests 3
```

- `npx explorbot --help` lists every `EXPLORBOT_*` variable of the installed version — read it there rather than copying a list.
- `EXPLORBOT_KNOWLEDGE="Log in as …"` applies knowledge to every page without a file; `EXPLORBOT_KNOWLEDGE_FILE` points at one.
- Model variables take a provider name for its recommendation, or `provider/model-id` to pin one.
- These variables win over `~/.explorbot/config.js`; a project `explorbot.config.js` wins over them.
- `EXPLORBOT_EPHEMERAL=1` keeps nothing between runs.
- Trade-off: the Historian is off, so no generated Playwright or CodeceptJS files. Plans and reports are still written.
