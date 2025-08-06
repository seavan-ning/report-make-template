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
import { resolve } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const filePath = query.path as string

    if (!filePath) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File path is required'
      })
    }

    // 安全检查：确保路径在 pdf-template 目录内
    if (!filePath.startsWith('/pdf-template/')) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied: Path must be within pdf-template directory'
      })
    }

    // 构建完整的文件路径
    const fullPath = resolve(process.cwd(), filePath.substring(1)) // 移除开头的 '/'

    // 检查文件是否存在
    try {
      await fs.access(fullPath)
    } catch {
      throw createError({
        statusCode: 404,
        statusMessage: 'File not found'
      })
    }

    // 读取文件内容
    const content = await fs.readFile(fullPath, 'utf-8')

    return {
      success: true,
      data: {
        path: filePath,
        content
      }
    }
  } catch (error) {
    console.error('Error reading file:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to read file'
    })
  }
})
