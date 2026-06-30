import type { Theme } from 'vitepress'
import { h } from 'vue'
import Teek from 'vitepress-theme-teek'
import ArticleList from './components/ArticleList.vue'
import ArticleNavigation from './components/ArticleNavigation.vue'
import ArticleSummary from './components/ArticleSummary.vue'
import AboutProfile from './components/AboutProfile.vue'
import CalcCard from './components/CalcCard.vue'
import CategoryArchive from './components/CategoryArchive.vue'
import ConfigSwitch from './components/ConfigSwitch.vue'
import EvidenceCard from './components/EvidenceCard.vue'
import FeatureIcon from './components/FeatureIcon.vue'
import HomeBoard from './components/HomeBoard.vue'
import ImageGrid from './components/ImageGrid.vue'
import VPFeature from './components/VPFeature.vue'
import RouteCard from './components/RouteCard.vue'
import TakeawayCard from './components/TakeawayCard.vue'
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
    app.component('ArticleNavigation', ArticleNavigation)
    app.component('ArticleSummary', ArticleSummary)
    app.component('AboutProfile', AboutProfile)
    app.component('CalcCard', CalcCard)
    app.component('CategoryArchive', CategoryArchive)
    app.component('ConfigSwitch', ConfigSwitch)
    app.component('EvidenceCard', EvidenceCard)
    app.component('FeatureIcon', FeatureIcon)
    app.component('HomeBoard', HomeBoard)
    app.component('ImageGrid', ImageGrid)
    app.component('RouteCard', RouteCard)
    app.component('TakeawayCard', TakeawayCard)
    app.component('VPFeature', VPFeature)
  }
} satisfies Theme
