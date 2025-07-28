import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
  try {
    const filename = getRouterParam(event, 'filename')
    
    if (!filename) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Filename is required'
      })
    }

    // 验证文件名安全性（防止路径遍历攻击）
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid filename'
      })
    }

    // 构建文件路径
    const filePath = join(process.cwd(), 'public', 'generated-pdfs', filename)
    
    // 检查文件是否存在
    if (!existsSync(filePath)) {
      throw createError({
        statusCode: 404,
        statusMessage: 'PDF file not found'
      })
    }

    // 读取文件
    const fileBuffer = await readFile(filePath)
    
    // 设置响应头
    setHeader(event, 'Content-Type', 'application/pdf')
    setHeader(event, 'Content-Disposition', `inline; filename="${filename}"`)
    setHeader(event, 'Cache-Control', 'public, max-age=3600') // 缓存1小时
    
    return fileBuffer
    
  } catch (error) {
    console.error('Error serving PDF file:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to serve PDF file'
    })
  }
})
