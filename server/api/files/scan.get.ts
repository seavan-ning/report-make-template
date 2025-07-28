import { promises as fs } from 'fs'
import { join, resolve } from 'path'

interface FileItem {
  name: string
  type: 'file' | 'folder'
  path: string
  children?: FileItem[]
  content?: string
}

export default defineEventHandler(async (_event) => {
  try {
    // 获取项目根目录下的 pdf-template 路径
    const docPagePath = resolve(process.cwd(), 'app/pages/pdf-template')

    // 检查 pdf-template 目录是否存在
    try {
      await fs.access(docPagePath)
    } catch {
      throw createError({
        statusCode: 404,
        statusMessage: 'pdf-template directory not found'
      })
    }

    // 扫描 pdf-template 目录
    const fileStructure = await scanDirectory(docPagePath, '/pdf-template')

    return {
      success: true,
      data: fileStructure
    }
  } catch (error) {
    console.error('Error scanning files:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to scan files'
    })
  }
})

async function scanDirectory(dirPath: string, relativePath: string): Promise<FileItem[]> {
  const items: FileItem[] = []

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name)
      const itemPath = `${relativePath}/${entry.name}`

      if (entry.isDirectory()) {
        // 扫描子目录
        const children = await scanDirectory(fullPath, itemPath)

        items.push({
          name: entry.name,
          type: 'folder',
          path: itemPath,
          children: children
        })
      } else if (entry.isFile()) {
        let content: string | undefined

        // 如果是 main.vue 文件，读取其内容

        try {
          content = await fs.readFile(fullPath, 'utf-8')
        } catch (error) {
          console.warn(`Failed to read file ${fullPath}:`, error)
        }

        items.push({
          name: entry.name,
          type: 'file',
          path: itemPath,
          content
        })
      }
    }

    return items
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error)
    return []
  }
}
