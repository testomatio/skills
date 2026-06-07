# Testomatio AI Skills

AI skills for test management workflows with [Testomat.io](https://testomat.io). These skills bring the power of AI coding agents to your testing process — design tests, automate them, review quality, track coverage, and sync everything with your test management system.

## Quick Start

```bash
npx skills add testomatio/skills`
```

## Install

The easiest way to install these skills across supported AI agent (Cursor, Claude Code, VS Code / GitHub Copilot, Cline etc.) is using the [`skills`](https://skills.sh) CLI. It provides an interactive menu to select the skills you need and choose whether to install them globally or for your current project.

```bash
npx skills add testomatio/skills
```

To update your installed skills:

```bash
npx skills update
```

For other ways of installation (Claude Code plugin, Codex, Cursor etc.) see [install details](./docs/install-details.md).

## Available Skills

### Test Management

| Skill                  | Description                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| `qa-write-test-cases`       | Generate test cases and checklists from requirements, tickets, or feature descriptions               |
| `qa-thinking`          | Analyze a feature from a QA perspective — edge cases, negative flows, abuses, unobvious scenarios — and propose acceptance criteria |
| `improve-test-cases`   | Analyze and improve existing markdown test cases for clarity                                         |
| `detect-duplicate-test-cases` | Find duplicate, near-duplicate, and overlapping test cases                                           |
| `sync-test-cases-with-tms`           | Synchronize Markdown test scenarios between local project and Testomat.io                            |
| `qa-manual-tests-to-code-coverage`      | Map manual test cases to source files; generate `coverage.manual.yml` for affected-only runs         |
| `e2e-test-coverage-mapping`  | Map e2e tests to source files; generate `coverage.e2e.yml` to run only the tests affected by a diff  |
| `senior-qa-testing-workflow`      | Orchestrate complete test case lifecycle: generate, improve, analyze coverage, upload to TMS         |
| `scan-automation-project` | Scan project source code to inventory languages, frameworks, and existing tests |

### Automation

| Skill            | Description                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| `qa-e2e-tests-reporting` | Set up Testomat.io test reporting for your automation framework (Playwright, CodeceptJS, Jest, etc.) |

### Explorbot

| Skill                    | Description                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------ |
| `explorbot-setup`        | First-time install & configuration of Explorbot, including initial knowledge          |
| `explorbot-fundamentals` | Operating reference: run, drive and debug all Explorbot commands, config and outputs   |
| `explorbot-plan`         | Author an Explorbot test plan in markdown so `explorbot test` can run it               |

---

## Flows

<img src="./docs/flows/flows.png" alt="Flows" height="300" />

Testomat.io provides a comprehensive set of flows for QA engineers:

- Generate test cases from requirements
<!-- - Improve test cases
- Sync test cases to Testomat.io
- Add test reporter to your automation project
- Generate test cases from requirements
- Improve test cases
- Sync test cases to Testomat.io
- Add test reporter to your automation project -->

Refer to [docs/flows](./docs/flows) for more detailed examples of flows.

---

## Repository Structure

```
testomatio/skills
├── skills/                    # Agent-agnostic skills (canonical source)
│   ├── detect-duplicate-test-cases/
│   ├── qa-write-test-cases/
│   ├── improve-test-cases/
│   ├── qa-e2e-tests-reporting/
│   ├── sync-test-cases-with-tms/
│   └── ...
└── plugins/                   # Claude Code plugin wrappers
    ├── test-management/
    │   └── skills/
    │       └── [symlinks to ../../skills/*]
    ├── test-automation/
    │   └── skills/
    │       └── [symlinks to ../../skills/*]
    ├── explorbot/
    │   └── skills/
    │       └── [symlinks to ../../skills/*]
    └── ...
```

## Links

- [Testomat.io](https://testomat.io)
- [Testomat.io Documentation](https://docs.testomat.io)
- [check-tests CLI](https://github.com/testomatio/check-tests)
- [Markdown Import/Export Guide](https://docs.testomat.io/project/import-export/download-tests-as-files/download-manual-tests-as-files/)
