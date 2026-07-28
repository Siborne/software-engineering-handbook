# VitePress Documentation Site Initialization Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize a VitePress documentation site skeleton for the software-engineering-handbook with 13 content sections, custom homepage, modular sidebar config, local search, and i18n-ready directory structure.

**Architecture:** VitePress ^1.x with Vue 3. Custom HomePage layout component overrides default theme home. Sidebar configs are modular (one `.ts` per content section). All content directories use English names to allow future i18n via `zh/` prefix. Package manager is pnpm.

**Tech Stack:** VitePress ^1.x, Vue ^3.x, pnpm, TypeScript config only (no framework code), Node.js v22 LTS

## Global Constraints

- All directory names in English for i18n readiness
- No real article content — placeholder `TODO` text only
- No GitHub Actions deployment config
- No Giscus comment integration
- No custom domain setup
- Use local search (`search: { provider: 'local' }`)
- Custom `HomePage.vue` layout for the home page
- Modular sidebar configs under `docs/.vitepress/sidebar/`
- Environment: `export COREPACK_ENABLE_STRICT=0` required for pnpm on this system

## File Structure

| File | Responsibility |
|---|---|
| `package.json` | Project metadata, scripts (`docs:dev`, `docs:build`, `docs:preview`) |
| `.gitignore` | Ignore `node_modules/`, `.vitepress/dist/`, `.vitepress/cache/` |
| `tsconfig.json` | TypeScript config scoped to `.vitepress/**/*` |
| `docs/.vitepress/config.ts` | Main VitePress config: nav, sidebar aggregation, search, theme |
| `docs/.vitepress/sidebar/index.ts` | Barrel export re-exporting all sidebar arrays |
| `docs/.vitepress/sidebar/<section>.ts` | One sidebar config array per section (13 files) |
| `docs/.vitepress/theme/index.ts` | Theme entry: override home layout with custom component |
| `docs/.vitepress/theme/components/HomePage.vue` | Custom home layout: Hero + feature cards + roadmap + updates |
| `docs/index.md` | Home page entry with `layout: home` frontmatter |
| `docs/<section>/index.md` | Section landing pages (13 files) |
| `docs/<section>/<page>.md` | Individual content pages (~80 files, all TODO placeholders) |
| `docs/template.md` | Article template with frontmatter and section structure |
| `docs/public/logo.svg` | Site logo placeholder |

---

### Task 1: Project setup files

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `tsconfig.json`

**Interfaces:**
- Produces: `package.json` with `name: "software-engineering-handbook"`, `scripts: { docs:dev, docs:build, docs:preview }`, `devDependencies: { vitepress: "^1.0.0", vue: "^3.0.0" }`
- Produces: `.gitignore` ignoring `node_modules/`, `.vitepress/dist/`, `.vitepress/cache/`
- Produces: `tsconfig.json` with `module: "esnext"`, `moduleResolution: "bundler"`, `include: ["docs/.vitepress/**/*"]`

- [ ] **Step 1: Write package.json**

```json
{
  "name": "software-engineering-handbook",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  },
  "devDependencies": {
    "vitepress": "^1.0.0",
    "vue": "^3.0.0"
  }
}
```

- [ ] **Step 2: Write .gitignore**

```
node_modules/
.vitepress/dist/
.vitepress/cache/
```

- [ ] **Step 3: Write tsconfig.json**

```json
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "bundler",
    "target": "esnext",
    "strict": true,
    "jsx": "preserve"
  },
  "include": ["docs/.vitepress/**/*"]
}
```

- [ ] **Step 4: Commit**

```bash
git add package.json .gitignore tsconfig.json
git commit -m "chore: add project config files for VitePress"
```

---

### Task 2: Install dependencies

**Files:**
- Modify: `package.json` (pnpm-lock.yaml generated)
- Create: `pnpm-lock.yaml` (auto-generated)

**Interfaces:**
- Consumes: `package.json` from Task 1
- Produces: `node_modules/` with vitepress and vue installed

- [ ] **Step 1: Install with pnpm**

```bash
cd S:/Sto-box/700-project/software-engineering-handbook/.claude/worktrees/vitepress-init
export COREPACK_ENABLE_STRICT=0
pnpm install
```

Expected: installs vitepress + vue, generates `pnpm-lock.yaml`.

- [ ] **Step 2: Verify install**

```bash
npx vitepress --version
```

Expected: prints VitePress version (1.x).

- [ ] **Step 3: Commit**

```bash
git add pnpm-lock.yaml
git commit -m "chore: install vitepress and vue dependencies"
```

---

### Task 3: Create logo placeholder

**Files:**
- Create: `docs/public/logo.svg`

**Interfaces:**
- Produces: `docs/public/logo.svg` — a simple SVG placeholder logo

- [ ] **Step 1: Write logo.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="12" fill="#3451b2"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
        font-family="system-ui,sans-serif" font-size="28" font-weight="700" fill="white">SE</text>
</svg>
```

- [ ] **Step 2: Commit**

```bash
git add docs/public/logo.svg
git commit -m "feat: add placeholder logo SVG"
```

---

### Task 4: Theme entry and custom HomePage component

**Files:**
- Create: `docs/.vitepress/theme/index.ts`
- Create: `docs/.vitepress/theme/components/HomePage.vue`

**Interfaces:**
- Consumes: VitePress default theme
- Produces: `docs/.vitepress/theme/index.ts` registering `HomePage` as custom layout
- Produces: `docs/.vitepress/theme/components/HomePage.vue` with Hero + feature cards + roadmap diagram + recent updates placeholder

- [ ] **Step 1: Write theme entry `docs/.vitepress/theme/index.ts`**

```typescript
import DefaultTheme from 'vitepress/theme'
import HomePage from './components/HomePage.vue'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  Layout: HomePage,
} satisfies Theme
```

- [ ] **Step 2: Write HomePage component `docs/.vitepress/theme/components/HomePage.vue`**

```vue
<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme

const features = [
  { title: 'Why 系列', desc: '深入理解技术决策背后的原因', link: '/getting-started/why-this-handbook' },
  { title: 'If I Were', desc: '「如果让我重新设计」系列思考', link: '/system-design/if-i-were-github' },
  { title: 'AI × SE', desc: 'AI 工程与软件工程的交叉实践', link: '/ai-engineering/' },
  { title: 'Project Evolution', desc: '项目从 Day 1 到 Day N 的真实演进', link: '/projects/' },
]

const roadmapSteps = [
  'Beginner', 'Java', 'Spring', 'Database', 'Redis',
  'Linux', 'Docker', 'MQ', 'Architecture', 'AI', 'Agent'
]
</script>

<template>
  <Layout>
    <template #home-hero-info>
      <div class="home-hero">
        <h1 class="hero-title">
          <span class="hero-title-main">Software Engineering Handbook</span>
          <span class="hero-title-sub">软件工程手册</span>
        </h1>
        <p class="hero-tagline">
          Learn the principles. Build real systems. Think like an engineer.
        </p>
        <p class="hero-tagline-cn">
          学习原理，构建系统，像工程师一样思考。
        </p>
        <div class="hero-actions">
          <a class="vp-button brand" href="/getting-started/">Getting Started</a>
          <a class="vp-button alt" href="/learning-roadmap/">Learning Roadmap</a>
        </div>
      </div>
    </template>

    <template #home-hero-image>
      <div class="hero-features">
        <div v-for="f in features" :key="f.title" class="feature-card">
          <a :href="f.link">
            <h3>{{ f.title }}</h3>
            <p>{{ f.desc }}</p>
          </a>
        </div>
      </div>
    </template>

    <template #home-features-after>
      <div class="roadmap-section">
        <h2>Learning Roadmap</h2>
        <div class="roadmap-steps">
          <span v-for="(step, i) in roadmapSteps" :key="step" class="roadmap-step">
            {{ step }}
            <span v-if="i < roadmapSteps.length - 1" class="roadmap-arrow">→</span>
          </span>
        </div>
      </div>
      <div class="recent-updates">
        <h2>最近更新</h2>
        <p class="placeholder">内容正在建设中，敬请期待...</p>
      </div>
    </template>
  </Layout>
</template>

<style scoped>
.home-hero {
  text-align: center;
  padding: 48px 24px 24px;
}
.hero-title-main {
  display: block;
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--vp-c-brand-1);
}
.hero-title-sub {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-top: 8px;
}
.hero-tagline {
  font-size: 1.2rem;
  color: var(--vp-c-text-2);
  margin-top: 16px;
}
.hero-tagline-cn {
  font-size: 1rem;
  color: var(--vp-c-text-3);
  margin-top: 4px;
}
.hero-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  justify-content: center;
}
.hero-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  max-width: 640px;
  margin: 0 auto;
  padding: 0 24px;
}
.feature-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 20px;
  transition: border-color 0.3s;
}
.feature-card:hover {
  border-color: var(--vp-c-brand-1);
}
.feature-card h3 {
  font-size: 1.1rem;
  margin-bottom: 4px;
}
.feature-card p {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}
.roadmap-section {
  text-align: center;
  padding: 48px 24px;
}
.roadmap-section h2 {
  margin-bottom: 20px;
}
.roadmap-steps {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
}
.roadmap-step {
  font-weight: 500;
}
.roadmap-arrow {
  margin: 0 6px;
  color: var(--vp-c-brand-1);
}
.recent-updates {
  text-align: center;
  padding: 24px 24px 48px;
}
.recent-updates h2 {
  margin-bottom: 12px;
}
.placeholder {
  color: var(--vp-c-text-3);
  font-style: italic;
}

@media (max-width: 640px) {
  .hero-features {
    grid-template-columns: 1fr;
  }
  .hero-title-main {
    font-size: 1.8rem;
  }
}
</style>
```

- [ ] **Step 3: Verify HomePage imports resolve**

```bash
npx vue-tsc --noEmit docs/.vitepress/theme/index.ts 2>&1 || true
```

Note: some TS errors from VitePress internals are expected at this stage; the component should load fine at runtime.

- [ ] **Step 4: Commit**

```bash
git add docs/.vitepress/theme/
git commit -m "feat: add custom HomePage layout component"
```

---

### Task 5: Sidebar config modules

**Files:**
- Create: `docs/.vitepress/sidebar/getting-started.ts`
- Create: `docs/.vitepress/sidebar/learning-roadmap.ts`
- Create: `docs/.vitepress/sidebar/programming-language.ts`
- Create: `docs/.vitepress/sidebar/backend.ts`
- Create: `docs/.vitepress/sidebar/database.ts`
- Create: `docs/.vitepress/sidebar/software-engineering.ts`
- Create: `docs/.vitepress/sidebar/ai-engineering.ts`
- Create: `docs/.vitepress/sidebar/system-design.ts`
- Create: `docs/.vitepress/sidebar/projects.ts`
- Create: `docs/.vitepress/sidebar/papers.ts`
- Create: `docs/.vitepress/sidebar/ai-coding.ts`
- Create: `docs/.vitepress/sidebar/tools.ts`
- Create: `docs/.vitepress/sidebar/career.ts`
- Create: `docs/.vitepress/sidebar/index.ts`

**Interfaces:**
- Produces: Each `<section>.ts` exports a `DefaultTheme.SidebarItem[]` array named `<camelName>Sidebar`
- Produces: `index.ts` re-exports all sidebar arrays as a single `sidebars` record keyed by section path prefix

- [ ] **Step 1: Write getting-started sidebar — `docs/.vitepress/sidebar/getting-started.ts`**

```typescript
import type { DefaultTheme } from 'vitepress'

export const gettingStartedSidebar: DefaultTheme.SidebarItem[] = [
  { text: 'Getting Started', link: '/getting-started/' },
  { text: '为什么建立这个知识库', link: '/getting-started/why-this-handbook' },
  { text: '如何阅读', link: '/getting-started/how-to-read' },
  { text: '推荐学习路线', link: '/getting-started/recommended-learning-path' },
  { text: '如何提问', link: '/getting-started/how-to-ask-questions' },
  { text: '如何利用 AI 学习', link: '/getting-started/learning-with-ai' },
]
```

- [ ] **Step 2: Write learning-roadmap sidebar — `docs/.vitepress/sidebar/learning-roadmap.ts`**

```typescript
import type { DefaultTheme } from 'vitepress'

export const learningRoadmapSidebar: DefaultTheme.SidebarItem[] = [
  { text: 'Learning Roadmap', link: '/learning-roadmap/' },
]
```

- [ ] **Step 3: Write programming-language sidebar — `docs/.vitepress/sidebar/programming-language.ts`**

```typescript
import type { DefaultTheme } from 'vitepress'

export const programmingLanguageSidebar: DefaultTheme.SidebarItem[] = [
  { text: '编程语言', link: '/programming-language/' },
  {
    text: 'Java',
    collapsed: false,
    items: [
      { text: 'Java 概述', link: '/programming-language/java/' },
      { text: 'Java 集合', link: '/programming-language/java/collections' },
      { text: 'Java 并发', link: '/programming-language/java/concurrency' },
      { text: 'JVM', link: '/programming-language/java/jvm' },
      { text: 'Java 新特性', link: '/programming-language/java/new-features' },
    ],
  },
]
```

- [ ] **Step 4: Write backend sidebar — `docs/.vitepress/sidebar/backend.ts`**

```typescript
import type { DefaultTheme } from 'vitepress'

export const backendSidebar: DefaultTheme.SidebarItem[] = [
  { text: '后端开发', link: '/backend/' },
  { text: 'Spring', link: '/backend/spring' },
  { text: 'Spring Boot', link: '/backend/spring-boot' },
  { text: 'Spring AI', link: '/backend/spring-ai' },
  { text: 'Spring AI Alibaba', link: '/backend/spring-ai-alibaba' },
  { text: 'MyBatis', link: '/backend/mybatis' },
  { text: 'Netty', link: '/backend/netty' },
  { text: 'RPC', link: '/backend/rpc' },
]
```

- [ ] **Step 5: Write database sidebar — `docs/.vitepress/sidebar/database.ts`**

```typescript
import type { DefaultTheme } from 'vitepress'

export const databaseSidebar: DefaultTheme.SidebarItem[] = [
  { text: '数据库', link: '/database/' },
  { text: 'MySQL', link: '/database/mysql' },
  { text: 'Redis', link: '/database/redis' },
  { text: 'MongoDB', link: '/database/mongodb' },
  { text: 'ElasticSearch', link: '/database/elasticsearch' },
]
```

- [ ] **Step 6: Write software-engineering sidebar — `docs/.vitepress/sidebar/software-engineering.ts`**

```typescript
import type { DefaultTheme } from 'vitepress'

export const softwareEngineeringSidebar: DefaultTheme.SidebarItem[] = [
  { text: '软件工程', link: '/software-engineering/' },
  { text: '设计模式', link: '/software-engineering/design-patterns' },
  { text: 'DDD', link: '/software-engineering/ddd' },
  { text: '架构', link: '/software-engineering/architecture' },
  { text: '重构', link: '/software-engineering/refactoring' },
  { text: '测试', link: '/software-engineering/testing' },
  { text: 'Code Review', link: '/software-engineering/code-review' },
  { text: 'CI/CD', link: '/software-engineering/ci-cd' },
  { text: '可观测性', link: '/software-engineering/observability' },
  { text: '工程实践', link: '/software-engineering/engineering-practice' },
]
```

- [ ] **Step 7: Write ai-engineering sidebar — `docs/.vitepress/sidebar/ai-engineering.ts`**

```typescript
import type { DefaultTheme } from 'vitepress'

export const aiEngineeringSidebar: DefaultTheme.SidebarItem[] = [
  { text: 'AI 工程', link: '/ai-engineering/' },
  { text: 'Prompt', link: '/ai-engineering/prompt' },
  { text: 'Context Engineering', link: '/ai-engineering/context-engineering' },
  { text: 'Memory', link: '/ai-engineering/memory' },
  { text: 'MCP', link: '/ai-engineering/mcp' },
  { text: 'Agent', link: '/ai-engineering/agent' },
  { text: 'Workflow', link: '/ai-engineering/workflow' },
  { text: 'Evaluation', link: '/ai-engineering/evaluation' },
  { text: 'RAG', link: '/ai-engineering/rag' },
  { text: 'Tool Calling', link: '/ai-engineering/tool-calling' },
  { text: 'AI Coding', link: '/ai-engineering/ai-coding' },
]
```

- [ ] **Step 8: Write system-design sidebar — `docs/.vitepress/sidebar/system-design.ts`**

```typescript
import type { DefaultTheme } from 'vitepress'

export const systemDesignSidebar: DefaultTheme.SidebarItem[] = [
  { text: '系统设计', link: '/system-design/' },
  { text: '缓存', link: '/system-design/cache' },
  { text: '消息队列', link: '/system-design/message-queue' },
  { text: '一致性', link: '/system-design/consistency' },
  { text: '限流', link: '/system-design/rate-limiting' },
  { text: '分布式锁', link: '/system-design/distributed-lock' },
  { text: '数据库设计', link: '/system-design/database-design' },
  { text: '权限系统', link: '/system-design/auth-system' },
  { text: '登录系统', link: '/system-design/login-system' },
  { text: '如果让我设计 GitHub', link: '/system-design/if-i-were-github' },
  { text: '如果让我设计 Cursor', link: '/system-design/if-i-were-cursor' },
  { text: '如果让我设计微信', link: '/system-design/if-i-were-wechat' },
]
```

- [ ] **Step 9: Write projects sidebar — `docs/.vitepress/sidebar/projects.ts`**

```typescript
import type { DefaultTheme } from 'vitepress'

export const projectsSidebar: DefaultTheme.SidebarItem[] = [
  { text: '项目深度解析', link: '/projects/' },
  { text: 'Delper', link: '/projects/delper' },
  { text: '博客', link: '/projects/blog' },
  { text: 'AI Agent', link: '/projects/ai-agent' },
]
```

- [ ] **Step 10: Write papers sidebar — `docs/.vitepress/sidebar/papers.ts`**

```typescript
import type { DefaultTheme } from 'vitepress'

export const papersSidebar: DefaultTheme.SidebarItem[] = [
  { text: '论文阅读', link: '/papers/' },
  { text: 'MapReduce', link: '/papers/mapreduce' },
  { text: 'BigTable', link: '/papers/bigtable' },
  { text: 'Spanner', link: '/papers/spanner' },
  { text: 'Transformer', link: '/papers/transformer' },
  { text: 'Attention', link: '/papers/attention' },
  { text: 'RAG', link: '/papers/rag-paper' },
  { text: 'MCP', link: '/papers/mcp-paper' },
]
```

- [ ] **Step 11: Write ai-coding sidebar — `docs/.vitepress/sidebar/ai-coding.ts`**

```typescript
import type { DefaultTheme } from 'vitepress'

export const aiCodingSidebar: DefaultTheme.SidebarItem[] = [
  { text: 'AI Coding', link: '/ai-coding/' },
  { text: 'Cursor', link: '/ai-coding/cursor' },
  { text: 'Claude Code', link: '/ai-coding/claude-code' },
  { text: 'Codex', link: '/ai-coding/codex' },
  { text: 'Gemini CLI', link: '/ai-coding/gemini-cli' },
  { text: 'Copilot', link: '/ai-coding/copilot' },
  { text: 'Prompt', link: '/ai-coding/prompt' },
  { text: 'Context', link: '/ai-coding/context' },
  { text: 'Agent Workflow', link: '/ai-coding/agent-workflow' },
]
```

- [ ] **Step 12: Write tools sidebar — `docs/.vitepress/sidebar/tools.ts`**

```typescript
import type { DefaultTheme } from 'vitepress'

export const toolsSidebar: DefaultTheme.SidebarItem[] = [
  { text: '工具', link: '/tools/' },
  { text: 'Git', link: '/tools/git' },
  { text: 'Docker', link: '/tools/docker' },
  { text: 'GitHub', link: '/tools/github' },
  { text: 'Linux', link: '/tools/linux' },
  { text: 'Cloudflare', link: '/tools/cloudflare' },
  { text: 'Nginx', link: '/tools/nginx' },
  { text: 'VSCode', link: '/tools/vscode' },
  { text: 'Cursor', link: '/tools/cursor' },
]
```

- [ ] **Step 13: Write career sidebar — `docs/.vitepress/sidebar/career.ts`**

```typescript
import type { DefaultTheme } from 'vitepress'

export const careerSidebar: DefaultTheme.SidebarItem[] = [
  { text: '职业成长', link: '/career/' },
  { text: '学习方法', link: '/career/learning-methods' },
  { text: '项目经验', link: '/career/projects' },
  { text: '简历', link: '/career/resume' },
  { text: '面试', link: '/career/interview' },
  { text: '技术成长', link: '/career/growth' },
  { text: '职业规划', link: '/career/career-planning' },
]
```

- [ ] **Step 14: Write barrel export — `docs/.vitepress/sidebar/index.ts`**

```typescript
export { gettingStartedSidebar } from './getting-started'
export { learningRoadmapSidebar } from './learning-roadmap'
export { programmingLanguageSidebar } from './programming-language'
export { backendSidebar } from './backend'
export { databaseSidebar } from './database'
export { softwareEngineeringSidebar } from './software-engineering'
export { aiEngineeringSidebar } from './ai-engineering'
export { systemDesignSidebar } from './system-design'
export { projectsSidebar } from './projects'
export { papersSidebar } from './papers'
export { aiCodingSidebar } from './ai-coding'
export { toolsSidebar } from './tools'
export { careerSidebar } from './career'
```

- [ ] **Step 15: Commit**

```bash
git add docs/.vitepress/sidebar/
git commit -m "feat: add modular sidebar configs for all 13 sections"
```

---

### Task 6: Main VitePress config

**Files:**
- Create: `docs/.vitepress/config.ts`

**Interfaces:**
- Consumes: All sidebar exports from `docs/.vitepress/sidebar/index.ts`
- Produces: `docs/.vitepress/config.ts` with nav, sidebar, search, and site metadata

- [ ] **Step 1: Write `docs/.vitepress/config.ts`**

```typescript
import { defineConfig } from 'vitepress'
import {
  gettingStartedSidebar,
  learningRoadmapSidebar,
  programmingLanguageSidebar,
  backendSidebar,
  databaseSidebar,
  softwareEngineeringSidebar,
  aiEngineeringSidebar,
  systemDesignSidebar,
  projectsSidebar,
  papersSidebar,
  aiCodingSidebar,
  toolsSidebar,
  careerSidebar,
} from './sidebar'

export default defineConfig({
  title: 'Software Engineering Handbook',
  description: '从 Java Developer 到 AI Software Engineer 的成长路线',
  lang: 'zh-CN',

  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
  ],

  themeConfig: {
    logo: '/logo.svg',

    search: {
      provider: 'local',
    },

    nav: [
      { text: '首页', link: '/' },
      { text: '开始', link: '/getting-started/' },
      { text: '路线图', link: '/learning-roadmap/' },
      {
        text: '知识库',
        items: [
          { text: '编程语言', link: '/programming-language/' },
          { text: '后端', link: '/backend/' },
          { text: '数据库', link: '/database/' },
          { text: '软件工程', link: '/software-engineering/' },
          { text: 'AI 工程', link: '/ai-engineering/' },
          { text: '系统设计', link: '/system-design/' },
          { text: '项目', link: '/projects/' },
        ],
      },
      {
        text: '更多',
        items: [
          { text: 'AI Coding', link: '/ai-coding/' },
          { text: '工具', link: '/tools/' },
          { text: '职业', link: '/career/' },
          { text: '论文', link: '/papers/' },
        ],
      },
    ],

    sidebar: {
      '/getting-started/': gettingStartedSidebar,
      '/learning-roadmap/': learningRoadmapSidebar,
      '/programming-language/': programmingLanguageSidebar,
      '/backend/': backendSidebar,
      '/database/': databaseSidebar,
      '/software-engineering/': softwareEngineeringSidebar,
      '/ai-engineering/': aiEngineeringSidebar,
      '/system-design/': systemDesignSidebar,
      '/projects/': projectsSidebar,
      '/papers/': papersSidebar,
      '/ai-coding/': aiCodingSidebar,
      '/tools/': toolsSidebar,
      '/career/': careerSidebar,
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Siborne/software-engineering-handbook' },
    ],

    footer: {
      message: 'Built with VitePress',
      copyright: `Copyright © 2026 Siborne`,
    },

    outline: {
      level: [2, 3],
    },

    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    lastUpdated: {
      text: '最后更新',
    },
  },
})
```

- [ ] **Step 2: Commit**

```bash
git add docs/.vitepress/config.ts
git commit -m "feat: add main VitePress config with nav, sidebar, and search"
```

---

### Task 7: Content pages — home page entry + template

**Files:**
- Create: `docs/index.md`
- Create: `docs/template.md`

**Interfaces:**
- Consumes: HomePage layout from Task 4
- Produces: `docs/index.md` frontmatter `layout: home` to trigger custom layout
- Produces: `docs/template.md` as article writing template with frontmatter and section structure

- [ ] **Step 1: Write home page entry — `docs/index.md`**

```markdown
---
layout: home
title: Software Engineering Handbook
description: 从 Java Developer 到 AI Software Engineer 的成长路线
---
```

- [ ] **Step 2: Write article template — `docs/template.md`**

```markdown
---
title: ''
author: 'Siborne'
date: ''
tag: []
---

# 文章标题

> 文章摘要

## 为什么需要？

<TODO>

## 解决什么问题？

<TODO>

## 设计思想

<TODO>

## 工作原理

<TODO>

## 源码分析（可选）

<TODO>

## 实际案例

<TODO>

## 企业实践

<TODO>

## 常见误区

<TODO>

## AI 怎么理解？

<TODO>

## 相关阅读

<TODO>

## 练习

<TODO>
```

- [ ] **Step 3: Commit**

```bash
git add docs/index.md docs/template.md
git commit -m "feat: add home page entry and article template"
```

---

### Task 8: Content pages — all section index pages and article placeholders

**Files:**
- Create: `docs/getting-started/index.md`
- Create: `docs/getting-started/why-this-handbook.md`
- Create: `docs/getting-started/how-to-read.md`
- Create: `docs/getting-started/recommended-learning-path.md`
- Create: `docs/getting-started/how-to-ask-questions.md`
- Create: `docs/getting-started/learning-with-ai.md`
- Create: `docs/learning-roadmap/index.md`
- Create: `docs/programming-language/index.md`
- Create: `docs/programming-language/java/index.md`
- Create: `docs/programming-language/java/collections.md`
- Create: `docs/programming-language/java/concurrency.md`
- Create: `docs/programming-language/java/jvm.md`
- Create: `docs/programming-language/java/new-features.md`
- Create: `docs/backend/index.md`
- Create: `docs/backend/spring.md`
- Create: `docs/backend/spring-boot.md`
- Create: `docs/backend/spring-ai.md`
- Create: `docs/backend/spring-ai-alibaba.md`
- Create: `docs/backend/mybatis.md`
- Create: `docs/backend/netty.md`
- Create: `docs/backend/rpc.md`
- Create: `docs/database/index.md`
- Create: `docs/database/mysql.md`
- Create: `docs/database/redis.md`
- Create: `docs/database/mongodb.md`
- Create: `docs/database/elasticsearch.md`
- Create: `docs/software-engineering/index.md`
- Create: `docs/software-engineering/design-patterns.md`
- Create: `docs/software-engineering/ddd.md`
- Create: `docs/software-engineering/architecture.md`
- Create: `docs/software-engineering/refactoring.md`
- Create: `docs/software-engineering/testing.md`
- Create: `docs/software-engineering/code-review.md`
- Create: `docs/software-engineering/ci-cd.md`
- Create: `docs/software-engineering/observability.md`
- Create: `docs/software-engineering/engineering-practice.md`
- Create: `docs/ai-engineering/index.md`
- Create: `docs/ai-engineering/prompt.md`
- Create: `docs/ai-engineering/context-engineering.md`
- Create: `docs/ai-engineering/memory.md`
- Create: `docs/ai-engineering/mcp.md`
- Create: `docs/ai-engineering/agent.md`
- Create: `docs/ai-engineering/workflow.md`
- Create: `docs/ai-engineering/evaluation.md`
- Create: `docs/ai-engineering/rag.md`
- Create: `docs/ai-engineering/tool-calling.md`
- Create: `docs/ai-engineering/ai-coding.md`
- Create: `docs/system-design/index.md`
- Create: `docs/system-design/cache.md`
- Create: `docs/system-design/message-queue.md`
- Create: `docs/system-design/consistency.md`
- Create: `docs/system-design/rate-limiting.md`
- Create: `docs/system-design/distributed-lock.md`
- Create: `docs/system-design/database-design.md`
- Create: `docs/system-design/auth-system.md`
- Create: `docs/system-design/login-system.md`
- Create: `docs/system-design/if-i-were-github.md`
- Create: `docs/system-design/if-i-were-cursor.md`
- Create: `docs/system-design/if-i-were-wechat.md`
- Create: `docs/projects/index.md`
- Create: `docs/projects/delper.md`
- Create: `docs/projects/blog.md`
- Create: `docs/projects/ai-agent.md`
- Create: `docs/papers/index.md`
- Create: `docs/papers/mapreduce.md`
- Create: `docs/papers/bigtable.md`
- Create: `docs/papers/spanner.md`
- Create: `docs/papers/transformer.md`
- Create: `docs/papers/attention.md`
- Create: `docs/papers/rag-paper.md`
- Create: `docs/papers/mcp-paper.md`
- Create: `docs/ai-coding/index.md`
- Create: `docs/ai-coding/cursor.md`
- Create: `docs/ai-coding/claude-code.md`
- Create: `docs/ai-coding/codex.md`
- Create: `docs/ai-coding/gemini-cli.md`
- Create: `docs/ai-coding/copilot.md`
- Create: `docs/ai-coding/prompt.md`
- Create: `docs/ai-coding/context.md`
- Create: `docs/ai-coding/agent-workflow.md`
- Create: `docs/tools/index.md`
- Create: `docs/tools/git.md`
- Create: `docs/tools/docker.md`
- Create: `docs/tools/github.md`
- Create: `docs/tools/linux.md`
- Create: `docs/tools/cloudflare.md`
- Create: `docs/tools/nginx.md`
- Create: `docs/tools/vscode.md`
- Create: `docs/tools/cursor.md`
- Create: `docs/career/index.md`
- Create: `docs/career/learning-methods.md`
- Create: `docs/career/projects.md`
- Create: `docs/career/resume.md`
- Create: `docs/career/interview.md`
- Create: `docs/career/growth.md`
- Create: `docs/career/career-planning.md`

**Interfaces:**
- Consumes: None (leaf content files)
- Produces: 87 `.md` files, each with `TODO` placeholder content and appropriate title frontmatter

- [ ] **Step 1: Create all directories**

```bash
cd S:/Sto-box/700-project/software-engineering-handbook/.claude/worktrees/vitepress-init
mkdir -p docs/getting-started
mkdir -p docs/learning-roadmap
mkdir -p docs/programming-language/java
mkdir -p docs/backend
mkdir -p docs/database
mkdir -p docs/software-engineering
mkdir -p docs/ai-engineering
mkdir -p docs/system-design
mkdir -p docs/projects
mkdir -p docs/papers
mkdir -p docs/ai-coding
mkdir -p docs/tools
mkdir -p docs/career
```

- [ ] **Step 2: Generate all content files with a script**

Run this bash script to generate every `.md` file with a TODO placeholder and appropriate title:

```bash
cd S:/Sto-box/700-project/software-engineering-handbook/.claude/worktrees/vitepress-init

# getting-started
cat > docs/getting-started/index.md << 'MD'
---
title: Getting Started
---
# Getting Started

<TODO>
MD

cat > docs/getting-started/why-this-handbook.md << 'MD'
---
title: 为什么建立这个知识库
---
# 为什么建立这个知识库

<TODO>
MD

cat > docs/getting-started/how-to-read.md << 'MD'
---
title: 如何阅读
---
# 如何阅读

<TODO>
MD

cat > docs/getting-started/recommended-learning-path.md << 'MD'
---
title: 推荐学习路线
---
# 推荐学习路线

<TODO>
MD

cat > docs/getting-started/how-to-ask-questions.md << 'MD'
---
title: 如何提问
---
# 如何提问

<TODO>
MD

cat > docs/getting-started/learning-with-ai.md << 'MD'
---
title: 如何利用 AI 学习
---
# 如何利用 AI 学习

<TODO>
MD

# learning-roadmap
cat > docs/learning-roadmap/index.md << 'MD'
---
title: Learning Roadmap
---
# Learning Roadmap

<TODO>
MD

# programming-language
cat > docs/programming-language/index.md << 'MD'
---
title: 编程语言
---
# 编程语言

<TODO>
MD

cat > docs/programming-language/java/index.md << 'MD'
---
title: Java
---
# Java

<TODO>
MD

cat > docs/programming-language/java/collections.md << 'MD'
---
title: Java 集合
---
# Java 集合

<TODO>
MD

cat > docs/programming-language/java/concurrency.md << 'MD'
---
title: Java 并发
---
# Java 并发

<TODO>
MD

cat > docs/programming-language/java/jvm.md << 'MD'
---
title: JVM
---
# JVM

<TODO>
MD

cat > docs/programming-language/java/new-features.md << 'MD'
---
title: Java 新特性
---
# Java 新特性

<TODO>
MD

# backend
cat > docs/backend/index.md << 'MD'
---
title: 后端开发
---
# 后端开发

<TODO>
MD

for f in spring spring-boot spring-ai spring-ai-alibaba mybatis netty rpc; do
  cat > "docs/backend/${f}.md" << MD
---
title: ${f}
---
# ${f}

<TODO>
MD
done

# database
cat > docs/database/index.md << 'MD'
---
title: 数据库
---
# 数据库

<TODO>
MD

for f in mysql redis mongodb elasticsearch; do
  cat > "docs/database/${f}.md" << MD
---
title: ${f}
---
# ${f}

<TODO>
MD
done

# software-engineering
cat > docs/software-engineering/index.md << 'MD'
---
title: 软件工程
---
# 软件工程

<TODO>
MD

for f in design-patterns ddd architecture refactoring testing code-review ci-cd observability engineering-practice; do
  cat > "docs/software-engineering/${f}.md" << MD
---
title: ${f}
---
# ${f}

<TODO>
MD
done

# ai-engineering
cat > docs/ai-engineering/index.md << 'MD'
---
title: AI 工程
---
# AI 工程

<TODO>
MD

for f in prompt context-engineering memory mcp agent workflow evaluation rag tool-calling ai-coding; do
  cat > "docs/ai-engineering/${f}.md" << MD
---
title: ${f}
---
# ${f}

<TODO>
MD
done

# system-design
cat > docs/system-design/index.md << 'MD'
---
title: 系统设计
---
# 系统设计

<TODO>
MD

for f in cache message-queue consistency rate-limiting distributed-lock database-design auth-system login-system if-i-were-github if-i-were-cursor if-i-were-wechat; do
  cat > "docs/system-design/${f}.md" << MD
---
title: ${f}
---
# ${f}

<TODO>
MD
done

# projects
cat > docs/projects/index.md << 'MD'
---
title: 项目深度解析
---
# 项目深度解析

<TODO>
MD

for f in delper blog ai-agent; do
  cat > "docs/projects/${f}.md" << MD
---
title: ${f}
---
# ${f}

<TODO>
MD
done

# papers
cat > docs/papers/index.md << 'MD'
---
title: 论文阅读
---
# 论文阅读

<TODO>
MD

for f in mapreduce bigtable spanner transformer attention rag-paper mcp-paper; do
  cat > "docs/papers/${f}.md" << MD
---
title: ${f}
---
# ${f}

<TODO>
MD
done

# ai-coding
cat > docs/ai-coding/index.md << 'MD'
---
title: AI Coding
---
# AI Coding

<TODO>
MD

for f in cursor claude-code codex gemini-cli copilot prompt context agent-workflow; do
  cat > "docs/ai-coding/${f}.md" << MD
---
title: ${f}
---
# ${f}

<TODO>
MD
done

# tools
cat > docs/tools/index.md << 'MD'
---
title: 工具
---
# 工具

<TODO>
MD

for f in git docker github linux cloudflare nginx vscode cursor; do
  cat > "docs/tools/${f}.md" << MD
---
title: ${f}
---
# ${f}

<TODO>
MD
done

# career
cat > docs/career/index.md << 'MD'
---
title: 职业成长
---
# 职业成长

<TODO>
MD

for f in learning-methods projects resume interview growth career-planning; do
  cat > "docs/career/${f}.md" << MD
---
title: ${f}
---
# ${f}

<TODO>
MD
done
```

- [ ] **Step 3: Verify all files were created**

```bash
cd S:/Sto-box/700-project/software-engineering-handbook/.claude/worktrees/vitepress-init
find docs -name '*.md' -not -path 'docs/superpowers/*' | wc -l
```

Expected: 96 content md files (87 from this task + 2 from Task 7 + template.md already committed in this task).

Note: `docs/superpowers/` contains our spec and plan files; excluded from count.

- [ ] **Step 4: Commit**

```bash
git add docs/
git commit -m "feat: add all content pages with TODO placeholders"
```

---

### Task 9: Build verification

**Files:**
- None created; validates all existing files

**Interfaces:**
- Consumes: All files from Tasks 1-8

- [ ] **Step 1: Run build**

```bash
cd S:/Sto-box/700-project/software-engineering-handbook/.claude/worktrees/vitepress-init
export COREPACK_ENABLE_STRICT=0
pnpm docs:build
```

Expected: build succeeds with no errors. May show dead-link warnings for TODO pages — those are expected.

- [ ] **Step 2: Check build output exists**

```bash
ls docs/.vitepress/dist/index.html
```

Expected: file exists.

- [ ] **Step 3: Run dev server briefly to test**

```bash
cd S:/Sto-box/700-project/software-engineering-handbook/.claude/worktrees/vitepress-init
export COREPACK_ENABLE_STRICT=0
npx vitepress dev docs --port 4173 &
sleep 5
curl -s http://localhost:4173 | head -20
kill %1 2>/dev/null
```

Expected: homepage HTML renders with the Slogan text visible.

- [ ] **Step 4: Commit any remaining files**

```bash
git status
```

If `.vitepress/dist/` is shown (should be gitignored), verify `.gitignore` is working. If `.vitepress/cache/` exists, it should also be gitignored.

- [ ] **Step 5: Push branch**

```bash
git push -u origin worktree-vitepress-init
```

- [ ] **Step 6: Create PR**

```bash
gh pr create \
  --title "feat: initialize VitePress documentation site skeleton" \
  --body "$(cat <<'EOF'
## Summary
- Initialize VitePress ^1.x documentation site for software-engineering-handbook
- 13 content sections with full directory structure and TODO placeholders
- Modular sidebar configs (one `.ts` per section)
- Custom Vue HomePage layout component with Hero, feature cards, and roadmap
- Local search enabled
- i18n-ready English directory names

## Test plan
- [ ] `pnpm docs:build` passes without errors
- [ ] `pnpm docs:dev` serves the site locally with custom homepage rendering
- [ ] All 13 sections accessible via nav dropdowns
- [ ] Sidebar appears correctly on each section's pages
EOF
)"
```
