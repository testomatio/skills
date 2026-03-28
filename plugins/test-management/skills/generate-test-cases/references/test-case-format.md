---
title: Classical Tests Markdown Format
description: Complete reference for the Testomat.io classical tests Markdown format. Learn the structure, metadata fields, and formatting rules for test suites and test cases.
---

# Classical Tests Markdown Format

## Format Overview

The document is structured as:

1. **Suite block** — one per file, with suite metadata and content
2. **Test blocks** — one or more, each with test metadata and content
3. **Examples section** (optional) — parametrized test data in a markdown table

---

## Document Structure

```
<!-- suite
key: value
-->
# Suite Title

Suite description (optional)

<!-- test
key: value
-->
# Test Title

Test description (optional)

<!-- example -->

| Param1 | Param2 |
| --- | --- |
| value1 | value2 |
```

---

## Suite Metadata

Metadata is inside an HTML comment block: `<!-- suite ... -->`.

| Field      | Type   | Description                                                                                        |
| ---------- | ------ | -------------------------------------------------------------------------------------------------- |
| `id`       | string | **Required.** Suite UID in format `@S{uid}` 8-chars (e.g. `@S380c64db`). Used for sync and import. |
| `emoji`    | string | Emoji for the suite (e.g. `🙂`, `🔐`).                                                             |
| `tags`     | string | Comma-separated tags not in the title (e.g. `smoke, regression`).                                  |
| `labels`   | string | Comma-separated labels in `Label: value` or `Label` format (e.g. `Priority:High, Component:Auth`). |
| `assignee` | string | User email for the assignee. Must exist in the project.                                            |

---

## Test Metadata

Metadata is inside an HTML comment block: `<!-- test ... -->`.

| Field      | Type    | Description                                                                                           |
| ---------- | ------- | ----------------------------------------------------------------------------------------------------- |
| `id`       | string  | Test UID in format `@T{uid}` 8-chars (e.g. `@T12345678`). Optional; used for matching existing tests. |
| `type`     | string  | Test state: `manual` or `automated`.                                                                  |
| `priority` | string  | One of: `low`, `normal`, `important`, `high`, `critical`.                                             |
| `assignee` | string  | User email for the assignee. Must exist in the project.                                               |
| `creator`  | string  | User email for the creator (used when `include_meta: [:creator]`).                                    |
| `shared`   | boolean | `true` when the test is shared (used when `include_meta: [:shared]`).                                 |
| `tags`     | string  | Comma-separated tags not in the title.                                                                |
| `labels`   | string  | Comma-separated labels in `Label: value` or `Label` format.                                           |

If the test has no assignee but the suite does, the suite assignee is used.

---

## Formatting Rules

### 1. Metadata blocks

- Metadata must be inside HTML comments: `<!-- suite ... -->` and `<!-- test ... -->`.
- Each line is `key: value`; lines without `:` are ignored.
- Keys and values are trimmed of surrounding whitespace.

### 2. Headings

- **Suite title:** first `#` heading after the suite metadata block.
- **Test title:** first `#` or `##` heading after each test metadata block.
- Only these headings are used for titles; other headings are part of the description.

### 3. Suite and test blocks

- Suite block starts with `<!-- suite`.
- Test blocks start with `<!-- test`.
- Each test block is separated by `<!-- test`; the parser splits on `(?=<!--\s*test\b)`.

### 4. Examples section

- Introduced by `<!-- example -->` (optional content after `-->`).
- Must be a markdown table.
- **Table format:** rows must start with `| ` and end with ` |`.
- **Headers:** first row after `<!-- example -->` is header.
- **Separator:** next row must contain `---` (3+ dashes) in each cell to mark headers.
- **Data rows:** rows after the separator are example rows.
- **Params:** if a separator row exists, the row above it is used as `params` (column names).
- **No params:** if there is no separator row, all rows are data rows.

### 5. Tags

- In title: `@tag` format (e.g. `Test @smoke @regression`).
- In metadata: comma-separated without `@` (e.g. `tags: smoke, regression`).
- Valid tag characters: `\w`, `\d`, `=`, `-`, `_`, `()`, `.`, `:`, `&`, length < 120.
- Tags in metadata must not include suite/test IDs (`@S...`, `@T...`).

### 6. Labels

- Format: `LabelTitle` or `LabelTitle: value`.
- Labels are matched by title or slug in the project.
- Labels with values use `:` as separator.

### 7. Attachments

- All attached items as links: `https://app.testomat.io/attachments/{uid}.{ext})`

### 8. Description

- Everything after the test heading until the next `<!-- test` or `<!-- example` is the test description.
- Description supports standard markdown.

### 9. Test Steps Format

Test steps use the `## Steps` header section with a nested markdown list format:

```markdown
## Steps

- (Step Action)
  _Expected_: ... (Observable behavior)
- ...
  _Expected_: ...
```

**Step format rules:**

- Steps must be under a `## Steps` heading
- Use nested markdown lists (bulleted `*` or numbered `1.`)
- Top-level items describe the action to perform
- Nested items with `*Expected*` (or `*Expected*:`, `*Expected result*`) describe the observable behavior
- Expected results should be specific and verifiable

---

## Examples

### Minimal suite with one test

```markdown
<!-- suite
id: @S12345678
-->

# Login Suite

Tests for login functionality.

<!-- test
-->

# Successful Login

User can log in with valid credentials.
```

### Full suite with metadata and examples

```markdown
<!-- suite
id: @S380c64db
emoji: 🔐
tags: smoke, regression
assignee: qa@example.com
-->

# Login Functionality

This suite contains manual tests for the login process.

<!-- test
id: @T12345678
type: manual
priority: high
assignee: qa@example.com
tags: critical
-->

# Successful Login

A user should be able to log in with valid credentials.

## Steps

- Navigate to the login page
  _Expected_: Login form is displayed with username and password fields
- Enter a valid username and password
  _Expected_: Credentials are entered without errors
- Click the "Login" button
  _Expected_: User is redirected to the dashboard

<!-- example -->

| Username | Password | Role  |
| -------- | -------- | ----- |
| admin    | admin123 | admin |
| user     | user123  | user  |
```

### Test with proper step format

```markdown
<!-- suite
id: @S11111111
-->

# User Registration

Tests for user registration functionality.

<!-- test
id: @T22222222
type: manual
priority: high
-->

# Register new user with valid data

Verify that a new user can successfully register with valid information.

## Steps

- Navigate to the registration page
  _Expected_: Registration form is displayed
- Enter a valid email address
  _Expected_: Email is accepted and passes validation
- Enter a strong password (8+ characters with uppercase, lowercase, and numbers)
  _Expected_: Password meets complexity requirements
- Confirm the password
  _Expected_: Passwords match
- Accept the Terms of Service
  _Expected_: Checkbox is selected
- Click the "Register" button
  _Expected_: Success message is displayed and user is redirected to welcome page
```

### Test with numbered steps

```markdown
<!-- suite
id: @S33333333
-->

# API Testing

Tests for REST API endpoints.

<!-- test
id: @T44444444
type: automated
priority: critical
-->

# Create new user via API

Verify that a new user can be created via POST request.

## Steps

1. Send POST request to `/api/users` with valid user data
   _Expected_: Response status code is 201
2. Verify response contains user ID and created timestamp
   _Expected_: Response includes `id` and `createdAt` fields
3. Send GET request to `/api/users/{id}` to retrieve the created user
   _Expected_: User data matches the data sent in POST request
```

### Test with complex nested steps

```markdown
<!-- suite
id: @S55555555
emoji: 🛒
-->

# E-commerce Checkout

Tests for the checkout process.

<!-- test
id: @T66666666
type: manual
priority: high
-->

# Complete checkout with multiple items

Verify that a user can complete the checkout process with multiple items in the cart.

## Steps

- Add multiple products to the cart
  _Expected_: All products appear in the cart with correct quantities and prices
- Proceed to checkout
  _Expected_: Checkout page loads with shipping address form
- Fill in valid shipping address details
  _Expected_: Form validation passes and shows no errors
- Select a shipping method
  _Expected_: Shipping cost is calculated and displayed
- Select a payment method
  _Expected_: Payment form is displayed (or guest checkout option)
- Complete the payment process
  _Expected_: Payment is processed successfully
- Verify order confirmation
  _Expected_: Order confirmation page is displayed with order number and summary
- Check email for order confirmation
  _Expected_: Confirmation email is received with matching order details
```

### Test with tags in title

```markdown
<!-- test
-->

# API test with multiple endpoints @smoke @regression

Test API endpoints with different parameters

<!-- example -->

| Endpoint | Method | Status |
| -------- | ------ | ------ |
| /users   | GET    | 200    |
| /posts   | POST   | 201    |
```

### Examples without params (no header row)

```markdown
<!-- test
-->

# Test with Examples No Params

Test description

<!-- example
-->

| Value1 | Value2 |
```

### Multiple suites in one file

```markdown
<!-- suite
id: @S12345678
-->

# Suite One

Description for suite one

<!-- test
id: @Ta1b2c3d4
-->

# Test One

Description

<!-- suite
id: @S98765432
-->

# Suite Two

Description for suite two
```
