<script setup lang="ts">
import { seriesList } from '../data/series'
import { articleHref } from '../utils/links'
</script>

<template>
  <div class="series-index">
    <header class="series-head">
      <p class="eyebrow">Series</p>
      <h1 class="series-title">系列</h1>
      <p class="series-lead">把相关的文章按阅读顺序串起来。每个系列从上往下读即可。</p>
      <nav class="series-toc" aria-label="系列目录">
        <a v-for="series in seriesList" :key="series.id" :href="`#${series.id}`">{{ series.title }}</a>
      </nav>
    </header>

    <section v-for="series in seriesList" :id="series.id" :key="series.id" class="series-block">
      <div class="series-block-head">
        <h2>{{ series.title }}</h2>
        <span class="series-count">{{ series.articles.length }} 篇</span>
      </div>
      <p class="series-desc">{{ series.description }}</p>

      <ol class="series-list">
        <li v-for="(article, index) in series.articles" :key="article.slug">
          <a :href="articleHref(article.url)" class="series-item">
            <span class="series-num">{{ index + 1 }}</span>
            <span class="series-item-body">
              <span class="series-item-title">{{ article.title }}</span>
              <span v-if="article.description" class="series-item-desc">{{ article.description }}</span>
              <time class="series-item-date" :datetime="article.date">{{ article.date }}</time>
            </span>
          </a>
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.series-index {
  max-width: 880px;
  margin: 0 auto;
  padding: 48px 24px 64px;
}

.series-head {
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

.series-title {
  margin: 0;
  font-size: 36px;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.series-lead {
  margin: 8px 0 0;
  font-size: 15px;
  color: var(--vp-c-text-2);
}

.series-toc {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.series-toc a {
  padding: 4px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  text-decoration: none;
}

.series-toc a:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.series-block {
  margin-top: 40px;
  scroll-margin-top: 80px;
}

.series-block-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.series-block-head h2 {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 24px;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.series-count {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.series-desc {
  margin: 6px 0 16px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.series-list {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.series-item {
  display: grid;
  grid-template-columns: 36px 1fr;
  gap: 14px;
  padding: 14px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
  color: inherit;
  text-decoration: none;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.series-item:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 8px 20px rgb(15 23 42 / 6%);
  transform: translateY(-1px);
}

.series-num {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  font-weight: 800;
  color: var(--vp-c-brand);
}

.series-item-body {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.series-item-title {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
  color: var(--vp-c-text-1);
}

.series-item-desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.series-item-date {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

@media (max-width: 640px) {
  .series-index {
    padding: 32px 16px 48px;
  }

  .series-title {
    font-size: 30px;
  }
}
</style>
