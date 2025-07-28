<template>
  <div class="template-gallery">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-center mb-8">
        {{ $t('templates.title') }}
      </h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="template in templates"
          :key="template.id"
          class="template-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-semibold">{{ template.name }}</h3>
              <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {{ template.type }}
              </span>
            </div>
            
            <p class="text-gray-600 mb-4">{{ template.description }}</p>
            
            <div class="flex gap-2">
              <NuxtLink
                :to="template.previewUrl"
                class="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-center"
              >
                {{ $t('templates.preview') }}
              </NuxtLink>
              
              <button
                @click="copyTemplate(template)"
                class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                :title="$t('templates.copy')"
              >
                <Icon name="i-heroicons-document-duplicate" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

interface Template {
  id: string
  name: string
  description: string
  type: string
  previewUrl: string
  sourceUrl: string
}

const templates: Template[] = [
  {
    id: 'T01',
    name: t('templates.T01.name'),
    description: t('templates.T01.description'),
    type: t('templates.types.simple'),
    previewUrl: '/pdf-template/T01/main',
    sourceUrl: '/pdf-template/T01/main'
  },
  {
    id: 'T02',
    name: t('templates.T02.name'),
    description: t('templates.T02.description'),
    type: t('templates.types.invoice'),
    previewUrl: '/pdf-template/T02/main',
    sourceUrl: '/pdf-template/T02/main'
  }
]

const copyTemplate = (template: Template) => {
  // 这里可以实现复制模板的逻辑
  console.log('Copy template:', template.id)
  // 可以复制到剪贴板或者下载文件
}

// SEO
useSeoMeta({
  title: t('templates.title'),
  description: t('templates.description')
})
</script>

<style scoped>
.template-gallery {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.template-card {
  border: 1px solid #e5e7eb;
}

.template-card:hover {
  transform: translateY(-2px);
}
</style>
