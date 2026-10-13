# Wiki layout

Product-agnostic. `capabilities/` mirrors `catalog/`: same areas, groups, and features, same relative paths. Naming and grouping are decided in the catalog (`catalog-features`). Every folder has a README.

```
wiki/
  README.md                        # front door → roots, baseline commit
  capabilities/                    # Wiki > Capabilities
    README.md                      # areas index
    {area}/                        # Wiki > Capabilities > {Area}
      README.md                    # features index
      {feature}.md                 # Wiki > … > {Feature}  — leaf
      {group}/                     # optional extra nesting
        README.md
        {feature}.md
  catalog/                         # code catalog, written by catalog-features; read-only here
    {area}/{feature}.yaml          # same relative path as the feature page
  mismatches/                      # optional — create when a disagreement exists
    README.md                      # index by kind
    {mismatch}.md                  # one behavior, every source that disagrees
```

Create `mismatches/` when code disagrees with comments, infra, docs etc. in the repo. Issues, requirements, and user docs outside the repo are compared by `wiki-cross-check`.

## Rules

| Rule | Do |
| --- | --- |
| Default | `capabilities/{area}/{feature}.md` |
| Share | One page owns a shared rule; others link. Same behavior, two entries → one page. |
| Growth | New catalog item → new leaf + one new index line. Do not thicken an existing leaf into a mega-page. |
| Overview first | Indexes exist before any leaf is written. |

## Formatting

Every page: `# Title`, then a breadcrumb that matches folders, then the body. Omit empty sections. Relative links only.

**Index** (any `README.md`): title + breadcrumb + a bullet list. No Requirement or Acceptance.

| File | Body |
| --- | --- |
| `wiki/README.md` | Every root folder in `wiki/`: link + purpose. Baseline: commit (`git rev-parse HEAD`) and date the wiki reflects |
| `capabilities/README.md` | Every area: link + purpose (markdown indexes only — not catalog YAML) |
| `capabilities/{area}/README.md` | Every child feature (or group): link + purpose |
| Extra group `README.md` | Every child feature (or deeper group): link + purpose |

**Leaf** (`{feature}.md`): headings in this order only — Requirement, Acceptance. After the breadcrumb, a relative link to the paired catalog YAML. Claimed but unwired behavior is not a feature heading — it goes in `mismatches/` only. Code references live in catalog YAML (`sources`, `tests`), never on the feature page.

## Catalog

`catalog/` is the code catalog from the `catalog-features` skill: one YAML per feature with `entry`, `sources`, `tests`, and actual behaviors.

Repo paths are written only in catalog YAML and mismatch pages.

## Mismatches

Create `mismatches/` when code disagrees with a **claim**: anything else in the repo that describes behavior (comment, docstring, README, developer docs, API spec, config, infra, test).

| Kind | Meaning | Example |
| --- | --- | --- |
| Not implemented | A claim describes behavior the code lacks | README lists CSV export; no export code exists |
| Differs | Code has the behavior, but its details contradict the claim | Docstring says sessions expire after 30 min; code uses 60 |
| Unwired | Stub, flag, config, or route for behavior users cannot reach | `bulk_export` flag defined; nothing reads it |

`mismatches/README.md`: title + breadcrumb + one section per kind; each item links its page.

Mismatch page: `# {Behavior}`, breadcrumb, kind, link to the feature page (when one exists), then one row per source. Link every source that justifies it (omit none that exist); Code row always.

| Source | Says | Link |
| --- | --- | --- |
| Code (actual) | … | Implementing files, or `not found` + where searched |
| Comment, docstring, docs, API spec, config, infra, or test | … | Repo path |
