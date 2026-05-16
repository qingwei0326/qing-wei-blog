<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    icon?: string
    title?: string
    details?: string
    link?: string
    linkText?: string
    target?: string
    rel?: string
  }>(),
  {
    icon: 'spark'
  }
)

const tag = computed(() => (props.link ? 'a' : 'div'))
</script>

<template>
  <component
    :is="tag"
    class="vp-feature"
    :class="{ 'is-link': link }"
    :href="link"
    :target="target"
    :rel="rel"
  >
    <span class="vp-feature-icon" aria-hidden="true">
      <FeatureIcon :name="icon ?? 'spark'" />
    </span>
    <div class="vp-feature-body">
      <h3 v-if="title" class="vp-feature-title">{{ title }}</h3>
      <p v-if="details" class="vp-feature-details">{{ details }}</p>
    </div>
  </component>
</template>

<style scoped>
.vp-feature {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  min-height: 100%;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.vp-feature.is-link:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
  text-decoration: none;
  box-shadow: 0 10px 24px rgb(0 0 0 / 8%);
}

.vp-feature-icon {
  flex: 0 0 auto;
  width: 44px;
  height: 44px;
  padding: 10px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand) 28%, transparent);
  border-radius: 8px;
  color: var(--vp-c-brand);
  background: color-mix(in srgb, var(--vp-c-brand) 8%, transparent);
}

.vp-feature-body {
  min-width: 0;
}

.vp-feature-title {
  margin: 0 0 6px;
  font-size: 1rem;
  line-height: 1.3;
}

.vp-feature-details {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 1.7;
}
</style>
