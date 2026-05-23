# 青微博客

省钱达人博客，基于 VitePress + Cloudflare 的个人博客，分享省钱技巧、消费观察与副业记录。

🌐 [blog.qing-wei.com](https://blog.qing-wei.com)

## 技术栈

- **框架**：VitePress + vitepress-theme-teek
- **托管**：Cloudflare Pages
- **图床**：Cloudflare R2
- **桌面端**：Tauri（开发中）

## 快速开始

```bash
pnpm install
pnpm run docs:dev     # 开发 http://localhost:5173
pnpm run docs:build   # 构建
```

## 写文章

在 `docs/articles/` 下创建 `.md` 文件，头部 YAML frontmatter：

```yaml
---
title: 文章标题
description: 描述
date: 2025-05-23
tags: [标签1, 标签2]
categories: [分类]
cover: /covers/xxx.svg
---
```

## 📜 更新日志

### 2025-05-23 首页大改版 + Tauri 桌面端

- **首页重构**：改为左右双栏布局（左侧作者卡片 + 右侧主内容）
- **封面升级**：hero 区域封面动态取最新文章封面图
- **推荐机制**："本期推荐"改为最新文章置顶，热点故事从 3 列缩为 2 列
- **文章列表**：新增分类/标签筛选功能（URL query 驱动，支持组合筛选）
- **标签排序**：按使用频率降序排列，高频标签靠前
- **About 页**：删除 profile 网格卡片区，页面简化
- **Tauri 桌面端原型**：新建 `src-tauri/` + `src/`，博客助手桌面应用雏形
- **主题系统**：从 `vitepress-theme-teek/index.css` 改为 `virtual:teek-index.css`
- **新文章**：《三个我》——副业人际关系观察
- **封面 SVG**：重绘 budget-plan、finance-beginner；新增 three-selves 封面
- **清理**：删除废弃的优惠券截图、打车价格图等 6 张图片

### 2025-05-21 About 页重构

- AboutProfile 组件化，改成真人头像 + 重写自我介绍
- 修复 about 页对比度过低
- 完善 VitePress 配置

### 2025-05-20 新文章 + 仓库清理

- 新文章《被百亿补贴盾了之后，1370 拿下一台二手 Neo7》
- 清理 GitHub 上多余的说明文档和配置文件
- 更新 .gitignore 忽略 Edge 调试缓存、截图等垃圾文件

### 2025-05-19 新文章上线

- 发布《个人预算表》《通勤经济学》《消费陷阱识别指南》《理财入门指南》
- 封面 SVG 统一设计风格
- 部署自动化，连接 Cloudflare Pages 自动构建
