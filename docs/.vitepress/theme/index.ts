import type { Theme } from 'vitepress'
import { h } from 'vue'
import Teek from 'vitepress-theme-teek'
import ArticleList from './components/ArticleList.vue'
import AboutProfile from './components/AboutProfile.vue'
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
      'teek-theme-enhance-bottom': () => h(ConfigSwitch)
    })
  },
  enhanceApp({ app }) {
    app.component('ArticleList', ArticleList)
    app.component('AboutProfile', AboutProfile)
    app.component('ConfigSwitch', ConfigSwitch)
    app.component('FeatureIcon', FeatureIcon)
    app.component('HomeBoard', HomeBoard)
    app.component('VPFeature', VPFeature)
  }
} satisfies Theme
