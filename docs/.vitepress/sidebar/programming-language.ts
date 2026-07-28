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
