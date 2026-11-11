import type { DefaultTheme } from 'vitepress'
import { aiCodingSidebar } from './ai-coding'
import { aiEngineeringSidebar } from './ai-engineering'

export const aiSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'AI 工程',
    collapsed: false,
    items: aiEngineeringSidebar,
  },
  {
    text: 'AI Coding',
    collapsed: false,
    items: aiCodingSidebar,
  },
]
