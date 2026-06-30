import { defineConfig } from 'vitepress'
import { defineTeekConfig } from 'vitepress-theme-teek/config'
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { Feed } from 'feed'
import { readAllArticles } from '../../packages/shared/src/articles'

const require = createRequire(import.meta.url)
const configDir = dirname(fileURLToPath(import.meta.url))
const docsRoot = resolve(configDir, '..')
const articlesRoot = resolve(docsRoot, 'articles')
const siteCover = '/images/og-cover.png'
const teekIndexCss = require.resolve('vitepress-theme-teek/index.css')
const teekIndexCssVirtualId = 'virtual:teek-index.css'
const articleMetadataVirtualId = 'virtual:article-metadata'
const resolvedArticleMetadataVirtualId = `\0${articleMetadataVirtualId}`
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

  vitePlugins: {
    sidebarOption: {
      ignoreList: ['categories', 'superpowers', /\.paths\.ts$/],
    },
    fileContentLoaderIgnore: ['superpowers/**', '**/superpowers/**'],
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
  srcExclude: ['**/public/**', 'superpowers/**'],

  themeConfig: {
    outline: {
      level: [2, 3],
      label: '本文目录'
    }
  },

  sitemap: {
    hostname: 'https://blog.qing-wei.com',
    transformItems: (items) => items.filter((item) => !item.url.includes('/public/')),
  },

  markdown: {
    config(md) {
      md.core.ruler.before('block', 'inject-article-extras', (state) => {
        const env = state.env as { path?: string; relativePath?: string }
        const articlePath = (env.relativePath || env.path || '').replace(/\\/g, '/')
        const isArticle =
          articlePath.includes('articles/') &&
          !articlePath.endsWith('articles/index.md')

        if (!isArticle) return

        state.src = `<ArticleSummary />\n\n${state.src}\n\n<ArticleNavigation />\n`
      })
    }
  },

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
      },
      {
        name: 'article-metadata',
        resolveId(id) {
          return id === articleMetadataVirtualId ? resolvedArticleMetadataVirtualId : null
        },
        load(id) {
          if (id !== resolvedArticleMetadataVirtualId) {
            return null
          }

          const articleFiles = readdirSync(articlesRoot)
            .filter((file) => file.endsWith('.md') && file !== 'index.md')

          for (const file of articleFiles) {
            this.addWatchFile(resolve(articlesRoot, file))
          }

          return `export const articleMetadata = ${JSON.stringify(readAllArticles())}`
        }
      }
    ]
  },

  head: [
    ['meta', { charset: 'UTF-8' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { name: 'theme-color', content: '#F7F9FC' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: '青微的博客' }],
    ['meta', { property: 'og:title', content: '青微的博客' }],
    ['meta', { property: 'og:description', content: '记录技术、生活和实际可复用的折腾结果。少一点口号，多一点能照着做的细节。' }],
    ['meta', { property: 'og:url', content: 'https://blog.qing-wei.com' }],
    ['meta', { property: 'og:image', content: `https://blog.qing-wei.com${siteCover}` }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: '青微的博客' }],
    ['meta', { name: 'twitter:description', content: '记录技术、生活和实际可复用的折腾结果。' }],
    ['meta', { name: 'twitter:image', content: `https://blog.qing-wei.com${siteCover}` }],
    ['link', { rel: 'icon', href: '/logo.svg' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: '青微的博客 RSS', href: 'https://blog.qing-wei.com/feed.xml' }],
    ['link', { rel: 'alternate', type: 'application/atom+xml', title: '青微的博客 Atom', href: 'https://blog.qing-wei.com/atom.xml' }],
  ],

  transformPageData(pageData) {
    const { frontmatter, relativePath } = pageData
    const SITE_URL = 'https://blog.qing-wei.com'

    // 只对单篇文章页注入（跳过 articles/index.md 和其他非文章页）
    const isArticle =
      relativePath.startsWith('articles/') &&
      relativePath !== 'articles/index.md'

    if (!isArticle) return

    const articleTitle = frontmatter.title || '青微的博客'
    const fullTitle = `${articleTitle} | 青微的博客`
    const description =
      frontmatter.description ||
      '记录技术、生活和实际可复用的折腾结果。'
    const coverPath = frontmatter.cover || siteCover
    const coverUrl = coverPath.startsWith('http')
      ? coverPath
      : `${SITE_URL}${coverPath}`
    const articleUrl = frontmatter.permalink
      ? `${SITE_URL}${frontmatter.permalink}`
      : `${SITE_URL}/${relativePath.replace(/\.md$/, '')}/`

    frontmatter.head ??= []
    frontmatter.head.push(
      ['link', { rel: 'canonical', href: articleUrl }],
      ['meta', { property: 'og:type', content: 'article' }],
      ['meta', { property: 'og:title', content: fullTitle }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:image', content: coverUrl }],
      ['meta', { property: 'og:url', content: articleUrl }],
      ['meta', { name: 'twitter:title', content: fullTitle }],
      ['meta', { name: 'twitter:description', content: description }],
      ['meta', { name: 'twitter:image', content: coverUrl }],
    )
  },

  async buildEnd(siteConfig) {
    const SITE_URL = 'https://blog.qing-wei.com'
    const articles = readAllArticles()

    const items = articles.map((article) => ({
      title: article.title || article.slug,
      description: article.description,
      date: article.date ? new Date(article.date) : new Date(),
      url: article.permalink
        ? `${SITE_URL}${article.permalink}`
        : `${SITE_URL}/articles/${article.slug}/`,
      cover: article.cover
        ? `${SITE_URL}${article.cover}`
        : `${SITE_URL}${siteCover}`,
      categories: article.categories
    }))

    const feed = new Feed({
      title: '青微的博客',
      description:
        '记录技术、生活和实际可复用的折腾结果。少一点口号，多一点能照着做的细节。',
      id: SITE_URL,
      link: SITE_URL,
      language: 'zh-CN',
      image: `${SITE_URL}${siteCover}`,
      favicon: `${SITE_URL}/logo.svg`,
      copyright: `Copyright © ${new Date().getFullYear()} 青微`,
      feedLinks: {
        rss: `${SITE_URL}/feed.xml`,
        atom: `${SITE_URL}/atom.xml`
      },
      author: {
        name: '青微',
        email: 'qingwei0326@gmail.com',
        link: SITE_URL
      }
    })

    items.forEach((item) => {
      feed.addItem({
        title: item.title,
        id: item.url,
        link: item.url,
        description: item.description,
        content: item.description,
        date: item.date,
        image: item.cover,
        category: item.categories.map((c) => ({ name: c }))
      })
    })

    writeFileSync(resolve(siteConfig.outDir, 'feed.xml'), feed.rss2(), 'utf-8')
    writeFileSync(resolve(siteConfig.outDir, 'atom.xml'), feed.atom1(), 'utf-8')
  }
})
