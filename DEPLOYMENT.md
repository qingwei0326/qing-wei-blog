# 部署指南

本文档详细说明如何将省钱达人博客部署到 Cloudflare Pages，并配置 Cloudflare R2 图床。

## 前置要求

- GitHub 账户
- Cloudflare 账户（免费版本即可）
- 一个自己的域名（可选，但推荐）

## 第一步：推送代码到 GitHub

### 1.1 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 创建新仓库，名称为 `money-saving-blog`
3. 选择 "Public"（公开）
4. 点击 "Create repository"

### 1.2 推送本地代码

```bash
cd /home/ubuntu/money-saving-blog

# 配置 Git
git config user.name "Your Name"
git config user.email "your.email@example.com"

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/money-saving-blog.git

# 推送代码
git add .
git commit -m "Initial commit: VitePress blog setup"
git branch -M main
git push -u origin main
```

## 第二步：配置 Cloudflare Pages

### 2.1 连接 GitHub

1. 登录 Cloudflare 控制面板：https://dash.cloudflare.com
2. 进入 "Pages" 服务
3. 点击 "连接到 Git"
4. 选择 GitHub，授权 Cloudflare 访问你的账户
5. 选择 `money-saving-blog` 仓库

### 2.2 配置构建设置

在 Cloudflare Pages 中配置以下设置：

| 设置项 | 值 |
|--------|-----|
| **框架预设** | VitePress |
| **构建命令** | `pnpm install && pnpm run docs:build` |
| **构建输出目录** | `docs/.vitepress/dist` |
| **Node.js 版本** | 22.x |

### 2.3 获取部署凭证

为了自动部署，需要获取 Cloudflare API 凭证：

1. 进入 Cloudflare 控制面板 → 账户设置
2. 找到 "API 令牌" 部分
3. 点击 "创建令牌"
4. 选择 "编辑 Cloudflare Pages" 模板
5. 复制生成的 API 令牌

### 2.4 配置 GitHub Secrets

在 GitHub 仓库中添加以下 Secrets：

1. 进入仓库 → Settings → Secrets and variables → Actions
2. 点击 "New repository secret"
3. 添加以下两个 Secret：

| 名称 | 值 |
|------|-----|
| `CLOUDFLARE_API_TOKEN` | 从 Cloudflare 获取的 API 令牌 |
| `CLOUDFLARE_ACCOUNT_ID` | 你的 Cloudflare 账户 ID（在控制面板右下角） |

## 第三步：配置 Cloudflare R2 图床

### 3.1 创建 R2 存储桶

1. 登录 Cloudflare 控制面板
2. 进入 "R2" 服务
3. 点击 "创建存储桶"
4. 输入存储桶名称（如 `blog-images`）
5. 选择地区（推荐选择离你最近的地区）
6. 点击 "创建"

### 3.2 配置自定义域名

1. 在 R2 存储桶设置中找到 "自定义域名"
2. 点击 "连接域名"
3. 输入自定义域名（如 `images.yourdomain.com`）
4. 点击 "连接"

### 3.3 创建 API 令牌

1. 进入 Cloudflare 控制面板 → 账户设置 → API 令牌
2. 点击 "创建令牌"
3. 选择 "R2 编辑" 模板
4. 配置权限和资源
5. 复制生成的令牌

### 3.4 配置 PicList

PicList 是一个图片管理工具，可以方便地上传图片到 R2。

**下载 PicList**

访问 https://piclist.cn 下载并安装 PicList。

**配置 AWS S3（R2 兼容）**

1. 打开 PicList
2. 进入 "图床设置" → "AWS S3"
3. 配置以下信息：

| 字段 | 值 |
|------|-----|
| **Access Key ID** | R2 API 令牌中的 Access Key ID |
| **Secret Access Key** | R2 API 令牌中的 Secret Access Key |
| **Bucket** | 你的存储桶名称（如 `blog-images`） |
| **Region** | `auto` |
| **Endpoint** | `https://<account-id>.r2.cloudflarestorage.com` |
| **Custom Domain** | `https://images.yourdomain.com` |
| **Path** | `/` |

**上传图片**

1. 在 PicList 中选择图片
2. 点击上传
3. 上传成功后，复制图片 URL
4. 在 Markdown 中使用：`![描述](https://images.yourdomain.com/image-name.jpg)`

## 第四步：配置自定义域名

### 4.1 添加域名到 Cloudflare

1. 登录 Cloudflare 控制面板
2. 点击 "添加站点"
3. 输入你的域名
4. 选择免费计划
5. 按照提示修改 DNS 服务器

### 4.2 在 Pages 中配置域名

1. 进入 Pages 项目
2. 进入 "自定义域名"
3. 点击 "设置自定义域名"
4. 输入你的域名（如 `blog.yourdomain.com`）
5. 点击 "激活"

## 第五步：验证部署

### 5.1 测试自动部署

1. 修改一个文章或配置文件
2. 提交并推送到 GitHub
3. 进入 GitHub 仓库 → Actions
4. 查看部署流程
5. 部署完成后，访问你的博客网址

### 5.2 测试中国大陆访问

使用中国大陆的网络环境访问你的博客，确保可以正常访问。

## 常见问题

### Q: 部署失败怎么办？

A: 检查以下几点：
- GitHub Actions 中的错误日志
- Cloudflare API 令牌是否正确
- 构建命令是否正确

### Q: 图片上传失败怎么办？

A: 检查以下几点：
- R2 API 令牌是否正确
- Endpoint URL 是否正确
- 存储桶名称是否正确

### Q: 如何加快国内访问速度？

A: Cloudflare 在国内有多个节点，通常访问速度较快。如果仍然较慢，可以：
- 使用 Cloudflare 的 Argo Tunnel 加速
- 配置 CDN 加速服务

### Q: 如何更新文章？

A: 非常简单：
1. 在本地编辑 Markdown 文件
2. 提交并推送到 GitHub
3. GitHub Actions 自动构建并部署
4. 几分钟后网站自动更新

## 下一步

- 编写更多文章
- 优化网站 SEO
- 添加评论功能（Giscus）
- 添加访问统计
- 配置邮件订阅

## 参考资源

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages)
- [Cloudflare R2 文档](https://developers.cloudflare.com/r2)
- [VitePress 官方文档](https://vitepress.dev)
- [PicList 文档](https://piclist.cn)

---

**祝你的博客之旅顺利！** 🚀
