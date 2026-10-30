# Who Pays for AI? — Final draft web edition

独立 React/Vite 互动研究网站。当前版本包含 1,853 个英文单词的六章正文和 13 条 MLA 来源，其中 3 条为同行评审出版物、1 条为课程阅读。正文、选择卡片和动画解说均与最终稿及后来补入的水资源讨论、Viborillas 采访对应。Research 可直接阅读全文。

## 本地运行

需要 Node.js 22.12 或更新版本。在本目录运行：

```bash
npm ci
npm run dev
```

打开终端显示的地址。检查和构建：

```bash
npm test
npm run build
npm run preview
```

`dist/` 为已构建的静态网页；用服务器访问，不要直接双击其中的 index.html。

## 互动体验与研究内容

依次选择电力来源、冷却方式和家庭收入。每章先打开卡片了解原理与 tradeoff，再确认选择，观看五场景、12.5 秒的动画。家庭章节还包含电网升级费用分摊。支持暂停、重播、跳过和减弱动态效果。结果页保留比较与报告下载。

正文是最终稿的网页改编，明确区分研究结论、新闻报道、预测和教学假设。Works cited 列出全部 13 条 MLA 书目，编号引用连接正文和动画解说。

## 独立 GitHub Pages 发布

目标仓库：https://github.com/eliang6033/who-pays-for-ai

公开地址：https://eliang6033.github.io/who-pays-for-ai/

main 分支通过 .github/workflows/deploy.yml 安装依赖、运行测试、构建并发布 dist。Vite 使用相对资源路径，支持仓库子目录。此仓库与个人主页仓库独立。

## 内容和模型

src/research.json 保存正文和来源。字数只统计六章正文，按空格分词并排除编号引用，不包括标题、卡片、界面、参数和参考文献。

src/cinema.js 保存选择卡片和动画解说；src/CinematicSimulator.jsx 管理互动流程，src/CinemaArt.jsx 和 src/cinema.css 定义动画画面。

src/simulation.js 保存教学假设与公式。输入均为情景假设。收入只改变家庭负担，不改变物理资源消耗；电网升级分摊只改变居民费用。模型不将数据中心用电需求换算为居民电价，不预测真实城市。

npm test 包含 22 项测试；参考文献对照文件随仓库保存在 tests/fixtures/。DRAFT2_INTEGRATION.txt 和 VALIDATION.txt 保留此前版本的历史记录。
