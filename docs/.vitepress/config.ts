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
  base: '/software-engineering-handbook/',

  head: [
    ['link', { rel: 'icon', href: '/software-engineering-handbook/logo.ico' }],
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
