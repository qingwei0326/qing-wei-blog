<template>
  <section class="route-card">
    <h3 v-if="title">{{ title }}</h3>
    <div class="route-card__body">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<style scoped>
.route-card {
  display: grid;
  gap: 12px;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  margin: 20px 0 28px;
  padding: 16px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand) 24%, var(--vp-c-divider-light));
  border-radius: 8px;
  background: color-mix(in srgb, var(--vp-c-brand) 8%, var(--vp-c-bg-soft));
}

.route-card h3 {
  margin: 0;
  padding: 0;
  border: 0;
  color: var(--vp-c-text-1);
  font-size: 1rem;
  line-height: 1.45;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.route-card__body {
  min-width: 0;
  max-width: 100%;
}

.route-card__body :deep(ol) {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.route-card__body :deep(li) {
  position: relative;
  min-height: 28px;
  min-width: 0;
  margin: 0;
  padding-left: 40px;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  line-height: 1.72;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.route-card__body :deep(li)::before {
  position: absolute;
  top: 0.1em;
  left: 0;
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 8px;
  color: #fff;
  background: var(--vp-c-brand);
  content: counter(list-item);
  font-size: 0.76rem;
  font-weight: 800;
}

.route-card__body :deep(strong) {
  color: var(--vp-c-text-1);
}

@media (max-width: 560px) {
  .route-card {
    padding: 14px;
  }

  .route-card__body :deep(li) {
    padding-left: 34px;
  }

  .route-card__body :deep(li)::before {
    width: 24px;
    height: 24px;
  }
}
</style>
