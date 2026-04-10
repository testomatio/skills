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
