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
  <div class="code-editor h-full flex flex-col bg-white">
    <div v-if="!file" class="flex-1 flex items-center justify-center text-gray-400">
      <div class="text-center">
        <Icon name="i-heroicons-document-text" class="w-20 h-20 mx-auto mb-4 opacity-30" />
        <h3 class="text-lg font-medium mb-2">
          No file selected
        </h3>
        <p class="text-sm">
          Select a file from the explorer to view its content
        </p>
      </div>
    </div>

    <div v-else class="flex-1 flex flex-col overflow-hidden">
      <!-- 编辑器工具栏 -->
      <div class="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div class="flex items-center gap-2">
          <!-- 主题选择器 -->
          <USelect v-model="selectedTheme" :items="themeItems" class="w-48" />

          <!-- 字体大小调整 -->
          <USelect v-model="fontSize" :items="fontSizeItems" class="w-24" />
        </div>

        <div class="flex items-center gap-1">
          <!-- 保存按钮 -->
          <button
            class="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title="保存文件 (Ctrl+S)"
            @click="saveFile"
          >
            <Icon name="i-heroicons-document-arrow-down" class="w-4 h-4 text-green-600" />
          </button>

          <!-- 格式化按钮 -->
          <button
            class="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title="格式化代码 (Shift+Alt+F)"
            @click="formatCode"
          >
            <Icon name="i-heroicons-code-bracket" class="w-4 h-4 text-gray-600" />
          </button>

          <!-- 搜索按钮 -->
          <button
            class="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title="搜索 (Ctrl+F)"
            @click="openSearch"
          >
            <Icon name="i-heroicons-magnifying-glass" class="w-4 h-4 text-gray-600" />
          </button>

          <!-- 全屏按钮 -->
          <button
            class="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title="全屏 (F11)"
            @click="toggleFullscreen"
          >
            <Icon name="i-heroicons-arrows-pointing-out" class="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <!-- CodeMirror 编辑器 -->
      <div class="flex-1 overflow-hidden">
        <ClientOnly>
          <div v-if="!isEditorLoaded" class="h-full flex items-center justify-center bg-gray-50">
            <div class="text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2" />
              <p class="text-sm text-gray-500">
                Loading CodeMirror...
              </p>
            </div>
          </div>
          <div v-else class="h-full">
            <component
              :is="CodeMirrorComponent"
              v-model:value="code"
              :options="cmOptions"
              border
              height="100%"
              width="100%"
              :style="{ fontSize: fontSize + 'px' }"
              @change="onChange"
              @input="onInput"
              @ready="onReady"
            />
          </div>
          <template #fallback>
            <div class="h-full flex items-center justify-center bg-gray-50">
              <div class="text-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2" />
                <p class="text-sm text-gray-500">
                  Loading editor...
                </p>
              </div>
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onUnmounted, shallowRef, markRaw } from 'vue'

interface FileItem {
  name: string
  type: 'file' | 'folder'
  path: string
  children?: FileItem[]
  content?: string
}

const props = defineProps<{
  file: FileItem | null
  onSave?: (filePath: string, content: string) => Promise<void>
}>()

// 响应式变量
const code = ref('')
const selectedTheme = ref('default')
const fontSize = ref(14)
const isEditorLoaded = ref(false)
const CodeMirrorComponent = shallowRef<any>(null)

// 主题选项数据
const themeItems = [
  { label: 'Default', value: 'default' },
  { label: 'Material', value: 'material' },
  { label: 'Dracula', value: 'dracula' },
  { label: 'Monokai', value: 'monokai' },
  { label: 'Solarized Light', value: 'solarized light' },
  { label: 'Solarized Dark', value: 'solarized dark' },
  { label: 'IntelliJ IDEA', value: 'idea' }
]

// 字体大小选项数据
const fontSizeItems = [
  { label: '12px', value: 12 },
  { label: '14px', value: 14 },
  { label: '16px', value: 16 },
  { label: '18px', value: 18 },
  { label: '20px', value: 20 }
]

// CodeMirror 配置
const cmOptions = computed(() => ({
  mode: getLanguageMode(props.file?.name || ''),
  theme: selectedTheme.value,
  lineNumbers: true,
  lineWrapping: true,
  foldGutter: true,
  gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
  matchBrackets: true,
  autoCloseBrackets: true,
  autoCloseTags: true,
  styleActiveLine: true,
  extraKeys: {
    'Ctrl-S': saveFile,
    'Ctrl-F': openSearch,
    'Ctrl-H': openReplace,
    'Ctrl-G': jumpToLine,
    'Ctrl-Space': 'autocomplete',
    'Ctrl-/': 'toggleComment',
    'Shift-Alt-F': formatCode,
    'F11': toggleFullscreen
  }
}))

// 监听文件变化
watch(() => props.file, (newFile) => {
  if (newFile?.content) {
    code.value = newFile.content
  } else {
    code.value = ''
  }
}, { immediate: true })

// 获取语言模式
const getLanguageMode = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'js':
    case 'jsx':
      return 'javascript'
    case 'ts':
    case 'tsx':
      return 'javascript'
    case 'vue':
      return 'vue'
    case 'json':
      return 'application/json'
    case 'css':
      return 'css'
    case 'scss':
    case 'sass':
      return 'text/x-scss'
    case 'md':
      return 'markdown'
    case 'html':
      return 'htmlmixed'
    case 'xml':
      return 'xml'
    default:
      return 'text/plain'
  }
}

// 事件处理
const onChange = (val: string) => {
  console.log('Code changed:', val.length, 'characters')
}

const onInput = (val: string) => {
  console.log('Input:', val.length, 'characters')
}

const onReady = () => {
  console.log('CodeMirror ready')
}

// 功能方法
const changeTheme = () => {
  // 主题切换将由子组件处理
  console.log('Change theme to:', selectedTheme.value)
}

// 监听主题变化
watch(selectedTheme, (newTheme) => {
  console.log('Theme changed to:', newTheme)
  // 这里可以添加主题切换的逻辑
})

const saveFile = async () => {
  console.log('saveFile function called')

  if (!props.file) {
    console.warn('No file selected')
    return
  }

  try {
    // 显示保存状态
    console.log('Saving file:', props.file.name, 'with path:', props.file.path)
    console.log('File content length:', code.value.length)

    // 使用传入的 onSave 回调或直接调用 API
    if (props.onSave) {
      await props.onSave(props.file.path, code.value)
    } else {
      // 直接调用 API 保存文件
      const response = await $fetch('/api/files/save', {
        method: 'POST',
        body: {
          path: props.file.path,
          content: code.value
        }
      })

      if (!response.success) {
        throw new Error(response.message || 'Failed to save file')
      }
    }

    console.log('File saved successfully:', props.file.name)
    console.log('CodeEditor: File save completed, triggering preview refresh...')

    // 可以添加成功提示
    // 例如：显示 toast 通知或更新 UI 状态
  } catch (error) {
    console.error('Error saving file:', error)

    // 可以添加错误提示
    // 例如：显示错误 toast 或更新 UI 状态
  }
}

const openSearch = () => {
  console.log('Open search')
}

const openReplace = () => {
  console.log('Open replace')
}

const jumpToLine = () => {
  console.log('Jump to line')
}

const toggleFullscreen = () => {
  console.log('Toggle fullscreen')
}

const formatCode = async () => {
  try {
    let formatted = code.value
    const extension = props.file?.name.split('.').pop()?.toLowerCase()

    switch (extension) {
      case 'json':
        try {
          formatted = JSON.stringify(JSON.parse(code.value), null, 2)
        } catch {
          console.warn('Invalid JSON format')
          return
        }
        break
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        // 简单的 JavaScript 格式化
        formatted = formatJavaScript(code.value)
        break
      case 'css':
        formatted = formatCSS(code.value)
        break
      case 'html':
        formatted = formatHTML(code.value)
        break
    }

    if (formatted !== code.value) {
      code.value = formatted
    }
  } catch (error) {
    console.warn('Format failed:', error)
  }
}

// 简单格式化函数
const formatJavaScript = (code: string): string => {
  return code
    .replace(/;/g, ';\n')
    .replace(/\{/g, ' {\n')
    .replace(/\}/g, '\n}\n')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n')
}

const formatCSS = (code: string): string => {
  return code
    .replace(/\{/g, ' {\n')
    .replace(/\}/g, '\n}\n')
    .replace(/;/g, ';\n')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n')
}

const formatHTML = (code: string): string => {
  return code
    .replace(/></g, '>\n<')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n')
}

onMounted(async () => {
  // 动态加载 CodeMirror
  if (import.meta.client) {
    try {
      // 动态导入 CodeMirror 相关模块
      const [
        { default: Codemirror },
        // 导入基础样式
        _codemirrorCSS,
        // 导入语言模式
        _jsMode,
        _cssMode,
        _xmlMode,
        _htmlMode,
        _markdownMode,
        _vueMode,
        // 导入主题
        _materialTheme,
        _draculaTheme,
        _monokaiTheme,
        _solarizedTheme,
        _ideaTheme,
        // 导入插件
        _closeBrackets,
        _closeTags,
        _matchBrackets,
        _foldCode,
        _foldGutter,
        _foldGutterCSS,
        _braceFold,
        _xmlFold,
        _search,
        _searchCursor,
        _dialog,
        _dialogCSS,
        _showHint,
        _showHintCSS,
        _jsHint,
        _cssHint,
        _htmlHint,
        _activeLine,
        _comment
      ] = await Promise.all([
        import('codemirror-editor-vue3'),
        import('codemirror/lib/codemirror.css'),
        import('codemirror/mode/javascript/javascript.js'),
        import('codemirror/mode/css/css.js'),
        import('codemirror/mode/xml/xml.js'),
        import('codemirror/mode/htmlmixed/htmlmixed.js'),
        import('codemirror/mode/markdown/markdown.js'),
        import('codemirror/mode/vue/vue.js'),
        import('codemirror/theme/material.css'),
        import('codemirror/theme/dracula.css'),
        import('codemirror/theme/monokai.css'),
        import('codemirror/theme/solarized.css'),
        import('codemirror/theme/idea.css'),
        import('codemirror/addon/edit/closebrackets.js'),
        import('codemirror/addon/edit/closetag.js'),
        import('codemirror/addon/edit/matchbrackets.js'),
        import('codemirror/addon/fold/foldcode.js'),
        import('codemirror/addon/fold/foldgutter.js'),
        import('codemirror/addon/fold/foldgutter.css'),
        import('codemirror/addon/fold/brace-fold.js'),
        import('codemirror/addon/fold/xml-fold.js'),
        import('codemirror/addon/search/search.js'),
        import('codemirror/addon/search/searchcursor.js'),
        import('codemirror/addon/dialog/dialog.js'),
        import('codemirror/addon/dialog/dialog.css'),
        import('codemirror/addon/hint/show-hint.js'),
        import('codemirror/addon/hint/show-hint.css'),
        import('codemirror/addon/hint/javascript-hint.js'),
        import('codemirror/addon/hint/css-hint.js'),
        import('codemirror/addon/hint/html-hint.js'),
        import('codemirror/addon/selection/active-line.js'),
        import('codemirror/addon/comment/comment.js')
      ])

      CodeMirrorComponent.value = markRaw(Codemirror)
      isEditorLoaded.value = true
    } catch (error) {
      console.error('Failed to load CodeMirror:', error)
    }
  }
})

onUnmounted(() => {
  // 清理工作
})
</script>

<style scoped>
.code-editor {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

/* CodeMirror 容器样式 */
:deep(.CodeMirror) {
  height: 100% !important;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  border: none;
}

/* 行号样式 */
:deep(.CodeMirror-linenumbers) {
  background: #f8f9fa;
  border-right: 1px solid #e9ecef;
  color: #6c757d;
  padding-right: 8px;
}

/* 活动行样式 */
:deep(.CodeMirror-activeline-background) {
  background: rgba(59, 130, 246, 0.1);
}

/* 选中文本样式 */
:deep(.CodeMirror-selected) {
  background: rgba(59, 130, 246, 0.2);
}

/* 光标样式 */
:deep(.CodeMirror-cursor) {
  border-left: 2px solid #3b82f6;
}

/* 代码折叠样式 */
:deep(.CodeMirror-foldgutter) {
  width: 16px;
}

:deep(.CodeMirror-foldgutter-open),
:deep(.CodeMirror-foldgutter-folded) {
  cursor: pointer;
  color: #6c757d;
  font-size: 12px;
}

:deep(.CodeMirror-foldgutter-open:hover),
:deep(.CodeMirror-foldgutter-folded:hover) {
  color: #3b82f6;
}

/* 匹配括号样式 */
:deep(.CodeMirror-matchingbracket) {
  background: rgba(34, 197, 94, 0.2);
  color: inherit;
}

:deep(.CodeMirror-nonmatchingbracket) {
  background: rgba(239, 68, 68, 0.2);
  color: inherit;
}

/* 自动完成提示样式 */
:deep(.CodeMirror-hints) {
  position: absolute;
  z-index: 10;
  overflow: hidden;
  list-style: none;
  margin: 0;
  padding: 2px;
  border-radius: 3px;
  border: 1px solid #d1d5db;
  background: white;
  font-size: 90%;
  font-family: monospace;
  max-height: 20em;
  overflow-y: auto;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

:deep(.CodeMirror-hint) {
  margin: 0;
  padding: 4px 8px;
  border-radius: 2px;
  white-space: pre;
  color: #374151;
  cursor: pointer;
}

:deep(.CodeMirror-hint-active) {
  background: #3b82f6;
  color: white;
}

/* 搜索对话框样式 */
:deep(.CodeMirror-dialog) {
  position: absolute;
  left: 0; right: 0;
  background: white;
  z-index: 15;
  padding: 8px 12px;
  border-bottom: 1px solid #d1d5db;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.CodeMirror-dialog input) {
  border: 1px solid #d1d5db;
  outline: none;
  background: white;
  width: 20em;
  color: inherit;
  padding: 4px 8px;
  border-radius: 4px;
}

:deep(.CodeMirror-dialog input:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 全屏模式样式 */
:deep(.CodeMirror-fullscreen) {
  position: fixed !important;
  top: 0; left: 0; right: 0; bottom: 0;
  height: auto !important;
  z-index: 9999;
  background: white;
}

/* 滚动条样式 */
:deep(.CodeMirror-vscrollbar::-webkit-scrollbar) {
  width: 12px;
}

:deep(.CodeMirror-vscrollbar::-webkit-scrollbar-track) {
  background: #f8f9fa;
}

:deep(.CodeMirror-vscrollbar::-webkit-scrollbar-thumb) {
  background: #dee2e6;
  border-radius: 6px;
  border: 2px solid #f8f9fa;
}

:deep(.CodeMirror-vscrollbar::-webkit-scrollbar-thumb:hover) {
  background: #adb5bd;
}

:deep(.CodeMirror-hscrollbar::-webkit-scrollbar) {
  height: 12px;
}

:deep(.CodeMirror-hscrollbar::-webkit-scrollbar-track) {
  background: #f8f9fa;
}

:deep(.CodeMirror-hscrollbar::-webkit-scrollbar-thumb) {
  background: #dee2e6;
  border-radius: 6px;
  border: 2px solid #f8f9fa;
}

:deep(.CodeMirror-hscrollbar::-webkit-scrollbar-thumb:hover) {
  background: #adb5bd;
}

/* 工具栏样式 */
.editor-toolbar {
  background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
  border-bottom: 1px solid #d1d5db;
}

.editor-toolbar select {
  font-family: inherit;
  transition: all 0.2s ease;
}

.editor-toolbar select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.editor-toolbar button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
