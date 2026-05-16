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

const modules = import.meta.glob('../../../articles/*.md', {
  eager: true
}) as Record<string, { frontmatter?: ArticleFrontmatter; __pageData?: { frontmatter?: ArticleFrontmatter } }>

const toText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

const toStringArray = (value: unknown) => {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => toText(item))
    .filter((item) => item.length > 0)
}

const toDateLabel = (value: string | Date | undefined) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }

  const text = toText(value)

  if (!text) {
    return ''
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    return text.slice(0, 10)
  }

  const time = Date.parse(text)
  return Number.isNaN(time) ? text : new Date(time).toISOString().slice(0, 10)
}

export const articles = Object.entries(modules)
  .map(([path, module]) => {
    const fileName = path.split('/').pop() ?? ''
    const slug = fileName.replace(/\.md$/, '')

    if (!slug || slug === 'index') {
      return null
    }

    const frontmatter = module.frontmatter ?? module.__pageData?.frontmatter ?? {}
    const title = toText(frontmatter.title) || slug
    const description = toText(frontmatter.description)
    const date = toDateLabel(frontmatter.date)
    const tags = toStringArray(frontmatter.tags)
    const categories = toStringArray(frontmatter.categories)
    const cover = toText(frontmatter.cover) || undefined
    const timeValue = Number.isNaN(Date.parse(date)) ? 0 : Date.parse(date)

    return {
      slug,
      title,
      description,
      date,
      tags,
      categories,
      url: `/articles/${slug}`,
      timeValue,
      cover
    } satisfies ArticleEntry
  })
  .filter((item): item is ArticleEntry => item !== null)
  .sort((a, b) => b.timeValue - a.timeValue)

export const articleTags = Array.from(
  new Set(articles.flatMap((article) => article.tags))
).slice(0, 12)

export const articleCategories = Array.from(
  new Set(articles.flatMap((article) => article.categories))
)
