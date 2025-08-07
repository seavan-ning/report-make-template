/**
 * @license
 * [report-make-template] 版权所有 (c)
   @Author seavan_ning
   @Email <seavan093@gmail.com>
 * 基于 MIT 许可证开源（完整协议见项目根目录 LICENSE 文件）
 * 允许修改/商用，但需保留本声明及作者信息和联系方式
 *
 * 项目地址：
 * github：https://github.com/seavan-ning/report-make-template
 * gitcode：https://gitcode.com/seavan_ning/report-make-template
 gitee：https://gitee.com/seavan_ning/report-make-template
 */
// @ts-check
// @ts-ignore
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/max-attributes-per-line': ['error', { singleline: 3 }]
  }
})
