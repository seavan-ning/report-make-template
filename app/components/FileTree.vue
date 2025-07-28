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
