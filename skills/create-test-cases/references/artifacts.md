# Artifact State Machine

Canonical source of truth for every file the skill produces and consumes. Every step in SKILL.md references this file instead of restating schemas.

**Loading rule:** loaded by Step 0 Resume Detector once per run. Other steps may Read only the frontmatter of an artifact for cheap validation — do NOT re-Read this file per step.

## Section map (anchor-based — stable across edits)

Extract ONE section via a single `awk` call — never Read the whole file:

```bash
awk '/^START_PATTERN/,/^END_PATTERN/' .claude/skills/create-test-cases/references/artifacts.md
```

| Section | START pattern | END pattern (exclusive) |
|---|---|---|
| Artifact list (feature-level + sub-feature-level) | `^## Artifact list` | `^## A1 ` |
| A1 intake.md (feature) | `^## A1 ` | `^## A2 ` |
| A2 destructuring.md (feature) | `^## A2 ` | `^## A-base ` |
| A-base _ac-baseline.md (feature) | `^## A-base ` | `^## A-shared-ui ` |
| A-shared-ui _shared-ui.md (feature) | `^## A-shared-ui ` | `^## A-steps ` |
| A-steps _existing-steps.md (feature) | `^## A-steps ` | `^## A3 ` |
| A3 {S}-ac-delta.md (sub-feature) | `^## A3 ` | `^## A4 ` |
| A4 {S}-ui-delta.md (sub-feature) | `^## A4 ` | `^## A5 ` |
| A5 {S}-scope.md (sub-feature) | `^## A5 ` | `^## A6 ` |
| A6 {S}-test-cases.md / {S}/*.md (sub-feature) | `^## A6 ` | `^## A7 ` |
| A7 {S}-review.md (sub-feature) | `^## A7 ` | `^## A-style ` |
| A-style _style.md (feature, captured after first approval) | `^## A-style ` | `^## State transitions` |
| State transitions | `^## State transitions` | `^## Phase 3a gate-check` |
| Phase 3a gate-check recipes (intro + vars) | `^## Phase 3a gate-check` | `^### Gate 1 ` |
| Gate 1 AC coverage | `^### Gate 1 ` | `^### Gate 2 ` |
| Gate 2 Priority pyramid | `^### Gate 2 ` | `^### Gate 3 ` |
| Gate 3 Automation classification | `^### Gate 3 ` | `^### Gate 4 ` |
| Gate 4 Manual-only rate | `^### Gate 4 ` | `^### Gate 5 ` |
| Gate 5 Forbidden metadata | `^### Gate 5 ` | `^### Gate 6 ` |
| Gate 6 Scope compliance | `^### Gate 6 ` | `^### Gate 7 ` |
| Gate 7 Role names | `^### Gate 7 ` | `^### Gate 8 ` |
| Gate 8 Min step count | `^### Gate 8 ` | `^### Gate 9 ` |
| Gate 9 Forbidden `id:` | `^### Gate 9 ` | `^### Gate 10 ` |
| Gate 10 Sub-suite distribution | `^### Gate 10 ` | `^### Gate 11 ` |
| Gate 11 Impl leakage | `^### Gate 11 ` | `^### Gate 12 ` |
| Gate 12 Parameterized `${col}` | `^### Gate 12 ` | `^## Resume Detector` |
| Resume Detector input | `^## Resume Detector` | end-of-file (use `awk '/^## Resume Detector/{p=1} p'`) |

---

## Artifact list

All paths are relative to repo root. `{F}` = feature-slug, `{S}` = suite-slug.

**Feature-level** (`_` prefix = shared across sub-features). Produced once by the Feature Phase (Step 1). Consumed by every Sub-feature Phase run in the same feature.

| # | Path | Producer | Consumers | Required? | Lifecycle |
|---|------|----------|-----------|-----------|-----------|
| A1 | `test-cases/{F}/intake.md` | Step 0 | all later steps | **Yes** | Read-only after Step 0. Re-written only on explicit user "start fresh" |
| A2 | `test-cases/{F}/destructuring.md` | Step 1.1 (feature phase, ui-explorer mode: feature-baseline) | Step 2 (picks sub-feature row), Step 3 Phase 0 (cross-cutting), Step 4 (toggle `[x]`) | **Yes** | **Mutable** — Step 4 toggles `- [ ]` → `- [x]` per approved sub-feature |
| A-base | `test-cases/{F}/_ac-baseline.md` | Step 1.2 (docs fetch) | Step 2.1 (filter applicable), Step 3 Phase 1 (checklist), test-case-reviewer Gate 1 | **Yes** | Read-only after Step 1.2. Can be manually expanded by user before proceeding |
| A-shared-ui | `test-cases/{F}/_shared-ui.md` | Step 1.1 (ui-explorer mode: feature-baseline) | Step 2.2 (delta exploration baseline), Step 3 Phase 3b (ui-validator), Gate 11 impl-leak check | **Yes** | Read-only after Step 1.1. May be manually edited if user spots missing shared element |
| A-steps | `test-cases/{F}/_existing-steps.md` | Step 1.3 (Testomat MCP) | Step 3 Phase 2 (test generation — reuses existing steps) | No (optional; skipped if Testomat MCP unavailable) | Read-only after Step 1.3 |
| A-style | `test-cases/{F}/_style.md` | Step 4 (FIRST approved sub-feature only) | Step 3 Phase 2 of every SUBSEQUENT sub-feature in the same feature | No (only exists after at least 1 sub-feature approved) | Written once; NOT overwritten on subsequent approvals (user-editable) |

**Sub-feature-level** — produced per sub-feature. Written under `test-cases/{F}/` with `{S}-` prefix (flat) or under a nested directory `test-cases/{F}/{S}/` (nested layout).

| # | Path | Producer | Consumers | Required? | Lifecycle |
|---|------|----------|-----------|-----------|-----------|
| A3 | `test-cases/{F}/{S}-ac-delta.md` | Step 2.1 | Step 3 Phase 1 (checklist), Step 3 Phase 3a Gate 1 (combined with A-base) | **Yes** | Read-only after Step 2.1 |
| A4 | `test-cases/{F}/{S}-ui-delta.md` | Step 2.2 (ui-explorer mode: sub-feature-delta) | Step 3 Phase 1/2, Step 3 Phase 3b (ui-validator, combined with A-shared-ui) | **Yes** | May be **appended** by gap-focused ui-explorer re-invocation (Step 2.x retry) |
| A5 | `test-cases/{F}/{S}-scope.md` | Step 2.3 | Step 3 Phase 3a (scope compliance), test-case-reviewer subagent | **Yes** | Read-only after Step 2.3 |
| A6 | `test-cases/{F}/{S}-test-cases.md` **OR** `test-cases/{F}/{S}/*.md` | Step 3 Phase 2 | Step 3 Phase 3a (mechanical), Phase 3b (ui-validator), Step 4, handoff to `/publish-test-cases-batch` | **Yes** | **Mutable** — Phase 3a auto-fix, Phase 3b in-place fixes, Phase 4 iteration |
| A7 | `test-cases/{F}/{S}-review.md` | test-case-reviewer subagent (suites ≥15) | Phase 4 presentation | Only for ≥15-test suites | Read-only after subagent run |

---

## A1 — intake.md

**Schema:** see [intake-questionnaire.md § Part 3 Output Template](../intake-questionnaire.md).

**Cheap validation** (used by Resume Detector):
```bash
grep -q '^| Q1 |' test-cases/{F}/intake.md && \
grep -q '^| Q1.2 |' test-cases/{F}/intake.md && \
grep -q '^| Q2 |' test-cases/{F}/intake.md
```
All three must match. If any missing → intake is incomplete, re-run Step 0 with "Edit specific".

**Sub-feature hint:** Q1.2 may contain a named starting sub-feature or `pick after map`. Either way, Step 1 (feature phase) runs first and Step 2 resolves `S` against the approved map.

---

## A2 — destructuring.md

**Schema:** see [destructuring.md § Procedure step 4 & step 9](destructuring.md).

**Producer:** Step 1.1 (feature phase). `ui-explorer` invoked with `mode: feature-baseline` traverses the feature holistically and returns BOTH `_shared-ui.md` (A-shared-ui) AND the sub-feature map written here. Cross-cutting concerns section is added in Step 1.4.

**Cheap validation:**
```bash
grep -q '^## Cross-cutting concerns' test-cases/{F}/destructuring.md && \
grep -q '^- \[[x ]\]' test-cases/{F}/destructuring.md
```

**Mutability:** Step 4 toggles `- [ ]` → `- [x]` for the just-completed sub-feature. Never edit anything else.

**Terminal state:** all lines match `^- \[x\]` → user can run `/publish-test-cases-batch test-cases/{F}/` to push the whole feature.

---

## A-base — _ac-baseline.md (feature-level)

**Purpose:** flat list of ACs extracted once from product docs/help center for the entire feature. Each sub-feature later references applicable AC IDs without re-extracting. Replaces per-sub-feature `{S}-ac-list.md` full body with a shared source.

**Path:** `test-cases/{F}/_ac-baseline.md`

**Producer:** Step 1.2 (feature phase, after UI baseline exists). Docs are fetched with WebFetch; inferred ACs come from product knowledge if docs are thin.

**Consumers:** Step 2.1 (filter baseline ACs applicable to a sub-feature), Step 3 Phase 1 checklist, Gate 1 AC coverage (combined with `{S}-ac-delta.md`).

**Schema (frontmatter required):**
```yaml
---
feature: {feature-slug}
source: docs | inferred | mixed
sources:
  - {url or doc path}
  - ...
ac_count: N
generated_at: {ISO8601}
---

AC-1: {verifiable requirement}
AC-2: ...
```

Body is a flat list of `AC-N: ...` lines. IDs are **feature-global** — `AC-17` in baseline is the same AC-17 for every sub-feature. `UNCLEAR` items keep `AC-N: UNCLEAR — {question}`.

**Cheap validation:**
```bash
head -10 test-cases/{F}/_ac-baseline.md | grep -q '^ac_count:' && \
  actual=$(grep -cE '^AC-[0-9]+:' test-cases/{F}/_ac-baseline.md) && \
  [ "$actual" -ge 1 ]
```

**Mutability:** read-only after Step 1.2. User may manually append/clarify ACs before Step 1.5 approval. Never written by any sub-feature phase.

---

## A-shared-ui — _shared-ui.md (feature-level)

**Purpose:** catalog of UI elements shared across the feature (top nav, breadcrumbs, sidebar, feature-wide toolbars, common modals, bulk-action bars, global toasts). Explored once in Step 1.1; each sub-feature delta references but never re-catalogs these.

**Path:** `test-cases/{F}/_shared-ui.md`

**Producer:** Step 1.1 (feature phase). `ui-explorer` subagent invoked with `mode: feature-baseline` — walks the feature's main surfaces at a breadth-first level, identifies candidate sub-features, catalogs shared chrome.

**Consumers:** Step 2.2 (ui-explorer `sub-feature-delta` mode receives this path as `shared_catalog_path` to avoid re-cataloging), Step 3 Phase 3b ui-validator (combined with `{S}-ui-delta.md`), Gate 11 implementation-leak check.

**Schema:** same format as [ui-catalog-format.md](ui-catalog-format.md), with feature-baseline frontmatter:

```yaml
---
feature: {F}
scope: feature-baseline
entry_url: {url}
explored_at: {ISO8601}
explored_by: ui-explorer
mode: feature-baseline
shared_surfaces: N        # count of surfaces cataloged (nav, sidebar, modals, etc.)
candidate_sub_features: M # count of sub-features identified for destructuring
gaps: count
---
```

**Cheap validation:**
```bash
head -20 test-cases/{F}/_shared-ui.md | \
  awk '/^mode: feature-baseline/{m=1} /^shared_surfaces: [1-9]/{s=1} END{exit !(m && s)}'
```

**Mutability:** read-only after Step 1.1. User may manually add a missed shared element before Step 1.5 approval.

---

## A-steps — _existing-steps.md (feature-level)

**Purpose:** reusable step phrases already defined in Testomat.io for this feature's suite(s) — so Step 3 Phase 2 can prefer matching wording over inventing new phrasings and avoid step-library churn.

**Path:** `test-cases/{F}/_existing-steps.md`

**Producer:** Step 1.3 (feature phase). Uses Testomat MCP (`mcp__testomatio__steps_list` / `steps_search`) to fetch steps tagged or linked to this feature. Optional — skip if MCP unavailable or feature has no prior coverage.

**Consumers:** Step 3 Phase 2 (test generation — reuses existing step phrases when semantically equivalent).

**Schema:**
```markdown
---
feature: {F}
fetched_at: {ISO8601}
step_count: N
source: testomatio-mcp
---

## Existing step phrases

- I log in as ${role}
- I open Settings → Labels
- ...
```

**Cheap validation:**
```bash
test ! -f test-cases/{F}/_existing-steps.md || \
  (head -10 test-cases/{F}/_existing-steps.md | grep -q '^step_count:')
```
(Artifact is optional — validation passes if file absent OR if present with frontmatter.)

**Mutability:** read-only after Step 1.3. Stale after long periods — can be regenerated manually via Testomat MCP if needed.

---

## A3 — {S}-ac-delta.md (sub-feature)

**Purpose:** sub-feature-specific AC layer. Instead of re-listing all feature ACs, records (a) which baseline ACs apply to this sub-feature and (b) additional ACs that emerged from sub-feature-specific exploration or docs.

**Path:** `test-cases/{F}/{S}-ac-delta.md`

**Producer:** Step 2.1 (sub-feature slice). Reads `_ac-baseline.md`, filters applicable IDs, adds delta.

**Consumers:** Step 3 Phase 1 checklist (merged with baseline), Phase 3a Gate 1 AC coverage (combined pool = `baseline_acs_applicable` + delta `AC-*`).

**Schema (frontmatter required):**
```yaml
---
feature: {feature-slug}
suite: {suite-slug}
references: _ac-baseline.md
baseline_acs_applicable: [AC-3, AC-7, AC-12]   # IDs from _ac-baseline.md that this sub-feature must cover
delta_ac_count: N                              # count of NEW ACs below (ac-delta-*)
source: inferred | docs | mixed
---

## Baseline ACs applicable to {S}
- AC-3 (baseline)
- AC-7 (baseline)
- AC-12 (baseline)

## Delta ACs (sub-feature-specific)

ac-delta-1: {new verifiable requirement found only in this sub-feature}
ac-delta-2: ...
```

Delta AC IDs use `ac-delta-N` prefix to keep them visually distinct from feature-global `AC-N`. If a sub-feature has zero delta, `delta_ac_count: 0` and the Delta ACs section is empty but the heading remains.

**Cheap validation:**
```bash
head -15 test-cases/{F}/{S}-ac-delta.md | grep -q '^references: _ac-baseline.md' && \
  head -15 test-cases/{F}/{S}-ac-delta.md | grep -qE '^baseline_acs_applicable: \[' && \
  grep -qE '^## Baseline ACs applicable' test-cases/{F}/{S}-ac-delta.md
```
At least one baseline AC must be applicable (sub-features that touch zero baseline ACs suggest destructuring error — flag to user).

**Mutability:** read-only after Step 2.1.

---

## A4 — {S}-ui-delta.md (sub-feature)

**Purpose:** UI elements **specific** to this sub-feature that are NOT in `_shared-ui.md`. Avoids re-cataloging feature-wide chrome (nav, sidebar, common modals).

**Path:** `test-cases/{F}/{S}-ui-delta.md`

**Producer:** Step 2.2 (sub-feature slice). `ui-explorer` invoked with `mode: sub-feature-delta` and `shared_catalog_path: test-cases/{F}/_shared-ui.md`. Subagent reads the shared catalog first, then explores this sub-feature's unique surfaces and writes ONLY the delta.

**Consumers:** Step 3 Phase 1/2 (generation references both shared + delta), Phase 3b ui-validator (combined view), Gate 11 impl-leak check.

**Schema:** same format as [ui-catalog-format.md](ui-catalog-format.md), with delta frontmatter:

```yaml
---
feature: {F}
suite: {S}
scope: sub-feature-delta
references: _shared-ui.md
entry_url: {sub-feature url}
explored_at: {ISO8601}
explored_by: ui-explorer
mode: sub-feature-delta
delta_elements: N         # NEW elements added here (excluding anything in _shared-ui.md)
verified_flows: K         # sub-feature-specific flows
gaps: count
---
```

Body contains ONLY elements not already in `_shared-ui.md`. If an element visible in this sub-feature also appears in shared (e.g., global Save toolbar), it is NOT repeated — consumers read both files.

**Cheap validation:**
```bash
head -20 test-cases/{F}/{S}-ui-delta.md | \
  awk '/^mode: sub-feature-delta/{m=1} /^references: _shared-ui.md/{r=1} /^delta_elements: [0-9]+/{d=1} END{exit !(m && r && d)}'
```
`delta_elements: 0` is allowed (sub-feature has no unique elements, lives entirely on shared surfaces) but rare — flag to user for confirmation when this happens.

**Mutability:** `ui-explorer` may append a "Gap-focused follow-up" section on retry. Frontmatter `gaps` count is updated in place.

---

## A5 — {S}-scope.md

**Schema:**
```markdown
# Scope: {feature} / {suite}

**Date:** YYYY-MM-DD

## In Scope
- {item} — covers AC-N
- ...

## Out of Scope
- {item} — reason: {justification}
- ...

## Unclear ACs
- AC-N: {question} — {resolution or "deferred"}

## Sources Used
- {source link or "UI catalog only"}
```

**Cheap validation:**
```bash
for h in '^## In Scope' '^## Out of Scope' '^## Unclear ACs' '^## Sources Used'; do
  grep -q "$h" test-cases/{F}/{S}-scope.md || { echo "missing: $h"; exit 1; }
done
```
All four headings must exist.

---

## A6 — {S}-test-cases.md / {S}/*.md

**Schema:** see [test-case-format.md](test-case-format.md).

**Flat vs nested decision:** single file if Phase 1 Grouping wrote `Output: flat`; directory if `Output: nested`. Mismatch = Phase 3a violation.

**Cheap validation:**
```bash
# flat
test -f "test-cases/{F}/{S}-test-cases.md" && \
  grep -cE '^## ' "test-cases/{F}/{S}-test-cases.md"
# nested
test -d "test-cases/{F}/{S}" && \
  find "test-cases/{F}/{S}" -name '*.md' -type f | wc -l
```

Test count must equal number of `^## ` lines (minus 1 for `## Steps` inside each test — grep for `^## (?!Steps)` is more precise; use `grep -cE '^## ' file | awk '{print $1 - N_steps_headings}'`).

See [Phase 3a gate-check recipes](#phase-3a-gate-check-recipes) below for the canonical counting commands.

**Mutability:**
- Phase 3a mechanical: test-case-reviewer auto-fixes (scope compliance, role names, step quality)
- Phase 3b ui-validator: in-place fixes for element names, toast text, step mechanics
- Phase 4: regeneration on user reject (overwrites)

---

## A7 — {S}-review.md

Produced by `test-case-reviewer` subagent for suites ≥15 tests. Free-form violations report.

**Cheap validation:**
```bash
test -f test-cases/{F}/{S}-review.md && \
  grep -q '^violations:' test-cases/{F}/{S}-review.md
```

---

## A8 — {S}-validation-log.md (sub-feature)

**Purpose:** audit trail written by the `ui-validator` subagent during Step 3 Phase 3b. Captures which tests were walked in the real UI, which `_Expected_:` mismatches were fixed, and which gaps (unresolvable element names, missing UI surfaces) remain. **Not published to Testomat.io.**

**Path:** `test-cases/{F}/{S}-validation-log.md` — sub-feature-level aggregate. For nested suites, ALL section files (e.g. `dialog-lifecycle.md`, `form-fields.md`) share a single log file; each validation run appends a new `## Section: {section_label}` block.

**Why separate from A6 test MD:** Testomat.io's markdown parser treats top-level `##` headings as suite/test boundaries. Appending a `## Validation Log` section inside the test MD creates a phantom test or breaks the nested-suite structure. Regression detected 2026-04-20: 20 test files had `## Validation Log` leaked from Phase 3b and had to be stripped retroactively.

**Schema:**
```markdown
# Validation Log: {suite_slug}

Aggregated audit trail written by ui-validator subagent during Step 3 Phase 3b. Not published to Testomat.io.

## Section: {section_label}

**Validated by:** ui-validator (subagent)
**Validated at:** {ISO8601}
**Test MD:** {relative path}
**Tests walked:** {test titles}
**Mismatches fixed:** {count}
**Gaps:** {count} — {one-line per gap}

{Optional free-form notes: actual UI strings verified, discrepancies with catalog, etc.}
```

**Producer:** `ui-validator` subagent (Step 3 Phase 3b). Creates file on first validation; appends new `## Section:` block on subsequent validations within the same sub-feature.

**Consumer:** humans reviewing what changed; Step 4 report (can reference `Mismatches fixed: N` in the final sub-feature report); future audits / retrospectives.

**Cheap validation:**
```bash
test -f test-cases/{F}/{S}-validation-log.md && \
  grep -qE '^(# Validation Log|## Section:)' test-cases/{F}/{S}-validation-log.md
```

**Mutability:** skill appends; user may manually prune old entries. Never deleted by the skill automatically.

**Edge cases:**
- **Zero mismatches, zero gaps** — still write a section entry with `Mismatches fixed: 0 | Gaps: 0` so the audit trail records that validation happened. Silence would be ambiguous ("didn't run" vs "ran clean").
- **Sub-feature is flat (single MD file)** — `section_label` equals the suite slug itself; file name still follows `{S}-validation-log.md`.

---

## A-style — _style.md (feature-level)

**Purpose:** capture style patterns from the FIRST approved sub-feature of a feature so every subsequent sub-feature stays stylistically consistent (preconditions phrasing, step granularity, voice, title pattern, tags, automation defaults). Prevents drift between sub-feature #1 and #5 when each is generated in a separate conversation (context-isolated).

**Path:** `test-cases/{F}/_style.md` — `_` prefix signals feature-level shared artifact (not suite-scoped).

**Schema:** see template in [steps/40-report.md § step 3 Style capture](../steps/40-report.md).

**Producer:** Step 4, only on the FIRST sub-feature to flip from `[ ]` to `[x]` in destructuring.md. On subsequent approvals Step 4 checks existence and **skips write** — the user may have edited the file manually and the skill must not clobber their edits.

**Consumer:** Step 3 Phase 2 of every subsequent sub-feature in the same feature. The Phase 2 header instructs: "if `_style.md` exists → Read it FIRST, match conventions exactly".

**Cheap validation:**
```bash
test -f test-cases/{F}/_style.md && \
  grep -qE '^## (Preconditions|Steps|Titles|Tags)' test-cases/{F}/_style.md
```
At least one of the four section headers must be present. If validation fails → treat as absent (do not read); Step 3 of the next approved sub-feature will overwrite.

**Mutability:** write-once by the skill; user-editable thereafter. If the user wants to reset the style (e.g., they realize after #2 that #1's style was wrong), they manually delete `_style.md` → next approval re-captures from the new reference.

**Edge cases:**
- **Single-sub-feature feature (only one row in destructuring.md):** file is still created on first approval — harmless, since there's no "next" sub-feature to reuse it; it simply documents style for future additions
- **Style contradicts current sub-feature's needs:** generator should still match `_style.md`; if a Phase 3 gate fails because of the style constraint → surface to user with option "accept one-off deviation for this sub-feature" vs "update `_style.md` going forward"

---

## State transitions

```
FEATURE PHASE (one conversation, HARD STOP at end)

  (empty) ──Step 0──▶ A1 intake
                       │
                       ├─Step 1.1─▶ A-shared-ui + A2 (map)   (ui-explorer: feature-baseline)
                       ├─Step 1.2─▶ A-base (_ac-baseline.md)  (docs fetch)
                       ├─Step 1.3─▶ A-steps (optional)        (Testomat MCP)
                       └─Step 1.4─▶ A2 cross-cutting section added
                       [HARD STOP — user approves map + baselines]

SUB-FEATURE PHASE (one conversation per sub-feature, repeats N times)

  A1 + A2 + A-base + A-shared-ui (+ A-steps)
                       │
                       ├─Step 2.1─▶ A3 {S}-ac-delta (references A-base)
                       ├─Step 2.2─▶ A4 {S}-ui-delta (ui-explorer: sub-feature-delta, references A-shared-ui)
                       └─Step 2.3─▶ A5 {S}-scope
                                    │
                                    └─Step 3 Phase 2─▶ A6 test-cases
                                                       │
                                                       ├─Phase 3a/3b (mutates A6, may produce A7)
                                                       │
                                                       └─Step 4─▶ toggles A2 [x]; on FIRST approval writes A-style (_style.md)
                                                                  [HARD STOP — next sub-feature starts fresh conversation]
```

Publishing (branch creation, push, label application, batch) is owned by `/publish-test-cases-batch` — outside this state machine.

---

## Phase 3a gate-check recipes

Every check below exits 0 on pass, non-zero on fail. SKILL.md Phase 3a runs these as a batch — any non-zero exit blocks Phase 4 and routes back to regeneration.

**Convention in this section:** bash vars `F` = feature-slug, `S` = suite-slug, `MD` = A6 path (flat file **or** concatenation of nested files).

### Set up variables for a run

```bash
F="manual-tests-execution"
S="time-tracking"
# Resolve A6 path
if [ -f "test-cases/$F/$S-test-cases.md" ]; then
  MD="test-cases/$F/$S-test-cases.md"
  MDS=("$MD")
elif [ -d "test-cases/$F/$S" ]; then
  MDS=(test-cases/$F/$S/*.md)
  MD="${MDS[0]}"  # primary for header checks
else
  echo "A6 missing"; exit 1
fi
```

### Gate 1 — Every AC has ≥1 test

AC pool = (baseline ACs applicable to this sub-feature) ∪ (delta ACs from `{S}-ac-delta.md`).

```bash
# Applicable baseline ACs come from the frontmatter list `baseline_acs_applicable: [AC-3, AC-7, ...]`
base_acs=$(awk '/^baseline_acs_applicable:/{
  sub(/^baseline_acs_applicable: *\[/, ""); sub(/\].*$/, "");
  gsub(/,/, " "); gsub(/ +/, " "); print; exit
}' "test-cases/$F/$S-ac-delta.md")
delta_acs=$(grep -oE '^ac-delta-[0-9]+' "test-cases/$F/$S-ac-delta.md" | sort -u)
ac_ids="$base_acs $delta_acs"
missing=0
for ac in $ac_ids; do
  [ -z "$ac" ] && continue
  if ! grep -qE "^source:.*\b$ac\b" "${MDS[@]}"; then
    echo "uncovered: $ac"
    missing=$((missing+1))
  fi
done
[ $missing -eq 0 ]
```

### Gate 2 — Priority pyramid in bounds

```bash
total=$(grep -cE '^priority:' "${MDS[@]}" | awk -F: '{s+=$NF} END{print s}')
crit=$(grep -cE '^priority: critical' "${MDS[@]}" | awk -F: '{s+=$NF} END{print s}')
high=$(grep -cE '^priority: high' "${MDS[@]}" | awk -F: '{s+=$NF} END{print s}')
norm=$(grep -cE '^priority: normal' "${MDS[@]}" | awk -F: '{s+=$NF} END{print s}')
low=$(grep -cE '^priority: low' "${MDS[@]}" | awk -F: '{s+=$NF} END{print s}')
# Advisory for <15 tests, blocking for ≥15
if [ $total -ge 15 ]; then
  awk -v c=$crit -v h=$high -v n=$norm -v l=$low -v t=$total 'BEGIN{
    if (c/t > 0.15) { print "critical > 15%"; exit 1 }
    if (h/t > 0.35) { print "high > 35%"; exit 1 }
    if (n/t < 0.35) { print "normal < 35%"; exit 1 }
    if (l/t < 0.05) { print "low < 5%"; exit 1 }
  }'
fi
```

### Gate 3 — Automation classification present on every test

```bash
tests=$(grep -cE '^## ' "${MDS[@]}" | awk -F: '{s+=$NF} END{print s}')
# subtract "## Steps" headings
steps=$(grep -cE '^## Steps$' "${MDS[@]}" | awk -F: '{s+=$NF} END{print s}')
real_tests=$((tests - steps))
auto=$(grep -cE '^automation: (candidate|deferred|manual-only)' "${MDS[@]}" | awk -F: '{s+=$NF} END{print s}')
[ "$auto" -eq "$real_tests" ]
```

### Gate 4 — Manual-only rate ≤30%

```bash
manual=$(grep -cE '^automation: manual-only' "${MDS[@]}" | awk -F: '{s+=$NF} END{print s}')
awk -v m=$manual -v t=$real_tests 'BEGIN{exit !(t==0 || m/t <= 0.30)}'
```

### Gate 5 — No forbidden metadata fields (break push)

```bash
! grep -qE '^(tags|labels):' "${MDS[@]}"
```

### Gate 6 — Scope compliance (no OUT OF SCOPE items leaked in)

```bash
# OUT OF SCOPE item lines look like "- {item} — reason: ..."
oos=$(awk '/^## Out of Scope/{flag=1;next} /^## /{flag=0} flag && /^- /{sub(/ *— *reason.*/,""); sub(/^- /,""); print}' \
        "test-cases/$F/$S-scope.md")
leak=0
while IFS= read -r item; do
  [ -z "$item" ] && continue
  if grep -qiF "$item" "${MDS[@]}"; then
    echo "scope leak: $item"
    leak=$((leak+1))
  fi
done <<< "$oos"
[ $leak -eq 0 ]
```

This is a text-match heuristic — if OUT OF SCOPE items have descriptive names that naturally appear in prose ("Dashboard"), the check over-flags. In that case the reviewer must manually confirm. Gate 6 is advisory only when the suite has short out-of-scope labels — blocking otherwise. See SKILL.md Phase 3a for the escalation hook.

### Gate 7 — Role names match product-context.md § User Roles

```bash
! grep -E '^\*\*Preconditions:\*\*.*(mainUser|qaUser|managerUser|readonlyUser)' "${MDS[@]}"
```

### Gate 8 — Minimum step count per standalone test (blocking if >20%)

```bash
# Count steps per test: for each "## Title" block, count "^- " bullets under "## Steps"
# Short script: awk pass that tracks current test and step count
short=$(awk '
  /^## / && !/^## Steps$/ { if (test && count < 3) short++; test=$0; count=0; next }
  /^## Steps$/ { in_steps=1; next }
  /^## / { in_steps=0; next }
  in_steps && /^[-*] / { count++ }
  END { if (test && count < 3) short++; print short+0 }
' "${MDS[@]}")
awk -v s=$short -v t=$real_tests 'BEGIN{exit !(t==0 || s/t <= 0.20)}'
```

### Gate 9 — Forbidden `id:` field (server-generated only)

```bash
! grep -qE '^id: @[ST]' "${MDS[@]}"
```

### Gate 10 — Sub-suite distribution consistency

If the Phase 1 header says `Output: nested` → A6 must be a directory. If `Output: flat` → A6 must be a single file. See [self-review-checks.md § 8](self-review-checks.md#8-sub-suite-distribution).

```bash
header=$(head -5 "$MD" | grep -oE '^Output: (nested|flat)' | awk '{print $2}')
case "$header" in
  nested) [ -d "test-cases/$F/$S" ] ;;
  flat)   [ -f "test-cases/$F/$S-test-cases.md" ] ;;
  *)      echo "missing Phase 1 Output: header"; exit 1 ;;
esac
```

### Gate 11 — No implementation leakage in Step / Expected text

Forbidden in Steps and `_Expected_:` lines: CSS class names, MDI icon class names, `data-test-id`, `aria-describedby`, `aria-labelledby`, raw `<script>`/`<img onerror>`/`<iframe onload>` payloads, inline AC refs (`(AC-N)` or bare `AC-N` outside the `source:` frontmatter). Full rationale + rewrite table: [test-case-format.md § Anti-patterns in test case bodies](test-case-format.md).

```bash
# Target lines: "- step line" or lines starting "  _Expected_:" (incl. bullet sub-items under _Expected_).
# Skip frontmatter (`source: AC-...` is correct there).
leak_lines=$(awk '
  /^<!-- test/,/^-->$/ { next }                            # skip test frontmatter blocks
  /^(  - |- |  _Expected_:|_Expected_:)/ {
    if ($0 ~ /\b(bg-|text-|ring-|hover:|focus:)[a-z0-9-]+/) { print FILENAME":"NR": css-class: "$0; flag=1 }
    if ($0 ~ /\bmd-icon-[a-z-]+/)                          { print FILENAME":"NR": icon-class: "$0; flag=1 }
    if ($0 ~ /\.(keyboard-shortcut-[a-z-]+|[a-z-]+-icon)\b/) { print FILENAME":"NR": css-selector: "$0; flag=1 }
    if ($0 ~ /\b(data-test-id|aria-describedby|aria-labelledby)\b/) { print FILENAME":"NR": selector-attr: "$0; flag=1 }
    if ($0 ~ /\(AC-[0-9]+\)|\bAC-[0-9]+\b/)                { print FILENAME":"NR": inline-AC-ref: "$0; flag=1 }
    if ($0 ~ /<script[ >]|<img[^>]*onerror|<iframe[^>]*onload/) { print FILENAME":"NR": raw-exploit-payload: "$0; flag=1 }
  }
' "${MDS[@]}")
[ -z "$leak_lines" ] || { echo "$leak_lines"; echo "Gate-11 FAIL"; exit 1; }
```

### Gate 12 — Parameterized tests reference `${col}` in title

Any test with an `<!-- example -->` table MUST reference at least one column name via `${col_name}` in its title — otherwise every row renders with an identical title in Testomat.io. Full rule: [test-case-format.md § Parameterized title rule](test-case-format.md).

```bash
# For each MD: walk tests in order; if a test block contains <!-- example -->, its title must have ${...}
for f in "${MDS[@]}"; do
  awk -v file="$f" '
    /^## / && !/^## Steps$/ { title=$0; has_example=0 }
    /<!-- example/ { has_example=1 }
    /^## / && !/^## Steps$/ && NR>1 {
      # When we hit the next test heading, verify the previous one
      if (prev_has_example && prev_title !~ /\$\{[a-zA-Z_]+\}/) {
        print file": parameterized title missing ${col}: "prev_title; flag=1
      }
      prev_title=title; prev_has_example=has_example
      next
    }
    { prev_title=title; prev_has_example=has_example }
    END {
      if (prev_has_example && prev_title !~ /\$\{[a-zA-Z_]+\}/) {
        print file": parameterized title missing ${col}: "prev_title; flag=1
      }
      exit flag
    }
  ' "$f" || { echo "Gate-12 FAIL"; exit 1; }
done
```

### Gate 13 — No process-metadata sections leaked into test MD

Test MDs must contain ONLY test cases (H1 suite title + test H2s + `## Steps` + `## Preconditions`). **Process metadata** — validation logs, reviewer notes, TODOs, placeholders — must NOT appear at top level, because Testomat.io's markdown parser treats `## Foo` as either a suite boundary or a test title, which creates ghost tests or breaks nested-suite structure.

Forbidden H2 headings in test MDs:
- `## Validation Log` (belongs in `{S}-validation-log.md` — see A8)
- `## Review Log` / `## Self-Review` / `## Gap Log` (belongs in `{S}-review.md` — see A7)
- `## Notes` / `## Comments` / `## TODO` / `## FIXME` (stray dev annotations)
- Any `## Section:` block outside a dedicated log file

Also forbidden: placeholder tokens (`[TBD]`, `[UNDEFINED]`, `[NEEDS REVIEW]`, `PLACEHOLDER`) and stray `TODO:` / `FIXME:` / `XXX:` lines.

Regression origin: 2026-04-20 — 20 test files had `## Validation Log` appended by the ui-validator subagent; required retroactive cleanup + separate A8 artifact.

```bash
# Build MDS array the normal way (see § Set up variables for a run)
forbidden_h2='^## (Validation Log|Review Log|Self-Review|Gap Log|Notes|Comments|TODO|FIXME|Section:)'
placeholder_tokens='\[TBD\]|\[UNDEFINED\]|\[NEEDS\b|\bPLACEHOLDER\b'
dev_markers='^[[:space:]]*(TODO|FIXME|XXX):'

viol=$(grep -nEH "$forbidden_h2" "${MDS[@]}" 2>/dev/null)
viol+=$(grep -nEH "$placeholder_tokens" "${MDS[@]}" 2>/dev/null)
viol+=$(grep -nEH "$dev_markers" "${MDS[@]}" 2>/dev/null)

if [ -n "$viol" ]; then
  echo "Gate-13 FAIL — process metadata / placeholders leaked into test MD:"
  echo "$viol"
  exit 1
fi
```

**Auto-fix policy:** Gate 13 is **not** auto-fixable by the skill. Each hit points to a subagent (usually ui-validator or test-case-reviewer) writing to the wrong file. Route: strip offending section from the test MD + re-check the producing subagent's output path + re-run the phase that produced it.

---

## Resume Detector input

The Step 0 Resume Detector reads each artifact path above, runs the cheap validation, and emits a two-section table (feature state + sub-feature state):

**Feature-level state:**

| Artifact | Exists | Valid | Action |
|---|---|---|---|
| A1 intake | Y/N | Y/N | reuse / re-run Step 0 |
| A-shared-ui _shared-ui.md | Y/N | Y/N | if N → resume Step 1.1 |
| A-base _ac-baseline.md | Y/N | Y/N | if N → resume Step 1.2 |
| A-steps _existing-steps.md | Y/N/- | Y/N/- | optional; - = skipped |
| A2 destructuring | Y/N | Y/N | if N → resume Step 1.4 |
| A-style _style.md | Y/N/- | Y/N/- | - = no sub-feature approved yet |

**Sub-feature-level state** (for the current `{S}` in focus):

| Artifact | Exists | Valid | Action |
|---|---|---|---|
| A3 {S}-ac-delta | Y/N | Y/N | - |
| A4 {S}-ui-delta | Y/N | Y/N | - |
| A5 {S}-scope | Y/N | Y/N | - |
| A6 {S}-test-cases | Y/N | Y/N | - |
| A7 {S}-review | Y/N/- | Y/N/- | - = suite < 15 tests |

**State decision tree:**
- No A1 → Step 0
- A1 only → Step 1 feature phase
- A1 + partial feature artifacts → resume first missing feature substep
- All feature artifacts + no sub-feature picked → ask user which sub-feature to start
- Sub-feature partial (some of A3-A5) → resume Step 2 at first missing
- A3-A5 complete, A6 missing → Step 3
- A6 exists → Phase 3/4; on done, ask "next sub-feature? regenerate? stop?"

See SKILL.md § Step 0 Resume Detector for the runbook.
