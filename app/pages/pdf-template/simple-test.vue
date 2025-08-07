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
  <div class="p-8 bg-white min-h-screen">
    <div class="max-w-4xl mx-auto">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">
          PDF 生成测试页面
        </h1>
        <p class="text-lg text-gray-600">
          这是一个用于测试PDF生成功能的简单页面
        </p>
        <div class="mt-4 text-sm text-gray-500">
          生成时间: {{ currentTime }}
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="space-y-8">
        <!-- 基本信息卡片 -->
        <div class="bg-blue-50 border border-white rounded-lg p-6">
          <h2 class="text-2xl font-semibold text-blue-800 mb-4">
            基本信息
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                文档标题
              </label>
              <p class="text-gray-900">PDF 生成测试文档</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                文档版本
              </label>
              <p class="text-gray-900">v1.0.0</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                创建日期
              </label>
              <p class="text-gray-900">{{ formatDate(new Date()) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                页面类型
              </label>
              <p class="text-gray-900">测试页面</p>
            </div>
          </div>
        </div>

        <!-- 功能特性 -->
        <div class="bg-green-50 border border-white rounded-lg p-6">
          <h2 class="text-2xl font-semibold text-green-800 mb-4">
            功能特性
          </h2>
          <ul class="space-y-2">
            <li class="flex items-center text-green-700">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              使用 Puppeteer 生成高质量 PDF
            </li>
            <li class="flex items-center text-green-700">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              支持完整的 CSS 样式和布局
            </li>
            <li class="flex items-center text-green-700">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              实时预览和即时生成
            </li>
            <li class="flex items-center text-green-700">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              通过 iframe 原生显示 PDF
            </li>
          </ul>
        </div>

        <!-- 技术规格 -->
        <div class="bg-purple-50 border border-white rounded-lg p-6">
          <h2 class="text-2xl font-semibold text-purple-800 mb-4">
            技术规格
          </h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-white">
              <thead class="bg-purple-100">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                    技术栈
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                    版本
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                    用途
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-white">
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Nuxt.js
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    4.0.1
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    前端框架
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Puppeteer
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Latest
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    PDF 生成
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Tailwind CSS
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    3.x
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    样式框架
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 页脚 -->
        <div class="text-center pt-8 border-t border-gray-200">
          <p class="text-sm text-gray-500">
            © 2025 PDF Make Editor - 测试文档
          </p>
          <p class="text-xs text-gray-400 mt-1">
            此文档由 PDF Make Editor 自动生成
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 当前时间
const currentTime = ref('')

// 格式化日期
const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 更新当前时间
const updateTime = () => {
  currentTime.value = new Date().toLocaleString('zh-CN')
}

// 组件挂载时更新时间
onMounted(() => {
  updateTime()
  // 每秒更新一次时间
  setInterval(updateTime, 1000)
})

// 页面元数据
useHead({
  title: 'PDF 生成测试页面',
  meta: [
    { name: 'description', content: '这是一个用于测试PDF生成功能的简单页面' }
  ]
})
</script>

<style scoped>
/* 打印样式优化 */
@media print {
  body {
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }
}
</style>
