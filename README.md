# 青微的博客

记录生活里的算账、工具和折腾。基于 VitePress + Teek 主题，部署在 Cloudflare Pages。

🌐 [blog.qing-wei.com](https://blog.qing-wei.com)

## 内容主线

- **算账省钱**：预算、通勤、保险、寄快递和订阅
- **消费实战**：二手交易、百亿补贴、闲鱼和办卡
- **工具效率**：AI Agent、写作工具、自动化和验证流程
- **个人复盘**：做事方式、副业观察和关系里的身份切换

## 技术栈

- **博客**：VitePress + vitepress-theme-teek
- **托管**：Cloudflare Pages（GitHub Actions + Wrangler 部署）
- **图床**：Cloudflare R2
- **写作助手**：Tauri + React（青微博客助手，见下文）

## 仓库结构

| 路径 | 说明 |
|---|---|
| `docs/` | 博客本体：文章、页面、自定义主题组件和样式 |
| `docs/articles/` | 文章 Markdown |
| `docs/public/` | 封面（`covers/`）和文章配图（`images/`） |
| `packages/shared/` | 文章读取逻辑，博客构建和写作助手共用 |
| `src/`、`src-tauri/` | 写作助手：Tauri 桌面应用，前端为 React + CodeMirror |
| `scripts/` | 校验与图片优化脚本 |

## 快速开始

```bash
pnpm install
pnpm run docs:dev      # 本地开发 http://localhost:5173
```

## 常用命令

| 命令 | 作用 |
|---|---|
| `pnpm run docs:dev` | 启动博客开发服务器 |
| `pnpm run docs:build` | 构建博客 |
| `pnpm run docs:preview` | 预览构建结果 |
| `pnpm run docs:check` | 检查文章元数据、图片路径和 permalink |
| `pnpm run docs:links` | 检查构建产物里的链接 |
| `pnpm run docs:render-check` | 检查渲染后的页面 |
| `pnpm run optimize:images` | 优化图片 |
| `pnpm run lint` | ESLint 检查 |
| `pnpm run verify` | 提交前的完整检查：文章校验、lint、构建、链接检查和写作助手构建 |

## 写文章

在 `docs/articles/` 下新建 `.md` 文件，头部写 frontmatter：

```yaml
---
title: 文章标题
description: 一两句话描述
date: 2026-07-01
tags: [标签1, 标签2]
categories: [算账省钱]
cover: /covers/xxx.webp
---
```

- `categories` 使用上面四条内容主线之一
- 封面放在 `docs/public/covers/`，配图放在 `docs/public/images/`，统一用 `.webp`
- 写完先跑 `pnpm run docs:check`，提交前跑 `pnpm run verify`

## 青微博客助手（Tauri）

写作和发布用的桌面应用：编辑 Markdown、实时预览、新建和重命名文章、查看发布日志。

```bash
pnpm run app     # 开发模式（tauri dev）
pnpm run dist    # 打包 Windows 安装包（NSIS）
```

根目录的 `config.json` 里的 `blogPath` 指向本机的博客仓库路径，换电脑时需要改成自己的路径。

## 部署

推送到 `main` 后，GitHub Actions 会依次执行文章校验、图片优化、构建和链接检查，再用 Wrangler 部署到 Cloudflare Pages（见 `.github/workflows/deploy.yml`）。

变更历史请看 Git 提交记录和 Pull Request。
