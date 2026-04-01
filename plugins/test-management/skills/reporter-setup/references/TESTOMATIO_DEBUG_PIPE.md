# TESTOMATIO DEBUG Pipe

Debug Pipe stores data for debugging purposes in a temporary json file.

## Configuration

Set environment variables to enable and customize HTML reports:

| Variable | Description | Default |
|----------|-------------|---------|
| `TESTOMATIO_DEBUG=1` | Enable Debug pipe | - |

## Usage

**🔌 To enable Debug pipe set "TESTOMATIO_DEBUG" environment variable with value true or 1 **
Add an env to run by specifying the "TESTOMATIO_DEBUG" variable.

```bash
TESTOMATIO_DEBUG=1 npx codeceptjs run
```

**Replaying Debug Data**

If your test run fails to upload results properly, you can replay the data from the debug file using the CLI.

The debug pipe creates timestamped debug files (e.g., "testomatio.debug.1748206578783.json"). This allows you to keep a history of debug files while having a consistent path to the latest one.

You can replay the latest debug data simply with:

```bash
TESTOMATIO_DEBUG=1 npx @testomatio/reporter replay ./path/to/custom-debug.json
```

## Debug File Content

- Environment variables: Testomatio-related environment variables.
- Run parameters: Parameters used to create the test run.
- Test batches: All test results with full details including steps, errors, and metadata.
