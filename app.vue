<template>
  <div class="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- 顶部工具栏 -->
    <div class="h-14 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg flex items-center px-6">
      <div class="flex items-center space-x-4">
        <UButton
          variant="ghost"
          size="sm"
          icon="i-heroicons-bars-3"
          class="text-white hover:bg-white/20 transition-all duration-200"
          @click="toggleLeftSidebar"
        >
          菜单
        </UButton>
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-md">
            <Icon name="i-heroicons-document-text" class="w-5 h-5 text-white" />
          </div>
          <div class="text-white font-semibold text-lg tracking-wide">
            PDF Make Editor
          </div>
        </div>
      </div>
      <div class="ml-auto flex items-center space-x-2">
        <UButton
          variant="ghost"
          size="sm"
          icon="i-heroicons-play"
          class="text-white hover:bg-white/20 bg-green-500/20 border border-green-400/30 transition-all duration-200 hover:scale-105"
          @click="runCode"
        >
          运行
        </UButton>
        <UButton
          variant="ghost"
          size="sm"
          icon="i-heroicons-share"
          class="text-white hover:bg-white/20 transition-all duration-200"
          @click="shareProject"
        >
          分享
        </UButton>
        <UButton
          variant="ghost"
          size="sm"
          icon="i-heroicons-arrow-path"
          title="重置面板大小"
          class="text-white hover:bg-white/20 transition-all duration-200"
          @click="resetPanelSizes"
        >
          重置
        </UButton>
        <UButton
          variant="ghost"
          size="sm"
          icon="i-heroicons-eye"
          class="text-white hover:bg-white/20 bg-blue-500/20 border border-blue-400/30 transition-all duration-200"
          @click="toggleRightSidebar"
        >
          预览
        </UButton>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧边栏 - 文件树 -->
      <div
        v-show="isLeftSidebarOpen"
        class="bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col shadow-2xl"
        :style="{ width: leftPanelWidth + 'px' }"
      >
        <div class="h-12 bg-gradient-to-r from-slate-700 to-slate-800 border-b border-slate-600 flex items-center px-4">
          <Icon name="i-heroicons-folder-open" class="w-5 h-5 text-blue-400 mr-2" />
          <span class="text-sm font-semibold text-slate-200">文件浏览器</span>
          <UButton
            variant="ghost"
            size="xs"
            icon="i-heroicons-plus"
            class="ml-auto text-slate-300 hover:text-white hover:bg-slate-600 transition-all duration-200"
          />
        </div>
        <div class="flex-1 overflow-y-auto p-3">
          <FileTree
            :files="fileStructure"
            @select-file="handleFileSelect"
          />
        </div>
      </div>

      <!-- 左侧拖拽分隔条 -->
      <div
        v-show="isLeftSidebarOpen"
        class="w-2 bg-gradient-to-b from-indigo-300 to-purple-400 hover:from-indigo-400 hover:to-purple-500 cursor-col-resize transition-all duration-300 resize-handle shadow-md flex-shrink-0"
        :class="{ 'from-indigo-500 to-purple-600 dragging shadow-lg w-3': isDraggingLeft }"
        @mousedown="startDragLeft"
      />

      <!-- 中间区域 - 代码编辑器 -->
      <div class="flex-1 flex flex-col bg-white shadow-xl overflow-hidden">
        <!-- 标签栏 -->
        <div class="h-12 bg-gradient-to-r from-slate-100 to-slate-200 border-b border-slate-300 flex items-center px-4">
          <div class="flex space-x-2">
            <div class="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md text-sm font-medium flex items-center space-x-2">
              <Icon :name="getFileIcon(activeFile)" class="w-4 h-4" />
              <span>{{ activeFile }}</span>
              <Icon name="i-heroicons-x-mark" class="w-3 h-3 hover:bg-white/20 rounded cursor-pointer" />
            </div>
          </div>
          <div class="ml-auto flex items-center space-x-2">
            <UButton
              variant="ghost"
              size="xs"
              icon="i-heroicons-magnifying-glass"
              class="text-slate-600 hover:text-slate-800"
            />
            <UButton
              variant="ghost"
              size="xs"
              icon="i-heroicons-cog-6-tooth"
              class="text-slate-600 hover:text-slate-800"
            />
          </div>
        </div>
        <!-- 编辑器内容 -->
        <div class="flex-1 p-4 font-mono text-sm bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-emerald-400 overflow-auto relative">
          <!-- 装饰性网格背景 -->
          <div class="absolute inset-0 opacity-5">
            <div class="w-full h-full" style="background-image: radial-gradient(circle, #ffffff 1px, transparent 1px); background-size: 20px 20px;" />
          </div>
          <div class="relative space-y-1">
            <div v-for="(line, index) in (fileContents[activeFile] || [])" :key="index" class="flex hover:bg-slate-800/50 transition-colors duration-200 rounded px-2 py-0.5">
              <span class="text-slate-500 w-12 text-right mr-6 select-none font-medium">{{ String(index + 1).padStart(3, ' ') }}</span>
              <span class="flex-1" v-html="highlightSyntax(line)" />
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧拖拽分隔条 -->
      <div
        v-show="isRightSidebarOpen"
        class="w-2 bg-gradient-to-b from-pink-300 to-rose-400 hover:from-pink-400 hover:to-rose-500 cursor-col-resize transition-all duration-300 resize-handle shadow-md flex-shrink-0"
        :class="{ 'from-pink-500 to-rose-600 dragging shadow-lg w-3': isDraggingRight }"
        @mousedown="startDragRight"
      />

      <!-- 右侧边栏 - 预览区域 -->
      <div
        v-show="isRightSidebarOpen"
        class="bg-gradient-to-b from-white to-slate-50 flex flex-col shadow-2xl"
        :style="{ width: rightPanelWidth + 'px' }"
      >
        <PreviewPanel
          ref="previewPanelRef"
          :selected-file="selectedFile"
          class="h-full"
        />
      </div>
    </div>

    <!-- 底部状态栏 -->
    <div class="h-10 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white text-sm flex items-center px-6 shadow-lg">
      <div class="flex items-center space-x-6">
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span class="font-medium">就绪</span>
        </div>
        <div class="flex items-center space-x-2">
          <Icon name="i-heroicons-cursor-arrow-rays" class="w-4 h-4 text-blue-400" />
          <span>行 {{ currentLine }}, 列 {{ currentColumn }}</span>
        </div>
        <div class="flex items-center space-x-2">
          <Icon name="i-heroicons-language" class="w-4 h-4 text-purple-400" />
          <span>UTF-8</span>
        </div>
      </div>
      <div class="ml-auto flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-md flex items-center justify-center">
            <Icon name="i-heroicons-bolt" class="w-3 h-3 text-white" />
          </div>
          <span class="font-semibold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">PDF Make v2.0.1</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PreviewPanel from '~/components/PreviewPanel.vue'

interface FileItem {
  name: string
  type: 'file' | 'folder'
  path: string
  children?: FileItem[]
  content?: string
}

// 响应式数据
const activeFile = ref('main.js')
const isLeftSidebarOpen = ref(true)
const isRightSidebarOpen = ref(true)
const selectedFile = ref<FileItem | null>(null)

// 面板宽度控制
const leftPanelWidth = ref(256) // 默认 256px
const rightPanelWidth = ref(320) // 默认 320px
const isDraggingLeft = ref(false)
const isDraggingRight = ref(false)

// 状态栏信息
const currentLine = ref(14)
const currentColumn = ref(2)

// 预览面板引用
const previewPanelRef = ref<any>(null)

// 文件内容映射
const fileContents = {
  'main.js': [
    'import { createPDF } from \'pdfmake\';',
    'import { abstractExplanationContent } from \'./pdf-content/abstract-explanation.js\';',
    '',
    '// 创建说明摘要PDF文档',
    'const docDefinition = {',
    '  ...abstractExplanationContent,',
    '  // 可以在这里覆盖或扩展内容',
    '  footer: function(currentPage, pageCount) {',
    '    return {',
    '      text: `第 ${currentPage} 页，共 ${pageCount} 页`,',
    '      alignment: \'center\',',
    '      fontSize: 9,',
    '      color: \'#64748b\'',
    '    };',
    '  },',
    '};',
    '',
    '// 生成PDF',
    'const pdfDocGenerator = createPDF(docDefinition);',
    'pdfDocGenerator.download(\'technical-abstract.pdf\');'
  ],
  'style.css': [
    '/* 全局样式 */',
    'body {',
    '  font-family: \'Helvetica Neue\', Arial, sans-serif;',
    '  margin: 0;',
    '  padding: 20px;',
    '  background-color: #f8fafc;',
    '  color: #1e293b;',
    '}',
    '',
    '/* 标题样式 */',
    '.header {',
    '  font-size: 24px;',
    '  font-weight: bold;',
    '  color: #2563eb;',
    '  margin-bottom: 16px;',
    '}',
    '',
    '/* 内容区域 */',
    '.content {',
    '  background: white;',
    '  padding: 24px;',
    '  border-radius: 8px;',
    '  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);',
    '}'
  ],
  'package.json': [
    '{',
    '  "name": "pdf-make-editor",',
    '  "version": "1.0.0",',
    '  "description": "PDF生成编辑器",',
    '  "main": "main.js",',
    '  "scripts": {',
    '    "dev": "nuxt dev",',
    '    "build": "nuxt build",',
    '    "preview": "nuxt preview"',
    '  },',
    '  "dependencies": {',
    '    "pdfmake": "^0.2.7",',
    '    "@nuxt/ui": "^2.11.1"',
    '  }',
    '}'
  ],
  'abstract-explanation.js': [
    '// 说明摘要PDF内容定义',
    'export const abstractExplanationContent = {',
    '  // 文档信息',
    '  info: {',
    '    title: \'技术说明摘要\',',
    '    author: \'PDF Make 系统\',',
    '    subject: \'产品技术说明文档\',',
    '    keywords: \'技术文档, 说明摘要, PDF生成\'',
    '  },',
    '  // 页面设置',
    '  pageSize: \'A4\',',
    '  pageOrientation: \'portrait\',',
    '  pageMargins: [40, 60, 40, 60],',
    '  // 文档内容',
    '  content: [',
    '    {',
    '      text: \'技术说明摘要\',',
    '      style: \'documentTitle\',',
    '      alignment: \'center\',',
    '      margin: [0, 0, 0, 30]',
    '    },',
    '    {',
    '      text: \'1. 概述\',',
    '      style: \'header\',',
    '      margin: [0, 20, 0, 10]',
    '    },',
    '    {',
    '      text: \'本文档提供PDF生成系统的技术说明摘要...\',',
    '      style: \'normal\',',
    '      margin: [0, 0, 0, 15]',
    '    }',
    '  ],',
    '  styles: {',
    '    documentTitle: {',
    '      fontSize: 22,',
    '      bold: true,',
    '      color: \'#2563eb\'',
    '    },',
    '    header: {',
    '      fontSize: 16,',
    '      bold: true,',
    '      color: \'#374151\'',
    '    },',
    '    normal: {',
    '      fontSize: 12,',
    '      lineHeight: 1.5',
    '    }',
    '  }',
    '}'
  ]
}

// 示例文件结构
const fileStructure = ref<FileItem[]>([
  {
    name: 'templates',
    type: 'folder',
    path: '/templates',
    children: [
      {
        name: 'invoice.html',
        type: 'file',
        path: '/templates/invoice.html',
        content: [
          '<!DOCTYPE html>',
          '<html>',
          '<head>',
          '    <meta charset="utf-8">',
          '    <title>Invoice Template</title>',
          '    <style>',
          '        body { font-family: Arial, sans-serif; margin: 40px; }',
          '        .header { text-align: center; margin-bottom: 30px; }',
          '        .invoice-details { margin-bottom: 20px; }',
          '        table { width: 100%; border-collapse: collapse; }',
          '        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }',
          '        th { background-color: #f2f2f2; }',
          '        .total { font-weight: bold; }',
          '    </style>',
          '</head>',
          '<body>',
          '    <div class="header">',
          '        <h1>INVOICE</h1>',
          '        <p>Invoice #: {{invoiceNumber}}</p>',
          '        <p>Date: {{date}}</p>',
          '    </div>',
          '    ',
          '    <div class="invoice-details">',
          '        <h3>Bill To:</h3>',
          '        <p>{{customerName}}</p>',
          '        <p>{{customerAddress}}</p>',
          '    </div>',
          '    ',
          '    <table>',
          '        <thead>',
          '            <tr>',
          '                <th>Description</th>',
          '                <th>Quantity</th>',
          '                <th>Price</th>',
          '                <th>Total</th>',
          '            </tr>',
          '        </thead>',
          '        <tbody>',
          '            {{#each items}}',
          '            <tr>',
          '                <td>{{description}}</td>',
          '                <td>{{quantity}}</td>',
          '                <td>${{price}}</td>',
          '                <td>${{total}}</td>',
          '            </tr>',
          '            {{/each}}',
          '        </tbody>',
          '        <tfoot>',
          '            <tr class="total">',
          '                <td colspan="3">Total Amount:</td>',
          '                <td>${{totalAmount}}</td>',
          '            </tr>',
          '        </tfoot>',
          '    </table>',
          '</body>',
          '</html>'
        ].join('\n')
      },
      {
        name: 'report.html',
        type: 'file',
        path: '/templates/report.html',
        content: [
          '<!DOCTYPE html>',
          '<html>',
          '<head>',
          '    <meta charset="utf-8">',
          '    <title>Monthly Report</title>',
          '    <style>',
          '        body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; }',
          '        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; margin: -20px -20px 20px -20px; }',
          '        .chart-container { margin: 20px 0; text-align: center; }',
          '        .metrics { display: flex; justify-content: space-around; margin: 20px 0; }',
          '        .metric { text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px; }',
          '    </style>',
          '</head>',
          '<body>',
          '    <div class="header">',
          '        <h1>Monthly Performance Report</h1>',
          '        <p>Period: {{reportPeriod}}</p>',
          '    </div>',
          '    ',
          '    <div class="metrics">',
          '        <div class="metric">',
          '            <h3>{{totalSales}}</h3>',
          '            <p>Total Sales</p>',
          '        </div>',
          '        <div class="metric">',
          '            <h3>{{newCustomers}}</h3>',
          '            <p>New Customers</p>',
          '        </div>',
          '        <div class="metric">',
          '            <h3>{{revenue}}</h3>',
          '            <p>Revenue</p>',
          '        </div>',
          '    </div>',
          '    ',
          '    <div class="chart-container">',
          '        <h2>Sales Trend</h2>',
          '        <p>Chart will be rendered here</p>',
          '    </div>',
          '</body>',
          '</html>'
        ].join('\n')
      }
    ]
  },
  {
    name: 'src',
    type: 'folder',
    path: '/src',
    children: [
      {
        name: 'main.js',
        type: 'file',
        path: '/src/main.js',
        content: ''
      },
      {
        name: 'style.css',
        type: 'file',
        path: '/src/style.css',
        content: ''
      }
    ]
  },
  {
    name: 'pdf-content',
    type: 'folder',
    path: '/pdf-content',
    children: [
      {
        name: 'abstract-explanation.js',
        type: 'file',
        path: '/pdf-content/abstract-explanation.js',
        content: ''
      }
    ]
  },
  {
    name: 'package.json',
    type: 'file',
    path: '/package.json',
    content: ''
  }
])

// 处理文件选择
const handleFileSelect = (file: FileItem) => {
  if (file.type === 'file') {
    selectedFile.value = file
    activeFile.value = file.name
  }
}

// 语法高亮函数
const highlightSyntax = (line: string) => {
  // 增强的语法高亮
  return line
    .replace(/\/\/.*$/g, '<span class="text-emerald-400 italic">$&</span>') // 注释
    .replace(/(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="text-yellow-300 font-medium">$&</span>') // 字符串
    .replace(/\b(function|const|let|var|if|else|for|while|return|import|export|from|class|extends|async|await)\b/g, '<span class="text-cyan-400 font-semibold">$&</span>') // 关键字
    .replace(/\b(\d+)\b/g, '<span class="text-purple-400 font-medium">$&</span>') // 数字
    .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-orange-400 font-medium">$&</span>') // 布尔值和特殊值
    .replace(/([{}[\]();,.])/g, '<span class="text-slate-300">$1</span>') // 标点符号
}

// 获取文件图标
const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'vue':
      return 'i-heroicons-code-bracket'
    case 'js':
      return 'i-heroicons-code-bracket'
    case 'ts':
      return 'i-heroicons-code-bracket'
    case 'json':
      return 'i-heroicons-document-text'
    case 'css':
      return 'i-heroicons-paint-brush'
    case 'html':
      return 'i-heroicons-globe-alt'
    default:
      return 'i-heroicons-document'
  }
}

// 工具栏操作
const toggleLeftSidebar = () => {
  isLeftSidebarOpen.value = !isLeftSidebarOpen.value
}

const toggleRightSidebar = () => {
  isRightSidebarOpen.value = !isRightSidebarOpen.value
}

const runCode = () => {
  console.log('运行代码')
}

const shareProject = () => {
  console.log('分享项目')
}

const resetPanelSizes = () => {
  leftPanelWidth.value = 256
  rightPanelWidth.value = 320
}

// 拖拽功能
let startX = 0
let startWidth = 0

const startDragLeft = (e: MouseEvent) => {
  e.preventDefault()
  console.log('开始拖拽左侧面板')
  isDraggingLeft.value = true
  startX = e.clientX
  startWidth = leftPanelWidth.value

  const handleDragLeft = (e: MouseEvent) => {
    if (!isDraggingLeft.value) return

    const deltaX = e.clientX - startX
    const newWidth = Math.max(200, Math.min(600, startWidth + deltaX))
    leftPanelWidth.value = newWidth
  }

  const stopDragLeft = () => {
    isDraggingLeft.value = false
    document.removeEventListener('mousemove', handleDragLeft)
    document.removeEventListener('mouseup', stopDragLeft)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  document.addEventListener('mousemove', handleDragLeft)
  document.addEventListener('mouseup', stopDragLeft)
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}

const startDragRight = (e: MouseEvent) => {
  e.preventDefault()
  console.log('开始拖拽右侧面板')
  isDraggingRight.value = true
  startX = e.clientX
  startWidth = rightPanelWidth.value

  const handleDragRight = (e: MouseEvent) => {
    if (!isDraggingRight.value) return

    const deltaX = e.clientX - startX
    const newWidth = Math.max(200, Math.min(800, startWidth - deltaX))
    rightPanelWidth.value = newWidth
  }

  const stopDragRight = () => {
    isDraggingRight.value = false
    document.removeEventListener('mousemove', handleDragRight)
    document.removeEventListener('mouseup', stopDragRight)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  document.addEventListener('mousemove', handleDragRight)
  document.addEventListener('mouseup', stopDragRight)
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}

// 预览相关方法 - 现在由PreviewPanel组件处理
</script>

<style scoped>
.resize-handle {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.resize-handle:hover::after {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 100%;
  background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
  opacity: 0.9;
  border-radius: 3px;
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.6);
}

.resize-handle:active::after {
  width: 8px;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
}

.dragging {
  background: linear-gradient(to bottom, #3b82f6, #8b5cf6) !important;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.6) !important;
}

/* 代码编辑器样式 */
.font-mono {
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
  font-feature-settings: 'liga' 1, 'calt' 1;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: linear-gradient(to bottom, #f1f5f9, #e2e8f0);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #64748b, #475569);
  border-radius: 5px;
  border: 2px solid #f1f5f9;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #475569, #334155);
}

::-webkit-scrollbar-corner {
  background: #f1f5f9;
}

/* 深色滚动条 */
.bg-slate-900 ::-webkit-scrollbar-track,
.bg-gradient-to-br ::-webkit-scrollbar-track {
  background: linear-gradient(to bottom, #1e293b, #0f172a);
}

.bg-slate-900 ::-webkit-scrollbar-thumb,
.bg-gradient-to-br ::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #475569, #334155);
  border: 2px solid #1e293b;
}

.bg-slate-900 ::-webkit-scrollbar-thumb:hover,
.bg-gradient-to-br ::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #64748b, #475569);
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* 按钮悬停效果 */
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* 玻璃效果 */
.glass-effect {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
