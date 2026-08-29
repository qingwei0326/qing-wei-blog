<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

type ArticleFrontmatter = {
  title?: string
  description?: string
  date?: string
  tags?: string[]
  categories?: string[]
}

const { frontmatter, page } = useData<ArticleFrontmatter>()

const isArticle = computed(
  () =>
    page.value.relativePath.startsWith('articles/') &&
    page.value.relativePath !== 'articles/index.md'
)

const category = computed(() => frontmatter.value.categories?.[0] ?? '文章')
const tags = computed(() => frontmatter.value.tags?.slice(0, 4) ?? [])
const dateLabel = computed(() => {
  const value = frontmatter.value.date

  if (!value) return ''
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10)

  const time = Date.parse(value)
  return Number.isNaN(time) ? value : new Date(time).toISOString().slice(0, 10)
})
</script>

<template>
  <aside v-if="isArticle && frontmatter.description" class="article-summary">
    <div class="summary-main">
      <p class="summary-kicker">Quick Read</p>
      <p class="summary-text">{{ frontmatter.description }}</p>
    </div>

    <dl class="summary-meta">
      <div>
        <dt>分类</dt>
        <dd>{{ category }}</dd>
      </div>
      <div v-if="dateLabel">
        <dt>日期</dt>
        <dd>
          <time :datetime="dateLabel">{{ dateLabel }}</time>
        </dd>
      </div>
      <div v-if="tags.length">
        <dt>标签</dt>
        <dd class="summary-tags">
          <span v-for="tag in tags" :key="tag">{{ tag }}</span>
        </dd>
      </div>
    </dl>
  </aside>
</template>

<style scoped>
.article-summary {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  gap: 22px;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  margin: 0 0 34px;
  padding: 20px;
  border: 1px solid var(--vp-c-divider-light);
  border-radius: 8px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--vp-c-brand) 8%, transparent), transparent 48%),
    var(--vp-c-bg-soft);
}

.summary-kicker {
  margin: 0 0 8px;
  color: var(--vp-c-brand);
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.summary-text {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 1rem;
  font-weight: 650;
  line-height: 1.76;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.summary-meta {
  display: grid;
  gap: 12px;
  align-content: start;
  min-width: 0;
  margin: 0;
  padding: 0;
}

.summary-meta div {
  min-width: 0;
}

.summary-meta dt {
  margin: 0 0 3px;
  color: var(--vp-c-text-3);
  font-size: 0.74rem;
  font-weight: 700;
}

.summary-meta dd {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.4;
}

.summary-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 0;
}

.summary-tags span {
  padding: 3px 8px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand) 20%, var(--vp-c-divider-light));
  border-radius: 999px;
  background: color-mix(in srgb, var(--vp-c-brand) 6%, var(--vp-c-bg-soft));
  color: var(--vp-c-text-2);
  font-size: 0.76rem;
}

@media (max-width: 720px) {
  .article-summary {
    grid-template-columns: 1fr;
    padding: 16px;
  }

  .summary-meta {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .summary-meta div:last-child,
  .summary-tags {
    grid-column: 1 / -1;
  }
}

@media (max-width: 480px) {
  .article-summary {
    gap: 16px;
    padding: 16px;
  }

  .summary-meta {
    grid-template-columns: minmax(0, 1fr);
  }

  .summary-meta div {
    grid-column: 1 / -1;
  }
}
</style>
