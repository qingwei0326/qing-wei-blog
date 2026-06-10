import { articleMetadata } from 'virtual:article-metadata'

export type ArticleFrontmatter = {
  title?: string
  description?: string
  date?: string | Date
  tags?: string[]
  categories?: string[]
  cover?: string
}

export type ArticleEntry = {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  categories: string[]
  url: string
  timeValue: number
  cover?: string
}

export const articles = articleMetadata satisfies ArticleEntry[]

const tagFrequency = articles.reduce<Map<string, number>>((acc, article) => {
  for (const tag of article.tags) {
    acc.set(tag, (acc.get(tag) ?? 0) + 1)
  }
  return acc
}, new Map())

export const articleTags = Array.from(tagFrequency.entries())
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh'))
  .slice(0, 12)
  .map(([tag]) => tag)

export const articleCategories = Array.from(
  new Set(articles.flatMap((article) => article.categories))
)
