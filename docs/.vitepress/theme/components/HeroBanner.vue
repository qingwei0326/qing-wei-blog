<script setup lang="ts">
import { computed } from 'vue'
import { articleTags, articles } from '../data/articles'
import { articleHref, siteLink } from '../utils/links'

const blogCover = '/images/%E5%8D%9A%E5%AE%A2%E5%B0%81%E9%9D%A2.webp'

const heroPick = computed(() => articles[0])
const heroTags = computed(() => articleTags.slice(0, 6))
</script>

<template>
  <section class="home-hero">
    <div class="hero-backdrop" aria-hidden="true"></div>

    <div class="hero-copy">
      <p class="eyebrow">青微的博客</p>
      <h1>把日常选择写成可复用的判断。</h1>
      <p class="hero-lead">
        记录算账省钱、消费实战、工具效率和个人复盘里的真实经验。少一点口号，多一点可以照着做的细节。
      </p>

      <div class="hero-actions">
        <a class="action action-primary" :href="siteLink('/articles/')">浏览文章</a>
        <a class="action action-secondary" :href="siteLink('/about')">关于作者</a>
      </div>

      <div class="hero-tags" aria-label="站点主题">
        <span v-for="tag in heroTags" :key="tag">{{ tag }}</span>
      </div>
    </div>

    <div class="hero-side">
      <figure class="blog-cover">
        <img
          :src="heroPick?.cover || blogCover"
          :alt="heroPick?.title || '青微的博客封面'"
          decoding="async"
          fetchpriority="high"
        />
      </figure>

      <a
        v-if="heroPick"
        class="hero-focus"
        :href="articleHref(heroPick.url)"
      >
        <div class="hero-focus__meta">
          <span>本期推荐</span>
          <time :datetime="heroPick.date">{{ heroPick.date }}</time>
        </div>
        <strong>{{ heroPick.title }}</strong>
        <span>{{ heroPick.description }}</span>
        <span class="hero-focus__arrow" aria-hidden="true">
          <FeatureIcon name="arrow-right" />
        </span>
      </a>
    </div>
  </section>
</template>

<style scoped>
.home-hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
  gap: 24px;
  align-items: center;
  min-height: 360px;
  padding: 18px 0 38px;
}

.hero-backdrop {
  position: absolute;
  inset: 0;
  background-image: var(--home-cover-url);
  background-position: center;
  background-size: cover;
  opacity: 0;
  transform: scale(1.04);
  pointer-events: none;
}

.hero-copy,
.hero-side {
  position: relative;
  z-index: 1;
}

.hero-copy {
  display: grid;
  align-content: center;
}

.eyebrow {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}

.hero-copy h1 {
  margin: 0;
  font-size: 3rem;
  line-height: 1.1;
  letter-spacing: 0;
}

.hero-lead {
  max-width: 31rem;
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.9;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  border: 1px solid transparent;
  font-size: 0.94rem;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.action:hover {
  transform: translateY(-1px);
  text-decoration: none;
}

.action-primary {
  color: #fff;
  box-shadow: 0 14px 26px rgb(22 119 255 / 18%);
}

.action-primary:hover {
  color: #fff;
}

.action-secondary {
  border-color: var(--hero-border);
  color: var(--vp-c-text-1);
  background: var(--hero-surface);
}

.action-secondary:hover {
  color: var(--vp-c-brand-dark);
  background: var(--hero-surface-hover);
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(120px, 1fr));
  gap: 12px;
  margin: 0;
}

.hero-stats div {
  padding: 14px;
  border: 1px solid var(--hero-border);
  border-radius: 14px;
  background: var(--hero-surface);
  backdrop-filter: blur(8px);
}

.hero-stats dt {
  color: var(--vp-c-text-3);
  font-size: 0.78rem;
  font-weight: 700;
}

.hero-stats dd {
  margin: 5px 0 0;
  color: var(--vp-c-text-1);
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.35;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
}

.hero-tags span {
  display: inline-flex;
  align-items: center;
  padding: 0 12px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand) 18%, var(--vp-c-divider));
  font-size: 0.8rem;
  font-weight: 700;
}

.hero-side {
  display: grid;
}

.blog-cover {
  margin: 0;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.blog-cover img {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  object-fit: cover;
  object-position: center;
}

.hero-focus {
  display: grid;
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.hero-focus:hover {
  text-decoration: none;
}

.hero-focus__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--vp-c-text-3);
  font-size: 0.78rem;
  font-weight: 700;
}

.hero-focus strong {
  font-size: 1.02rem;
  line-height: 1.5;
}

.hero-focus > span {
  color: var(--vp-c-text-2);
  line-height: 1.8;
}

.hero-focus__arrow {
  width: 18px;
  height: 18px;
  color: var(--vp-c-brand);
}

@media (max-width: 1040px) {
  .home-hero {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 820px) {
  .home-hero {
    min-height: 0;
  }
}

@media (max-width: 560px) {
  .hero-stats {
    grid-template-columns: minmax(0, 1fr);
  }

  .hero-actions {
    align-items: flex-start;
    flex-direction: column;
  }
}

/* Second style block overrides */
.home-hero {
  overflow: visible;
  min-height: 360px;
  padding: 18px 0 38px;
  border: 0;
  border-bottom: 1px solid var(--vp-c-divider-light);
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  grid-template-columns: minmax(0, 0.98fr) minmax(280px, 360px);
}

.hero-backdrop {
  display: none;
}

.hero-copy {
  gap: 18px;
}

.eyebrow {
  color: color-mix(in srgb, var(--vp-c-brand) 74%, #1f2937);
  letter-spacing: 0.08em;
}

.hero-copy h1 {
  max-width: 10.5em;
  font-size: 3rem;
  line-height: 1.1;
}

.hero-lead {
  max-width: 31rem;
  font-size: 1rem;
}

.action {
  min-height: 42px;
  border-radius: 8px;
  box-shadow: none;
}

.action-primary {
  background: var(--vp-c-text-1);
}

.action-primary:hover {
  background: color-mix(in srgb, var(--vp-c-text-1) 88%, var(--vp-c-brand));
}

.hero-tags {
  gap: 8px;
}

.hero-tags span {
  min-height: 28px;
  border-radius: 8px;
  color: var(--vp-c-text-2);
  background: transparent;
}

.hero-side {
  gap: 14px;
  align-content: start;
  padding: 14px;
  border: 1px solid var(--vp-c-divider-light);
  border-radius: 10px;
  background: color-mix(in srgb, var(--vp-c-bg-soft) 72%, transparent);
}

.blog-cover {
  aspect-ratio: 16 / 10;
  border: 0;
  border-radius: 8px;
  box-shadow: none;
}

.blog-cover img {
  object-fit: cover;
  object-position: center;
}

.hero-focus {
  gap: 8px;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  backdrop-filter: none;
  min-width: 0;
}

.hero-focus:hover {
  border-color: color-mix(in srgb, var(--vp-c-brand) 58%, #f59e0b);
}

@media (max-width: 820px) {
  .home-hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 22px;
    padding: 6px 0 30px;
  }

  .hero-copy h1 {
    max-width: 8.5em;
    font-size: 2.35rem;
  }

  .hero-side {
    width: 100%;
  }

  .blog-cover {
    width: 100%;
  }

  .hero-focus {
    padding-left: 14px;
  }
}

@media (max-width: 560px) {
  .home-hero {
    width: 100%;
    max-width: 100%;
    gap: 18px;
    padding-top: 24px;
    overflow: visible;
  }

  .hero-copy {
    gap: 16px;
    min-width: 0;
  }

  .hero-copy h1 {
    max-width: none;
    overflow-wrap: anywhere;
    font-size: 1.92rem;
    line-height: 1.14;
    word-break: break-word;
  }

  .hero-lead {
    overflow-wrap: anywhere;
    font-size: 0.98rem;
    line-height: 1.78;
    word-break: break-word;
  }

  .hero-actions {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    width: 100%;
  }

  .action {
    width: 100%;
  }

  .hero-tags span {
    max-width: 100%;
    font-size: 0.76rem;
    overflow-wrap: anywhere;
    word-break: keep-all;
  }

  .hero-side {
    width: 100%;
    min-width: 0;
    padding: 12px;
    box-sizing: border-box;
  }

  .blog-cover {
    aspect-ratio: 16 / 9;
    max-height: 170px;
    background: color-mix(in srgb, var(--vp-c-bg-mute) 72%, transparent);
  }

  .hero-focus__meta {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .hero-focus strong {
    overflow-wrap: anywhere;
    font-size: 0.98rem;
    line-height: 1.55;
    word-break: break-word;
  }

  .hero-focus > span {
    display: -webkit-box;
    overflow: hidden;
    font-size: 0.92rem;
    line-height: 1.68;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow-wrap: anywhere;
    word-break: break-word;
  }
}
</style>

<style>
html[data-teek-preset="doc"] .home-hero {
  min-height: 0;
  padding: 4px 0 8px;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  grid-template-columns: minmax(0, 1fr);
}

html[data-teek-preset="doc"] .hero-backdrop,
html[data-teek-preset="doc"] .hero-side,
html[data-teek-preset="doc"] .hero-tags {
  display: none;
}

html[data-teek-preset="doc"] .hero-copy h1 {
  max-width: 11em;
  font-size: 3rem;
}

html[data-teek-preset="compact"] .home-hero {
  min-height: 340px;
  padding: 30px;
  grid-template-columns: minmax(0, 1fr) 300px;
  border-radius: 24px;
}

html[data-teek-preset="compact"] .hero-copy h1 {
  max-width: 12em;
  font-size: 2.6rem;
}

html[data-teek-preset="large"] .home-hero {
  min-height: 520px;
  padding: 52px;
  grid-template-columns: minmax(0, 1fr) 390px;
}

html[data-teek-preset="large"] .hero-backdrop {
  opacity: 0.18;
}

html[data-teek-preset="large"] .hero-copy h1 {
  font-size: 3.6rem;
}

html[data-teek-preset="large"] .blog-cover {
  aspect-ratio: 4 / 5;
}

html[data-teek-preset="wide"] .home-hero {
  min-height: calc(100vh - 92px);
  padding: 72px 52px 58px;
  border: 0;
  border-radius: 0 0 32px 32px;
  background: linear-gradient(130deg, rgb(7 16 34 / 82%), rgb(12 30 60 / 56%));
  box-shadow: 0 34px 80px rgb(15 23 42 / 18%);
}

html[data-teek-preset="wide"] .hero-backdrop {
  opacity: 0.48;
  transform: scale(1.08);
}

html[data-teek-preset="wide"] .eyebrow,
html[data-teek-preset="wide"] .hero-copy h1,
html[data-teek-preset="wide"] .hero-stats dd,
html[data-teek-preset="wide"] .hero-focus strong {
  color: #fff;
}

html[data-teek-preset="wide"] .hero-lead,
html[data-teek-preset="wide"] .hero-stats dt,
html[data-teek-preset="wide"] .hero-focus__meta,
html[data-teek-preset="wide"] .hero-focus > span {
  color: rgb(255 255 255 / 78%);
}

html[data-teek-preset="wide"] .hero-stats div,
html[data-teek-preset="wide"] .hero-tags span,
html[data-teek-preset="wide"] .hero-focus {
  border-color: rgb(255 255 255 / 18%);
  background: rgb(255 255 255 / 10%);
  box-shadow: none;
  backdrop-filter: blur(14px);
}

html[data-teek-preset="wide"] .blog-cover {
  display: none;
}

html[data-teek-preset="wide"] .action-secondary {
  border-color: rgb(255 255 255 / 24%);
  color: #fff;
  background: rgb(255 255 255 / 10%);
}

html[data-teek-preset="wide"] .action-secondary:hover {
  color: #fff;
  background: rgb(255 255 255 / 16%);
}

html[data-teek-preset="wide"] .home-hero {
  min-height: 0;
  padding: 0 0 46px;
  border-bottom: 1px solid var(--vp-c-divider-light);
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  grid-template-columns: minmax(0, 0.88fr) minmax(360px, 520px);
}

html[data-teek-preset="wide"] .hero-backdrop {
  display: none;
  opacity: 0;
}

html[data-teek-preset="wide"] .eyebrow {
  color: color-mix(in srgb, var(--vp-c-brand) 74%, #1f2937);
}

html[data-teek-preset="wide"] .hero-copy h1,
html[data-teek-preset="wide"] .hero-focus strong {
  color: var(--vp-c-text-1);
}

html[data-teek-preset="wide"] .hero-lead,
html[data-teek-preset="wide"] .hero-focus > span {
  color: var(--vp-c-text-2);
}

html[data-teek-preset="wide"] .hero-focus__meta {
  color: var(--vp-c-text-3);
}

html[data-teek-preset="wide"] .hero-side {
  align-content: start;
  padding: 16px;
  border: 1px solid var(--vp-c-divider-light);
  border-radius: 10px;
  background: color-mix(in srgb, var(--vp-c-bg-soft) 76%, transparent);
}

html[data-teek-preset="wide"] .blog-cover {
  display: block;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
}

html[data-teek-preset="wide"] .hero-tags span,
html[data-teek-preset="wide"] .hero-focus {
  border-color: color-mix(in srgb, var(--vp-c-brand) 18%, var(--vp-c-divider));
  background: transparent;
  box-shadow: none;
  backdrop-filter: none;
}

html[data-teek-preset="wide"] .hero-tags span {
  color: var(--vp-c-text-2);
}

html[data-teek-preset="wide"] .hero-focus {
  padding: 0;
}

html[data-teek-preset="wide"] .action-secondary {
  border-color: var(--hero-border);
  color: var(--vp-c-text-1);
  background: var(--hero-surface);
}

html[data-teek-preset="wide"] .action-secondary:hover {
  color: var(--vp-c-brand-dark);
  background: var(--hero-surface-hover);
}

html[data-teek-preset="card"] .home-hero {
  overflow: visible;
  min-height: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

html[data-teek-preset="card"] .hero-backdrop {
  display: none;
}

html[data-teek-preset="card"] .hero-copy,
html[data-teek-preset="card"] .hero-side {
  align-self: stretch;
  padding: 30px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 24px;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 20px 50px rgb(15 23 42 / 8%);
}

html[data-teek-preset="card"] .hero-side {
  align-content: space-between;
}

html[data-teek-preset="card"] .blog-cover {
  border: 0;
  border-radius: 18px;
  box-shadow: none;
}

.dark .home-hero {
  border-bottom-color: rgb(107 132 166 / 28%);
}

.dark .hero-lead {
  color: #d5e0ee;
}

.dark .eyebrow {
  color: #a8c7ff;
}

.dark .action-primary {
  color: #07111f;
  background: #f4f8ff;
}

.dark .action-primary:hover {
  color: #07111f;
  background: #ffffff;
}

.dark .action-secondary {
  border-color: var(--hero-border);
  background: var(--hero-surface);
}

.dark .hero-tags span {
  border-color: rgb(141 164 197 / 42%);
  color: #c8d7ea;
  background: rgb(141 164 197 / 10%);
}

.dark .hero-focus__meta {
  color: #afbdd1;
}

@media (max-width: 820px) {
  .home-hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 22px;
    padding: 6px 0 30px;
  }

  .hero-copy h1 {
    max-width: 8.5em;
    font-size: 2.35rem;
  }

  .hero-side {
    width: 100%;
  }

  .blog-cover {
    width: 100%;
  }

  .hero-focus {
    padding-left: 14px;
  }
}

@media (max-width: 560px) {
  .home-hero {
    width: 100%;
    max-width: 100%;
    gap: 18px;
    padding-top: 24px;
    overflow: visible;
  }

  .hero-copy {
    gap: 16px;
    min-width: 0;
  }

  .hero-copy h1 {
    max-width: none;
    overflow-wrap: anywhere;
    font-size: 1.92rem;
    line-height: 1.14;
    word-break: break-word;
  }

  .hero-lead {
    overflow-wrap: anywhere;
    font-size: 0.98rem;
    line-height: 1.78;
    word-break: break-word;
  }

  .hero-actions {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    width: 100%;
  }

  .action {
    width: 100%;
  }

  .hero-tags span {
    max-width: 100%;
    font-size: 0.76rem;
    overflow-wrap: anywhere;
    word-break: keep-all;
  }

  .hero-side {
    width: 100%;
    min-width: 0;
    padding: 12px;
    box-sizing: border-box;
  }

  .blog-cover {
    aspect-ratio: 16 / 9;
    max-height: 170px;
    background: color-mix(in srgb, var(--vp-c-bg-mute) 72%, transparent);
  }

  .hero-focus__meta {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .hero-focus strong {
    overflow-wrap: anywhere;
    font-size: 0.98rem;
    line-height: 1.55;
    word-break: break-word;
  }

  .hero-focus > span {
    display: -webkit-box;
    overflow: hidden;
    font-size: 0.92rem;
    line-height: 1.68;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow-wrap: anywhere;
    word-break: break-word;
  }
}

html[data-teek-preset="wide"] .feature-strip {
  margin-top: 26px;
}
</style>
