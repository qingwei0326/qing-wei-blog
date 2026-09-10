<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

type ArticleFrontmatter = {
  description?: string
}

const { frontmatter, page } = useData<ArticleFrontmatter>()

const isArticle = computed(
  () =>
    page.value.relativePath.startsWith('articles/') &&
    page.value.relativePath !== 'articles/index.md'
)

</script>

<template>
  <aside v-if="isArticle && frontmatter.description" class="article-summary">
    <div class="summary-main">
      <p class="summary-kicker">文章导读</p>
      <p class="summary-text">{{ frontmatter.description }}</p>
    </div>
  </aside>
</template>

<style scoped>
.article-summary {
  display: block;
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

@media (max-width: 480px) {
  .article-summary {
    padding: 16px;
  }
}
</style>
