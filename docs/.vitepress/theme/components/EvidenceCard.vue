<template>
  <section class="evidence-card">
    <header class="evidence-card__header">
      <span v-if="label" class="evidence-card__badge">{{ label }}</span>
      <h3>{{ title }}</h3>
    </header>
    <div class="evidence-card__body">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
  title: string
}>()
</script>

<style scoped>
.evidence-card {
  margin: 24px 0;
  padding: 18px;
  border: 1px solid var(--vp-c-divider-light);
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 10px 28px rgb(15 23 42 / 5%);
}

.dark .evidence-card {
  background: var(--vp-c-bg-soft);
  box-shadow: none;
}

.evidence-card__header {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
}

.evidence-card__badge {
  display: inline-flex;
  flex: none;
  align-items: center;
  min-height: 25px;
  padding: 0 9px;
  border-radius: 8px;
  color: #fff;
  background: var(--vp-c-text-1);
  font-size: 0.75rem;
  font-weight: 800;
}

.evidence-card h3 {
  margin: 0;
  padding: 0;
  border: 0;
  color: var(--vp-c-text-1);
  font-size: 1.06rem;
  line-height: 1.45;
}

.evidence-card__body {
  display: flow-root;
}

.evidence-card__body :deep(p:first-child) {
  margin-top: 0;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  line-height: 1.75;
}

.evidence-card__body :deep(p:last-child) {
  margin-bottom: 0;
}

.evidence-card__body :deep(img) {
  width: min(100%, 430px);
  margin-top: 18px;
  margin-bottom: 18px;
}

.evidence-card__body :deep(.look-for) {
  margin: -2px 0 0;
  padding: 12px 14px;
  border-left: 4px solid #0d7c66;
  border-radius: 0 8px 8px 0;
  background: color-mix(in srgb, #0d7c66 8%, #fff);
  color: #31564d;
  font-size: 0.9rem;
  line-height: 1.7;
}

.dark .evidence-card__body :deep(.look-for) {
  background: color-mix(in srgb, #37c59a 13%, var(--vp-c-bg-soft));
  color: color-mix(in srgb, #37c59a 60%, var(--vp-c-text-1));
}
</style>
