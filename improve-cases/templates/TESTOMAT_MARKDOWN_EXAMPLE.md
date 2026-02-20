<!-- suite
id: @S0a913eee
emoji: 
-->
# Home Page Validation

### PURPOSE
-------
Verify that a guest user can view all critical UI elements on the Home page and ensure proper functionality of interactive components.

### COVERAGE
--------
- Page title verification
- H1 header validation
- Citation block verification
- Footer copyright text
- Footer links visibility and functionality

### PREREQUISITES & SETUP
--------------------
1. Browser Requirements:
   - Latest version of Chrome, Firefox, or Safari

2. Test Environment:
   - Application URL: "http://site.com"
   - Screen resolution: 1920x1080 (recommended)
   - Browser zoom: 100%

3. Test Data:
   - No specific test data required
   - Guest user access (no authentication needed)

4. Pre-test Setup:
   - Clear browser cache and cookies
   - Close all unnecessary browser tabs
   - Ensure browser window is maximized

<!-- test
id: @T937c7ttt
priority: normal
tags: @smoke
labels: Manual
-->
# Verify Browser Tab Title

## Description:
Verify that the browser tab displays the correct title when accessing the Home page.

## Preconditions:
1. Navigate to application base URL: "http://site.com"

## Steps:
1. Wait for page to fully load
2. Observe the browser tab title

## Expected Results:
- Browser tab title contains "UI Test Automation Playground"
- Title is displayed correctly in the browser tab
- No encoding issues or special character problems

<!-- test
id: @T693f9c26
priority: normal
-->
# Verify H1 Header

## Description:
Verify that the main H1 heading is displayed correctly on the Home page.

## Preconditions:
1. Navigate to application base URL: "http://site.com"

## Test Steps:
1. Wait for page to fully load
2. Locate the main heading (H1 element)
3. Verify the heading text content

## Expected Results:
- H1 header is visible on the page
- Header text displays: "UI Test Automation Playground"
- Header is properly formatted as H1 (largest heading)
- Header is positioned appropriately on the page