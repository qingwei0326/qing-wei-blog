import { readAllArticles } from '../../../../packages/shared/src/articles'
import type { ArticleMeta } from '../../../../packages/shared/src/articles'

export const articles: ArticleMeta[] = readAllArticles()

export const articleTags = [...new Set(articles.flatMap((a) => a.tags))].sort()

export const articleCategories = [
  ...new Set(articles.flatMap((a) => a.categories))
].sort()
