<script setup lang="ts">
import { computed } from 'vue'
import BloggerSidebar from './BloggerSidebar.vue'
import HeroBanner from './HeroBanner.vue'
import StoryCardList from './StoryCardList.vue'
import PresetOverrides from './PresetOverrides.vue'
import { articleCategories, articles } from '../data/articles'
import { articleHref, categoryHref } from '../utils/links'

const categoryStats = computed(() =>
  articleCategories.map((name) => ({
    name,
    count: articles.filter((article) => article.categories.includes(name)).length
  }))
)

const startHerePicks = [
  { slug: 'beginner-guide', step: '01', blurb: '先看懂"算账 ≠ 理财 ≠ 省钱"' },
  { slug: 'secondhand-phone-deal', step: '02', blurb: '一个完整的实战案例' },
  { slug: 'ai-verification-cost', step: '03', blurb: '工具要先进入验证闭环' }
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

      <section v-if="startHere.length" class="content-section start-here" aria-labelledby="starthere-heading">
        <div class="section-head">
          <div>
            <p class="eyebrow">新读者入口</p>
            <h2 id="starthere-heading">第一次来？按这三步读</h2>
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
              <p class="eyebrow">内容分类</p>
              <h2>四条内容主线</h2>
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
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.home-board {
  --board-max-width: 1180px;
  --hero-surface: color-mix(in srgb, var(--vp-c-bg-soft) 84%, transparent);
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

.panel-card {
  border: 1px solid var(--hero-border);
  background: var(--vp-c-bg-soft);
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

@media (max-width: 820px) {
  .home-board {
    width: min(100% - 28px, 760px);
    padding-top: 22px;
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

.content-section {
  margin-top: 54px;
}

.start-card,
.panel-card {
  border-radius: 8px;
}

.start-card,
.panel-card {
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
    overflow-x: visible;
  }

  .home-main {
    width: 100%;
    min-width: 0;
  }
}
</style>
