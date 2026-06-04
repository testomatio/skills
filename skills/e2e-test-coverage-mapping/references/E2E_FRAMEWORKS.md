# E2E Framework Detection

How to detect the framework in use and where Testomatio IDs live in each.

## Detection signals

| Framework    | Filename patterns                                         | Imports                              | Test syntax                              |
| ------------ | --------------------------------------------------------- | ------------------------------------ | ---------------------------------------- |
| Playwright   | `*.spec.ts`, `*.spec.js`, `*.test.ts`                     | `@playwright/test`                   | `test(...)`, `test.describe(...)`        |
| Cypress      | `*.cy.js`, `*.cy.ts`                                      | `cypress`                            | `describe(...)`, `it(...)`, `context(...)` |
| WebdriverIO  | `*.test.js`, `*.e2e.js`                                   | `@wdio/cli`, `webdriverio`           | `describe(...)`, `it(...)`               |
| Puppeteer    | `*.test.js`                                               | `puppeteer`                          | `describe(...)`, `it(...)`               |
| CodeceptJS   | `*_test.js`, `*.test.js`                                  | `codeceptjs`                         | `Feature(...)`, `Scenario(...)`          |
| Appium       | `*.spec.js`, `*.e2e.js`                                   | `appium`, `webdriverio`              | `describe(...)`, `it(...)`               |
| Mocha (e2e)  | `*.test.js`, `*.spec.js`                                  | `mocha`                              | `describe(...)`, `it(...)`               |
| Jest (e2e)   | `*.test.js`, `*.spec.js`                                  | `jest`                               | `describe(...)`, `it(...)`, `test(...)`  |

Look at filename patterns first, then confirm with imports. Configuration files (`playwright.config.*`, `cypress.config.*`, `wdio.conf.*`, `codecept.conf.*`) are the strongest tiebreaker.

## Where Testomatio IDs live

IDs are appended to test/suite names — never inside code blocks:

```javascript
// Playwright / WebdriverIO / Mocha / Jest / Puppeteer / Cypress
describe('user settings @S92321384', () => {
  it('updates avatar @Ta011dfa3', () => { ... });
});

test('login @smoke @T6f8e9174', async ({ page }) => { ... });
```

```javascript
// CodeceptJS
Feature('Checkout @Sabcd1234');

Scenario('completes purchase @Tdef56789', ({ I }) => { ... });
```

Tags use the same `@word` form (`@smoke`, `@regression`, `@jira-123`).

## Populating IDs

If tests do not yet contain `@S` / `@T` markers, run `check-tests` with the matching framework adapter and `--update-ids`:

```bash
# Playwright
npx check-tests@latest Playwright "**/*{.,_}{test,spec}.{js,ts}" --update-ids

# Cypress
npx check-tests@latest Cypress "**/*.cy.{js,ts}" --update-ids

# CodeceptJS
npx check-tests@latest CodeceptJS "**/*_test.js" --update-ids

# WebdriverIO
npx check-tests@latest WebdriverIO "**/*.{test,e2e}.js" --update-ids
```

`check-tests` rewrites the test files in place, inserting the IDs assigned by Testomat.io. Commit the changes before running `e2e-test-coverage-mapping`.

## Related skills

- `qa-e2e-tests-reporting` — install `@testomatio/reporter` and import tests via `check-tests`.
- `sync-test-cases-with-tms` — pull/push manual cases (the qa-manual-tests-to-code-coverage counterpart). See its [Testomat.io CLI reference](../../sync-test-cases-with-tms/references/TESTOMATIO_CLI.md) for the full `check-tests` command set, including `--update-ids`.
