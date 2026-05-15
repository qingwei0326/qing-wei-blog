# 省钱达人博客 - 完整部署步骤

本文档为 **qingwei0326** 的个人部署指南。

**配置信息：**
- GitHub 用户名：qingwei0326
- Cloudflare 邮箱：1.2983151052@qq.com
- 域名：qing-wei.com
- 仓库名：money-saving-blog

---

## 第一步：创建 GitHub 仓库并推送代码

### 1.1 在 GitHub 上创建仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - **Repository name**：`money-saving-blog`
   - **Description**：省钱达人 - 智慧生活，精明消费
   - **Public**：选择公开
   - 其他选项保持默认
3. 点击 **Create repository**

### 1.2 推送本地代码到 GitHub

在你的本地终端执行以下命令：

```bash
cd /home/ubuntu/money-saving-blog

# 配置 Git（如果还没配置）
git config user.email "1.2983151052@qq.com"
git config user.name "qingwei0326"

# 添加远程仓库
git remote add origin https://github.com/qingwei0326/money-saving-blog.git

# 推送代码
git branch -M main
git push -u origin main
```

**注意**：第一次推送时，GitHub 会要求你输入用户名和密码（或使用 Personal Access Token）。

### 1.3 验证推送成功

访问 https://github.com/qingwei0326/money-saving-blog，确认代码已上传。

---

## 第二步：配置 Cloudflare Pages 自动部署

### 2.1 登录 Cloudflare 控制面板

1. 访问 https://dash.cloudflare.com
2. 用邮箱 `1.2983151052@qq.com` 登录

### 2.2 连接 GitHub

1. 在左侧菜单找到 **Pages**
2. 点击 **连接到 Git**
3. 选择 **GitHub**
4. 授权 Cloudflare 访问你的 GitHub 账户
5. 选择 `qingwei0326/money-saving-blog` 仓库

### 2.3 配置构建设置

在 Cloudflare Pages 的构建配置中填写：

| 设置项 | 值 |
|--------|-----|
| **框架预设** | VitePress |
| **构建命令** | `pnpm install && pnpm run docs:build` |
| **构建输出目录** | `docs/.vitepress/dist` |
| **Node.js 版本** | 22.x |

### 2.4 保存并部署

1. 点击 **保存并部署**
2. Cloudflare 会自动构建你的项目
3. 等待部署完成（通常需要 2-5 分钟）
4. 部署完成后，你会获得一个临时 URL（如 `money-saving-blog.pages.dev`）

### 2.5 验证部署

访问临时 URL，确认网站正常显示。

---

## 第三步：绑定自定义域名

### 3.1 在 Cloudflare 中添加自定义域名

1. 在 Pages 项目中，找到 **自定义域名**
2. 点击 **设置自定义域名**
3. 输入你的域名：`blog.qing-wei.com`（或 `qing-wei.com`）
4. 点击 **激活**

Cloudflare 会自动配置 DNS 记录（因为你的域名已在 Cloudflare 购买）。

### 3.2 验证域名

等待 DNS 生效（通常 5-30 分钟），然后访问：
- https://blog.qing-wei.com 或
- https://qing-wei.com

确认网站正常显示。

---

## 第四步：配置 Cloudflare R2 图床

### 4.1 创建 R2 存储桶

1. 在 Cloudflare 控制面板中找到 **R2**
2. 点击 **创建存储桶**
3. 输入存储桶名称：`blog-images`
4. 选择地区：`Asia Pacific (Tokyo)` 或 `Asia Pacific (Singapore)`
5. 点击 **创建**

### 4.2 配置自定义域名

1. 进入 `blog-images` 存储桶设置
2. 找到 **自定义域名**
3. 点击 **连接域名**
4. 输入自定义域名：`images.qing-wei.com`
5. 点击 **连接**

### 4.3 创建 API 令牌

1. 进入 Cloudflare 控制面板 → **账户设置**
2. 找到 **API 令牌**
3. 点击 **创建令牌**
4. 选择 **R2 编辑** 模板
5. 配置权限：
   - 权限：`R2 编辑`
   - 资源：`blog-images` 存储桶
6. 点击 **创建令牌**
7. **复制并保存** 这个令牌（后面会用到）

### 4.4 获取账户 ID

1. 在 Cloudflare 控制面板右下角找到 **账户 ID**
2. 复制并保存

---

## 第五步：配置 PicList 图片管理工具

### 5.1 下载 PicList

访问 https://piclist.cn 下载并安装 PicList。

### 5.2 配置 AWS S3（R2 兼容）

1. 打开 PicList
2. 进入 **图床设置** → **AWS S3**
3. 填写以下信息：

| 字段 | 值 |
|------|-----|
| **Access Key ID** | 从 R2 API 令牌中复制 |
| **Secret Access Key** | 从 R2 API 令牌中复制 |
| **Bucket** | `blog-images` |
| **Region** | `auto` |
| **Endpoint** | `https://<account-id>.r2.cloudflarestorage.com` |
| **Custom Domain** | `https://images.qing-wei.com` |
| **Path** | `/` |

### 5.3 测试上传

1. 在 PicList 中选择一张图片
2. 点击上传
3. 上传成功后，复制图片 URL
4. 在浏览器中打开 URL，确认图片可以访问

---

## 第六步：配置 GitHub Actions 自动部署

### 6.1 获取 Cloudflare 部署凭证

1. 登录 Cloudflare 控制面板
2. 进入 **账户设置** → **API 令牌**
3. 创建一个新令牌（或使用现有的）：
   - 选择 **编辑 Cloudflare Pages** 模板
   - 复制 API 令牌
4. 也复制你的 **账户 ID**

### 6.2 在 GitHub 中添加 Secrets

1. 进入 GitHub 仓库：https://github.com/qingwei0326/money-saving-blog
2. 进入 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 添加以下两个 Secret：

**Secret 1：**
- 名称：`CLOUDFLARE_API_TOKEN`
- 值：你的 Cloudflare API 令牌

**Secret 2：**
- 名称：`CLOUDFLARE_ACCOUNT_ID`
- 值：你的 Cloudflare 账户 ID

### 6.3 验证自动部署

1. 修改一个文件（例如编辑 `docs/about.md`）
2. 提交并推送到 GitHub：
   ```bash
   git add .
   git commit -m "Update content"
   git push
   ```
3. 进入 GitHub 仓库 → **Actions**
4. 查看部署流程
5. 部署完成后，访问你的网站确认更新

---

## 第七步：开始写文章

### 7.1 本地编辑

在 `docs/articles/` 目录下创建新的 Markdown 文件：

```markdown
---
title: 我的第一篇文章
description: 这是我的第一篇省钱技巧文章
date: 2024-05-15
tags: [省钱, 理财]
categories: [理财知识]
---

# 我的第一篇文章

文章内容...

## 小标题

更多内容...
```

### 7.2 上传图片

1. 使用 PicList 上传图片到 R2
2. 复制图片 URL
3. 在 Markdown 中使用：

```markdown
![图片描述](https://images.qing-wei.com/image-name.jpg)
```

### 7.3 本地预览

```bash
cd /home/ubuntu/money-saving-blog
pnpm run docs:dev
```

访问 http://localhost:5173 预览网站。

### 7.4 发布文章

```bash
git add .
git commit -m "Add new article: 我的第一篇文章"
git push
```

GitHub Actions 会自动部署，几分钟后网站会更新。

---

## 常见问题

### Q: 部署失败怎么办？

A: 检查 GitHub Actions 的错误日志：
1. 进入 GitHub 仓库 → **Actions**
2. 点击失败的工作流
3. 查看错误信息
4. 常见问题：
   - API 令牌过期或错误
   - 构建命令错误
   - Node.js 版本不匹配

### Q: 图片上传失败怎么办？

A: 检查以下几点：
- R2 API 令牌是否正确
- Endpoint URL 是否正确（包含账户 ID）
- 存储桶名称是否正确
- 自定义域名是否已配置

### Q: 如何修改文章？

A: 直接编辑 Markdown 文件，然后提交推送即可。

### Q: 如何删除文章？

A: 删除对应的 Markdown 文件，然后提交推送即可。

### Q: 如何修改网站标题或配置？

A: 编辑 `docs/.vitepress/config.ts` 文件，然后提交推送即可。

---

## 部署完成清单

- [ ] GitHub 仓库创建并推送代码
- [ ] Cloudflare Pages 连接 GitHub
- [ ] Pages 构建配置完成
- [ ] 自定义域名绑定成功
- [ ] R2 存储桶创建
- [ ] R2 自定义域名配置
- [ ] PicList 配置完成
- [ ] GitHub Secrets 添加完成
- [ ] 第一次自动部署成功
- [ ] 网站正常访问
- [ ] 中国大陆访问测试通过

---

## 下一步

1. **完成上述所有步骤**
2. **写你的第一篇文章**
3. **分享你的博客链接**
4. **持续更新内容**

---

**祝你的博客之旅顺利！** 🚀

如有任何问题，随时联系我。
