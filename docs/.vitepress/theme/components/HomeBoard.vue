<script setup lang="ts">
import { computed } from 'vue'
import BloggerSidebar from './BloggerSidebar.vue'
import HeroBanner from './HeroBanner.vue'
import { articleCategories, articleTags, articles } from '../data/articles'

const spotlight = computed(() => articles.slice(1, 4))
const latest = computed(() => articles.slice(4, 9))
const latestLabel = computed(() => articles[0]?.date || '持续更新')
const totalTags = computed(() => articleTags.length)
const categoryStats = computed(() =>
  articleCategories.map((category) => ({
    name: category,
    count: articles.filter((article) => article.categories.includes(category)).length
  }))
)

const heroFeatures = [
  {
    icon: 'spark',
    title: '真实账单',
    detail: '把省钱、通勤和消费判断写成能重复执行的方法。'
  },
  {
    icon: 'clock',
    title: '持续更新',
    detail: '优先整理最近仍然有效、还能直接照着做的方案。'
  },
  {
    icon: 'archive',
    title: '文章归档',
    detail: '从新手理财到日常效率，把经验沉淀成长期可查的清单。'
  }
]

const startHerePicks = [
  { slug: 'beginner-guide', step: '01', blurb: '先看懂"算账 ≠ 理财 ≠ 省钱"' },
  { slug: 'secondhand-phone-deal', step: '02', blurb: '一个完整的实战案例' },
  { slug: 'consumption-traps', step: '03', blurb: '怎么识破日常消费里的套路' }
]

const startHere = computed(() =>
  startHerePicks
    .map((pick) => {
      const article = articles.find((a) => a.slug === pick.slug)
      return article ? { ...pick, article } : null
    })
    .filter((x): x is { slug: string; step: string; blurb: string; article: typeof articles[number] } => x !== null)
)
</script>

<template>
  <div class="home-board">
    <aside class="home-aside" aria-label="作者信息">
      <BloggerSidebar
        name="青微"
        slogan="记录技术、生活与折腾"
        avatar="/images/avatar.jpg"
        email="qingwei0326@gmail.com"
        github="https://github.com/qingwei0326/qing-wei-blog"
      />
    </aside>

    <div class="home-main">
    <HeroBanner />

    <section class="feature-strip" aria-label="首页风格说明">
      <article
        v-for="feature in heroFeatures"
        :key="feature.title"
        class="feature-card"
      >
        <span class="feature-card__icon" aria-hidden="true">
          <FeatureIcon :name="feature.icon" />
        </span>
        <div class="feature-card__copy">
          <strong>{{ feature.title }}</strong>
          <p>{{ feature.detail }}</p>
        </div>
      </article>
    </section>

    <section v-if="startHere.length" class="content-section start-here" aria-labelledby="starthere-heading">
      <div class="section-head">
        <div>
          <p class="eyebrow">Start Here</p>
          <h2 id="starthere-heading">第一次来？读这三篇</h2>
        </div>
      </div>

      <div class="start-grid">
        <a
          v-for="entry in startHere"
          :key="entry.slug"
          class="start-card"
          :href="entry.article.url"
        >
          <p class="start-step">{{ entry.step }}</p>
          <h3 class="start-title">{{ entry.article.title }}</h3>
          <p class="start-blurb">{{ entry.blurb }}</p>
          <p class="start-cta">开始读 →</p>
        </a>
      </div>
    </section>

    <section class="content-section" aria-labelledby="spotlight-heading">
      <div class="section-head">
        <div>
          <p class="eyebrow">Spotlight</p>
          <h2 id="spotlight-heading">近期值得看</h2>
        </div>
        <a class="section-link" href="/articles/">查看全部</a>
      </div>

      <div class="story-grid">
        <a
          v-for="(article, index) in spotlight"
          :key="article.slug"
          class="story-card"
          :class="{ 'is-lead': index === 0 }"
          :href="article.url"
        >
          <div class="story-media" :class="{ 'is-placeholder': !article.cover }">
            <img v-if="article.cover" :src="article.cover" :alt="article.title" />
            <div v-else class="visual-placeholder" aria-hidden="true">
              <FeatureIcon name="book" />
            </div>
          </div>

          <div class="story-body">
            <div class="meta-row">
              <time :datetime="article.date">{{ article.date }}</time>
              <span v-if="article.categories[0]">{{ article.categories[0] }}</span>
            </div>
            <h3>{{ article.title }}</h3>
            <p>{{ article.description }}</p>
            <div class="tag-row">
              <span
                v-for="tag in article.tags.slice(0, 3)"
                :key="tag"
                class="mini-tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </a>
      </div>
    </section>

    <section class="home-split">
      <div v-if="latest.length" class="content-section panel-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Latest</p>
            <h2>更多文章</h2>
          </div>
          <a class="section-link" href="/articles/">全部归档</a>
        </div>

        <div class="timeline-list">
          <a
            v-for="article in latest"
            :key="`${article.slug}-latest`"
            class="timeline-item"
            :href="article.url"
          >
            <time :datetime="article.date">{{ article.date }}</time>
            <strong>{{ article.title }}</strong>
            <span>{{ article.description }}</span>
          </a>
        </div>
      </div>

      <div class="content-section panel-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Topics</p>
            <h2>主题索引</h2>
          </div>
        </div>

        <div class="topic-stack">
          <a
            v-for="category in categoryStats"
            :key="category.name"
            class="topic-row"
            :href="`/categories/${encodeURIComponent(category.name)}`"
          >
            <span>{{ category.name }}</span>
            <strong>{{ category.count }} 篇</strong>
          </a>
        </div>

        <div class="tag-cloud" aria-label="标签云">
          <a v-for="tag in articleTags" :key="tag" href="/articles/">
            {{ tag }}
          </a>
        </div>
      </div>
    </section>
    </div>
  </div>
</template>

<style scoped>
.home-board {
  --board-max-width: 1180px;
  --hero-surface: color-mix(in srgb, var(--vp-c-bg-soft) 84%, transparent);
  --hero-surface-strong: color-mix(in srgb, var(--vp-c-bg-soft) 92%, transparent);
  --hero-surface-hover: color-mix(in srgb, var(--vp-c-bg-soft) 98%, transparent);
  --hero-border: color-mix(in srgb, var(--vp-c-divider) 84%, transparent);
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 28px;
  width: min(var(--board-max-width), calc(100vw - 48px));
  margin: 0 auto;
  padding: 34px 0 56px;
}

.home-aside {
  position: sticky;
  top: 84px;
  align-self: start;
}

.home-main {
  min-width: 0;
}

@media (max-width: 1040px) {
  .home-board {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }

  .home-aside {
    display: none;
  }
}

.feature-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 22px;
}

.feature-card,
.story-card,
.panel-card {
  border: 1px solid var(--hero-border);
  background: var(--vp-c-bg-soft);
}

.feature-card {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  gap: 14px;
  padding: 18px;
  border-radius: 20px;
}

.feature-card__icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  color: var(--vp-c-brand);
  background: color-mix(in srgb, var(--vp-c-brand) 10%, var(--vp-c-bg-mute));
}

.feature-card__copy {
  display: grid;
  gap: 6px;
}

.feature-card__copy strong {
  font-size: 1rem;
}

.feature-card__copy p {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

.content-section {
  display: grid;
  gap: 16px;
  margin-top: 42px;
}

.section-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 18px;
}

.section-head h2 {
  margin: 6px 0 0;
  font-size: 1.45rem;
  line-height: 1.25;
  letter-spacing: 0;
}

.section-link {
  color: var(--vp-c-brand);
  font-size: 0.92rem;
  font-weight: 700;
  text-decoration: none;
}

.section-link:hover {
  color: var(--vp-c-brand-dark);
}

.start-here .section-head {
  margin-bottom: 12px;
}

.start-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.start-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 22px 24px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background: var(--vp-c-bg);
  color: inherit;
  text-decoration: none;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.start-card:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 12px 32px rgb(15 23 42 / 8%);
  transform: translateY(-2px);
}

.start-step {
  margin: 0;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 3px;
  color: var(--vp-c-brand);
  opacity: 0.75;
}

.start-title {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.45;
  color: var(--vp-c-text-1);
}

.start-blurb {
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
  color: var(--vp-c-text-2);
}

.start-cta {
  margin: auto 0 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-brand);
}

@media (max-width: 860px) {
  .start-grid {
    grid-template-columns: 1fr;
  }
}

.story-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.story-card {
  display: grid;
  overflow: hidden;
  border-radius: 22px;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.story-card:hover {
  border-color: color-mix(in srgb, var(--vp-c-brand) 54%, var(--vp-c-divider));
  box-shadow: 0 18px 50px rgb(15 23 42 / 9%);
  transform: translateY(-2px);
  text-decoration: none;
}

.story-card:not(.is-lead) {
  grid-template-rows: 172px auto;
}

.story-card.is-lead {
  grid-column: 1 / -1;
  grid-template-columns: minmax(260px, 0.92fr) minmax(0, 1fr);
}

.story-media {
  position: relative;
  overflow: hidden;
  background: var(--vp-c-bg-mute);
}

.story-media img {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  object-fit: cover;
  object-position: center top;
}

.story-body {
  display: grid;
  gap: 10px;
  align-content: center;
  padding: 18px;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
  font-weight: 700;
}

.story-body h3 {
  margin: 0;
  line-height: 1.35;
  letter-spacing: 0;
}

.story-body p {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.8;
}

.tag-row,
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.mini-tag,
.tag-cloud a {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand) 18%, var(--vp-c-divider));
  border-radius: 8px;
  color: var(--vp-c-brand);
  background: color-mix(in srgb, var(--vp-c-brand) 6%, var(--vp-c-bg-soft));
  font-size: 0.78rem;
  font-weight: 700;
  text-decoration: none;
}

.home-split {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
  gap: 20px;
}

.panel-card {
  padding: 24px;
  border-radius: 24px;
}

.timeline-list,
.topic-stack {
  display: grid;
  gap: 10px;
}

.timeline-item,
.topic-row {
  display: grid;
  gap: 5px;
  padding: 15px 0;
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.timeline-item:hover,
.topic-row:hover {
  color: var(--vp-c-brand);
  text-decoration: none;
}

.timeline-item time {
  color: var(--vp-c-text-3);
  font-size: 0.78rem;
  font-weight: 700;
}

.timeline-item strong {
  font-size: 1rem;
  line-height: 1.45;
}

.timeline-item span {
  color: var(--vp-c-text-2);
  font-size: 0.92rem;
  line-height: 1.7;
}

.topic-row {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
}

.topic-row span {
  font-weight: 800;
}

.topic-row strong {
  color: var(--vp-c-text-3);
  font-size: 0.84rem;
}

.tag-cloud {
  margin-top: 16px;
}

.visual-placeholder {
  display: grid;
  height: 100%;
  min-height: 160px;
  place-items: center;
  color: var(--vp-c-brand);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--vp-c-brand) 16%, transparent), transparent 62%),
    color-mix(in srgb, var(--vp-c-brand) 5%, var(--vp-c-bg-mute));
}

.visual-placeholder :deep(svg) {
  width: 58px;
  height: 58px;
}

@media (max-width: 1040px) {
  .home-split {
    grid-template-columns: minmax(0, 1fr);
  }

  .story-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .story-card.is-lead {
    grid-column: auto;
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 820px) {
  .home-board {
    width: min(100% - 28px, 760px);
    padding-top: 22px;
  }

  .feature-strip,
  .story-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 560px) {
  .home-board {
    width: min(100% - 24px, 720px);
  }

  .section-head {
    align-items: flex-start;
    flex-direction: column;
  }

  .panel-card {
    padding: 18px;
  }
}

.home-board {
  --board-max-width: 1160px;
  --hero-border: color-mix(in srgb, var(--vp-c-divider) 72%, transparent);
  box-sizing: border-box;
  grid-template-columns: 230px minmax(0, 1fr);
  gap: 44px;
  padding: 46px 0 72px;
}

.home-aside {
  padding-right: 26px;
  border-right: 1px solid var(--vp-c-divider-light);
}

.feature-strip {
  gap: 28px;
  margin-top: 26px;
}

.feature-card {
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 12px;
  padding: 18px 0 0;
  border: 0;
  border-top: 1px solid var(--vp-c-divider-light);
  border-radius: 0;
  background: transparent;
}

.feature-card__icon {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  color: color-mix(in srgb, var(--vp-c-brand) 82%, #0f766e);
  background: color-mix(in srgb, var(--vp-c-brand) 8%, var(--vp-c-bg-mute));
}

.content-section {
  margin-top: 54px;
}

.start-card,
.story-card,
.panel-card {
  border-radius: 8px;
}

.start-card,
.story-card,
.panel-card,
.feature-card {
  box-shadow: none;
}

.story-card:hover,
.start-card:hover {
  box-shadow: 0 10px 28px rgb(15 23 42 / 6%);
}

.story-card:not(.is-lead) {
  grid-template-rows: 160px auto;
}

.story-card.is-lead {
  grid-template-columns: minmax(240px, 0.86fr) minmax(0, 1fr);
}

.story-media img {
  object-position: center;
}

.panel-card {
  padding: 22px;
}

@media (max-width: 1040px) {
  .home-aside {
    padding-right: 0;
    border-right: 0;
  }
}

@media (max-width: 560px) {
  .home-board {
    display: block;
    width: calc(100vw - 24px);
    max-width: calc(100vw - 24px);
    margin-right: auto;
    margin-left: auto;
    overflow-x: hidden;
  }

  .home-main {
    width: 100%;
    min-width: 0;
  }
}
</style>

<style>
html[data-teek-preset="doc"] .home-board {
  --board-max-width: 980px;
}

html[data-teek-preset="doc"] .story-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

html[data-teek-preset="doc"] .story-card.is-lead {
  grid-column: auto;
  grid-template-columns: minmax(0, 1fr);
}

html[data-teek-preset="doc"] .home-split {
  grid-template-columns: minmax(0, 1fr);
}

html[data-teek-preset="blog"] .home-board {
  --board-max-width: 1180px;
}

html[data-teek-preset="compact"] .home-board {
  --board-max-width: 1080px;
}

html[data-teek-preset="compact"] .story-card.is-lead {
  grid-column: auto;
  grid-template-columns: minmax(0, 1fr);
}

html[data-teek-preset="large"] .home-board {
  --board-max-width: 1120px;
}

html[data-teek-preset="wide"] .home-board {
  --board-max-width: 1240px;
  width: min(var(--board-max-width), calc(100vw - 24px));
  padding-top: 0;
}

html[data-teek-preset="wide"] .feature-strip {
  position: relative;
  z-index: 2;
  margin-top: -34px;
}

html[data-teek-preset="wide"] .home-board {
  width: min(var(--board-max-width), calc(100vw - 48px));
  padding-top: 34px;
}

html[data-teek-preset="wide"] .feature-strip {
  margin-top: 26px;
}

html[data-teek-preset="card"] .home-board {
  --board-max-width: 1020px;
}

html[data-teek-preset="card"] .feature-card,
html[data-teek-preset="card"] .story-card,
html[data-teek-preset="card"] .panel-card {
  border-radius: 24px;
  box-shadow: 0 18px 48px rgb(15 23 42 / 8%);
}

html[data-teek-preset="card"] .story-card.is-lead {
  grid-column: auto;
  grid-template-columns: minmax(0, 1fr);
}

.dark .home-board {
  --hero-surface: rgb(24 36 55 / 88%);
  --hero-surface-strong: rgb(28 42 64 / 94%);
  --hero-surface-hover: rgb(34 50 75 / 98%);
  --hero-border: rgb(107 132 166 / 38%);
}

.dark .home-aside {
  border-right-color: rgb(107 132 166 / 28%);
}

.dark .feature-card__copy p,
.dark .story-body p,
.dark .timeline-item span {
  color: #d5e0ee;
}

.dark .section-link,
.dark .start-cta {
  color: #a8c7ff;
}

.dark .start-card,
.dark .story-card,
.dark .panel-card {
  border-color: var(--hero-border);
  background: var(--hero-surface);
}

.dark .mini-tag,
.dark .tag-cloud a {
  border-color: rgb(141 164 197 / 42%);
  color: #c8d7ea;
  background: rgb(141 164 197 / 10%);
}

.dark .meta-row,
.dark .timeline-item time,
.dark .topic-row strong,
.dark .start-step {
  color: #afbdd1;
}

.dark .blogger-shell .nav-btn,
.dark .blogger-social a {
  border-color: rgb(107 132 166 / 38%);
  color: #d0dbe9;
}

@media (max-width: 820px) {
  html[data-teek-preset="wide"] .home-board {
    width: min(100%, 100vw);
  }
}

@media (max-width: 560px) {
  html .home-board {
    width: calc(100vw - 28px) !important;
    max-width: calc(100vw - 28px) !important;
    margin-right: auto !important;
    margin-left: auto !important;
    padding-top: 24px !important;
    overflow-x: clip;
  }

  html .home-main,
  html .feature-strip,
  html .content-section,
  html .story-grid,
  html .start-grid,
  html .home-split {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box;
  }

  html .story-body h3,
  html .story-body p {
    max-width: 100% !important;
    white-space: normal !important;
    overflow-wrap: break-word !important;
    word-break: normal !important;
  }

  html .story-card,
  html .start-card,
  html .panel-card {
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box;
  }

  html .story-grid,
  html .start-grid,
  html .home-split,
  html .feature-strip,
  html .story-card.is-lead {
    grid-template-columns: minmax(0, 1fr) !important;
  }
}
</style>
