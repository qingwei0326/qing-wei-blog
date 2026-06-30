import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export interface ArticleMeta {
  title: string
  description: string
  date: string
  tags: string[]
  categories: string[]
  cover: string
  slug: string
  permalink?: string
  url: string
  timeValue: number
}

// 注意：依赖从仓库根目录运行（pnpm docs:dev / docs:build 均满足）
const articlesDir = path.resolve(process.cwd(), 'docs/articles')

// gray-matter 会把 YAML 日期解析成 Date 对象，统一规范化为 YYYY-MM-DD
function toDateLabel(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }

  const text = typeof value === 'string' ? value.trim() : ''

  if (!text) {
    return ''
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    return text.slice(0, 10)
  }

  const time = Date.parse(text)
  return Number.isNaN(time) ? text : new Date(time).toISOString().slice(0, 10)
}

function normalizePermalink(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined

  const trimmed = value.trim()
  if (!trimmed || !trimmed.startsWith('/') || !trimmed.endsWith('/')) {
    return undefined
  }

  return trimmed
}

function articleUrlFor(slug: string, permalink: unknown): string {
  return normalizePermalink(permalink) ?? `/articles/${slug}/`
}

export function readAllArticles(): ArticleMeta[] {
  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith('.md') && f !== 'index.md')

  return files
    .map((file) => {
      const content = fs.readFileSync(path.join(articlesDir, file), 'utf-8')
      const { data } = matter(content)
      const slug = file.replace(/\.md$/, '')

      const date = toDateLabel(data.date)
      const timeValue = Number.isNaN(Date.parse(date)) ? 0 : Date.parse(date)
      const permalink = normalizePermalink(data.permalink)

      return {
        title: data.title || '',
        description: data.description || '',
        date,
        tags: data.tags || [],
        categories: data.categories || [],
        cover: data.cover || '',
        slug,
        permalink,
        url: articleUrlFor(slug, permalink),
        timeValue
      }
    })
    .sort((a, b) => b.timeValue - a.timeValue)
}

export function getArticleBySlug(slug: string): ArticleMeta | null {
  const articles = readAllArticles()
  return articles.find((a) => a.slug === slug) || null
}
