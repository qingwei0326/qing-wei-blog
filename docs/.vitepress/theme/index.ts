import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // We can use slots, for example:
      // 'home-features-after': () => h('div', 'Some extra content'),
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  }
} satisfies Theme
