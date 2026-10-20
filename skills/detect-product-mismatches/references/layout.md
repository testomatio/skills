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

Every page: `# Title`, then a breadcrumb that matches folders (links to the parent pages only), then the body. Mismatch pages: no breadcrumb. Relative links to pages in the output folder and to repo paths; source features as key + URL.

## Kinds

| Kind                | Meaning                                                                      | Where       |
| ------------------- | ---------------------------------------------------------------------------- | ----------- |
| Differs             | Sources disagree on one behavior: values, conditions, roles, labels, flow    | Page        |
| Not implemented     | Behavior from another source that the code lacks                             | Page        |
| Missing in {source} | Feature a source is silent on, within its catalog Scope (SKILL.md › Sources) | README list |

## README

`mismatches/README.md` missing → create it: `# Mismatches`, breadcrumb. Write the mismatches list.

1. Compared: one row per source: name, role, scope, history, catalog link, Date (code: baseline commit). Product version. Check date.
2. Differs, Not implemented: one list per kind, highest impact first: page link + impact level + sources + likely cause.
3. Missing features: one list per silent source (Not implemented, Unspecified, Undocumented, Missing in {source}): feature + where found (catalog feature links) + where searched.
4. Open questions: vague behaviors, unread content, or unclear Scope that blocks a comparison.

## Page

A reader learns what disagrees from the first lines, without opening the sources.

File name: follow existing file name pattern or kebab-case of the title by default.

- `# Title`: the behavior in question, as the user meets it.
- `Feature:` the feature area › title; link to its feature page in `features/`, when present.
- `## Difference`: one bullet per side, code first when compared; sources that agree grouped on one bullet. Each bullet: the sources (key or name), then their behavior. Write each side so it is clear alone: the condition, then what the user gets. Not implemented: the code bullet says what is missing and where it was searched.
- `## Impact`: level first: **High** (users blocked, data or money wrong), **Medium** (a workaround exists), **Low** (wording, cosmetic). Then who meets it, when, and what they see or cannot do.
- `## Likely cause`: SKILL.md › Likely cause, with the dates that decide it.
- `## Solution`: suggested fix, from the likely cause: Bug → change the code; Stale requirement → update the requirement; Stale docs → update the docs; Decide → the options for the product owner.
- `## Sources`: evidence, one row per compared source; Code row always, first, when code is compared.
- Other info required to explain the mismatch.

### Example

```markdown
# Expired cards at checkout

Feature: [Checkout › Pay with saved card](../sources/code/features/checkout/pay-with-saved-card.md)

## Difference

- **Code, PAY-112:** Expired saved cards are listed at checkout, greyed out and not selectable.
- **Confluence "Saved cards":** Expired saved cards are not listed at checkout.

## Impact

Low. A customer with an expired card sees it greyed out at checkout. Support answers based on Confluence say it should not appear.

## Likely cause

Stale requirement: PAY-112 (2026-08-28) changed the behavior after the Confluence page (2026-01-10).

## Solution

Update the Confluence page "Saved cards": expired saved cards are listed at checkout, greyed out and not selectable.

## Sources

| Source                 | Says                                                  | Link                                             | Updated    |
| ---------------------- | ----------------------------------------------------- | ------------------------------------------------ | ---------- |
| Code (actual)          | Expired saved cards are listed, greyed out            | `src/checkout/cards.ts:48-61`                    | 2026-08-30 |
| Jira (intended)        | PAY-112: Expired saved cards are listed, not selectable | [PAY-112](https://example.atlassian.net/...)   | 2026-08-28 |
| Confluence (intended)  | Expired saved cards are not listed                    | [Saved cards](https://example.atlassian.net/...) | 2026-01-10 |
| User docs (documented) | silent                                                | Searched: docs/payments/, site search "expired"  |            |
```

- `Says`: the source's behavior, as [features.md](features.md) › Behaviors describes; `silent` when it has none.
- `Link`: repo file: `path:lines`; issue: key + URL; page: title + URL, with the heading when the page is long; silent: where searched.
- `Updated`: the date read at the source (SKILL.md › Likely cause).
- Superseded issues of a source with history: omit, or mark `superseded by {key}` when it explains the mismatch.
