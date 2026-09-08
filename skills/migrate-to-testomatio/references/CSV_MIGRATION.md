# CSV Migration (Testmo, QMetry, TestCaseLabs, Allure, Others)

Two paths: converter script (normalizes export to Testomat.io CSV), or direct UI import.

Docs: https://docs.testomat.io/project/import-export/import/import-tests-from-csv-xlsx

## UI Import (All Sources)

- Open project > Tests tab > (`...`) > Import from other TMS > Import > Import from CSV.
- Sidebar: pick the tool the file came from (Qase, QTest, Zephyr, TestRail, XRay, Testmo, QMetry, Allure TestOps, TestCaseLabs, Testomatio) > Choose file > Create.
- Same flow works for BDD projects; rows map Precondition > Given, Step > When, Expected Result > Then.
- Converted files always import with format `Testomatio`.

## Converter Scripts

- Requires NodeJS 18+, each produces `*_Testomatio.csv`.
- Clone outside the project repo, one per source:

```bash
git clone https://github.com/testomatio/migrate-testmo.git <temp-dir>/migrate-testmo
git clone https://github.com/testomatio/migrate-qmetry.git <temp-dir>/migrate-qmetry
git clone https://github.com/testomatio/migrate-testcaselabs.git <temp-dir>/migrate-testcaselabs
git clone https://github.com/testomatio/migrate-allure.git <temp-dir>/migrate-allure
```

- Run inside the cloned repo:

```bash
npm install
node convert.js <path-to-export-csv>
```

- Example: `node convert.js TestCases.csv` produces `TestCases_Testomatio.csv`.
- Allure output is `allure_Testomatio.csv`; maps Feature/Epic/Story to Folder hierarchy, `automated` flag to Status, `jira-*` columns to Issues.
- No options to invent; script takes only the input file path.
- Edit `convert.js` in the cloned repo to adjust column mapping.

## Sources Without Converter

- Qase, QTest, Zephyr: export CSV/XLSX from the source tool, import directly with matching format dropdown.
- Qase walkthrough: https://docs.testomat.io/tutorials/migration-from-qase

## Custom Testomat.io XLSX

- Build a file with these columns (ID left empty): ID, Title, Status, Folder, Emoji, Priority, Tags, Owner, Description, Labels, Issues.
- `Folder` nesting: `/suite/sub-suite`.
- `Priority`: normal, important, high, critical, low.
- `Status`: manual or automated, blank allowed.
- `Description` supports Markdown.
- `Issues`: Jira keys (`ABC-123`), comma-separated.
- Example file: https://testomatiofiles.ams3.cdn.digitaloceanspaces.com/Testomat_example.xlsx

## ID Compatibility

- Testomat.io public IDs are 8 alphanumeric chars, case-insensitive.
- Keep old IDs recognizable: zero-pad the numeric part to 8 chars (`TC-1` becomes `tc000001`).
- Put the mapped ID in the `ID` column of the Testomat.io CSV.

## Suites and Tests

- A source suite holding both suites and tests must be split: suite-folder holds only suites, suite-file holds only tests (they differ by `file_type`).
- Every test needs a suite: always fill the `Folder` column, using `/` nesting (`/suite/sub-suite`).

## Descriptions and Images

- Descriptions are pure Markdown; format steps per [test-case-format.md](../qa-write-test-cases/references/test-case-format.md).
- Images inside test cases are not carried by CSV: upload them via Testomat.io API, or switch to the API script path.

## Recovery

- Import fails: first row must hold column names.
- Wrong suites: check `Folder` column uses `/` nesting.
