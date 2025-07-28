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
