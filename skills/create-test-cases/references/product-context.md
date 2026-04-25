# Testomat.io — Product Context

Roles, entities, and relationships for test case design. Read this in Step 1.

---

## User Roles & Permissions

| Role | Code name | What they CAN do | What they CANNOT do |
|------|-----------|-----------------|---------------------|
| **Owner** | `mainUser` | Everything — full CRUD on all entities, manage users, project settings, billing | — |
| **Manager** | `managerUser` | Manage runs, plans, users. Create/edit/delete most entities | Change billing, delete project |
| **QA** | `qaUser` | Execute tests, create runs, edit test cases, manage own content | Delete other users' content, change project settings |
| **Read-only** | `readonlyUser` | View all content, search, navigate, view history | Create, edit, delete anything. UI shows `Read-only` badge |

### Role-based testing rules

**Every sub-feature MUST include role-based tests when the feature has write actions:**
1. At minimum: test the happy path with `owner` + verify `read-only user` CANNOT perform write actions
2. If the feature has delete/manage operations: also test `QA` (often cannot delete others' content)
3. Format in preconditions: `"User is logged in as read-only user."` — never use code names

**Common role-based scenarios to always consider:**
- Read-only user sees the page but create/edit/delete buttons are hidden or disabled
- QA user can create but cannot delete another user's entity
- Manager can manage team content but not project-level settings
- Switching roles mid-session (login as different user) — permissions update correctly

---

## Key Entities

| Entity | Lives in | Key operations | Notes |
|--------|----------|---------------|-------|
| **Tests** | Tests page, inside suites | CRUD, label, tag, assign, attach files, view history | Can be manual or automated |
| **Suites** | Tests page | CRUD, copy, convert to/from folder, nest | Container for tests |
| **Folders** | Tests page | CRUD, convert to suite | Organizational grouping above suites |
| **Plans** | Plans page | CRUD, select tests, hide/unhide | Define what to run |
| **Runs** | Runs page | Create (manual/auto), launch, finish, relaunch, archive, purge | Execution instances |
| **Run Groups** | Runs page | CRUD, multi-environment | Group related runs |
| **Labels** | Settings → Labels & Fields | CRUD, assign to tests (single + bulk), color | Protected: `test_label` |
| **Tags** | Inline in test titles | Apply, remove, search by | `@smoke`, `@basic`, etc. |
| **Steps** | Steps page | Search, reuse in tests | Shared step library |
| **Requirements** | Requirements page | CRUD, link to tests | Traceability |
| **Templates** | Settings → Templates | CRUD, set defaults | Protected defaults exist |
| **Branches** | Branches page | CRUD, switch, merge | Paid plan feature |
| **Projects** | Dashboard | Create, delete, switch | Workspace container |

### Entity relationships (important for cross-feature tests)
- **Labels → Tests**: deleting a label removes it from all tests that had it
- **Plans → Runs**: a run can be created from a plan (inherits test selection)
- **Suites → Tests**: deleting a suite deletes all tests inside
- **Tags → Tests**: tags live in test titles, searchable globally
- **Branches → Everything**: branching creates a parallel version of tests/suites
