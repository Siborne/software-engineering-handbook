import type { DefaultTheme } from 'vitepress'

export const softwareEngineeringSidebar: DefaultTheme.SidebarItem[] = [
  { text: '软件工程', link: '/software-engineering/' },
  {
    text: '质量基础',
    collapsed: false,
    items: [
      { text: '软件质量', link: '/software-engineering/quality' },
      { text: '常识与思考', link: '/software-engineering/programming-wisdom' },
    ],
  },
  {
    text: '代码质量',
    collapsed: false,
    items: [
      { text: '代码规范', link: '/software-engineering/code-quality' },
      { text: '重构', link: '/software-engineering/refactoring' },
      { text: '测试', link: '/software-engineering/testing' },
      { text: 'Code Review', link: '/software-engineering/code-review' },
    ],
  },
  {
    text: '工程与设计',
    collapsed: false,
    items: [
      { text: '工程实践', link: '/software-engineering/engineering-practice' },
      { text: '设计模式', link: '/software-engineering/design-patterns' },
      { text: 'DDD', link: '/software-engineering/ddd' },
      { text: '架构', link: '/software-engineering/architecture' },
    ],
  },
  {
    text: '交付与运行',
    collapsed: false,
    items: [
      { text: 'CI/CD', link: '/software-engineering/ci-cd' },
      { text: '可观测性', link: '/software-engineering/observability' },
    ],
  },
  {
    text: '参考',
    collapsed: false,
    items: [
      { text: '学习资源', link: '/software-engineering/resources' },
    ],
  },
]
