---
name: migrate-to-testomatio
description: Migrate tests to Testomat.io from TestRail, XRay, Testmo, QMetry, Allure TestOps, TestCaseLabs, Qase, Zephyr, QTest, CSV/XLSX, or an unsupported TMS needing a custom converter or API script. Use when user wants to import tests from another TMS, move test suites to Testomat.io, or convert an export file to Testomat.io format.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# Migrate to Testomat.io

Migrate test suites from another TMS into Testomat.io via UI import, API migration script, or CSV converter.

## Scope Discovery (Ask First)

- Before picking a strategy, ask the user what must migrate: test cases only, or also run history/results, attachments/screenshots, automation runs, milestones, defects/issues links, custom fields.
- Do not assume cases-only. Confirm explicitly: "Do you need just test cases, or also runs/results and attachments?"
- Record the answer and route accordingly: anything beyond test cases forces the API script path (CSV cannot carry it).

## Pick Strategy

- Identify source: ask for TMS name only if not given.
- Proactively discover the best fetch method: prefer live API access over CSV export whenever the scope needs it or the dataset is large. CSV is a quick fallback, not the default for complete migrations.
- Ask for API access early: "Do you have admin/API access to the source instance (URL + API token)?" If yes, use the API script path even when a CSV export also exists.
- Identify input: live instance with API access, or exported CSV/XLSX file.
- Route by source:
  - TestRail + API access, >1000 tests or needs attachments/runs: API migration script ([TESTRAIL_MIGRATION.md](./references/TESTRAIL_MIGRATION.md)).
  - TestRail, <1000 tests, no attachments: built-in UI import (CSV or TestRail API option in Imports window).
  - Testmo + API access, or needs runs/results/attachments: API migration via Testmo REST API ([TESTMO_MIGRATION.md](./references/TESTMO_MIGRATION.md), modeled on the TestRail script).
  - XRay (Jira): migration script producing Testomat.io CSV ([XRAY_MIGRATION.md](./references/XRAY_MIGRATION.md)).
  - Testmo, QMetry, TestCaseLabs, Allure TestOps export file, cases-only, no attachments: CSV converter script ([CSV_MIGRATION.md](./references/CSV_MIGRATION.md)).
  - Qase, QTest, Zephyr, other TMS export file: direct UI CSV import, no script ([CSV_MIGRATION.md](./references/CSV_MIGRATION.md)).
  - Unsupported or broken TMS support: build a custom converter or API script ([CUSTOM_MIGRATION.md](./references/CUSTOM_MIGRATION.md)).
- **CSV limits: CSV/XLSX migrates test cases only. It cannot migrate run results/history, attachments/screenshots, automation runs, or milestones. If the user needs any of these, switch to the API migration path.**
- Screenshots or file attachments needed: use the API script path, CSV import cannot create attachments.
- **Never invent converter output columns; converted files always import with format `Testomat.io`.**
- **API scripts need source credentials plus a Testomat.io General Token; never hardcode tokens, use `.env`.**

## Scope

- Migration covers test cases by default; runs, results/history, attachments, automation runs, milestones, defects, and requirements are optional extras via API — confirm which the user needs (see Scope Discovery).
- Upload run results only after test cases are uploaded.
- User fields with no Testomat.io equivalent are not dropped silently: map them to Labels/Tags or extend the converter script.

## Workflow

- Create empty Testomat.io project for the import target.
- Get source access: API credentials (TestRail/XRay/Testmo path) or export file (CSV path).
- Run the routed path:
  - API script path: clone repo to a temp dir, configure `.env`, dry-run, run full migration.
  - CSV path: convert if a converter exists, then import via UI.
  - Custom path: build converter or API script first, then follow the matching path above.
- UI import in all cases ends at: Tests tab > (`...`) > Import from other TMS > Import > Import from CSV > pick source format > Choose file > Create.
- Verify: check Tests page count, suite nesting, steps formatting, priorities/tags.
- Offer post-migration cleanup: `detect-duplicate-test-cases`, `improve-test-cases`.

## References

- [TESTRAIL_MIGRATION.md](./references/TESTRAIL_MIGRATION.md) — TestRail UI options, API script env vars, runs and attachments migration.
- [TESTMO_MIGRATION.md](./references/TESTMO_MIGRATION.md) — Testmo REST API migration (cases, runs, results, attachments), modeled on the TestRail script.
- [XRAY_MIGRATION.md](./references/XRAY_MIGRATION.md) — XRay token extraction, env vars, folder-scoped import.
- [CSV_MIGRATION.md](./references/CSV_MIGRATION.md) — converter scripts, direct UI imports, custom Testomat.io XLSX columns.
- [CUSTOM_MIGRATION.md](./references/CUSTOM_MIGRATION.md) — custom converter or API v2 script for unsupported or broken TMS support.
