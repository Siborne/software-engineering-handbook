---
title: Spring AI
description: Spring AI 核心：ChatClient、Prompt、结构化输出、Tool Calling、RAG、Memory、Advisor 与生产化。
---

# Spring AI

> Spring AI 的价值是把模型调用、提示词、工具、检索和会话记忆，接入 Spring 熟悉的编程模型。

在 Spring 项目里接模型，最直接的方式是写一个 HTTP 客户端，拼 JSON、解析响应。能跑，但很快会遇到问题：不同模型提供商 API 不一致，Prompt 散落在 Controller，结构化输出要手写解析，工具调用、RAG、记忆和可观测性都要自己接。

Spring AI 想做的，是把这些能力抽象成 Spring 风格的组件：ChatClient、Prompt、EmbeddingModel、VectorStore、ToolCallback、Advisor 和 ChatMemory。具体 API 会随版本演进，但抽象和生命周期相对稳定。

## 本章目标

学完本章，你应该能够：

- 使用 ChatClient 组织 Prompt 和消息。
- 把模型输出映射为可校验的 Java 对象。
- 设计 Tool Calling、RAG 和 Memory。
- 为 AI 接口补上评估、限流和可观测性。

## Spring AI 解决什么

| 抽象 | 作用 |
| --- | --- |
| `ChatModel` | 底层聊天模型 |
| `ChatClient` | 面向业务的流式 API |
| `Prompt` | 提示词和消息集合 |
| `Message` | System / User / Assistant / Tool 消息 |
| `EmbeddingModel` | 文本向量化 |
| `VectorStore` | 向量存储和相似度检索 |
| `ToolCallback` | 暴露给模型的工具 |
| `Advisor` | 请求/响应拦截和增强 |
| `ChatMemory` | 会话记忆 |

这些抽象的共同目标，是让业务代码依赖稳定接口，而不是直接依赖某个模型厂商的 HTTP API。

## ChatClient 与结构化输出

```java
@Service
public class SupportService {
    private final ChatClient chatClient;

    public SupportService(ChatClient.Builder builder) {
        this.chatClient = builder
            .defaultSystem("你是一名客服助手，只根据提供的订单信息回答。")
            .build();
    }

    public String answer(String question) {
        return chatClient.prompt()
            .user(question)
            .call()
            .content();
    }
}
```

系统指令和用户输入要分开，默认指令集中配置，不要散落在 Controller。对输出做校验，记录模型、Prompt 版本和 token。

结构化输出把模型结果映射为 Java 对象：

```java
public record OrderSummary(String orderId, String status, BigDecimal total) {}

OrderSummary summary = chatClient.prompt()
    .user("提取订单信息：" + text)
    .call()
    .entity(OrderSummary.class);
```

仍然要做 schema 校验和异常处理。模型可能输出非法字段，金额、枚举、日期需要严格校验；不要让结构化输出直接触发副作用。

## Tool Calling、RAG 与 Memory

```java
@Tool(description = "根据订单 ID 查询订单状态")
public OrderView getOrder(@ToolParam(description = "订单 ID") String orderId) {
    return orderService.getOrder(orderId);
}
```

工具要参数校验、权限检查、幂等、错误结构化、写操作人工确认、结果脱敏。Spring AI 负责把工具暴露给模型，不负责替你完成业务校验。

RAG 的核心流程是文档切分 → Embedding → VectorStore，问题 Embedding → 相似度检索 → 组装上下文 → ChatClient。切分策略影响效果，需要元数据过滤和权限隔离，检索结果要重排和压缩，要求模型引用来源，资料不足时拒答。

Memory 要明确保存什么、保存多久、如何检索、如何删除、多租户如何隔离。不要把全部对话无限保存；记忆不是日志。

## 生产化与评估

生产环境要处理 API key 外置、超时和重试、限流和配额、降级和兜底、内容安全、敏感信息脱敏、成本控制、模型路由、版本管理和审计。

可观测性记录模型名称和版本、Prompt 版本、token、延迟、工具调用、检索结果、错误和成本。评估要建立评估集，评回答相关性、忠实度、格式合法率、工具选择准确率、RAG 检索和引用，并对 Prompt 和模型版本跑回归。

::: warning 不要把模型输出直接当业务结果
模型输出是建议，不是事实。结构化输出要校验，工具调用要授权，金额和权限要二次确认，危险操作要人工审批。Spring AI 提供的是接入方式，不是安全保证。
:::

## Spring AI Review 矩阵

| 维度 | 必须回答 | 不满足时怎么办 |
| --- | --- | --- |
| 封装 | 模型调用是否收口在 Service？ | 移出 Controller，统一 ChatClient |
| 消息 | System/User 是否分离？ | 集中系统指令，避免拼接 |
| 输出 | 是否校验结构化输出？ | 加 schema 和异常处理 |
| 工具 | 是否最小权限、幂等、可审计？ | 加校验、确认和审计 |
| RAG | 是否做权限过滤和引用？ | 检索阶段过滤，要求引用 |
| 记忆 | 是否有写入、检索、删除策略？ | 加 TTL、隔离和用户删除 |
| 观测 | 是否记录模型、Prompt、token 和成本？ | 接入 tracing 和指标 |
| 评估 | 是否有评估集和回归？ | 建样本集，版本化 Prompt |

## 总结

Spring AI 的价值，是把 AI 能力接入 Spring 的工程习惯：

- 用 ChatClient 和 Prompt 抽象隔离模型提供商。
- 结构化输出、工具调用、RAG 和记忆，都要做校验和权限控制。
- 生产化离不开限流、降级、可观测性和评估。

如果只能记住一件事：Spring AI 让模型调用更像普通服务调用，但模型输出的不确定性仍然需要工程边界来兜底。

## 相关阅读

- [Spring AI Alibaba](/backend/spring-ai-alibaba)
- [Prompt](/ai-engineering/prompt)
- [Tool Calling](/ai-engineering/tool-calling)
- [RAG](/ai-engineering/rag)
- [Evaluation](/ai-engineering/evaluation)
