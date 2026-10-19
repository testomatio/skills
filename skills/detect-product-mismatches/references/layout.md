# Mismatches layout

Reads catalogs (layout owned by `catalog-features`) and feature pages (owned by `wiki-from-code`); changes them only through those skills (SKILL.md › 2. Catalogs). Writes mismatch pages into `mismatches/`

```
mismatches/                  # output folder
  README.md                  # sitemap; one line each
  sources/
    README.md                # every catalog here: name, type, role, link, Date
    {name}/                  # source name
      features-catalog/      # `catalog-features` skill output
      features/              # [optional] feature pages (wiki-from-code), when present
  mismatches/
    README.md                # index
    {mismatch}.md            # one mismatch per disagreement, every compared source
```

## Formatting

Every page: `# Title`, then a breadcrumb that matches folders, then the body. Relative links to pages in the output folder and to repo paths; source features as key + URL.

## Kinds

| Kind                | Meaning                                                                      | Where       |
| ------------------- | ---------------------------------------------------------------------------- | ----------- |
| Differs             | Sources disagree on one behavior: values, conditions, roles, labels, flow    | Page        |
| Not implemented     | Behavior from another source that the code lacks                             | Page        |
| Missing in {source} | Feature a source is silent on, within its catalog Scope (SKILL.md › Sources) | README list |

## README

`mismatches/README.md` missing → create it: `# Mismatches`, breadcrumb. Write the mismatches list.

1. Compared: one row per source: name, role, scope, history, catalog link, Date (code: baseline commit). Product version. Check date.
2. Differs, Not implemented: page link + sources + likely cause.
3. Missing features: one list per silent source (Not implemented, Unspecified, Undocumented, Missing in {source}): feature + where found (catalog feature links) + where searched.
4. Open questions: vague behaviors, unread content, or unclear Scope that blocks a comparison.

## Page

File name: kebab-case of the behavior. `# {Behavior}`, breadcrumb, then:

- `Kind`: Differs or Not implemented.
- `Title`: the feature area and title; link to its feature page in `features/`, when present.
- `Difference`: one line, what disagrees.
- `Likely cause`: SKILL.md › Likely cause.
- `Impact`: who is affected and how; the Report orders mismatches by it.
- `Sources`: one row per compared source.

| Source                 | Says                                  | Updated    | Link                                                                |
| ---------------------- | ------------------------------------- | ---------- | ------------------------------------------------------------------- |
| Code (actual)          | Expired cards are listed and disabled | 2026-08-30 | Catalog feature + its `code` paths, or `not found` + where searched |
| Jira (intended)        | Expired cards are listed and disabled | 2026-08-28 | Key + URL                                                           |
| Confluence (intended)  | Expired cards are hidden              | 2026-01-10 | Title + URL or path                                                 |
| User docs (documented) | silent                                |            | Where searched                                                      |

- `Says`: the source's behavior, as [features.md](features.md) › Behaviors describes; `silent` when it has none.
- `Updated`: the date read at the source (SKILL.md › Likely cause).
- Code row always, first, when code is compared.
- Superseded issues of a source with history: omit, or mark `superseded by {key}` when it explains the mismatch.
