# Behaviors

A behavior is one observable claim about how the product works now: what someone who uses it (end user, admin, API client, integrated system) can do, see, or get, and when.

Feature pages list behaviors under Acceptance; a mismatch page is titled by one behavior.

## Rules

- Describe the behavior from the user's perspective. (Exclusion: caller is not human, etc.)
  - No class, function, table, file, flag, or library names. Protocol details (endpoints, status codes, fields) only when the API is what end users use.
- No `should`, `shall`, `must`, `will`: state it as a fact. The source's role says whether it is intended, expected, or actual.

## Shape

- One claim per bullet, one sentence.
- Name who acts or what changes, in domain terms. Never "the system", "it", or "we".
- Outcome is what the actor can observe (screen, response, file, email, notification), not how the code gets there.
- Conditions stay in the claim: role, platform, setting, state.
- Negative claims count.
- Split on "and" when each part can be checked on its own.

## Values and words

- Exact values from the code that runs: limits, defaults, timeouts, sizes, formats.
- A value read from config or environment: its default, marked `(configurable)`.
- UI labels and messages verbatim, in quotes; navigation paths with `›`.
- Domain terms, one per concept across pages.

## From code

- Current-state code only: what runs now and users can reach. Stubs, disabled flags, and unwired routes are not behaviors → `mismatches/` (Unwired).
- Comments, docstrings, developer docs, API specs, configs, and tests are claims about the code, not behaviors. Where they disagree with the code → `mismatches/`.
- Never a behavior: internal steps with no visible effect (caching, logging, internal retries), refactoring, helpers.

## Examples

| Code                                                           | Behavior                                                           |
| -------------------------------------------------------------- | ------------------------------------------------------------------ |
| `if (cards.length >= 5) throw new CardLimitError()`            | `Customer can save up to 5 cards.`                                 |
| `IDLE_TIMEOUT = env.IDLE_TIMEOUT ?? 1800` (seconds)            | `Session expires after 30 min of inactivity (configurable).`       |
| `cache.set(user_id, cards)`                                    | Not a behavior: no visible effect                                  |

## Check

- [ ] All the relevant code is listed as a behavior
- [ ] Domain terms; nothing from the stack for end users
- [ ] One observable claim per bullet, present tense, who or what named
- [ ] No internal steps, and no claims taken from comments, docs, or tests
- [ ] All mismatches are listed as `mismatches/` (any disagreement between the code and one of: docs, tests, configs, comments, etc.)
