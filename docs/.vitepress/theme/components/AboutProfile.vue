<template>
  <section class="about-profile">
    <header class="profile-hero">
      <img class="profile-avatar" :src="avatar" :alt="name" />

      <div class="profile-copy">
        <p class="profile-kicker">关于我</p>
        <h1>{{ name }}</h1>
        <p class="profile-role">{{ role }}</p>
        <p class="profile-lead">
          我记录技术、生活和实际可复用的折腾结果。这里展示的是作者本人和博客本身，而不是空白占位。
        </p>

        <dl class="profile-stats">
          <div>
            <dt>文章</dt>
            <dd>{{ articles.length }}</dd>
          </div>
          <div>
            <dt>分类</dt>
            <dd>{{ articleCategories.length }}</dd>
          </div>
          <div>
            <dt>标签</dt>
            <dd>{{ articleTags.length }}</dd>
          </div>
        </dl>

        <div class="profile-links">
          <a class="link-pill link-pill--primary" :href="`mailto:${email}`">
            <span class="link-pill__label">邮箱</span>
            <span class="link-pill__value">{{ email }}</span>
          </a>
          <a
            v-if="github"
            class="link-pill"
            :href="github"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="link-pill__label">GitHub</span>
            <span class="link-pill__value">{{ githubHandle }}</span>
          </a>
        </div>
      </div>
    </header>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { articleCategories, articleTags, articles } from '../data/articles'

const props = defineProps<{
  name: string
  role: string
  email: string
  avatar: string
  github?: string
}>()

const githubHandle = computed(() => {
  if (!props.github) return ''
  const match = props.github.match(/github\.com\/([^/?#]+)/i)
  return match ? `@${match[1]}` : props.github
})
</script>

<style scoped>
.about-profile {
  width: min(960px, calc(100vw - 48px));
  margin: 0 auto;
  padding: 36px 0 56px;
}

.profile-hero {
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr);
  gap: 28px;
  align-items: start;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.profile-avatar {
  width: 160px;
  height: 160px;
  flex: none;
  border: 1px solid var(--vp-c-divider);
  border-radius: 24px;
  object-fit: cover;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 18px 40px rgb(15 23 42 / 8%);
}

.profile-copy {
  display: grid;
  gap: 14px;
}

.profile-kicker {
  margin: 0;
  color: var(--vp-c-brand);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.profile-copy h1 {
  margin: 0;
  font-size: 2.4rem;
  line-height: 1.15;
}

.profile-role {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 1rem;
  font-weight: 700;
}

.profile-lead {
  max-width: 58ch;
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.85;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(96px, max-content));
  gap: 12px;
  margin: 4px 0 0;
}

.profile-stats div {
  padding: 12px 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.profile-stats dt {
  color: var(--vp-c-text-3);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.profile-stats dd {
  margin: 4px 0 0;
  color: var(--vp-c-text-1);
  font-size: 1.35rem;
  font-weight: 800;
  line-height: 1.1;
}

.profile-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 2px;
}

.link-pill {
  display: inline-grid;
  grid-template-columns: auto auto;
  align-items: baseline;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.92rem;
  text-decoration: none;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.link-pill:hover {
  border-color: color-mix(in srgb, var(--vp-c-brand) 50%, var(--vp-c-divider));
  transform: translateY(-1px);
  text-decoration: none;
}

.link-pill__label {
  color: var(--vp-c-text-3);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.link-pill__value {
  color: var(--vp-c-text-1);
  font-weight: 700;
}

.link-pill--primary {
  border-color: color-mix(in srgb, var(--vp-c-brand) 35%, var(--vp-c-divider));
  background: color-mix(in srgb, var(--vp-c-brand) 6%, var(--vp-c-bg-soft));
}

.link-pill--primary .link-pill__value {
  color: var(--vp-c-brand);
}

@media (max-width: 860px) {
  .about-profile {
    width: min(100% - 28px, 760px);
  }

  .profile-hero {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
  }

  .profile-avatar {
    width: 128px;
    height: 128px;
  }

  .profile-copy h1 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .profile-stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
