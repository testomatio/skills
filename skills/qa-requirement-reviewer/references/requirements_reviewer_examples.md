# Requirements Review — Examples

A small, deliberately flawed draft — the kind of thing that lands in review — turned into a requirements review. The input has loose structure and mixed quality; the review works with it as-is and does not rewrite it.

## Example 1: Draft BRD

### Input (draft BRD excerpt)

```
Search Feature — Business Requirements (draft)

1. The search must be fast and return relevant results.
2. Users can search by keyword and filter by date, and results should be exportable.
3. The system should handle a large number of users.
4. Search results are stored for reporting.
```

### Output

```markdown
## Requirements Review

### Readiness Assessment

**Decision:** ❌ Not Ready

**Summary:** None of the four requirements is testable as written. R1 lacks a measurable threshold, R2 bundles three separate behaviors, and the set has no error-path coverage or acceptance criteria.

### Key Findings

| Requirement | Issue Type   | Finding | Question / Recommendation |
| ----------- | ------------ | ------- | ------------------------- |
| R1          | Testability  | "fast" has no measurable threshold | What is the maximum acceptable response time, and at what data volume? |
| R2          | Atomicity    | Three behaviors combined (search, filter, export) | Split into separate requirements for keyword search, date filter, and export |
| R3          | Clarity      | "large number of users" is undefined | What concurrent-user count must search support? |
| R4          | Completeness | Storage scope and retention not defined | What exactly is stored, for how long, and who can see it? |

### Ambiguities & Open Questions

* R1: What is the maximum acceptable response time, and at what data volume?
* R2: Should this be three separate requirements (keyword search, date filter, export)?
* R3: What concurrent-user count must search support?
* R4: What exactly is stored, for how long, and who can see it?

### Gaps & Issues

* R1: No measurable threshold for "fast"
* R2: Compound requirement — three behaviors cannot pass/fail independently
* R3: "Large number of users" has no target
* R4: Storage scope and retention not defined
* No error-state or empty-state behavior defined across all requirements

### Acceptance Criteria Review

No acceptance criteria found. Suggest:
- Response time: Search should return results within 1 second for queries under 50 characters
- Recall: Top results match expected set for known queries
- Empty state: Display "No results found" message when search returns zero matches
- Error state: Handle special characters and empty queries gracefully

### Risks & Impact

* Implementation risk: Medium — ambiguous performance targets may lead to rework
* Testing risk: High — no measurable acceptance criteria blocks test case design
* Business impact risk: Low — core functionality is defined but not verifiable

### Recommendation

Resolve all open questions before approval. Add measurable acceptance criteria to each requirement. Split compound requirement R2 into atomic requirements.
```

## Example 2: User Stories

### Input (user stories)

```
As a user, I want to search for products by name so I can find what I'm looking for.
As a user, I want to filter search results by category so I can narrow down choices.
As a user, I want to export search results to PDF so I can share them with others.
```

### Output

```markdown
## Requirements Review

### Readiness Assessment

**Decision:** ⚠️ Needs Clarification

**Summary:** Stories are well-structured and pass most criteria. Minor clarification needed on export scope and empty-state behavior before approval.

### Key Findings

| Requirement | Issue Type   | Finding | Question / Recommendation |
| ----------- | ------------ | ------- | ------------------------- |
| US1         | Completeness | 1. No empty-state behavior defined | 1. What should the user see when search returns zero results? |
| US2         | Completeness | 1. No error-state behavior defined | 1. How are invalid filter values handled? |
| US3         | Clarity      | 1. Export scope and format not fully specified | 1. Should export include current page or full result set? |

### Ambiguities & Open Questions

* Export: Which format(s) — PDF only? What content — current page or full result set?
* Empty search results: What should the user see?
* Invalid input (special characters, empty query): How is this handled?

### Gaps & Issues

* No error-state or empty-state behavior defined across all stories
* Export: scope (page vs all results) and format not specified

### Acceptance Criteria Review

No formal acceptance criteria present. Suggest:
- Search returns results within 500ms for queries under 50 characters
- Filter reduces result set to only matching category
- Export produces valid PDF containing full result set (or specify page vs all)

### Risks & Impact

* Implementation risk: Low — stories are independent and estimable
* Testing risk: Medium — export scope ambiguity may cause rework
* Business impact risk: Low — core search value is clear

### Recommendation

Clarify export scope and add empty-state acceptance criteria. Otherwise ready for sprint planning.
```