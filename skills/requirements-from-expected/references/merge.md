# Merge items into the current state

Many items describe one feature. The feature page states its **current state**: every item in scope applied, one version per behavior.

## 1. Collect

- The feature YAML links, plus each item's `parent`, `subtasks`, `links` in `.source/`, both ways.
- Later items that change the feature: bugs, follow-ups, pages on the same topic.
- Out of scope items: skip.
- Catalog wrong (item missing, misplaced, features to merge or split) → fix it, report a catalog error.

## 2. Read

Each item whole, comments included. Decisions inside comments. Highlight if decision from comment contradicts the item's current state.

Date: resolution, else last update, else creation.

## 3. Apply

`History: Yes`: oldest first; a later item adds, replaces, or removes behaviors. Replaced ones are superseded, not mismatches. Same date, can't tell which is newer → mismatch.

`History: No`: all current pages count the same. Same point, different values → mismatch.

## 4. Write

- `## Behaviors`: current state only; each behavior links the item that set it.
- `## History` (`History: Yes`): one row per item, oldest first: date, item, what it changed.

## Check

- [ ] Every collected item is in History
- [ ] One behavior per point; each from the newest item that set it
- [ ] Every comment decision applied
- [ ] Ties are mismatches, not picks
