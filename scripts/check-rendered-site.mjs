import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import matter from 'gray-matter'

const SITE_URL = 'https://blog.qing-wei.com'
const localOrigin = process.env.BLOG_CHECK_ORIGIN || 'http://127.0.0.1:4173'
const edgeCandidates = [
  process.env.EDGE_BIN,
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
].filter(Boolean)

const edgeBin = edgeCandidates.find((candidate) => existsSync(candidate))
const errors = []

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchText(pathname) {
  const response = await fetch(`${localOrigin}${pathname}`)
  if (!response.ok) {
    throw new Error(`${pathname} returned ${response.status}`)
  }
  return response.text()
}

function extractAll(text, pattern, group = 1) {
  return Array.from(text.matchAll(pattern), (match) => match[group])
}

function countOccurrences(text, needle) {
  return text.split(needle).length - 1
}

function countMatches(text, pattern) {
  return Array.from(text.matchAll(pattern)).length
}

function normalizeSlugFromHref(href) {
  return href.replace(/^\/articles\//, '').replace(/\/$/, '')
}

function readExpectedArticleOrder() {
  const articlesDir = join(process.cwd(), 'docs', 'articles')

  return readdirSync(articlesDir)
    .filter((file) => file.endsWith('.md') && file !== 'index.md')
    .map((file) => {
      const { data } = matter(readFileSync(join(articlesDir, file), 'utf8'))
      const date = data.date instanceof Date ? data.date.toISOString() : String(data.date || '')
      return {
        slug: file.replace(/\.md$/, ''),
        timeValue: Date.parse(date) || 0
      }
    })
    .sort((a, b) => {
      const dateOrder = b.timeValue - a.timeValue
      if (dateOrder !== 0) return dateOrder
      if (a.slug < b.slug) return -1
      if (a.slug > b.slug) return 1
      return 0
    })
}

function publicArticleUrl(slug) {
  return `${SITE_URL}/articles/${slug}`
}

async function checkSeoUrls() {
  const sitemap = await fetchText('/sitemap.xml')
  const feed = await fetchText('/feed.xml')
  const urls = extractAll(sitemap, /<loc>(.*?)<\/loc>/g)
  const articleUrls = urls.filter((url) => url.includes('/articles/') && !url.endsWith('/articles/'))

  for (const url of articleUrls) {
    if (!/^https:\/\/blog\.qing-wei\.com\/articles\/[^/.]+$/.test(url)) {
      errors.push(`sitemap article URL is not permalink-style: ${url}`)
    }
  }

  const slugs = articleUrls
    .map((url) => url.match(/\/articles\/([^/.]+)$/)?.[1])
    .filter(Boolean)

  if (slugs.length === 0) {
    errors.push('sitemap contains no permalink-style article URLs')
    return []
  }

  for (const slug of slugs) {
    const expected = publicArticleUrl(slug)
    if (!feed.includes(`<link>${expected}</link>`)) {
      errors.push(`feed missing expected permalink for ${slug}: ${expected}`)
    }

    const html = await fetchText(`/articles/${slug}`)
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]
    if (canonical !== expected) {
      errors.push(`canonical mismatch for ${slug}: expected ${expected}, got ${canonical || 'missing'}`)
    }
  }

  return slugs
}

function extractAnchorsByClass(html, className) {
  const anchors = []

  for (const match of html.matchAll(/<a\b([^>]*)>/g)) {
    const attributes = match[1] || ''
    const classes = attributes.match(/\bclass="([^"]*)"/)?.[1]?.split(/\s+/) || []
    if (!classes.includes(className)) continue

    const href = attributes.match(/\bhref="([^"]*)"/)?.[1]
    if (href) anchors.push({ href, attributes })
  }

  return anchors
}

function extractAnchorBlocksByClass(html, className) {
  const blocks = []

  for (const match of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
    const attributes = match[1] || ''
    const classes = attributes.match(/\bclass="([^"]*)"/)?.[1]?.split(/\s+/) || []
    if (!classes.includes(className)) continue

    const href = attributes.match(/\bhref="([^"]*)"/)?.[1]
    if (!href) continue

    const text = (match[2] || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ')
      .trim()

    blocks.push({ href, text })
  }

  return blocks
}

async function checkHomeSemantics() {
  const html = await fetchText('/')
  const forbidden = [
    'holiday-heading',
    'holiday-special',
    'spotlight-heading',
    'feature-strip',
    '近期值得看',
    '学生生活成本优化',
    '本期推荐',
    'Quick Read'
  ]

  for (const marker of forbidden) {
    if (html.includes(marker)) errors.push(`homepage still contains removed marker: ${marker}`)
  }

  if (countOccurrences(html, 'id="starthere-heading"') !== 1) {
    errors.push('homepage should contain one start-here section')
  }
  if (countOccurrences(html, 'id="latest-heading"') !== 1) {
    errors.push('homepage should contain one latest-articles section')
  }
  if (!html.includes('我是青微，记录生活里的算账、工具和折腾。')) {
    errors.push('homepage hero title is missing or has changed')
  }

  const startCards = extractAnchorsByClass(html, 'start-card')
  const expectedStart = new Set([
    '/articles/beginner-guide',
    '/articles/secondhand-phone-deal',
    '/articles/ai-verification-cost'
  ])
  if (startCards.length !== expectedStart.size) {
    errors.push(`homepage should contain ${expectedStart.size} start-here cards, got ${startCards.length}`)
  }
  for (const href of startCards.map((card) => hrefFrom(card))) {
    if (!expectedStart.has(href)) errors.push(`homepage start-here card is unexpected: ${href}`)
  }

  const heroCards = extractAnchorsByClass(html, 'hero-focus')
  const heroSlug = heroCards[0] ? normalizeSlugFromHref(heroCards[0].href) : ''
  if (heroCards.length !== 1) errors.push(`homepage should contain one latest hero article, got ${heroCards.length}`)

  const latestCards = extractAnchorsByClass(html, 'timeline-item')
  if (latestCards.length !== 5) {
    errors.push(`homepage latest section should contain five articles, got ${latestCards.length}`)
  }
  const latestHrefs = latestCards.map((card) => card.href)
  if (new Set(latestHrefs).size !== latestHrefs.length) errors.push('homepage latest section contains duplicate links')
  for (const href of latestHrefs) {
    const slug = normalizeSlugFromHref(href)
    if (slug === heroSlug || expectedStart.has(href)) {
      errors.push(`homepage latest section repeats an earlier hero/start-here article: ${href}`)
    }
  }

  const categoryRows = extractAnchorBlocksByClass(html, 'topic-row')
  const expectedCategories = new Set(['算账省钱', '消费实战', '工具效率', '个人复盘'])
  const categoryNames = new Set(categoryRows.map((row) => row.text.replace(/\d+\s*篇$/, '').trim()))
  if (categoryRows.length !== expectedCategories.size || categoryNames.size !== expectedCategories.size) {
    errors.push(`homepage should contain four content categories, got ${categoryRows.map((row) => row.text).join(' / ')}`)
  }
  for (const category of expectedCategories) {
    if (!categoryNames.has(category)) errors.push(`homepage category is missing: ${category}`)
  }
}

function hrefFrom(anchor) {
  return anchor.href
}

async function checkArticleSemantics(slugs) {
  const expectedOrder = readExpectedArticleOrder()
  const expectedSeries = JSON.parse(
    readFileSync(join(process.cwd(), 'docs', '.vitepress', 'theme', 'data', 'series.json'), 'utf8')
  )
  if (expectedOrder.length !== slugs.length) {
    errors.push(`article order source has ${expectedOrder.length} entries but sitemap has ${slugs.length}`)
  }

  for (const slug of slugs) {
    const html = await fetchText(`/articles/${slug}`)
    const summaryCount = countOccurrences(html, 'class="article-summary"')
    const navigationCount = countOccurrences(html, 'class="article-nav"')
    const articleInfoCount = countMatches(html, /class="tk-article-info(?:\s|")/g)

    if (summaryCount !== 1) errors.push(`${slug}: expected one article summary, got ${summaryCount}`)
    if (navigationCount !== 1) errors.push(`${slug}: expected one custom article navigation, got ${navigationCount}`)
    if (articleInfoCount !== 1) errors.push(`${slug}: expected one article metadata group, got ${articleInfoCount}`)

    for (const marker of [
      'summary-meta',
      'tk-article-update',
      'VPDocFooter',
      'pager-link',
      '[category]',
      '浏览量',
      'Quick Read'
    ]) {
      if (html.includes(marker)) errors.push(`${slug}: rendered page contains removed marker: ${marker}`)
    }

    if (countOccurrences(html, 'class="blog-comment"') !== 1) {
      errors.push(`${slug}: expected one comment section`)
    }
    if (!html.includes('mailto:qingwei0326@gmail.com')) {
      errors.push(`${slug}: comment section is missing the email fallback`)
    }
    if (!html.includes('评论需要 GitHub 登录')) {
      errors.push(`${slug}: comment section is missing the GitHub login note`)
    }

    const index = expectedOrder.findIndex((article) => article.slug === slug)
    if (index === -1) {
      errors.push(`${slug}: missing from expected article order`)
      continue
    }

    const prevHref = extractAnchorsByClass(html, 'prev')[0]?.href
    const nextHref = extractAnchorsByClass(html, 'next')[0]?.href
    // 系列文章按显式阅读顺序导航，其余文章保持时间顺序。
    const series = expectedSeries.find((item) => item.articles.includes(slug))
    const seriesIndex = series?.articles.indexOf(slug)
    const expectedPrev = series
      ? series.articles[seriesIndex - 1]
      : expectedOrder[index + 1]?.slug
    const expectedNext = series
      ? series.articles[seriesIndex + 1]
      : expectedOrder[index - 1]?.slug
    const actualPrev = prevHref ? normalizeSlugFromHref(prevHref) : undefined
    const actualNext = nextHref ? normalizeSlugFromHref(nextHref) : undefined

    if (actualPrev !== expectedPrev) {
      errors.push(`${slug}: previous navigation should target ${expectedPrev || 'none'}, got ${actualPrev || 'none'}`)
    }
    if (actualNext !== expectedNext) {
      errors.push(`${slug}: next navigation should target ${expectedNext || 'none'}, got ${actualNext || 'none'}`)
    }
  }
}

function cdpSend(socket, method, params = {}) {
  const id = (cdpSend.nextId = (cdpSend.nextId || 0) + 1)
  socket.send(JSON.stringify({ id, method, params }))
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      socket.removeEventListener('message', onMessage)
      reject(new Error(`${method}: browser did not respond within 15 seconds`))
    }, 15000)
    const onMessage = (event) => {
      const message = JSON.parse(event.data)
      if (message.id !== id) return
      clearTimeout(timeout)
      socket.removeEventListener('message', onMessage)
      if (message.error) reject(new Error(`${method}: ${message.error.message}`))
      else resolve(message.result)
    }
    socket.addEventListener('message', onMessage)
  })
}

async function waitForDebugger(port) {
  const endpoint = `http://127.0.0.1:${port}/json/version`
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(endpoint)
      if (response.ok) return response.json()
    } catch {
      // Retry until Edge opens the debugging socket.
    }
    await sleep(100)
  }
  throw new Error(`Edge remote debugging did not start on port ${port}`)
}

async function withCdp(pathname, width, height, callback) {
  if (!edgeBin) {
    errors.push('Edge/Chrome executable not found for mobile render checks')
    return
  }

  const port = 9300 + Math.floor(Math.random() * 400)
  const profileDir = mkdtempSync(join(tmpdir(), 'blog-render-profile-'))
  const child = spawn(edgeBin, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--hide-scrollbars',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDir}`,
    `--window-size=${width},${height}`,
    `${localOrigin}${pathname}`
  ], { stdio: 'ignore' })

  try {
    await waitForDebugger(port)
    const tabs = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json())
    const tab = tabs.find((entry) => entry.url.includes(pathname)) || tabs[0]
    if (!tab?.webSocketDebuggerUrl) throw new Error(`No debuggable tab for ${pathname}`)

    const socket = new WebSocket(tab.webSocketDebuggerUrl)
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        socket.close()
        reject(new Error(`Browser connection timed out for ${pathname} at ${width}px`))
      }, 10000)
      socket.addEventListener('open', () => {
        clearTimeout(timeout)
        resolve()
      }, { once: true })
      socket.addEventListener('error', (error) => {
        clearTimeout(timeout)
        reject(error)
      }, { once: true })
    })

    try {
      await cdpSend(socket, 'Runtime.enable')
      await cdpSend(socket, 'Page.enable')
      await cdpSend(socket, 'Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: width < 700
      })
      await cdpSend(socket, 'Page.navigate', { url: `${localOrigin}${pathname}` })
      await sleep(1800)
      await callback(socket)
    } finally {
      socket.close()
    }
  } finally {
    child.kill()
    await sleep(100)
    rmSync(profileDir, { recursive: true, force: true })
  }
}

async function checkRenderedOverflow(pathname, width, height) {
  await withCdp(pathname, width, height, async (socket) => {
    const expression = `(() => {
      const contentRoots = Array.from(
        document.querySelectorAll('main, .VPContent, .VPPage, .VPDoc, .VPHome, .home-hero, .home-board, .article-archive')
      );
      const scopedNodes = Array.from(new Set(contentRoots.flatMap((root) => Array.from(root.querySelectorAll('*')))));
      const overflowNodes = scopedNodes
        .filter((node) => {
          const rect = node.getBoundingClientRect();
          const style = getComputedStyle(node);
          if (style.display === 'none' || style.visibility === 'hidden') return false;
          if (node.closest('.visually-hidden, .VPSkipLink, .VPSidebar, .VPOutline, .VPDocAside, .outline-link, .giscus-host.is-hidden, [aria-hidden="true"]')) return false;
          if (node.matches('.header-anchor, .sle, .mle') || node.closest('.sle, .mle')) return false;
          const clipsInline = ['hidden', 'clip', 'auto', 'scroll'].includes(style.overflowX);
          const hasInlineClip = clipsInline && node.scrollWidth > node.clientWidth + 1;
          return rect.width > 0 && (rect.right > window.innerWidth + 1 || rect.left < -1 || hasInlineClip);
        })
        .slice(0, 12)
        .map((node) => {
          const rect = node.getBoundingClientRect();
          return {
            tag: node.tagName.toLowerCase(),
            className: String(node.className || '').slice(0, 120),
            text: String(node.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 120),
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
            scrollWidth: node.scrollWidth,
            clientWidth: node.clientWidth,
            overflowX: getComputedStyle(node).overflowX
          };
        });

      return {
        pathname: location.pathname,
        innerWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
        overflowNodes
      };
    })()`

    const result = await cdpSend(socket, 'Runtime.evaluate', {
      expression,
      returnByValue: true
    })
    const data = result.result.value
    if (
      data.scrollWidth > data.innerWidth + 1 ||
      data.bodyScrollWidth > data.innerWidth + 1 ||
      data.overflowNodes.length > 0
    ) {
      errors.push(
        `${pathname}: rendered overflow at ${width}px viewport, scrollWidth=${data.scrollWidth}, bodyScrollWidth=${data.bodyScrollWidth}, first offenders=${JSON.stringify(data.overflowNodes)}`
      )
    }
  })
}

async function checkArchiveFilter(pathname, expectedType, expectedValue) {
  await withCdp(pathname, 1280, 1000, async (socket) => {
    const expression = `(() => {
      const text = (node) => (node?.textContent || '').replace(/\\s+/g, ' ').trim();
      const cards = Array.from(document.querySelectorAll('.archive-card')).map((card) => ({
        category: text(card.querySelector('.archive-row span')),
        tags: Array.from(card.querySelectorAll('.tag-pill')).map(text)
      }));
      return {
        activeCategory: text(document.querySelector('.topic-list a.is-active')),
        activeTag: text(document.querySelector('.tag-cloud a.is-active')),
        cards,
        hasFilter: Boolean(document.querySelector('.archive-filter'))
      };
    })()`

    const result = await cdpSend(socket, 'Runtime.evaluate', {
      expression,
      returnByValue: true
    })
    const data = result.result.value
    const active = expectedType === 'category' ? data.activeCategory : data.activeTag

    if (active !== expectedValue || !data.hasFilter || data.cards.length === 0) {
      errors.push(`${pathname}: archive filter did not apply: ${JSON.stringify(data)}`)
      return
    }

    if (expectedType === 'category' && data.cards.some((card) => card.category !== expectedValue)) {
      errors.push(`${pathname}: category filter returned a card from another category: ${JSON.stringify(data.cards)}`)
    }
    if (expectedType === 'tag' && data.cards.some((card) => !card.tags.includes(expectedValue))) {
      errors.push(`${pathname}: tag filter returned a card without the selected tag: ${JSON.stringify(data.cards)}`)
    }
  })
}

async function main() {
  const articleSlugs = await checkSeoUrls()
  await checkHomeSemantics()
  await checkArticleSemantics(articleSlugs)

  const renderTargets = [
    ['/', 390, 1000],
    ['/', 768, 1000],
    ['/', 1280, 1000],
    ['/articles/', 390, 1100],
    ['/articles/', 768, 1100],
    ['/articles/', 1280, 1100],
    ['/about', 390, 1100],
    ['/about', 768, 1100],
    ['/about', 1280, 1100],
    ['/articles/secondhand-phone-deal', 390, 1400],
    ['/articles/secondhand-phone-deal', 768, 1400],
    ['/articles/secondhand-phone-deal', 1280, 1400],
    ['/articles/commute-optimization', 390, 1400],
    ['/articles/commute-optimization', 768, 1400],
    ['/articles/commute-optimization', 1280, 1400]
  ]

  for (const [pathname, width, height] of renderTargets) {
    await checkRenderedOverflow(pathname, width, height)
  }

  await checkArchiveFilter(`/articles/?category=${encodeURIComponent('算账省钱')}`, 'category', '算账省钱')
  await checkArchiveFilter(`/articles/?tag=${encodeURIComponent('算账')}`, 'tag', '算账')

  if (errors.length > 0) {
    for (const error of errors) console.error(`error ${error}`)
    process.exit(1)
  }

  console.log('Rendered site checks passed.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
