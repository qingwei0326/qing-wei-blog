import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

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
    return
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
}

function cdpSend(socket, method, params = {}) {
  const id = (cdpSend.nextId = (cdpSend.nextId || 0) + 1)
  socket.send(JSON.stringify({ id, method, params }))
  return new Promise((resolve, reject) => {
    const onMessage = (event) => {
      const message = JSON.parse(event.data)
      if (message.id !== id) return
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
      socket.addEventListener('open', resolve, { once: true })
      socket.addEventListener('error', reject, { once: true })
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
          if (node.closest('.visually-hidden, .VPSkipLink, .VPSidebar, [aria-hidden="true"]')) return false;
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

async function main() {
  await checkSeoUrls()
  await checkRenderedOverflow('/', 390, 1000)
  await checkRenderedOverflow('/articles/', 390, 1100)
  await checkRenderedOverflow('/articles/commute-optimization', 390, 1200)
  await checkRenderedOverflow('/articles/', 1280, 1000)

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
