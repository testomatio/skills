# Cross-check layout

Adds `cross-check/` to the wiki. Reads catalogs (layout owned by `catalog-features`); never edits them.

```
wiki/
  README.md                  # sitemap; add one line for cross-check/
  catalog/                   # code catalog (catalog-features)
  capabilities/, mismatches/ # code wiki (wiki-from-code); read-only
  sources/
    README.md                # every catalog: link, type, date
    {name}/                  # one catalog per other source (catalog-features)
  cross-check/
    README.md                # compared catalogs, version, check date, coverage, gap index
    map/
      {area}.yaml            # one area's features and their items in every source
    gaps/
      {gap}.md               # one behavior, every compared source
```

## Formatting

Every page: `# Title`, then a breadcrumb that matches folders, then the body. Relative links only.

`cross-check/README.md` body:

1. Compared: one row per source: name, role, coverage, history, catalog link, date (code: baseline commit). Product version compared. Check date.
2. Coverage: one row per area (link to its map), one column per source, cells = features with items / all features; last column = gap count.
3. Gaps: one section per kind; gap pages listed with link + likely cause; feature-level kinds listed as feature name + map link.
4. Open questions: vague claims, unread content that blocks a comparison.

## Map

One YAML per area. File name: kebab-case area name (the catalog area folder when code is the backbone).

```yaml
# cross-check/map/checkout.yaml
area: Checkout
features:
  - name: Pay with saved card
    aliases: [One-click pay]        # names other sources use; omit when none
    items:                          # wiki-root-relative; items of every compared source
      - catalog/checkout/pay.yaml
      - sources/jira/PROJ-100/PROJ-123.yaml
      - sources/confluence/checkout/saved-cards.yaml
      - sources/user-docs/payments/pay.yaml
```

Links go one way: map → items. Catalogs never link to the map.

## Gaps

| Kind | Meaning | Where |
| --- | --- | --- |
| Not implemented | Intended or expected claim the code lacks | Gap page |
| Differs | Sources make incompatible claims about one behavior | Gap page |
| Unspecified | Feature with no item in any intended source; at least one of them has complete coverage | README list |
| Undocumented | User-facing feature with no user-docs item; the docs have complete coverage | README list |
| Missing in {source} | Feature with no item in another source that has complete coverage | README list |

Gap page: `# {Behavior}`, breadcrumb, kind, likely cause, feature (name + map link), then one row per compared source.

| Source | Says | Updated | Link |
| --- | --- | --- | --- |
| Code (actual) | Expired cards are listed and disabled | 2026-08-30 | Catalog YAML + implementing files, or `not found` + where searched |
| Jira (intended) | Expired cards are listed and disabled | 2026-08-28 | Item + its URL |
| Confluence (intended) | Expired cards are hidden | 2026-01-10 | Item + its URL or path |
| User docs (expected) | silent | | Where searched |

- Code row always, when code is compared.
- Superseded items of a source with history: omit, or mark `superseded by {key}` when it explains the gap.
- A matching `mismatches/` page (code vs repo claims): link it below the table; do not restate it.
