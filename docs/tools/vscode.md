---
title: VSCode
description: VSCode 效率实践：设置同步、扩展、任务、调试、远程开发、工作区和 AI 辅助。
---

# VSCode

> VSCode 的效率来自“把重复操作固化成配置”，而不是装一堆扩展。

## 本章目标

学完本章，你应该能够：

- 管理设置、扩展和工作区。
- 用 Tasks 和 Launch 配置构建与调试。
- 使用远程开发和容器环境。
- 判断 AI 补全是否值得接受。

## 核心概念

| 概念 | 用途 |
| --- | --- |
| Settings | 编辑器配置 |
| Extensions | 语言和工具支持 |
| Tasks | 运行构建/测试命令 |
| Launch | 调试配置 |
| Workspace | 多项目工作区 |
| Remote | 远程开发 |

## 常用设置

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit"
  },
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true
}
```

原则：

- 团队共享的配置放仓库。
- 个人偏好放用户设置。
- 不把密钥写进设置。

## 扩展

按需安装：

- 语言支持。
- Linter / Formatter。
- 调试器。
- Git。
- Docker。
- 数据库。
- AI 助手。

不要：

- 装大量功能重叠的扩展。
- 安装来源不明的扩展。
- 让扩展拖慢启动。

## Tasks

`.vscode/tasks.json`：

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "test",
      "type": "shell",
      "command": "./gradlew test",
      "group": "test"
    }
  ]
}
```

好处：

- 统一命令。
- 新人不用记脚本。
- 可与调试集成。

## 调试

`.vscode/launch.json`：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "java",
      "name": "OrderService",
      "request": "launch",
      "mainClass": "com.example.order.OrderApplication"
    }
  ]
}
```

调试原则：

- 先复现。
- 断点 + 变量。
- 不靠大量日志猜。
- 调试后移除临时断点。

## 远程开发

- Remote SSH。
- Dev Containers。
- WSL。

好处：

- 环境一致。
- 不污染本机。
- 适合团队统一开发环境。

## 工作区

- 多仓库用 `.code-workspace`。
- 统一设置和扩展推荐。
- 不要把个人路径写进共享配置。

## 快捷键

建议掌握：

- 命令面板。
- 文件搜索。
- 全局搜索。
- 跳转定义。
- 查找引用。
- 重命名符号。
- 多光标。

## AI 辅助

- 补全。
- 解释代码。
- 生成测试。
- 重构。

原则：

- 检查 API。
- 看 diff。
- 运行测试。
- 不盲接受。

## 常见错误

- 扩展过多。
- 不共享配置。
- 不配置格式化。
- 不配置调试。
- 直接在服务器上改代码。
- 不读扩展权限。
- 把密钥写进设置。
- 盲接受 AI 补全。

## VSCode Review 清单

- [ ] 是否配置 format on save？
- [ ] 是否有团队共享设置？
- [ ] 是否配置测试任务？
- [ ] 是否配置调试？
- [ ] 扩展是否必要且可信？
- [ ] 是否使用远程/容器开发？
- [ ] 是否掌握常用快捷键？
- [ ] AI 补全是否经过验证？

## 相关阅读

## 总结

VSCode 的核心，是把重复操作固化成配置：

- 用共享设置统一格式化，用 Tasks 和 Launch 配置构建调试。
- 扩展按需安装，避免启动慢和来源不明。
- 远程/容器开发保证环境一致。

如果只能记住一件事：团队效率来自“配置即代码”，不是安装更多插件。

- [Cursor](/tools/cursor)
- [Git](/tools/git)
- [AI Coding](/ai-coding/)
