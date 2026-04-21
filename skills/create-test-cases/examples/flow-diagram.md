### Full flow diagram

Main flow on the left, subagents block on the right. The `═══▶` arrows show which step spawns which subagent; the subagent runs in **its own isolated context** and returns a **1-line summary** to the parent conversation.

```
┌──────────────────────────────────────────────────────────────────┐
│  PRE-STEP — Resume Detector                                      │
│  Runs BEFORE every step. Scans disk without reading file bodies. │
│  Derives $RESUME_FROM from 7 states: empty / feature-partial /   │
│  feature-done / sub-feature-partial / sub-feature-ready /        │
│  sub-feature-done / all-features-done.                           │
└──────────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────────┐      ╔══════════════════════════════════╗
│  FEATURE PHASE  (ONE conversation — ends with HARD STOP)         │      ║  SUBAGENTS (isolated contexts)   ║
│  Produces shared baselines consumed by every sub-feature.        │      ║                                  ║
│                                                                  │      ║  ┌────────────────────────────┐  ║
│    Step 0  Intake questionnaire (5 questions, one at a time)     │      ║  │ 🧭 ui-explorer             │  ║
│            → intake.md                                           │      ║  │   mode: feature-baseline   │  ║
│                                                                  │      ║  │   — Playwright walkthrough │  ║
│    Step 1  Gather feature data (in parallel)                     │      ║  │   — browser_snapshot ×N    │  ║
│       1.1  UI exploration of the whole feature ══════════════════╪══════╪═▶│   — write _shared-ui.md    │  ║
│            → _shared-ui.md + sub-feature candidates              │      ║  │   ← "Cataloged 8 surfaces" │  ║
│       1.2  Extract ACs from docs (MCP / WebFetch / paste)        │      ║  └────────────────────────────┘  ║
│            → _ac-baseline.md                                     │      ║                                  ║
│       1.3  Existing-steps library (optional)                     │      ║  ┌────────────────────────────┐  ║
│            → _existing-steps.md                                  │      ║  │ 🧭 ui-explorer             │  ║
│       1.4  Destructuring + cross-cutting concerns                │      ║  │   mode: sub-feature-delta  │  ║
│            → destructuring.md                                    │      ║  │   — reads _shared-ui.md    │  ║
│       1.5  Single user-approval gate                ⛔ HARD STOP │      ║  │   — catalog ONLY delta     │  ║
└──────────────────────────────────────────────────────────────────┘      ║  │   — write {S}-ui-delta.md  │  ║
                        │                                                 ║  │   ← "4 delta surfaces"     │  ║
                        ▼   (new conversation per sub-feature)            ║  └────────────────────────────┘  ║
┌──────────────────────────────────────────────────────────────────┐      ║                                  ║
│  SUB-FEATURE PHASE  (ONE conversation per sub-feature, ×N)       │      ║  ┌────────────────────────────┐  ║
│                                                                  │      ║  │ ✅ test-case-reviewer      │  ║
│    Step 2  Thin slice                                            │      ║  │   ONLY if tests ≥ 15       │  ║
│       2.1  AC delta for the sub-feature   → {S}-ac-delta.md      │      ║  │   — 12 Bash gates          │  ║
│       2.2  UI delta                       → {S}-ui-delta.md ═════╪══════╪═▶│   — 11 semantic checks     │  ║
│       2.3  AC↔UI cross-validation         (no file)              │      ║  │   — auto-fix safe items    │  ║
│       2.4  Scope contract + user gate     → {S}-scope.md         │      ║  │   — violations report      │  ║
│                                                                  │      ║  │   ← "Found 4, fixed 3,     │  ║
│    Step 3  Generate                                              │      ║  │      escalated 1"          │  ║
│       Phase 0  Feed cross-cutting concerns from destructuring.md │      ║  └────────────────────────────┘  ║
│       Phase 1  Checklist + flat-vs-nested decision               │      ║                                  ║
│       Phase 2  Full test cases                                   │      ║  ┌────────────────────────────┐  ║
│               (reads _style.md if present)                       │      ║  │ 🔍 ui-validator            │  ║
│       Phase 3a Mechanical checks  ═══════════════════════════════╪══════╪═▶│   — Playwright walkthrough │  ║
│               < 15 tests: inline                                 │      ║  │   — pick 2-3 repr. tests   │  ║
│               ≥ 15 tests: test-case-reviewer subagent            │      ║  │   — verify vs. real UI     │  ║
│       Phase 3b UI reality check  ════════════════════════════════╪══════╪═▶│   — edit MD inline on fix  │  ║
│               (mandatory)                                        │      ║  │   — separate audit log     │  ║
│       Phase 4  Single user-approval gate                         │      ║  │   ← "Walked 3, fixed 2"    │  ║
│                                                                  │      ║  └────────────────────────────┘  ║
│    Step 4  Report + update tracker in destructuring.md           │      ║                                  ║
│            + write _style.md (ONLY on 1st approval) ⛔ HARD STOP │      ║  Principle:                      ║
└──────────────────────────────────────────────────────────────────┘      ║  • parent spawns via Agent()     ║
                        │                                                 ║  • Playwright / heavy dumps      ║
                        ▼   (when ALL sub-features in destructuring.md [x])║    live inside the subagent      ║
┌──────────────────────────────────────────────────────────────────┐      ║  • parent sees 1 summary line    ║
│  HANDOFF                                                         │      ║    — context stays clean         ║
│    /publish-test-cases-batch test-cases/{F}/                     │      ╚══════════════════════════════════╝
│    (separate skill — one branch per sub-feature: tc/{F}/{S})     │
└──────────────────────────────────────────────────────────────────┘
```
