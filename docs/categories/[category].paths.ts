import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import matter from 'gray-matter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default {
  paths() {
    const articlesDir = resolve(__dirname, '../articles')
    const files = readdirSync(articlesDir).filter(
      (f) => f.endsWith('.md') && f !== 'index.md'
    )

    const categories = new Set<string>()
    for (const file of files) {
      const raw = readFileSync(resolve(articlesDir, file), 'utf-8')
      const { data } = matter(raw)
      const cats = (data.categories as string[]) || []
      for (const c of cats) {
        if (c) categories.add(c)
      }
    }

    return Array.from(categories).map((category) => ({
      params: { category }
    }))
  }
}
