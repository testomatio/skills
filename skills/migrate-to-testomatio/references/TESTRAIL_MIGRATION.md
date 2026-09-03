# TestRail Migration

Three import methods. Pick by test count and attachment need.

- CSV file: simple import, no attachments.
- Built-in UI tool (TestRail API option): up to 1000 tests, no attachments.
- Migration script: over 1000 tests, attachments, test runs with results.

Docs: https://docs.testomat.io/project/import-export/import/import-tests-from-testrail

## UI Import

- Open project > Tests tab > (`...`) > Import from other TMS > Import > Import From TestRail.
- CSV option: Import > Import from CSV > dropdown `TestRail` > Choose file > Create.
- API option: enable API in TestRail (Administration > Site Settings > API toggle), enter TestRail credentials in Testomat.io Imports tab > Import Tests.
- Sample export for comparison: https://testomatio-artifacts.ams3.cdn.digitaloceanspaces.com/documentation/TestRail.csv

## Migration Script

Repo: https://github.com/testomatio/migrate-testrail

- Requires NodeJS 20+.
- Clone outside the project repo:

```bash
git clone https://github.com/testomatio/migrate-testrail.git <temp-dir>/migrate-testrail
cp .env.example .env
npm i
npm start
```

- `.env` vars:

```env
TESTRAIL_URL=
TESTRAIL_USERNAME=
TESTRAIL_PASSWORD=
TESTRAIL_PROJECT_ID=
# TESTRAIL_SUITE_ID= # optional, single suite only
TESTOMATIO_TOKEN=testomat_****
TESTOMATIO_PROJECT=
# TESTOMATIO_HOST=https://app.testomat.io # custom instance only
# DRY_RUN=1 # dry run, no import
```

- `TESTOMATIO_PROJECT` is the URL slug: `https://app.testomat.io/projects/<slug>`.
- `TESTOMATIO_TOKEN` is a General Token from https://app.testomat.io/account/access_tokens.
- Debug flags: `DEBUG="testomatio:testrail:*" npm start` (`:in` source data, `:out` posted data, `:migrate` processing).
- Single case debug (run after full migration): `TESTRAIL_CASE_ID=12345 npm start`.
- Edit `migrate.js` to customize sections, suites, steps mapping.

## Test Runs with Results

- Requires Project Reporting API key (project Settings > API section) as `TESTOMATIO_REPORT_TOKEN`.
- Import all cases first, then:

```bash
npm run migrate-run-results
```

- Single run: `TESTRAIL_RUN_ID=<id> npm run migrate-run-results`.
- Already-imported runs are skipped via `@id:<run_id>` tag in run title.
- Artifacts need S3 bucket plus same S3 creds in Testomat.io project Settings:

```env
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_REGION=
S3_BUCKET=
# S3_ENDPOINT= # non-AWS only
```

## Attachments Fix

- Fixes orphaned `index.php?/attachments/get/123` URLs left by earlier imports.
- Needs `TESTRAIL_SESSION` (browser cookie `tr_session` from DevTools > Application > Cookies after TestRail login).

```bash
npm run migrate-attachments:dry-run
npm run migrate-attachments
```

## Recovery

- Duplicated steps after TestRail template change: `git checkout opt/template-fields-sync`, rerun.
- UI tool cannot connect: API disabled in TestRail.
- CSV fails: first row must hold column names.
