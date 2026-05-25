import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import matter from 'gray-matter'

const root = process.cwd()
const docsDir = join(root, 'docs')
const articlesDir = join(docsDir, 'articles')
const publicDir = join(docsDir, 'public')
const requiredFields = ['title', 'description', 'date', 'tags', 'categories', 'cover']
const allowedImageExts = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'])
const errors = []
const warnings = []

const toPosix = (value) => value.replace(/\\/g, '/')

const readArticleFiles = () =>
  readdirSync(articlesDir)
    .filter((file) => file.endsWith('.md') && file !== 'index.md')
    .sort()

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0

const checkArray = (value, field, file) => {
  if (!Array.isArray(value) || value.length === 0) {
    errors.push(`${file}: frontmatter.${field} must be a non-empty array`)
    return []
  }

  const clean = value.filter(isNonEmptyString)
  if (clean.length !== value.length) {
    errors.push(`${file}: frontmatter.${field} contains empty or non-string values`)
  }
  return clean
}

const checkLocalAsset = (assetPath, file, field) => {
  if (!isNonEmptyString(assetPath) || /^(https?:)?\/\//.test(assetPath)) {
    return
  }

  if (!assetPath.startsWith('/')) {
    errors.push(`${file}: frontmatter.${field} should use an absolute public path`)
    return
  }

  const resolved = join(publicDir, assetPath)
  if (!existsSync(resolved)) {
    errors.push(`${file}: ${field} target does not exist: ${assetPath}`)
  }
}

const checkMarkdownImages = (content, file) => {
  const contentWithoutCode = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '')
    .replace(/`[^`\n]*`/g, '')
  const imagePattern = /!\[[^\]]*]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g
  for (const match of contentWithoutCode.matchAll(imagePattern)) {
    const src = match[1]
    if (/^(https?:)?\/\//.test(src) || src.startsWith('#')) {
      continue
    }

    if (!src.startsWith('/')) {
      warnings.push(`${file}: image should use an absolute public path: ${src}`)
      continue
    }

    const pathWithoutHash = src.split('#')[0].split('?')[0]
    const ext = extname(pathWithoutHash).toLowerCase()
    if (!allowedImageExts.has(ext)) {
      warnings.push(`${file}: image has an unusual extension: ${src}`)
    }

    const resolved = join(publicDir, pathWithoutHash)
    if (!existsSync(resolved)) {
      errors.push(`${file}: image target does not exist: ${src}`)
    }
  }
}

const checkDate = (value, file) => {
  if (!isNonEmptyString(value) && !(value instanceof Date)) {
    errors.push(`${file}: frontmatter.date must be set`)
    return
  }

  const label = value instanceof Date ? value.toISOString().slice(0, 10) : value
  if (!/^\d{4}-\d{2}-\d{2}$/.test(label)) {
    errors.push(`${file}: frontmatter.date should use YYYY-MM-DD`)
    return
  }

  const parsed = new Date(`${label}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime())) {
    errors.push(`${file}: frontmatter.date is invalid`)
  }
}

const permalinkMap = new Map()
let articleCount = 0

for (const name of readArticleFiles()) {
  articleCount += 1
  const fullPath = join(articlesDir, name)
  const file = toPosix(relative(root, fullPath))
  const raw = readFileSync(fullPath, 'utf8')
  const { data, content } = matter(raw)

  for (const field of requiredFields) {
    if (data[field] == null) {
      errors.push(`${file}: missing frontmatter.${field}`)
    }
  }

  if (!isNonEmptyString(data.title)) errors.push(`${file}: frontmatter.title must be a non-empty string`)
  if (!isNonEmptyString(data.description)) errors.push(`${file}: frontmatter.description must be a non-empty string`)

  checkDate(data.date, file)
  checkArray(data.tags, 'tags', file)
  checkArray(data.categories, 'categories', file)
  checkLocalAsset(data.cover, file, 'cover')

  if (data.permalink != null) {
    if (!isNonEmptyString(data.permalink) || !data.permalink.startsWith('/') || !data.permalink.endsWith('/')) {
      errors.push(`${file}: frontmatter.permalink should start and end with /`)
    } else if (permalinkMap.has(data.permalink)) {
      errors.push(`${file}: duplicate permalink with ${permalinkMap.get(data.permalink)}: ${data.permalink}`)
    } else {
      permalinkMap.set(data.permalink, file)
    }
  }

  checkMarkdownImages(content, file)
}

for (const message of warnings) {
  console.warn(`warn  ${message}`)
}

if (errors.length > 0) {
  for (const message of errors) {
    console.error(`error ${message}`)
  }
  process.exit(1)
}

console.log(`Validated ${articleCount} blog articles.`)
