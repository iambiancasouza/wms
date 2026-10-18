---
name: test-check
description: Runs pre-deploy checks (types, lint, build, Git and environment consistency) on the current changes and reports anything that could block a Vercel deploy.
---

# Test Check

Use this before committing or deploying to confirm the current changes will not break the production build.

1. Analyze changes using `git status --short`, `git diff --stat`, and `git diff --cached --stat`. If nothing changed, compare `HEAD` with `origin/main` instead.
2. Run the type check: `npx tsc --noEmit`.
3. Run the linter on changed and untracked `.ts`/`.tsx` files: `npx eslint <files>`. Skip deleted files.
4. Run the production build: `npm run build`. This mirrors what Vercel executes.
5. If a `test` script exists in `package.json`, run it as well.
6. Run the deploy consistency checks:
   - **Untracked imports:** for each untracked file (`??`), search for imports of it in tracked or changed files. If one exists, the file must be committed or the deploy will fail with "module not found".
   - **Lockfile sync:** if `package.json` dependencies changed, `bun.lock` must also be changed and committed together with it.
   - **Missing dependencies:** every new package import in the diff must be listed in `package.json`, not just present in `node_modules`.
   - **Environment variables:** list `process.env.*` names used in `src`. Flag any name added in the diff, since it must also be configured in Vercel. Never print the values from `.env.local`.

## Safety

- Do not modify, stage, or commit files. This skill only checks and reports.
- Do not run `npm audit fix`, dependency upgrades, or any other command that changes files, unless the user explicitly asks.
- Never print secrets or the contents of `.env*` files.

## Final Report

Report in the user's preferred language with:

- A table with each check and its result (pass, fail, or skipped).
- **Blocking issues:** errors that would fail the deploy, with `file:line` and a suggested fix.
- **Warnings:** non-blocking issues, such as outdated browser data or lint warnings.
- **Not covered:** the project has no automated UI or behavior tests, so remind the user that changed screens and flows should be tested manually in the browser.
