<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vitepress'

type Preset = {
  label: string
  value: string
}

const storageKey = 'qingwei-teek-config-preset'
const defaultPreset = 'blog'

const presets: Preset[] = [
  { label: '文档首页', value: 'doc' },
  { label: '博客默认', value: 'blog' },
  { label: 'Banner 小图', value: 'compact' },
  { label: 'Banner 大图', value: 'large' },
  { label: '博客全图', value: 'wide' },
  { label: '博客卡片', value: 'card' }
]

const legacyPresetMap: Record<string, string> = {
  small: 'compact',
  default: defaultPreset
}

const activePreset = ref(defaultPreset)
const route = useRoute()
const isHome = computed(() => route.path === '/')

const readPreset = () => {
  try {
    return localStorage.getItem(storageKey)
  } catch {
    return null
  }
}

const writePreset = (preset: string) => {
  try {
    localStorage.setItem(storageKey, preset)
  } catch {
    return
  }
}

const applyPreset = (preset: string) => {
  activePreset.value = preset
  document.documentElement.dataset.teekPreset = preset
  writePreset(preset)
}

const resetPreset = () => {
  applyPreset(defaultPreset)
}

onMounted(() => {
  const savedPreset = readPreset()
  const normalizedPreset = savedPreset ? (legacyPresetMap[savedPreset] ?? savedPreset) : activePreset.value
  const nextPreset = presets.some(item => item.value === normalizedPreset) ? normalizedPreset : activePreset.value

  applyPreset(nextPreset)
})
</script>

<template>
  <section v-if="isHome" class="config-switch" aria-label="配置切换">
    <div class="config-switch__head">
      <span>配置切换</span>
      <button class="config-switch__reset" type="button" @click="resetPreset">
        默认
      </button>
    </div>

    <div class="config-switch__grid">
      <button
        v-for="preset in presets"
        :key="preset.value"
        class="config-switch__item"
        :class="{ 'is-active': preset.value === activePreset }"
        type="button"
        @click="applyPreset(preset.value)"
      >
        {{ preset.label }}
      </button>
    </div>

    <p class="config-switch__hint">按 Teek README 的首页示例整理成 6 种可见风格。</p>
  </section>
</template>

<style scoped>
.config-switch {
  display: grid;
  gap: 8px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--vp-c-divider);
}

.config-switch__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 600;
}

.config-switch__reset {
  padding: 0;
  border: 0;
  color: var(--vp-c-text-2);
  background: transparent;
  font-size: 12px;
  line-height: 1.4;
}

.config-switch__reset:hover {
  color: var(--vp-c-brand);
  background: transparent;
  transform: none;
}

.config-switch__hint {
  margin: 0;
  color: var(--vp-c-text-3);
  font-size: 12px;
  line-height: 1.5;
}

.config-switch__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
}

.config-switch__item {
  min-width: 0;
  min-height: 34px;
  padding: 0 8px;
  border: 1px solid transparent;
  border-radius: 6px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-mute);
  font-size: 12px;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
}

.config-switch__item:hover,
.config-switch__item.is-active {
  border-color: color-mix(in srgb, var(--vp-c-brand) 32%, transparent);
  color: var(--vp-c-brand);
  background: color-mix(in srgb, var(--vp-c-brand) 12%, var(--vp-c-bg-soft));
  transform: none;
}
</style>
