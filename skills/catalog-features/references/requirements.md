# Requirements

Confluence, Notion, Google Docs, SharePoint, Word, PDF, repo specs and PRDs.

Defaults: role intended, coverage complete within scope, history no (pages should agree with each other).

## Access

- MCP or connector, e.g. Confluence MCP `getConfluencePageDescendants` + `getConfluencePage` (markdown body), `searchConfluenceUsingCql`; Notion and Google Drive connectors; repo files directly.
- Word and PDF: extract the text first (`docx`, `pdf` skills).
- Scope: root page, space, folder, or database, plus labels if any. Store it.

## Tree

- Mirror the page tree. A parent page with its own content → `{page}/index.yaml`.
- One long document (Google Doc, Word, PDF, single PRD) → `{document}/{section}.yaml`, one per top-level heading.
- Database of requirements (Notion, Airtable) → one item per row; folders by its grouping property (area, epic).

## Status filter (default)

| State | Sync |
| --- | --- |
| Approved, Current, Published, or no status at all | Yes |
| Draft, Proposed, In review | No; the user may include them |
| Deprecated, Archived, Superseded | No |

- Status lives in a page status, labels, a page-properties table, a title prefix, a banner at the top, or a database property. Find the convention first; ask when there is none.
- Copies and old versions ("Copy of …", "v1" next to "v2", "OLD"): keep the current one only.

## Behaviors by content

| Content | Behaviors |
| --- | --- |
| Functional requirements, business rules, acceptance criteria, user flows | Yes |
| Requirement tables | One claim per row |
| Role × permission and similar matrices | One claim per meaningful cell ("Viewer cannot delete a project.") |
| Explicit exclusions from the current scope ("no refunds in v1") | Yes, as negative claims |
| Future phases, nice-to-have, MoSCoW Could and Won't | No |
| Goals, rationale, personas, metrics, open questions, meeting notes | No |

## Peculiarities

- Keep requirement IDs as a prefix: `REQ-12: Customer can save up to 5 cards.`
- Includes, excerpts, templates: parse content where it is defined; the including page lists it in `refs`.
- Embedded or linked issues, other pages, designs → `refs`.
- Diagrams with a text source (Mermaid, PlantUML, draw.io XML) → parse. Images, Figma embeds, attachments → `unread`.
- Restricted child pages → `unread`.
- Inline and footer comments may override the body ("decided: 3 retries, not 5"). Store the final behavior, never the comment.
- Glossary pages: no behaviors; add their terms to the catalog README.
- `updated`: the date of the page's last version, not its creation.
