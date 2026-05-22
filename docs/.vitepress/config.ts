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

  bodyBgImg: {
    imgSrc: '/images/博客封面.png',
    imgOpacity: 0.3,
    mask: true,
    maskBg: 'rgba(0, 0, 0, 0.15)',
  },
  comment: false,
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
    ['link', { rel: 'icon', href: '/logo.svg' }],
  ]
})
