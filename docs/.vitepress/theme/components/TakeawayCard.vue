<template>
  <section class="takeaway-card">
    <slot />
  </section>
</template>

<style scoped>
.takeaway-card {
  margin: 24px 0 6px;
  padding: 16px 18px;
  border-radius: 8px;
  color: #fff;
  background: var(--vp-c-text-1);
  font-weight: 700;
  line-height: 1.75;
}

.takeaway-card :deep(strong) {
  color: #fff;
}

.takeaway-card :deep(p) {
  margin: 0;
  color: inherit;
}

.dark .takeaway-card {
  background: color-mix(in srgb, var(--vp-c-brand) 28%, var(--vp-c-bg-mute));
}
</style>
