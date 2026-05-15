# 🚀 快速开始指南

欢迎！这是你的个人博客。现在就可以开始写文章了！

## 📝 第一步：写你的第一篇文章

### 创建文章文件

在 `docs/articles/` 目录下创建一个新的 Markdown 文件。例如：

```bash
cat > /home/ubuntu/money-saving-blog/docs/articles/first-article.md << 'EOF'
---
title: 我的第一篇文章
description: 这是我的第一篇文章，记录我的成长和思考
date: 2024-05-15
tags: [成长, 思考]
categories: [随笔]
---

# 我的第一篇文章

欢迎来到我的博客！

这是我的第一篇文章。在这里，我会记录自己如何通过信息获取、独立思考与持续执行，提升认知与能力。

## 小标题

更多内容...

## 另一个小标题

继续写...
EOF
```

### 文章 Front Matter 说明

```yaml
---
title: 文章标题（必需）
description: 文章描述，用于 SEO（推荐）
date: 2024-05-15（发布日期，格式：YYYY-MM-DD）
tags: [标签1, 标签2]（可选）
categories: [分类1]（可选）
---
```

## 🖼️ 第二步：添加图片

### 上传图片

将图片文件复制到 `docs/public/images/` 目录：

```bash
cp ~/Downloads/my-image.jpg /home/ubuntu/money-saving-blog/docs/public/images/
```

### 在文章中使用图片

```markdown
![图片描述](https://cdn.jsdelivr.net/gh/qingwei0326/qing-wei-blog@main/docs/public/images/my-image.jpg)
```

**详细说明见** `IMAGE_GUIDE.md`

## 📤 第三步：发布文章

### 提交并推送到 GitHub

```bash
cd /home/ubuntu/money-saving-blog

# 查看修改
git status

# 添加所有文件
git add .

# 提交
git commit -m "Add my first article"

# 推送到 GitHub
git push
```

### 自动部署

推送后，Cloudflare Pages 会自动：
1. 拉取你的代码
2. 构建网站
3. 部署到 CDN

**等待 2-5 分钟后，访问你的博客查看更新：**
- 临时 URL：https://qing-wei-blog.pages.dev
- 自定义域名：https://blog.qing-wei.com（配置后生效）

## 🎨 Markdown 语法快速参考

```markdown
# 一级标题
## 二级标题
### 三级标题

**粗体文本**
*斜体文本*
~~删除线~~

- 列表项 1
- 列表项 2
  - 嵌套项

1. 有序项 1
2. 有序项 2

> 引用文本

[链接文本](https://example.com)

![图片描述](https://example.com/image.jpg)

`代码`

\`\`\`python
# 代码块
print("Hello World")
\`\`\`

| 表头 1 | 表头 2 |
|--------|--------|
| 内容 1 | 内容 2 |
```

## 📋 文章组织建议

### 按分类组织

```
docs/articles/
├── 成长与思考/
│   ├── article-1.md
│   └── article-2.md
├── 技能与工具/
│   ├── article-3.md
│   └── article-4.md
└── 生活随笔/
    └── article-5.md
```

### 使用 Front Matter 分类

```yaml
---
title: 文章标题
categories: [成长与思考]
tags: [思考, 成长, 执行]
---
```

## 🔧 本地预览

在发布前，可以在本地预览效果：

```bash
cd /home/ubuntu/money-saving-blog

# 安装依赖（首次需要）
pnpm install

# 启动本地服务
pnpm run docs:dev
```

然后访问 http://localhost:5173 查看你的博客。

## 📚 完整文档

- **IMAGE_GUIDE.md** - 详细的图片上传和使用指南
- **SETUP_GUIDE.md** - 部署配置指南
- **DEPLOY_STEPS.md** - 完整部署步骤
- **README.md** - 项目说明

## 🎯 常见任务

### 修改首页内容

编辑 `docs/index.md` 文件

### 修改关于页面

编辑 `docs/about.md` 文件

### 修改导航菜单

编辑 `docs/.vitepress/config.ts` 中的 `nav` 部分

### 修改网站标题

编辑 `docs/.vitepress/config.ts` 中的 `title` 部分

## 🆘 常见问题

### Q: 文章不显示怎么办？

A: 检查以下几点：
1. 文件是否在 `docs/articles/` 目录中
2. 文件是否是 `.md` 格式
3. Front Matter 格式是否正确
4. 是否已提交并推送

### Q: 图片显示不出来？

A: 见 `IMAGE_GUIDE.md` 的常见问题部分

### Q: 如何删除文章？

A: 
1. 删除 `docs/articles/` 中的文件
2. 提交并推送
3. 网站会自动更新

### Q: 如何修改已发布的文章？

A:
1. 编辑 `docs/articles/` 中的文件
2. 提交并推送
3. 网站会自动更新（通常 1-5 分钟）

## 📞 需要帮助？

查看完整文档或告诉我你遇到的问题！

---

**现在就开始写你的第一篇文章吧！** ✍️🚀
