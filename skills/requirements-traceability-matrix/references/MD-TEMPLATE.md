# MD template for RTM

```markdown
# Traceability matrix

## Summary

| Coverage          | Requirements | %   |
| ----------------- | ------------ | --- |
| Covered           | {n}          | {%} |
| Partially covered | {n}          | {%} |
| Not covered       | {n}          | {%} |
| Unclear           | {n}          | {%} |
| Total             | {n}          | 100 |

Test cases: {n} in scope, {n} orphan.

## Matrix

{forward or backward table}

## Gaps

### Not covered
- {requirement ID}: {title}

### Partially covered
- {requirement ID}: {title}. Not checked: {ACs, conditions, values}. Tests: {test IDs}

### Unclear
- {requirement ID}: {title}. Missing: {what}

## Orphan tests

{orphan tests table (only for forward matrix)}

## Excluded
- {requirement ID or test case ID}: {reason}

Requirements: {source, scope}. Test cases: {source, scope}. Date: {date}. One line each.
```