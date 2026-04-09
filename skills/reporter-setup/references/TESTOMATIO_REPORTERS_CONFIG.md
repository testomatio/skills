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
| `TESTOMATIO_WORKDIR` | Working directory for relative paths | No |

## Configuration File (Recommended)

Create `.env` file in project root to store credentials securely:

```env
TESTOMATIO=tstmt_xxx
...
```

> **Best Practice:** Use `.env` file instead of passing `TESTOMATIO` token as command variable. Keep `.env` in `.gitignore`.

## Framework Configuration

### Playwright

**Config:**
```js
reporter: [
  ['@testomatio/reporter/playwright'],
],
```

**Run:**
- `npx playwright test` (if token configured in .env).
- `TESTOMATIO={API_KEY} npx playwright test` (if no token configured in .env).

### CodeceptJS

**Config:**
```js
plugins: {
  testomatio: {
    enabled: true,
    require: '@testomatio/reporter/codecept',
  }
}
```

**Run:** 
- `npx codeceptjs run` (if token configured in .env).
- `TESTOMATIO={API_KEY} npx codeceptjs run` (if no token configured in .env).

### Mocha

**Run:**
```bash
mocha --reporter @testomatio/reporter/mocha --reporter-options apiKey=tstmt_xxx
```

### WebdriverIO

**Config (wdio.conf.js):**
```js
const testomatio = require('@testomatio/reporter/webdriver');
// or
// const testomatio = require('@testomatio/reporter/wdio');

exports.config = {
  // ...
  reporters: [
    [
      testomatio,
      {
        apiKey: process.env.TESTOMATIO,
      },
    ],
  ],
};
```

**Run:** `npx @testomatio/reporter run 'npx wdio wdio.conf.js'`

### Jest

**Config (jest.config.js):**
```js
reporters: ['default', ['@testomatio/reporter/jest', { apiKey: process.env.TESTOMATIO }]],
```

**Run:** `npx jest`

## Import Tests to TMS

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
