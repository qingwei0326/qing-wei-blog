import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '省钱达人',
  description: '智慧生活，精明消费 - 分享实用的省钱技巧、理财心得与消费智慧',
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
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: '省钱达人',
    
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/articles/' },
      { text: '关于', link: '/about' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com' },
    ],

    footer: {
      message: '基于 VitePress 搭建',
      copyright: 'Copyright © 2024-present 省钱达人'
    },

    search: {
      provider: 'local'
    }
  },

  vite: {
    ssr: {
      noExternal: ['element-plus']
    }
  }
})
