import DefaultTheme from 'vitepress/theme'
import HomePage from './components/HomePage.vue'
import type { Theme } from 'vitepress'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: HomePage,
} satisfies Theme
