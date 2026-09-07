# Testomatio AI Skills

AI skills for test management workflows with [Testomat.io](https://testomat.io). These skills bring the power of AI coding agents to your testing process — design tests, automate them, review quality, track coverage, and sync everything with your test management system.

## Quick Start

```bash
npx skills add testomatio/skills
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

### Requirements

| Skill                  | Description                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| `write-user-story` | Write user stories and acceptance criteria (the requirements) from a feature idea, ticket, or notes |
| `qa-requirement-reviewer` | Review requirements for ambiguity, gaps, contradictions, and testability before development |
| `qa-explain-behavior`  | Answer QA questions about product behavior — features, flows, rules, edge cases, and what is not implemented |
| `qa-thinking`          | Analyze a feature from a QA perspective — edge cases, negative flows, abuses, unobvious scenarios |
| `qa-pr-requirements-analyzer` | Extract original intent and acceptance criteria from a PR's title, description, comments, and linked tickets |
| `pull-request-diff-analyzer` | Analyze a PR/branch diff to detect features/fixes and extract acceptance criteria from the code |

### Test Management

| Skill                  | Description                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| `qa-write-test-cases`       | Generate test cases and checklists from requirements, tickets, or feature descriptions               |
| `qa-split-testing-levels-pyramid` | Apply the test pyramid to a feature — assign scenarios to testing levels, coverage split per level |
| `improve-test-cases`   | Analyze and improve existing markdown test cases for clarity                                         |
| `detect-duplicate-test-cases` | Find duplicate, near-duplicate, and overlapping test cases                                           |
| `sync-test-cases-with-tms`           | Synchronize Markdown test scenarios between local project and Testomat.io                            |
| `migrate-to-testomatio` | Migrate tests to Testomat.io from TestRail, XRay, Testmo, QMetry, Allure, TestCaseLabs, or CSV/XLSX |
| `qa-test-code-coverage`      | Map manual & automated tests to source files; generate `coverage.tests.yml` to run only the tests affected by a diff |
| `testing-workflow`      | Tactical orchestrator of the test case lifecycle: generate, improve, analyze coverage, upload to TMS |
| `qa-lead-strategy-advisor`         | Strategic QA advisor: interview & scan to build context, assess QA maturity, deliver a prioritized roadmap, and delegate execution to `testing-workflow` |
| `scan-automation-project` | Scan project source code to inventory languages, frameworks, and existing tests |

### Automation

| Skill            | Description                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| `qa-e2e-tests-reporting` | Set up Testomat.io test reporting for your automation framework (Playwright, CodeceptJS, Jest, etc.) |
| `qa-data-seeder` | Analyze a feature's implementation and seed a balanced test dataset (regular + edge cases) into a target environment |

### Explorbot

| Skill                    | Description                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------ |
| `explorbot-setup`        | Install Explorbot into a project: config, AI provider, login knowledge, verified navigation |
| `explorbot-fundamentals` | Run, drive and debug Explorbot commands — including with nothing installed in the project |
| `explorbot-plan`         | Author an Explorbot test plan in markdown so `explorbot test` can run it               |
| `prima`                  | Drive a browser through described behaviour instead of locators, on top of playwright-cli   |

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
    ├── requirements/
    │   └── skills/
    │       └── [symlinks to ../../skills/*]
    ├── test-management/
    │   └── skills/
    │       └── [symlinks to ../../skills/*]
    ├── test-automation/
    │   └── skills/
    │       └── [symlinks to ../../skills/*]
    ├── qa-process/
    │   └── skills/
    │       └── [symlinks to ../../skills/*]
    ├── explorbot/
    │   └── skills/
    │       └── [symlinks to ../../skills/*]
    └── ...
```

## Claude Code Plugins

Skills are also bundled as [Claude Code plugins](https://docs.testomat.io) via the `testomatio-plugins` marketplace:

| Plugin            | Bundled skills                                                       | Use it to                                                                       |
| ----------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `requirements`    | `write-user-story`, `qa-requirement-reviewer`, `qa-thinking`, `qa-explain-behavior`, `qa-pr-requirements-analyzer`, `pull-request-diff-analyzer` | Write, review, and analyze requirements and features before and during development |
| `qa-process`      | `qa-lead-strategy-advisor`, `qa-explain-behavior`, `qa-thinking`, `testing-workflow` | Assess QA maturity, prioritize a quality roadmap, explain product behavior, and orchestrate the test lifecycle |
| `test-management` | `qa-write-test-cases`, `improve-test-cases`, `sync-test-cases-with-tms`, coverage & more | Manage the test case lifecycle: generate, improve, sync to Testomat.io          |
| `test-automation` | `automate-manual-test-cases`, `debug-fix-failed-flaky-autotests`, `qa-data-seeder` | Create automated tests, heal failing/flaky autotests, and seed test data        |
| `explorbot`       | `explorbot-setup`, `explorbot-fundamentals`, `explorbot-plan`, `prima` | Install, configure, run, debug and plan Explorbot autonomous AI web tests, and drive a browser with prima |

## Links

- [Testomat.io](https://testomat.io)
- [Testomat.io Documentation](https://docs.testomat.io)
- [check-tests CLI](https://github.com/testomatio/check-tests)
- [Markdown Import/Export Guide](https://docs.testomat.io/project/import-export/download-tests-as-files/download-manual-tests-as-files/)
