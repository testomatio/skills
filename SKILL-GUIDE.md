# Skill Creation Guidelines

Skills are instructions for SOTA AI agents (Claude, Cursor, Copilot).
Write them like a spec, not a tutorial.

Goals: clean, easy for a human to edit and maintain, no longer than actually needed.

## Structure

```
skills/<skill-name>/
├── SKILL.md          # orchestration: workflow, rules, constraints
├── references/       # detail: formats, CLI docs, examples (optional)
└── scripts/          # bundled scripts, only if the agent would otherwise improvise (optional)
```

SKILL.md layout:

```
---
name: kebab-case-name
description: What it does + when to trigger it.
---

# Human Readable Title

One or two sentences on what the skill does.

## Workflow / Rules / Steps (whatever fits)
```

- The frontmatter `description` is the only text used for activation — put all trigger phrases there.
- Do not repeat triggers in the body. "When to Use" sections are redundant.
- One H1. Steps as H2/H3. No "NAME SKILL: What I do" headings.
- Keep detail in `references/*.md`, orchestration in SKILL.md. Link each reference where it is used. State each fact in one place only.

## Style

- Prefer bullet points over prose. Bullets are easier to maintain.
- Short sentences. One idea per line.
- Bold only for constraints the agent must not miss. No formatting for formatting's sake.
- Emoji only inside user-facing output templates.
- No decorative `---` separators — headings already divide sections.

## What to include

- Exact commands, package names, config snippets, env vars, URLs, file formats.
- Product decisions: approval gates, output formats, directory conventions, ordering.
- Non-obvious constraints, e.g. "never generate IDs", "never use python", "max 3 attempts".
- An example only if it shows input/output the steps don't already define.

## What to leave out

Smart models don't need to be taught how to fly. Do not write:

- "ask the user if unclear", "validate inputs", "check files exist"
- generic Error Handling sections (keep only skill-specific recovery facts, e.g. where to get a missing token)
- obvious detection mappings (package.json → JavaScript)
- process narration ("after step X, proceed to step Y")
- communication coaching ("be concise", "show a summary", "use tables")
- examples that re-narrate the workflow
- generic testing/QA wisdom

## Real pitfalls worth stating

- Ask before destructive or hard-to-reverse operations.
- Don't hardcode values that belong in env vars or user input.
- Don't invent CLI options — point to `--help` or the reference doc.
