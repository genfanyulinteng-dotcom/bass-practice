# 第三方组件与许可说明

贝斯每日练习使用以下第三方组件。本文件用于说明来源与许可边界，不替代各依赖附带的完整许可证，也不为本项目原创应用代码授予开源许可。本仓库目前未为原创应用代码指定开源许可证。

构建流程将依赖的许可原文收集到 `licenses/third-party.txt`。分发构建后的应用时，应同时保留这份文件及其中的版权声明；间接依赖以实际构建收集的原文为准，不能仅凭下表省略它们的声明。

| 组件 | 本项目中的用途 | 许可证 |
| --- | --- | --- |
| React、React DOM | 界面与交互 | MIT |
| Radix UI 及相关组件 | 对话框、选择框等界面基础组件 | MIT |
| Lucide React | 界面图标 | ISC；其中来自 Feather 的图标还附有 MIT 声明 |
| class-variance-authority | 组件样式变体 | Apache License 2.0 |
| clsx | 类名组合 | MIT |
| tailwind-merge | Tailwind 类名合并 | MIT |
| Tailwind CSS | 样式构建 | MIT |
| tw-animate-css | 动画样式 | MIT |
| shadcn/ui 衍生组件与 vendor 样式 | 界面组件和样式 | MIT，Copyright (c) 2023 shadcn |

Lucide 的完整 LICENSE 同时列明其 ISC 许可和 Feather 衍生图标的 MIT 许可及版权声明；应保留整个文件，不应简化成一个「MIT」标签。class-variance-authority 的许可证为 Apache License 2.0，也不应替换成项目统一的 MIT 说明。

shadcn vendor 样式的许可原文随源码保存在 `vendor/shadcn-tailwind-4.13.0.LICENSE.md`。保留该声明也用于说明本项目中源自 shadcn/ui 的组件代码来源。

构建工具以及被实际引入的间接依赖各自保留原许可，包括 React 的 scheduler、Radix 相关基础包等。具体版本由锁文件记录；`licenses/third-party.txt` 中收集的许可原文应随构建同步更新。安装开发依赖不改变这些组件或本项目原创代码的许可归属。

Windows 便携包同时分发 Node.js 运行时。`runtime/Node-LICENSE.txt` 是该包所用 Node.js 发行版的完整许可文件，包含 Node.js 自身及其内含第三方软件的许可和声明；分发 `node.exe` 时应保留它。不能只用前端依赖的许可文件替代 Node.js 的完整声明。

工具内的理论资料链接用于说明概念依据。外部文章、网站和其他材料的版权仍归各自权利人所有；本仓库的公开发布不对这些外部内容授予额外许可。
