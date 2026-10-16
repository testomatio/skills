# Behaviors

A behavior is one observable claim about the product: what someone who uses it (end user, admin, API client, integrated system) can do, see, or get, and when.

Catalogs hold only key, title, and link. Read each item at its link and state its behaviors as below: claims from different sources line up only when they are written the same way.

## Shape

- One claim per line, one sentence, present tense.
- No `should`, `shall`, `must`, `will`: state it as a fact. The source's role says whether it is intended, expected, or actual.
- Name who acts or what changes, in domain terms. Never "the system", "it", or "we".
- Outcome is what the actor can observe (screen, response, file, email, notification), not how the product gets there.
- Conditions stay in the claim: role, platform, setting, state.
- Source ID, when the claim has one, goes first.
- Negative claims count: `Viewer cannot delete a project.`
- Split on "and" when each part can be checked on its own.

## Values and words

- Values as the source states them, with units. No value in the source → none in the claim. Never round, convert, or fill one in; a vague claim stays vague (open question).
- UI labels and messages verbatim, in quotes; navigation paths with `›`.
- Domain terms, one per concept across sources. A source's own name for a known feature → `aliases` in the map.
- No class, function, table, file, flag, or library names. Protocol details (endpoints, status codes, fields) only when the API is what users use.
- Keep the source's level of detail: a coarse claim stays coarse. Never merge claims and drop values or conditions.
- Restate, never paste. Never people, comments, or customer data.

## By source

| Source        | Behaviors from                                                                                                                                             | Not behaviors                                                                                            |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Code          | Acceptance on the `capabilities/` feature page; else the code at the catalog paths                                                                         | Comments, docstrings, developer docs, tests, configs; stubs, flags, routes users cannot reach            |
| Issue tracker | Stories and features: acceptance criteria, then the description. Epics: their scope. Bugs: the expected result                                             | A bug's reported actual result; tasks, spikes, chores, tech debt                                         |
| Requirements  | Functional requirements, business rules, acceptance criteria, flows; one claim per table row and per meaningful matrix cell; exclusions as negative claims | Future phases, nice-to-have, MoSCoW Could and Won't; goals, rationale, personas, metrics, open questions |
| User docs     | Guides, how-tos, limits, notes and warnings; badges (plan, edition, role, platform) as conditions; navigation steps                                        | Screenshots and videos                                                                                   |
| Test cases    | Expected results                                                                                                                                           | Steps, test data                                                                                         |

- Comments and later edits may change the body ("dropped", "moved to PROJ-456", "decided: 3 retries, not 5"): state the final behavior, never the comment.
- Acceptance criteria may sit in a custom field, a description heading, a checklist, or sub-tasks: find the convention in the first items.
- Images, diagrams without a text source, restricted pages: unread. An open question, not silence.

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

- [ ] One observable claim per line, present tense, who or what named
- [ ] Values, labels, and conditions exactly as in the source; none added
- [ ] Domain terms, the same term for the same thing
- [ ] No implementation, plans, rationale, work items, people, or copied text
