---
name: qa-sprint-report-by-testomatio
description: Generate a QA Sprint Progress Summary Report from Testomat.io TMS data. Use when the user wants to produce a structured end-of-sprint report covering test design coverage, execution results, defect trends, and quality signals. The skill reads data via Testomat.io MCP tools, maps it to the report sections, and outputs a `.md` file. Optionally offer to export as `.html`.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# QA Sprint Report by Testomat.io

Generates a **QA Sprint Progress Summary Report** by querying Testomat.io TMS via MCP. The report covers sprint metadata, test design coverage, execution progress by suite, defect tracking, TMS test health analytics, and project readiness — all mapped to the [QA_Sprint_Progress_Report_Summary.md template](./references/QA_Sprint_Progress_Report_Summary.md).

## When to Use

- End of sprint — produce a shareable QA report for stakeholders.
- Sprint review — need a structured view of what was tested, passed, failed, blocked.
- Mid-sprint status — capture current execution progress.
- The user mentions "sprint report", "QA summary", "sprint progress", or similar.

## How to Identify the Sprint

The user may identify the sprint in one of these ways (in priority order):

1. **Milestone name or ID** — e.g. "Sprint 42", "Sprint 2024.3" — use `milestones_list(type="Sprint")` to find it.
2. **Run group title** — e.g. "Sprint 42 Run" — use `rungroups_list` / `rungroups_get`.
3. **Direct run ID or run title** — use `runs_get` or `runs_list`.
4. **Plan title or ID** — use `plans_list` / `plans_get`.
5. **No identifier provided** — ask the user to specify the sprint milestone, run group, or run.

> If the user provides only a sprint name like "Sprint 42", always resolve it to a concrete milestone/rungroup/run first. Do not assume the title directly maps to an ID.

## Rules

- **Do not fabricate data.** If MCP does not return a value, use `[None]` or hide the section. Never invent numbers or statuses.
- **Resolve sprint first.** Never assume a sprint name maps directly to a run ID without verification.
- **Hide unavailable sections.** If analytics (Section 8) is not available, omit it entirely rather than leaving placeholder text.
- **One blank line between actions.** In any generated code or CLI snippets.
- **Use TQL for filtering.** Always prefer `tql` filters over client-side filtering when calling `runs_list`, `tests_list`, `testruns_list`.
- **HTML is optional.** Always generate the `.md` first; only offer `.html` after the `.md` is saved.

---

# MCP Tools Mapping

Each report section maps to specific MCP tools. Use only the tools needed per section.

### Section 1 — Sprint Summary Scorecard

| Metric | MCP Tool(s) | Notes |
|--------|-------------|-------|
| 🎫 Total Tickets in Sprint Scope | `runs_list` + count linked tickets | From `runs_create` linked entities or `plans_list` scope |
| 🖊️ New Test Cases Added to TMS | `tests_list` (compare count vs prior sprint) | Store baseline TC count in `Before`; compare at sprint end |
| 📋 Total TCs in Project | `tests_list` → count | `tests_list(per_page=1)` + `total_count` or iterate all |
| ⚙️ Automation Rate | `analytics_stats(kind="automation-rate-by-date")` | Enterprise only; fallback to `tests_list` → count `state=="automated"` |
| 📈 Overall Pass Rate | `analytics_stats(kind="success-rate-by-date")` | Enterprise only; fallback: sum `testruns_list(filter_status="passed")` ÷ total |
| ✅ Tickets Verified / Tested | `runs_list` → linked suite counts | Runs marked finished with results |
| 🏁 Tickets Signed-Off | `runs_list` + filter `status_event="finish"` | Runs that reached "finished" state |
| 🐛 Defects / Bugs Registered | `tests_issues_list` or `testruns_list(filter_message=true)` | Tests with linked issues or error messages |
| 🔁 Tickets Returned to Dev | Manual entry or defect loop count | Not directly queryable; rely on user input |

### Section 2 — Test Design & Coverage Expansion

| Field | MCP Tool(s) | Notes |
|-------|-------------|-------|
| Ticket ID | `suites_list` / `runs_list` | Link to project ticket ID via `link` field |
| Suite / Feature Area | `suites_list` → title | Primary grouping |
| Test Case Titles | `tests_list(suite_id="...")` | Filter by suite |
| Total TCs | `tests_list` count per suite | |
| TMS State | `tests_list` → `state` field | `manual` or `automated` |

### Section 3 — Testing Execution Progress by Suite

| Field | MCP Tool(s) | Notes |
|-------|-------------|-------|
| Suite / Feature Area | `suites_list` | Primary TMS grouping |
| Run Title | `runs_list` | Filter by `milestone_id` or `rungroup_id` |
| Total TCs | `tests_list(suite_id="...")` or `runs_get` | Tests linked to the run |
| Passed / Failed / Skipped | `testruns_list(run_id="...", filter_status)` | Separate calls per status |
| Execution % | Calculated: (passed + failed + skipped) ÷ total | |
| Suite Release Status | Derived from execution % | ✅ 100% pass = Ready; 🟡 >0% pass = In Progress; 🔴 0% pass or blocked |

> **Important:** Filter `runs_list` by `milestone % "Sprint N"` or `rungroup_id` to scope only the sprint's runs. Use TQL: `milestone % '{sprint_name}'`.

### Section 4 — Tickets Moved to Sign-Off

| Field | MCP Tool(s) | Notes |
|-------|-------------|-------|
| Ticket | `runs_list` with `status_event="finish"` | Fully executed runs |
| Verified date | `runs_get` → `finished_at` | |
| TMS Run link | Construct from `runs_get` result | `baseUrl + /runs/{run_id}` |

### Section 5 — Quality Feedback Loop (Returned to Dev)

Not directly queryable via MCP. Use manual user input combined with `testruns_list(filter_status="failed")` to surface failed tests that may indicate returns.

### Section 6 — Sprint Bug Tracking

| Field | MCP Tool(s) | Notes |
|-------|-------------|-------|
| Bug ID | `tests_issues_list` or manual | Linked issues on failed tests |
| Severity | Manual or `issues_list` | Not in MCP; use manual classification |
| Linked Ticket | `tests_issues_list` → linked issue | |
| Current Status | Manual | Not queryable via MCP |

### Section 8 — TMS Test Health Analytics

> **Requires `@testomatio/mcp-enterprise`** package and `api_analytics` subscription. If unavailable, hide this section.

| Sub-section | MCP Tool | Parameters |
|-------------|----------|------------|
| 8.1 Test Health Overview | `analytics_tests` | `kind`: `flaky`, `never-executed`, `evergreen`, `skipped`, `defects`, `slow` |
| 8.2 Success Rate Trend | `analytics_stats(kind="success-rate-by-date")` | `from`, `to`, `days` |
| 8.3 Execution Volume Trend | `analytics_stats(kind="testruns-by-date")` | `from`, `to`, `days` |

Fallback for non-Enterprise: `testruns_list` aggregated over the sprint date range.

### Section 9 — Sprint Health & Project Readiness Assessment

| Field | Source | Notes |
|-------|--------|-------|
| Sprint Completion Risk | Calculated from Section 3 execution % | Green ≥80%, Yellow ≥50%, Red <50% |
| Spillover / Scope Creep Risk | Manual + `runs_list` incomplete runs | Runs not finished |
| Environment & CI/CD Stability | Manual | Not directly queryable |

---

# Workflow

### Step 1: Resolve Sprint Identity

Ask the user if no sprint identifier is provided. Try to resolve:

```
1. milestones_list(type="Sprint") — find milestone matching sprint name
2. rungroups_list — find rungroup with sprint title
3. runs_list(tql="title % 'Sprint N'") — find runs by title
```

### Step 2: Gather Sprint Metadata

Collect for the report header:

- `milestones_get(milestone_id)` or `rungroups_get(rungroup_id)` for sprint title/dates
- Ask user for QA Lead name, timeline period if not in TMS

### Step 3: Collect Run Data

1. `runs_list(tql="milestone == '{id}'")` — all runs for the sprint milestone
2. For each run, call `runs_get` to get status, counts, environments
3. `testruns_list(run_id, filter_status)` — get passed/failed/skipped per run

### Step 4: Build Report Sections

Iterate sections 1–9 of the template, populating each with MCP data. Apply rules:

- If a metric is not available → use `[None]` in the cell
- If an entire section has no data → hide the section (do not show placeholder text)
- Section 8 (Analytics) → check `system_ping` response for Enterprise capability; if not available, hide

### Step 5: Write Output File

Write the filled report to:
```
{user-specified-path}/QA_Sprint_Progress_Report_{SprintName}_{YYYY-MM-DD}.md
```

If no path specified, save to current working directory.

### Step 6: Offer Export

After writing the `.md` file, ask the user if they want to export the report and where to save it:

```
❓ The report has been saved to `{path}`.
Would you like to export it as a `.html` file to share with the team?

1. 📂 Yes, export to cache folder (default)
2. ✏️ Yes, but let me specify a different location
3. 👍 No, keep the `.md` only
```

> **Note:** HTML export requires the template file to be present at `./references/qa-sprint-report-template.html`. If the template is missing, notify the user and offer to save the `.md` only.

**If user picks option 1 (cache folder):**
1. Read the HTML template from `./references/qa-sprint-report-template.html`.
2. Map the `.md` content into the corresponding template sections.
3. Save as `QA_Sprint_Progress_Report_{SprintName}_{YYYY-MM-DD}.html` in the cache folder `.testeiya/`.

**If user picks option 2 (custom location):**
1. Ask for the target directory path.
2. Read the HTML template.
3. Map the `.md` content into the corresponding template sections.
4. Save as `QA_Sprint_Progress_Report_{SprintName}_{YYYY-MM-DD}.html` in the specified directory.

**If user picks option 3:**
- Confirm the `.md` path and end the workflow.

## Quick Commands

| Action | MCP Tool | Key Parameters |
|--------|----------|----------------|
| Find sprint milestone | `milestones_list` | `type="Sprint"`, `status="active"` |
| List runs for sprint | `runs_list` | `tql`: `milestone == '{id}'` |
| Get run details | `runs_get` | `run_id` |
| Get test results | `testruns_list` | `run_id`, `filter_status` |
| Get suite tests | `tests_list` | `suite_id`, `per_page=100` |
| Check analytics availability | `system_ping` | (Enterprise flag in response) |
| Get test health analytics | `analytics_tests` | `kind`, `days`, `from`, `to` |
| Get stats analytics | `analytics_stats` | `kind`, `from`, `to` |

## Report Template Reference

| Section | Description |
|---------|-------------|
| [QA_Sprint_Progress_Report_Summary.md](./references/QA_Sprint_Progress_Report_Summary.md) | Full template with all sections, emoji, and fill-in placeholders |
| [qa-sprint-report-template.html](./references/qa-sprint-report-template.html) | HTML template for optional html report export |