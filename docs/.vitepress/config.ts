import { defineConfig } from 'vitepress'
import { defineTeekConfig } from 'vitepress-theme-teek/config'

const siteCover = '/images/%E5%8D%9A%E5%AE%A2%E5%B0%81%E9%9D%A2.png'

const teekConfig = defineTeekConfig({
  logo: '/logo.svg',
  siteTitle: '青微的博客',

  nav: [
    { text: '首页', link: '/' },
    { text: '文章', link: '/articles/' },
    { text: '关于', link: '/about' },
  ],

  socialLinks: [
    { icon: 'github', link: 'https://github.com/qingwei0326/qing-wei-blog' },
  ],

  footer: {
    message: '基于 VitePress + Teek 搭建',
    copyright: 'Copyright © 2024-2026 青微'
  },

  search: {
    provider: 'local'
  },

  author: {
    name: '青微'
  },

  blogger: {
    name: '青微',
    avatar: '/logo.svg',
    slogan: '记录技术、生活与折腾'
  },

  /* ===== 全站背景图 ===== */
  bodyBgImg: {
    imgSrc: '/images/博客封面.png',
    imgOpacity: 0.3,      // 背景透明度 0.1 ~ 1
    mask: true,           // 加遮罩让内容可读
    maskBg: 'rgba(0, 0, 0, 0.15)',
  },

  /* ===== 评论系统 (Giscus) ===== */
  // 使用步骤：
  // 1. 去 https://github.com/qingwei0326/qing-wei-blog/settings 开启 Discussions
  // 2. 安装 Giscus App: https://github.com/apps/giscus
  // 3. 去 https://giscus.app/zh-CN 填入仓库信息获取 repoId / categoryId
  comment: {
    provider: 'giscus',
    options: {
      repo: 'qingwei0326/qing-wei-blog',
      repoId: 'R_kgDOxxxxxx',        // TODO: 替换为你的 repoId
      category: 'Announcements',      // 或 General
      categoryId: 'DIC_kwDOxxxxxx',   // TODO: 替换为你的 categoryId
      mapping: 'pathname',
      strict: '0',
      reactionsEnabled: '1',
      inputPosition: 'bottom',
      lang: 'zh-CN',
      theme: 'preferred_color_scheme',
      loading: 'lazy',
    },
  },

  /* ===== 统计分析 ===== */
  siteAnalytics: [
    // 百度统计 — 去 https://tongji.baidu.com/ 创建站点获取 ID
    // { provider: 'baidu', options: { id: '你的百度统计ID' } },
    // Google Analytics — 去 https://analytics.google.com/ 获取测量 ID
    // { provider: 'google', options: { id: 'G-XXXXXXXXXX' } },
  ],
})

export default defineConfig({
  extends: teekConfig,
  title: '青微的博客',
  description: '青微的个人博客，记录技术、生活与折腾',
  lang: 'zh-CN',
  appearance: true,
  ignoreDeadLinks: true,

  head: [
    ['meta', { charset: 'UTF-8' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { name: 'theme-color', content: '#F7F9FC' }],
    ['meta', { property: 'og:image', content: siteCover }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: siteCover }],
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ]
})
