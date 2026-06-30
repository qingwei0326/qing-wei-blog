<script setup lang="ts">
import { computed } from 'vue'
import BloggerSidebar from './BloggerSidebar.vue'
import HeroBanner from './HeroBanner.vue'
import StoryCardList from './StoryCardList.vue'
import PresetOverrides from './PresetOverrides.vue'
import { articleCategories, articleTags, articles } from '../data/articles'
import { articleFilterHref, articleHref, categoryHref, siteLink } from '../utils/links'

const coreTagNames = [
  '省钱',
  '算账',
  '信息差',
  'AI 工具',
  '工具',
  '消费',
  '学生理财',
  '副业',
  '通勤',
  '寄快递'
]

const homeTags = computed(() => coreTagNames.filter((tag) => articleTags.includes(tag)))
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

const holidayPicks = [
  {
    slug: 'commute-optimization',
    label: '返乡出行',
    hook: '带行李回家前，先算清楚公交、打车和顺风车的真实成本。'
  },
  {
    slug: 'guan-yu-ji-kuai-di',
    label: '寄件行李',
    hook: '寄书、寄衣服、寄闲置，把学生券和平台券先叠起来。'
  },
  {
    slug: 'systematic-money-saving',
    label: '假期消费',
    hook: '出门、网购、订阅续费前，用一套流程少花冤枉钱。'
  }
]

const holidaySpecial = computed(() =>
  holidayPicks
    .map((pick) => {
      const article = articles.find((a) => a.slug === pick.slug)
      return article ? { ...pick, article } : null
    })
    .filter((x): x is { slug: string; label: string; hook: string; article: typeof articles[number] } => x !== null)
)

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
  <!-- PresetOverrides 只承载全局样式，必须放在 .home-board 网格外，否则会占用网格槽位 -->
  <PresetOverrides />
  <div class="home-board">
    <aside class="home-aside" aria-label="作者信息">
      <BloggerSidebar
        name="青微"
        slogan="记录技术、生活与折腾"
        avatar="/images/avatar.webp"
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

    <section v-if="holidaySpecial.length" class="content-section holiday-special" aria-labelledby="holiday-heading">
      <div class="section-head">
        <div>
          <p class="eyebrow">Holiday Picks</p>
          <h2 id="holiday-heading">放假前先看这 3 篇</h2>
        </div>
        <a class="section-link" :href="siteLink('/articles/')">全部文章</a>
      </div>

      <div class="holiday-grid">
        <a
          v-for="entry in holidaySpecial"
          :key="entry.slug"
          class="holiday-card"
          :href="articleHref(entry.article.url)"
        >
          <div class="holiday-media" :class="{ 'is-placeholder': !entry.article.cover }">
            <img
              v-if="entry.article.cover"
              :src="entry.article.cover"
              :alt="entry.article.title"
              loading="lazy"
            />
            <span v-else aria-hidden="true">
              <FeatureIcon name="spark" />
            </span>
          </div>
          <div class="holiday-body">
            <p class="holiday-label">{{ entry.label }}</p>
            <h3>{{ entry.article.title }}</h3>
            <p>{{ entry.hook }}</p>
          </div>
        </a>
      </div>
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
          :href="articleHref(entry.article.url)"
        >
          <p class="start-step">{{ entry.step }}</p>
          <h3 class="start-title">{{ entry.article.title }}</h3>
          <p class="start-blurb">{{ entry.blurb }}</p>
          <p class="start-cta">开始读 →</p>
        </a>
      </div>
    </section>

    <StoryCardList />

    <section class="home-split">
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
            :href="categoryHref(category.name)"
          >
            <span>{{ category.name }}</span>
            <strong>{{ category.count }} 篇</strong>
          </a>
        </div>

        <div class="tag-cloud" aria-label="标签云">
          <a v-for="tag in homeTags" :key="tag" :href="articleFilterHref({ tag })">
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

.holiday-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.holiday-card {
  display: grid;
  grid-template-rows: 148px minmax(0, 1fr);
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 84%, transparent);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.holiday-card:hover {
  border-color: color-mix(in srgb, var(--vp-c-brand) 54%, var(--vp-c-divider));
  box-shadow: 0 14px 34px rgb(15 23 42 / 7%);
  transform: translateY(-2px);
  text-decoration: none;
}

.holiday-media {
  display: grid;
  place-items: center;
  overflow: hidden;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--vp-c-brand) 8%, transparent), transparent 58%),
    color-mix(in srgb, var(--vp-c-bg-mute) 78%, var(--vp-c-bg-soft));
}

.holiday-media img {
  display: block;
  width: calc(100% - 18px);
  height: calc(100% - 18px);
  margin: 0;
  border-radius: 6px;
  object-fit: contain;
  object-position: center;
}

.holiday-media span {
  display: grid;
  place-items: center;
  color: var(--vp-c-brand);
}

.holiday-media :deep(svg) {
  width: 44px;
  height: 44px;
}

.holiday-body {
  display: grid;
  gap: 8px;
  align-content: start;
  padding: 16px;
}

.holiday-label {
  margin: 0;
  color: var(--vp-c-brand);
  font-size: 0.78rem;
  font-weight: 800;
}

.holiday-body h3 {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 1rem;
  line-height: 1.45;
  letter-spacing: 0;
}

.holiday-body p:not(.holiday-label) {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  line-height: 1.7;
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
  .holiday-grid,
  .start-grid {
    grid-template-columns: 1fr;
  }

  .holiday-card {
    grid-template-rows: 190px minmax(0, 1fr);
  }
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

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
  grid-template-columns: minmax(0, 1fr);
  gap: 20px;
}

.panel-card {
  padding: 24px;
  border-radius: 24px;
}

.topic-stack {
  display: grid;
  gap: 10px;
}

.topic-row {
  display: grid;
  gap: 5px;
  padding: 15px 0;
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.topic-row:hover {
  color: var(--vp-c-brand);
  text-decoration: none;
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

@media (max-width: 1040px) {
  .home-split {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 820px) {
  .home-board {
    width: min(100% - 28px, 760px);
    padding-top: 22px;
  }

  .feature-strip {
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
.panel-card {
  border-radius: 8px;
}

.start-card,
.panel-card,
.feature-card {
  box-shadow: none;
}

.start-card:hover {
  box-shadow: 0 10px 28px rgb(15 23 42 / 6%);
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
