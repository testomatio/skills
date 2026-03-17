# Testomat.io Reporters Configuration

## Installation

```bash
npm install @testomatio/reporter --save-dev
# or pnpm install @testomatio/reporter --save-dev
# or yarn add @testomatio/reporter --dev
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TESTOMATIO` | API key (format: `tstmt_xxxxx`) | Yes (for sync) |
| `TESTOMATIO_URL` | Server URL | No (default: `https://app.testomat.io`) |
| `TESTOMATIO_WORKDIR` | Working directory for relative paths | No |
| `TESTOMATIO_PREPEND_DIR` | Directory to prepend to test paths | No |
| `TESTOMATIO_LABELS` | Comma-separated labels (`label:value`) | No |
| `TESTOMATIO_SUITE` | Target existing suite by SID | No |

## CLI Options

| Option | Description |
|--------|-------------|
| `--update-ids` | Map test IDs between code and Testomat.io |
| `--no-empty` | Remove empty suites after import |
| `--clean-ids` | Remove Testomat.io IDs from tests |
| `--purge` | Remove IDs without server verification |
| `--no-skipped` | Fail when skipped tests found |
| `--require-ids` | Fail if tests missing Testomat.io IDs |
| `--keep-structure` | Use source code folder structure |
| `--no-hooks` | Exclude hook code from import |
| `--line-numbers` | Include line numbers in code |
| `--no-detached` | Don't mark detached tests |
| `--typescript` | Enable TypeScript support |
| `--sync` | Wait for import to complete |

## Configuration File (Recommended)

Create `.env` file in project root to store credentials securely:

```env
TESTOMATIO=tstmt_xxx
TESTOMATIO_URL=https://app.testomat.io
```

> **Best Practice:** Use `.env` file instead of passing `TESTOMATIO` token as command variable. Keep `.env` in `.gitignore`.

## Framework Configuration

### Playwright

**Config:**
```js
reporter: [
  ['list'],
  ['@testomatio/reporter/playwright', { apiKey: process.env.TESTOMATIO }],
],
```

**Run:** `npx playwright test`

### CodeceptJS

**Config:**
```js
plugins: {
  testomatio: {
    enabled: true,
    require: '@testomatio/reporter/lib/adapter/codecept',
  }
}
```

**Run:** `npx codeceptjs run`

### Mocha

**Run:**
```bash
mocha --reporter @testomatio/reporter/mocha --reporter-options apiKey=tstmt_xxx
```

### WebdriverIO

**Config (wdio.conf.js):**
```js
const testomatio = require('@testomatio/reporter/webdriver');

exports.config = {
  reporters: [[testomatio, { apiKey: process.env.TESTOMATIO }]],
};
```

**Run:** `npx wdio wdio.conf.js`

### Jest

**Config (jest.config.js):**
```js
reporters: ['default', ['@testomatio/reporter/jest', { apiKey: process.env.TESTOMATIO }]],
```

**Run:** `npx jest`

## Import Tests

```bash
npx check-tests <framework> "<glob-pattern>"
```

Examples:
```bash
npx check-tests playwright "tests/**/*.spec.js"
npx check-tests playwright "tests/**/*.spec.ts" --typescript --update-ids
npx check-tests jest "tests/**/*.test.js" --require-ids
npx check-tests mocha "test/**/*_test.js"
npx check-tests codeceptjs "tests/**_test.js"
```

Example by using "TESTOMAT" token in exec cmd:
```bash
# NO recommended but for testing can be used
TESTOMATIO=tstmt_xxx npx check-tests playwright "tests/**/*.spec.js"
```
