// https://nuxt.com/docs/api/configuration/nuxt-config
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@pinia/nuxt'
  ],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'light'
  },
  vite: {
    plugins: [tsconfigPaths()]
  },
  compatibilityDate: '2025-07-27',
  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
  i18n: {
    locales: ['zh-CN', 'en-US'],
    defaultLocale: 'zh-CN',
    strategy: 'prefix_except_default',
    vueI18n: './i18n.config.ts'
  }
})
