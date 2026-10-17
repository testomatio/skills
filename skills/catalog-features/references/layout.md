# Catalog layout

One catalog per source, in the output folder. The tree mirrors how the source groups its content: code areas, epics, page tree, docs nav.

```
{features-catalog}/                    # output folder
  README.md                  # source facts, counts, areas, ungrouped items
  {area}/                    # code area, epic, parent page, nav section; any depth
    README.md                # the area own link, subarea if any, its items
    {feature}.yaml           # feature page
    {subarea}/               # subarea (optional)
      README.md              # the subarea own link, its items
      {feature}.yaml         # feature page
    ...
```

## Formatting

Every `.md` should include info about its entity and child entities list (if any). Relative links between catalog pages.

README.md in catalog root:

| Fact    | Value                                                     |
| ------- | --------------------------------------------------------- |
| Type    | Code, issue tracker, requirements, user docs or any other |
| Role    | Intended , documented or actual                           |
| Scope   | Defined by user (or inferred)                             |
| History | Important for sources like issue tracker                  |
| Access  | MCP, CLI, URL, files                                      |
| Date    | Date of this sync; code: baseline commit and its date     |
| Domain  | What the product does and for whom; infer if not given    |

## Feature YAML

Feature YAML should include:

- Key [optional]: the source id. Do not invent. Use only if the source provides it.
- Title: short description of the feature.
- Sources: link(s) to source that describe the feature (url, repo path, etc.).
- Entry: words which human will use to find the feature.
