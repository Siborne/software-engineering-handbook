import type { DefaultTheme } from 'vitepress'
import { backendSidebar } from './backend'
import { databaseSidebar } from './database'
import { systemDesignSidebar } from './system-design'

export const backendSystemSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '后端',
    collapsed: false,
    items: backendSidebar,
  },
  {
    text: '数据库',
    collapsed: false,
    items: databaseSidebar,
  },
  {
    text: '系统设计',
    collapsed: false,
    items: systemDesignSidebar,
  },
]
