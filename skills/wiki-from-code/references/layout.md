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

`mismatches/README.md` missing → create it: `# Mismatches`, breadcrumb. Write the list of mismatches, grouped by kind (not implemented, differs, unwired/not used, etc.), highest impact first: page link + impact level.

### Mismatch page

A reader learns what disagrees from the first lines, without opening the sources.

File name: follow existing file name pattern or kebab-case of the title by default.

- `# Title`: the behavior in question, as the user meets it.
- `Feature:` the feature area › title, linked to its feature page.
- `## Difference`: one bullet for the code, first, then one per claim; claims that agree grouped on one bullet. Each bullet: the source, then its behavior. Write each side so it is clear alone: the condition, then what the user gets.
- `## Impact`: level first: **High** (users blocked, data or money wrong), **Medium** (a workaround exists), **Low** (wording, cosmetic). Then who meets it, when, and what they see or cannot do.
- `## Solution`: suggested fix: change the code, or correct the claim.
- `## Sources`: evidence, one row per source; Code row always, first. Code, Comment, Docstring, README, Developer docs, API spec, Config, Infra, Test, etc.
- Other info required to explain the mismatch.

#### Example

```markdown
# Upload retries after a network error

Feature: [Reports › Upload results](../features/reports/upload-results.md)

## Difference

- **Code:** A failed upload is retried 3 times, then the run shows "Upload failed".
- **Docstring, developer docs:** A failed upload is retried 5 times.

## Impact

Low. On a flaky network, "Upload failed" shows after 3 attempts, sooner than a developer reading the docs expects.

## Solution

Correct the docstring and developer docs: 3 retries.

## Sources

| Source         | Says                         | Link                        | Updated    |
| -------------- | ---------------------------- | --------------------------- | ---------- |
| Code (actual)  | Retries 3 times, then fails  | `src/upload/client.ts:40-52` | 2026-09-02 |
| Docstring      | "Retries up to 5 times"      | `src/upload/client.ts:31`    | 2026-03-11 |
| Developer docs | "5 retries before giving up" | `docs/upload.md:18`          | 2026-03-11 |
```

- `Link`: repo file: `path:lines`; outside the repo: URL, with the heading when the page is long.
- `Updated`: repo file: date the cited line last changed (`git blame --date=short -L {line},+1 -- {path}`), doc section without a line: the section's last change; URL: the page's "last updated" date, else empty.
