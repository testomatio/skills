# Wiki layout

`features/` mirrors `catalog/`: same folders, one feature page and one feature YAML per catalog item. Naming and grouping are decided in the catalog (`catalog-features`). Every folder has a README.

```
{output}/                    # output folder
  README.md                  # sitemap, baseline commit
  catalog/                   # code catalog (catalog-features)
  features/
    README.md                # areas
    {area}/                  # any depth, as in the catalog
      README.md              # groups and features
      {feature}.md           # feature page
      {feature}.yaml         # its code references
  mismatches/                # shared with detect-product-mismatches
    README.md                # index; this skill owns its Code vs repo section
    {mismatch}.md            # one behavior, every source that disagrees
```

## Names

- Folders reuse the catalog's folder names. `{feature}`: kebab-case of the catalog item title. Catalog title changed → rename the page and its feature YAML, fix every link to them.
- One page owns a shared rule; others link.

## Formatting

Every page: `# Title`, then a breadcrumb that matches folders, then the body. Omit empty sections. Relative links only.

| File                           | Body                                                                                                                                     |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `README.md`                    | Every folder: link + purpose. Baseline: commit (`git rev-parse HEAD`) and date the wiki reflects                                         |
| `README.md` in `features/`     | Every child area, group, or feature: link + purpose                                                                                      |
| `{feature}.md`                 | Link to its feature YAML; then headings Requirement, Acceptance only. Acceptance: one behavior per bullet ([behaviors.md](behaviors.md)) |

Repo paths only in the catalog, feature YAML, and mismatch pages.

## Feature YAML

```yaml
# features/checkout/pay-with-saved-card.yaml
entry:          # what a human would use to find the behavior
  - POST /api/v1/orders
  - UI /checkout
  - Job SettlePayments
sources:        # implementation only; starts from the catalog paths
  - src/checkout/cards.ts
tests:
  - test/checkout/cards.spec.ts
```

## Mismatches

Code disagrees with a **claim**: anything else in the repo that describes behavior (comment, docstring, README, developer docs, API spec, config, infra, test). Pages listed in the Cross-check section of `mismatches/README.md` belong to `detect-product-mismatches`: never edit them.

| Kind            | Meaning                                                      | Example                                                   |
| --------------- | ------------------------------------------------------------ | --------------------------------------------------------- |
| Not implemented | A claim describes behavior the code lacks                    | README lists CSV export; no export code exists            |
| Differs         | Code has the behavior, but its details contradict the claim  | Docstring says sessions expire after 30 min; code uses 60 |
| Unwired         | Stub, flag, config, or route for behavior users cannot reach | `bulk_export` flag defined; nothing reads it              |

`mismatches/README.md` missing → create it: `# Mismatches`, breadcrumb. Write one `## Code vs repo` section: one list per kind, page link + sources.

Page: file name kebab-case of the behavior. `# {Behavior}`, breadcrumb, kind, feature page link (when one exists), then a table `Source | Says | Link` with one row per source.
