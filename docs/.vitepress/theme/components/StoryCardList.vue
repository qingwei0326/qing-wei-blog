<script setup lang="ts">
import { computed } from 'vue'
import { articles } from '../data/articles'
import { articleHref, siteLink } from '../utils/links'

const startHereSlugs = new Set(['beginner-guide', 'secondhand-phone-deal', 'ai-verification-cost'])
const latest = computed(() =>
  articles
    .filter((article) => article.slug !== articles[0]?.slug && !startHereSlugs.has(article.slug))
    .slice(0, 5)
)
</script>

<template>
  <div class="story-card-list">
    <section v-if="latest.length" class="content-section" aria-labelledby="latest-heading">
      <div class="section-head">
        <div>
          <p class="eyebrow">文章更新</p>
          <h2 id="latest-heading">最新文章</h2>
        </div>
        <a class="section-link" :href="siteLink('/articles/')">查看全部</a>
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

@media (max-width: 560px) {
  .section-head {
    align-items: flex-start;
    flex-direction: column;
  }
}

:global(.dark) .section-link {
  color: #a8c7ff;
}

:global(.dark) .timeline-item time {
  color: #afbdd1;
}
</style>
