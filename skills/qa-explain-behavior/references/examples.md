# Worked examples

> The product below is **invented** — a generic workspace app with members,
> documents and file imports. These examples show the shape and register of a
> good answer, not real behaviour. Always answer from what you actually find in
> the codebase in front of you.

## Example 1 — feature description

**Q: "What happens when a user is invited to a workspace?"**

```
**What it does:** sends an invitation so someone can join a workspace with a chosen role.
**Who can do it:** workspace owner and admins.
**How to trigger:** Workspace Settings → Members → "Invite" → enter email + pick role.
**What happens:**
- Invitation email is sent to that address.
- Pending invite shows in the members list.
- If the email matches an existing user, they accept by clicking the link and the workspace appears in their sidebar.
- If not, they're prompted to register first; after register they land on the workspace.
**Rules:**
- Email must be valid.
- Same email can't have two pending invites for the same workspace.
- Role must be one of: owner, admin, member, guest.
**Edge cases:**
- Invite link expires after 7 days.
- If the invited user is already a member, the invite is rejected with a message.
- Re-sending an invite resets the expiry.
**Not implemented:** bulk invite via CSV is not available in the UI.
```

Why it works: every line is something a tester can act on. The last line is the
most valuable one in the answer.

## Example 2 — permission question

**Q: "Can a guest delete a document?"**

```
No. Guests can view documents but cannot edit, create, or delete them. The
delete button is hidden for guests, and the action is also blocked server-side.
```

Two lines, and it answers the follow-up question a tester was about to ask —
whether the block survives a direct API call.

## Example 3 — support question with nuance

**Q: "Is there a way to export a document?"**

```
Yes — partially.
- CSV export is available from the document page (top-right menu).
- PDF export is **not** implemented.
- The raw JSON can be retrieved via API, but there's no UI button for it.
```

"Yes — partially" in the first line, then exactly where the line falls.

## Example 4 — flow walkthrough

**Q: "Walk me through importing records from a file."**

```
1. Workspace → Data → "Import" → pick a file (CSV or XLSX).
2. A preview shows the first rows with a column-mapping step — you map each
   column to a field (name, owner, category, tags).
3. Confirm. The import runs in the background; the page shows a progress state.
4. When it finishes you get an in-app notification with a summary: created,
   updated, skipped.

**Branches:**
- If a row has no name, it's skipped and counted in "skipped".
- If a record with the same name already exists in that category, it's updated
  rather than duplicated.
- If the whole file can't be parsed, nothing is imported and you get an error
  on the same screen.

**Rules / limits:**
- File must be under 10 MB.
- Only CSV and XLSX; other extensions are rejected before upload.

**Edge cases:**
- An empty file imports nothing and reports "0 created".
- Closing the tab doesn't cancel the import — it keeps running.

**Not implemented:** there's no way to undo or roll back an import.
```

## Example 5 — edge-case sweep

**Q: "What should I test around document deletion?"**

```
**Permissions:** owner and admin can delete; member and guest cannot (hidden and blocked server-side).
**Empty:** deleting a document with no content works and removes it immediately.
**In use:** a document open in someone else's tab can be deleted — their next save fails with a generic error, which is worth checking.
**Linked data:** attached files are removed in the background, so they can outlive the document by a few seconds.
**Concurrent:** two admins deleting the same document at once — the second gets a "not found" error rather than a friendly message.
**Undo:** there is none, and there's no confirmation step on the API — only in the UI.
```

## Contrast — the same question answered badly

**Q: "What happens when an import finishes?"**

❌ **Bad — implementation leaking through:**

```
When the import completes, the imports controller calls the finalizer service,
which updates the status column on the imports table to "finished" via a
persistence callback. A post-commit hook enqueues the notification job on the
background queue, which reads the workspace notification settings and delivers
through the import mailer.
```

✅ **Good — same facts, tester's language:**

```
**What happens:**
- The import's status changes to "Finished" and the page updates with the final created/updated/skipped counts.
- Everyone subscribed to the workspace gets an email summary — sent in the background, so it can arrive a few seconds late.
- The import appears in the workspace's history.
**Edge cases:**
- An import with no valid rows still finishes, showing 0 created.
- If notifications are turned off for the workspace, no email is sent — the import still finishes normally.
```

The bad version is not wrong, it's unusable: nothing in it can be clicked,
observed, or verified from the UI.

## Contrast — padding vs. answering

**Q: "Can I rename a workspace?"**

❌ **Bad:**

```
Great question! Let me walk you through workspace renaming. Workspaces in the
system have a name attribute which can be modified. Here's what I found:
**What it does:** allows renaming a workspace.
**Who can do it:** users with permission.
**Rules / limits:** N/A
**Edge cases:** N/A
```

✅ **Good:**

```
Yes. Workspace Settings → General → change the name → Save.
Only the workspace owner can do it; admins see the field disabled.
The name must be unique inside the account, 3–60 characters.
The workspace URL doesn't change when you rename — it keeps the original slug.
```

No preamble, no empty sections, and it ends on the detail a tester would
otherwise discover the hard way.
