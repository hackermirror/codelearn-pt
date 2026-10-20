# Website Editing Instructions

## Purpose

This repository contains our public website. The website is deployed using GitHub Actions when changes are pushed to the `master` branch. The primary user is a non-technical content editor.

## Project

Codelearn Portugal is a static, multi-page website in European Portuguese (PT-PT), intended for GitHub Pages. It uses plain HTML, CSS, and JavaScript. There is no package installation or build step; Python 3 is used for local serving and synchronizing shared markup.

## Structure

- Root `*.html` files are the published pages.
- `assets/css/style.css` contains the shared styles and color tokens.
- `assets/js/main.js` contains interactive behavior.
- `assets/img/` contains the site's images.
- `partials/` contains shared head, header, footer, and areas markup.
- `sync.py` copies partials into the root HTML pages.

## Local preview

Run from the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/`. Reuse an existing server when one is already running for this repository.

## Editing

- Keep copy in PT-PT and follow the existing website design, structure, and formatting.
- Preserve brand colors, typography, and visual style unless the requested change explicitly updates them.
- Make changes responsive for desktop and mobile.
- Prefer modifying existing components over creating new ones. Avoid unnecessary dependencies or refactoring.
- Never invent business claims, prices, or testimonials.
- Ask for clarification when requirements are unclear.
- Reuse existing CSS variables and component classes. Scope changes to the requested elements.
- Edit shared markup in `partials/*.html`, then run `python3 sync.py`. Include the resulting root HTML changes with the partial changes.
- Preserve the `<!-- @name -->` / `<!-- /@name -->` synchronization markers, `data-page`, and `data-nav` attributes. The sync script assigns the active navigation link.
- Keep local asset and page links relative so the site works under both a repository subpath and its custom domain.
- After editing CSS or JavaScript, update the edited asset's imports with a numeric `?v=<Unix timestamp>` cache version. Use the same timestamp for that asset across all root pages and partials; preserve other query parameters.
- Preserve accessible labels, keyboard focus, readable text contrast, and responsive layouts.
- Keep `CNAME` and `.nojekyll` intact unless the task explicitly changes hosting.

## Git safety

- The production branch is `master`.
- Never force push or rewrite Git history.
- Never delete branches, tags, or the repository.
- Never change GitHub permissions or settings.
- Never modify `.github/workflows` without explicit administrator approval.
- Never modify Git configuration or hooks. The established SSH origin URL is `git@github.com:hackermirror/codelearn-pt.git`.
- Never use destructive Git commands. For a published rollback, prefer `git revert`.
- Never commit credentials, secrets, or API keys.
- Keep browser snapshots, screenshots, logs, and other temporary verification artifacts out of commits.

## Validation

Before publishing:

1. Inspect all changed files and run `git diff --check`. Check for unrelated changes.
2. Run the project's build command when one is configured. This static site currently has no build command; run `python3 sync.py` when shared partials change.
3. Run available tests and lint checks. No automated test suite or lint command is currently configured; report unavailable checks rather than claiming they passed.
4. Check for broken links and missing assets. Serve the site and verify affected pages and referenced local assets load successfully.
5. Verify the requested changes are complete.
6. Stop and report any unresolved failures before publishing.

For visual changes, inspect the affected component in a browser, including hover/focus and desktop and mobile layouts. For shared partial changes, check multiple pages and active navigation state after synchronization.

The contact form sends to a production endpoint and uses reCAPTCHA. Verify form behavior without submitting real leads unless explicitly requested.

## Publishing

- Do not publish automatically after editing.
- Explain the changes in simple language and show requested visual changes in the local preview.
- Ask the user to confirm publication. An explicit instruction to publish the completed changes counts as confirmation; do not ask again when it has already been given.
- Only after confirmation, create a normal commit. Stage only task-related files.
- Push to `origin/master` without force.
- Do not discard unrelated local changes.
- If the push fails, stop and explain why.
- Check deployment status when possible. A successful push alone does not confirm that deployment has finished.

## Communication

- Avoid technical jargon.
- Explain what changed and what remains.
- Clearly distinguish saved, committed, pushed, and successfully deployed changes.
