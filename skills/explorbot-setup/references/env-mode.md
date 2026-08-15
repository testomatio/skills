# Env-var mode

For CI jobs, containers, and one-off runs where nothing may be installed or written. `EXPLORBOT_AI_PROVIDER` turns it on and fills every model role from that provider's recommendations.

```bash
EXPLORBOT_URL=https://app.example.com \
EXPLORBOT_AI_PROVIDER=<name> \
  npx explorbot explore /login --max-tests 3
```

- `npx explorbot --help` lists every `EXPLORBOT_*` variable of the installed version — read it there instead of copying a list.
- `EXPLORBOT_URL` and `EXPLORBOT_AI_PROVIDER` are the only required ones. A command carrying an absolute URL supplies the first.
- `EXPLORBOT_KNOWLEDGE="Log in as …"` applies knowledge to every page without a file; `EXPLORBOT_KNOWLEDGE_FILE` points at one.
- Model variables take a provider name for its recommendation, or `provider/model-id` to pin one (split on the first slash).
- These variables win over `~/.explorbot/config.js`; a project `explorbot.config.js` wins over them.
- The provider key still comes from `~/.explorbot/.env` if it is there, or from the environment.
- Trade-off: the Historian is off, so no generated Playwright or CodeceptJS files. Plans and reports are still written.
- `EXPLORBOT_EPHEMERAL=1` keeps nothing between runs; otherwise output goes to `~/.explorbot/sites/<host>/`.
