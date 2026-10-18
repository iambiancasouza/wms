---
name: git-commit
description: Analyzes Git changes and prepares safe commits with English messages.
---

# Git Commit

1. Analyze changes using `git status --short`, `git diff`, and `git diff --cached`.
2. Identify the changes and suggest a concise commit message in English, following Conventional Commits (`feat`, `fix`, `refactor`, `docs`, `test`, or `chore`).
3. List the files to be included and check for secrets, sensitive files, and unrelated changes.
4. Wait for explicit user approval of the message and files before staging or committing.
5. Stage only the approved files, create the commit, and verify the result.

## Safety

- Never use `git add .` automatically.
- Never include secrets or unrelated changes.
- Never push to a remote repository unless explicitly requested.
- Never discard user changes.

## Final Report

Report the commit message, hash, included files, and final Git status. Keep explanations in the user's preferred language, but always write commit messages in English.
