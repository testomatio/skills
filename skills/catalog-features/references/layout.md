# Catalog layout

Source folder per source inside `actual/` or `expected/` in `requirements/`.

```
requirements/
  actual/                    # strict name: how it works now
    {source-name}/           # source folder of a source with role Actual
  expected/                  # strict name: what was intended to be built
    {source-name}/           # source folder of a source with role Expected
```

Inside a source folder, the catalog puts the source's features into areas; `.source/` keeps the raw source items the features come from.

```
{source-name}/               # source folder, inside actual/ or expected/ (above)
  features/
    .catalog/                # the catalog
      README.md              # source facts, counts, areas, features without an area
      {feature}.yaml         # feature without an area
      {area}/                # area: related features; optional; any depth
        README.md            # the area's own link/path, subarea if any, its features
        {feature}.yaml       # feature YAML (below)
        {subarea}/           # subarea (optional)
          README.md          # the subarea own link/path, name, its features; breadcrumbs
          {feature}.yaml
    {area}/                  # NOT written by this skill: feature pages
      {feature}.md           # one page per feature YAML: description, behaviors
  .source/                   # raw source items (below)
    README.md                # every source item, its status and its feature
    {source-item}.md         # raw content of one issue, page, etc.
    {area}/                  # optional: area, as the source arranges its items
      {source-item}.md
  mismatches/                # NOT written by this skill: mismatches inside this source
```

Feature pages: the readable side of the catalog. The catalog says which features exist and where they are described; a feature page says what the feature does. They sit in `features/` next to `.catalog/`, in the same areas, one `{feature}.md` per `{feature}.yaml`.

## Formatting

Every `.md` should include info about its entity and child entities list (if any). Relative links between pages of the source folder.

Source `README.md`: source name, scope, sitemap (links to what exists in the source folder).

README.md in catalog root:

| Fact    | Value                                                                                                 |
| ------- | ----------------------------------------------------------------------------------------------------- |
| Type    | Code, issue tracker, requirements, user docs or any other                                             |
| Role    | Actual or Expected (SKILL.md › Source roles)                                                          |
| Scope   | Defined by user (or inferred)                                                                         |
| History | Important for sources like issue tracker                                                              |
| Access  | MCP, CLI, URL, files                                                                                  |
| Date    | Date of this sync; code: baseline commit and its date; issue tracker: date of creation and resolution |
| Domain  | What the product does and for whom; infer if not given                                                |

## Feature YAML

Name: {feature-name}.yaml

Feature YAML should include:

- Key [optional]. Do not invent. Use only if the source provides one for the feature itself (e.g. its epic).
- Title: short description of the feature.
- Status: Expected only (SKILL.md › Status).
- Links/headings: link(s) to the source items that describe the feature (url, repo path, etc.); headings in case source is a document. Expected: per source item its key, its file in `.source/`, its status; with history: its dates of creation and resolution.

No description, requirements or other details.

## Source items

Expected only (don't copy source code to the `.source/`).

- One file per source item (issue, page, document), named from its key or title: `PAY-112.md`, `saved-cards.md`. Area folders are optional: as the source arranges its items (epic, parent page, nav section).
- Front matter: what the source gives: key, title, status, updated, url. Issues: Issue item.
- Body: the item's content as is.
- `.source/README.md`: one row per source item: the item (key, title, link to its file), its status, its feature (area › title, link to its feature YAML). No feature (task, chore, spike) → `—` and why.
- `update`: rewrite changed source items, remove the ones gone from scope.

### Issue item

Required, when the source has them:

- Front matter: key, title, type, status, resolution, created, updated, resolved, url, `parent` (epic or parent issue), `links` (relation, key, title, status), `subtasks` (key, title, status).
- Body: description, acceptance criteria, every comment with its author and date.
- Linked issue out of scope → keep the link, don't save the issue.
- Missing required field → fetch it; no access → open question in the catalog README.
