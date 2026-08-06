# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A Chinese-language software engineering handbook built with VitePress. Content spans from Java/backend fundamentals through AI engineering and system design, targeting developers growing from Java Developer to AI Software Engineer.

## Commands

| Command | Description |
|---------|-------------|
| `pnpm docs:dev` | Start VitePress dev server |
| `pnpm docs:build` | Build static site |
| `pnpm docs:preview` | Preview built site locally |

## Architecture

```
docs/
├── .vitepress/
│   ├── config.ts              # Site config: nav, sidebar mapping, search, locale
│   ├── sidebar/               # One file per content section, exports sidebar items
│   │   └── index.ts           # Barrel re-export for all sidebars
│   └── theme/
│       ├── index.ts           # Custom theme: extends DefaultTheme, overrides Layout
│       └── components/
│           └── HomePage.vue   # Home page layout with hero, features grid, roadmap
├── index.md                   # Site root (home layout, frontmatter only)
└── <section>/                  # Each top-level section is a directory with index.md
```

## Content conventions

- Content pages are Markdown (`.md`). Most are currently placeholder/TODO stubs.
- The home page layout is driven by `HomePage.vue`, not by `index.md` content. The hero text, feature cards, and roadmap steps are hardcoded in the Vue component.
- Sidebar configs follow a consistent pattern: each file in `docs/.vitepress/sidebar/` exports a typed `DefaultTheme.SidebarItem[]` array, barrel-exported from `index.ts`, and wired into `config.ts`.
- Page titles and descriptions are set via YAML frontmatter in each `.md` file.

## Superpowers documents

- When using Superpowers, generated documents (plans, specs, etc.) must be written to `dev-docs/`, never to `docs/`.
- `docs/` is reserved for published VitePress site content; `dev-docs/` holds internal development artifacts.

## Adding a new content section

1. Create the directory under `docs/` with an `index.md`
2. Create a sidebar file in `docs/.vitepress/sidebar/`
3. Export it from `docs/.vitepress/sidebar/index.ts`
4. Add the sidebar mapping and nav entry in `docs/.vitepress/config.ts`
