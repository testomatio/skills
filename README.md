# QA Agent Skills (by Testomat.io)

AI agent skills for test management workflows with [Testomat.io](https://testomat.io). These skills bring the power of AI coding agents to your testing process — design tests, automate them, review quality, track coverage, and sync everything with your test management system.

## What Are Skills?

Skills are structured instructions for AI coding agents (Claude Code, Opencode, Cursor, etc.) that teach them how to work with your testing workflow. Unlike simple prompts, skills provide deep knowledge about:

- Testomat.io markdown format for test cases
- Testing best practices and techniques
- How to use `check-tests` CLI for synchronization
- Test design methodologies
- Test automation patterns
- QA process management

## Why Agent Skills vs. Testomat.io UI Prompts?

| Aspect | Testomat.io UI | Agent Skills (Local) |
|--------|----------------|---------------------|
| Where it runs | Browser | Terminal, IDE |
| Access to code | No | Full codebase access |
| Access to files | Limited | Full file system |
| AI Model | Standard | Opus/Sonnet (more powerful) |
| Context | Single test/suite | Entire project + code |
| Integration | GUI-based | Git workflow, CLI |
| Shareability | Via Testomat.io | Git repo, team sharing |

## Contributing

1. Fork the repository
2. Create a new skill directory with a `SKILL.md` file
3. Follow the skill format (see existing skills for reference)
4. Submit a pull request

## License

MIT

## Links

- [Testomat.io](https://testomat.io)
- [Testomat.io Documentation](https://docs.testomat.io)
- [check-tests CLI](https://github.com/testomatio/check-tests)
- [Markdown Import/Export Guide](https://docs.testomat.io/project/import-export/download-tests-as-files/download-manual-tests-as-files/)
