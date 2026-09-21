# Testmo Migration

Three import methods. Pick by scope (cases-only vs full) and attachment/run need.

- CSV file or converter script: test cases only, no runs/results, no attachments ([CSV_MIGRATION.md](./CSV_MIGRATION.md), repo https://github.com/testomatio/migrate-testmo).
- Built-in UI tool (Testmo format option): test cases only, no attachments, small suites.
- API migration script: full migration — cases with folders, runs with results, attachments. Modeled on https://github.com/testomatio/migrate-testrail.

Docs: https://docs.testomat.io/project/import-export/import/import-tests-from-csv-xlsx
Testmo API docs: https://support.testmo.com/hc/en-us/sections/37971074321293-API-Reference

## UI Import (Cases Only)

- Open project > Tests tab > (`...`) > Import from other TMS > Import > Import from CSV > dropdown `Testmo` > Choose file > Create.
- Converter output (`*_Testomatio.csv`) always imports with format `Testomatio`.
- Confirm scope first: if the user needs runs/results or attachments, skip UI import and use the API script below.

## API Access

- Base URL: `https://<your-name>.testmo.net/api/v1`.
- Auth: `Authorization: Bearer <token>` header. Token is a user API key from Testmo profile settings (or a dedicated API user created by the admin).
- Quick check:

```bash
curl -H "Authorization: Bearer $TESTMO_TOKEN" \
  https://<your-name>.testmo.net/api/v1/user
```

- Key read endpoints for migration:
  - `GET /api/v1/projects/{project_id}/folders` — folder tree (`id`, `parent_id`, `name`).
  - `GET /api/v1/projects/{project_id}/cases?expands=tags,folders&per_page=100&page=N` — cases with custom fields (`custom_steps` HTML, `custom_priority`, tags). Paginate to `last_page`.
  - `GET /api/v1/projects/{project_id}/templates` — template/field definitions, resolve `custom_*` keys before mapping.
  - `GET /api/v1/projects/{project_id}/runs` — manual runs.
  - `GET /api/v1/runs/{run_id}/results?get_latest_result=true&per_page=100` — latest result per test in a run (drop the flag for full history).
  - `GET /api/v1/projects/{project_id}/cases/{case_id}/result-history` — per-case history alternative.
  - `GET /api/v1/cases/{case_id}/attachments` — attachment list with download `path`.
  - Automation runs (optional): `GET /api/v1/projects/{project_id}/automation/runs`, `GET /api/v1/automation/runs/{run_id}/tests`.
- All list endpoints paginate (`per_page` max `100`); loop until `next_page` is null.

## Migration Script (Based on migrate-testrail)

No standalone `migrate-testmo` API script exists yet; scaffold it from https://github.com/testomatio/migrate-testrail (same structure: fetch source → map → push via Testomat.io API v2 → migrate runs).

- Requires NodeJS 20+.
- Scaffold outside the project repo:

```bash
git clone https://github.com/testomatio/migrate-testrail.git <temp-dir>/migrate-testmo-api
cp .env.example .env
npm i
```

- `.env` vars (adapted from the TestRail script):

```env
TESTMO_URL=https://<your-name>.testmo.net
TESTMO_TOKEN=
TESTMO_PROJECT_ID=
# TESTMO_FOLDER_ID= # optional, single folder only
TESTOMATIO_TOKEN=testomat_****
TESTOMATIO_PROJECT=
# TESTOMATIO_HOST=https://app.testomat.io # custom instance only
# DRY_RUN=1 # dry run, no import
```

- `TESTOMATIO_PROJECT` is the URL slug: `https://app.testomat.io/projects/<slug>`.
- `TESTOMATIO_TOKEN` is a General Token from https://app.testomat.io/account/access_tokens.
- Replace the TestRail client in `migrate.js` with Testmo calls:
  - Folders: build `/Folder` paths from `parent_id` chains (`GET .../folders`).
  - Cases: page through `GET .../cases?expands=tags,folders`, convert `custom_steps` HTML (`text1` step, `text3` expected) to Markdown steps, map priority/tags/issues per [CSV_MIGRATION.md](./CSV_MIGRATION.md) column spec.
  - Keep ID compatibility: zero-pad numeric IDs to 8 chars where a stable ID is needed.
- Debug flags (same as TestRail script): `DEBUG="testomatio:testmo:*" npm start` (`:in` source data, `:out` posted data, `:migrate` processing).
- Single case debug (run after full migration): `TESTMO_CASE_ID=12345 npm start`.

## Test Runs with Results

- Requires Project Reporting API key (project Settings > API section) as `TESTOMATIO_REPORT_TOKEN`.
- Import all cases first, then migrate runs (same ordering as `npm run migrate-run-results` in the TestRail script).
- Source: `GET /api/v1/projects/{project_id}/runs` then per run `GET /api/v1/runs/{run_id}/results?get_latest_result=true` (or full history without the flag).
- Map Testmo statuses via `GET /api/v1/projects/{project_id}/statuses` (`is_passed` → passed, `is_failed` → failed, `is_untested` → untested, else skipped/retest as comment).
- Tag created Testomat.io runs with `@id:<testmo_run_id>` in the run title so reruns skip already-imported runs.
- Single run: `TESTMO_RUN_ID=<id> npm run migrate-run-results` (same convention as `TESTRAIL_RUN_ID`).

## Attachments

- Source: `GET /api/v1/cases/{case_id}/attachments`, download each file via its `path` with the Bearer token.
- CSV import cannot carry attachments; re-upload downloaded files via Testomat.io API after the case exists (same pattern as the TestRail `migrate-attachments` step).
- Dry-run first, then full run (mirroring the TestRail script):

```bash
npm run migrate-attachments:dry-run
npm run migrate-attachments
```

## Recovery

- 401/403 from Testmo: token missing, expired, or lacking project access — regenerate the API key or use a dedicated API user.
- 422 on case create: `custom_*` field not in the template — check `GET .../templates` and drop or remap the field.
- Empty cases list: wrong `TESTMO_PROJECT_ID` or user has no access to that project.
- HTML in steps: `custom_steps` returns HTML (`<p>...</p>`) — strip/convert to Markdown during mapping.
- CSV import fails: first row must hold column names; converted files import with format `Testomatio`, not `Testmo`.
