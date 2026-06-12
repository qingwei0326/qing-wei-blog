import { readAllArticles } from '../../packages/shared/src/articles'

export default {
  paths() {
    const articles = readAllArticles()
    const categories = [...new Set(articles.flatMap((a) => a.categories))]

    return categories.map((category) => ({
      params: { category },
      content: ''
    }))
  }
}
