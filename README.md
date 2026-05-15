# 省钱达人博客

一个基于 VitePress + Cloudflare 的高端杂志风格个人博客，分享实用的省钱技巧、理财心得与消费智慧。

## 🎯 项目特点

- **高端杂志风格**：采用精致的编辑美学设计，极简奶油色背景，高对比度排版
- **轻量级架构**：基于 VitePress 静态生成，性能优秀
- **完全免费**：Cloudflare Pages 免费托管，R2 免费图床
- **中国大陆可访问**：无需备案，通过 Cloudflare CDN 加速
- **图片永久存储**：使用 Cloudflare R2 对象存储，图片永不丢失
- **响应式设计**：完美支持桌面、平板、移动设备
- **SEO 友好**：完整的元数据支持，利于搜索引擎收录

## 📁 项目结构

```
money-saving-blog/
├── docs/                          # 文档根目录
│   ├── .vitepress/               # VitePress 配置
│   │   ├── config.ts             # 站点配置
│   │   └── theme/                # 主题文件
│   │       ├── index.ts          # 主题入口
│   │       └── style.css         # 全局样式
│   ├── index.md                  # 首页
│   ├── about.md                  # 关于页面
│   ├── articles/                 # 文章目录
│   │   ├── index.md              # 文章列表
│   │   └── beginner-guide.md     # 示例文章
│   ├── categories/               # 分类页面
│   └── tags/                     # 标签页面
├── package.json                  # 项目配置
├── .gitignore                    # Git 忽略配置
└── README.md                     # 项目说明
```

## 🚀 快速开始

### 1. 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run docs:dev

# 访问 http://localhost:5173
```

### 2. 构建生产版本

```bash
# 构建静态文件
pnpm run docs:build

# 预览构建结果
pnpm run docs:preview
```

## 📝 如何写文章

### 创建新文章

在 `docs/articles/` 目录下创建新的 Markdown 文件：

```markdown
---
title: 文章标题
description: 文章描述
date: 2024-05-15
tags: [标签1, 标签2]
categories: [分类1]
---

# 文章标题

文章内容...
```

### 前置元数据说明

- `title`：文章标题
- `description`：文章描述（用于 SEO）
- `date`：发布日期（格式：YYYY-MM-DD）
- `tags`：文章标签（数组）
- `categories`：文章分类（数组）

## 🖼️ 图片管理

### 使用 Cloudflare R2 存储图片

1. **登录 Cloudflare 控制面板**
   - 访问 https://dash.cloudflare.com
   - 进入 R2 存储服务

2. **创建 R2 存储桶**
   - 创建新的 R2 存储桶（如 `blog-images`）
   - 配置自定义域名（如 `images.yourdomain.com`）

3. **使用 PicList 管理图片**
   - 下载 PicList：https://piclist.cn
   - 配置 AWS S3（使用 R2 兼容接口）
   - 上传图片到 R2

4. **在文章中使用图片**

```markdown
![图片描述](https://images.yourdomain.com/image-name.jpg)
```

## 🌐 部署到 Cloudflare Pages

### 1. 推送代码到 GitHub

```bash
git add .
git commit -m "Initial commit"
git push -u origin main
```

### 2. 连接 Cloudflare Pages

1. 登录 Cloudflare 控制面板
2. 进入 Pages 服务
3. 选择 "连接到 Git"
4. 授权 GitHub 账户
5. 选择 `money-saving-blog` 仓库

### 3. 配置构建设置

- **框架预设**：VitePress
- **构建命令**：`pnpm run docs:build`
- **构建输出目录**：`docs/.vitepress/dist`

### 4. 配置自定义域名

1. 在 Cloudflare 中添加你的域名
2. 修改域名的 DNS 服务器为 Cloudflare 的 DNS
3. 在 Pages 项目中配置自定义域名

## 🎨 自定义样式

所有样式定义在 `docs/.vitepress/theme/style.css` 中。

### 修改色彩系统

编辑 CSS 变量：

```css
:root {
  /* 背景色 */
  --vp-c-bg: #FFF8F3;
  
  /* 文字色 */
  --vp-c-text-1: #1F1F1F;
  
  /* 品牌色 */
  --vp-c-brand: #D4A574;
}
```

### 修改字体

在 `docs/.vitepress/config.ts` 中修改 Google Fonts 链接。

## 📊 SEO 优化

### 配置 Open Graph

在文章前置元数据中添加：

```markdown
---
title: 文章标题
description: 文章描述
og:
  image: https://images.yourdomain.com/og-image.jpg
---
```

### 生成 Sitemap

VitePress 会自动生成 `sitemap.xml`，位于 `docs/.vitepress/dist/sitemap.xml`

## 🔧 常见问题

### Q: 如何添加评论功能？

A: 可以集成 Giscus（基于 GitHub Discussions）或 Twikoo。参考 VitePress 官方文档。

### Q: 如何添加搜索功能？

A: VitePress 内置本地搜索。可以集成 DocSearch 获得更强大的搜索体验。

### Q: 如何加快国内访问速度？

A: 使用 Cloudflare 的国内节点，或配置 CDN 加速。

## 📚 相关资源

- [VitePress 官方文档](https://vitepress.dev)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages)
- [Cloudflare R2 文档](https://developers.cloudflare.com/r2)
- [PicList 文档](https://piclist.cn)

## 📄 许可证

MIT License - 详见 LICENSE 文件

## 💬 反馈与建议

如有任何问题或建议，欢迎提交 Issue 或 Pull Request。

---

**开始你的理财之旅吧！** 🚀
