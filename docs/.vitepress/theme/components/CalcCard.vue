<template>
  <section class="calc-card">
    <h3 v-if="title">{{ title }}</h3>
    <slot />
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<style scoped>
.calc-card {
  margin: 24px 0;
  padding: 18px;
  border: 1px solid color-mix(in srgb, #d97706 28%, var(--vp-c-divider-light));
  border-radius: 8px;
  background: color-mix(in srgb, #d97706 7%, var(--vp-c-bg-soft));
}

.calc-card h3 {
  margin: 0 0 12px;
  padding: 0;
  border: 0;
  color: var(--vp-c-text-1);
  font-size: 1.06rem;
  line-height: 1.45;
}

.calc-card :deep(p:first-child) {
  margin-top: 0;
}

.calc-card :deep(p:last-child) {
  margin-bottom: 0;
}

.calc-card :deep(table) {
  margin: 12px 0 0;
  background: var(--vp-c-bg-soft);
}

.calc-card :deep(ul) {
  margin: 10px 0 0;
}
</style>
