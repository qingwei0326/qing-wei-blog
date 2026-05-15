# 一键部署指南

这个指南会帮助你快速完成所有部署步骤。

## 📋 前置准备

在开始之前，请确保你有：

- ✅ GitHub 账户（用户名：qingwei0326）
- ✅ Cloudflare 账户（邮箱：1.2983151052@qq.com）
- ✅ 域名 qing-wei.com（已在 Cloudflare 购买）
- ✅ 本地已安装 Git 和 Node.js

## 🚀 快速部署（5 个步骤）

### 步骤 1：推送代码到 GitHub（5 分钟）

**在本地终端执行：**

```bash
cd /home/ubuntu/money-saving-blog

# 配置 Git
git config user.email "1.2983151052@qq.com"
git config user.name "qingwei0326"

# 添加远程仓库
git remote add origin https://github.com/qingwei0326/money-saving-blog.git

# 推送代码
git branch -M main
git push -u origin main
```

**验证：** 访问 https://github.com/qingwei0326/money-saving-blog 确认代码已上传

---

### 步骤 2：配置 Cloudflare Pages（10 分钟）

1. 登录 Cloudflare：https://dash.cloudflare.com
2. 进入 **Pages** → **连接到 Git**
3. 选择 GitHub，授权并选择 `money-saving-blog` 仓库
4. 配置构建设置：
   - 框架预设：**VitePress**
   - 构建命令：`pnpm install && pnpm run docs:build`
   - 构建输出目录：`docs/.vitepress/dist`
   - Node.js 版本：**22.x**
5. 点击 **保存并部署**
6. 等待部署完成（2-5 分钟）

**验证：** 访问临时 URL（如 `money-saving-blog.pages.dev`）确认网站正常

---

### 步骤 3：绑定自定义域名（5 分钟）

1. 在 Pages 项目中找到 **自定义域名**
2. 点击 **设置自定义域名**
3. 输入：`blog.qing-wei.com`（或 `qing-wei.com`）
4. 点击 **激活**

**验证：** 等待 DNS 生效（5-30 分钟），访问 https://blog.qing-wei.com 确认

---

### 步骤 4：配置 R2 图床（15 分钟）

**4.1 创建存储桶**
1. Cloudflare 控制面板 → **R2**
2. **创建存储桶** → 名称：`blog-images`
3. 地区：`Asia Pacific (Tokyo)` 或 `Singapore`
4. 创建

**4.2 配置自定义域名**
1. 进入 `blog-images` 存储桶
2. **自定义域名** → **连接域名**
3. 输入：`images.qing-wei.com`
4. 连接

**4.3 创建 API 令牌**
1. Cloudflare 控制面板 → **账户设置** → **API 令牌**
2. **创建令牌** → 选择 **R2 编辑** 模板
3. 配置权限和资源，创建
4. **复制并保存** 这个令牌

**4.4 获取账户 ID**
1. Cloudflare 控制面板右下角找到 **账户 ID**
2. 复制并保存

---

### 步骤 5：配置 GitHub Actions 自动部署（5 分钟）

**5.1 在 GitHub 中添加 Secrets**

1. 进入 GitHub 仓库 → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**

**添加第一个 Secret：**
- 名称：`CLOUDFLARE_API_TOKEN`
- 值：你的 Cloudflare API 令牌

**添加第二个 Secret：**
- 名称：`CLOUDFLARE_ACCOUNT_ID`
- 值：你的 Cloudflare 账户 ID

**5.2 验证自动部署**

1. 修改一个文件（如 `docs/about.md`）
2. 提交推送：
   ```bash
   git add .
   git commit -m "Test auto deploy"
   git push
   ```
3. 进入 GitHub **Actions** 查看部署流程
4. 部署完成后，访问网站确认更新

---

## 📝 开始写文章

### 创建新文章

```bash
# 创建新文章
cat > /home/ubuntu/money-saving-blog/docs/articles/my-first-article.md << 'EOF'
---
title: 我的第一篇文章
description: 这是我的第一篇省钱技巧文章
date: 2024-05-15
tags: [省钱, 理财]
categories: [理财知识]
---

# 我的第一篇文章

欢迎来到我的博客！这是我的第一篇文章。

## 小标题

更多内容...
EOF

# 提交并推送
cd /home/ubuntu/money-saving-blog
git add .
git commit -m "Add first article"
git push
```

### 上传图片

1. 下载并安装 PicList：https://piclist.cn
2. 在 PicList 中配置 AWS S3（R2 兼容）：
   - Access Key ID：从 R2 API 令牌中复制
   - Secret Access Key：从 R2 API 令牌中复制
   - Bucket：`blog-images`
   - Region：`auto`
   - Endpoint：`https://<account-id>.r2.cloudflarestorage.com`
   - Custom Domain：`https://images.qing-wei.com`
3. 上传图片，复制 URL
4. 在 Markdown 中使用：`![描述](https://images.qing-wei.com/image.jpg)`

---

## ✅ 完成清单

按照以下顺序完成：

- [ ] **步骤 1** - 推送代码到 GitHub
- [ ] **步骤 2** - 配置 Cloudflare Pages
- [ ] **步骤 3** - 绑定自定义域名
- [ ] **步骤 4** - 配置 R2 图床
- [ ] **步骤 5** - 配置 GitHub Actions
- [ ] **写第一篇文章**
- [ ] **测试图片上传**
- [ ] **验证网站正常访问**

---

## 🆘 常见问题

### 推送代码时出错

**问题：** `fatal: 'origin' does not appear to be a 'git' repository`

**解决：**
```bash
git remote remove origin
git remote add origin https://github.com/qingwei0326/money-saving-blog.git
git push -u origin main
```

### Pages 部署失败

**检查步骤：**
1. 进入 GitHub **Actions** 查看错误日志
2. 常见原因：
   - 构建命令错误
   - Node.js 版本不匹配
   - 依赖安装失败

### 域名无法访问

**检查步骤：**
1. 确认 DNS 已生效（可能需要 5-30 分钟）
2. 检查 Cloudflare 中的 DNS 记录
3. 尝试清除浏览器缓存

### 图片上传失败

**检查步骤：**
1. 确认 R2 API 令牌正确
2. 确认 Endpoint URL 包含正确的账户 ID
3. 确认存储桶名称正确
4. 确认自定义域名已配置

---

## 📚 更多帮助

- [完整部署步骤](./DEPLOY_STEPS.md)
- [快速开始指南](./QUICKSTART.md)
- [项目 README](./README.md)

---

**现在就开始部署吧！** 🚀
