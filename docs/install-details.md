# Testomatio skills installation details

[Most agentic tools](#most-agentic-tools)
[Claude Code](#claude-code)
[Codex](#codex)
[Cursor](#cursor)

### Most agentic tools (Claude Code, Cursor, Cline, VS Code and others)

```bash
npx skills add testomatio/skills
```

To update your installed skills later:

```bash
npx skills update
```

### Claude Code (plugin with marketplace)

For Claude Code skills are grouped into plugins which could be installed from the marketplace.

1. Add marketplace

```bash
/plugin marketplace add testomatio/skills
```

2. Install required plugin

```bash
/plugin install <plugin-name>@testomatio/skills
# e.g.
/plugin install test-management@testomatio/skills
```

3. Use

```bash
# invoke plugin
/test-management

# or call skill directly
/test-management:generate-cases

# or just use skill name
generate-cases

# or skill will be loaded automatically on a relevant prompt
"create test cases for login feature"
```

### Cursor

1. Open Cursor Settings (`Cmd+Shift+J` / `Ctrl+Shift+J`)
2. Go to **Rules/Skills/Subagents** → **New** → **Add from GitHub/GitLab**
3. Paste: `https://github.com/testomatio/skills.git`

<img height="300" alt="Cursor install skills" src="./docs/resources/skill-install-Cursor.png">

### VS Code / Copilot IN PROGRESS

```bash
# Install to your configured skills directory
cp -r skills/* ~/.vscode/skills/
# or
cp -r skills/* .vscode/skills/
```
