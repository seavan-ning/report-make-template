<!--
@license
[report-make-template] 版权所有 (c) seavan-ning <seavan093@gmail.com>
基于 MIT 许可证开源（完整协议见项目根目录 LICENSE 文件）
允许修改/商用，但需保留本声明及作者联系方式

项目地址：
 github：https://github.com/seavan-ning/report-make-template
 gitcode：https://gitcode.com/seavan_ning/report-make-template
-->
<template>
  <div class="preview-panel h-full flex flex-col bg-gray-50">
    <!-- 预览状态栏 -->
    <div class="h-8 bg-gray-100 border-b border-gray-200 flex items-center px-4">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full" :class="mode === 'development' ? 'bg-green-500' : 'bg-blue-500'"></div>
        <span class="text-xs text-gray-600">
          {{ mode === 'development' ? '开发预览模式' : 'PDF预览模式' }}
        </span>
        <!-- PDF生成状态和计时 -->
        <span
          v-if="isGeneratingPdf"
          class="flex items-center gap-1 text-blue-600 font-medium text-xs bg-blue-50 px-2 py-0.5 rounded"
        >
          <Icon name="i-heroicons-arrow-path" class="w-3 h-3 animate-spin" />
          正在生成 {{ formatDuration(pdfGenerationDuration) }}
        </span>
        <!-- PDF生成完成状态 -->
        <span
          v-else-if="pdfGenerationCompleted && mode === 'pdf'"
          class="flex items-center gap-1 text-green-600 font-medium text-xs bg-green-50 px-2 py-0.5 rounded"
        >
          <Icon name="i-heroicons-check-circle" class="w-3 h-3" />
          渲染完成，耗时：{{ formatDuration(lastCompletedDuration) }}
        </span>
      </div>
      <div class="ml-auto text-xs text-gray-500">
        {{ selectedFile ? selectedFile.name : '未选择文件' }}
      </div>
    </div>

    <!-- 预览内容区域 -->
    <div class="flex-1 overflow-hidden">
      <!-- 统一预览区域 -->
      <div class="h-full">
        <ComponentPreview
          v-if="selectedFile && selectedFile.path.endsWith('.vue')"
          ref="componentPreviewRef"
          :file-path="selectedFile.path"
          :mode="mode"
          class="h-full"
        />
        <div v-else class="h-full flex items-center justify-center">
          <div class="text-center text-gray-400">
            <Icon
              :name="mode === 'development' ? 'i-heroicons-code-bracket' : 'i-heroicons-document'"
              class="w-24 h-24 mx-auto mb-4 opacity-30"
            />
            <h3 class="text-lg font-medium mb-2">
              {{ mode === 'development' ? '开发预览' : 'PDF 预览' }}
            </h3>
            <p class="text-sm">选择一个 Vue 文件进行预览</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部状态栏 -->
    <div class="px-4 py-2 bg-white border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
      <div class="flex items-center gap-3">
        <span>
          {{ mode === 'development' ? '开发模式' : 'PDF模式' }}
        </span>
      </div>
      <span v-if="selectedFile">
        {{ selectedFile.name }}
      </span>
      <span v-else>
        未选择文件
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import ComponentPreview from './ComponentPreview.vue'

interface FileItem {
  name: string
  type: 'file' | 'folder'
  path: string
  children?: FileItem[]
  content?: string
}

interface Props {
  selectedFile?: FileItem | null
  initialMode?: 'development' | 'pdf'
}

const props = withDefaults(defineProps<Props>(), {
  initialMode: 'development'
})

// 预览模式状态
const mode = ref<'development' | 'pdf'>(props.initialMode)
const componentPreviewRef = ref<any>(null)

// 计算属性：是否正在生成PDF
const isGeneratingPdf = computed(() => {
  return componentPreviewRef.value?.isGeneratingPdf || false
})

// 计算属性：PDF生成时长
const pdfGenerationDuration = computed(() => {
  return componentPreviewRef.value?.pdfGenerationDuration || 0
})

// 计算属性：PDF生成是否完成
const pdfGenerationCompleted = computed(() => {
  return componentPreviewRef.value?.pdfGenerationCompleted || false
})

// 计算属性：最后完成的时长
const lastCompletedDuration = computed(() => {
  return componentPreviewRef.value?.lastCompletedDuration || 0
})

// 格式化时长的方法
const formatDuration = (ms: number) => {
  return componentPreviewRef.value?.formatDuration?.(ms) || '0ms'
}

// 计算属性 - 已移除previewUrl，现在由ComponentPreview内部处理

// 方法
const setMode = (newMode: 'development' | 'pdf') => {
  // 如果正在生成PDF，不允许切换模式
  if (isGeneratingPdf.value) {
    console.warn('Cannot switch mode while PDF is being generated')
    return false
  }

  mode.value = newMode
  return true
}

const refreshPreview = () => {
  if (componentPreviewRef.value && componentPreviewRef.value.refresh) {
    componentPreviewRef.value.refresh()
  }
}

// 暴露方法给父组件
defineExpose({
  refreshPreview,
  setMode,
  mode: readonly(mode),
  isGeneratingPdf: readonly(isGeneratingPdf)
})
</script>

<style scoped>
.preview-panel {
  background-image:
    linear-gradient(45deg, #f8f9fa 25%, transparent 25%),
    linear-gradient(-45deg, #f8f9fa 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #f8f9fa 75%),
    linear-gradient(-45deg, transparent 75%, #f8f9fa 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}
</style>
