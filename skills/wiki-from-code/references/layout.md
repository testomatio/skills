# Wiki layout

`features/` mirrors `features-catalog/`: same areas and subareas, one feature page per catalog feature. Every folder has a README.

```
{output}/                    # output folder
  README.md                  # sitemap, baseline commit
  features-catalog/          # code catalog (catalog-features)
  features/
    README.md                # areas
    {area}/                  # any depth, as in the catalog
      README.md              # subareas and features
      {feature}.md           # feature page
      {subarea}/             # as in the catalog
        README.md            # subareas and features
        {feature}.md         # feature page
  mismatches/                # code vs claims in the repo
    README.md                # index
    {mismatch}.md            # one behavior, every source that disagrees
```

## Catalog feature YAML

- No key (cause does not exist in code).
- `links` become `code` paths.

```yaml
# features-catalog/checkout/pay-with-saved-card.yaml
title: Pay with saved card      # catalog-feature
code:                           # implementation files
  - src/api/cards.ts
tests:                          # tests that cover the feature
  - test/checkout/cards.spec.ts
```

## Mismatches

`mismatches/README.md` missing → create it: `# Mismatches`, breadcrumb. Write the list of mismatches with links to their pages.

### Mismatch page

Mismatch page should include:

- `Kind`: not implemented, differs, unwired/not used, etc.
- `Title`: the feature area and title.
- `Difference`: one line, what disagrees, current behavior vs claim.
- `Sources`: one row per source; Code row always, first. Code, Comment, Docstring, README, Developer docs, API spec, Config, Infra, Test, etc.
- `Impact`: who is affected and how; the Report orders mismatches by it.
- `Updated`: date the cited line last changed (`git blame --date=short -L {line},+1 -- {path}`); doc section without a line: the section's last change.
- `Solution`: suggested fix.
- Other info required to explain the mismatch.