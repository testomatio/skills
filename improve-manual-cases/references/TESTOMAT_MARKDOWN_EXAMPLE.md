<!-- suite
id: @S0a913eee
emoji: 
-->
# Home Page Validation

## PURPOSE
-------
Verify that a guest user can view all critical UI elements on the Home page and ensure proper functionality of interactive components.

## COVERAGE
--------
- Page title verification
- Footer copyright text & links visibility verification

## PREREQUISITES & SETUP
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
id: @Ts37c7ttt
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
* Wait for page to fully load.
   *Expected*: Page is loaded.
   *Expected*: Title is displayed correctly with needed text.
* Observe the browser tab title.
   *Expected*: Browser tab title contains "UI Test Automation Playground".

<!-- test
id: @T693f9c26
priority: normal
-->
# Verify Footer copyright text & links visibility 

## Description:
Verify that the footer has correct copyright text & active links

## Preconditions:
1. Navigate to application base URL: "http://site.com"

## Steps:
* Wait for page to fully load.
   *Expected*: Page is loaded.
* Observe the browser tab title.
   *Expected*: Footer has correct copyright text.
   *Expected*: Footer has active links.