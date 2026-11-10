---
title: 学习资源
description: 按优先级整理代码质量、重构、测试和跨语言学习资源，并说明每类资源的目的与使用方式。
---

# 学习资源

> 资源是手段，不是目的。读书的目标不是“读完”，而是改变下一次写代码和 review 代码的判断。

这份清单按“是否每天用、是否马上用”排序，而不是按书名或出版时间排序。

## 本章目标

学完本章，你应该能够：

- 按优先级选择下一本书、规范或工具。
- 区分书籍、官方规范、速查表和练习资源。
- 用 30 天计划把学习落到项目里。
- 避免囤书和同时开始多个方向。

## 一、资源优先级

### P0：现在就用

| 资源 | 类型 | 目的 | 怎么用 |
| --- | --- | --- | --- |
| [Google Style Guides](https://google.github.io/styleguide/) | 免费规范 | 建立命名、格式、注释的统一标准 | 先读 Java Style Guide，对照项目格式 |
| 《代码整洁之道》 | 书 | 建立“什么是好代码”的直觉 | 每读一章，改一个旧函数 |
| 《Effective Java》 | 书 | 掌握 Java 高频正确写法 | 重点看泛型、枚举、Optional、异常、资源管理 |
| 《重构：改善既有代码的设计》 | 书 | 学会在不改变行为的前提下改善设计 | 配合[重构技巧](/software-engineering/refactoring)练习 |

### P1：接着用

| 资源 | 类型 | 目的 | 怎么用 |
| --- | --- | --- | --- |
| [Refactoring Catalog](https://refactoring.com/catalog/) | 免费目录 | 按代码异味查具体重构手法 | 重构时当作速查表 |
| [Google Engineering Practices](https://google.github.io/eng-practices/) | 免费规范 | 理解团队 Code Review 和协作方式 | 对照现有 review 流程改进 |
| 《代码大全》 | 书 | 建立软件构建、复杂度和可维护性的系统视角 | 当工具书，按主题查阅，不必通读 |
| [Refactoring.Guru](https://refactoring.guru/) | 免费图解 | 用图示理解重构和设计模式 | 遇到具体问题时查 |
| [SourceMaking](https://sourcemaking.com/refactoring) | 免费目录 | 另一种重构手法索引 | 与 Refactoring Catalog 对照 |

### P2：按需使用

| 资源 | 类型 | 目的 | 什么时候用 |
| --- | --- | --- | --- |
| [Effective TypeScript](https://effectivetypescript.com/) | 书 | 掌握 TypeScript 的类型设计 | 做 AI 工程、前端或 Node 项目时 |
| [Effective Python](https://effectivepython.com/) | 书 | 掌握 Pythonic 写法 | 做 AI 工程、脚本或数据任务时 |
| [100 Go Mistakes](https://100go.co/) | 书/网站 | 避开 Go 的常见工程错误 | 开始写 Go 服务时 |
| [Effective Rust](https://www.lurklurk.org/effective-rust/) | 书 | 理解 Rust 所有权和 API 设计 | 需要写 Rust 或阅读 Rust 代码时 |
| [Effective Kotlin](https://kt.academy/book/effectivekotlin) | 书 | 掌握 Kotlin 惯用法 | 做 Android 或 Kotlin 后端时 |
| [Programming in Lua](https://www.lua.org/pil/) | 免费书 | 学习 Lua 语言和脚本设计 | 需要写 Lua/JASS 类脚本时 |
| [You Don't Know JS Yet](https://github.com/getify/You-Dont-Know-JS) | 免费书 | 补齐 JavaScript 基础 | 需要维护前端或 Node 代码时 |

## 二、免费速查

| 语言 | 资源 | 用途 |
| --- | --- | --- |
| Java | [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html) | 命名、格式、Javadoc |
| Python | [PEP 8](https://peps.python.org/pep-0008/) | Python 风格规范 |
| TypeScript | [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) | TypeScript 风格 |
| TypeScript | [typescript-eslint](https://typescript-eslint.io/) | 静态检查 |
| Go | [Effective Go](https://go.dev/doc/effective_go) | Go 惯用法 |
| Go | [Go Code Review Comments](https://go.dev/wiki/CodeReviewComments) | Go review 高频意见 |
| Rust | [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/) | Rust API 设计检查表 |
| Kotlin | [Kotlin Coding Conventions](https://kotlinlang.org/docs/coding-conventions.html) | Kotlin 官方风格 |
| C++ | [Google C++ Style Guide](https://google.github.io/styleguide/cppguide.html) | C++ 风格参考 |
| JavaScript | [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) | JavaScript 风格参考 |

## 三、每类资源的目的

| 资源 | 解决的问题 | 不能替代什么 |
| --- | --- | --- |
| 代码整洁之道 | 怎么让代码更容易读 | 不能替代语言规范和工程约束 |
| Google Style Guides | 团队格式和命名如何统一 | 不能替代设计判断 |
| Effective Java | Java 语言层怎么写对 | 不能替代系统设计 |
| 重构 | 怎么改善现有结构 | 不能替代测试和需求判断 |
| 代码大全 | 怎么理解软件构建和复杂度 | 不能替代真实项目经验 |
| Google 工程实践 | 团队如何 review 和协作 | 不能替代组织文化 |
| Effective TypeScript 等 | 换语言时如何遵循当地惯用法 | 不能替代跨语言工程思想 |

## 四、30 天学习计划

| 时间 | 重点 | 产出 |
| --- | --- | --- |
| 第 1 周 | 命名、函数、注释 | 在一个旧项目里修正 20 个命名问题，拆分 2 个长函数 |
| 第 2 周 | Effective Java | 修复 3 个 Java 高频问题：原始类型、异常处理、资源管理 |
| 第 3 周 | 测试 | 为核心业务补 5 个测试，覆盖边界和异常 |
| 第 4 周 | 重构 | 选一个模块，按小步重构流程完成一次结构改善 |

每天不需要读很多。更有效的方式是：

1. 读一个小节。
2. 在当前项目里找一个对应问题。
3. 修改并运行测试。
4. 写下“原来哪里不好、为什么改、改完有什么收益”。

## 五、怎么选择下一份资源

按顺序问自己：

1. 我当前最常写什么语言？先补这门语言的规范和高频坑。
2. 我最近最常被 review 指出什么问题？找对应章节，而不是从头读书。
3. 我的项目现在最痛的是什么？重复代码、测试缺失、异常处理、性能问题，还是架构耦合？
4. 这本书是“立刻要用”还是“以后可能用”？后者先收藏，不要开始。

> 不要同时开始五本书。一次只选一个主题，把它落到代码里，再开始下一个。

## 六、只收藏五个链接

如果不想管理太多资源，先收藏这五个：

1. [Google Style Guides](https://google.github.io/styleguide/)
2. [Refactoring Catalog](https://refactoring.com/catalog/)
3. [Google Engineering Practices](https://google.github.io/eng-practices/)
4. [Effective TypeScript](https://effectivetypescript.com/)
5. [100 Go Mistakes](https://100go.co/)

## 总结

资源选择可以压缩成三句话：

- 先选“现在每天要用”的资源，不要按书单顺序囤书。
- 每读一个小节，就在项目里找一个真实问题落地。
- 一次只推进一个主题，用项目和 review 反馈决定下一步。

如果只能记住一件事：读书的目标不是读完，而是改变下一次写代码的判断。

## 相关阅读

- [代码规范与工程实践](/software-engineering/code-quality)
- [重构技巧](/software-engineering/refactoring)
- [测试](/software-engineering/testing)
- [Code Review](/software-engineering/code-review)
- [工程实践](/software-engineering/engineering-practice)
