# Troubleshooting

Consolidates skill-wide error handling and browser traps. Loaded on demand when an error occurs — do NOT eagerly Read.

**Cross-references:**
- Publishing-specific failures (`--sync`, Import Lock, `TESTOMATIO_PREPEND_DIR`, label 404): owned by the publisher skill (local `/publish-test-cases-batch` — not yet part of this repo; or [`sync-cases`](../../sync-cases/SKILL.md)). This skill never publishes.
- Self-review threshold failures: [self-review-checks.md](self-review-checks.md)

---

## Error Handling (SKILL.md Steps 0-3)

### Recoverable

| Trigger | Recovery |
|---|---|
| **No docs found** (Step 1.1) | Proceed with UI catalog + user prompt as AC source. Label inferred ACs as `(inferred)` |
| **No GitHub MCP** | Ask user for docs link or paste the spec |
| **Playwright login fails** (Step 1.3 / UI reality check) | Retry once with fresh browser. Still fails → ask user to verify `$TESTOMATIO_EMAIL` / `$TESTOMATIO_PASSWORD` |
| **Playwright navigation / timeout** | Retry with longer timeout. Page doesn't exist → ask user for correct URL |
| **Testomat MCP errors** (Step 1.2) | Fall back to API v2 curl commands — see Testomat.io API docs or the [`sync-cases`](../../sync-cases/SKILL.md) skill |
| **Partial run** (conversation broke mid-skill) | Resume Detector handles it — see SKILL.md § Pre-step: Resume Detector |

### Blocking

| Trigger | Action |
|---|---|
| **Feature not in UI** | Ask user for correct location — do not guess or fabricate |
| **User rejects tests** (Step 2 Phase 4) | Return to Step 2, regenerate per feedback |

---

## Browser Traps (Playwright MCP)

Apply these workarounds preemptively in both `ui-explorer` and `ui-validator` subagents, and in any inline Playwright fallback.

### 1. Icon-only toolbar buttons
Use `aria-describedby` → popper content to identify. Clicking by icon position alone is fragile.

### 2. Delete button proximity
Delete button is adjacent to the extra-menu button. **Always verify button identity before clicking** — grab `outerHTML` or `aria-label` first.

### 3. Detail panel blocks tree clicks
The right-side detail panel can overlay tree elements. Fixes:
- Press `Escape` to close the detail panel before clicking tree elements, OR
- Use `browser_evaluate` to find and click elements programmatically (bypasses pointer events)

### 4. Intercepted clicks on link buttons
Some link-styled buttons (e.g. "Manual Run") get intercepted by overlapping elements. Error message: `intercepted pointer events`.
- If click fails → navigate directly to the target URL instead of clicking.

### 5. Import progress banner blocks UI verification
After a push, the import banner can block subsequent clicks.
- Dismiss via: `browser_evaluate(() => document.querySelector('.import-progress')?.remove())`

### 6. Project mismatch
The `ui-explorer` and `ui-validator` subagents enforce the user-configured exploration project (e.g. `$TESTOMATIO_EXPLORATION_PROJECT`) for exploration/validation. **Never silently switch projects** — if `entry_url` points elsewhere, append a warning to the 1-line summary and let the parent decide.

---

## Nested Suite Parser Gotchas

- Multiple `<!-- suite -->` blocks in ONE file **do not nest** — parser overwrites `currentSuite`, creates duplicates
- `## Steps` heading can be misread as a test title if preceded by another heading
- Directory structure is the only working approach — tested 2026-04-15
