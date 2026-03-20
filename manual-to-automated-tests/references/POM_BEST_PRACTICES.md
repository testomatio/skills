# Page Object Model (POM) Best Practices

## Core Principles

### Single Responsibility
- Each Page Object represents one page or component
- Methods should do one thing (click, fill, getText, etc.)
- Avoid methods that do multiple assertions or actions

### Encapsulation
- Hide implementation details (locators, waits)
- Expose only meaningful actions to tests
- Keep locators private or protected

### Reusability
- Create base classes for common patterns
- Extract shared functionality into parent classes
- Use composition over inheritance when appropriate

## Locator Strategy

### Priority Order
1. `data-testid` - Most stable, explicit
2. `aria-label` / `aria-*` - Accessible
3. `role` + accessible name - Semantic
4. `id` - Unique identifiers
5. `text` content - Visible labels
6. CSS/XPath - Last resort

### Good Locators
```typescript
// Playwright
await page.getByTestId('submit-button')
await page.getByRole('button', { name: 'Submit' })
await page.getByLabel('Email')

// CodeceptJS
I.seeElement('#submit-button')
I.click('Submit')
```

### Avoid Fragile Locators
```typescript
// Bad: Deep nesting, indices
'.parent .child .grandchild:nth-child(2)'

// Bad: Text-based that may change
'button:contains("Submit")'

// Better: Stable identifiers
'[data-testid="submit-form-btn"]'
```

## Wait Strategies

### Use Explicit Waits
```typescript
// Playwright
await page.getByTestId('modal').waitFor({ state: 'visible' })

// CodeceptJS
I.waitForElement('#modal', 5)
```

### Avoid Hard Waits
```typescript
// Bad
await page.waitForTimeout(5000)

// Good
await page.getByTestId('element').waitFor()
```

## Method Naming

### Clear Action Names
- `clickLogin()` → `clickSubmit()`
- `fillForm()` → `fillLoginForm(email, password)`
- `getTitle()` → `getPageTitle()`

### Boolean Methods
- `isLoggedIn()` - Returns boolean
- `isModalVisible()` - Returns boolean
- `hasError()` - Returns boolean

## Page Component Pattern

For complex pages, use components:

```typescript
// components/Header.ts
export class Header {
  constructor(private page: Page) {}

  get logo() {
    return this.page.getByTestId('logo')
  }

  get userMenu() {
    return this.page.getByTestId('user-menu')
  }

  async logout() {
    await this.userMenu.click()
    await this.page.getByTestId('logout-btn').click()
  }
}
```

## Base Page Class

```typescript
export abstract class BasePage {
  constructor(protected page: Page) {}

  protected async waitForLoadState() {
    await this.page.waitForLoadState('networkidle')
  }

  protected async clickAndWait(url: string | RegExp) {
    await Promise.all([
      this.page.waitForURL(url),
      this.click()
    ])
  }
}
```

## Error Handling

- Throw meaningful errors
- Include context in error messages
- Log failed actions with parameters

```typescript
async clickByTestId(testId: string) {
  const element = this.page.getByTestId(testId)
  if (!await element.isVisible()) {
    throw new Error(`Element with testid '${testId}' is not visible`)
  }
  await element.click()
}
```

## Summary Checklist

- [ ] One class per page/component
- [ ] Private/protected locators
- [ ] Explicit waits over hard waits
- [ ] Meaningful method names
- [ ] No assertions in Page Objects
- [ ] Reusable component structure
- [ ] Clear error messages
