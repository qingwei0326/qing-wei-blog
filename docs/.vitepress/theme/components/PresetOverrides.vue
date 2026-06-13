<script setup lang="ts">
// 无逻辑，纯样式组件 —— Teek 预设样式覆盖 & dark mode 覆盖
</script>

<template>
  <div class="preset-overrides" aria-hidden="true"></div>
</template>

<style>
/* 占位元素不参与任何布局 */
.preset-overrides {
  display: none;
}

/* ─── Teek 预设模式覆盖 ─── */

html[data-teek-preset="doc"] .home-board {
  --board-max-width: 980px;
}

html[data-teek-preset="doc"] .home-split {
  grid-template-columns: minmax(0, 1fr);
}

html[data-teek-preset="blog"] .home-board {
  --board-max-width: 1180px;
}

html[data-teek-preset="compact"] .home-board {
  --board-max-width: 1080px;
}

html[data-teek-preset="large"] .home-board {
  --board-max-width: 1120px;
}

html[data-teek-preset="wide"] .home-board {
  --board-max-width: 1240px;
  width: min(var(--board-max-width), calc(100vw - 24px));
  padding-top: 0;
}

html[data-teek-preset="wide"] .feature-strip {
  position: relative;
  z-index: 2;
  margin-top: -34px;
}

html[data-teek-preset="wide"] .home-board {
  width: min(var(--board-max-width), calc(100vw - 48px));
  padding-top: 34px;
}

html[data-teek-preset="wide"] .feature-strip {
  margin-top: 26px;
}

html[data-teek-preset="card"] .home-board {
  --board-max-width: 1020px;
}

html[data-teek-preset="card"] .feature-card,
html[data-teek-preset="card"] .panel-card {
  border-radius: 24px;
  box-shadow: 0 18px 48px rgb(15 23 42 / 8%);
}

/* ─── Dark mode 覆盖 ─── */

.dark .home-board {
  --hero-surface: rgb(24 36 55 / 88%);
  --hero-surface-strong: rgb(28 42 64 / 94%);
  --hero-surface-hover: rgb(34 50 75 / 98%);
  --hero-border: rgb(107 132 166 / 38%);
}

.dark .home-aside {
  border-right-color: rgb(107 132 166 / 28%);
}

.dark .feature-card__copy p {
  color: #d5e0ee;
}

.dark .section-link,
.dark .start-cta {
  color: #a8c7ff;
}

.dark .start-card,
.dark .panel-card {
  border-color: var(--hero-border);
  background: var(--hero-surface);
}

.dark .tag-cloud a {
  border-color: rgb(141 164 197 / 42%);
  color: #c8d7ea;
  background: rgb(141 164 197 / 10%);
}

.dark .topic-row strong,
.dark .start-step {
  color: #afbdd1;
}

.dark .blogger-shell .nav-btn,
.dark .blogger-social a {
  border-color: rgb(107 132 166 / 38%);
  color: #d0dbe9;
}

/* ─── 预设模式移动端适配 ─── */

@media (max-width: 820px) {
  html[data-teek-preset="wide"] .home-board {
    width: min(100%, 100vw);
  }
}

@media (max-width: 560px) {
  html .home-board {
    width: calc(100vw - 28px) !important;
    max-width: calc(100vw - 28px) !important;
    margin-right: auto !important;
    margin-left: auto !important;
    padding-top: 24px !important;
    overflow-x: clip;
  }

  html .home-main,
  html .feature-strip,
  html .content-section,
  html .start-grid,
  html .home-split {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box;
  }

  html .start-card,
  html .panel-card {
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box;
  }

  html .start-grid,
  html .home-split,
  html .feature-strip {
    grid-template-columns: minmax(0, 1fr) !important;
  }
}
</style>
