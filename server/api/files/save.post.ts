import { promises as fs } from 'fs'
import { resolve, dirname } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { path: filePath, content } = body

    if (!filePath || content === undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File path and content are required'
      })
    }

    console.log('=== SAVE API CALLED ===')
    console.log('Original file path:', filePath)
    console.log('Content length:', content?.length || 0)

    // 规范化文件路径
    let normalizedPath = filePath

    // 如果路径以 app/ 开头，直接使用
    if (normalizedPath.startsWith('app/')) {
      // 保持原样，这是相对于项目根目录的路径
    }
    // 如果路径以 / 开头，假设是相对于 app/pages 的路径
    else if (normalizedPath.startsWith('/')) {
      normalizedPath = 'app/pages' + normalizedPath
    }
    // 其他情况，假设是相对路径
    else {
      normalizedPath = 'app/pages/' + normalizedPath
    }

    // 安全检查：确保路径在允许的目录内
    const allowedPaths = ['app/pages/', 'app/components/', 'app/layouts/', 'app/assets/']
    const isAllowed = allowedPaths.some(allowedPath => normalizedPath.startsWith(allowedPath))

    if (!isAllowed) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied: Path must be within allowed directories (app/pages, app/components, app/layouts, app/assets)'
      })
    }

    // 构建完整的文件路径
    const fullPath = resolve(process.cwd(), normalizedPath)
    console.log('Normalized path:', normalizedPath)
    console.log('Full path:', fullPath)

    // 确保目录存在
    const dirPath = dirname(fullPath)
    try {
      await fs.mkdir(dirPath, { recursive: true })
    } catch (error) {
      console.warn('Directory already exists or failed to create:', error)
    }

    // 写入文件
    await fs.writeFile(fullPath, content, 'utf-8')
    console.log('File written successfully to:', fullPath)

    return {
      success: true,
      message: 'File saved successfully',
      data: {
        path: filePath
      }
    }
  } catch (error) {
    console.error('Error saving file:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save file'
    })
  }
})
