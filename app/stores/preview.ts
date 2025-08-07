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
 gitee：https://gitee.com/seavan_ning/report-make-template
*/
import { defineStore } from 'pinia'

export type PreviewMode = 'development' | 'pdf'

export interface PreviewState {
  mode: PreviewMode
  currentPdfUrl: string | null
  isGeneratingPdf: boolean
  pdfGenerationError: string | null
  selectedFile: FileItem | null
}

export interface FileItem {
  name: string
  type: 'file' | 'folder'
  path: string
  children?: FileItem[]
  content?: string
}

export const usePreviewStore = defineStore('preview', {
  state: (): PreviewState => ({
    mode: 'development',
    currentPdfUrl: null,
    isGeneratingPdf: false,
    pdfGenerationError: null,
    selectedFile: null
  }),

  getters: {
    isDevelopmentMode: (state) => state.mode === 'development',
    isPdfMode: (state) => state.mode === 'pdf',
    canGeneratePdf: (state) => {
      return state.selectedFile && 
             state.selectedFile.type === 'file' && 
             state.selectedFile.path.endsWith('.vue')
    },
    previewUrl: (state) => {
      if (!state.selectedFile || state.selectedFile.type !== 'file' || !state.selectedFile.path.endsWith('.vue')) {
        return null
      }
      
      // 将文件路径转换为路由路径
      const routePath = state.selectedFile.path
        .replace(/^app\/pages/, '') // 移除 app/pages 前缀
        .replace(/\.vue$/, '') // 移除 .vue 后缀
      
      return routePath
    }
  },

  actions: {
    setMode(mode: PreviewMode) {
      this.mode = mode
      
      // 切换到PDF模式时，如果有选中的文件，自动生成PDF
      if (mode === 'pdf' && this.canGeneratePdf) {
        this.generatePdf()
      }
      
      // 切换到开发模式时，清除PDF相关状态
      if (mode === 'development') {
        this.currentPdfUrl = null
        this.pdfGenerationError = null
      }
    },

    toggleMode() {
      this.setMode(this.mode === 'development' ? 'pdf' : 'development')
    },

    setSelectedFile(file: FileItem | null) {
      this.selectedFile = file
      
      // 如果是PDF模式且选择了Vue文件，自动生成PDF
      if (this.isPdfMode && this.canGeneratePdf) {
        this.generatePdf()
      }
      
      // 如果不是Vue文件，清除PDF状态
      if (!this.canGeneratePdf) {
        this.currentPdfUrl = null
        this.pdfGenerationError = null
      }
    },

    async generatePdf() {
      if (!this.canGeneratePdf || !this.previewUrl) {
        return
      }

      this.isGeneratingPdf = true
      this.pdfGenerationError = null

      try {
        console.log('Generating PDF for route:', this.previewUrl)

        const response = await $fetch('/api/pdf/generate', {
          method: 'POST',
          body: {
            url: this.previewUrl,
            filename: `${this.selectedFile!.name.replace('.vue', '')}-${Date.now()}.pdf`,
            format: 'A4',
            printBackground: true
          }
        })

        if (response.success) {
          this.currentPdfUrl = response.data.pdfUrl
          console.log('PDF generated successfully:', response.data.filename)
        } else {
          throw new Error('PDF generation failed')
        }
      } catch (error) {
        console.error('Failed to generate PDF:', error)
        this.pdfGenerationError = error instanceof Error ? error.message : 'PDF 生成失败'
      } finally {
        this.isGeneratingPdf = false
      }
    },

    async refreshPdf() {
      if (this.isPdfMode && this.canGeneratePdf) {
        await this.generatePdf()
      }
    },

    downloadPdf() {
      if (this.currentPdfUrl) {
        const link = document.createElement('a')
        link.href = this.currentPdfUrl
        link.download = this.currentPdfUrl.split('/').pop() || 'document.pdf'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    },

    clearPdfState() {
      this.currentPdfUrl = null
      this.pdfGenerationError = null
      this.isGeneratingPdf = false
    }
  },

  persist: {
    key: 'preview-mode',
    paths: ['mode'] // 只持久化模式，其他状态不需要持久化
  }
})
