import DefaultTheme from 'vitepress/theme'
import HomePage from './components/HomePage.vue'
import type { Theme } from 'vitepress'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: HomePage,

  /*
   * Fallback for environments where a tap on the hamburger button
   * does not produce a `click` event (e.g. Chrome/Edge DevTools
   * device mode's touch emulation on some setups). We watch
   * `touchend` directly and forward it to the button's click
   * handler, so the mobile nav menu can always be opened.
   */
  enhanceApp() {
    if (typeof document === 'undefined') return
    // Unique marker so the production bundle can be grepped.
    const MARK = 'hamburger-tap-fallback'

    let tapStartX = 0
    let tapStartY = 0
    let tracking = false
    // Short window after a handled tap: swallow the browser's
    // synthesised `click` (isTrusted) so it can't double-toggle.
    let suppressTrustedClickUntil = 0

    document.addEventListener(
      'touchstart',
      (e) => {
        const t = (e as TouchEvent).changedTouches?.[0]
        if (!t) return
        tapStartX = t.clientX
        tapStartY = t.clientY
        tracking = true
      },
      { capture: true, passive: true },
    )

    document.addEventListener(
      'touchend',
      (e) => {
        if (!tracking) return
        tracking = false

        const t = (e as TouchEvent).changedTouches?.[0]
        if (!t) return
        // Treat it as a scroll when the finger moved noticeably.
        if (Math.abs(t.clientX - tapStartX) > 10 || Math.abs(t.clientY - tapStartY) > 10) return

        const target = e.target as HTMLElement | null
        const btn = target?.closest?.('.VPNavBarHamburger') as HTMLButtonElement | null
        if (!btn) return

        e.preventDefault()
        suppressTrustedClickUntil = Date.now() + 350
        btn.click()
        void MARK
      },
      { capture: true, passive: false },
    )

    // Swallow the browser-synthesised click after our handled tap;
    // script-initiated clicks (isTrusted === false, from btn.click())
    // must still reach the Vue handler.
    document.addEventListener(
      'click',
      (e) => {
        if (!e.isTrusted || Date.now() >= suppressTrustedClickUntil) return
        const target = e.target as HTMLElement | null
        if (target?.closest?.('.VPNavBarHamburger')) {
          e.stopPropagation()
          e.preventDefault()
        }
      },
      { capture: true },
    )
  },
} satisfies Theme
