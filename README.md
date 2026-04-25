# Testomatio AI Skills

AI skills for test management workflows with [Testomat.io](https://testomat.io). These skills bring the power of AI coding agents to your testing process — design tests, automate them, review quality, track coverage, and sync everything with your test management system.

## Quick Start

`npx skills add testomatio/skills`

## Available Skills

### Test Management

| Skill                  | Description                                                                                  |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| `generate-cases`  | Generate test cases and checklists from requirements, tickets, or feature descriptions       |
| `improve-test-cases`   | Analyze and improve existing markdown test cases for clarity                                 |
| `find-duplicate-cases` | Find duplicate, near-duplicate, and overlapping test cases                                   |
| `sync-cases`           | Synchronize Markdown test scenarios between local project and Testomat.io                    |
| `testomatio-flow`      | Orchestrate complete test case lifecycle: generate, improve, analyze coverage, upload to TMS |

### Automation

| Skill            | Description                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| `reporter-setup` | Set up Testomat.io test reporting for your automation framework (Playwright, CodeceptJS, Jest, etc.) |

---

## Installation

The easiest way to install these skills across any supported AI agent (Cursor, Claude Code, GitHub Copilot, Cline, agentic tools, etc.) is using the [`skills`](https://skills.sh) CLI. It provides an interactive menu to select the skills you need and choose whether to install them globally or for your current project.

```bash
npx skills add testomatio/skills
```

To update your installed skills later:

```bash
npx skills update
```

### Claude Code

For better skills management you can use Claude Code plugin marketplace.

[Follow instructions](./docs/install-details.md#claude-code) to install plugins.

### Codex

Easiest way to install skills for Codex is to chat with Codex and ask something like:

`install skills from https://github.com/testomatio/skills/tree/master/skills`

or trigger `Skill Installer` in Codex chat and provide the same link `https://github.com/testomatio/skills/tree/master/skills`.


### Other
For other ways of installation see [installation details](./docs/install-details.md).

## Repository Structure

```
testomatio/skills
├── skills/                    # Agent-agnostic skills (canonical source)
│   ├── find-duplicate-cases/
│   ├── generate-cases/
│   ├── improve-test-cases/
│   ├── reporter-setup/
│   ├── sync-cases/
│   └── ...
└── plugins/                   # Claude Code plugin wrappers
    ├── test-management/
    │   └── skills/
    │       └── [symlinks to ../../skills/*]
    ├── test-automation/
    │   └── skills/
    │       └── [symlinks to ../../skills/*]
    └── ...
```

## Links

- [Testomat.io](https://testomat.io)
- [Testomat.io Documentation](https://docs.testomat.io)
- [check-tests CLI](https://github.com/testomatio/check-tests)
- [Markdown Import/Export Guide](https://docs.testomat.io/project/import-export/download-tests-as-files/download-manual-tests-as-files/)
