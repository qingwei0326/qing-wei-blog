import type { Theme } from 'vitepress'
import { h } from 'vue'
import Teek from 'vitepress-theme-teek'
import ArticleList from './components/ArticleList.vue'
import ArticleNavigation from './components/ArticleNavigation.vue'
import AboutProfile from './components/AboutProfile.vue'
import CategoryArchive from './components/CategoryArchive.vue'
import ConfigSwitch from './components/ConfigSwitch.vue'
import FeatureIcon from './components/FeatureIcon.vue'
import HomeBoard from './components/HomeBoard.vue'
import VPFeature from './components/VPFeature.vue'
import 'virtual:teek-index.css'
import './style.css'

export default {
  extends: Teek,
  Layout() {
    return h(Teek.Layout, null, {
      'teek-theme-enhance-bottom': () => h(ConfigSwitch),
      'doc-after': () => h(ArticleNavigation)
    })
  },
  enhanceApp({ app }) {
    app.component('ArticleList', ArticleList)
    app.component('ArticleNavigation', ArticleNavigation)
    app.component('AboutProfile', AboutProfile)
    app.component('CategoryArchive', CategoryArchive)
    app.component('ConfigSwitch', ConfigSwitch)
    app.component('FeatureIcon', FeatureIcon)
    app.component('HomeBoard', HomeBoard)
    app.component('VPFeature', VPFeature)
  }
} satisfies Theme
