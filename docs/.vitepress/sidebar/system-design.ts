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
