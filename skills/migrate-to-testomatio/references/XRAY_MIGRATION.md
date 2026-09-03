# XRay Migration

Script pulls from XRay API, produces a Testomat.io-compatible CSV, imported via UI.

Docs: https://docs.testomat.io/project/import-export/import/import-tests-from-xray
Repo: https://github.com/testomatio/migrate-xray

## Setup

- Requires NodeJS 20+.
- Clone outside the project repo:

```bash
git clone https://github.com/testomatio/migrate-xray.git <temp-dir>/migrate-xray
cp .env.example .env
npm i
npm start
```

- `.env` vars:

```env
JIRA_URL=
JIRA_USERNAME=
JIRA_TOKEN=
JIRA_PROJECT_ID=
XRAY_URL=
XRAY_INTERNAL_TOKEN=
# XRAY_FOLDER_ID= # optional, single folder from Test Repository URL (?selectedFolder=...)
TESTOMATIO_TOKEN=testomat_****
TESTOMATIO_PROJECT=
# DRY_RUN=1 # dry run, no import
```

- `JIRA_TOKEN` is an Atlassian API token: https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/
- `TESTOMATIO_TOKEN` is a General Token from https://app.testomat.io/account/access_tokens.
- `TESTOMATIO_PROJECT` is the URL slug: `https://app.testomat.io/projects/<slug>`.

## XRay Token Extraction

- XRay has no public token endpoint; extract manually.
- Open XRay app > F12 DevTools > Network tab > filter `xray.cloud.getxray.app`.
- Open any XRay request Headers, copy `X-Acpt` header value into `XRAY_INTERNAL_TOKEN`.
- Copy request Origin into `XRAY_URL` (usually `https://eu.xray.cloud.getxray.app` or `https://us.xray.cloud.getxray.app`).
- Token expires: on `401 ... Authentication request has expired` reopen XRay and fetch a fresh token.

## Import Result

- Tests tab > Imports > Import from CSV > dropdown `XRay` (or `Testomatio` for script output) > Choose file > Create.
- Debug: `DEBUG="testomatio:xray:*" npm start` (`:in` source, `:out` posted, `:migrate` processing).
- Edit `migrate.js` to customize steps or field mapping.

## Known Limitations

- Test params are not exported by XRay API.
- Tests referencing steps from another XRay test import as `[steps from a missing XRay test]` unless the referenced test is imported first.
