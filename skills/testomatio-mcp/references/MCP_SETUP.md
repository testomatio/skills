# MCP Setup & Configuration Reference

Short reference extracted from the Testomat.io MCP server documentation.

## Installation

```bash
npm install -g @testomatio/mcp@latest
```

For enterprise analytics, install `@testomatio/mcp-enterprise@latest` instead.

## Server Startup

```bash
testomatio-mcp --token <PROJECT_TOKEN> --project <PROJECT_ID>
```

Or with environment variables:

```bash
export TESTOMATIO_PROJECT_TOKEN=<PROJECT_TOKEN>
export TESTOMATIO_PROJECT_ID=<PROJECT_ID>
```

Optional custom base URL:

```bash
export TESTOMATIO_BASE_URL=https://beta.testomat.io
```

## AI Agent Configurations

### OpenCode

File: `opencode.json` (project root or `~/.config/opencode/opencode.json`)

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "testomat": {
      "type": "local",
      "command": [
        "npx",
        "-y",
        "@testomatio/mcp@latest",
        "--token",
        "<TOKEN>",
        "--project",
        "<PROJECT_ID>"
      ],
      "enabled": true,
      "environment": {
        "TESTOMATIO_BASE_URL": "https://app.testomat.io"
      }
    }
  }
}
```

### Claude Desktop

File:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "testomatio": {
      "command": "npx",
      "args": [
        "-y",
        "@testomatio/mcp@latest",
        "--token",
        "<TOKEN>",
        "--project",
        "<PROJECT_ID>"
      ],
      "env": {
        "TESTOMATIO_BASE_URL": "https://app.testomat.io"
      }
    }
  }
}
```

### Cursor IDE

File: `.cursor/mcp.json` (project root or `~/.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "testomatio": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@testomatio/mcp@latest",
        "--token",
        "<TOKEN>",
        "--project",
        "<PROJECT_ID>"
      ],
      "env": {
        "TESTOMATIO_BASE_URL": "https://app.testomat.io"
      }
    }
  }
}
```

## Credentials

- **Project Token**: Get from Testomat.io at **Settings → Project → Project Reporting API key**.
- **Project ID**: Found in the project URL: `https://app.testomat.io/projects/<project_id>`.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `TESTOMATIO_PROJECT_TOKEN` | Yes* | - | Project API token (preferred) |
| `TESTOMATIO_PROJECT_ID` | Yes | - | Project ID |
| `TESTOMATIO_BASE_URL` | No | `https://app.testomat.io` | API base URL |

*`TESTOMATIO_PROJECT_TOKEN` is required.

## TQL Quick Reference

TQL (Testomat.io Query Language) is used for filtering tests and runs.

Supported operators: `==`, `!=`, `>`, `<`, `>=`, `<=`, `in [...]`, `%` (contains), `and`, `or`, `not`, parentheses.

### Common TQL Examples

**Tests:**
- `priority == 'high'`
- `state == 'automated'`
- `suite % 'Checkout'`
- `tag IN ['@smoke', '@regression']`

**Runs:**
- `title % 'Manual tests'`
- `plan == '{PLAN_ID}'`
- `finished and with_defect`
- `failed and has_test_tag == 'regression'`

For full TQL syntax details, see: https://docs.testomat.io/advanced/tql/

## Corporate TLS / Proxy

If running behind a corporate proxy or TLS inspection, Node.js may reject HTTPS requests.

Use system CA support:

```bash
NODE_OPTIONS=--use-system-ca testomatio-mcp --token <TOKEN> --project <PROJECT_ID>
```

Or in MCP client config, pass `NODE_OPTIONS` in the server `env` block.

## Important Notes

- **Run status transitions** use `runs_update` with `status_event` values: `finish`, `finish_manual`, `launch`, `rerun`, `scheduled`, `terminate`.
- **Search** for tests and runs uses `tql` as the single filter input; no dedicated `/search` endpoints.
- **Issue linking** supports scoped helpers: `tests_issues_link/unlink`, `suites_issues_link/unlink`, `runs_issues_link/unlink`.
- **API Sessions** are automatically managed by the MCP server: a session starts before the first mutating request and stops when the server shuts down.
