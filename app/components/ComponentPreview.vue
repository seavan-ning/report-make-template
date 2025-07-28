<template>
  <div class="component-preview">
    <div v-if="error" class="error-message">
      <Icon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-red-500" />
      <p class="text-red-600">{{ error }}</p>
    </div>
    <div v-else-if="isGeneratingPdf" class="loading-message">
      <Icon name="i-heroicons-arrow-path" class="w-8 h-8 text-blue-500 animate-spin" />
      <p class="text-blue-600">正在生成PDF...</p>
    </div>
    <div v-else-if="!previewUrl" class="no-preview">
      <Icon name="i-heroicons-document" class="w-8 h-8 text-gray-400" />
      <p class="text-gray-500">无法预览此文件</p>
    </div>
    <div v-else class="preview-content">
      <iframe
        :key="refreshKey"
        :src="previewUrl"
        class="preview-iframe"
        frameborder="0"
        @load="onIframeLoad"
        @error="onIframeError"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  filePath: string
  fileContent?: string
  mode?: 'development' | 'pdf'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'development'
})

// 定义 emits
const emit = defineEmits<{
  refreshed: []
}>()

// 暴露刷新方法给父组件
const refreshKey = ref(0)
const error = ref<string | null>(null)
const previewUrl = ref<string | null>(null)
const isGeneratingPdf = ref(false)
const currentPdfUrl = ref<string | null>(null)

// 刷新预览的方法
const refresh = async () => {
  refreshKey.value++
  error.value = null
  console.log('Preview refreshed with key:', refreshKey.value)

  // 如果是PDF模式，重新生成PDF
  if (props.mode === 'pdf') {
    await generatePdf()
  } else {
    await computePreviewUrl()
  }

  emit('refreshed')
}

// 暴露方法给父组件
defineExpose({
  refresh
})

// 计算预览 URL
const computePreviewUrl = async () => {
  error.value = null

  try {
    // 检查是否为 Vue 文件
    if (!props.filePath.endsWith('.vue')) {
      previewUrl.value = null
      return
    }

    if (props.mode === 'pdf') {
      // PDF模式：生成PDF并显示PDF文件
      await generatePdf()
    } else {
      // 开发模式：直接显示页面
      // 将文件路径转换为路由路径
      // 例如: app/pages/pdf-template/T02/main.vue -> /pdf-template/T02/main
      let routePath = props.filePath
        .replace(/^app\/pages/, '') // 移除 app/pages 前缀
        .replace(/\.vue$/, '') // 移除 .vue 后缀

      // 构建完整的预览 URL
      const baseUrl = window.location.origin
      previewUrl.value = `${baseUrl}${routePath}`

      console.log('Development Preview URL:', previewUrl.value)
    }
  } catch (err) {
    console.error('Failed to compute preview URL:', err)
    error.value = err instanceof Error ? err.message : '生成预览链接失败'
    previewUrl.value = null
  }
}

// 生成PDF的方法
const generatePdf = async () => {
  if (!props.filePath.endsWith('.vue')) {
    return
  }

  isGeneratingPdf.value = true
  error.value = null

  try {
    // 将文件路径转换为路由路径
    let routePath = props.filePath
      .replace(/^app\/pages/, '') // 移除 app/pages 前缀
      .replace(/\.vue$/, '') // 移除 .vue 后缀

    console.log('Generating PDF for route:', routePath)

    // 调用 PDF 生成 API
    const response = await $fetch('/api/pdf/generate', {
      method: 'POST',
      body: {
        url: routePath,
        filename: `${props.filePath.split('/').pop()?.replace('.vue', '')}-${Date.now()}.pdf`,
        format: 'A4',
        printBackground: true
      }
    })

    if (response.success) {
      currentPdfUrl.value = response.data.pdfUrl
      previewUrl.value = response.data.pdfUrl
      console.log('PDF generated successfully:', response.data.filename)
    } else {
      throw new Error('PDF generation failed')
    }
  } catch (err) {
    console.error('Failed to generate PDF:', err)
    error.value = err instanceof Error ? err.message : 'PDF 生成失败'
    previewUrl.value = null
  } finally {
    isGeneratingPdf.value = false
  }
}

// 监听文件路径和模式变化
watch(() => [props.filePath, props.mode], () => {
  computePreviewUrl()
}, { immediate: true })

// iframe 加载事件
const onIframeLoad = () => {
  console.log('Preview iframe loaded successfully')
}

const onIframeError = () => {
  error.value = '预览页面加载失败'
}
</script>

<style scoped>
.component-preview {
  width: 100%;
  height: 100%;
  min-height: 200px;
}

.error-message,
.no-preview,
.loading-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  gap: 8px;
}

.preview-content {
  width: 100%;
  height: 100%;
  position: relative;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  min-height: 400px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
}
</style>
