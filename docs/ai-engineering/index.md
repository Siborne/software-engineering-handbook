---
title: AI 工程
description: 从 Prompt、Context、Tool Calling 到 Agent、RAG 与 Evaluation：构建可靠 AI 应用的工程方法。
---

# AI 工程

> AI 工程不是“会写提示词”，而是把不确定的模型能力，变成可评估、可观测、可维护的产品系统。

一个 AI 应用通常不是“调用一次模型就结束”。它要决定任务怎么说清楚，给模型什么上下文，允许它调用哪些工具，如何组织多步流程，如何记住历史、检索知识，如何评估效果、控制成本、处理失败，以及如何让人类在关键节点做决定。

模型只是系统的一部分。真正决定产品可用性的，往往是模型之外的那层工程。

## 本章目标

学完本章，你应该能够：

- 画出 AI 应用的模型、上下文、工具、编排和质量分层。
- 判断一个任务该用 Workflow 还是 Agent。
- 理解评估、可观测性和安全在 AI 系统中的位置。
- 选择下一步要深入的 AI 工程主题。

## AI 应用的分层

| 层次 | 关注点 | 对应章节 |
| --- | --- | --- |
| 模型层 | 选择模型、参数、成本、延迟、能力边界 | Prompt、Evaluation |
| 上下文层 | 系统指令、用户输入、检索结果、历史、工具输出 | Context Engineering、RAG、Memory |
| 工具层 | 函数调用、外部 API、数据库、文件、浏览器 | Tool Calling、MCP |
| 编排层 | 固定流程、路由、并行、Agent 循环 | Workflow、Agent |
| 质量层 | 评估集、回归测试、人工反馈、线上监控 | Evaluation |
| 安全层 | 权限、注入、隐私、审计、人工确认 | Tool Calling、Agent、MCP |
| 产品层 | 交互、失败提示、可解释性、成本控制 | AI Coding、Workflow |

## 学习路径

建议按以下顺序学习：

1. [Prompt](/ai-engineering/prompt)：把任务、约束和输出格式说清楚。
2. [Context Engineering](/ai-engineering/context-engineering)：决定模型在每一步看到什么。
3. [Tool Calling](/ai-engineering/tool-calling)：让模型安全地访问外部能力。
4. [MCP](/ai-engineering/mcp)：用标准协议连接工具和数据源。
5. [Workflow](/ai-engineering/workflow)：把多步任务组织成可预测流程。
6. [Agent](/ai-engineering/agent)：让模型在循环中规划、行动和反思。
7. [Memory](/ai-engineering/memory)：管理短期上下文和长期记忆。
8. [RAG](/ai-engineering/rag)：让模型基于外部知识回答。
9. [Evaluation](/ai-engineering/evaluation)：用数据判断系统是否真的变好。
10. [AI Coding](/ai-engineering/ai-coding)：把 AI 接入日常开发流程。

## 核心原则

**先做 Workflow，再做 Agent。** 大多数任务可以用固定流程解决。Agent 适合开放式、步骤不确定、需要动态决策的任务。不要因为 Agent 很火，就把所有流程都做成自主循环。

**上下文比提示词更重要。** 提示词决定怎么说，上下文决定模型知道什么。模型答错，常见原因不是提示词不够花哨，而是缺少关键信息、信息过期、信息太多，或者信息相互矛盾。

**一切能力都要可评估。** 没有评估集，就无法判断一次修改是改进还是退步。先建立小规模、可重复的评估集，再谈优化。

**让模型做擅长的事，让代码做确定的事。** 模型负责理解、生成、归纳、分类和规划；代码负责校验、计算、权限、事务、重试和幂等。不要用模型替代确定性的业务规则。

**默认不信任模型输出。** 模型输出是建议，不是事实。涉及金额、权限、删除、发布和外部副作用时，必须有校验、确认或人工审批。

::: tip 大多数任务不需要 Agent
如果你能画出流程图，先用 Workflow。Agent 的灵活性来自动态决策，风险也来自动态决策；只有下一步真的取决于中间结果时，才值得引入循环。
:::

## 从 Java 开发者迁移

AI 工程里的很多概念，和传统后端工程可以对应：

| 传统后端 | AI 工程 |
| --- | --- |
| 接口契约 | Prompt 的输出格式与工具 schema |
| 依赖注入 | Context Engineering：按需注入信息 |
| 服务调用 | Tool Calling |
| 工作流引擎 | Workflow / Agent 编排 |
| 单元测试 | Eval 用例 |
| 集成测试 | 端到端 eval |
| 日志与链路追踪 | Prompt / Tool / Token 级 tracing |
| 配置中心 | Prompt、模型、工具配置的版本管理 |
| 权限系统 | 工具权限、人工审批、审计 |
| 事务与幂等 | 工具调用的副作用控制 |

## 总结

AI 工程可以压缩成三句话：

- 模型只是系统的一部分，上下文、工具、编排、评估和安全共同决定可用性。
- 先做可验证的 Workflow，再在必要时局部引入 Agent。
- 没有评估集和可观测性，所有优化都只是感觉。

如果只能记住一件事：把不确定的模型能力，放进确定的工程边界里。

## 相关阅读

- [Prompt](/ai-engineering/prompt)
- [Context Engineering](/ai-engineering/context-engineering)
- [Tool Calling](/ai-engineering/tool-calling)
- [Agent](/ai-engineering/agent)
- [RAG](/ai-engineering/rag)
- [Evaluation](/ai-engineering/evaluation)
