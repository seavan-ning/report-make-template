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
  <div class="file-tree-item">
    <div
      :class="[
        'flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-gray-600 transition-colors text-gray-200',
        { 'bg-blue-600 text-white': isSelected }
      ]"
      :style="{ paddingLeft: (level * 20 + 12) + 'px' }"
      @click="handleClick"
    >
      <!-- 文件夹展开/收起图标 -->
      <Icon
        v-if="file.type === 'folder'"
        :name="isExpanded ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
        class="w-3 h-3 text-gray-400"
      />
      <div v-else class="w-3" />

      <!-- 文件/文件夹图标 -->
      <Icon
        :name="getFileIcon(file)"
        class="w-4 h-4"
        :class="getFileIconColor(file)"
      />

      <!-- 文件名 -->
      <span
        class="text-sm truncate flex-1 ml-2"
        :title="file.name"
      >
        {{ file.name }}
      </span>
    </div>

    <!-- 子文件夹内容 -->
    <div v-if="file.type === 'folder' && isExpanded && file.children">
      <FileTreeItem
        v-for="child in file.children"
        :key="child.path"
        :file="child"
        :level="level + 1"
        :selected-path="selectedPath"
        @select-file="$emit('select-file', $event)"
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
  file: FileItem
  level: number
  selectedPath?: string
}>()

const emit = defineEmits<{
  'select-file': [file: FileItem]
}>()

const isExpanded = ref(props.level < 2) // 默认展开前两级
const isSelected = computed(() => props.selectedPath === props.file.path)

const handleClick = () => {
  if (props.file.type === 'folder') {
    isExpanded.value = !isExpanded.value
  } else {
    emit('select-file', props.file)
  }
}

const getFileIcon = (file: FileItem) => {
  if (file.type === 'folder') {
    return isExpanded.value ? 'i-heroicons-folder-open' : 'i-heroicons-folder'
  }

  const extension = file.name.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'vue':
      return 'i-heroicons-code-bracket'
    case 'js':
    case 'ts':
      return 'i-heroicons-code-bracket'
    case 'json':
      return 'i-heroicons-document-text'
    case 'md':
      return 'i-heroicons-document-text'
    case 'css':
    case 'scss':
    case 'sass':
      return 'i-heroicons-paint-brush'
    case 'html':
      return 'i-heroicons-globe-alt'
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return 'i-heroicons-photo'
    default:
      return 'i-heroicons-document'
  }
}

const getFileIconColor = (file: FileItem) => {
  if (file.type === 'folder') {
    return 'text-blue-400'
  }

  const extension = file.name.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'vue':
      return 'text-green-400'
    case 'js':
      return 'text-yellow-400'
    case 'ts':
      return 'text-blue-400'
    case 'json':
      return 'text-orange-400'
    case 'md':
      return 'text-gray-300'
    case 'css':
    case 'scss':
    case 'sass':
      return 'text-pink-400'
    case 'html':
      return 'text-red-400'
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return 'text-purple-400'
    default:
      return 'text-gray-300'
  }
}
</script>
