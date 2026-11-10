import type { DefaultTheme } from 'vitepress'

export const programmingLanguageSidebar: DefaultTheme.SidebarItem[] = [
  { text: '编程语言', link: '/programming-language/' },
  {
    text: 'Java',
    collapsed: false,
    items: [
      { text: 'Java 学习地图', link: '/programming-language/java/' },
      {
        text: '语言核心',
        collapsed: false,
        items: [
          { text: '语言基础', link: '/programming-language/java/basics' },
          { text: '面向对象', link: '/programming-language/java/oop' },
          { text: '泛型与类型系统', link: '/programming-language/java/generics' },
          { text: '异常与资源管理', link: '/programming-language/java/exceptions' },
        ],
      },
      {
        text: '标准库',
        collapsed: false,
        items: [
          { text: '集合框架', link: '/programming-language/java/collections' },
          { text: '函数式与 Stream', link: '/programming-language/java/functional' },
          { text: 'IO、NIO 与网络', link: '/programming-language/java/io' },
        ],
      },
      {
        text: '运行时与进阶',
        collapsed: false,
        items: [
          { text: '反射、注解与代理', link: '/programming-language/java/reflection' },
          { text: '并发编程', link: '/programming-language/java/concurrency' },
          { text: 'JVM', link: '/programming-language/java/jvm' },
          { text: '现代 Java', link: '/programming-language/java/new-features' },
        ],
      },
      {
        text: '工程落地',
        collapsed: false,
        items: [
          { text: 'Java 工程实践', link: '/programming-language/java/engineering' },
        ],
      },
    ],
  },
]
