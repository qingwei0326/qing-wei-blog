<template>
  <aside class="blogger-sidebar" aria-label="博主信息">
    <div class="blogger-card">
      <div class="blogger-avatar">
        <img :src="avatar" :alt="name" loading="lazy" />
      </div>

      <div class="blogger-identity">
        <h3 class="blogger-name">{{ name }}</h3>
        <p class="blogger-slogan">{{ slogan }}</p>
      </div>

      <dl class="blogger-stats">
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

      <div class="blogger-socials">
        <a
          :href="github"
          target="_blank"
          rel="noopener noreferrer"
          class="social-icon"
          title="GitHub"
          aria-label="GitHub"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.111.82-.261.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416c-.546-1.387-1.333-1.756-1.333-1.756c-1.089-.745.083-.729.083-.729c1.205.084 1.839 1.237 1.839 1.237c1.07 1.834 2.807 1.304 3.492.997c.107-.775.418-1.305.762-1.604c-2.665-.305-5.467-1.334-5.467-5.931c0-1.311.469-2.381 1.236-3.221c-.124-.303-.535-1.524.117-3.176c0 0 1.008-.322 3.301 1.23a11.5 11.5 0 0 1 3.003-.404c1.018.005 2.045.138 3.003.404c2.291-1.553 3.297-1.23 3.297-1.23c.653 1.653.242 2.874.118 3.176c.77.84 1.235 1.911 1.235 3.221c0 4.609-2.807 5.624-5.479 5.921c.43.372.823 1.102.823 2.222v3.293c0 .319.218.694.825.576C20.565 22.092 24 17.594 24 12.297c0-6.627-5.373-12-12-12"
            />
          </svg>
        </a>
        <a
          :href="`mailto:${email}`"
          class="social-icon"
          title="邮件"
          aria-label="邮件"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              fill="currentColor"
              d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 6.223L4 6.512V6h16zM4 18V9.044l7.386 5.745a.994.994 0 0 0 1.228 0L20 9.044L20.002 18H4z"
            />
          </svg>
        </a>
      </div>

      <nav class="blogger-nav">
        <a href="/articles/" class="nav-btn">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path fill="currentColor" d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM5 5h14v3H5V5zm0 14V10h14v9H5zm2-7h10v2H7v-2zm0 3h7v2H7v-2z"/>
          </svg>
          文章
        </a>
        <a href="/about" class="nav-btn">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
          关于
        </a>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { articleCategories, articleTags, articles } from '../data/articles'

defineProps<{
  name: string
  slogan: string
  avatar: string
  email: string
  github: string
}>()
</script>

<style scoped>
.blogger-sidebar {
  position: sticky;
  top: 84px;
  align-self: start;
}

.blogger-card {
  display: grid;
  gap: 15px;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  text-align: left;
}

.blogger-avatar {
  display: block;
}

.blogger-avatar img {
  width: 86px;
  height: 86px;
  object-fit: cover;
  border: 2px solid color-mix(in srgb, var(--vp-c-brand) 28%, transparent);
  border-radius: 8px;
  box-shadow: none;
}

.blogger-identity {
  display: grid;
  gap: 4px;
}

.blogger-name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 0;
}

.blogger-slogan {
  margin: 0;
  color: var(--vp-c-text-3);
  font-size: 0.86rem;
  line-height: 1.5;
}

.blogger-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin: 2px 0;
  padding: 14px 0;
  border-top: 1px solid var(--vp-c-divider-light);
  border-bottom: 1px solid var(--vp-c-divider-light);
}

.blogger-stats div {
  display: grid;
  gap: 2px;
}

.blogger-stats dt {
  color: var(--vp-c-text-3);
  font-size: 0.72rem;
  font-weight: 700;
}

.blogger-stats dd {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 1.15rem;
  font-weight: 800;
  line-height: 1.1;
}

.blogger-socials {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}

.social-icon {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-2);
  background: transparent;
  transition: color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.social-icon:hover {
  color: var(--vp-c-brand);
  border-color: color-mix(in srgb, var(--vp-c-brand) 50%, var(--vp-c-divider));
  transform: translateY(-1px);
}

.blogger-nav {
  display: grid;
  gap: 8px;
  margin-top: 4px;
}

.nav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  padding: 9px 0;
  border: 1px solid var(--vp-c-divider);
  border-width: 0 0 1px;
  border-radius: 0;
  color: var(--vp-c-text-1);
  background: transparent;
  font-size: 0.92rem;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}

.nav-btn:hover {
  color: var(--vp-c-brand);
  border-color: color-mix(in srgb, var(--vp-c-brand) 50%, var(--vp-c-divider));
  background: transparent;
  text-decoration: none;
}
</style>
