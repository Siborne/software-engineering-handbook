import type { DefaultTheme } from 'vitepress'
import { toolItems } from './tools'

export const gettingStartedSidebar: DefaultTheme.SidebarItem[] = [
  { text: '前言', link: '/getting-started/' },
  { text: '学习路线图', link: '/learning-roadmap/' },
  { text: '第一周怎么开始', link: '/getting-started/recommended-learning-path' },
  { text: '如何提问', link: '/getting-started/how-to-ask-questions' },
  { text: '如何利用 AI 学习', link: '/getting-started/learning-with-ai' },
  {
    text: '工具',
    collapsed: false,
    items: toolItems,
  },
]
