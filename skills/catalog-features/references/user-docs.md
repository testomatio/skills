# User docs

Docs site, docs folder in a repo (Docusaurus, MkDocs, GitBook, Sphinx, Mintlify), help center (Zendesk, Intercom), in-app help.

Defaults: role expected, coverage complete for user-facing features, history no.

## Access

- Repo docs: read the files; take the nav from the docs config (`sidebars.js`, `mkdocs.yml`, `SUMMARY.md`, `_toc.yml`, `docs.json`).
- Docs site: start from the nav or `sitemap.xml`; fetch pages as text.
- Help center: its API, MCP, or an export.
- Scope: docs root, version, language. Store them.

## Tree

- Mirror the docs nav as readers see it, not the file or URL structure.
- One item per page. A very long page → `{page}/{section}.yaml`, one per H2.

## Status filter (default)

| Pages | Sync |
| --- | --- |
| Guides, how-tos, feature and concept pages, FAQ, troubleshooting, limits, plans | Yes |
| Generated API reference (OpenAPI, typedoc, javadoc) | No; derived from code, covered by the code catalog |
| Changelog, release notes | No; sync as a separate source (history) |
| Other versions (`next`, archived), translations | No; one version, one language |
| Unpublished, hidden, or draft pages | No |
| Blog, marketing, legal | No; the user may include them |

## Peculiarities

- Version: sync the docs version of the release being compared; store it in the README.
- Docs are coarse and describe the happy path. Store claims at their own granularity; never infer details.
- Conditions are part of the claim: plan, edition, role, platform badges ("Enterprise plan: SSO via SAML.").
- Navigation paths and UI labels are claims; keep them exact ("Settings › Billing › Cards").
- Read what the page renders: includes, partials, tabs, collapsed sections. Notes and warnings often hold limits.
- Screenshots and videos → `unread`; they are often outdated.
- `updated`: the page's "last updated" date, else the last commit of the file (`git log -1 --format=%cs -- {path}`).
