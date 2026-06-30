<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import { articles } from '../data/articles'
import { articleHref } from '../utils/links'

const { page } = useData()

const currentSlug = computed(() => {
  const path = page.value.relativePath
  return path.replace(/^articles\//, '').replace(/\.md$/, '')
})

const isArticle = computed(() =>
  page.value.relativePath.startsWith('articles/') && currentSlug.value !== 'index'
)

// articles 按时间降序：idx-1 是更新的（next）、idx+1 是更老的（prev）
const navigation = computed(() => {
  if (!isArticle.value) return { prev: null, next: null }
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

  return articles
    .filter((a) => a.slug !== current.slug)
    .map((a) => {
      const tagScore = a.tags.filter((t) => current.tags.includes(t)).length
      const catScore = a.categories.filter((c) => current.categories.includes(c)).length
      return { article: a, score: tagScore * 2 + catScore }
    })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score || b.article.timeValue - a.article.timeValue)
    .slice(0, 3)
    .map((c) => c.article)
})

const showAnything = computed(
  () => navigation.value.prev || navigation.value.next || related.value.length > 0
)
</script>

<template>
  <div v-if="isArticle && showAnything" class="article-nav">
    <div v-if="navigation.prev || navigation.next" class="nav-row">
      <a
        v-if="navigation.prev"
        :href="articleHref(navigation.prev.url)"
        class="nav-card prev"
      >
        <div class="nav-label">← 上一篇</div>
        <div class="nav-title">{{ navigation.prev.title }}</div>
      </a>
      <div v-else class="nav-card empty" />

      <a
        v-if="navigation.next"
        :href="articleHref(navigation.next.url)"
        class="nav-card next"
      >
        <div class="nav-label">下一篇 →</div>
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
