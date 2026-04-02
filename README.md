# Testomatio AI Skills

AI skills for test management workflows with [Testomat.io](https://testomat.io). These skills bring the power of AI coding agents to your testing process — design tests, automate them, review quality, track coverage, and sync everything with your test management system.

Follows the [Agent Skills open standard](https://agentskills.io) — compatible with Claude Code, Cursor, VS Code/Copilot, OpenCode, and more.

## Available Skills

| Skill | Description |
|-------|-------------|
| `generate-test-cases` | Generate test cases and checklists from requirements, tickets, or feature descriptions |
| `improve-test-cases` | Analyze and improve existing markdown test cases for clarity and Testomat.io format compliance |
| `sync-cases` | Synchronize Markdown test scenarios between local project and Testomat.io |
| `find-duplicate-cases` | Find duplicate, near-duplicate, and overlapping test cases across your test suite |
| `reporter-setup` | Set up Testomat.io test reporting for your automation framework (Playwright, CodeceptJS, Jest, etc.) |
| `testomatio-flow` | Orchestrate complete test case lifecycle: generate, improve, analyze coverage, upload to TMS |

## Installation

### Claude Code (Plugin with Marketplace)

Full plugin experience with the `/test-management` command:

```bash
/plugin marketplace add testomatio/skills
/plugin install test-management@testomatio/skills
/test-management
```

### Cursor

**Note:** Agent Skills in Cursor require the **Nightly** release channel (Settings → Beta → Update Channel → Nightly).

**Option 1 — Remote Rule (easiest):**
1. Open Cursor Settings (`Cmd+Shift+J` / `Ctrl+Shift+J`)
2. Go to **Rules** → **Add Rule** → **Remote Rule (GitHub)**
3. Paste: `https://github.com/testomatio/skills`

**Option 2 — Manual Install (Project-level):**
```bash
cd your-project
git clone https://github.com/testomatio/skills.git _tmp_skills
cp -r _tmp_skills/skills/* .cursor/skills/
rm -rf _tmp_skills
```

**Option 3 — Global Install (all projects):**
```bash
mkdir -p ~/.cursor/skills
git clone https://github.com/testomatio/skills.git _tmp
cp -r _tmp/skills/* ~/.cursor/skills/
rm -rf _tmp
```

### OpenCode

```bash
# Project-level
mkdir -p .opencode/skills
cp -r skills/* .opencode/skills/

# Global
mkdir -p ~/.opencode/skills
cp -r skills/* ~/.opencode/skills/
```

### VS Code / Copilot

```bash
# Install to your configured skills directory
cp -r skills/* ~/.vscode/skills/
# or
cp -r skills/* .vscode/skills/
```

### Generic Agent Skills Installation

Any tool supporting the Agent Skills standard can install from the `skills/` directory:

```bash
cp -r skills/* <agent-config-dir>/skills/
```

Common agent directories:
- `.cursor/skills/` — Cursor
- `.claude/skills/` — Claude Code / OpenCode
- `.agents/skills/` — OpenCode fallback
- `.codex/skills/` — OpenAI Codex

## Usage Examples

### Generate Test Cases

```
Generate test cases for a user login feature with email and password authentication.
Include tests for valid login, invalid credentials, locked accounts, and password reset.
```

### Improve Existing Tests

```
Review and improve the test cases in tests/login/.
Make sure they follow Testomat.io markdown format best practices.
```

### Find Duplicate Tests

```
Find duplicate or overlapping test cases in my test suite.
Show recommendations for which tests to merge or remove.
```

### Sync to Testomat.io

```
Sync all markdown test cases from tests/ to my Testomat.io project.
Use labels "smoke" and "regression".
```

### Set Up Test Reporter

```
Add Testomat.io reporter to my Playwright test suite.
I want to see test results in my Testomat.io dashboard after each run.
```

### Complete Workflow (testomatio-flow)

```
I need to test a new shopping cart feature. Here are the requirements:
- Add items to cart
- Update quantities
- Remove items
- Calculate totals with tax

Generate test cases, set up the test reporter, and sync everything to Testomat.io.
```

## Repository Structure

```
testomatio/skills
├── skills/                    # Agent-agnostic skills (canonical source)
│   ├── generate-test-cases/
│   ├── improve-test-cases/
│   ├── sync-cases/
│   ├── find-duplicate-cases/
│   ├── reporter-setup/
│   └── hello/
└── plugins/                   # Claude Code plugin wrappers
    └── test-management/
        └── skills/
            ├── testomatio-flow/    # Plugin-specific orchestrator
            └── [symlinks to ../../skills/*]
```

## Links

- [Testomat.io](https://testomat.io)
- [Testomat.io Documentation](https://docs.testomat.io)
- [check-tests CLI](https://github.com/testomatio/check-tests)
- [Markdown Import/Export Guide](https://docs.testomat.io/project/import-export/download-tests-as-files/download-manual-tests-as-files/)
- [Agent Skills Standard](https://agentskills.io)

## License

MIT
