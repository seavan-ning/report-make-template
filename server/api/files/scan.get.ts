/**
@license
[report-make-template] 版权所有 (c)
   @Author seavan_ning
   @Email <seavan093@gmail.com>
基于 MIT 许可证开源（完整协议见项目根目录 LICENSE 文件）
允许修改/商用，但需保留本声明及作者信息和联系方式

项目地址：
 github：https://github.com/seavan-ning/report-make-template
 gitcode：https://gitcode.com/seavan_ning/report-make-template
 gitee：https://gitee.com/louisxc/report-make-template
*/
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
