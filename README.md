# Who Pays for AI?

独立 React/Vite 互动研究网站。英文研究正文 **1,530 words**，全部显示在网页上；10 个引用来源，其中 5 个为同行评审期刊或会议文章。正文、编号引用和 Word 文档一致。

## 本地运行

安装 Node.js 24 LTS，然后在本文件所在文件夹打开终端：

```bash
npm ci
npm run dev
```

打开终端显示的本地地址。停止时按 Ctrl+C。

```bash
npm test
npm run build
npm run preview
```

`dist/` 是已经构建的网页文件。请用本地服务器或静态托管访问，不要直接双击 `index.html`。预览无需 GitHub 账号。

## 单独发布到 GitHub Pages

1. 在你的 GitHub 账号创建一个**全新的公开仓库**，建议名 `who-pays-for-ai`。不要使用或编辑现有 `用户名.github.io` 仓库。
2. 将本项目文件放在新仓库根目录，包括隐藏的 `.github/workflows/deploy.yml`，不要上传 `node_modules/`。建议使用 GitHub Desktop：将本文件夹添加为新仓库并发布，取消勾选 Keep this code private；确认目标仓库是新仓库。
3. 默认分支使用 `main`。在新仓库进入 **Settings → Pages → Build and deployment → Source → GitHub Actions**。
4. 在 **Actions → Deploy standalone research website → Run workflow** 运行，或推送到 `main` 自动运行。
5. 等工作流完成，Pages 设置和部署任务会给出公开网址。通常为 `https://你的用户名.github.io/who-pays-for-ai/`；如果账号已有自定义域名，以 GitHub 显示的网址为准。

Vite 使用相对资源路径 `base: './'`，本项目仅有单页锚点导航，因此支持独立仓库子路径，不必写死用户名或仓库名。工作流仅在这个新仓库发布，不会修改个人主页。公开仓库会出现在 GitHub 账号下，但不会自动添加到你的个人网站内容中。

配置参考：[Vite 官方 GitHub Pages 部署说明](https://vite.dev/guide/static-deploy.html#github-pages)。工作流内置依赖安装、测试、构建和 Pages 发布，使用 GitHub 自动提供的工作流授权，不需要你发送密码或 token。

**项目仓库：** https://github.com/eliang6033/who-pays-for-ai

**网站地址：** https://eliang6033.github.io/who-pays-for-ai/

部署由本仓库的 GitHub Actions 工作流管理。

## 网站内容与使用

- 首页：基础设施插图、研究问题、带来源的全球电力估计和预测。
- 互动区：收入、电力、冷却和升级费用分配，共 24 种组合。
- 结果：实时电力、直接耗水、运行用电排放、家庭附加费用和所选家庭能源负担。
- 对比：同一设施对应两种收入；保存一个配置和当前配置对照。
- 导出：Download impact report 保存当前计算、假设和来源。保存场景仅保留到刷新页面。
- 研究正文：7 章节、1,530 英文词，不必完成互动即可阅读。Reading view 隐藏模拟，保留全文。
- 方法：所有参数、公式和范围；引用区标记哪些来源经过同行评审。

## 数据与研究边界

`src/research.json` 是正文及引用的唯一数据源。字数为七节正文按空格分词，排除 `[n]` 引文标记，不包含标题、参考文献、界面文字、方法和文档说明。英文分词方式在 Word 中可能略有差异。

`src/simulation.js` 包含全部假设和公式。所有容量、利用率、PUE、用水系数、碳系数、升级成本、回收年限、家庭数、收入和账单均为教学假设。电力研究数字指所有数据中心，并非全部归因于 AI。水仅表示直接消耗；排放仅表示运行用电的简化核算。无真实城市预测、真实水风险评分或真实电价预测。

5 个同行评审来源包括：Siddik 等的研究论文、Mytton 的 Perspective、Masanet 等的 Policy Forum、Luccioni 等的 FAccT 会议论文和 Henderson 等的 JMLR 研究论文。并非都属于原创实证研究。其余为 IEA、LBNL、ACEEE、PUCO 和 EPA 的机构来源。

界面使用 Google Fonts；若加载失败，自动回退到本机字体，互动和正文仍可使用。无账号、分析追踪、数据库或 AI API。插图是本项目原创 SVG 示意图。

## 验证

`npm test` 包含 9 项测试：默认计算、收入独立性、冷却方向、电源系数、费用守恒、全部 24 组合、无效输入、全文字数与引用覆盖。

已完成生产构建、桌面与窄屏浏览器检查、切换选项、保存对比、报告下载、阅读模式和引用锚点检查。GitHub Actions 的真实部署需新仓库建立后验证。

## 提交前

阅读并按课程要求修改正文，确认作业对引用格式和 AI 协助的具体要求。此版本由 AI 协助完成研究整理、写作、网页开发和校验；如课程要求披露，请据实际使用方式说明。这里没有代替你作出课程认证或提交。
