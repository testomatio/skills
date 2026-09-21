# Wiki layout

Product-agnostic. Name `{area}` / `{feature}` (and any extra group folders) from **what the product does**, not from the stack. Follow naming rules according to code/language used (kebab-case by default). Same relative path in `capabilities/` and `catalog/`.

Default tree is multiple levels under `capabilities/`. Add sub-folders (with required depth) when the project is complex enough that an area needs a named group. Each with a README.

```
wiki/
  README.md                        # front door → roots
  capabilities/                    # Wiki > Capabilities
    README.md                      # areas index
    {area}/                        # Wiki > Capabilities > {Area}
      README.md                    # features index
      {feature}.md                 # Wiki > … > {Feature}  — leaf
      {group}/                     # optional extra nesting
        README.md
        {feature}.md
  catalog/                         # Wiki > Catalog  — list of functionalities
    README.md                      # areas index
    {area}/
      README.md                    # YAML index
      {feature}.yaml
      {group}/
        README.md
        {feature}.yaml
  mismatches/                      # optional — create when a disagreement exists
    README.md
```

Create `mismatches/` when code disagrees with comments, infra, docs, issues etc.

## Rules

| Rule | Do |
| --- | --- |
| Default | `capabilities/{area}/{feature}.md` |
| Extra depth | New group folder when the area (or group) is too crowded or a cluster needs a name. Any depth. |
| Split | New sibling `{feature}.md`, a new group folder, or a new `{area}/`. |
| Share | One page owns a shared rule; others link. Same behavior, two entries → one page. |
| Growth | New behavior → new leaf + catalog entry + one new index line. Do not thicken an existing leaf into a mega-page. |
| Overview first | Indexes exist before any leaf is written. |

## Formatting

Every page: `# Title`, then a breadcrumb that matches folders, then the body. Omit empty sections. Relative links only.

**Index** (any `README.md`): title + breadcrumb + a bullet list. No Requirement or Acceptance.

| File | Body |
| --- | --- |
| `wiki/README.md` | Roots (`capabilities/`, `catalog/`, `changes/` / `mismatches/` (if present)) |
| `capabilities/README.md` | Every area: link + purpose (markdown indexes only — not catalog YAML) |
| `capabilities/{area}/README.md` | Every child feature (or group): link + purpose |
| Extra group `README.md` | Every child feature (or deeper group): link + purpose |
| `catalog/README.md` | Every area: link to that area’s catalog README |
| `catalog/{area}/README.md` | Every child YAML: link + purpose (YAML indexes only — not feature pages) |

**Leaf** (`{feature}.md`): headings in this order only — Requirement, Acceptance. After the breadcrumb, a relative link to the paired catalog YAML. Intended-but-unwired behavior is not a feature heading — it goes in `mismatches/` only. Code and tracker references live in catalog YAML (`sources`, `tests`, `issues`), never on the feature page.

## Catalog YAML

```yaml
wiki_path: capabilities/{area}/{feature}.md
entry:
  - POST /api/v1/orders
  - UI /checkout
  - Job SettlePayments
sources:
  - path/to/code
tests:
  - TestOrSpecFile
issues:                    # optional; omit the key when none
  - key: PROJ-123
    url: https://example.com/browse/PROJ-123
behaviors:
  - One as-implemented fact (observable outcome).
```

`entry` is whatever a human would use to *find* the behavior. Catalog is **implicit** current state. One YAML per feature. If the feature sits in extra folders, the YAML uses the same folders.

`wiki_path` is the pointer from catalog to the feature page. `sources` is the implementation (and product docs that describe it). `issues` is optional tracker links (tasks, issues, stories). `url` is required on each item; `key` when the tracker has a display key. Ask before adding. Omit `issues` when the user declined or nothing matched.

Repo paths (implementation, tests, docs) and tracker links are written only in catalog YAML.

## Mismatch page

Create `mismatches/` when code disagrees with comments, infra, docs, issues/tasks. Index: `mismatches/README.md`.

Every mismatch must link every source that justifies it (omit none that exist):

| Link | What to point at |
| --- | --- |
| Implemented | Always — current behavior based on code |
| Intended | Always — the non-wiki source that disagrees with those files (comment, doc, infra, issue, unused config, or stub) |
