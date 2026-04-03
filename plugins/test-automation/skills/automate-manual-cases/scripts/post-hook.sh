#!/usr/bin/env bash
#
# PostHook: Final verification after skill completes
# Usage: ./scripts/post-hook.sh [test-file-path]
#

set -e

echo "=========================================="
echo "POST-HOOK: Final Verification"
echo "=========================================="

# Default test file from argument or environment
TEST_FILE="${1:-${TEST_FILE:-}}"
BASE_URL="${BASE_URL:-http://localhost:3000}"

if [ -z "$TEST_FILE" ]; then
    echo "⚠️  No test file specified. Skipping test execution."
    echo "Usage: ./scripts/post-hook.sh tests/my-test.spec.ts"
    exit 0
fi

echo ""
echo "1. Checking test file exists..."
if [ -f "$TEST_FILE" ]; then
    echo "   ✅ Test file found: $TEST_FILE"
else
    echo "   ❌ Test file NOT found: $TEST_FILE"
    exit 1
fi

echo ""
echo "2. Determining test framework..."
if grep -q "playwright\|@playwright/test" "$TEST_FILE" 2>/dev/null; then
    FRAMEWORK="playwright"
elif grep -q "codeceptjs\|Codecept" "$TEST_FILE" 2>/dev/null; then
    FRAMEWORK="codeceptjs"
elif grep -q "cypress" "$TEST_FILE" 2>/dev/null; then
    FRAMEWORK="cypress"
else
    FRAMEWORK="unknown"
    echo "   ⚠️  Could not detect framework"
fi
echo "   Detected: $FRAMEWORK"

echo ""
echo "3. Running test to verify stability..."
case "$FRAMEWORK" in
    playwright)
        npx playwright test "$TEST_FILE" --reporter=list || {
            echo "   ❌ Test failed on stability check"
            exit 1
        }
        ;;
    codeceptjs)
        npx codeceptjs run "$TEST_FILE" --reporter=spec || {
            echo "   ❌ Test failed on stability check"
            exit 1
        }
        ;;
    cypress)
        npx cypress run --spec "$TEST_FILE" || {
            echo "   ❌ Test failed on stability check"
            exit 1
        }
        ;;
    *)
        echo "   ⚠️  Skipping execution (unknown framework)"
        ;;
esac

echo ""
echo "=========================================="
echo "✅ POST-HOOK COMPLETE"
echo "=========================================="
