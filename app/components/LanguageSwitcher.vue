<!--
@license
[report-make-template] 版权所有 (c)
   @Author seavan_ning
   @Email <seavan093@gmail.com>
基于 MIT 许可证开源（完整协议见项目根目录 LICENSE 文件）
允许修改/商用，但需保留本声明及作者信息和联系方式

项目地址：
 github：https://github.com/seavan-ning/report-make-template
 gitcode：https://gitcode.com/seavan_ning/report-make-template
 gitee：https://gitee.com/louisxc/report-make-template
-->
<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 px-3 py-1 text-sm text-white hover:bg-white/20 rounded transition-all duration-200"
    >
      <Icon name="i-heroicons-language" class="w-4 h-4" />
      {{ currentLanguage.name }}
      <Icon name="i-heroicons-chevron-down" class="w-3 h-3" />
    </button>

    <div
      v-if="showDropdown"
      class="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[120px]"
    >
      <button
        v-for="lang in languages"
        :key="lang.code"
        @click="switchLanguage(lang.code)"
        :disabled="lang.code === locale"
        class="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 disabled:bg-gray-50 disabled:text-gray-400 flex items-center gap-2"
      >
        <Icon name="i-heroicons-language" class="w-4 h-4" />
        {{ lang.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n()

interface LanguageOption {
  code: string
  name: string
}

const languages: LanguageOption[] = [
  { code: 'zh-CN', name: '中文' },
  { code: 'en-US', name: 'English' }
]

const showDropdown = ref(false)

const currentLanguage = computed(() => {
  return languages.find(lang => lang.code === locale.value) || languages[0]
})

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const switchLanguage = (newLocale: string) => {
  setLocale(newLocale)
  showDropdown.value = false
}

// 点击外部关闭下拉菜单
onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      showDropdown.value = false
    }
  })
})
</script>
