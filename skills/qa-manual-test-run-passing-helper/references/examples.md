# Manual Test Run Passing Helper — Examples

## Example 1: User Input (MCP Available)

### User Input

```
Pass these test cases for me:
- File: tests/login-flow.test.md
```

### Agent Response (MCP Available)

```text
Starting manual test execution session.

1. MCP check: Testomat.io MCP is configured ✓

2. Created test run: "Manual-2026-06-21-LoginFlow" (ID: abc123)

3. Parsed 5 test cases:
   - From file: 5 cases (Login with email, Login with Google)

4. Executed test case 1/5: "Login with valid credentials"
   - Navigated to /login
   - Filled username/password fields
   - Clicked login button
   - Verified "Welcome" message appeared
   - Screenshot saved: ./screens/testomatio-screenshots/abc123/001/1624200000.png
   - Updated TMS status: PASS ✓
   - Status confirmed by user

5. Executed test case 2/5: "Password reset flow"
   - Clicked "Forgot password"
   - Entered email
   - Blocked: CAPTCHA requires human input
   - Asking user: "Can you solve this CAPTCHA?"

[... continues ...]

Final Summary:
- Total: 5
- Passed: 3
- Blocked: 1
- Skipped: 1

Screenshots available at: ./screens/testomatio-screenshots/abc123/
TMS Run: https://app.testomat.io/projects/xxx/runs/abc123
```

---

## Example 2: User Input (MCP Not Available)

### User Input

```
Pass test cases from tests/signup-flow.test.md
```

### Agent Response (MCP Not Available)

```text
Starting manual test execution session.

1. MCP check: Testomat.io MCP is NOT configured
   ⚠ I can help with local test case execution and screenshots,
      but status updates require manual setup in TMS.

2. Parsed 5 test cases from: tests/signup-flow.test.md

3. Executed test case 1/5: "Sign up with email"
   - Navigated to /signup
   - Filled registration form
   - Clicked "Create Account"
   - Verified confirmation email sent
   - Screenshot saved: ./screens/testomatio-screenshots/001/1624200000.png
   - Suggested status: PASS (set manually in TMS)

[... continues ...]

Final Summary:
- Total: 5
- Passed: 4
- Blocked: 1

Screenshots available at: ./screens/testomatio-screenshots/

⚠ Please set status manually in TMS for each test case.
```

---

## Example 3: Mixed Input (TMS + File)

### User Input

```
Pass these test cases:
- TMS cases: TC-001, TC-002, TC-003
- File: tests/checkout-flow.test.md
```

### Agent Response

```text
Starting manual test execution session.

1. MCP check: Testomat.io MCP is configured ✓

2. Created test run: "Manual-2026-06-21-CheckoutFlow" (ID: xyz789)

3. Parsed 6 test cases total:
   - From TMS: 3 cases (TC-001, TC-002, TC-003)
   - From file: 3 cases (tests/checkout-flow.test.md)

4. Executed test case 1/6: "Add item to cart" (TC-001)
   - Navigated to /products
   - Clicked "Add to Cart" on first item
   - Verified cart badge updated
   - Updated TMS status: PASS ✓

5. Executed test case 2/6: "Complete checkout" (TC-002)
   - Navigated to /cart
   - Clicked "Checkout"
   - Blocked: Payment details require user input
   - Asking user: "Please enter test payment details"

[... continues ...]

Final Summary:
- Total: 6
- Passed: 4
- Failed: 1
- Blocked: 1

Screenshots available at: ./screens/testomatio-screenshots/xyz789/
TMS Run: https://app.testomat.io/projects/xxx/runs/xyz789
```

---

## Example 4: Asking for User Help

### Scenario

Test case step: "Enter promo code and verify discount is applied"

### Agent Response

```text
Test case: "Apply promo code discount"

Executed step 3/5: "Enter promo code SAVE20"
 - Entered promo code in input field
 - Clicked "Apply"
 - Error detected: "Invalid promo code" message appeared

Expected result: "Discount of 20% should be applied"

Issue: The promo code from test case data is not working in the app.

Please help:
1. Verify if the promo code "SAVE20" is still valid
2. If valid, can you check the promo code acceptance behavior?
3. If the code expired, should I mark this as a FAIL (bug in test data)
   or BLOCKED (waiting for valid promo code)?

Expected result from test case: "20% discount applied successfully"
```