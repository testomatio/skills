# TESTOMATIO HTML Report

Generate standalone HTML/CSS reports for test results visualization.

## Configuration

Set environment variables to enable and customize HTML reports:

| Variable | Description | Default |
|----------|-------------|---------|
| `TESTOMATIO_HTML_REPORT_SAVE=1` | Enable HTML report generation | - |
| `TESTOMATIO_HTML_REPORT_FOLDER` | Output folder for reports | `testomatio-reports/` |
| `TESTOMATIO_HTML_FILENAME` | Output filename (must include `.html`) | - |

## Usage

**Generate report without sending data to Testomatio:**
```bash
TESTOMATIO_HTML_REPORT_SAVE=1 npx codeceptjs run
```

**Custom output location:**
```bash
TESTOMATIO_HTML_REPORT_SAVE=1 TESTOMATIO_HTML_REPORT_FOLDER=user-html-reporter TESTOMATIO_HTML_FILENAME=custom.html npx codeceptjs run
```

**Generate report and push results to TMS:**
```bash
TESTOMATIO_HTML_REPORT_SAVE=1 TESTOMATIO=tstmt_xxx npx codeceptjs run
```

## Report Contents

- Run ID, status, and URL
- Parallel execution indication
- Execution time and date
- Test details with statistics and error info
