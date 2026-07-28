# VitePress 知识库初始化设计文档

**日期**: 2026-07-28
**状态**: 已确认

---

## 目标

为 `software-engineering-handbook` 初始化 VitePress 文档站骨架，后续逐步填充内容。

## 仓库

- **GitHub**: `Siborne/software-engineering-handbook`
- **本地**: `S:/Sto-box/700-project/software-engineering-handbook`
- **当前状态**: 仅有 `README.md` 和 `.git`，干净仓库

## 定位

从 Java Developer 到 AI Software Engineer 的成长路线文档站。

首页 Slogan：**Learn the principles. Build real systems. Think like an engineer.** / **学习原理，构建系统，像工程师一样思考。**

---

## 决策汇总

| 决策 | 选择 |
|---|---|
| 语言策略 | 先中文，目录名用英文预留 i18n 扩展 |
| 内容规模 | 骨架完整——13 个板块全部建好占位 md |
| 主题 | 默认主题 + CSS 微调 + 自定义 Vue 首页组件 |
| 搜索 | VitePress 内置 local search |
| 评论 | Giscus（GitHub Discussions） |
| 配置组织 | 模块化 sidebar，一板块一文件 |

---

## 目录结构

```
software-engineering-handbook/
├── docs/
│   ├── .vitepress/
│   │   ├── config.ts
│   │   ├── sidebar/
│   │   │   ├── index.ts
│   │   │   ├── getting-started.ts
│   │   │   ├── learning-roadmap.ts
│   │   │   ├── programming-language.ts
│   │   │   ├── backend.ts
│   │   │   ├── database.ts
│   │   │   ├── software-engineering.ts
│   │   │   ├── ai-engineering.ts
│   │   │   ├── system-design.ts
│   │   │   ├── projects.ts
│   │   │   ├── papers.ts
│   │   │   ├── ai-coding.ts
│   │   │   ├── tools.ts
│   │   │   └── career.ts
│   │   └── theme/
│   │       ├── index.ts
│   │       └── components/
│   │           └── HomePage.vue
│   ├── public/
│   │   └── logo.svg
│   ├── index.md                         # 首页
│   ├── getting-started/
│   │   ├── index.md
│   │   ├── why-this-handbook.md
│   │   ├── how-to-read.md
│   │   ├── recommended-learning-path.md
│   │   ├── how-to-ask-questions.md
│   │   └── learning-with-ai.md
│   ├── learning-roadmap/
│   │   └── index.md
│   ├── programming-language/
│   │   ├── index.md
│   │   └── java/
│   │       ├── index.md
│   │       ├── collections.md
│   │       ├── concurrency.md
│   │       ├── jvm.md
│   │       └── new-features.md
│   ├── backend/
│   │   ├── index.md
│   │   ├── spring.md
│   │   ├── spring-boot.md
│   │   ├── spring-ai.md
│   │   ├── spring-ai-alibaba.md
│   │   ├── mybatis.md
│   │   ├── netty.md
│   │   └── rpc.md
│   ├── database/
│   │   ├── index.md
│   │   ├── mysql.md
│   │   ├── redis.md
│   │   ├── mongodb.md
│   │   └── elasticsearch.md
│   ├── software-engineering/
│   │   ├── index.md
│   │   ├── design-patterns.md
│   │   ├── ddd.md
│   │   ├── architecture.md
│   │   ├── refactoring.md
│   │   ├── testing.md
│   │   ├── code-review.md
│   │   ├── ci-cd.md
│   │   ├── observability.md
│   │   └── engineering-practice.md
│   ├── ai-engineering/
│   │   ├── index.md
│   │   ├── prompt.md
│   │   ├── context-engineering.md
│   │   ├── memory.md
│   │   ├── mcp.md
│   │   ├── agent.md
│   │   ├── workflow.md
│   │   ├── evaluation.md
│   │   ├── rag.md
│   │   ├── tool-calling.md
│   │   └── ai-coding.md
│   ├── system-design/
│   │   ├── index.md
│   │   ├── cache.md
│   │   ├── message-queue.md
│   │   ├── consistency.md
│   │   ├── rate-limiting.md
│   │   ├── distributed-lock.md
│   │   ├── database-design.md
│   │   ├── auth-system.md
│   │   ├── login-system.md
│   │   ├── if-i-were-github.md
│   │   ├── if-i-were-cursor.md
│   │   └── if-i-were-wechat.md
│   ├── projects/
│   │   ├── index.md
│   │   ├── delper.md
│   │   ├── blog.md
│   │   └── ai-agent.md
│   ├── papers/
│   │   ├── index.md
│   │   ├── mapreduce.md
│   │   ├── bigtable.md
│   │   ├── spanner.md
│   │   ├── transformer.md
│   │   ├── attention.md
│   │   ├── rag-paper.md
│   │   └── mcp-paper.md
│   ├── ai-coding/
│   │   ├── index.md
│   │   ├── cursor.md
│   │   ├── claude-code.md
│   │   ├── codex.md
│   │   ├── gemini-cli.md
│   │   ├── copilot.md
│   │   ├── prompt.md
│   │   ├── context.md
│   │   └── agent-workflow.md
│   ├── tools/
│   │   ├── index.md
│   │   ├── git.md
│   │   ├── docker.md
│   │   ├── github.md
│   │   ├── linux.md
│   │   ├── cloudflare.md
│   │   ├── nginx.md
│   │   ├── vscode.md
│   │   └── cursor.md
│   ├── career/
│   │   ├── index.md
│   │   ├── learning-methods.md
│   │   ├── projects.md
│   │   ├── resume.md
│   │   ├── interview.md
│   │   ├── growth.md
│   │   └── career-planning.md
│   └── template.md
├── package.json
├── .gitignore
├── tsconfig.json
└── README.md
```

---

## 首页设计 (HomePage.vue)

自定义 Vue 布局组件，替代 VitePress 默认首页：

- **Hero 区**：中英双语 Slogan，主按钮（Getting Started / Learning Roadmap）
- **特色栏目卡片**：Why 系列、If I Were、AI x SE、Project Evolution（4 列网格）
- **简化 Roadmap 图**：SVG/CSS 水平流程示意
- **最近更新**：预留列表

首页通过 `index.md` 的 frontmatter `layout: home` 指定使用 HomePage 布局。

## 导航设计

顶部导航 4 个入口 + 下拉菜单：

```
[首页] [开始] [路线图] [知识库 v] [更多 v]
                               ├─ [编程语言]    ├─ [AI Coding]
                               ├─ [后端]        ├─ [工具]
                               ├─ [数据库]      ├─ [职业]
                               ├─ [软件工程]    ├─ [论文]
                               ├─ [AI 工程]
                               ├─ [系统设计]
                               └─ [项目]
```

## 统一文章模板 (template.md)

Frontmatter:
```yaml
---
title: ''
author: 'Siborne'
date: ''
tag: []
---
```

正文结构（占位提示）:
```
为什么需要？ → 解决什么问题？ → 设计思想 → 工作原理
→ 源码分析（可选） → 实际案例 → 企业实践 → 常见误区
→ AI 怎么理解？ → 相关阅读 → 练习
```

## 技术栈

| 项 | 选型 |
|---|---|
| 框架 | VitePress ^1.x |
| 包管理 | pnpm |
| 搜索 | `@vuepress/plugin-search`（内置） |
| 评论 | `@giscus/vue` |
| 部署 | GitHub Pages + GitHub Actions |
| Node | 当前 LTS |

## 文件说明

### .gitignore
```
node_modules/
.vitepress/dist/
.vitepress/cache/
```

### package.json
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

### tsconfig.json
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

## 实施范围

初始化阶段仅搭建骨架：
1. `pnpm init` + 安装 VitePress
2. 创建目录结构和所有占位 `.md` 文件
3. 编写 `config.ts` + 所有 sidebar 模块
4. 编写自定义 `HomePage.vue`
5. 编写 `template.md` 统一文章模板
6. 验证 `pnpm docs:build` 通过
7. 本地 `pnpm docs:dev` 预览确认

## 不做的事

- 不写真实文章内容（只有占位）
- 不配置 GitHub Actions 部署（等首次 push 后再加）
- 不配置 Giscus（需要 GitHub Discussions 先启用——后面再说）
- 不配置自定义域名（后面再说）

## i18n 预留策略

- 所有目录名使用英文（`getting-started/` 而非 `快速开始/`）
- VitePress i18n 目录规范：`en/`、`zh/` 前缀
- 当前不建 `zh/` 前缀，待真正需要多语言时，把现有所有内容移入 `zh/` 子目录即可启用

## 自检

- [x] 无 TBD/TODO 占位
- [x] 13 个板块覆盖方案中列出的所有内容
- [x] 特色栏目（Why/If I Were/Project Evolution）在侧边栏中有对应文章
- [x] 搜索选型明确（local）
- [x] 评论明确延迟到 GitHub Discussions 启用后再配
- [x] 部署（GitHub Actions）不在本期范围
