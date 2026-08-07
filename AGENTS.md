# AGENTS.md

Chinese-language software engineering handbook built with VitePress — a growth path from Java Developer to AI Software Engineer.

## Project

- VitePress static site; content is Markdown under `docs/`.
- Package manager: **pnpm** 11.17 (pinned in `packageManager`; never use npm/yarn).
- Entry point: `docs/index.md` (home layout). Site config lives in `docs/.vitepress/config.ts`.

## Commands

- `pnpm docs:dev` — start VitePress dev server
- `pnpm docs:build` — build static site to `docs/.vitepress/dist` (takes ~40–50 s; run in background if a timeout is likely)
- `pnpm docs:preview` — preview the built site
- No test/lint tooling is configured.

## Architecture

- `docs/.vitepress/config.ts` — site config: `title`, `siteTitle` (short nav title 「软件工程手册」), nav, sidebar mapping, local search, zh-CN locale, GitHub Pages `base`.
- `docs/.vitepress/sidebar/*.ts` — one file per content section exporting `DefaultTheme.SidebarItem[]`; barrel-exported from `index.ts`.
- `docs/.vitepress/theme/index.ts` — extends DefaultTheme and replaces `Layout` with `HomePage.vue`.
- `docs/.vitepress/theme/components/HomePage.vue` — landing page built through Layout slots (`#home-hero-info`, `#home-hero-image`, `#home-hero-after`); all home colors reference `--home-*` variables.
- `docs/.vitepress/theme/custom.css` — defines the `--home-*` palette for both `:root` (light) and `.dark`, plus `.VPHome`/`.VPHomeHero` backgrounds and nav tweaks.
- `docs/<section>/` — 13 content sections (getting-started, learning-roadmap, programming-language, backend, database, software-engineering, ai-engineering, system-design, projects, papers, ai-coding, tools, career). Most pages are `<TODO>` stubs.
- `dev-docs/` — internal development artifacts (Superpowers plans/specs); never published to the site.
- `.github/workflows/deploy.yml` — CI: build + deploy to GitHub Pages on push to main.

## Conventions

- Content pages are Markdown with YAML frontmatter (`title`, `description`); article layout follows `docs/template.md`.
- New section flow: create `docs/<section>/` with `index.md` → add a sidebar file → export it from `sidebar/index.ts` → wire sidebar mapping + nav entry in `config.ts`.
- Superpowers-generated documents (plans, specs) go to `dev-docs/`, never `docs/`.
- Home page: `docs/index.md` frontmatter MUST include a `hero:` key (e.g. `hero: { name: ... }`) — without it VPHero (and the `#home-hero-info`/`#home-hero-image` slots) does not render at all.
- Home palette: change colors via the `--home-*` variables in `custom.css` (both `:root` light and `.dark` blocks), not by hardcoding colors in `HomePage.vue`. Site brand color: `#3451b2` (light) / `#646cff` (dark).
- Keep the nav title short — the nav bar shows `themeConfig.siteTitle`; a long title overflows the fixed sidebar-width area and overlaps the search box.
- Commit style: Conventional Commits (`feat:`, `docs:`, `fix:`, `chore:`, `ci:`, `style:`, `redesign:`).

## Notes

- (add later)
