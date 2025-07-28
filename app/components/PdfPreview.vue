<template>
  <div class="pdf-preview h-full flex flex-col bg-gray-50">
    <!-- PDF 查看器 -->
    <div v-if="pdfUrl" class="flex-1 flex flex-col">
      <PdfViewer :pdf-url="pdfUrl" />
    </div>

    <!-- 预览占位区域 -->
    <div v-else class="flex-1 flex items-center justify-center">
      <div class="text-center text-gray-400">
        <Icon name="i-heroicons-document" class="w-24 h-24 mx-auto mb-4 opacity-30" />
        <h3 class="text-lg font-medium mb-2">
          PDF 预览
        </h3>
        <p class="text-sm">
          暂无 PDF 可预览
        </p>
        <p class="text-xs mt-2 text-gray-500">
          选择文件并生成 PDF 进行预览
        </p>
      </div>
    </div>

    <!-- 底部状态栏 -->
    <div class="px-4 py-2 bg-white border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
      <span v-if="pdfUrl">PDF 已加载</span>
      <span v-else>就绪</span>
      <span v-if="pdfUrl">{{ pdfUrl.split('/').pop() }}</span>
      <span v-else>未加载文档</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  pdfUrl?: string
}

const props = defineProps<Props>()
</script>

<style scoped>
.pdf-preview {
  background-image:
    linear-gradient(45deg, #f8f9fa 25%, transparent 25%),
    linear-gradient(-45deg, #f8f9fa 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #f8f9fa 75%),
    linear-gradient(-45deg, transparent 75%, #f8f9fa 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}
</style>
