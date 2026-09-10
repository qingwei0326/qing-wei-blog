// 文章元数据由 config.ts 的 article-metadata 插件在构建期序列化注入，
// 避免 node:fs / gray-matter 进入浏览器端 bundle
import { articleMetadata } from 'virtual:article-metadata'
import type { ArticleMeta } from '../../../../packages/shared/src/articles'

export const articles: ArticleMeta[] = articleMetadata

export const articleTags = [...new Set(articles.flatMap((a) => a.tags))].sort()

const categoryOrder = ['算账省钱', '消费实战', '工具效率', '个人复盘']
const detectedCategories = [...new Set(articles.flatMap((a) => a.categories))]

export const articleCategories = [
  ...categoryOrder.filter((category) => detectedCategories.includes(category)),
  ...detectedCategories.filter((category) => !categoryOrder.includes(category)).sort()
]
