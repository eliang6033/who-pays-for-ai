# Who Pays for AI?

独立 React/Vite 互动研究网站。英文研究正文 **1,638 words**，全部显示在网页上；11 个引用来源（含 1 条课程阅读），其中 5 个为同行评审期刊或会议文章。网站与 Word 文档使用同一组研究来源；网页保留编号引用，两份 Word 文档采用 MLA。

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

- 入口是沉浸式城市场景。点击 Enter the simulation 开始。
- 每次只有一个决策：家庭收入 → 电力来源 → 冷却方式 → 升级费用分配。未安装时不能进入下一步。拖动位置用于布置示意图，不改变模型系数。
- 从设备托盘拖入家庭模型、电力设备、冷却设备和资金协议。只有放到场景中才确认选择；可重新摆放或用另一种方案替换。水冷水路、风冷风扇、风车和资金流向均有动画。
- 每次选择会短暂推近镜头：风机按基础、塔筒、机舱、叶片逐步组装并启动，光伏板逐块安装；冷却设备和资金路径也分阶段出现。动画不会阻塞下一步；支持系统减少动态效果偏好。鼠标和触屏共用 Pointer Events；也可点击／键盘选择设备，再点击安装目标或按 Enter 放置。Esc 取消，场景外释放保留原方案。
- 完成四步后点击 Run the year，才揭示假设年度结果。先看物理资源图，再切换到家庭经济负担。
- 可以返回修改、保存一个结果与下一轮比较、重新开始或下载当前报告。保存只保留到刷新页面。
- 顶部 Research 随时打开全部 7 节、1,638 词正文；不需要玩完才可阅读。返回 Simulator 会保留当前进度。
- 原始研究与假设模型分开标注，方法页列出全部系数与范围，11 个引用包含 10 个外部来源（5 个为同行评审文献）和 1 条课程阅读。

## 数据与研究边界

`src/research.json` 是正文及引用的唯一数据源。字数为七节正文按空格分词，排除 `[n]` 引文标记，不包含标题、参考文献、界面文字、方法和文档说明。英文分词方式在 Word 中可能略有差异。

`src/simulation.js` 包含全部假设和公式。所有容量、利用率、PUE、用水系数、碳系数、升级成本、回收年限、家庭数、收入和账单均为教学假设。电力研究数字指所有数据中心，并非全部归因于 AI。水仅表示直接消耗；排放仅表示运行用电的简化核算。无真实城市预测、真实水风险评分或真实电价预测。

5 个同行评审来源包括：Siddik 等的研究论文、Mytton 的 Perspective、Masanet 等的 Policy Forum、Luccioni 等的 FAccT 会议论文和 Henderson 等的 JMLR 研究论文。并非都属于原创实证研究。其余为 IEA、LBNL、ACEEE、PUCO 和 EPA 的机构来源。

界面使用 Google Fonts；若加载失败，自动回退到本机字体，互动和正文仍可使用。无账号、分析追踪、数据库或 AI API。插图是本项目原创 SVG 示意图。

## 验证

`npm test` 包含 17 项测试，覆盖模型计算、全部 24 条完整选择路径、每一步必须选择、结果解锁、返回修改、保存场景独立性，以及全文字数和引用覆盖。

2026-10-18 拖放版：已完成生产构建、17 项自动测试、桌面与窄屏浏览器检查、真实鼠标拖放、设备重定位、方案替换、无效释放、Esc 取消、键盘安装和完整结果流程。触屏使用同一 Pointer Events 实现，尚未用实体手机实测。发布由本仓库的 GitHub Actions 工作流完成，最新状态见 Actions → Deploy standalone research website。

## 提交前

阅读并按课程要求修改正文，确认作业对引用格式和 AI 协助的具体要求。此版本由 AI 协助完成研究整理、写作、网页开发和校验；如课程要求披露，请据实际使用方式说明。这里没有代替你作出课程认证或提交。
