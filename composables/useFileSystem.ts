interface FileItem {
  name: string
  type: 'file' | 'folder'
  path: string
  children?: FileItem[]
  content?: string
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}

export const useFileSystem = () => {
  const fileStructure = ref<FileItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 扫描文件结构
  const scanFiles = async (): Promise<FileItem[]> => {
    // 只在客户端执行
    if (import.meta.server) {
      return []
    }

    loading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse<FileItem[]>>('/api/files/scan')

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

  // 获取文件内容
  const getFileContent = async (filePath: string): Promise<string> => {
    try {
      const response = await $fetch<ApiResponse<{ path: string, content: string }>>('/api/files/content', {
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

  // 保存文件
  const saveFile = async (filePath: string, content: string): Promise<void> => {
    try {
      const response = await $fetch<ApiResponse<{ path: string }>>('/api/files/save', {
        method: 'POST',
        body: {
          path: filePath,
          content
        }
      })

      if (!response.success) {
        throw new Error(response.message || 'Failed to save file')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Error saving file:', err)
      throw new Error(errorMessage)
    }
  }

  // 查找文件
  const findFile = (path: string, items: FileItem[] = fileStructure.value): FileItem | null => {
    for (const item of items) {
      if (item.path === path) {
        return item
      }
      if (item.children) {
        const found = findFile(path, item.children)
        if (found) return found
      }
    }
    return null
  }

  // 获取所有 main.vue 文件
  const getMainVueFiles = (items: FileItem[] = fileStructure.value): FileItem[] => {
    const mainVueFiles: FileItem[] = []

    const traverse = (items: FileItem[]) => {
      for (const item of items) {
        if (item.type === 'file' && item.name === 'main.vue') {
          mainVueFiles.push(item)
        }
        if (item.children) {
          traverse(item.children)
        }
      }
    }

    traverse(items)
    return mainVueFiles
  }

  // 获取文件夹列表（包含 main.vue 的文件夹）
  const getFoldersWithMainVue = (items: FileItem[] = fileStructure.value): FileItem[] => {
    const folders: FileItem[] = []

    const traverse = (items: FileItem[]) => {
      for (const item of items) {
        if (item.type === 'folder' && item.children) {
          const hasMainVue = item.children.some(child =>
            child.type === 'file' && child.name === 'main.vue'
          )
          if (hasMainVue) {
            folders.push(item)
          }
          traverse(item.children)
        }
      }
    }

    traverse(items)
    return folders
  }

  return {
    fileStructure: readonly(fileStructure),
    loading: readonly(loading),
    error: readonly(error),
    scanFiles,
    getFileContent,
    saveFile,
    findFile,
    getMainVueFiles,
    getFoldersWithMainVue
  }
}
