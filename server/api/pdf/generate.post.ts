import { generatePdf } from '../../common/puppeteerrc/puppeteerrc'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { url, filename, format, printBackground, margin } = body

    if (!url) {
      throw createError({
        statusCode: 400,
        statusMessage: 'URL is required'
      })
    }

    console.log('=== PDF GENERATION API CALLED ===')
    console.log('URL:', url)
    console.log('Filename:', filename)
    console.log('Format:', format)

    // 验证 URL 格式
    let targetUrl: string
    try {
      // 如果是相对路径，转换为完整URL
      if (url.startsWith('/')) {
        const host = getHeader(event, 'host') || 'localhost:3000'
        const protocol = getHeader(event, 'x-forwarded-proto') || 'http'
        targetUrl = `${protocol}://${host}${url}`
      } else {
        targetUrl = url
      }
      
      // 验证URL格式
      new URL(targetUrl)
    } catch {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid URL format'
      })
    }

    // 生成PDF
    const result = await generatePdf({
      url: targetUrl,
      filename,
      format,
      printBackground,
      margin
    })

    if (!result.success) {
      throw createError({
        statusCode: 500,
        statusMessage: result.error || 'PDF generation failed'
      })
    }

    // 返回成功结果，包含可访问的PDF URL
    const pdfUrl = `/generated-pdfs/${result.filename}`
    
    return {
      success: true,
      data: {
        filename: result.filename,
        pdfUrl,
        duration: result.duration
      }
    }

  } catch (error) {
    console.error('PDF generation API error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Internal server error'
    })
  }
})
