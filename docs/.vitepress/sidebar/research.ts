import type { DefaultTheme } from 'vitepress'
import { papersSidebar } from './papers'

export const researchSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '科研方法',
    collapsed: false,
    items: [
      { text: '科研总览', link: '/research/' },
      { text: '文献检索与精读', link: '/research/literature' },
      { text: '问题、Idea 与实验', link: '/research/idea-and-experiment' },
      { text: '学术汇报与 Meeting', link: '/research/communication' },
    ],
  },
  {
    text: '论文写作',
    collapsed: false,
    items: [
      { text: '从结果到论文', link: '/research/writing' },
      { text: 'Rebuttal', link: '/research/rebuttal' },
    ],
  },
  {
    text: '论文精读',
    collapsed: false,
    items: papersSidebar,
  },
]
