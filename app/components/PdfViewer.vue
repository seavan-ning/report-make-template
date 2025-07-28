<template>
  <div class="pdf-viewer h-full flex flex-col">
    <!-- PDF工具栏 -->
    <div class="pdf-toolbar bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <UButton
          icon="i-heroicons-minus"
          size="xs"
          color="neutral"
          variant="ghost"
          :disabled="scale <= 0.5"
          @click="zoomOut"
        />
        <span class="text-sm text-gray-600 dark:text-gray-400 min-w-[60px] text-center">
          {{ Math.round(scale * 100) }}%
        </span>
        <UButton
          icon="i-heroicons-plus"
          size="xs"
          color="neutral"
          variant="ghost"
          :disabled="scale >= 3"
          @click="zoomIn"
        />
      </div>

      <div class="flex items-center gap-2">
        <UButton
          icon="i-heroicons-chevron-left"
          size="xs"
          color="neutral"
          variant="ghost"
          :disabled="currentPage <= 1"
          @click="previousPage"
        />
        <span class="text-sm text-gray-600 dark:text-gray-400">
          {{ currentPage }} / {{ totalPages }}
        </span>
        <UButton
          icon="i-heroicons-chevron-right"
          size="xs"
          color="neutral"
          variant="ghost"
          :disabled="currentPage >= totalPages"
          @click="nextPage"
        />
      </div>
    </div>

    <!-- PDF内容区域 -->
    <div class="pdf-content flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 p-4">
      <div v-if="!pdfUrl" class="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div class="text-center">
          <Icon name="i-heroicons-document" class="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p class="text-lg">
            没有PDF文件可预览
          </p>
          <p class="text-sm mt-2">
            请上传或选择一个PDF文件
          </p>
        </div>
      </div>

      <div v-else-if="loading" class="h-full flex items-center justify-center">
        <div class="text-center">
          <Icon name="i-heroicons-arrow-path" class="w-8 h-8 mx-auto mb-2 animate-spin text-blue-500" />
          <p class="text-sm text-gray-600 dark:text-gray-400">
            加载PDF中...
          </p>
        </div>
      </div>

      <div v-else-if="error" class="h-full flex items-center justify-center text-red-500">
        <div class="text-center">
          <Icon name="i-heroicons-exclamation-triangle" class="w-16 h-16 mx-auto mb-4" />
          <p class="text-lg">
            PDF加载失败
          </p>
          <p class="text-sm mt-2">
            {{ error }}
          </p>
        </div>
      </div>

      <div v-else class="pdf-pages flex flex-col items-center gap-4">
        <div
          v-for="pageNum in totalPages"
          :key="pageNum"
          class="pdf-page bg-white shadow-lg"
          :style="{ transform: `scale(${scale})`, transformOrigin: 'top center' }"
        >
          <canvas
            :ref="el => setCanvasRef(el, pageNum)"
            class="block border border-gray-300"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as pdfjsLib from 'pdfjs-dist'

// 设置PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

const props = defineProps<{
  pdfUrl?: string
}>()

const loading = ref(false)
const error = ref('')
const scale = ref(1)
const currentPage = ref(1)
const totalPages = ref(0)
const pdfDocument = ref<any>(null)
const canvasRefs = ref<Map<number, HTMLCanvasElement>>(new Map())

const setCanvasRef = (el: HTMLCanvasElement | null, pageNum: number) => {
  if (el) {
    canvasRefs.value.set(pageNum, el)
  }
}

const loadPdf = async () => {
  if (!props.pdfUrl) return

  loading.value = true
  error.value = ''

  try {
    const pdf = await pdfjsLib.getDocument(props.pdfUrl).promise
    pdfDocument.value = pdf
    totalPages.value = pdf.numPages
    currentPage.value = 1

    // 渲染所有页面
    await nextTick()
    for (let pageNum = 1; pageNum <= totalPages.value; pageNum++) {
      await renderPage(pageNum)
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '未知错误'
    console.error('PDF loading error:', err)
  } finally {
    loading.value = false
  }
}

const renderPage = async (pageNum: number) => {
  if (!pdfDocument.value) return

  try {
    const page = await pdfDocument.value.getPage(pageNum)
    const canvas = canvasRefs.value.get(pageNum)

    if (!canvas) return

    const context = canvas.getContext('2d')
    const viewport = page.getViewport({ scale: 1.5 })

    canvas.height = viewport.height
    canvas.width = viewport.width

    const renderContext = {
      canvasContext: context,
      viewport: viewport
    }

    await page.render(renderContext).promise
  } catch (err) {
    console.error(`Error rendering page ${pageNum}:`, err)
  }
}

const zoomIn = () => {
  if (scale.value < 3) {
    scale.value = Math.min(3, scale.value + 0.25)
  }
}

const zoomOut = () => {
  if (scale.value > 0.5) {
    scale.value = Math.max(0.5, scale.value - 0.25)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    scrollToPage(currentPage.value)
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    scrollToPage(currentPage.value)
  }
}

const scrollToPage = (pageNum: number) => {
  const canvas = canvasRefs.value.get(pageNum)
  if (canvas) {
    canvas.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

watch(() => props.pdfUrl, () => {
  if (props.pdfUrl) {
    loadPdf()
  }
}, { immediate: true })

onMounted(() => {
  if (props.pdfUrl) {
    loadPdf()
  }
})
</script>

<style scoped>
.pdf-content {
  background-image:
    radial-gradient(circle, #e5e7eb 1px, transparent 1px);
  background-size: 20px 20px;
}

.dark .pdf-content {
  background-image:
    radial-gradient(circle, #374151 1px, transparent 1px);
}

.pdf-page {
  margin-bottom: 20px;
  transition: transform 0.2s ease;
}

.pdf-pages {
  padding: 20px;
}

/* 自定义滚动条 */
.pdf-content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.pdf-content::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.dark .pdf-content::-webkit-scrollbar-track {
  background: #374151;
}

.pdf-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.dark .pdf-content::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.pdf-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark .pdf-content::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
