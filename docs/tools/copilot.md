---
title: Copilot
description: GitHub Copilot：补全、Chat、批量编辑、PR Review、项目指令、安全与企业管控。
---

# Copilot

> Copilot 最早、最常见的价值是“降低样板代码和 API 记忆成本”，但生成代码仍然需要测试和 review。

产品能力会随版本变化，具体功能以当前官方文档为准。

Copilot 适合重复代码、DTO、Mapper、配置、测试骨架和常见 API；也适合 Chat 解释代码、生成测试、批量编辑和 PR Review。它不适合作为业务判断、架构 review 或安全审查的替代品。

## 本章目标

学完本章，你应该能够：

- 区分补全、Chat、批量编辑和 PR Review。
- 判断补全代码的 API、边界和测试风险。
- 配置项目指令和团队使用规范。
- 用人工审查补足自动 review。

## 主要能力

| 能力 | 用途 |
| --- | --- |
| 行内补全 | 边写边补，适合重复模式 |
| Chat | 解释代码、生成测试、问答 |
| 批量编辑 | 按指令修改多个位置 |
| Agent | 多步任务、工具调用 |
| PR Review | 自动审查 Pull Request |

补全适合样板代码、DTO、Mapper、配置、测试骨架和常见 API。风险是 API 版本不匹配、生成过时写法、边界条件缺失、复制错误逻辑。关键逻辑不要盲接受，检查导入和 API，补测试。

## 补全、Chat 与批量编辑

Chat 适合解释代码、生成测试、比较方案和排查错误。提问要提供相关代码、错误日志、期望行为和约束。

批量编辑和 Agent 适合机械替换、跨文件重命名、补测试和小范围重构。要求先看计划、检查 diff、运行测试、不修改无关文件。

项目指令可以写在 `.github/copilot-instructions.md`，描述技术栈、构建/测试命令、代码风格、目录结构和禁止事项。

## PR Review、安全与企业管控

Copilot 可以自动 review PR，发现明显 bug、提示缺少测试、指出可读性问题、总结变更。但它不能替代业务判断、架构 review、安全审查和对 AI 建议的判断。

安全上不把密钥、客户数据放进上下文；检查依赖和许可证；不让 AI 直接执行危险命令；对生成代码做安全扫描；企业环境配置数据保留和访问策略。

::: warning 自动 review 不是最终 review
Copilot 的建议可能正确，也可能误解业务。PR Review 的结论仍然要由人判断，尤其是权限、数据、事务和对外接口。
:::

## Copilot Review 矩阵

| 维度 | 必须回答 | 不满足时怎么办 |
| --- | --- | --- |
| API | 补全的 API 和版本是否存在？ | 编译验证，查文档 |
| 边界 | 是否处理空值、异常和边界？ | 补测试和校验 |
| 测试 | 是否有有效测试？ | 补行为测试 |
| diff | 批量编辑是否只改目标位置？ | 缩小范围，检查 diff |
| Review | 自动建议是否经过人工判断？ | 逐条验证，不盲从 |
| 安全 | 是否泄露敏感信息和依赖风险？ | 脱敏、扫描和审计 |

## 总结

Copilot 的核心，是降低重复编码和 API 记忆成本：

- 补全要检查 API 和边界，不能盲接受。
- 批量编辑和 PR Review 都要经过 diff 和人工判断。
- 项目指令、安全和测试，是团队使用的基础。

如果只能记住一件事：Copilot 可以帮你写得更快，但不能替你判断代码是否正确。

## 相关阅读

- [Context](/ai-coding/context)
- [Prompt](/ai-coding/prompt)
- [Code Review](/software-engineering/code-review)
- [AI Coding 工程方法](/ai-engineering/ai-coding)
