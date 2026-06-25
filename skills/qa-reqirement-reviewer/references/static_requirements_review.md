# Static Requirements Review — Examples

A small, deliberately flawed draft — the kind of thing that lands in review — turned into the static requirements review. The input has loose structure and mixed quality; the review works with it as-is and does not rewrite it.

## Input (draft BRD excerpt)

```
Search Feature — Business Requirements (draft)

1. The search must be fast and return relevant results.
2. Users can search by keyword and filter by date, and results should be exportable.
3. The system should handle a large number of users.
4. Search results are stored for reporting.
```

## Output

```markdown
## Static Requirements Review Overview

### Impacted Areas
- Search functionality
- User experience
- Reporting module

### Quality Assessment (Core Analysis)

| Criterion | Assessment | Notes |
| --------- | ---------- | ----- |
| Atomic | ⚠️ Concern | R2 contains three behaviors |
| Complete | ❌ Fail | No error or empty-state behavior defined |
| Consistent | ✅ Pass | No contradictions found |
| Unambiguous | ❌ Fail | R1: "fast" has no threshold |
| Feasible | ⚠️ Concern | R3: "large number" sets no target |
| Traceable | ✅ Pass | All connect to search feature goal |
| Testable | ❌ Fail | No measurable acceptance criteria |
| Prioritized | ⚠️ Concern | No priority stated |

### Ambiguities & Open Questions
- R1: What is the maximum acceptable response time, and at what data volume?
- R2: Should this be three separate requirements (keyword search, date filter, export)?
- R3: What concurrent-user count must search support?
- R4: What exactly is stored, for how long, and who can see it?

### Gaps & Issues Found
- R1: No measurable threshold for "fast"
- R2: Compound requirement — three behaviors cannot pass/fail independently
- R3: "Large number of users" has no target
- R4: Storage scope and retention not defined

### Risk Assessment

| Risk Type | Level | Description |
| --------- | ----- | ----------- |
| Implementation risk | Medium | Ambiguous performance targets |
| Testing risk | High | No measurable acceptance criteria |
| Business impact risk | Low | Minor — core functionality is defined |

### Acceptance Criteria Review
No acceptance criteria found. Suggest:
- Response time: Upload file time by one file should be les 1 sec
- Recall: top results match expected set for known queries

### Executive Summary

**Decision:** ❌ Not Ready

**Summary:** None of the four requirements is testable as written. R1 lacks a measurable threshold, R2 bundles three separate behaviors, and the set has no error-path coverage or acceptance criteria.

**Recommendation:** Resolve all open questions before approval. Add measurable acceptance criteria to each requirement.
```

---

## Another Example: User Stories

### Input (user stories)

```
As a user, I want to search for products by name so I can find what I'm looking for.
As a user, I want to filter search results by category so I can narrow down choices.
As a user, I want to export search results to PDF so I can share them with others.
```

### Output

```markdown
## Static Requirements Review Overview

### Impacted Areas
- Search functionality
- Product discovery
- Data export

### Quality Assessment (Core Analysis)

| Criterion | Assessment | Notes |
| --------- | ---------- | ----- |
| Atomic | ✅ Pass | Each story covers one behavior |
| Complete | ⚠️ Concern | No error/empty-state behavior in any story |
| Consistent | ✅ Pass | No contradictions found |
| Unambiguous | ✅ Pass | All terms defined |
| Feasible | ✅ Pass | All seem achievable |
| Traceable | ✅ Pass | User value is clear for each |
| Testable | ⚠️ Concern | Export: no format or content scope defined |
| Prioritized | ✅ Pass | Stories are small and sprint-ready |

### Ambiguities & Open Questions
- Export: Which format(s) — PDF only? What content — current page or full result set?
- Empty search results: What should the user see?
- Invalid input (special characters, empty query): How is this handled?

### Gaps & Issues Found
- No error-state or empty-state behavior defined across all stories
- Export: scope (page vs all results) and format not specified

### Risk Assessment

| Risk Type | Level | Description |
| --------- | ----- | ----------- |
| Implementation risk | Low | Stories are independent and estimable |
| Testing risk | Medium | Export scope ambiguity may cause rework |
| Business impact risk | Low | Core search value is clear |

### Acceptance Criteria Review
No formal acceptance criteria present. Suggest:
- Search returns results within Xms for queries under Y characters
- Filter reduces result set to only matching category
- Export produces valid PDF containing current result set

### Executive Summary

**Decision:** ⚠️ Needs Minor Clarifications

**Summary:** Stories are well-structured and pass most criteria. Minor clarification needed on export scope and empty-state behavior before approval.

**Recommendation:** Clarify export scope and add empty-state acceptance criteria. Otherwise ready for sprint planning.
```