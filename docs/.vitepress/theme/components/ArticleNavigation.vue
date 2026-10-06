<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import { articles } from '../data/articles'
import { findSeriesBySlug } from '../data/series'
import { articleHref, siteLink } from '../utils/links'

const { page } = useData()

const currentSlug = computed(() => {
  const path = page.value.relativePath
  return path.replace(/^articles\//, '').replace(/\.md$/, '')
})

const isArticle = computed(() =>
  page.value.relativePath.startsWith('articles/') && currentSlug.value !== 'index'
)

// 当前文章所在的系列（按阅读顺序）
const seriesInfo = computed(() => (isArticle.value ? findSeriesBySlug(currentSlug.value) : null))

// 在系列中：按系列顺序给上一篇/下一篇；不在系列中：按时间。
// articles 按时间降序；同日文章已按 slug 排序，导航顺序因此稳定。
const navigation = computed(() => {
  if (!isArticle.value) return { prev: null, next: null }

  if (seriesInfo.value) {
    const { series, index } = seriesInfo.value
    return {
      prev: index > 0 ? series.articles[index - 1] : null,
      next: index < series.articles.length - 1 ? series.articles[index + 1] : null
    }
  }

  const idx = articles.findIndex((a) => a.slug === currentSlug.value)
  if (idx === -1) return { prev: null, next: null }
  return {
    next: idx > 0 ? articles[idx - 1] : null,
    prev: idx < articles.length - 1 ? articles[idx + 1] : null
  }
})

// 相关推荐：tag 重合度优先，同分类次之
const related = computed(() => {
  if (!isArticle.value) return []
  const current = articles.find((a) => a.slug === currentSlug.value)
  if (!current) return []

  const seriesSlugs = new Set(seriesInfo.value?.series.articles.map((a) => a.slug) ?? [])

  return articles
    .filter((a) => a.slug !== current.slug && !seriesSlugs.has(a.slug))
    .map((a) => {
      const tagScore = a.tags.filter((t) => current.tags.includes(t)).length
      const catScore = a.categories.filter((c) => current.categories.includes(c)).length
      return { article: a, score: tagScore * 2 + catScore }
    })
    .filter((c) => c.score > 0)
    .sort(
      (a, b) => {
        const scoreOrder = b.score - a.score
        if (scoreOrder !== 0) return scoreOrder

        const dateOrder = b.article.timeValue - a.article.timeValue
        if (dateOrder !== 0) return dateOrder

        if (a.article.slug < b.article.slug) return -1
        if (a.article.slug > b.article.slug) return 1
        return 0
      }
    )
    .slice(0, 3)
    .map((c) => c.article)
})

const showAnything = computed(
  () =>
    seriesInfo.value ||
    navigation.value.prev ||
    navigation.value.next ||
    related.value.length > 0
)
</script>

<template>
  <div v-if="isArticle && showAnything" class="article-nav">
    <section v-if="seriesInfo" class="series-box" aria-label="所属系列">
      <div class="series-box-head">
        <span class="series-box-label">所属系列</span>
        <a :href="siteLink('/series/') + '#' + seriesInfo.series.id" class="series-box-name">{{ seriesInfo.series.title }}</a>
        <span class="series-box-pos">第 {{ seriesInfo.index + 1 }} / {{ seriesInfo.series.articles.length }} 篇</span>
      </div>
      <ol class="series-box-list">
        <li
          v-for="(item, i) in seriesInfo.series.articles"
          :key="item.slug"
          :class="{ current: i === seriesInfo.index }"
        >
          <span class="series-box-num">{{ i + 1 }}</span>
          <span v-if="i === seriesInfo.index" class="series-box-title" aria-current="page">{{ item.title }}</span>
          <a v-else :href="articleHref(item.url)" class="series-box-title">{{ item.title }}</a>
        </li>
      </ol>
    </section>

    <div v-if="navigation.prev || navigation.next" class="nav-row">
      <a
        v-if="navigation.prev"
        :href="articleHref(navigation.prev.url)"
        class="nav-card prev"
      >
        <div class="nav-label">← {{ seriesInfo ? '系列上一篇' : '上一篇' }}</div>
        <div class="nav-title">{{ navigation.prev.title }}</div>
      </a>
      <div v-else class="nav-card empty" />

      <a
        v-if="navigation.next"
        :href="articleHref(navigation.next.url)"
        class="nav-card next"
      >
        <div class="nav-label">{{ seriesInfo ? '系列下一篇' : '下一篇' }} →</div>
        <div class="nav-title">{{ navigation.next.title }}</div>
      </a>
      <div v-else class="nav-card empty" />
    </div>

    <div v-if="related.length" class="related-section">
      <h3 class="related-title">相关推荐</h3>
      <div class="related-grid">
        <a
          v-for="article in related"
          :key="article.slug"
          :href="articleHref(article.url)"
          class="related-card"
        >
          <div v-if="article.cover" class="related-cover">
            <img :src="article.cover" :alt="article.title" loading="lazy" />
          </div>
          <div class="related-info">
            <div class="related-card-title">{{ article.title }}</div>
            <div v-if="article.date" class="related-card-date">{{ article.date }}</div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.series-box {
  margin-bottom: 32px;
  padding: 18px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.series-box-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 10px;
  margin-bottom: 12px;
}

.series-box-label {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1px;
  color: var(--vp-c-text-2);
}

.series-box-name {
  font-size: 16px;
  font-weight: 800;
  color: var(--vp-c-brand);
  text-decoration: none;
}

.series-box-pos {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.series-box-list {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.series-box-list li {
  display: grid;
  grid-template-columns: 24px 1fr;
  gap: 8px;
  align-items: baseline;
  margin: 0;
}

.series-box-num {
  font-size: 12px;
  font-weight: 800;
  color: var(--vp-c-text-3);
}

.series-box-name,
.series-box-title {
  border-bottom: 0;
}

.series-box-title {
  font-size: 14px;
  line-height: 1.5;
  color: var(--vp-c-text-1);
  text-decoration: none;
}

a.series-box-title:hover {
  color: var(--vp-c-brand);
}

.series-box-list li.current .series-box-title {
  font-weight: 800;
  color: var(--vp-c-brand);
}

.series-box-list li.current .series-box-num {
  color: var(--vp-c-brand);
}

.article-nav {
  margin-top: 56px;
  padding-top: 32px;
  border-top: 1px solid var(--vp-c-divider);
}

.nav-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 40px;
}

.nav-card {
  display: block;
  padding: 16px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.nav-card:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 6px 16px rgb(15 23 42 / 6%);
  transform: translateY(-1px);
}

.nav-card.empty {
  background: transparent;
  border-color: transparent;
  pointer-events: none;
}

.nav-card.next {
  text-align: right;
}

.nav-label {
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin-bottom: 6px;
}

.nav-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.related-section {
  margin-top: 32px;
}

.related-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 16px;
  padding: 0;
  border: 0;
  color: var(--vp-c-text-1);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.related-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg);
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.related-card:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 6px 16px rgb(15 23 42 / 6%);
  transform: translateY(-1px);
}

.related-cover {
  aspect-ratio: 16 / 9;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}

.related-cover img {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  object-fit: cover;
}

.related-info {
  padding: 12px 14px;
}

.related-card-title {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--vp-c-text-1);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-card-date {
  margin-top: 6px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}

@media (max-width: 768px) {
  .nav-row {
    grid-template-columns: 1fr;
  }

  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>
