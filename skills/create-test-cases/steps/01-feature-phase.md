# Step 1: Feature Phase — gather once, share across every sub-feature

## Contract
- **Precondition:** A1 valid (intake complete)
- **Input:** Q1.1 entry URL, Q3 sources, Q4 focus areas from A1
- **Output (all feature-level):**
  - A-shared-ui (`test-cases/{F}/_shared-ui.md`)
  - A-base (`test-cases/{F}/_ac-baseline.md`)
  - A-steps (`test-cases/{F}/_existing-steps.md`) — optional, skipped if Testomat MCP unavailable
  - A2 (`test-cases/{F}/destructuring.md`) with sub-feature map + cross-cutting concerns + `- [ ]` progress tracker
- **Postcondition:** all cheap-validations pass; user has approved the map + baselines; HARD STOP fires
- **Idempotent:** yes — existing artifacts are reused; missing ones are produced
- **Retry policy:** `ui-explorer` subagent failure → 1 retry, then escalate to user. Docs-fetch failure → fall back to user-provided docs or `(inferred)` label

---

## Purpose

Heavy gather-info runs ONCE per feature. Each sub-feature phase (Step 2) then consumes the shared artifacts and adds only a thin delta. This eliminates the duplication cost that previously happened when generating test cases across multiple sub-features of a complex product.

**Product knowledge — JIT load only:** Do **NOT** eagerly Read [../references/product-context.md](../references/product-context.md) here. Read it on demand, only when one of these triggers fires:
- 1.2 produces an AC list with `(inferred)` items → load for cross-check
- 1.4 cross-cutting analysis needs role/entity matrix
- Step 3 Phase 2 hits a role-based precondition → load canonical role names

## Substep dependency map

| # | Input | Output | Tool / Owner | Depends on |
|---|---|---|---|---|
| 1.1 | Q1.1 entry URL | A-shared-ui + candidate sub-feature list | **ui-explorer** subagent, `mode: feature-baseline` | — |
| 1.2 | Q3 sources, feature scope | A-base (`_ac-baseline.md`) | WebFetch / GitHub MCP / parent | — (parallel with 1.1) |
| 1.3 | feature scope | A-steps (`_existing-steps.md`) | Testomat MCP | — (parallel with 1.1) |
| 1.4 | candidate sub-features (1.1) + A-base (1.2) | A2 destructuring.md with sub-feature table + Cross-cutting concerns section | parent (inline) | 1.1, 1.2 |
| 1.5 | A-shared-ui + A-base + A-steps + A2 | user-approved map | parent (inline, single presentation) | 1.1–1.4 |

Run 1.1 ‖ 1.2 ‖ 1.3 in parallel when possible, then 1.4 → 1.5 strictly sequentially.

---

## 1.1 Feature-level UI baseline — `ui-explorer` subagent (mode: feature-baseline)

Invoke via the Agent tool with `subagent_type: ui-explorer`. The subagent traverses the feature at a breadth-first level — it does NOT dive into every form/modal. It catalogs **shared surfaces** (top nav, breadcrumbs, sidebar, feature-wide toolbars, common modals, bulk-action bars, global toasts) and identifies candidate sub-features for the destructuring map.

**Prompt must include:**
- `feature_slug` (from A1)
- `entry_url` or `entry_path` (from Q1.1)
- `scope_summary` (2-3 sentences from intake Q1/Q4)
- `mode: feature-baseline`
- `output_catalog_path: test-cases/{F}/_shared-ui.md`
- `output_subfeatures_hint: return a list of candidate sub-features with 1-line description each (for destructuring map construction in 1.4)`

**Subagent contract:** writes `_shared-ui.md` per [../references/ui-catalog-format.md](../references/ui-catalog-format.md) with feature-baseline frontmatter (see [../references/artifacts.md § A-shared-ui](../references/artifacts.md)). Returns ONE line:

```
Feature baseline <written|reused> to <path>: <N> shared surfaces, <M> candidate sub-features, gaps=<count>
```

**After subagent returns:**
1. Parse the 1-line summary
2. Run cheap validation on the frontmatter (`awk` over `head -20`)
3. Do NOT Read the full catalog — Step 2 sub-features will each consume it via the `sub-feature-delta` ui-explorer mode

**Fallback:** if the subagent fails twice (timeout, tool error), STOP and escalate. Do NOT run inline Playwright.

---

## 1.2 Acceptance Criteria baseline (`_ac-baseline.md`)

Fetch feature-level ACs from docs once. Source in priority order:
1. Q3-provided docs URLs → `WebFetch`
2. `testomatio/docs` repo via GitHub MCP (if available)
3. User-pasted spec text
4. Inferred from A-shared-ui + intake prompt → label `source: inferred`

**Extract a structured AC list** (not raw prose). Parse into `AC-1: {one verifiable requirement}`. One AC = one behavior. Vague docs → `AC-N: UNCLEAR — {question}` (surfaced in 1.5).

**IDs are feature-global** — AC-17 in this file is the same AC-17 referenced by every sub-feature's delta.

Save as A-base per [../references/artifacts.md § A-base](../references/artifacts.md) at `test-cases/{F}/_ac-baseline.md`. Cheap-validation must pass before 1.4 begins.

---

## 1.3 Existing steps from Testomat MCP (optional)

Run `mcp__testomatio__steps_list` / `steps_search` to fetch reusable step phrases already defined for this feature's suites. Save as A-steps per [../references/artifacts.md § A-steps](../references/artifacts.md) at `test-cases/{F}/_existing-steps.md`.

Purpose: Step 3 Phase 2 will prefer matching existing wording over inventing new phrasings, reducing step-library churn.

**Skip condition:** Testomat MCP unavailable OR feature has no prior coverage → omit the file. Downstream consumers treat absence as "no hints — generate freely".

---

## 1.4 Destructuring map + cross-cutting concerns → A2

Use [../references/destructuring.md](../references/destructuring.md) procedure steps 3–7 (decomposition criteria, scope boundaries, cross-cutting analysis, execution order). Input is the `candidate_sub_features` list returned by 1.1 plus the A-base AC list for coverage reasoning.

Save to `test-cases/{F}/destructuring.md` with:
- Sub-feature table (ownership, does-not-own, key elements, estimated tests)
- `## Cross-cutting concerns` section
- `- [ ]` progress tracker (one line per sub-feature)

Cheap-validation must pass (see [../references/artifacts.md § A2](../references/artifacts.md)).

---

## 1.5 User approval (single presentation)

**ONE user stop** — present all four outputs together so the user can approve or edit with a single review pass:

```
Feature phase complete. Produced:

📁 test-cases/{F}/
  ├─ _shared-ui.md        — {N} shared surfaces cataloged
  ├─ _ac-baseline.md      — {M} ACs ({K} UNCLEAR, needs your input)
  ├─ _existing-steps.md   — {S} reusable step phrases [or: SKIPPED]
  └─ destructuring.md     — {P} sub-features, {X} cross-cutting concerns

UNCLEAR ACs requiring clarification:
- AC-{N}: {question}
...

Sub-feature execution order (recommended):
1. {Sub-feature A} — {est. tests}
2. {Sub-feature B} — {est. tests}
...

Cross-cutting concerns:
A. {concern} — affects #1, #3, #4
B. {concern} — affects #2, #5
...

Options:
  (a) Approve — I'll HARD STOP here so you can open a new conversation for the first sub-feature
  (b) Edit the map / cross-cutting / AC baseline — tell me what to change
  (c) Resolve UNCLEAR ACs inline — I'll update _ac-baseline.md
```

On approval → HARD STOP.

---

## HARD STOP at end of this step

After user approves, print the handoff message and stop. Do NOT proceed to Step 2 in the same conversation — the feature phase has consumed significant context; the sub-feature phase needs a fresh conversation to avoid mid-generation compact.

```
✅ Feature phase saved at test-cases/{F}/.
⛔ Stopping here to protect context. Open a NEW conversation window and run:
   /create-test-cases with #1 {First Sub-feature Name}

Total sub-features: {N}. Batch publish (/publish-test-cases-batch) fires when all are marked [x].
```
