<!-- testeiya -->
# Requirements Extraction — Examples

These examples use fictional issues and URLs to illustrate extraction, not implementation review.

## Linked issue with a requirement review

### Source material

- PR links issue #42 and states that it adds CSV export of filtered users.
- Issue #42 requests CSV export of the current filtered result set for administrators.
- A requirement-review comment proposes an export notification for large result sets and asks which columns to include.
- A later product decision specifies the columns `Name` and `Email`, but does not approve notifications.

### Output

```markdown
## Linked requirements

- [Export filtered users #42](https://github.com/example/product/issues/42) — administrator CSV export.
- [Requirement review](https://github.com/example/product/issues/42#issuecomment-100) — column question resolved by later discussion; notification remains a proposal.

## Expected behavior

- Administrators can export the current filtered user result set as CSV — [requirement](https://github.com/example/product/issues/42).
- The CSV contains Name and Email columns — [product decision](https://github.com/example/product/issues/42#issuecomment-101).
```

The unapproved notification proposal is not included as expected behavior or raised as a blocker to the requested CSV export.

## Linked issue without a requirement review

### Source material

- PR links bug #57.
- The issue says an explicitly selected priority is overwritten by defect severity.
- Its expected behavior says that the selected priority must be preserved.

### Output

```markdown
## Linked requirements

- [Preserve selected issue priority #57](https://github.com/example/product/issues/57) — prevent defect severity from replacing an explicit priority.

## Expected behavior

- When a user supplies both defect severity and issue priority, the created issue keeps the selected priority — [expected behavior](https://github.com/example/product/issues/57).
```

No full requirement review or new acceptance criteria are needed.

## Unresolved decision

If the linked requirement instead says only “apply the appropriate priority” and no discussion defines that rule, include:

```markdown
## Unresolved decisions

- What determines the issue priority when both a priority and defect severity are supplied? The requirement does not define precedence — [requirement](https://github.com/example/product/issues/57).
```

Do not infer precedence from the implementation.

## No linked issue

Even if the PR describes a feature and the code is accessible, output only:

> No linked requirement found. Requirements extraction skipped.
