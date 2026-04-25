# Step 4: Final Report & Handoff

## Contract
- **Precondition:** Step 3 approved (Phase 4 option 1). A6 saved to disk. A2 `destructuring.md` exists (always, under feature-first flow)
- **Input:** A6 path, A1 intake, A2 destructuring
- **Output:** final report printed; A2 progress tracker toggled to `[x]` for the current sub-feature; A-style captured on first approval; publish handoff line
- **Postcondition:** user knows where MD lives and which `/publish-test-cases-batch` invocation to run next; HARD STOP before next sub-feature
- **Idempotent:** yes — read-only aside from A2 checkbox mutation (re-sets same checkbox) and one-time `_style.md` creation
- **Retry policy:** none (no external calls)

---

This skill never publishes. Step 4 is a local report + handoff to the publishing skill.

## Procedure

1. **Print the sub-feature report** (prefaced with sub-feature name):
   ```
   ✅ Test cases saved — {feature-slug} / {suite-slug}

   Layout:      {flat | nested, N section files}
   Path:        test-cases/{F}/{S}-test-cases.md        (flat)
                test-cases/{F}/{S}/                     (nested)
   Test count:  {N}
   Priority:    critical X · high Y · normal Z · low W
   AC coverage: {M}/{total} ACs cited ({pct}%)  — baseline applicable: {B}, delta: {D}
   Automation:  candidate A · deferred B · manual-only C
   ```

2. **Toggle A2 progress tracker.** Update `test-cases/{F}/destructuring.md`: change the current sub-feature's row from `- [ ]` to `- [x] #{n} {name} — {N} tests, {layout}, ({date})`.

3. **Style capture (FIRST approval only).** If `test-cases/{F}/_style.md` does NOT exist yet → this is the first approved sub-feature of the feature. Extract style patterns from the just-approved A6 and write `_style.md`. If it already exists → skip; do NOT overwrite (user may have manually edited it).

   Template:
   ```markdown
   # Feature Style Guide — {F}

   Detected from: {first-sub-feature-slug} (approved {YYYY-MM-DD})
   Reference A6: test-cases/{F}/{first-suite}-test-cases.md  (or directory if nested)

   ## Preconditions
   - Role phrasing: "{copy an actual line from A6, e.g. 'User is logged in as QA user.'}"
   - Project / data state phrasing: "{copy an actual line from A6}"
   - Count of precondition bullets per test: {typical range observed}

   ## Steps
   - Granularity: {one action + _Expected_ per step | combined action+expected | other}
   - Voice: {imperative ("Click the ...") | descriptive | mixed}
   - Element references: {by visible label | by ARIA role | by tooltip | mixed}
   - `_Expected_:` placement: {after every step | only on final step | other}

   ## Titles
   - Pattern: "{e.g. Verb + entity + modifier}" — {active voice | descriptive}
   - Tags position: {in title as `@tag` | in metadata only}
   - Parameterization: {used when N+ variants; format "${col}" inside title}

   ## Tags
   - `@smoke`: {criterion used in this feature}
   - `@negative`: {criterion}
   - Other tags observed: {list or "none"}

   ## Automation defaults observed
   - Most common `automation:` value: {candidate | deferred | manual-only}
   - `automation-note` style: {concise | detailed | when-needed}
   ```

   Extract each `{...}` placeholder by **reading actual content** from A6 — do not invent patterns. If a category shows no clear pattern (e.g., mixed step granularity), write `mixed — see reference A6`. File written once, feature-scoped, `_` prefix signals feature-level shared artifact.

4. **HARD STOP — return control to user.** Print exactly one of the two blocks below depending on remaining sub-features:

   **If remaining sub-features > 0:**
   ```
   ✅ Sub-feature done. MD saved at {path}.
   ⛔ Stopping here to protect context. Open a NEW conversation window and run:
      /create-test-cases with #{next_number} {Next Sub-feature Name}

   Remaining: {N-1} sub-features. Batch publish fires when all are marked [x]:
      /publish-test-cases-batch test-cases/{F}/
   ```

   **If this was the LAST sub-feature (all rows now `[x]`):**
   ```
   ✅ All sub-features done for {feature-slug}. MD saved at {path}.
   ⛔ Stopping here to return control. Next step — publish the whole feature:
      /publish-test-cases-batch test-cases/{F}/

   (Auto-detects whole-feature batch mode from the directory path.)
   ```

5. Do NOT proceed to generate the next sub-feature in the same conversation — context will compact before batch publishing.
