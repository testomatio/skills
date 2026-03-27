<!-- suite
id: @S0a913xxx
emoji: 🔐
tags: smoke, regression
-->
# Home Page Validation

Verify that a guest user can view all critical UI elements on the Home page.

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
id: @Ts37c7xxx
priority: normal
tags: smoke
labels: Manual
-->
# Verify browser tab title

## Description:
Navigate to application base URL. Verify that the browser tab displays the correct title.

## Preconditions:
1. Navigate to application base URL: "http://site.com"

## Steps:
* Observe the browser tab title
  _Expected_: Title contains "UI Test Automation Playground"

<!-- test
id: @T693f9xxx
priority: normal
tags: smoke
labels: Manual
-->
# Verify footer copyright text & links visibility 

## Description:
Navigate to application base URL. Verify that the footer has correct copyright text and active links.

## Preconditions:
1. Navigate to application base URL: "http://site.com"

## Steps:
* Scroll to footer section
  _Expected_: Footer is visible
* Verify copyright text
  _Expected_: Copyright text is correct (e.g., "© 2024 Company Name")
* Verify footer links are active
  _Expected_: All links are clickable and navigate to correct pages