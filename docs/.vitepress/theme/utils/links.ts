import { withBase } from 'vitepress'

export function siteLink(path: string): string {
  return withBase(path)
}

export function articleHref(url: string): string {
  return withBase(url)
}

export function articleFilterHref(filters: { category?: string; tag?: string }): string {
  const params = new URLSearchParams()

  if (filters.category) params.set('category', filters.category)
  if (filters.tag) params.set('tag', filters.tag)

  const query = params.toString()
  return withBase(query ? `/articles/?${query}` : '/articles/')
}

export function categoryHref(category: string): string {
  return withBase(`/categories/${encodeURIComponent(category)}`)
}
