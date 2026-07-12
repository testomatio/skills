# QA Sprint Progress Summary Report

The **QA Sprint Progress Summary Report** provides a structured, end-of-cycle view of all testing activities carried out during a sprint. It captures test design coverage, execution results, defect trends, and quality signals to keep stakeholders informed on product readiness.

> All sections and metrics in this report are sourced from **Testomat.io TMS** via MCP tools. If a metric or data point is not available in the TMS, the corresponding section is omitted or the value is set to `[None]`. Sections that rely solely on unavailable data are hidden entirely.

## 📋 General Sprint Meta
* **Project / Stream:** [Project Name / Stream]
* **QA Lead Manager:** [Your Name]
* **Sprint Cycle:** [Sprint Number / Name]
* **Timeline Period:** [DD.MM.YYYY – DD.MM.YYYY]

---

## 📊 1. Sprint Summary Scorecard

| Metric | Value | Notes & Data Source |
| :--- | :---: | :--- |
| 🎫 **Total Tickets in Sprint Scope** | [N] | Baseline scope + mid-sprint modifications. |
| 🖊️ **New Test Cases Added to TMS** | [N] | Net new TCs authored in Testomat.io during this sprint. |
| 📋 **Total TCs in Project (End of Sprint)** | [N] | `tests_list` count at sprint close. |
| ⚙️ **Automation Rate** | [XX%] | Automated TCs ÷ Total TCs — from `analytics_stats(kind="automation-rate-by-date")`. |
| 📈 **Overall Pass Rate** | [XX%] | From `analytics_stats(kind="success-rate-by-date")` for the sprint window. |
| ✅ **Tickets Verified / Tested** | [N] | Total features subjected to active evaluation. |
| 🏁 **Tickets Signed-Off (QA Done)** | [N] | Formally approved and ready for delivery/release. |
| 🐛 **Defects / Bugs Registered** | [N] | Newly identified defects logged during execution. |

---

## 🛠️ 2. Test Design & Coverage Expansion

| Ticket ID | Suite / Feature Area | Test Case Title(s) | Total TCs | TMS State |
| :--- | :--- | :--- | :---: | :--- |
| **[PROJ-123]** | Authentication | [TC Title 1]; [TC Title 2]; [TC Title 3] | [N] | [Manual / Automated] |
| **[PROJ-456]** | Data Export | [TC Title 1]; [TC Title 2] | [N] | [Automated] |
| *— No new test cases added —* | | | | |

> **TMS State** column: pull from `tests_list` → `state` field (`Manual` / `Automated`).

---

## 🎯 3. Testing Execution Progress by Suite

> Report group is **Suite** (the primary TMS grouping). Each row corresponds to a Testomat.io Suite. Use `testruns_list(run_id="...")` to populate Passed / Failed / Skipped counts per suite.

| Suite / Feature Area | Run Title | Total TCs | Passed | Failed | Skipped | Blocked | Execution % | Suite Release Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| [Suite Name — e.g. Billing] | [Run Title] | [N] | `[N]` | `[N]` | `[N]` | `[N]` | `[XX]%` | 🟡 In Progress |
| [Suite Name — e.g. Profile] | [Run Title] | [N] | `[N]` | `[N]` | `[N]` | `[N]` | `[XX]%` | ✅ Ready for Sign-Off |
| [Suite Name — e.g. Analytics] | [Run Title] | [N] | `[N]` | `[N]` | `[N]` | `[N]` | `[XX]%` | 🔴 Blocked |
| **TOTAL** | | **[N]** | **`[N]`** | **`[N]`** | **`[N]`** | **`[N]`** | **`[XX]%`** | **Overall Pass Rate:** `[XX%]` |

> **Status Key:**
> ✅ **Ready for Sign-Off:** 100% test execution completed with zero critical defects.
> 🟡 **In Progress:** Validations are actively running; no major technical hurdles encountered.
> 🔴 **Blocked:** Discovered critical failure, missing dependency, or severe infrastructure down-time.

---

## ✅ 4. Tickets Moved to Sign-Off (already passed)
*   `[PROJ-XXX]` — `[User Story Name]` | **Verified:** `[DD.MM.YYYY]` | **TMS Run:** `[Link to Testomat.io Run]`
*   `[PROJ-YYY]` — `[User Story Name]` | **Verified:** `[DD.MM.YYYY]` | **TMS Run:** `[Link to Testomat.io Run]`
*   *— No tickets signed off during this period —*

---

## 🔁 5. Quality Feedback Loop (Returned to Dev)
*   `[PROJ-881]` — *`[Feature Name]`*: `[AC #2 failed: App crashes when session expires / Linked to BUG-99]` (**Return Count:** `[1st time / 2nd time]`)
*   *— No tickets returned to development —*

---

## 🐛 6. Sprint Bug Tracking

| Bug ID | Title / Summary Description | Severity | Linked Ticket | Current Status |
| :--- | :--- | :---: | :--- | :--- |
| `[BUG-001]` | `[Short descriptive bug title]` | 🔴 Critical | `[PROJ-XXX]` | `[Open / In Fix]` |
| `[BUG-002]` | `[Short descriptive bug title]` | 🟠 Major | `[PROJ-XXX]` | `[Resolved / Retest]` |
| *— No bugs registered this week —* | | | |

---

## 📊 8. TMS Test Health Analytics

> Data sourced via MCP `analytics_tests` and `analytics_stats` for the **current sprint period** only in case if you have access to this analytics.
(If most of the metrics could not be obtained, this section should be removed from the results.)

### 8.1 Test Health Overview
| Metric | Value | Notes |
| :--- | :---: | :--- |
| 🔀 **Flaky Tests** | [N] | `analytics_tests(kind="flaky", days=N)` |
| ⏭️ **Never Executed** | [N] | `analytics_tests(kind="never-executed", maturity_days=N)` |
| 🌿 **Evergreen (Stable)** | [N] | `analytics_tests(kind="evergreen", days=N)` |
| ⏭️ **Skipped Tests** | [N] | `analytics_tests(kind="skipped", days=N)` |
| 🐛 **Tests with Defects** | [N] | `analytics_tests(kind="defects", days=N)` |
| 🐌 **Slow Tests (>N ms)** | [N] | `analytics_tests(kind="slow", threshold_ms=N)` |

### 8.2 Success Rate Trend
> `analytics_stats(kind="success-rate-by-date", from="DD.MM.YYYY", to="DD.MM.YYYY")`

| Date | Success Rate % |
| :--- | :---: |
| [DD.MM.YYYY] | [XX%] |
| [DD.MM.YYYY] | [XX%] |
| [DD.MM.YYYY] | [XX%] |

### 8.3 Execution Volume Trend
> `analytics_stats(kind="testruns-by-date", from="DD.MM.YYYY", to="DD.MM.YYYY")`

| Date | Test Runs Executed |
| :--- | :---: |
| [DD.MM.YYYY] | [N] |
| [DD.MM.YYYY] | [N] |

---

## 📊 9. Sprint Health & Project Readiness Assessment

| Assessment Area | Risk Level | Details & Impact Narrative |
| :--- | :---: | :--- |
| 🟢 **Sprint Completion Risk** | `[Green / Yellow / Red]` | Narrative based on execution % and sign-off rate. |
| 📦 **Spillover / Scope Creep Risk** | `[None / Low / High]` | Highlight any items vulnerable to rolling over into the next cycle. |
| 🖥️ **Environment & CI/CD Stability** | `[Stable / Degraded]` | Log testing framework bottlenecks, env down times, or pipeline blockers. |

**Sprint Summary Overview:**
[Write a summary 1-5 sentences overview by current sprint based on the provided info from this report.] 

**Next Sprint Notes:**
[Write a brief 2-3 sentence narrative highlighting core priorities for upcoming days based on the registred issues, test cases comments, ect.]