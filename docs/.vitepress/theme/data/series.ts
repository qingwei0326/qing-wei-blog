import seriesData from './series.json'
import { articles } from './articles'
import type { ArticleMeta } from '../../../../packages/shared/src/articles'

export interface ArticleSeries {
  id: string
  title: string
  description: string
  articles: ArticleMeta[]
}

// 系列内的顺序以 series.json 为准（阅读顺序），不按日期
export const seriesList: ArticleSeries[] = seriesData
  .map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    articles: item.articles
      .map((slug) => articles.find((article) => article.slug === slug))
      .filter((article): article is ArticleMeta => Boolean(article))
  }))
  .filter((series) => series.articles.length > 0)

export function findSeriesBySlug(slug: string): { series: ArticleSeries; index: number } | null {
  for (const series of seriesList) {
    const index = series.articles.findIndex((article) => article.slug === slug)
    if (index !== -1) return { series, index }
  }
  return null
}
