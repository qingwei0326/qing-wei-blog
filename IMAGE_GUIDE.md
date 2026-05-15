# 图片上传和使用指南

本指南说明如何在博客中上传和使用图片。

## 📁 图片存储位置

所有博客图片都存储在：`docs/public/images/` 目录中

## 🖼️ 上传图片

### 方式 1：直接复制到文件夹（推荐）

1. 将图片文件复制到 `/home/ubuntu/money-saving-blog/docs/public/images/` 目录
2. 例如：`docs/public/images/my-photo.jpg`

### 方式 2：通过 Git 提交

```bash
# 复制图片到目录
cp /path/to/your/image.jpg /home/ubuntu/money-saving-blog/docs/public/images/

# 提交
cd /home/ubuntu/money-saving-blog
git add docs/public/images/
git commit -m "Add images"
git push
```

## 📝 在 Markdown 中使用图片

### 方式 1：本地路径（本地预览用）

```markdown
![图片描述](/images/my-photo.jpg)
```

### 方式 2：jsDelivr CDN（推荐，中国快速访问）

```markdown
![图片描述](https://cdn.jsdelivr.net/gh/qingwei0326/qing-wei-blog@main/docs/public/images/my-photo.jpg)
```

**说明：**
- `qingwei0326` - 你的 GitHub 用户名
- `qing-wei-blog` - 你的仓库名
- `main` - 分支名
- `docs/public/images/my-photo.jpg` - 图片路径

## 🚀 快速使用

### 示例：添加一篇带图片的文章

```bash
# 1. 复制图片到目录
cp ~/Downloads/my-image.png /home/ubuntu/money-saving-blog/docs/public/images/

# 2. 创建文章
cat > /home/ubuntu/money-saving-blog/docs/articles/my-article.md << 'EOF'
---
title: 我的文章
description: 这是我的文章
date: 2024-05-15
tags: [成长]
categories: [随笔]
---

# 我的文章

这是文章内容。

![文章配图](https://cdn.jsdelivr.net/gh/qingwei0326/qing-wei-blog@main/docs/public/images/my-image.png)

更多内容...
EOF

# 3. 提交并推送
cd /home/ubuntu/money-saving-blog
git add .
git commit -m "Add article with images"
git push
```

## ✅ 验证图片

### 本地预览

```bash
cd /home/ubuntu/money-saving-blog
pnpm run docs:dev
```

访问 http://localhost:5173 查看图片是否正常显示

### 在线预览

提交推送后，访问你的博客：
- 临时 URL：https://qing-wei-blog.pages.dev
- 自定义域名：https://blog.qing-wei.com（配置后）

## 🎯 图片命名建议

使用清晰的英文名称，便于管理：

```
docs/public/images/
├── article-1-cover.jpg          # 文章1的封面
├── article-1-diagram.png        # 文章1的图表
├── article-2-screenshot.png     # 文章2的截图
└── profile-avatar.jpg           # 个人头像
```

## 📊 图片优化建议

为了加快加载速度，建议：

1. **压缩图片**
   - 使用 TinyPNG（https://tinypng.com）
   - 或 ImageOptim（Mac）/ FileOptimizer（Windows）

2. **选择合适的格式**
   - 照片：JPG（质量 80-85%）
   - 图表/截图：PNG
   - 动画：GIF 或 WebP

3. **合理的尺寸**
   - 博客文章图片：宽度 800-1200px
   - 缩略图：宽度 300-400px

## 🔗 CDN 加速原理

jsDelivr 是一个免费的 CDN 服务，它会自动缓存你 GitHub 仓库中的文件，并通过全球节点加速访问。

**优点：**
- ✅ 完全免费
- ✅ 自动缓存
- ✅ 全球加速
- ✅ 中国访问快
- ✅ 无流量限制

**URL 格式：**
```
https://cdn.jsdelivr.net/gh/用户名/仓库名@分支/文件路径
```

## 🆘 常见问题

### Q: 图片不显示怎么办？

A: 检查以下几点：
1. 图片文件是否存在于 `docs/public/images/` 目录
2. 图片路径是否正确
3. 文件名是否有空格或特殊字符（建议用 `-` 代替空格）
4. 是否已提交并推送到 GitHub

### Q: 图片加载很慢怎么办？

A: 
1. 检查图片是否已压缩
2. 确认使用了 jsDelivr CDN 链接
3. 等待 CDN 缓存更新（通常 1-5 分钟）

### Q: 如何删除图片？

A: 
1. 从 `docs/public/images/` 目录删除文件
2. 提交并推送
3. 更新文章中的图片链接

### Q: 可以上传多大的图片？

A: GitHub 单个文件限制 100MB，但建议：
- 单张图片不超过 5MB
- 压缩后通常 100-500KB

## 📚 相关资源

- [jsDelivr 官网](https://www.jsdelivr.com/)
- [TinyPNG 图片压缩](https://tinypng.com)
- [Markdown 图片语法](https://markdown.com.cn/basic-syntax/images.html)

---

**现在你可以开始上传图片和写文章了！** 📸✍️
