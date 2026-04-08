# Page Object Model (POM) Best Practices

## Core Principles

### Single Responsibility
- Each Page Object represents one page or a clearly defined UI component.
- Each method performs a single, clear action.
- Keep structure flat and simple.
- Avoid unnecessary abstractions.
- Introduce shared components only when reuse is clear.

### Encapsulation
- Hide implementation details such as selectors and waiting logic.
- Expose only meaningful, high-level actions to tests.
- Do not expose raw selectors outside the Page Object.

### Reusability
- Extract shared logic only when reuse is clear.
- Extract shared functionality into parent classes.
- Use composition over inheritance when appropriate.

## Locator Strategy

### Priority Order

1. Stable test attributes (e.g., data-testid).
2. Accessibility attributes (aria-label, aria-*).
3. Semantic roles with names.
4. Unique identifiers (id).
5. Visible text.
6. CSS/XPath (last resort).

### Guidelines

- Prefer selectors that are stable and independent of UI layout.
- Avoid selectors tied to styling or DOM structure.
- Avoid positional selectors (index-based).

**Good Examples:**
* Playwright
```typescript
await page.getByTestId('submit-button')
await page.getByRole('button', { name: 'Submit' })
await page.getByLabel('Email')
```

* CodeceptJS
```typescript
I.seeElement('#submit-button')
I.click('Submit')
```

### Avoid Fragile Locators

- Do not rely on DOM structure (parent > child > nth element).
- Do not rely on dynamic or frequently changing text.
- Do not use index-based selection unless unavoidable.

**Examples:**
```typescript
// Bad: Deep nesting, indices
'.parent .child .grandchild:nth-child(2)'

// Better: Stable identifiers
'[data-testid="submit-form-btn"]'
```

## Wait Strategies

- Use condition-based waits (element visible, enabled, loaded).
- Avoid fixed delays or hard waits.
- Rely on framework auto-waiting where available.
- Do not duplicate waiting logic unnecessarily.

**Avoid Hard Waits**
```typescript
// Bad
await page.waitForTimeout(5000)
```

## Error Handling

- Do not override or wrap framework errors for UI interactions.
- Rely on built-in error handling for element actions.
- Avoid adding manual visibility or existence checks before actions.

- Add contextual error handling only for:
  - API interactions
  - Data processing
  - Non-UI logic

## Summary Checklist

- [ ] One class per page/component.
- [ ] Private/protected locators.
- [ ] Explicit waits over hard waits.
- [ ] Meaningful method names.
- [ ] No assertions in Page Objects.
- [ ] Reusable component structure.
- [ ] Clear error messages.
