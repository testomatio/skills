# Code

Application repository.

Defaults: role actual, coverage complete, history no, no status filter.

## Access

- Read the repository. Scope: the whole repo, or the apps and paths the user names. Store it.
- Synced: baseline commit (`git rev-parse HEAD`) and its date.

## Tree

- Areas → features, named from **what the product does** for its users, not from the stack or code folders. Follow the repo's naming convention (kebab-case by default).
- Inventory is shallow: the area → feature list first, no behaviors. If names are ambiguous, stop and show the list.
- Add a group folder when an area is crowded or a cluster needs a name. Any depth.
- One item per feature, not per file. Same behavior in two places → one item.

## Behaviors

- Current-state code only: what runs now, as an observable outcome.
- Comments, docstrings, developer docs, API specs, configs, and tests are claims about the code, not behaviors. `wiki-from-code` records where they disagree with it.
- Stubs, flags, and routes users cannot reach: no behavior.

## Update

- `git diff --stat {baseline}..HEAD`; map changed paths to items through `sources` and `tests`. Re-parse those items.
- Changed paths no item covers → new features in an existing or new area.
- Every `sources` path deleted → remove the item and its index lines.
- No baseline or no git: re-parse everything.
- Keep area and feature names and paths unless the product changed; renames break links.

## Extra fields

```yaml
entry:          # what a human would use to find the behavior
  - POST /api/v1/orders
  - UI /checkout
  - Job SettlePayments
sources:        # implementation only
  - path/to/code
tests:
  - TestOrSpecFile
```

- No `key`, `url`, `path`, or `status`.
- `updated`: `git log -1 --format=%cs -- {sources}`.
- Every `sources` and `tests` path exists in the repo.
