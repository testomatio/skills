# Cross-check layout

Reads catalogs (layout owned by `catalog-features`); never edits them. Writes mismatch pages into `mismatches/`, shared with `wiki-from-code`.

```
{output}/                    # output folder
  README.md                  # sitemap, when present; one line for mismatches/
  catalog/                   # code catalog (wiki-from-code), when present
  features/                  # code wiki (wiki-from-code), when present
  sources/
    README.md                # every catalog here: name, type, link, synced date
    {name}/                  # one catalog per source, code too when there is no catalog/ (catalog-features)
  mismatches/                # shared with wiki-from-code
    README.md                # index; this skill owns its Cross-check section
    {mismatch}.md            # one behavior, every compared source
```

This skill's pages are the ones its Cross-check section lists. Other pages belong to `wiki-from-code`: never edit them.

## Formatting

Every page: `# Title`, then a breadcrumb that matches folders, then the body. Relative links to pages in the output folder and to repo paths; source items as key + URL.

## Kinds

| Kind                | Meaning                                                                   | Where       |
| ------------------- | ------------------------------------------------------------------------- | ----------- |
| Differs             | Sources disagree on one behavior: values, conditions, roles, labels, flow | Page        |
| Not implemented     | Behavior from another source that the code lacks                          | Page        |
| Missing in {source} | Feature with no item in a source that should have it (SKILL.md › Sources) | README list |

## README

`mismatches/README.md` missing → create it: `# Mismatches`, breadcrumb. Write one `## Cross-check` section; leave the rest to `wiki-from-code`.

1. Compared: one row per source: name, role, coverage, history, catalog link, synced date (code: baseline commit). Product version. Check date.
2. Differs, Not implemented: page link + sources + likely cause.
3. Missing features: one list per silent source (Not implemented, Unspecified, Undocumented, Missing in {source}): feature + where found (catalog item links) + where searched.
4. Open questions: vague behaviors, unread content that blocks a comparison.

## Page

File name: kebab-case of the behavior. `# {Behavior}`, breadcrumb, kind, likely cause, feature name, then one row per compared source.

| Source                | Says                                  | Updated    | Link                                                               |
| --------------------- | ------------------------------------- | ---------- | ------------------------------------------------------------------ |
| Code (actual)         | Expired cards are listed and disabled | 2026-08-30 | Catalog item + implementing files, or `not found` + where searched |
| Jira (intended)       | Expired cards are listed and disabled | 2026-08-28 | Key + URL                                                          |
| Confluence (intended) | Expired cards are hidden              | 2026-01-10 | Title + URL or path                                                |
| User docs (expected)  | silent                                |            | Where searched                                                     |

- `Says`: the source's behavior, as [features.md](features.md) › Behaviors describes; `silent` when it has none.
- `Updated`: the item's date, read at the source (SKILL.md › Likely cause).
- Code row always, when code is compared.
- Superseded items of a source with history: omit, or mark `superseded by {key}` when it explains the mismatch.
- A `wiki-from-code` page on the same behavior: link it below the table; do not restate it.
