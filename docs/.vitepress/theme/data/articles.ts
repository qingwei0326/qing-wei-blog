// 文章元数据由 config.ts 的 article-metadata 插件在构建期序列化注入，
// 避免 node:fs / gray-matter 进入浏览器端 bundle
import { articleMetadata } from 'virtual:article-metadata'
import type { ArticleMeta } from '../../../../packages/shared/src/articles'

export const articles: ArticleMeta[] = articleMetadata

export const articleTags = [...new Set(articles.flatMap((a) => a.tags))].sort()

export const articleCategories = [
  ...new Set(articles.flatMap((a) => a.categories))
].sort()
