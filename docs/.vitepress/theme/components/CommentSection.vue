<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'
import { useTeekConfig } from 'vitepress-theme-teek'

type GiscusOptions = {
  repo?: string
  repoId?: string
  category?: string
  categoryId?: string
  mapping?: string
  strict?: string
  reactionsEnabled?: string
  emitMetadata?: string
  inputPosition?: string
  theme?: string
  lang?: string
  loading?: string
  link?: string
  integrity?: string
}

type CommentConfig = {
  options?: GiscusOptions
}

const { page, isDark } = useData()
const { getTeekConfig } = useTeekConfig()
const commentConfig = getTeekConfig<CommentConfig>('comment', {})
const options = commentConfig.options ?? {}

const host = ref<HTMLElement | null>(null)
const status = ref<'loading' | 'ready' | 'error'>('loading')
let observer: MutationObserver | null = null
let timeoutId: number | undefined
let mounted = false

const isArticle = () =>
  page.value.relativePath.startsWith('articles/') && page.value.relativePath !== 'articles/index.md'

const clearPending = () => {
  observer?.disconnect()
  observer = null
  if (timeoutId !== undefined) {
    window.clearTimeout(timeoutId)
    timeoutId = undefined
  }
}

const fail = () => {
  clearPending()
  status.value = 'error'
  host.value?.replaceChildren()
}

const markReadyWhenFrameAppears = () => {
  if (!host.value) return

  const markReady = () => {
    const frame = host.value?.querySelector('iframe')
    if (!frame) return false

    const ready = () => {
      if (host.value?.querySelector('iframe') !== frame) return
      clearPending()
      status.value = 'ready'
    }

    frame.addEventListener('load', ready, { once: true })
    frame.addEventListener('error', fail, { once: true })
    return true
  }

  if (markReady()) return

  observer = new MutationObserver(markReady)
  observer.observe(host.value, { childList: true, subtree: true })
}

const mountGiscus = async () => {
  clearPending()
  if (!mounted || !isArticle() || !host.value) return

  host.value.replaceChildren()
  status.value = 'loading'

  const required = [options.repo, options.repoId, options.category, options.categoryId]
  if (required.some((value) => !value)) {
    fail()
    return
  }

  const script = document.createElement('script')
  script.src = options.link || 'https://giscus.app/client.js'
  script.async = true
  script.crossOrigin = 'anonymous'
  if (options.integrity) script.integrity = options.integrity

  const attributes: Record<string, string> = {
    'data-repo': options.repo!,
    'data-repo-id': options.repoId!,
    'data-category': options.category!,
    'data-category-id': options.categoryId!,
    'data-mapping': options.mapping || 'pathname',
    'data-strict': options.strict || '0',
    'data-reactions-enabled': options.reactionsEnabled || '1',
    'data-emit-metadata': options.emitMetadata || '0',
    'data-input-position': options.inputPosition || 'top',
    'data-theme': options.theme === 'preferred_color_scheme'
      ? (isDark.value ? 'dark' : 'light')
      : (options.theme || (isDark.value ? 'dark' : 'light')),
    'data-lang': options.lang || 'zh-CN',
    'data-loading': options.loading || 'eager'
  }

  Object.entries(attributes).forEach(([name, value]) => script.setAttribute(name, value))
  script.addEventListener('error', fail, { once: true })

  host.value.appendChild(script)
  markReadyWhenFrameAppears()
  timeoutId = window.setTimeout(() => {
    if (status.value !== 'ready') fail()
  }, 12000)

  await nextTick()
}

const retry = () => {
  void mountGiscus()
}

watch(
  [() => page.value.relativePath, () => isDark.value],
  () => {
    if (mounted) void mountGiscus()
  }
)

onMounted(() => {
  mounted = true
  void mountGiscus()
})

onBeforeUnmount(() => {
  mounted = false
  clearPending()
})
</script>

<template>
  <section v-if="isArticle()" class="blog-comment" aria-labelledby="comment-heading">
    <div class="comment-head">
      <div>
        <p class="comment-kicker">交流</p>
        <h2 id="comment-heading">评论区</h2>
        <p class="comment-note">评论需要 GitHub 登录；如果评论区没有加载出来，也可以直接发邮件给我。</p>
      </div>
      <a class="comment-email" href="mailto:qingwei0326@gmail.com">邮件联系</a>
    </div>

    <div v-if="status !== 'ready'" class="comment-status" aria-live="polite">
      <span v-if="status === 'loading'">评论区加载中…</span>
      <span v-else>评论区暂时没有加载出来，可以重试或通过邮件联系我。</span>
      <button v-if="status === 'error'" type="button" @click="retry">重新加载</button>
    </div>

    <div ref="host" class="giscus-host" :class="{ 'is-hidden': status !== 'ready' }"></div>
  </section>
</template>

<style scoped>
.blog-comment {
  display: grid;
  gap: 18px;
  margin: 48px 0 12px;
  padding-top: 28px;
  border-top: 1px solid var(--vp-c-divider);
}

.comment-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 18px;
}

.comment-kicker {
  margin: 0;
  color: var(--vp-c-brand);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.comment-head h2 {
  margin: 6px 0 0;
  border: 0;
  padding: 0;
  font-size: 1.45rem;
}

.comment-note {
  max-width: 56ch;
  margin: 8px 0 0;
  color: var(--vp-c-text-2);
  font-size: 0.92rem;
  line-height: 1.7;
}

.comment-email {
  flex: 0 0 auto;
  color: var(--vp-c-brand);
  font-weight: 700;
  text-decoration: none;
}

.comment-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.comment-status button {
  flex: 0 0 auto;
  padding: 6px 12px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand) 35%, var(--vp-c-divider));
  border-radius: 7px;
  background: color-mix(in srgb, var(--vp-c-brand) 8%, var(--vp-c-bg-soft));
  color: var(--vp-c-brand);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.giscus-host {
  min-width: 0;
}

.giscus-host.is-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
}

@media (max-width: 560px) {
  .comment-head,
  .comment-status {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
