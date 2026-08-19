# Answer shapes

Pick the shape that matches the question. Skip any section that doesn't apply —
never pad with "N/A" or "None". Bullets over paragraphs, short lines, plain
words.

## Feature description — "what does X do", "explain X"

The default shape. Most questions land here.

```
**What it does:** one line
**Who can do it:** roles / permissions
**How to trigger it:** the clicks, in order
**What happens:** outcomes — screen, message, email, status change, background work
**Rules / limits:** validations, conditions, plan gating
**Edge cases:** empty, duplicate, too large, expired, blocked, concurrent
**Not implemented:** anything a tester would reasonably expect that doesn't exist
```

## Flow walkthrough — "walk me through…", "how does someone…"

Numbered steps from the user's point of view, one screen per step. Say where
the flow can branch or die.

```
1. User clicks **X** on the … page.
2. …
3. …

**Branches:**
- If <condition>, they land on … instead.
- If <condition>, it stops with "<the actual message>".

**After it finishes:** <emails, notifications, anything delayed>
```

## Yes / no — "is X supported", "can I…", "is there a way to…"

Answer in the first word. Then one line of why. Then nuance, if any.

```
Yes — partially.
- <what works, and where>
- <what doesn't>
- <what exists in the API but has no UI>
```

If it's a flat no, one or two lines is the whole answer. Don't inflate it.

## Permissions — "can a *role* do X", "who can…"

Say whether the block is in the UI, on the server, or both — a tester needs to
know if they can get past it by calling the API directly.

```
No. Guests can view … but cannot …
The button is hidden for guests, and the action is blocked server-side too.
```

For several roles at once, use a small table:

```
| Role | Create | Edit | Delete |
|---|---|---|---|
| Owner | ✅ | ✅ | ✅ |
| Member | ✅ | ✅ | ❌ |
| Guest | ❌ | ❌ | ❌ |
```

## Edge cases — "what could go wrong", "what should I test"

Group by the kind of input or state, so the list is walkable as a test session.
Each line is a condition plus what actually happens.

```
**Empty / missing:** …
**Duplicate:** …
**Too large / too many:** …
**Wrong format:** …
**Expired / stale:** …
**Permissions:** …
**Concurrent:** two people doing this at once …
**External failure:** the integration is down / the upload fails …
```

## Failure behaviour — "what happens if it fails"

Testers need the observable result, not the exception.

```
**What the user sees:** the actual message or screen
**What state it's left in:** saved / not saved / half-saved
**Whether it retries:** automatically, manually, or not at all
```

## Comparison — "what's the difference between X and Y"

Two columns, same rows. Only rows where they actually differ.

## Phrasing uncertainty

Never guess silently. Use the shape "I can see X, but I couldn't confirm Y":

- "The API accepts this, but I couldn't find a UI that reaches it."
- "There's a limit of 100 here, but I'm not sure whether it's enforced on
  import as well — worth verifying."
- "This looks gated by a feature flag. Whether it's on for your account, I
  can't tell from the code."

## Length

Match the question. A yes/no question gets two lines. A "walk me through the
whole import flow" gets a full shape. If your answer runs past about a screen,
either the question was broad or you're explaining implementation — check
which.
