# Features

A feature is something the product does for its users that they would name: "Pay with saved card", "Export report to CSV". One catalog item is one feature of its source. Another source may name it differently (alias) or split it differently: e.g. one epic covers three code features, one docs page covers two.

A feature is made of behaviors: what someone who uses it (end user, admin, API client, integrated system) can do, see, or get, and when. Sources are compared behavior by behavior, so every source's behaviors are written the same way.

Behavior is similar to requirement or acceptance criteria, but "requirement" and "AC" are terms which explain intended behavior, code explains actual behavior, user docs – expected behavior. Thus, using "behavior" as most suitable term which describes any feature regardless its implemented or planned.

## Find

Per source:

1. Catalog: title, aliases, the group it sits in. Links inside items to other sources help.
2. Not in the catalog → search the source, within the catalog's scope:

| Source        | Search                                                                                |
| ------------- | ------------------------------------------------------------------------------------- |
| Code          | Domain terms, UI labels, messages, routes; start next to related catalog paths        |
| Issue tracker | Text search inside the stored scope query (JQL `text ~ "term"`, `gh search issues`)   |
| Requirements  | Search under the root page or space (CQL `text ~ "term"`); headings of long documents |
| User docs     | Docs site search or nav; `grep` in the docs repo                                      |
| Other         | The source's own search                                                               |

- Found at the source, missing from the catalog → use it and report a catalog error.
- Found, but outside the catalog's sync rules (open issue, draft page, other version) → not a behavior. Mention it on the mismatch page when it explains one.
- Not found → the source is silent on the feature. Record where you searched.

## Read

Read every matching item at its link. Behaviors come from:

| Source        | Behaviors from                                                                                                                                              | Not behaviors                                                                                            |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Code          | The code at the catalog paths; Acceptance on its wiki page in `features/`, when present, as a start                                                         | Comments, docstrings, developer docs, tests, configs; stubs, flags, routes users cannot reach            |
| Issue tracker | Stories and features: acceptance criteria, then the description. Epics: their scope. Bugs: the expected result                                              | A bug's reported actual result; tasks, spikes, chores, tech debt                                         |
| Requirements  | Functional requirements, business rules, acceptance criteria, flows; one behavior per table row and per meaningful matrix cell; exclusions as negative ones | Future phases, nice-to-have, MoSCoW Could and Won't; goals, rationale, personas, metrics, open questions |
| User docs     | Guides, how-tos, limits, notes and warnings; badges (plan, edition, role, platform) as conditions; navigation steps                                         | Screenshots and videos                                                                                   |
| Test cases    | Expected results                                                                                                                                            | Steps, test data                                                                                         |

- Comments and later edits may change the body ("dropped", "moved to PROJ-456", "decided: 3 retries, not 5"): state the final behavior, never the comment.
- Acceptance criteria may sit in a custom field, a description heading, a checklist, or sub-tasks: find the convention in the first items.

## Behaviors

### Shape

- One behavior per line, one sentence, present tense.
- No `should`, `shall`, `must`, `will`: state it as a fact. The source's role says whether it is intended, expected, or actual.
- Name who acts or what changes, in domain terms. Never "the system", "it", or "we".
- Outcome is what the actor can observe (screen, response, file, email, notification), not how the product gets there.
- Conditions stay in the behavior: role, platform, setting, state.
- Source ID, when the behavior has one, goes first.
- Negative behaviors count: `Viewer cannot delete a project.`
- Split on "and" when each part can be checked on its own.

### Values and words

- Values as the source states them, with units. No value in the source → none in the behavior. Never round, convert, or fill one in; a vague behavior stays vague (open question).
- UI labels and messages verbatim, in quotes; navigation paths with `›`.
- Domain terms, one per concept across sources.
- No class, function, table, file, flag, or library names. Protocol details (endpoints, status codes, fields) only when the API is what users use.
- Keep the source's level of detail: a coarse behavior stays coarse. Never merge behaviors and drop values or conditions.
- Restate, never paste. Never people, comments, or customer data.

## Examples

| Source says                                                           | Behavior                                                            |
| --------------------------------------------------------------------- | ------------------------------------------------------------------- |
| The system shall allow users to store payment methods (max 5).        | `Customer can save up to 5 cards.`                                  |
| Users can save cards to pay faster.                                   | `Customer can save a card.` (benefit dropped)                       |
| AC: if the card is declined, show "Payment failed. Try another card." | `Declined card: Customer sees "Payment failed. Try another card."`  |
| Enterprise customers get SSO; Pro is coming soon.                     | `Enterprise plan: SSO sign-in is available.` (Pro: future, dropped) |
| Session times out after a while.                                      | `Session expires after inactivity.` (no value invented)             |
| Bug: saving the same card twice creates a duplicate; expected: one.   | `Saving the same card again keeps one saved card.`                  |

## Check

- [ ] Every source either has the feature's items or records where it was searched
- [ ] One observable behavior per line, present tense, who or what named
- [ ] Values, labels, and conditions exactly as in the source; none added
- [ ] Domain terms, the same term for the same thing
- [ ] No implementation, plans, rationale, work items, people, or copied text
