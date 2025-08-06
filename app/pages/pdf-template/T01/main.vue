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
  <div class="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-gray-800 mb-6">PDF Template T02</h1>
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">测试自动刷新功能</h2>
        <p class="text-gray-600 mb-4">
          当您保存此文件时，右侧的预览应该会自动刷新显示最新内容。
        </p>
        <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
          <p class="text-blue-700">
            <strong>提示：</strong> 修改这段文字并保存，观察预览区域是否自动更新。
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="text-lg font-medium text-green-800 mb-2">功能特性</h3>
            <ul class="text-green-700 space-y-1">
              <li>• 自动保存检测</li>
              <li>• 预览实时刷新</li>
              <li>• 无需手动操作</li>
            </ul>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg">
            <h3 class="text-lg font-medium text-purple-800 mb-2">当前时间</h3>
            <p class="text-purple-700">{{ currentTime }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const currentTime = ref('')

const updateTime = () => {
  currentTime.value = new Date().toLocaleString('zh-CN')
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})
</script>
