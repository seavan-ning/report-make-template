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
 gitee：https://gitee.com/seavan_ning/report-make-template
-->
<template>
  <div class="h-screen flex bg-gray-100 w-full">
    <!-- 左侧文件树区域 -->
    <div
      v-show="showFileTree"
      :style="{ width: leftWidthPercent + '%' }"
      class="text-white flex flex-col shadow-lg bg-gray-800 border-r-2 border-gray-600"
      :class="{ 'min-w-0': true }"
    >
      <!-- 文件树头部 -->
      <div class="px-4 py-3 border-b border-gray-600 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Icon name="i-heroicons-folder" class="w-4 h-4 text-blue-400" />
          <span class="text-sm font-medium">{{ $t('editor.explorer') }}</span>
        </div>
        <div class="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            class="p-1 hover:bg-gray-600 rounded transition-colors"
            @click="toggleFileTree"
          >
            <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- 文件树内容 -->
      <FileTree
        class="flex-1 overflow-auto"
        :files="fileStructure"
        @select-file="handleFileSelect"
        @refresh-files="handleRefreshFiles"
      />
    </div>

    <!-- 左侧拖拽分隔条 -->
    <div
      v-show="showFileTree"
      class="w-3 cursor-col-resize transition-all duration-200 flex-shrink-0 relative group flex items-center justify-center"
      title="拖拽调整左侧区域宽度"
      @mousedown="startResize('left', $event)"
    >
      <!-- 拖拽指示器 -->
      <div class="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-500 group-hover:bg-blue-400 transition-colors" />
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-60 group-hover:opacity-100 transition-opacity">
        <div class="flex flex-col space-y-1">
          <div class="w-1.5 h-1.5 bg-gray-600 group-hover:bg-white rounded-full transition-colors" />
          <div class="w-1.5 h-1.5 bg-gray-600 group-hover:bg-white rounded-full transition-colors" />
          <div class="w-1.5 h-1.5 bg-gray-600 group-hover:bg-white rounded-full transition-colors" />
        </div>
      </div>
    </div>

    <!-- 中间代码编辑区域 -->
    <div
      :style="{ width: centerWidthPercent + '%' }"
      class="flex flex-col bg-white border-r border-gray-300"
    >
      <!-- 编辑器头部 -->
      <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <div class="flex items-center gap-2">
          <button
            v-if="!showFileTree"
            class="p-1 hover:bg-gray-200 rounded transition-colors"
            :title="$t('editor.fileTree.showFileTree')"
            @click="toggleFileTree"
          >
            <Icon name="i-heroicons-bars-3" class="w-4 h-4" />
          </button>
          <Icon name="i-heroicons-code-bracket" class="w-4 h-4 text-green-600" />
          <span class="text-sm font-medium">
            {{ selectedFile ? selectedFile.name : $t('editor.noFileSelected') }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500">
            {{ selectedFile ? selectedFile.path : '' }}
          </span>
        </div>
      </div>

      <!-- 如果没有选中文件，显示欢迎信息 -->
      <div v-if="!selectedFile" class="flex-1 flex items-center justify-center bg-gray-50">
        <div class="text-center">
          <Icon name="i-heroicons-document-text" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            {{ $t('editor.welcomeTitle') }}
          </h3>
          <p class="text-gray-500 mb-4">
            {{ $t('editor.welcomeDescription') }}
          </p>
          <div class="text-sm text-gray-400">
            <p>{{ $t('editor.tips.selectVueFile') }}</p>
            <p>{{ $t('editor.tips.saveShortcut') }}</p>
            <p>{{ $t('editor.tips.realTimePreview') }}</p>
          </div>
        </div>
      </div>

      <!-- 保存状态指示器 -->
      <div v-if="saving || saveMessage" class="px-4 py-2 border-b border-gray-200">
        <div v-if="saving" class="flex items-center text-blue-600">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
          <span class="text-sm">{{ $t('common.saving') }}</span>
        </div>
        <div
          v-else-if="saveMessage"
          class="text-sm"
          :class="{
            'text-green-600': !saveMessage.startsWith('Error'),
            'text-red-600': saveMessage.startsWith('Error')
          }"
        >
          {{ saveMessage }}
        </div>
      </div>

      <!-- 代码编辑器内容 -->
      <CodeEditor
        class="flex-1 overflow-hidden"
        :file="selectedFile"
        :on-save="saveFile"
      />
    </div>

    <!-- 中间拖拽分隔条 -->
    <div
      class="w-3 cursor-col-resize transition-all duration-200 flex-shrink-0 relative group flex items-center justify-center"
      title="拖拽调整中间区域宽度"
      @mousedown="startResize('center', $event)"
    >
      <!-- 拖拽指示器 -->
      <div class="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-300 group-hover:bg-blue-400 transition-colors" />
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-60 group-hover:opacity-100 transition-opacity">
        <div class="flex flex-col space-y-1">
          <div class="w-1.5 h-1.5 bg-gray-400 group-hover:bg-white rounded-full transition-colors" />
          <div class="w-1.5 h-1.5 bg-gray-400 group-hover:bg-white rounded-full transition-colors" />
          <div class="w-1.5 h-1.5 bg-gray-400 group-hover:bg-white rounded-full transition-colors" />
        </div>
      </div>
    </div>

    <!-- 右侧预览区域 -->
    <div
      :style="{ width: rightWidthPercent + '%' }"
      class="flex flex-col bg-white"
    >
      <!-- 预览头部 -->
      <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-pink-500 to-rose-600">
        <!-- PDF预览功能区 -->
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <Icon name="i-heroicons-eye" class="w-5 h-5 text-white" />
            <span class="text-sm font-semibold text-white">PDF 预览</span>
          </div>

          <!-- 模式切换按钮 -->
          <div class="flex items-center gap-1 bg-white/20 rounded-lg p-1">
            <button
              class="px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 flex items-center gap-1"
              :class="[
                currentMode === 'development'
                  ? 'bg-white text-pink-600 shadow-sm'
                  : 'text-white hover:bg-white/20',
                isGeneratingPdf ? 'opacity-50 cursor-not-allowed' : ''
              ]"
              :disabled="isGeneratingPdf"
              @click="setPreviewMode('development')"
            >
              开发模式
            </button>
            <button
              class="px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 flex items-center gap-1"
              :class="[
                currentMode === 'pdf'
                  ? 'bg-white text-pink-600 shadow-sm'
                  : 'text-white hover:bg-white/20',
                isGeneratingPdf ? 'opacity-50 cursor-not-allowed' : ''
              ]"
              :disabled="isGeneratingPdf"
              @click="setPreviewMode('pdf')"
            >
              <Icon
                v-if="isGeneratingPdf && currentMode === 'pdf'"
                name="i-heroicons-arrow-path"
                class="w-3 h-3 animate-spin"
              />
              PDF模式
            </button>
          </div>
        </div>

        <!-- 右侧操作按钮 -->
        <div class="flex items-center gap-2">
          <button
            class="p-1.5 rounded transition-colors"
            :class="[
              isGeneratingPdf
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-white/20'
            ]"
            :title="isGeneratingPdf ? '正在生成PDF，请稍候...' : $t('editor.preview.refreshPreview')"
            :disabled="isGeneratingPdf"
            @click="!isGeneratingPdf && previewPanelRef?.refreshPreview()"
          >
            <Icon
              name="i-heroicons-arrow-path"
              class="w-4 h-4 text-white"
              :class="{ 'animate-spin': isGeneratingPdf }"
            />
          </button>
        </div>
      </div>

      <!-- 预览内容 -->
      <div class="flex-1 overflow-auto p-4">
        
        <div v-if="!selectedFile" class="flex items-center justify-center h-full">
          <div class="text-center">
            <Icon name="i-heroicons-eye-slash" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p class="text-gray-500">
              {{ $t('editor.preview.noPreviewAvailable') }}
            </p>
            <p class="text-xs text-gray-400">
              {{ $t('editor.preview.selectFileToPreview') }}
            </p>
          </div>
        </div>
        <div v-else-if="!isVueFile(selectedFile)" class="bg-white rounded-lg shadow-sm border p-4">
          <h3 class="text-lg font-medium mb-2">
            {{ selectedFile.name }}
          </h3>
          <p class="text-sm text-gray-600 mb-4">
            {{ selectedFile.path }}
          </p>
          <div class="bg-gray-50 rounded p-3">
            <p class="text-xs text-gray-500 mb-2">
              {{ $t('editor.preview.fileContentPreview') }}
            </p>
            <pre class="text-xs text-gray-700 whitespace-pre-wrap">{{ selectedFile.content?.substring(0, 500) }}{{ selectedFile.content && selectedFile.content.length > 500 ? '...' : '' }}</pre>
          </div>
        </div>
        <div v-else class="h-full">
          <!-- 新的预览面板组件 -->
          <PreviewPanel
            ref="previewPanelRef"
            :selected-file="selectedFile"
            :initial-mode="currentMode"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FileItem {
  name: string
  type: 'file' | 'folder'
  path: string
  children?: FileItem[]
  content?: string
}

// 导入组件
import PreviewPanel from '../components/PreviewPanel.vue'

// 响应式数据
const showFileTree = ref(true)
const selectedFile = ref<FileItem | null>(null)

// 预览面板引用
const previewPanelRef = ref<any>(null)

// 预览模式状态
const currentMode = ref<'development' | 'pdf'>('development')

// 计算属性：是否正在生成PDF
const isGeneratingPdf = computed(() => {
  return previewPanelRef.value?.isGeneratingPdf || false
})

// 使用百分比宽度，确保总和为100%
const leftWidthPercent = ref(15) // 左侧文件树 15%
const centerWidthPercent = ref(50) // 中间代码区域 50%
const rightWidthPercent = ref(35) // 右侧预览区域 35%

// 最小宽度限制（百分比）
const minLeftWidth = 15
const minCenterWidth = 30
const minRightWidth = 15

// 文件系统相关状态
const fileStructure = ref<FileItem[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const saving = ref(false)
const saveMessage = ref<string | null>(null)

// 预览相关状态现在由 Pinia store 管理

// 文件系统操作函数
const scanFiles = async (): Promise<FileItem[]> => {
  if (import.meta.server) {
    return []
  }

  loading.value = true
  error.value = null

  try {
    interface ApiResponse {
      success: boolean
      data?: FileItem[]
      message?: string
    }

    const response = await $fetch<ApiResponse>('/api/files/scan')

    if (response.success && response.data) {
      fileStructure.value = response.data
      return response.data
    } else {
      throw new Error('Failed to scan files')
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
    error.value = errorMessage
    console.error('Error scanning files:', err)
    throw err
  } finally {
    loading.value = false
  }
}

const getFileContent = async (filePath: string): Promise<string> => {
  try {
    interface ContentResponse {
      success: boolean
      data?: { path: string, content: string }
      message?: string
    }

    const response = await $fetch<ContentResponse>('/api/files/content', {
      query: { path: filePath }
    })

    if (response.success && response.data) {
      return response.data.content
    } else {
      throw new Error('Failed to get file content')
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
    console.error('Error getting file content:', err)
    throw new Error(errorMessage)
  }
}

const saveFile = async (filePath: string, content: string): Promise<void> => {
  saving.value = true
  saveMessage.value = null

  try {
    interface SaveResponse {
      success: boolean
      message?: string
      data?: { path: string }
    }

    const response = await $fetch<SaveResponse>('/api/files/save', {
      method: 'POST',
      body: {
        path: filePath,
        content
      }
    })

    if (!response.success) {
      throw new Error(response.message || 'Failed to save file')
    }

    console.log('File saved successfully:', filePath)
    saveMessage.value = `File saved: ${filePath.split('/').pop()}`

    // 保存成功后自动刷新预览
    if (selectedFile.value && isVueFile(selectedFile.value)) {
      // 刷新预览
      if (previewPanelRef.value) {
        previewPanelRef.value.refreshPreview()
      }
    }

    // 清除成功消息
    setTimeout(() => {
      saveMessage.value = null
    }, 3000)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
    console.error('Error saving file:', err)
    saveMessage.value = `Error: ${errorMessage}`

    // 清除错误消息
    setTimeout(() => {
      saveMessage.value = null
    }, 5000)

    throw new Error(errorMessage)
  } finally {
    saving.value = false
  }
}

// 初始化时扫描文件
onMounted(async () => {
  try {
    await scanFiles()
  } catch (err) {
    console.error('Failed to scan files on mount:', err)
  }
})

// 处理文件选择
const handleFileSelect = async (file: FileItem) => {
  if (file.type === 'file') {
    try {
      // 如果文件没有内容，尝试从服务器加载
      if (!file.content) {
        const content = await getFileContent(file.path)
        file.content = content
      }
      selectedFile.value = file
    } catch (err) {
      console.error('Failed to load file content:', err)
      // 即使加载失败，也设置选中的文件
      selectedFile.value = file
    }
  }
}

// 处理文件刷新
const handleRefreshFiles = async () => {
  try {
    await scanFiles()
  } catch (err) {
    console.error('Failed to refresh files:', err)
  }
}

// 检查是否为 Vue 文件
const isVueFile = (file: FileItem | null): boolean => {
  if (!file) return false
  return file.name.endsWith('.vue') && file.type === 'file'
}

// 预览模式管理
const setPreviewMode = (mode: 'development' | 'pdf') => {
  // 如果正在生成PDF，不允许切换模式
  if (isGeneratingPdf.value) {
    console.warn('Cannot switch mode while PDF is being generated')
    return
  }

  currentMode.value = mode
  // 通知PreviewPanel组件模式变化
  if (previewPanelRef.value && previewPanelRef.value.setMode) {
    const success = previewPanelRef.value.setMode(mode)
    if (!success) {
      // 如果设置失败，恢复原来的模式
      console.warn('Failed to set preview mode')
    }
  }
}

// 预览功能现在由 PreviewPanel 组件管理

// 切换文件树显示
const toggleFileTree = () => {
  showFileTree.value = !showFileTree.value

  if (showFileTree.value) {
    // 显示文件树时，重新分配宽度
    leftWidthPercent.value = 25
    centerWidthPercent.value = 50
    rightWidthPercent.value = 25
  } else {
    // 隐藏文件树时，将宽度分配给中间和右侧
    leftWidthPercent.value = 0
    centerWidthPercent.value = 60
    rightWidthPercent.value = 40
  }
}

// 拖拽调整大小相关
const isResizing = ref(false)
const resizeType = ref<'left' | 'center' | null>(null)

const startResize = (type: 'left' | 'center', event: MouseEvent) => {
  isResizing.value = true
  resizeType.value = type

  const startX = event.clientX
  const startLeftWidth = leftWidthPercent.value
  const startCenterWidth = centerWidthPercent.value
  const startRightWidth = rightWidthPercent.value

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.value) return

    const deltaX = e.clientX - startX
    const containerWidth = window.innerWidth
    const deltaPercent = (deltaX / containerWidth) * 100

    if (type === 'left') {
      // 调整左侧和中间的宽度
      const newLeftWidth = Math.max(minLeftWidth, Math.min(70, startLeftWidth + deltaPercent))
      const newCenterWidth = Math.max(minCenterWidth, startCenterWidth - deltaPercent)

      if (newLeftWidth >= minLeftWidth && newCenterWidth >= minCenterWidth) {
        leftWidthPercent.value = newLeftWidth
        centerWidthPercent.value = newCenterWidth
      }
    } else if (type === 'center') {
      // 调整中间和右侧的宽度
      const newCenterWidth = Math.max(minCenterWidth, Math.min(70, startCenterWidth + deltaPercent))
      const newRightWidth = Math.max(minRightWidth, startRightWidth - deltaPercent)

      if (newCenterWidth >= minCenterWidth && newRightWidth >= minRightWidth) {
        centerWidthPercent.value = newCenterWidth
        rightWidthPercent.value = newRightWidth
      }
    }
  }

  const handleMouseUp = () => {
    isResizing.value = false
    resizeType.value = null
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

onUnmounted(() => {
  // 清理工作
})
</script>
