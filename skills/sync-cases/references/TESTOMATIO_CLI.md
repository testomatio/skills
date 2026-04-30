# Testomat.io CLI Documentation

This document provides comprehensive information about the `check-tests` CLI tool for synchronizing test scenarios between your local project and Testomat.io.

---

## Prerequisites

### Install check-tests Package

Install `check-tests` as a local dependency to avoid security warnings from `npx`:

```bash
npm install check-tests --save-dev
```

Then use the local binary:
```bash
./node_modules/.bin/check-tests <command>
```

Or use npx with the local installation:
```bash
npx check-tests <command>
```

---

## Environment Variables

The tool supports loading environment variables from `.env` files using dotenv.

### Testomat.io Configuration

| Variable                 | Description                                            | Required                              |
| ------------------------ | ------------------------------------------------------ | ------------------------------------- |
| `TESTOMATIO`             | API key for Testomat.io (format: tstmt_xxxxx)          | Yes (for sync operations)             |
| `TESTOMATIO_URL`         | Testomat.io server URL                                 | No (default: https://app.testomat.io) |
| `TESTOMATIO_WORKDIR`     | Working directory for relative file paths              | No                                    |
| `TESTOMATIO_PREPEND_DIR` | Directory to prepend to test paths                     | No                                    |
| `TESTOMATIO_LABELS`      | Comma-separated labels. Supports `label:value`         | No                                    |

### Configuration File

Save credentials to `.env` file:

```env
TESTOMATIO=tstmt_xxxxx
TESTOMATIO_URL=https://app.testomat.io
...
```

---

## CLI Options

### Basic "check-tests" Options

| Option                | Description                                 | Default           |
| --------------------- | ------------------------------------------- | ----------------- |
| `-h, --help`          | Display help information                    | -                 |
| `-d, --dir <dir>`     | Test directory to scan                      | Current directory |

### Testomat.io Integration Specific Project Options

| Option                        | Description                                                   | Default |
| ----------------------------- | ------------------------------------------------------------- | ------- |
| `--update-ids`                | Update test and suite with Testomat.io IDs                    | false   |
| `--keep-structure`            | Prefer structure of source code over structure in Testomat.io | false   |
| `--no-empty`                  | Remove empty suites after import                              | false   |
| `--clean-ids`                 | Remove Testomat.io IDs from test and suite                    | false   |

---

## Commands

### Pull

Retrieve the latest test scenarios from Testomat.io and save them as Markdown files locally.

```bash
npx check-tests pull [options]
# or if installed locally
./node_modules/.bin/check-tests pull [options]
```

**Examples:**

```bash
# Export tests to current directory
npx check-tests pull

# Export tests to manual-tests folder
npx check-tests pull -d manual-tests

# Keep source structure
npx check-tests pull -d manual-tests --keep-structure
```

### Push

Send local Markdown test updates to Testomat.io. (Equivalent to `check-tests manual <files> --update-ids`.)

```bash
npx check-tests push [options]
```

`--files` (alias `-f`) accepts file paths, glob patterns, or a mix; defaults to `**/*.test.md`. Paths resolve relative to `--dir`. Quote globs.

**Best practice:** when the files to push are known, list them explicitly via `--files` rather than relying on the default glob.

**Examples:**

```bash
# Default glob (**/*.test.md)
npx check-tests push

# Specific files
npx check-tests push -f docs/login.test.md docs/checkout.test.md

# Glob (quoted)
npx check-tests push --files "manual-tests/**/*.test.md"

# Multiple globs
npx check-tests push -f "smoke/**/*.test.md" "regression/**/*.test.md"

# With labels
TESTOMATIO_LABELS=smoke,updated npx check-tests push
```

---

## Quick Reference

| Action          | Command                                                        |
| --------------- | -------------------------------------------------------------- |
| Pull tests      | `npx check-tests pull -d <dir>`                                |
| Push files      | `npx check-tests push --files <file1.test.md> <file2.test.md>` |
| Push glob       | `npx check-tests push --files "<dir>/**/*.test.md"`            |
| Push directory  | `npx check-tests push -d <dir>` (glob: `**/*.test.md`)         |
| With labels     | `TESTOMATIO_LABELS=smoke npx check-tests push`                 |
| Keep structure  | `npx check-tests pull --keep-structure`                        |