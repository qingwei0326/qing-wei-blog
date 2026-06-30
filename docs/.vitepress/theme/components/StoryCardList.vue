<script setup lang="ts">
import { computed } from 'vue'
import { articles } from '../data/articles'
import { articleHref, siteLink } from '../utils/links'

const spotlight = computed(() => articles.slice(1, 4))
const latest = computed(() => articles.slice(4, 9))
const latestLabel = computed(() => articles[0]?.date || '持续更新')
</script>

<template>
  <div class="story-card-list">
    <section class="content-section" aria-labelledby="spotlight-heading">
      <div class="section-head">
        <div>
          <p class="eyebrow">Spotlight</p>
          <h2 id="spotlight-heading">近期值得看</h2>
        </div>
        <a class="section-link" :href="siteLink('/articles/')">查看全部</a>
      </div>

      <div class="story-grid">
        <a
          v-for="(article, index) in spotlight"
          :key="article.slug"
          class="story-card"
          :class="{ 'is-lead': index === 0 }"
          :href="articleHref(article.url)"
        >
          <div class="story-media" :class="{ 'is-placeholder': !article.cover }">
            <img v-if="article.cover" :src="article.cover" :alt="article.title" loading="lazy" />
            <div v-else class="visual-placeholder" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
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

    <section v-if="latest.length" class="content-section" aria-labelledby="latest-heading">
      <div class="section-head">
        <div>
          <p class="eyebrow">Latest</p>
          <h2 id="latest-heading">更多文章</h2>
        </div>
        <a class="section-link" :href="siteLink('/articles/')">全部归档</a>
      </div>

      <div class="timeline-list">
        <a
          v-for="article in latest"
          :key="`${article.slug}-latest`"
          class="timeline-item"
          :href="articleHref(article.url)"
        >
          <time :datetime="article.date">{{ article.date }}</time>
          <strong>{{ article.title }}</strong>
          <span>{{ article.description }}</span>
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
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

.story-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.story-card {
  display: grid;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 84%, transparent);
  border-radius: 22px;
  background: var(--vp-c-bg-soft);
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

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.mini-tag {
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

.timeline-list {
  display: grid;
  gap: 10px;
}

.timeline-item {
  display: grid;
  gap: 5px;
  padding: 15px 0;
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.timeline-item:hover {
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

.visual-placeholder svg {
  width: 58px;
  height: 58px;
}

@media (max-width: 1040px) {
  .story-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .story-card.is-lead {
    grid-column: auto;
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 820px) {
  .story-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 560px) {
  .section-head {
    align-items: flex-start;
    flex-direction: column;
  }
}

/* Teek preset overrides */
:global(html[data-teek-preset="doc"]) .story-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

:global(html[data-teek-preset="doc"]) .story-card.is-lead {
  grid-column: auto;
  grid-template-columns: minmax(0, 1fr);
}

:global(html[data-teek-preset="compact"]) .story-card.is-lead {
  grid-column: auto;
  grid-template-columns: minmax(0, 1fr);
}

:global(html[data-teek-preset="card"]) .story-card {
  border-radius: 24px;
  box-shadow: 0 18px 48px rgb(15 23 42 / 8%);
}

:global(html[data-teek-preset="card"]) .story-card.is-lead {
  grid-column: auto;
  grid-template-columns: minmax(0, 1fr);
}

/* Dark mode overrides */
:global(.dark) .story-card {
  border-color: rgb(107 132 166 / 38%);
  background: rgb(24 36 55 / 88%);
}

:global(.dark) .story-body p {
  color: #d5e0ee;
}

:global(.dark) .section-link {
  color: #a8c7ff;
}

:global(.dark) .mini-tag {
  border-color: rgb(141 164 197 / 42%);
  color: #c8d7ea;
  background: rgb(141 164 197 / 10%);
}

:global(.dark) .meta-row,
:global(.dark) .timeline-item time {
  color: #afbdd1;
}

/* Mobile fix for wide overflow */
@media (max-width: 560px) {
  .story-grid {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
  }

  .story-card {
    max-width: 100% !important;
    min-width: 0 !important;
  }

  .story-card.is-lead {
    grid-template-columns: minmax(0, 1fr) !important;
  }

  .story-body h3,
  .story-body p {
    max-width: 100% !important;
    white-space: normal !important;
    overflow-wrap: break-word !important;
    word-break: normal !important;
  }
}
</style>
