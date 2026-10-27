# Who Pays for AI? — Draft 2 web edition

独立 React/Vite 互动研究网站。本版根据用户提供的 Draft 2（PDF 第 8–15 页）改编，共 6 节、1,710 个英文单词、10 条来源，其中 3 条为同行评审出版物、1 条为课程阅读。全文可直接从 Research 打开，不必完成模拟。网站采用编号引用。

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

## Draft 2 如何融入网站

开场介绍研究问题和主要论点。四步拖放选择保持原样，每次安装后可展开对应的论文段落。结果页增加论文中的受控比较，并解释模型不能推算真实电价。完整阅读页按 Introduction、Electricity Use、Cooling and Water Use、Income and Cost Sharing、Results and Limitations、Conclusion 排列，加入报道案例卡片、参数说明入口和参考文献。

原有风机搭建、设备动画、拖动摆放、选择门槛和计算系数均未改动。位置只影响示意图布局。

本版是网页改编稿，含事实澄清和衔接文字，并非 PDF 逐字复制。详见 DRAFT2_INTEGRATION.txt。此前的 MLA Word 文件和旧完整版压缩包未改动，也不代表已与这次 Draft 2 网页同步。

## 独立 GitHub Pages 发布

既有目标仓库：https://github.com/eliang6033/who-pays-for-ai

公开地址：https://eliang6033.github.io/who-pays-for-ai/

2026-10-27 用户已确认发布 Draft 2 网页版。更新通过该仓库 main 分支触发部署，实际发布结果请查看 GitHub Actions；不要上传 node_modules。保留 .github/workflows/deploy.yml，Pages 的发布来源使用 GitHub Actions。工作流会依次安装依赖、运行测试、构建并发布 dist。Vite 使用相对资源路径，支持仓库子目录。

此仓库与个人主页仓库独立。无需提供密码或 token。

## 内容和模型

src/research.json 保存正文和来源。字数只统计六章正文，按空格分词并排除编号引用，不包括标题、卡片、界面、参数和参考文献。

src/simulation.js 保存教学假设与公式。容量、利用率、PUE、用水、碳因子、费用、年限、收入和账单均为情景假设。收入只改变家庭负担，不改变物理资源消耗；电网升级分摊只改变居民费用。模型不将数据中心用电需求换算为居民电价，不预测真实城市。

同行评审来源为 Mytton、Siddik 等和 Masanet 等；其中包含 Perspective 和 Policy Forum，不能全部称为原创实证论文。其余为 IEA、LBNL、ACEEE、PUCO、EPA、Meadows 课程阅读和 Jarboe 新闻报道。

使用 Google Fonts，失败时回退本机字体；无账号、数据库、追踪或 AI API。浏览器检查与测试记录见 VALIDATION.txt。
