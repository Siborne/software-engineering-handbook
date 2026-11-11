import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import {
  gettingStartedSidebar,
  programmingLanguageSidebar,
  backendSystemSidebar,
  softwareEngineeringSidebar,
  aiSidebar,
  projectsSidebar,
  papersSidebar,
  careerSidebar,
} from './sidebar'

export default withMermaid(defineConfig({
  title: 'Software Engineering Handbook',
  description: '从 Java Developer 到 AI Software Engineer 的成长路线',
  lang: 'zh-CN',
  base: '/software-engineering-handbook/',

  head: [
    ['link', { rel: 'icon', href: '/software-engineering-handbook/logo.ico' }],
  ],

  vite: {
    optimizeDeps: {
      include: ['mermaid'],
    },
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: '软件工程手册',

    search: {
      provider: 'local',
    },

    nav: [
      { text: '首页', link: '/' },
      {
        text: '开始',
        link: '/getting-started/',
        activeMatch: '/(getting-started|learning-roadmap|tools)/',
      },
      {
        text: '知识库',
        items: [
          { text: '编程语言', link: '/programming-language/' },
          { text: '后端与系统', link: '/backend/' },
          { text: '软件工程', link: '/software-engineering/' },
          { text: '论文', link: '/papers/' },
        ],
      },
      {
        text: 'AI 工程',
        link: '/ai-engineering/',
        activeMatch: '/ai-(engineering|coding)/',
      },
      { text: '项目实战', link: '/projects/' },
      { text: '成长', link: '/career/' },
    ],

    sidebar: {
      '/getting-started/': gettingStartedSidebar,
      '/learning-roadmap/': gettingStartedSidebar,
      '/programming-language/': programmingLanguageSidebar,
      '/backend/': backendSystemSidebar,
      '/database/': backendSystemSidebar,
      '/software-engineering/': softwareEngineeringSidebar,
      '/ai-engineering/': aiSidebar,
      '/system-design/': backendSystemSidebar,
      '/projects/': projectsSidebar,
      '/papers/': papersSidebar,
      '/ai-coding/': aiSidebar,
      '/tools/': gettingStartedSidebar,
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
}))
