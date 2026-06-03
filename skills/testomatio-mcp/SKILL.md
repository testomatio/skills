---
name: testomatio-mcp
description: Configures and leverages the Testomat.io MCP server for test management analytics, run analysis, failure investigation, and defect triage. Use when the user needs to connect to Testomat.io via MCP, analyze test runs, cluster failures, investigate root causes.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# TESTOMATIO-MCP SKILL: What I Do

This skill helps the user set up access to Testomat.io via MCP and perform high-value QA analysis workflows such as: run analysis by specific criteria, failure clustering, root-cause investigation via trace, plan analysis against failures, and trend and stability analysis.

## When to Use

Trigger this skill when the user wants to:
- **MCP detection** in `.opencode`, `.claude`, and `.cursor` config files.
- **Set up/Enable** the Testomat.io MCP server for an AI agent (Claude, Cursor, OpenCode, etc.).
- **Analyze large test runs** - review recent run results, success rates, or failure trends.
- **Investigate common failures** - understand why tests failed, group similar failures, find patterns.
- **Perform plan analysis** - when many tests fail with the same issue, determine the root cause.
- **Create defects** from failed tests - when multiple tests fail with the same error, suggest creating a ticket in the user's issue tracker (e.g. Jira).

---

## MCP Tools Overview

Quick explanation of available Testomat.io MCP tools grouped by entity:
- **Test:** List, search, and retrieve test cases (`tests_list`, `tests_get`, `tests_search`).
- **Test Plan:** List, get, and search test plans (`plans_list`, `plans_get`, `plans_search`).
- **Run:** List, get, and search test runs (`runs_list`, `runs_get`, `runs_search`).
- **Testrun:** List and get individual test results within a run (`testruns_list`, `testruns_get`).
- **Suite:** List, get, and search test suites/folders (`suites_list`, `suites_get`, `suites_search`).
- **Label:** List and get labels (`labels_list`, `labels_get`).
- **Tag:** Read-only operations to list and get tags (`tags_list`, `tags_get`, `tags_search`).

> Additional CRUD tools (create, update, delete) exist for all entities but use them only when explicitly needed for targeted updates.

---

## Important Guidelines

If the project contains **Markdown test cases** (`*.test.md`) or **automated test files** in the repo, prefer loading test cases locally as markdown files via `sync-test-cases-with-tms` skills, as this is more efficient than using MCP for full test discovery and analysis.

### Prefer Local Tests Over MCP

- Prefer filesystem search for discovering, reading, and analyzing local tests (to find local `*.test.md` files or source code tests when available).
- Use MCP primarily for:
  - tests live exclusively in Testomat.io (no local copies) OR need quick test case searches (e.g. `tests_list`, `tests_search`).
  - performing point updates to remote test case.
  - analytics and reporting.
  - test plan management.
(This avoids unnecessary API calls and respects the user's local test structure).

### Use TQL for Filtering

- TQL (Testomat.io Query Language) is the primary filter for `runs_list`, `plans_list`, `testruns_list`.
   - Supported operators: `==`, `!=`, `>`, `<`, `>=`, `<=`, `in [...]`, `%` (contains), `and`, `or`, `not`.

> See [MCP Setup Reference](./references/MCP_SETUP.md) for common patterns and full syntax.

---

## Prerequisites

### Step 1: Detect Existing MCP Configuration

Check whether the Testomat.io MCP server is already configured in supported MCP-compatible AI agent configuration files:
- `opencode.json`
- `.cursor/mcp.json`
- `claude_desktop_config.json`
- etc (based on the user's local agent config file).

**Validation rules:**
- Check whether a `testomatio` or `mcp.testomatio` entry exists.
- Verify the MCP server is enabled when the client supports enable/disable flags.
- Verify required arguments are present:
   - `TESTOMATIO_PROJECT_TOKEN`.
   - `TESTOMATIO_PROJECT_ID`.

**Testomat.io MCP Server Decision:**
- If the MCP server is missing, incomplete, or disabled => continue to **Step 2: Configure MCP**.
- If the MCP server is already configured and enabled => continue to **Workflows**.

### Step 2: Configure MCP

Before configuring MCP:
- Prefer confirming the project contains no more than 1000 tests.
- If project size cannot be determined, warn the user about MCP performance limitations on large projects.
- Use only targeted or filtered operations when explicitly requested.

#### Required Credentials

The following credentials are required:
- `TESTOMATIO_PROJECT_TOKEN`.
- `TESTOMATIO_PROJECT_ID`.

**Credential priority:**
1. Existing environment variables.
2. Existing MCP configuration.
3. User-provided values.

If credentials are missing, explain where to obtain them with user's note:

```text
1. Navigate to your Testomat.io project.
2. Go to **Settings → Project → Project Reporting API key** to get the token.
   - Copy the project token.
   - Extract the "Project ID" from the project URL: `https://app.testomat.io/projects/<project_id>`.
```

**MCP Configuration Examples:**

| AI Agent |  Pattern |
|----------|----------|
| OpenCode | `"mcp": { "testomatio-mcp": { "type": "local", "command": ["npx", "-y", "@testomatio/mcp@latest", "--token", "<TOKEN>", "--project", "<PROJECT_ID>"], "enabled": true } }` |
| Cursor   | `"mcpServers": { "testomatio-mcp": { "type": "stdio", "command": "npx", "args": ["-y", "@testomatio/mcp@latest", "--token", "<TOKEN>", "--project", "<PROJECT_ID>"] } }` |
| Claude Desktop | `"mcpServers": { "testomatio-mcp": { "command": "npx", "args": ["-y", "@testomatio/mcp@latest", "--token", "<TOKEN>", "--project", "<PROJECT_ID>"] } }` |

For full details, see [MCP Setup Reference](./references/MCP_SETUP.md).

**IMPORTANT RULES:**
- **Do not overwrite unrelated MCP server configurations**.
- **Do not expose project tokens, secrets, or credentials in chat responses**.
- Merge changes carefully with existing config content.

#### MCP Confirmation Summary

After successful configuration, provide a concise summary including:
- detected AI agent.
- updated configuration file.
- MCP server registration status.
- authentication status.

Example:

```text
Testomat.io MCP configuration completed successfully.

AI Agent: Cursor
Config Updated: `.cursor/mcp.json`
MCP Server: Enabled
Authentication: Verified

Available workflows:
- Test run analysis
- Failure clustering
- Root-cause investigation
- Plan analysis & defect triage
```

---

## Possible User's Workflows

The workflows below are examples of common MCP usage patterns and are not a complete list. Adapt and extend them based on user needs.

**MCP is commonly used for:**
- reading and analyzing run reports.
- analytics and reporting.
- test plan management.
- remote testcase operations.
- targeted searches and updates.

**All actions below assume the MCP server is enabled**. The skill uses the MCP CLI tools exposed in the *MCP Tools Overview* section.

### Workflow 1: Analyze Test Runs

**Goal:** Understand the health of recent test execution.

**What you can do with the data:**
- Pull a list of recent runs with `runs_list` to identify which runs finished, failed, or have defects.
- Filter runs by status, environment, or plan to narrow down the scope.
- Compute success/failure ratios across runs to spot regressions.

**Steps:**
1. Call `runs_list` with `tql` filters (e.g., `finished`, `failed`, `with_defect`) to get relevant runs.
2. Select a run of interest and call `runs_get` for detailed metadata.
3. Call `testruns_list` with `run_id` and `filter_status: failed` to extract failed results.
4. Summarize: total tests, passed, failed, skipped, environments involved.

**Outcome:** A concise run health report the user can act on.

### Workflow 2: Failure Investigation & Error Clusterization

**Goal:** Determine what went wrong and which areas are affected.

**What you can do with the data:**
- Extract all failed `testruns` from a run.
- Group failures by **suite** to identify hotspots.
- Group failures by **error message / status message** to find recurring issues.
- Cross-reference with `tests_get` to see test priority, tags, and linked issues.

**Steps:**
1. Call `testruns_list` (`filter_status: failed`, `run_id`) to get failed results.
2. For each failed testrun, call `tests_get` to map it back to suite and metadata.
3. Cluster failures:
   - By `suite_id` → identify the suite with the highest failure count.
   - By `message` substring → find tests failing with the same exception or assertion.
4. Present clusters with counts and affected test titles.

**Outcome:** A ranked list of failure clusters with suite and message breakdowns.

### Workflow 3: Plan Analysis & Root-Cause Detection

**Goal:** When many tests fail with the same issue, explain the root cause.

**What you can do with the data:**
- Compare a run against its source plan to see if failures correlate to specific plan sections.
- Check if the same tests fail across multiple runs → indicates a persistent environmental or code issue.
- Check if failures are concentrated in a single suite or tag → indicates a feature regression.
- Check if failures are scattered across unrelated suites → indicates a systemic issue (infrastructure, config, dependency).

**Steps:**
1. Call `plans_get` (if a plan is linked to the run) to understand the intended scope.
2. Call `runs_list` with `tql` targeting the same plan or environment to get historical runs.
3. Compare failure counts across runs:
   - Increasing failure count → new regression.
   - Same failures across multiple runs → stable bug or flaky infrastructure.
   - Sudden spike in a single suite → localized code change.
4. Call `tests_get` on affected tests to check `code`, `state`, and linked issues.

**Outcome:** A root-cause hypothesis (e.g., "Auth service deploy caused 12 login-suite failures" or "Infrastructure timeout pattern across 4 unrelated suites").

### Workflow 4: Defect Creation from Failed Tests

**Goal:** Turn recurring failures into trackable defects.

**What you can do with the data:**
- Identify a cluster of failed tests sharing the same root cause.
- Propose creating a defect (e.g., Jira issue) when a threshold is reached (e.g., 5+ tests with the same failure).
- Link the new defect to all affected tests in Testomat.io.
- Provide the defect summary with: affected tests, failure messages, run ID, and environments.

**Steps:**
1. Perform **Workflow 2** to cluster failures by message.
2. If a cluster contains 5+ tests:
   - Propose creating a defect to the user.
   - Draft the defect summary: title, description, affected test titles, run link, and environment.
   - If a Jira MCP is available, offer to create the ticket via the Jira skill.
3. After defect creation, call `tests_issues_link` for each affected test to link it to the defect.

**Outcome:** A defect ticket is created and linked to all relevant tests in Testomat.io.

---

## Error Handling

### Recovery

- **MCP not configured**
  - Ask the user for their Testomat.io project token and project ID.
  - Show exactly which config file to edit for their AI agent.

- **No runs found**
  - Verify the `TESTOMATIO_PROJECT_ID` is correct.
  - Check if the project has any executed runs.

- **Authentication errors (401/403)**
  - Confirm the token is valid and has access to the project.
  - Suggest regenerating the token in Testomat.io settings.

### Hard Fail

- Cannot write config file due to permissions.
- MCP server returns persistent errors after correct configuration.

---

## References

| Description | File |
|-------------|------|
| MCP Setup & Configuration | ./references/MCP_SETUP.md |

---

## Examples

### Investigate Root Cause of Multiple Failures

**User Prompt:**
```text
Use testomatio-mcp skill to check why 20 tests failed in the last run — are they related to one suite or a systemic issue?
```

**Agent Answer:**
```text
1. Detecting existing Testomat.io MCP configuration:
   - Found `.cursor/mcp.json`
   - Found `testomatio` MCP server entry
   - MCP server status: enabled

2. Verifying MCP availability...
   - Authentication successful
   - Testomat.io tools available

3. Analyzing latest test run...
   - Retrieved last completed run
   - Total failed tests: 20

4. Failure clustering summary:
   - 16/20 failures belong to suite: "Checkout / Payments"
   - 14 failures share the same error: "Timeout waiting for payment confirmation"
   - First failure timestamp indicates failures started simultaneously

5. Probable root cause:
   - The failures appear systemic rather than test-specific.
   - Most failures point to instability or outage in the payment gateway service used during checkout flows.
```

---

## Quick Commands

| Action              | MCP Tool        | Key Parameters |
|---------------------|-----------------|----------------|
| List failed results | `testruns_list` | `run_id`, `filter_status: failed` |
| List runs           | `runs_list`     | `tql`, `page`, `per_page` |
| Get run details     | `runs_get`      | `run_id` |
| Get test details    | `tests_get`     | `test_id` |
| Get plan details    | `plans_get`     | `plan_id` |
| Link issue to test  | `tests_issues_link` | `test_id`, `url` or `jira_id` |
| Check server status | `system_ping`   | none |

