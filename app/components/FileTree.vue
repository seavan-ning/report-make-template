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
  <div class="file-tree">
    <!-- 刷新按钮 -->
    <div class="flex items-center justify-between px-3 py-2 border-b border-gray-600">
      <span class="text-xs text-gray-400 uppercase tracking-wide">{{ $t('editor.docPages') }}</span>
      <button
        class="p-1 hover:bg-gray-600 rounded transition-colors"
        :title="$t('editor.fileTree.refreshFiles')"
        @click="handleRefresh"
      >
        <Icon name="i-heroicons-arrow-path" class="w-3 h-3 text-gray-400" />
      </button>
    </div>

    <!-- 文件列表 -->
    <div v-for="file in files" :key="file.path">
      <FileTreeItem
        :file="file"
        :level="0"
        :selected-path="selectedPath"
        @select-file="handleFileSelect"
      />
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

const props = defineProps<{
  files: FileItem[]
}>()

const emit = defineEmits<{
  'select-file': [file: FileItem]
  'refresh-files': []
}>()

const selectedPath = ref<string>('')

const handleFileSelect = (file: FileItem) => {
  selectedPath.value = file.path
  emit('select-file', file)
}

const handleRefresh = () => {
  emit('refresh-files')
}
</script>

<style scoped>
.file-tree {
  padding: 0.75rem 0;
}
</style>
