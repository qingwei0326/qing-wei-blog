import { defineConfig } from 'vitepress'
import { defineTeekConfig } from 'vitepress-theme-teek/config'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const siteCover = '/images/%E5%8D%9A%E5%AE%A2%E5%B0%81%E9%9D%A2.png'
const teekIndexCss = require.resolve('vitepress-theme-teek/index.css')
const teekIndexCssVirtualId = 'virtual:teek-index.css'
const teekIconfontPattern =
  /@font-face\{font-family:iconfont;src:url\(iconfont\.woff2\?t=\d+\) format\("woff2"\),url\(iconfont\.woff\?t=\d+\) format\("woff"\),url\(iconfont\.ttf\?t=\d+\) format\("truetype"\)\}/g

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
    avatar: '/images/avatar.jpg',
    slogan: '记录技术、生活与折腾',
    shape: 'circle',
    circleSize: 110,
  },

  backTop: {
    enabled: true,
    content: 'progress',
  },

  articleShare: {
    enabled: true,
  },

  codeBlock: {
    overlay: true,
  },

  docAnalysis: {
    wordCount: true,
    readingTime: true,
    statistics: {
      provider: 'busuanzi',
    },
  },

  comment: {
    provider: 'giscus',
    options: {
      repo: 'qingwei0326/qing-wei-blog',
      repoId: 'R_kgDOSeN0RQ',
      category: 'Announcements',
      categoryId: 'DIC_kwDOSeN0Rc4C9q2D',
      mapping: 'pathname',
      reactionsEnabled: '1',
      inputPosition: 'top',
      lang: 'zh-CN',
      theme: 'preferred_color_scheme',
      useOnline: true,
    },
  },
})

export default defineConfig({
  extends: teekConfig,
  title: '青微的博客',
  description: '青微的个人博客，记录技术、生活与折腾',
  lang: 'zh-CN',
  appearance: true,
  ignoreDeadLinks: false,

  vite: {
    plugins: [
      {
        name: 'strip-missing-teek-iconfont',
        enforce: 'pre',
        resolveId(id) {
          return id === teekIndexCssVirtualId ? id : null
        },
        load(id) {
          if (id !== teekIndexCssVirtualId) {
            return null
          }

          return readFileSync(teekIndexCss, 'utf8').replace(teekIconfontPattern, '')
        }
      }
    ]
  },

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
