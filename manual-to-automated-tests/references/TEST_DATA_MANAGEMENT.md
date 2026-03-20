# Test Data Management

## Strategies

### 1. Inline Data (Simple Tests)

```typescript
// For small, project-specific data
test('login form validation', async ({ page }) => {
  const invalidEmails = ['not-email', '@nodomain', '']
  for (const email of invalidEmails) {
    await page.goto('/login')
    await page.getByLabel('Email').fill(email)
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
  }
})
```

### 2. Fixture Files

```typescript
// tests/fixtures/users.ts
export const testUsers = {
  admin: {
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin'
  },
  standard: {
    email: 'user@test.com',
    password: 'user123',
    role: 'user'
  }
}

export const testData = {
  products: [
    { id: 1, name: 'Product A', price: 10.99 },
    { id: 2, name: 'Product B', price: 20.50 }
  ]
}
```

### 3. JSON/CSV Files

```typescript
// data/users.json
[
  { "email": "user1@test.com", "role": "admin" },
  { "email": "user2@test.com", "role": "user" }
]
```

```typescript
// Load in tests
import users from '../data/users.json'

test.each(users)('user has role $role', async ({ page }, user) => {
  // Use user.email, user.role
})
```

### 4. Environment-Based Data

```typescript
// Environment variables
const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
const apiUrl = process.env.API_URL || 'http://localhost:8080'

// secrets.json (gitignored)
{
  "apiKey": process.env.SECRET_API_KEY
}
```

## Best Practices

### DO

- Separate test data from test logic
- Use meaningful variable names
- Keep data close to where it's used
- Use fixtures for shared data
- Clean up data after tests (teardown)

### DON'T

- Hardcode credentials in tests
- Use production data
- Share mutable state between tests
- Create data inside tests without cleanup

## Data Cleanup

```typescript
// After hook
After(async ({ I }) => {
  await I.sendDeleteRequest('/api/test-users/cleanup')
})

// Or use test isolation
test('isolated test', async ({ page, browser }) => {
  const context = await browser.newContext()
  const testPage = await context.newPage()
  // test with clean context
  await context.close()
})
```

## API Data Creation

```typescript
test('update user profile', async ({ page, request }) => {
  // Create test user via API
  const user = await request.post('/api/users', {
    data: { name: 'Test User', email: `test-${Date.now()}@test.com` }
  })
  
  const userId = user.json().id
  
  // Use in UI test
  await page.goto(`/users/${userId}/edit`)
  await page.getByLabel('Name').fill('Updated Name')
  await page.getByRole('button', { name: 'Save' }).click()
  
  // Cleanup
  await request.delete(`/api/users/${userId}`)
})
```
