---
title: 给博客也算一笔账——从 VitePress 翻车到写一个 Tauri 桌面工具
description: 6 次构建失败、3 次主题重构、最后写了个 952 行 Rust + 2208 行 TS 的桌面写作助手。一个"几小时就能搭好"的博客，怎么把我拖进半年的折腾。
date: 2026-05-23
tags: [折腾, 工具, 算账, Tauri, VitePress]
categories: [工具与效率]
cover: /covers/blog-toolchain.svg
---

# 给博客也算一笔账——从 VitePress 翻车到写一个 Tauri 桌面工具

一开始我以为博客是这样的：

> 选个静态站生成器，挑个主题，写 markdown，推 GitHub，完事。

听起来像一个周末的事。

我做完之后回头看 git log，**6 次"修复构建"、3 次主题重构、1 个 Electron 桌面工具、1 次 Tauri 重写**——半年没了。

不亏，但要算清楚账。

---

## 起点：几小时就能搭好

VitePress + Teek 主题，确实几小时就跑起来了。

`pnpm install`、`pnpm docs:dev`，浏览器打开 5173 端口，hero、文章列表、tag 云、分类全部默认带。看起来就差写文章了。

**实际不是。**

---

## 第一坑：把它部署上去

我选 Cloudflare Pages，看中免费 + 全球 CDN。然后开始踩坑。

git log 里的"修复构建"commit 一字排开：

| commit | 干啥 |
|---|---|
| `10c31c2` | `pnpm approve-builds` 让构建脚本能跑 |
| `90a9cfd` | 撤掉一个无效的 `--allow-scripts` 选项 |
| `ab92610` | 修 CI 构建失败：更新 lockfile + 加 pnpm 配置 |
| `f06d9be` | 审批 esbuild 构建脚本 |
| `2c6d92b` | 审批 Cloudflare 的 workerd 构建脚本 |
| `ee1782c` | Cloudflare Pages 项目名打错了 |

每一次都是**推上去 → 失败 → 看日志 → 改一行 → 再推 → 又失败**。第一次部署成功的时候我打开页面看了 3 秒就关掉了——没成就感，只想"为啥这么麻烦"。

但**这一坑值得**——我现在知道 pnpm 默认不让陌生包跑 postinstall 脚本，知道 Cloudflare Pages 走 workerd，知道项目名不能含大写。下次起新站，30 分钟就能上线。

**第一笔账：6 次构建 = 一次"把 CI/CD 流程吃透"的学费。**

---

## 第二坑：主题反复重构

部署完只是开始。Teek 默认主题挺漂亮，但**不是"我"的博客**——它是别人的博客模板。

于是开始改：

- 改首页 hero 区
- 改作者卡 (`HomeBoard.vue` → `BloggerSidebar.vue`)
- 改 about 页 (`AboutProfile.vue`)
- 改文章列表 (`ArticleList.vue`)
- 改全局样式 (`style.css`)

git log 里至少 3 次大重构（`089fd36`、`56c68c4`、`d1fe3bf`）。每次都是写到一半发现"这个组件设计不对"，重新拆。

最后这套组件长成现在的样子：左侧自写的作者侧边卡 + 右侧 hero + spotlight + 文章列表。**没有一个组件是 Teek 默认的。**

**第二笔账：组件改了几遍，但每次改完都"更像我自己的博客"。** 没浪费。

---

## 真正的痛点：写文章本身

主题搞定之后我以为终于能专心写了。

第一篇文章写到一半，我意识到一件事——**写 markdown 本身没问题，问题是写完之后的那些事。**

写一篇文章的完整流程：

```
1. cd docs/articles/
2. 新建 some-slug.md
3. 写 frontmatter（title / description / date / tags / categories / cover）
   ↑ 每次都要回去翻别的文章抄字段名
4. 截图 → 命名 → 拖到 docs/public/images/
   ↑ 命名得想个不冲突的
5. 在 markdown 里插 ![](/images/xxx.png)
   ↑ 路径要 URL encode
6. 整理段落、补 alt、检查链接
7. git add . && git commit -m "..." && git push
```

**7 步**。每步都不难，加起来很烦。

而且每次写完，我**最不想做的就是补 frontmatter**——脑子在故事里，让我跳出来去填 `tags: [信息差, 通勤, 出行优化]` 完全打断思路。

---

## 第一次自动化：Electron 写作助手

最早的方案是 Electron。

主文件 `main.js / renderer.js / preload.cjs` 现在已经被 gitignore 掉了，但根目录还有一个 372 字节的 `index.html` 残留——可以认出来。

工具栏只有 4 个按钮：

> 新建 → 写作 → 整理 → 发布

设计原则我当时就定下了，到现在还在生效：

1. **零摩擦写作**：粘图、拖图、粘文本，**都不弹框问元数据**。直接落盘、直接插入，元数据先留空
2. **元数据后置**：frontmatter、图注、alt 这些通过「整理」按钮事后补，不在写作中途索取

Electron 版用了几周。能 work，但有几件事让我难受。

---

## 决定重写：四件让 Electron 不舒服的事

1. **安装包大**——我做的就是一个写文章的小工具，打包出来 80+ MB，绝大部分是 Chromium。我装在 U 盘里给自己另一台机用都嫌占地方
2. **内存占用高**——后台挂着写作助手，单进程几百 MB。我习惯同时开 VS Code、浏览器十几个 tab、微信，再加这个就开始风扇响
3. **启动慢**——双击图标到能写字之间，能停顿一两秒。每天打开几次，每次都"等一下"
4. **想学 Rust**——这条最诚实。我不是被迫迁的，是**正好想找个项目摸 Rust**

Tauri 是答案：

- 不内嵌 Chromium，用系统 WebView，**安装包能砍到几 MB**
- Rust 后端 + 任意前端框架（我选 React + Tailwind + CodeMirror）
- 启动快、内存低、跨平台

**四件事一次解决**，迁移就开干。

---

## 重写过程：Rust + React + Tailwind

新结构很简单：

```
src-tauri/         <- Rust 后端
  └── src/lib.rs   <- 952 行，15 个 #[tauri::command]
src/               <- React 前端
  ├── App.tsx          <- 477 行，主状态机
  ├── components/      <- Editor / Preview / Sidebar / Toolbar / 各类 Dialog
  └── lib/
      ├── tauri.ts     <- IPC 接口封装
      └── formatDraft.ts  <- 整理草稿的纯函数
```

总计 **952 行 Rust + 2208 行 TypeScript/TSX**。

Rust 后端负责所有跟文件系统、git 打交道的事：

- 文章管理：`listArticles / readArticle / writeArticle / unique_article_path`
- 页面管理：`listPages / resolve_page_path / label_for_page`
- frontmatter 处理：`extract_frontmatter_field / set_frontmatter_field / format_yaml_list`
- 图片处理：`image_dir / build_image_filename`
- 配置持久化：`config_path / save_persisted_config`
- 发布：`git add → commit → push`，发布日志全程流到前端

前端只管 UI 状态和编辑器。**所有文件 IO 走 IPC，前端不直接碰文件系统。**

---

## 现在的工作流

写这篇文章本身就是用它写的：

1. 工具栏点「新建」→ 弹个小框填标题、tag、category → 后端用 slug 化的文件名建好 frontmatter 模板
2. 在编辑器里写正文。截图直接 `Ctrl+V` 粘进编辑器——后端把图存到 `docs/public/images/`，编辑器自动插好 `![](path)`
3. 写完点「整理」——`formatDraft.ts` 自动补缺失的 frontmatter 字段、规范段落、调整图片占位
4. 点「发布」——后端跑 `git add → commit → push`，发布日志实时滚到下方

**7 步 → 4 个按钮**。

---

## 算账：花的时间值不值

老老实实数：博客代码量不大，但**每一坑都得调一段时间**——不是一两小时，是断断续续花掉好几个晚上。从 VitePress 起手到 Tauri 工具能正常发文，前前后后**好几个月**。

**实际花在博客内容本身的时间，远少于花在工具链上的时间。**

按"写一篇文章"算单价更荒诞——前几篇文章的"单篇分摊成本"高得不像话。

但这账不能这么算。

**真正的回报**不是少花几分钟写一篇，而是：

- **学了一遍 CI/CD 全流程** —— 下个项目能直接套
- **学了 Rust** —— 952 行不算精通，但摸到了门
- **写作流畅度 = 文章产出量** —— 工具顺手之后，"想写"和"动手写"之间的摩擦小到可以忽略
- **整套东西完全可控** —— 主题、组件、写作工具、部署，每一层我都改得动

把这些加进收益栏，账才**算得回来**。

---

## 一句话

> 我不是为了写博客才折腾工具——我是借写博客这件事，把"自己想学的东西"全学了一遍。
>
> 博客只是承载体。**真正在产出的，是能复用到下一个项目的那套能力。**

这也是我现在看任何"看起来低 ROI"的事情的角度——别只算这一件事的回报，**算它能不能给你后面 5 件事打底**。

如果能，单件事亏一点也值。

---

**你呢？有没有"看起来在折腾但其实是在攒能力"的事？** 评论区聊聊。
