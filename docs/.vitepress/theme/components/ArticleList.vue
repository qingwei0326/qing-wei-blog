<script setup lang="ts">
import { articleCategories, articles } from '../data/articles'

const total = articles.length
const latestDate = articles[0]?.date ?? '持续更新'
</script>

<template>
  <section class="article-archive">
    <header class="archive-head">
      <div>
        <p class="archive-kicker">文章归档</p>
        <h1>文章列表</h1>
        <p class="archive-lead">
          {{ total }} 篇记录，围绕技术、生活和折腾，按时间顺序整理在这里。
        </p>
      </div>
      <div class="archive-meta">
        <div>
          <span>总数</span>
          <strong>{{ total }}</strong>
        </div>
        <div>
          <span>最近更新</span>
          <strong>{{ latestDate }}</strong>
        </div>
      </div>
    </header>

    <div class="archive-layout">
      <aside class="archive-aside">
        <section class="archive-panel">
          <p class="archive-kicker">专题</p>
          <div class="archive-topics">
            <span v-for="category in articleCategories" :key="category" class="topic-badge">
              {{ category }}
            </span>
          </div>
        </section>
      </aside>

      <div class="archive-grid">
        <a
          v-for="article in articles"
          :key="article.slug"
          class="archive-card"
          :href="article.url"
        >
          <div class="archive-cover" :class="{ 'is-placeholder': !article.cover }">
            <img v-if="article.cover" :src="article.cover" :alt="article.title" />
            <div v-else class="cover-placeholder" aria-hidden="true">
              <FeatureIcon name="book" />
              <span>{{ article.categories[0] ?? '随笔' }}</span>
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
              <span v-for="tag in article.tags" :key="tag" class="tag-pill">
                {{ tag }}
              </span>
            </div>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.article-archive {
  display: grid;
  gap: 20px;
}

.archive-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 6px;
}

.archive-kicker {
  margin: 0 0 8px;
  color: var(--vp-c-text-3);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.archive-head h1 {
  margin: 0;
  font-size: 1.9rem;
  line-height: 1.15;
}

.archive-lead {
  max-width: 56ch;
  margin: 10px 0 0;
  color: var(--vp-c-text-2);
  line-height: 1.8;
}

.archive-meta {
  display: flex;
  gap: 12px;
}

.archive-meta div {
  min-width: 150px;
  padding: 12px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.archive-meta span {
  display: block;
  color: var(--vp-c-text-3);
  font-size: 0.76rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.archive-meta strong {
  display: block;
  margin-top: 6px;
  font-size: 0.95rem;
  line-height: 1.4;
}

.archive-layout {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}

.archive-aside {
  position: sticky;
  top: 96px;
}

.archive-panel {
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.archive-topics {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.topic-badge {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand) 20%, transparent);
  border-radius: 999px;
  color: var(--vp-c-brand);
  background: color-mix(in srgb, var(--vp-c-brand) 8%, transparent);
  font-size: 0.8rem;
}

.archive-grid {
  display: grid;
  gap: 12px;
}

.archive-card {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 16px;
  padding: 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.archive-card:hover {
  border-color: var(--vp-c-brand);
  text-decoration: none;
}

.archive-cover {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
  background: var(--vp-c-bg-mute);
}

.archive-cover.is-placeholder {
  border: 1px solid color-mix(in srgb, var(--vp-c-brand) 18%, transparent);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--vp-c-brand) 18%, transparent), transparent 62%),
    var(--vp-c-bg-mute);
}

.archive-cover img {
  width: 100%;
  height: 100%;
  min-height: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  margin: 0;
}

.cover-placeholder {
  display: grid;
  gap: 10px;
  justify-items: center;
  color: var(--vp-c-brand);
}

.cover-placeholder :deep(svg) {
  width: 42px;
  height: 42px;
}

.cover-placeholder span {
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
}

.archive-body {
  display: grid;
  gap: 10px;
  align-content: start;
}

.archive-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
}

.archive-body h2 {
  margin: 0;
  font-size: 1.08rem;
  line-height: 1.5;
}

.archive-body p {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

.archive-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-pill {
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 0 10px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand) 18%, transparent);
  border-radius: 999px;
  color: var(--vp-c-brand);
  background: color-mix(in srgb, var(--vp-c-brand) 6%, transparent);
  font-size: 0.76rem;
}

@media (max-width: 960px) {
  .archive-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .archive-aside {
    position: static;
  }
}

@media (max-width: 720px) {
  .archive-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .archive-meta {
    width: 100%;
    flex-direction: column;
  }

  .archive-card {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
