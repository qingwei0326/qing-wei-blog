import { defineConfig } from 'vitepress'
import { defineTeekConfig } from 'vitepress-theme-teek/config'

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
    copyright: 'Copyright © 2024-present 青微'
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
  }
})

export default defineConfig({
  extends: teekConfig,
  title: '青微的博客',
  description: '青微的个人博客，记录技术、生活与折腾',
  lang: 'zh-CN',
  ignoreDeadLinks: true,

  head: [
    ['meta', { charset: 'UTF-8' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { name: 'theme-color', content: '#FFF8F3' }],
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Lora:wght@400;500;600;700&family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap', rel: 'stylesheet' }],
  ]
})
