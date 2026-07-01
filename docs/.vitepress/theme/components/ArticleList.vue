<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { inBrowser } from 'vitepress'
import { articleCategories, articleTags, articles } from '../data/articles'
import { articleFilterHref, articleHref } from '../utils/links'

const total = articles.length
const latestDate = articles[0]?.date ?? '持续更新'
const currentSearch = ref('')

const getFilterParam = (name: string) => {
  currentSearch.value

  if (!inBrowser) {
    return ''
  }

  return new URLSearchParams(currentSearch.value).get(name)?.trim() ?? ''
}

const activeCategory = computed(() => getFilterParam('category'))
const activeTag = computed(() => getFilterParam('tag'))
const hasFilter = computed(() => Boolean(activeCategory.value || activeTag.value))

const filteredArticles = computed(() =>
  articles.filter((article) => {
    const matchesCategory =
      !activeCategory.value || article.categories.includes(activeCategory.value)
    const matchesTag = !activeTag.value || article.tags.includes(activeTag.value)

    return matchesCategory && matchesTag
  })
)

const filterTitle = computed(() => {
  if (activeCategory.value && activeTag.value) {
    return `${activeCategory.value} / ${activeTag.value}`
  }

  return activeCategory.value || activeTag.value || 'All'
})

const filterHref = (type: 'category' | 'tag', value: string) => {
  if (type === 'category') {
    return articleFilterHref({
      category: value,
      tag: activeTag.value || undefined
    })
  }

  return articleFilterHref({
    category: activeCategory.value || undefined,
    tag: value
  })
}

const clearHref = computed(() => articleFilterHref({}))

const syncSearch = () => {
  currentSearch.value = inBrowser ? window.location.search : ''
}

const applyFilter = (event: MouseEvent, href: string) => {
  if (!inBrowser) {
    return
  }

  event.preventDefault()
  window.history.pushState({}, '', href)
  syncSearch()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  syncSearch()
  window.addEventListener('popstate', syncSearch)
})

onBeforeUnmount(() => {
  window.removeEventListener('popstate', syncSearch)
})
</script>

<template>
  <section class="article-archive">
    <header class="archive-hero">
      <div>
        <p class="archive-kicker">Archive</p>
        <h1>文章归档</h1>
        <p class="archive-lead">
          {{ total }} 篇记录，围绕算账省钱、消费实战、工具效率和个人复盘整理。先看真实经验，再看可执行的方法。
        </p>
      </div>
      <dl class="archive-stats">
        <div>
          <dt>文章</dt>
          <dd>{{ total }}</dd>
        </div>
        <div>
          <dt>主题</dt>
          <dd>{{ articleCategories.length || 1 }}</dd>
        </div>
        <div>
          <dt>最近更新</dt>
          <dd>{{ latestDate }}</dd>
        </div>
      </dl>
    </header>

    <div class="archive-shell">
      <aside class="archive-aside">
        <section class="side-panel">
          <p class="archive-kicker">Topics</p>
          <div class="topic-list">
            <a
              v-for="category in articleCategories"
              :key="category"
              :class="{ 'is-active': activeCategory === category }"
              :href="filterHref('category', category)"
              @click="applyFilter($event, filterHref('category', category))"
            >
              {{ category }}
            </a>
          </div>
        </section>

        <section class="side-panel">
          <p class="archive-kicker">Tags</p>
          <div class="tag-cloud">
            <a
              v-for="tag in articleTags"
              :key="tag"
              :class="{ 'is-active': activeTag === tag }"
              :href="filterHref('tag', tag)"
              @click="applyFilter($event, filterHref('tag', tag))"
            >
              {{ tag }}
            </a>
          </div>
        </section>
      </aside>

      <div class="archive-list">
        <div v-if="hasFilter" class="archive-filter">
          <div>
            <p class="archive-kicker">Filtered</p>
            <strong>{{ filterTitle }}</strong>
            <span>{{ filteredArticles.length }} / {{ total }}</span>
          </div>
          <a :href="clearHref" @click="applyFilter($event, clearHref)">All articles</a>
        </div>

        <a
          v-for="article in filteredArticles"
          :key="article.slug"
          class="archive-card"
          :href="articleHref(article.url)"
        >
          <div class="archive-cover" :class="{ 'is-placeholder': !article.cover }">
            <img v-if="article.cover" :src="article.cover" :alt="article.title" loading="lazy" />
            <div v-else class="cover-placeholder" aria-hidden="true">
              <FeatureIcon name="book" />
            </div>
          </div>
          <div class="archive-body">
            <div class="archive-row">
              <time :datetime="article.date">{{ article.date }}</time>
              <span v-if="article.categories[0]">{{ article.categories[0] }}</span>
            </div>
            <h2>{{ article.title }}</h2>
            <p>{{ article.description }}</p>
            <div class="archive-tags">
              <span v-for="tag in article.tags.slice(0, 4)" :key="tag" class="tag-pill">
                {{ tag }}
              </span>
            </div>
          </div>
        </a>

        <div v-if="filteredArticles.length === 0" class="archive-empty">
          <FeatureIcon name="book" />
          <p>No matching articles.</p>
          <a :href="clearHref" @click="applyFilter($event, clearHref)">Back to all articles</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.article-archive {
  width: min(1100px, calc(100vw - 48px));
  margin: 0 auto;
  padding: 34px 0 56px;
}

.archive-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 28px;
  align-items: end;
  padding-bottom: 30px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.archive-kicker {
  margin: 0;
  color: var(--vp-c-brand);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.archive-hero h1 {
  margin: 8px 0 0;
  font-size: 2.45rem;
  line-height: 1.12;
  letter-spacing: 0;
}

.archive-lead {
  max-width: 58ch;
  margin: 14px 0 0;
  color: var(--vp-c-text-2);
  font-size: 1rem;
  line-height: 1.9;
}

.archive-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(110px, 1fr));
  gap: 12px;
  margin: 0;
}

.archive-stats div {
  padding: 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.archive-stats dt {
  color: var(--vp-c-text-3);
  font-size: 0.76rem;
  font-weight: 700;
}

.archive-stats dd {
  margin: 6px 0 0;
  color: var(--vp-c-text-1);
  font-size: 1rem;
  font-weight: 800;
}

.archive-shell {
  display: grid;
  grid-template-columns: 230px minmax(0, 1fr);
  gap: 30px;
  align-items: start;
  margin-top: 30px;
}

.archive-aside {
  position: sticky;
  top: 96px;
  display: grid;
  gap: 18px;
}

.side-panel {
  display: grid;
  gap: 12px;
}

.topic-list,
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.topic-list a,
.tag-cloud a {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 10px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand) 18%, var(--vp-c-divider));
  border-radius: 8px;
  color: var(--vp-c-brand);
  background: color-mix(in srgb, var(--vp-c-brand) 6%, var(--vp-c-bg-soft));
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: none;
}

.topic-list a.is-active,
.tag-cloud a.is-active {
  border-color: var(--vp-c-brand);
  color: #fff;
  background: var(--vp-c-brand);
}

.archive-list {
  display: grid;
  gap: 16px;
}

.archive-filter,
.archive-empty {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.archive-filter div {
  display: grid;
  gap: 4px;
}

.archive-filter strong {
  color: var(--vp-c-text-1);
  font-size: 1rem;
  line-height: 1.45;
}

.archive-filter span {
  color: var(--vp-c-text-3);
  font-size: 0.82rem;
  font-weight: 700;
}

.archive-filter a,
.archive-empty a {
  flex: none;
  color: var(--vp-c-brand);
  font-size: 0.84rem;
  font-weight: 800;
  text-decoration: none;
}

.archive-empty {
  display: grid;
  justify-items: center;
  min-height: 180px;
  text-align: center;
}

.archive-empty :deep(svg) {
  width: 44px;
  height: 44px;
  color: var(--vp-c-brand);
}

.archive-empty p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-weight: 700;
}

.archive-card {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 20px;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.archive-card:hover {
  border-color: color-mix(in srgb, var(--vp-c-brand) 54%, var(--vp-c-divider));
  box-shadow: 0 16px 42px rgb(15 23 42 / 8%);
  transform: translateY(-2px);
  text-decoration: none;
}

.archive-cover {
  display: grid;
  place-items: center;
  aspect-ratio: 16 / 10;
  min-height: 156px;
  overflow: hidden;
  border-radius: 8px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--vp-c-brand) 8%, transparent), transparent 58%),
    color-mix(in srgb, var(--vp-c-bg-mute) 78%, var(--vp-c-bg-soft));
}

.archive-cover img {
  display: block;
  width: calc(100% - 18px);
  height: calc(100% - 18px);
  margin: 0;
  object-fit: contain;
  border-radius: 6px;
}

.cover-placeholder {
  display: grid;
  width: 100%;
  place-items: center;
  color: var(--vp-c-brand);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--vp-c-brand) 16%, transparent), transparent 62%),
    color-mix(in srgb, var(--vp-c-brand) 5%, var(--vp-c-bg-mute));
}

.cover-placeholder :deep(svg) {
  width: 52px;
  height: 52px;
}

.archive-body {
  display: grid;
  gap: 10px;
  align-content: center;
}

.archive-row {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
  font-weight: 700;
}

.archive-body h2 {
  margin: 0;
  font-size: 1.2rem;
  line-height: 1.45;
  letter-spacing: 0;
}

.archive-body p {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.8;
}

.archive-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-pill {
  display: inline-flex;
  align-items: center;
  min-height: 27px;
  padding: 0 10px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand) 18%, var(--vp-c-divider));
  border-radius: 8px;
  color: var(--vp-c-brand);
  background: color-mix(in srgb, var(--vp-c-brand) 6%, var(--vp-c-bg-soft));
  font-size: 0.78rem;
  font-weight: 700;
}

@media (max-width: 960px) {
  .article-archive {
    width: min(100% - 28px, 760px);
  }

  .archive-hero,
  .archive-shell {
    grid-template-columns: minmax(0, 1fr);
  }

  .archive-aside {
    position: static;
  }
}

@media (max-width: 680px) {
  .archive-hero h1 {
    font-size: 2rem;
  }

  .archive-stats {
    grid-template-columns: minmax(0, 1fr);
  }

  .archive-card {
    grid-template-columns: minmax(0, 1fr);
  }

  .archive-cover {
    min-height: 190px;
    aspect-ratio: 16 / 9;
  }
}
</style>
