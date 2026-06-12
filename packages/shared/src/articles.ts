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
}

// 使用 process.cwd() 确保在任何位置都能正确解析
const articlesDir = path.resolve(process.cwd(), 'docs/articles')

export function readAllArticles(): ArticleMeta[] {
  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith('.md'))

  return files
    .map((file) => {
      const content = fs.readFileSync(path.join(articlesDir, file), 'utf-8')
      const { data } = matter(content)
      const slug = file.replace(/\.md$/, '')

      return {
        title: data.title || '',
        description: data.description || '',
        date: data.date || '',
        tags: data.tags || [],
        categories: data.categories || [],
        cover: data.cover || '',
        slug,
        permalink: data.permalink
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getArticleBySlug(slug: string): ArticleMeta | null {
  const articles = readAllArticles()
  return articles.find((a) => a.slug === slug) || null
}
