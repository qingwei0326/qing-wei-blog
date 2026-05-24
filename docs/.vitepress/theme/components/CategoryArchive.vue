<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import { articles } from '../data/articles'

const { params } = useData()

const category = computed(() => {
  const raw = (params.value as { category?: string } | null)?.category
  return raw ? decodeURIComponent(raw) : ''
})

const filteredArticles = computed(() =>
  articles.filter((a) => a.categories.includes(category.value))
)
</script>

<template>
  <div class="category-archive">
    <header class="category-head">
      <p class="eyebrow">Category</p>
      <h1 class="category-title">{{ category || '分类' }}</h1>
      <p class="category-count">共 {{ filteredArticles.length }} 篇</p>
    </header>

    <div v-if="filteredArticles.length" class="cat-list">
      <a
        v-for="article in filteredArticles"
        :key="article.slug"
        :href="article.url"
        class="cat-card"
      >
        <div v-if="article.cover" class="cat-cover">
          <img :src="article.cover" :alt="article.title" loading="lazy" />
        </div>
        <div class="cat-info">
          <div class="cat-meta">
            <time :datetime="article.date">{{ article.date }}</time>
            <span v-for="tag in article.tags.slice(0, 2)" :key="tag" class="cat-tag">{{ tag }}</span>
          </div>
          <h2 class="cat-card-title">{{ article.title }}</h2>
          <p v-if="article.description" class="cat-card-desc">{{ article.description }}</p>
        </div>
      </a>
    </div>
    <div v-else class="cat-empty">这个分类下还没有文章。</div>
  </div>
</template>

<style scoped>
.category-archive {
  max-width: 880px;
  margin: 0 auto;
  padding: 48px 24px 64px;
}

.category-head {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 4px;
  color: var(--vp-c-brand);
  text-transform: uppercase;
  opacity: 0.7;
}

.category-title {
  margin: 0;
  font-size: 36px;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.category-count {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.cat-list {
  display: grid;
  gap: 16px;
}

.cat-card {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 20px;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg);
  color: inherit;
  text-decoration: none;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.cat-card:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 8px 20px rgb(15 23 42 / 6%);
  transform: translateY(-1px);
}

.cat-cover {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.cat-cover img {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  object-fit: cover;
}

.cat-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.cat-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.cat-tag {
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
}

.cat-card-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
  color: var(--vp-c-text-1);
}

.cat-card-desc {
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
  color: var(--vp-c-text-2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cat-empty {
  padding: 60px 24px;
  text-align: center;
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .cat-card {
    grid-template-columns: 1fr;
  }
}
</style>
