# Roadmap Output Format

How to format the prioritized roadmap and any other advisory output.
The user reads this in a chat or terminal, so dense paragraphs are unreadable there.
Optimize for **scanning** by eyes: the user should understand each item and what to do next in a 3-second glance.

## Hard rules

1. **One idea per line.** Use short sentences/paragraphs.
2. **Label lines with emoji markers** (see template). The eye navigates by emoji, not by reading.
3. **Divider between items**: put a horizontal rule `--------` (length=50 `-` characters) between every pair of items, with blank line above and below it. Items must never touch each other.
4. **Number items with emoji digits** 1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ and make the title a bold heading.
5. **Max 5 items.** 3-5 items by default, offer "more on request".
6. **Action** (skill or human action)
7. **Keep lines under ~100 characters.** One sentence per labeled line — no compound multi-clause sentences.
8. **End with exactly one call-to-action line** telling the user literally what to type.

## Emoji vocabulary

| Marker | Meaning                                    |
| ------ | ------------------------------------------ |
| 1️⃣–5️⃣  | Item number (priority order)               |
| 📈     | Impact (high / medium / low)               |
| ⏱️     | Effort (rough: ~1 hour / ~1 day / ongoing) |
| 🔍     | Found — the discovery fact behind the item |
| 🎯     | Goal — outcome when the item is done       |
| ▶️     | Action — the concrete first action         |
| 💬     | Call to action                             |

## Item template

```
### N️ <Action title — imperative, ≤ 8 words>

📈 Impact: <high|medium|low> · ⏱️ Effort: <rough estimate>

🔍 **Found:** <one sentence — the scan/interview fact this item is based on>
🎯 **Goal:** <one sentence — the outcome when done>
▶️ **Action:** <concrete action (by skill or human)>

--------------------------------------------------

```

## Example roadmap output (follow it strictly)

```
🗺️ **QA roadmap**

### 1️⃣ Document "checkout" functionality regression

  📈 Impact: high · ⏱️ Effort: ~1 day

  🔍 **Found:** 0 test cases for checkout — your highest-revenue flow.
  🎯 **Goal:** a documented, repeatable checkout regression suite.
  ▶️ **Action:** generate a checkout checklist + test cases → `qa-write-test-cases` skill

--------------------------------------------------

### 2️⃣ Set up e2e test reporting

  📈 Impact: high · ⏱️ Effort: ~1 hour

  🔍 **Found:** Playwright runs in CI but shows only green/red — no history or flakiness data.
  🎯 **Goal:** visibility into runs, history, and flaky tests.
  ▶️ **Action:** add a reporter to the Playwright project → `qa-e2e-tests-reporting` skill

--------------------------------------------------

💬 Type **"execute 1"** to start, **"expand 1"** for a detailed plan, **"adjust"** to change the roadmap, or **"save"** to write it to a file.
```
