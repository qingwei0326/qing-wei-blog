<script setup lang="ts">
import { computed } from 'vue'
import { articleCategories, articleTags, articles } from '../data/articles'

const quickLinks = [
  {
    icon: 'spark',
    label: '推荐文章',
    description: '先读最近值得看的内容',
    href: '#推荐文章'
  },
  {
    icon: 'clock',
    label: '最新文章',
    description: '按时间顺序浏览更新',
    href: '#最新文章'
  },
  {
    icon: 'archive',
    label: '文章归档',
    description: '查看全部文章列表',
    href: '/articles/'
  },
  {
    icon: 'tag',
    label: '标签云',
    description: '按主题快速定位',
    href: '#标签云'
  },
  {
    icon: 'user',
    label: '关于青微',
    description: '看看这个博客在写什么',
    href: '/about'
  }
]

const spotlight = computed(() => articles.slice(0, 3))
const latest = computed(() => articles.slice(0, 4))
const totalTags = computed(() => articleTags.length)
const totalCategories = computed(() => articleCategories.length || 1)
const latestLabel = computed(() => articles[0]?.date || '持续更新')
</script>

<template>
  <div class="home-board">
    <div class="home-grid">
      <aside class="home-sidebar">
        <section class="panel sticky-panel">
          <p class="panel-kicker">导航</p>
          <nav class="link-list" aria-label="主页导航">
            <a
              v-for="link in quickLinks"
              :key="link.label"
              class="link-item"
              :href="link.href"
            >
              <span class="link-icon" aria-hidden="true">
                <FeatureIcon :name="link.icon" />
              </span>
              <span class="link-copy">
                <strong>{{ link.label }}</strong>
                <small>{{ link.description }}</small>
              </span>
            </a>
          </nav>
        </section>

        <section class="panel">
          <p class="panel-kicker">专题</p>
          <div class="topic-cloud">
            <a
              v-for="tag in articleTags"
              :key="tag"
              class="topic-chip"
              href="/articles/"
            >
              {{ tag }}
            </a>
          </div>
        </section>
      </aside>

      <main class="home-main">
        <section class="hero-band">
          <div class="hero-copy">
            <p class="hero-kicker">青微的博客</p>
            <h1>信息 · 思考 · 执行</h1>
            <p class="hero-lead">
              记录认知迭代的过程，保留技巧、观察与真实的思考。
            </p>
            <div class="hero-actions">
              <a class="action action-primary" href="/articles/">查看文章</a>
              <a class="action action-secondary" href="/about">认识青微</a>
            </div>
            <dl class="hero-stats">
              <div>
                <dt>文章</dt>
                <dd>{{ articles.length }}</dd>
              </div>
              <div>
                <dt>标签</dt>
                <dd>{{ totalTags }}</dd>
              </div>
              <div>
                <dt>主题</dt>
                <dd>{{ totalCategories }}</dd>
              </div>
            </dl>
          </div>

          <div class="hero-visual">
            <div class="mosaic">
              <a
                v-for="(article, index) in spotlight"
                :key="article.slug"
                class="mosaic-item"
                :class="{ 'is-lead': index === 0 }"
                :href="article.url"
              >
                <img v-if="article.cover" :src="article.cover" :alt="article.title" />
                <div v-else class="mosaic-placeholder" aria-hidden="true">
                  <FeatureIcon :name="index === 0 ? 'spark' : 'book'" />
                </div>
                <div class="mosaic-overlay">
                  <span>{{ article.date }}</span>
                  <strong>{{ article.title }}</strong>
                </div>
              </a>
            </div>
            <div class="hero-meta">
              <strong>最近更新</strong>
              <span>{{ latestLabel }}</span>
            </div>
          </div>
        </section>

        <section id="推荐文章" class="content-section">
          <div class="section-head">
            <div>
              <p class="panel-kicker">推荐</p>
              <h2>推荐文章</h2>
            </div>
            <a class="section-link" href="/articles/">查看全部</a>
          </div>

          <div class="featured-grid">
            <a
              v-for="article in spotlight"
              :key="article.slug"
              class="featured-card"
              :href="article.url"
            >
              <div class="featured-cover" :class="{ 'is-placeholder': !article.cover }">
                <img v-if="article.cover" :src="article.cover" :alt="article.title" />
                <div v-else class="featured-placeholder" aria-hidden="true">
                  <FeatureIcon name="book" />
                  <span>{{ article.categories[0] ?? '随笔' }}</span>
                </div>
              </div>
              <div class="featured-body">
                <div class="featured-meta">
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

        <section id="最新文章" class="content-section">
          <div class="section-head">
            <div>
              <p class="panel-kicker">最新</p>
              <h2>最新文章</h2>
            </div>
            <a class="section-link" href="/articles/">归档</a>
          </div>

          <div class="latest-list">
            <a
              v-for="article in latest"
              :key="article.slug"
              class="latest-card"
              :href="article.url"
            >
              <div class="latest-copy">
                <div class="latest-meta">
                  <time :datetime="article.date">{{ article.date }}</time>
                  <span v-if="article.categories[0]">{{ article.categories[0] }}</span>
                </div>
                <h3>{{ article.title }}</h3>
                <p>{{ article.description }}</p>
                <div class="tag-row">
                  <span
                    v-for="tag in article.tags.slice(0, 4)"
                    :key="tag"
                    class="mini-tag"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
              <span class="latest-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </section>
      </main>

      <aside class="home-sidebar home-aside">
        <section class="panel profile-card">
          <img class="avatar" src="/logo.svg" alt="青微的博客" />
          <p class="panel-kicker">关于</p>
          <h2>青微</h2>
          <p class="profile-lead">技术博主 / 个人记录 / 生活与折腾</p>
          <p class="profile-copy">
            这里记录工具、经验和判断，尽量把复杂事情讲清楚。
          </p>
          <div class="profile-links">
            <a href="/articles/">文章归档</a>
            <a href="/about">关于我</a>
            <a href="https://github.com/qingwei0326/qing-wei-blog" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </section>

        <section class="panel">
          <p class="panel-kicker">最近文章</p>
          <div class="compact-list">
            <a
              v-for="article in latest"
              :key="`${article.slug}-compact`"
              class="compact-item"
              :href="article.url"
            >
              <span>{{ article.date }}</span>
              <strong>{{ article.title }}</strong>
            </a>
          </div>
        </section>

        <section id="标签云" class="panel">
          <p class="panel-kicker">标签云</p>
          <div class="topic-cloud">
            <a v-for="tag in articleTags" :key="`aside-${tag}`" class="topic-chip" href="/articles/">
              {{ tag }}
            </a>
          </div>
        </section>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.home-board {
  width: 100%;
}

.home-grid {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr) 300px;
  gap: 24px;
  align-items: start;
}

.home-sidebar {
  display: grid;
  gap: 16px;
}

.panel {
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.sticky-panel {
  position: sticky;
  top: 96px;
}

.panel-kicker,
.hero-kicker {
  margin: 0 0 10px;
  color: var(--vp-c-text-3);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.link-list {
  display: grid;
  gap: 10px;
}

.link-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 10px 0;
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.link-item:hover {
  text-decoration: none;
}

.link-icon {
  display: inline-flex;
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand) 20%, transparent);
  border-radius: 8px;
  color: var(--vp-c-brand);
  background: color-mix(in srgb, var(--vp-c-brand) 8%, transparent);
}

.link-copy {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.link-copy strong {
  font-size: 0.95rem;
  line-height: 1.3;
}

.link-copy small {
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
  line-height: 1.5;
}

.topic-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.topic-chip {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 12px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand) 24%, transparent);
  border-radius: 999px;
  color: var(--vp-c-brand);
  background: color-mix(in srgb, var(--vp-c-brand) 8%, transparent);
  font-size: 0.82rem;
  text-decoration: none;
}

.home-main {
  display: grid;
  gap: 24px;
}

.hero-band {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 24px;
  align-items: start;
  padding: 8px 0 4px;
}

.hero-copy h1 {
  margin: 0;
  font-size: clamp(2rem, 3vw, 3.2rem);
  line-height: 1.08;
  letter-spacing: 0;
}

.hero-lead {
  margin: 14px 0 0;
  color: var(--vp-c-text-2);
  font-size: 1rem;
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid transparent;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 600;
}

.action-primary {
  color: #fff;
  background: var(--vp-c-brand);
}

.action-primary:hover {
  background: var(--vp-c-brand-dark);
  text-decoration: none;
}

.action-secondary {
  border-color: var(--vp-c-divider);
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 18px 0 0;
}

.hero-stats div {
  padding-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
}

.hero-stats dt {
  color: var(--vp-c-text-3);
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.hero-stats dd {
  margin: 6px 0 0;
  color: var(--vp-c-text-1);
  font-size: 1rem;
  font-weight: 700;
}

.hero-visual {
  display: grid;
  gap: 10px;
}

.mosaic {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  grid-template-rows: 140px 140px;
  gap: 10px;
}

.mosaic-item {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  text-decoration: none;
}

.mosaic-item.is-lead {
  grid-row: span 2;
}

.mosaic-item img,
.mosaic-placeholder {
  width: 100%;
  height: 100%;
  margin: 0;
}

.mosaic-item img {
  object-fit: cover;
}

.mosaic-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-brand);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--vp-c-brand) 22%, transparent), transparent 62%),
    var(--vp-c-bg-mute);
}

.mosaic-placeholder :deep(svg) {
  width: 52px;
  height: 52px;
}

.mosaic-overlay {
  position: absolute;
  inset: auto 0 0;
  padding: 14px;
  color: #fff;
  background: linear-gradient(180deg, rgb(0 0 0 / 0%), rgb(0 0 0 / 68%));
}

.mosaic-overlay span {
  display: block;
  font-size: 0.74rem;
  opacity: 0.85;
}

.mosaic-overlay strong {
  display: block;
  margin-top: 4px;
  font-size: 0.92rem;
  line-height: 1.45;
}

.hero-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.hero-meta strong {
  font-size: 0.88rem;
}

.hero-meta span {
  color: var(--vp-c-text-2);
  font-size: 0.84rem;
}

.content-section {
  display: grid;
  gap: 14px;
}

.section-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
}

.section-head h2 {
  margin: 0;
  font-size: 1.35rem;
  line-height: 1.2;
}

.section-link {
  color: var(--vp-c-brand);
  font-size: 0.9rem;
  text-decoration: none;
}

.section-link:hover {
  color: var(--vp-c-brand-dark);
  text-decoration: underline;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.featured-card {
  display: grid;
  gap: 12px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.featured-card:hover {
  border-color: var(--vp-c-brand);
  text-decoration: none;
}

.featured-cover {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--vp-c-bg-mute);
}

.featured-cover.is-placeholder {
  border-bottom: 1px solid color-mix(in srgb, var(--vp-c-brand) 16%, transparent);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--vp-c-brand) 18%, transparent), transparent 60%),
    var(--vp-c-bg-mute);
}

.featured-cover img {
  width: 100%;
  height: 100%;
  margin: 0;
  object-fit: cover;
}

.featured-placeholder {
  display: grid;
  gap: 10px;
  justify-items: center;
  color: var(--vp-c-brand);
}

.featured-placeholder :deep(svg) {
  width: 48px;
  height: 48px;
}

.featured-placeholder span {
  color: var(--vp-c-text-2);
  font-size: 0.84rem;
}

.featured-body {
  display: grid;
  gap: 10px;
  padding: 0 14px 14px;
}

.featured-meta,
.latest-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
}

.featured-body h3,
.latest-copy h3 {
  margin: 0;
  font-size: 1rem;
  line-height: 1.45;
}

.featured-body p,
.latest-copy p,
.profile-copy,
.profile-lead {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.92rem;
  line-height: 1.7;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.mini-tag {
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 0 10px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand) 18%, transparent);
  border-radius: 999px;
  color: var(--vp-c-brand);
  background: color-mix(in srgb, var(--vp-c-brand) 7%, transparent);
  font-size: 0.76rem;
}

.latest-list {
  display: grid;
  gap: 12px;
}

.latest-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.latest-card:hover {
  border-color: var(--vp-c-brand);
  text-decoration: none;
}

.latest-copy {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.latest-arrow {
  flex: 0 0 auto;
  color: var(--vp-c-brand);
  font-size: 1.15rem;
  line-height: 1;
}

.profile-card {
  display: grid;
  gap: 10px;
}

.avatar {
  width: 52px;
  height: 52px;
  margin: 0;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.profile-card h2 {
  margin: 0;
  font-size: 1.2rem;
}

.profile-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 4px;
}

.profile-links a {
  color: var(--vp-c-brand);
  font-size: 0.9rem;
  text-decoration: none;
}

.profile-links a:hover {
  color: var(--vp-c-brand-dark);
  text-decoration: underline;
}

.compact-list {
  display: grid;
  gap: 12px;
}

.compact-item {
  display: grid;
  gap: 4px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.compact-item:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.compact-item:hover {
  color: var(--vp-c-brand);
  text-decoration: none;
}

.compact-item span {
  color: var(--vp-c-text-3);
  font-size: 0.76rem;
}

.compact-item strong {
  font-size: 0.9rem;
  line-height: 1.55;
}

.home-aside {
  position: sticky;
  top: 96px;
}

@media (max-width: 1200px) {
  .home-grid {
    grid-template-columns: 200px minmax(0, 1fr);
  }

  .home-aside {
    position: static;
    grid-column: span 2;
  }

  .hero-band {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 920px) {
  .home-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .home-aside,
  .home-sidebar {
    grid-column: auto;
  }

  .sticky-panel,
  .home-aside {
    position: static;
  }

  .featured-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .featured-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .latest-card {
    align-items: flex-start;
  }

  .mosaic {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 120px 120px;
  }

  .mosaic-item.is-lead {
    grid-row: span 1;
  }

  .hero-stats {
    grid-template-columns: 1fr;
  }
}

</style>
