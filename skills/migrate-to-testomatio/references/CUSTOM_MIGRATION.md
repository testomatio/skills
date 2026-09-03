# Custom Migration (Unsupported or Broken TMS)

When no converter or script fits the source, build one. Two options, cheapest first.

- CSV-to-Testomat.io converter: Node script reading the source export, writing Testomat.io CSV columns (see [CSV_MIGRATION.md](./CSV_MIGRATION.md) for column spec, ID padding, and suite splitting).
- API v2 migration script: pushes cases directly, required when attachments or run results must migrate.
- API reference: https://app.testomat.io/docs/openapi
- Base new API scripts on https://github.com/testomatio/migrate-testrail; for Jira-backed sources also use https://github.com/testomatio/migrate-xray.
- Map unmigrated user fields to Labels/Tags rather than dropping them; extend the script when the user flags an important field.
- Keep ID compatibility, suite-file vs suite-folder split, Markdown descriptions, and image uploads per [CSV_MIGRATION.md](./CSV_MIGRATION.md).
- Upload run results only after test cases are uploaded.
