import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'

const root = process.cwd()
const distDir = resolve(root, 'docs/.vitepress/dist')
const errors = []

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })
}

function stripUrlParts(href) {
  return href.split('#')[0].split('?')[0]
}

function isIgnoredHref(href) {
  return (
    !href ||
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    /^[a-z][a-z0-9+.-]*:\/\//i.test(href) ||
    href.startsWith('//')
  )
}

function candidatePaths(currentFile, href) {
  const clean = decodeURI(stripUrlParts(href))
  if (!clean) return []

  const base = clean.startsWith('/')
    ? join(distDir, clean.slice(1))
    : join(dirname(currentFile), clean)

  if (extname(base)) return [base]

  const trimmedBase = base.replace(/[\\/]+$/, '')

  return Array.from(
    new Set([
      base,
      `${base}.html`,
      join(base, 'index.html'),
      trimmedBase,
      `${trimmedBase}.html`,
      join(trimmedBase, 'index.html')
    ])
  )
}

if (!existsSync(distDir)) {
  console.error('error docs/.vitepress/dist does not exist. Run pnpm run docs:build first.')
  process.exit(1)
}

const htmlFiles = walk(distDir).filter((file) => file.endsWith('.html'))
const hrefPattern = /\shref="([^"]+)"/g

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8')
  for (const match of html.matchAll(hrefPattern)) {
    const href = match[1]
    if (isIgnoredHref(href)) continue

    const candidates = candidatePaths(file, href)
    if (!candidates.some((target) => existsSync(target))) {
      errors.push(`${file}: missing local href target ${href}`)
    }
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(`error ${error}`)
  process.exit(1)
}

console.log(`Validated local links in ${htmlFiles.length} built HTML files.`)
