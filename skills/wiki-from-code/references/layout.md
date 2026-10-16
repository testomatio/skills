# Wiki layout

Product-agnostic. `capabilities/` mirrors `catalog/`: same areas and groups, same relative paths, one feature page per catalog item. Naming and grouping are decided in the catalog (`catalog-features`). Every folder has a README.

```
wiki/
  README.md                        # front door → roots, baseline commit
  capabilities/                    # Wiki > Capabilities
    README.md                      # areas index
    {area}/                        # Wiki > Capabilities > {Area}
      README.md                    # features index
      {feature}.md                 # Wiki > … > {Feature}  — leaf
      {feature}.yaml               # the leaf's code references
      {group}/                     # optional extra nesting
        README.md
        {feature}.md
        {feature}.yaml
  catalog/                         # code catalog, written by catalog-features; read-only here
    README.md                      # areas, baseline commit
    {area}/README.md               # one line per feature: title + main code paths
  mismatches/                      # optional — create when a disagreement exists
    README.md                      # index by kind
    {mismatch}.md                  # one behavior, every source that disagrees
```

Create `mismatches/` when code disagrees with comments, infra, docs etc. in the repo. Issues, requirements, and user docs outside the repo are compared by `requirements-cross-check`.

## Rules

| Rule | Do |
| --- | --- |
| Default | `capabilities/{area}/{feature}.md` |
| Names | Folders reuse the catalog's folder names. `{feature}`: kebab-case of the catalog item title. Catalog title changed → rename the page and its feature YAML, fix every link to them. |
| Share | One page owns a shared rule; others link. Same behavior, two entries → one page. |
| Growth | New catalog item → new leaf + its feature YAML + one new index line. Do not thicken an existing leaf into a mega-page. |
| Overview first | Indexes exist before any leaf is written. |

## Formatting

Every page: `# Title`, then a breadcrumb that matches folders, then the body. Omit empty sections. Relative links only.

**Index** (any `README.md`): title + breadcrumb + a bullet list. No Requirement or Acceptance.

| File | Body |
| --- | --- |
| `wiki/README.md` | Every root folder in `wiki/`: link + purpose. Baseline: commit (`git rev-parse HEAD`) and date the wiki reflects |
| `capabilities/README.md` | Every area: link + purpose (markdown indexes only — not feature YAML) |
| `capabilities/{area}/README.md` | Every child feature (or group): link + purpose |
| Extra group `README.md` | Every child feature (or deeper group): link + purpose |

**Leaf** (`{feature}.md`): headings in this order only — Requirement, Acceptance. Acceptance: one behavior per bullet, as [behaviors.md](behaviors.md) describes. After the breadcrumb, a relative link to its feature YAML. Claimed but unwired behavior is not a feature heading — it goes in `mismatches/` only. Code references live in the feature YAML, never on the feature page.

## Catalog

`catalog/` is the code catalog from the `catalog-features` skill: areas, features, and each feature's main code paths. No behaviors: they live on feature pages, under Acceptance.

## Feature YAML

`{feature}.yaml` next to each leaf, written by this skill: the feature's code references.

```yaml
# capabilities/checkout/pay-with-saved-card.yaml
entry:          # what a human would use to find the behavior
  - POST /api/v1/orders
  - UI /checkout
  - Job SettlePayments
sources:        # implementation only; starts from the catalog paths
  - src/checkout/cards.ts
tests:
  - test/checkout/cards.spec.ts
```

Repo paths are written only in the catalog, feature YAML, and mismatch pages.

## Mismatches

Create `mismatches/` when code disagrees with a **claim**: anything else in the repo that describes behavior (comment, docstring, README, developer docs, API spec, config, infra, test).

| Kind | Meaning | Example |
| --- | --- | --- |
| Not implemented | A claim describes behavior the code lacks | README lists CSV export; no export code exists |
| Differs | Code has the behavior, but its details contradict the claim | Docstring says sessions expire after 30 min; code uses 60 |
| Unwired | Stub, flag, config, or route for behavior users cannot reach | `bulk_export` flag defined; nothing reads it |

`mismatches/README.md`: title + breadcrumb + one section per kind; each item links its page.

Mismatch page: `# {Behavior}`, breadcrumb, kind, link to the feature page (when one exists), then one row per source. Link every source that justifies it.
