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
      <!-- PDF 模式使用 PDFObject -->
      <div
        v-if="mode === 'pdf' && previewUrl"
        :id="`pdf-container-${refreshKey}`"
        class="pdf-container"
      />
      <!-- 开发模式使用 iframe -->
      <iframe
        v-else
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
import PDFObject from 'pdfobject'

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

// 计时相关状态
const pdfGenerationStartTime = ref<number | null>(null)
const pdfGenerationDuration = ref<number>(0)
const timerInterval = ref<NodeJS.Timeout | null>(null)
const pdfGenerationCompleted = ref<boolean>(false)
const lastCompletedDuration = ref<number>(0)

// 刷新预览的方法
const refresh = async () => {
  refreshKey.value++
  error.value = null
  // 清除之前的完成状态
  pdfGenerationCompleted.value = false
  console.log('Preview refreshed with key:', refreshKey.value)

  // 如果是PDF模式，重新生成PDF
  if (props.mode === 'pdf') {
    await generatePdf()
  } else {
    await computePreviewUrl()
  }

  emit('refreshed')
}

// 计时器相关函数
const startTimer = () => {
  pdfGenerationStartTime.value = Date.now()
  pdfGenerationDuration.value = 0
  pdfGenerationCompleted.value = false

  // 清除之前的计时器
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }

  // 每100ms更新一次计时
  timerInterval.value = setInterval(() => {
    if (pdfGenerationStartTime.value) {
      pdfGenerationDuration.value = Date.now() - pdfGenerationStartTime.value
    }
  }, 100)
}

const stopTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }

  // 计算最终时长
  if (pdfGenerationStartTime.value) {
    pdfGenerationDuration.value = Date.now() - pdfGenerationStartTime.value
    lastCompletedDuration.value = pdfGenerationDuration.value
  }

  // 标记为完成状态
  pdfGenerationCompleted.value = true
}

// 格式化时长显示
const formatDuration = (ms: number) => {
  if (ms < 1000) {
    return `${ms}ms`
  } else {
    return `${(ms / 1000).toFixed(1)}s`
  }
}

// 暴露方法给父组件
defineExpose({
  refresh,
  isGeneratingPdf: readonly(isGeneratingPdf),
  pdfGenerationDuration: readonly(pdfGenerationDuration),
  pdfGenerationCompleted: readonly(pdfGenerationCompleted),
  lastCompletedDuration: readonly(lastCompletedDuration),
  formatDuration
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

  // 启动计时器
  startTimer()

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

      // 使用 PDFObject 嵌入 PDF
      await nextTick()
      // 等待一小段时间确保 DOM 完全更新
      setTimeout(() => {
        embedPdfWithPDFObject(response.data.pdfUrl)
      }, 100)
    } else {
      throw new Error('PDF generation failed')
    }
  } catch (err) {
    console.error('Failed to generate PDF:', err)
    error.value = err instanceof Error ? err.message : 'PDF 生成失败'
    previewUrl.value = null
  } finally {
    // 停止计时器
    stopTimer()
    isGeneratingPdf.value = false
  }
}

// 监听文件路径和模式变化
watch(() => [props.filePath, props.mode], () => {
  computePreviewUrl()
}, { immediate: true })

// 监听 previewUrl 变化，如果是 PDF 模式且有 URL，则嵌入 PDF
watch(() => [previewUrl.value, props.mode], async () => {
  if (props.mode === 'pdf' && previewUrl.value && !isGeneratingPdf.value) {
    await nextTick()
    setTimeout(() => {
      embedPdfWithPDFObject(previewUrl.value!)
    }, 100)
  }
})

// iframe 加载事件
const onIframeLoad = () => {
  console.log('Preview iframe loaded successfully')
}

const onIframeError = () => {
  error.value = '预览页面加载失败'
}

// 组件卸载时清理计时器
onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
})

// 使用 PDFObject 嵌入 PDF
const embedPdfWithPDFObject = (pdfUrl: string, retryCount = 0) => {
  const containerId = `pdf-container-${refreshKey.value}`
  const container = document.getElementById(containerId)

  if (!container) {
    console.error('PDF container not found:', containerId)

    // 如果容器没找到，重试最多3次
    if (retryCount < 3) {
      console.log(`Retrying to find container... (attempt ${retryCount + 1})`)
      setTimeout(() => {
        embedPdfWithPDFObject(pdfUrl, retryCount + 1)
      }, 200)
      return
    }

    error.value = 'PDF 容器初始化失败'
    return
  }

  console.log('PDF container found:', containerId)

  // 清空容器
  container.innerHTML = ''

  // 检查 PDFObject 是否支持
  if (!PDFObject.supportsPDFs) {
    console.warn('Browser does not support PDF embedding, using iframe fallback')
    container.innerHTML = `
      <iframe
        src="${pdfUrl}"
        style="width: 100%; height: 100%; border: 1px solid #e5e7eb; border-radius: 8px;"
        frameborder="0">
      </iframe>
    `
    return
  }

  // PDFObject 配置选项
  const options = {
    height: '100%',
    width: '100%',
    fallbackLink: `<p style="text-align: center; padding: 20px;">您的浏览器不支持 PDF 预览。<a href="${pdfUrl}" target="_blank" style="color: #3b82f6; text-decoration: underline;">点击这里下载 PDF</a></p>`,
    pdfOpenParams: {
      view: 'FitH',
      pagemode: 'none',
      toolbar: '1',
      statusbar: '0',
      messages: '0',
      navpanes: '0'
    }
  }

  // 嵌入 PDF
  try {
    const success = PDFObject.embed(pdfUrl, `#${containerId}`, options)
    console.log('PDF embedded with PDFObject:', success ? 'success' : 'fallback')

    if (!success) {
      console.warn('PDFObject failed to embed PDF, using iframe fallback')
      container.innerHTML = `
        <iframe
          src="${pdfUrl}"
          style="width: 100%; height: 100%; border: 1px solid #e5e7eb; border-radius: 8px;"
          frameborder="0">
        </iframe>
      `
    }
  } catch (err) {
    console.error('Error embedding PDF with PDFObject:', err)
    container.innerHTML = `
      <iframe
        src="${pdfUrl}"
        style="width: 100%; height: 100%; border: 1px solid #e5e7eb; border-radius: 8px;"
        frameborder="0">
      </iframe>
    `
  }
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

.pdf-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  position: relative;
}
</style>
