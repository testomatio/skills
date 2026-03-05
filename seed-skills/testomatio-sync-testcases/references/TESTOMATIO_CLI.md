# Testomat.io CLI Configuration Documentation

This document provides comprehensive information about all CLI options and environment variables available in the check-tests sync command.

## Usage

The sync process supports two operations:
- **Pull** - Retrieve the latest test scenarios from Testomat.io and update the local project.

```bash
# if we have preset of Testomatio env in `.env`
npx -y check-tests@latest pull [options]
```

- **Push** - Send local Markdown test updates to Testomat.io.

```bash
# if we have preset of Testomatio env in `.env`
npx -y check-tests@latest push [options]

```

## Environment Variables

### Testomat.io Configuration

| Variable                 | Description                                            | Required                              |
| ------------------------ | ------------------------------------------------------ | ------------------------------------- |
| `TESTOMATIO`             | API key for Testomat.io (format: tstmt_xxxxx)          | Yes (for sync operations)             |
| `TESTOMATIO_URL`         | Testomat.io server URL                                 | No (default: https://app.testomat.io) |
| `TESTOMATIO_WORKDIR`     | Working directory for relative file paths              | No                                    |
| `TESTOMATIO_PREPEND_DIR` | Directory to prepend to test paths                     | No                                    |
| `TESTOMATIO_LABELS`      | Comma-separated labels. Supports `label:value` format  | No                                    |

### Configuration Files

The tool supports loading environment variables from `.env` files using dotenv (best practices to save provided `TESTOMATIO` or `TESTOMATIO_URL` to env file).

```env
TESTOMATIO=your-api-key
TESTOMATIO_URL=https://app.testomat.io
...
```

## CLI Options

### Basic Options

| Option                | Description                                 | Default           |
| --------------------- | ------------------------------------------- | ----------------- |
| `--help`              | Get all need extra cli information/options  | Current directory |
| `-d, --dir <dir>`     | Test directory to scan                      | Current directory |
| `--exclude <pattern>` | Glob pattern to exclude files from analysis | -                 |

### Testomat.io Integration

| Option                        | Description                                                   | Default |
| ----------------------------- | ------------------------------------------------------------- | ------- |
| `--update-ids`                | Update test and suite with Testomat.io IDs                    | false   |
| `--keep-structure`            | Prefer structure of source code over structure in Testomat.io | false   |
| `--no-empty`                  | Remove empty suites after import                              | false   |
| `--clean-ids`                 | Remove Testomat.io IDs from test and suite                    | false   |
| `--purge, --unsafe-clean-ids` | Remove Testomat.io IDs without server verification            | false   |

## Quick Reference
...

## Examples

### Pull Basic Usage

```bash
# Export the latest test scenarios from Testomat.io to local project, folder manual-tests
npx -y check-tests@latest pull -d manual-tests 

# Analyze Playwright tests with TypeScript
npx -y check-tests@latest pull -d manual-tests --keep-structure

# if we can't use variables from the `.env` file, set it to command line
TESTOMATIO=tstmt_xxxxx npx -y check-tests@latest pull
```

### Push Basic Usage

```bash
# Import current local test in Markdown format to Testomat.io
npx -y check-tests@latest push -d manual-tests

# Import current local test in Markdown format to Testomat.io, with prepend dir option
TESTOMATIO_PREPEND_DIR="backend-tests" npx -y check-tests@latest push --no-empty

# Apply labels to all imported tests
TESTOMATIO_LABELS="smoke,regression" npx -y check-tests@latest push

# Apply labels with values using label:value format
TESTOMATIO_LABELS="severity:high,feature:auth,team:frontend"

# if we can't use variables from the `.env` file, set it to command line
TESTOMATIO=tstmt_xxxxx npx -y check-tests@latest push
```