# Issue tracker

Jira, Linear, GitHub Issues, YouTrack, Azure Boards.

Defaults: role intended, coverage partial (trackers log changes, not the whole product), history yes.

## Access

- Tracker MCP or CLI, e.g. Jira MCP `searchJiraIssuesUsingJql` + `getJiraIssue`; GitHub `gh issue list --state closed --search "…" --json number,title,state,stateReason,labels,milestone,closedAt,updatedAt,url` + `gh issue view {n} --json body,comments`.
- Scope is a query. Store it verbatim (JQL, `gh` search, Linear filter).
- Paginate to the last page; search APIs cap the page size.

## Tree

- One folder per epic (or parent issue, milestone): `{EPIC}/`. The epic's own claims go in `{EPIC}/index.yaml`.
- No epic: one folder per component or label, else `no-epic/`.
- Sub-tasks and checklist items fold into the parent item; no own file.

## Status filter (default)

| State | Sync |
| --- | --- |
| Done, Closed, Resolved with resolution Done, Fixed, Released; GitHub `completed` | Yes |
| Won't Do, Duplicate, Cannot Reproduce, Obsolete, Invalid; GitHub `not_planned` | No |
| Open, In Progress, In Review | No; the user may include planned work |

## Behaviors by issue type

| Type | Behaviors from |
| --- | --- |
| Story, feature, improvement | Acceptance criteria, then the description |
| Bug | Expected result only; never the reported actual result |
| Epic | Its scope and acceptance criteria, if any |
| Task, spike, chore, tech debt | Usually none; skip when there is no observable behavior |

## Peculiarities

- Issues are a history, not a spec: a later issue can change what an earlier one set. Store `resolved` so the cross-check knows which one is newer.
- The description often predates the final decision. Scan comments for scope changes ("dropped", "moved to PROJ-456", "agreed to …"); store the final behavior, never the comment.
- Acceptance criteria live in different places: a custom field, a description heading, a checklist, sub-tasks. Find the project's convention in the first batch.
- `duplicates` link → skip the duplicate. Links to requirement pages, docs, PRs, other issues → `refs`.
- Bug reports carry customer names, emails, logs, and screenshots. Never store them.

## Extra fields

```yaml
type: Story           # issue type as is
resolved: 2026-08-28  # resolution date; omit when open
release: "5.2"        # fix version or milestone; omit when none
```
