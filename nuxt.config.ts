/**
 * @license
 * [report-make-template] 版权所有 (c) seavan-ning <seavan093@gmail.com>
 * 基于 MIT 许可证开源（完整协议见项目根目录 LICENSE 文件）
 * 允许修改/商用，但需保留本声明及作者联系方式
 *
 * 项目地址：
 * github：https://github.com/seavan-ning/report-make-template
 * gitcode：https://gitcode.com/seavan_ning/report-make-template
 */
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
  compatibilityDate: '2025-07-27',
  vite: {
    plugins: [tsconfigPaths()]
  },
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
  },
})
