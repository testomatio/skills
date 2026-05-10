# Manual Test Markdown Format

Manual tests are stored as markdown files (`*.test.md`) with HTML-comment metadata blocks. Testomat.io assigns the `@S` / `@T` identifiers when the file is pushed; once assigned, they live alongside the human content.

## Skeleton

```html
<!-- suite
id: @S51e4232d
tags: jira
-->
# Suite Title @suite

<!-- test
id: @T89f74077
priority: high
tags: smoke, integration
-->
# Test Title @smoke @integration

### Steps
* step one
* step two

### ER
* expected result one
```

## What to extract

| Field        | Where it lives                                                | Example                |
| ------------ | ------------------------------------------------------------- | ---------------------- |
| Suite ID     | `<!-- suite ... id: @S... -->` block                          | `@S51e4232d`           |
| Test ID      | `<!-- test ... id: @T... -->` block                           | `@T89f74077`           |
| Tags (title) | `@word` markers in suite or test titles                       | `@smoke`, `@suite`     |
| Tags (meta)  | `tags:` key inside the `<!-- suite -->` or `<!-- test -->`    | `tags: jira, api`      |
| Context      | Suite title, test titles, `### Steps`, `### ER`               | full prose             |

Tags from titles and tags from metadata blocks are equivalent — both are valid `@tag` identifiers in `coverage.manual.yml`.

## Files without IDs

Files pulled from Testomat.io always carry IDs. Files generated locally (e.g. by `generate-cases`) do not — they get IDs after `npx check-tests push`. Manual coverage mapping requires IDs, so push first if needed.

## Files outside the manual-tests directory

`README.md`, `CHANGELOG.md`, design docs, and anything else without `<!-- test ... -->` / `<!-- suite ... -->` blocks should be ignored when scanning for manual tests.

## Related

- `sync-cases` skill — pull and push manual tests between Testomat.io and the repository.
- `generate-cases` skill — author new manual tests from requirements.
- `improve-test-cases` skill — refactor existing manual tests.
