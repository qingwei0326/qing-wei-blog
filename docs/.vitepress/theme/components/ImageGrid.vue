<template>
  <div class="image-grid">
    <slot />
  </div>
</template>

<style scoped>
.image-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 16px 0 4px;
}

.image-grid :deep(figure) {
  margin: 0;
}

.image-grid :deep(img) {
  width: 100%;
  margin: 0;
}

.image-grid :deep(figcaption) {
  margin-top: 8px;
  color: var(--vp-c-text-3);
  font-size: 0.78rem;
  line-height: 1.55;
  text-align: center;
}

@media (max-width: 720px) {
  .image-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
