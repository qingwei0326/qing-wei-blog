# 快速开始指南

欢迎使用省钱达人博客！本指南将帮助你快速上手。

## 📦 安装

### 1. 克隆或下载项目

```bash
git clone https://github.com/YOUR_USERNAME/money-saving-blog.git
cd money-saving-blog
```

### 2. 安装依赖

```bash
pnpm install
```

## 🚀 本地开发

### 启动开发服务器

```bash
pnpm run docs:dev
```

然后在浏览器中打开 `http://localhost:5173`

### 构建静态网站

```bash
pnpm run docs:build
```

生成的静态文件位于 `docs/.vitepress/dist/`

## ✍️ 写文章

### 创建新文章

在 `docs/articles/` 目录下创建新的 Markdown 文件，例如 `my-first-article.md`：

```markdown
---
title: 我的第一篇文章
description: 这是我的第一篇关于省钱的文章
date: 2024-05-15
tags: [省钱, 理财]
categories: [理财知识]
---

# 我的第一篇文章

这是文章的内容...

## 小标题

更多内容...
```

### 前置元数据说明

| 字段 | 说明 | 示例 |
|------|------|------|
| `title` | 文章标题 | "如何制定预算" |
| `description` | 文章描述（SEO用） | "学习如何制定个人预算" |
| `date` | 发布日期 | "2024-05-15" |
| `tags` | 文章标签（数组） | `[省钱, 理财]` |
| `categories` | 文章分类（数组） | `[理财知识]` |

### Markdown 语法

```markdown
# 一级标题
## 二级标题
### 三级标题

**粗体文本**
*斜体文本*
~~删除线~~

- 列表项 1
- 列表项 2

1. 有序项 1
2. 有序项 2

> 引用文本

[链接文本](https://example.com)

![图片描述](https://images.yourdomain.com/image.jpg)

`代码`

\`\`\`python
def hello():
    print("Hello, World!")
\`\`\`
```

## 🖼️ 上传图片

### 使用 PicList 上传到 R2

1. 打开 PicList
2. 选择图片文件
3. 点击上传
4. 复制生成的 URL
5. 在 Markdown 中使用：

```markdown
![图片描述](https://images.yourdomain.com/image-name.jpg)
```

## 🌐 部署到 Cloudflare Pages

### 第一次部署

1. 推送代码到 GitHub
2. 在 Cloudflare 中连接 GitHub
3. 配置构建设置
4. 等待自动部署完成

### 后续更新

只需提交代码到 GitHub，Cloudflare 会自动构建并部署：

```bash
git add .
git commit -m "Add new article"
git push
```

## 📝 编辑现有页面

### 编辑首页

编辑 `docs/index.md` 文件

### 编辑关于页面

编辑 `docs/about.md` 文件

### 编辑导航菜单

编辑 `docs/.vitepress/config.ts` 中的 `nav` 配置

## 🎨 自定义样式

### 修改颜色

编辑 `docs/.vitepress/theme/style.css` 中的 CSS 变量：

```css
:root {
  --vp-c-bg: #FFF8F3;           /* 背景色 */
  --vp-c-text-1: #1F1F1F;       /* 文字色 */
  --vp-c-brand: #D4A574;        /* 品牌色 */
}
```

### 修改字体

在 `docs/.vitepress/config.ts` 中修改 Google Fonts 链接

## 📊 文章统计

所有文章会自动统计以下信息：
- 发布日期
- 阅读时间
- 字数统计
- 标签和分类

## 🔍 SEO 优化

每篇文章的前置元数据会自动生成 meta 标签：
- `title` → 页面标题
- `description` → meta description
- `date` → 发布日期
- `tags` → 关键词

## 🆘 常见问题

### Q: 如何修改博客标题？

A: 编辑 `docs/.vitepress/config.ts`，修改 `title` 字段。

### Q: 如何添加新的导航菜单项？

A: 编辑 `docs/.vitepress/config.ts`，在 `nav` 数组中添加新项：

```typescript
nav: [
  { text: '首页', link: '/' },
  { text: '新菜单', link: '/new-page' },
]
```

### Q: 如何删除文章？

A: 直接删除对应的 Markdown 文件，然后提交到 GitHub。

### Q: 如何修改文章发布日期？

A: 编辑文章的前置元数据中的 `date` 字段。

### Q: 图片加载很慢怎么办？

A: 确保使用了 Cloudflare R2 的自定义域名，并且图片已优化。

## 📚 更多资源

- [完整部署指南](./DEPLOYMENT.md)
- [项目 README](./README.md)
- [VitePress 官方文档](https://vitepress.dev)
- [Markdown 语法指南](https://markdown.com.cn/)

## 💡 提示

- 定期备份你的代码（使用 Git）
- 使用有意义的提交信息
- 在发布前本地预览文章
- 定期检查链接是否有效

---

**现在就开始写你的第一篇文章吧！** ✍️
