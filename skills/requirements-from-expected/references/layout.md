# Requirements layout

```
requirements/expected/{source-name}/   # output folder
  README.md              # source, scope, date, sitemap, open questions
  features/
    README.md            # areas
    .catalog/            # catalog-features
    {area}/              # as in the catalog, any depth
      README.md          # subareas and features
      {feature}.md       # feature page
  .source/               # catalog-features
  mismatches/            # contradictions inside this source
    README.md            # list, highest impact first; none → say so
    {mismatch}.md
```

Every README: breadcrumb, then links to its children.

## Feature page

- Breadcrumb, description, status (from the feature YAML).
- `## Behaviors`: current state ([behaviors.md](behaviors.md), [merge.md](merge.md)).
- `## History` (`History: Yes`): date, item, what it changed; oldest first.

```markdown
## Behaviors

- Customer can save up to 10 cards. ([PAY-140](https://example.atlassian.net/browse/PAY-140))

## History

| Date       | Item                                                    | Change                       |
| ---------- | ------------------------------------------------------- | ---------------------------- |
| 2026-01-15 | [PAY-100](https://example.atlassian.net/browse/PAY-100) | Save a card, up to 5 cards   |
| 2026-10-02 | [PAY-140](https://example.atlassian.net/browse/PAY-140) | Card limit 5 → 10            |
```

## Mismatch page

- `# Title`: the behavior, as the user meets it.
- `Feature:` link to its feature page.
- `## Difference`: one-sentence summary, then one bullet per item: item, its behavior.
- `## Impact`: **High** / **Medium** / **Low**, then who meets it and what they see.
- `## Solution`: which item to correct, or the options for the product owner.
- `## Sources`: one row per item: item, says, link, updated.

```markdown
# Saved card limit

Feature: [Checkout › Save card](../features/checkout/save-card.md)

## Difference

Two current pages give different limits: 5 and 10.

- **"Saved cards":** Customer can save up to 5 cards.
- **"Plans and limits":** Customer can save up to 10 cards.

## Impact

Medium. Customers get different answers depending on the page they read.

## Solution

Decide the limit, then correct the other page.

## Sources

| Item             | Says           | Link                                        | Updated    |
| ---------------- | -------------- | ------------------------------------------- | ---------- |
| Saved cards      | Up to 5 cards  | [Saved cards](https://example.com/...)      | 2026-04-02 |
| Plans and limits | Up to 10 cards | [Plans and limits](https://example.com/...) | 2026-05-19 |
```
