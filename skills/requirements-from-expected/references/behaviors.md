# Behaviors

A behavior is one observable statement about what the source says the product does: what someone who uses it (end user, admin, API client, integrated system) can do, see, or get, and when. Feature pages list them under Behaviors.

## From source items

| Source        | Behaviors from                                                                                                                                              | Not behaviors                                                                                            |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Issue tracker | Stories and feature issues: acceptance criteria, then the description. Epics: their scope. Bugs: the expected result                                        | A bug's reported actual result; tasks, spikes, chores, tech debt                                         |
| Requirements  | Functional requirements, business rules, acceptance criteria, flows; one behavior per table row and per meaningful matrix cell; exclusions as negative ones | Future phases, nice-to-have, MoSCoW Could and Won't; goals, rationale, personas, metrics, open questions |
| User docs     | Guides, how-tos, limits, notes and warnings; badges (plan, edition, role, platform) as conditions; navigation steps                                         | Screenshots and videos                                                                                   |

- Comments and later edits may change the body ("dropped", "moved to PROJ-456", "decided: 3 retries, not 5"): state the final behavior, never the comment.
- Acceptance criteria may sit in a custom field, a description heading, a checklist, or sub-tasks: find the convention in the first items.

## Shape

- One behavior per bullet, one sentence, present tense.
- No `should`, `shall`, `must`, `will`: state it as a fact.
- Name who acts or what changes, in domain terms. Never "the system", "it", or "we".
- Outcome is what the actor can observe (screen, response, file, email, notification), not how the product gets there.
- Conditions stay in the behavior: role, platform, setting, state.
- Negative behaviors count: `Viewer cannot delete a project.`
- Split on "and" when each part can be checked on its own.
- Each behavior links the item that set its current form: key and URL, or page title and URL ([merge.md](merge.md)).

## Values and words

- Values as the source states them, with units. No value in the source → none in the behavior. Never round, convert, or fill one in; a vague behavior stays vague (open question).
- UI labels and messages verbatim, in quotes; navigation paths with `›`.
- No class, function, table, or library names. Protocol details (endpoints, status codes, fields) only when the API is what users use.
- Restate, never paste. Never people or customer data.

## Examples

| Source says                                                           | Behavior                                                            |
| --------------------------------------------------------------------- | ------------------------------------------------------------------- |
| The system shall allow users to store payment methods (max 5).        | `Customer can save up to 5 cards.`                                  |
| AC: if the card is declined, show "Payment failed. Try another card." | `Declined card: Customer sees "Payment failed. Try another card."`  |
| Enterprise customers get SSO; Pro is coming soon.                     | `Enterprise plan: SSO sign-in is available.` (Pro: future, dropped) |
| Session times out after a while.                                      | `Session expires after inactivity.` (no value invented)             |
| Bug: saving the same card twice creates a duplicate; expected: one.   | `Saving the same card again keeps one saved card.`                  |

## Check

- [ ] Every behavior the feature's source items state is listed, from items in scope only
- [ ] One observable behavior per bullet, present tense, who or what named
- [ ] Values as the source states them; none invented
- [ ] Domain terms; every behavior links its source items
