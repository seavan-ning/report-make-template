/**
 * @license
 * [report-make-template] 版权所有 (c)
   @Author seavan_ning
   @Email <seavan093@gmail.com>
 * 基于 MIT 许可证开源（完整协议见项目根目录 LICENSE 文件）
 * 允许修改/商用，但需保留本声明及作者信息和联系方式
 *
 * 项目地址：
 * github：https://github.com/seavan-ning/report-make-template
 * gitcode：https://gitcode.com/seavan_ning/report-make-template
 gitee：https://gitee.com/louisxc/report-make-template
 */
export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': {
      common: {
        language: '语言',
        switchLanguage: '切换语言',
        menu: '菜单',
        refresh: '刷新',
        save: '保存',
        saving: '保存中...',
        saved: '已保存',
        error: '错误',
        success: '成功',
        cancel: '取消',
        confirm: '确认',
        close: '关闭',
        open: '打开',
        edit: '编辑',
        delete: '删除',
        add: '添加',
        search: '搜索',
        filter: '筛选',
        sort: '排序',
        settings: '设置'
      },
      editor: {
        title: 'PDF Make Editor',
        explorer: '资源管理器',
        docPages: '文档页面',
        codeEditor: '代码编辑器',
        previewTitle: '预览',
        noFileSelected: '未选择文件',
        selectFileToStart: '从资源管理器中选择一个文件开始编辑',
        welcomeTitle: '欢迎使用 PDF 编辑器',
        welcomeDescription: '从资源管理器中选择一个文件开始编辑',
        tips: {
          selectVueFile: '• 选择 .vue 文件来编辑模板',
          saveShortcut: '• 使用 Ctrl+S 保存更改',
          realTimePreview: '• 实时预览您的更改'
        },
        fileTree: {
          refreshFiles: '刷新文件列表',
          showFileTree: '显示文件树',
          hideFileTree: '隐藏文件树'
        },
        preview: {
          noPreviewAvailable: '无预览可用',
          selectFileToPreview: '选择一个文件查看预览',
          refreshPreview: '刷新预览',
          fileContentPreview: '文件内容预览：'
        },
        status: {
          ready: '就绪',
          noDocumentLoaded: '未加载文档',
          fileSaved: '文件已保存',
          saveError: '保存错误'
        }
      },
      fileTypes: {
        file: '文件',
        folder: '文件夹',
        vue: 'Vue 组件',
        javascript: 'JavaScript 文件',
        typescript: 'TypeScript 文件',
        json: 'JSON 文件',
        css: '样式文件',
        html: 'HTML 文件',
        markdown: 'Markdown 文件',
        image: '图片文件'
      },
      errors: {
        fileNotFound: '文件未找到',
        loadFailed: '加载失败',
        saveFailed: '保存失败',
        networkError: '网络错误',
        unknownError: '未知错误',
        pageNotFound: '页面未找到',
        pageNotFoundDescription: '抱歉，找不到您要访问的页面。'
      },
      templates: {
        title: 'PDF 模板库',
        description: '选择一个模板开始创建您的 PDF 文档',
        preview: '预览',
        copy: '复制模板',
        types: {
          simple: '简单模板',
          invoice: '发票模板',
          report: '报告模板',
          letter: '信函模板'
        },
        T01: {
          name: '简单模板',
          description: '一个基础的 PDF 模板，适合快速开始'
        },
        T02: {
          name: '发票模板',
          description: '专业的发票模板，包含完整的发票信息和表格'
        }
      }
    },
    'en-US': {
      common: {
        language: 'Language',
        switchLanguage: 'Switch Language',
        menu: 'Menu',
        refresh: 'Refresh',
        save: 'Save',
        saving: 'Saving...',
        saved: 'Saved',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        confirm: 'Confirm',
        close: 'Close',
        open: 'Open',
        edit: 'Edit',
        delete: 'Delete',
        add: 'Add',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        settings: 'Settings'
      },
      editor: {
        title: 'PDF Make Editor',
        explorer: 'Explorer',
        docPages: 'Doc Pages',
        codeEditor: 'Code Editor',
        previewTitle: 'Preview',
        noFileSelected: 'No file selected',
        selectFileToStart: 'Select a file from the explorer to start editing',
        welcomeTitle: 'Welcome to PDF Editor',
        welcomeDescription: 'Select a file from the explorer to start editing',
        tips: {
          selectVueFile: '• Choose a .vue file to edit templates',
          saveShortcut: '• Use Ctrl+S to save changes',
          realTimePreview: '• Preview your changes in real-time'
        },
        fileTree: {
          refreshFiles: 'Refresh file list',
          showFileTree: 'Show file tree',
          hideFileTree: 'Hide file tree'
        },
        preview: {
          noPreviewAvailable: 'No preview available',
          selectFileToPreview: 'Select a file to see preview',
          refreshPreview: 'Refresh preview',
          fileContentPreview: 'File Content Preview:'
        },
        status: {
          ready: 'Ready',
          noDocumentLoaded: 'No document loaded',
          fileSaved: 'File saved',
          saveError: 'Save error'
        }
      },
      fileTypes: {
        file: 'File',
        folder: 'Folder',
        vue: 'Vue Component',
        javascript: 'JavaScript File',
        typescript: 'TypeScript File',
        json: 'JSON File',
        css: 'Style File',
        html: 'HTML File',
        markdown: 'Markdown File',
        image: 'Image File'
      },
      errors: {
        fileNotFound: 'File not found',
        loadFailed: 'Load failed',
        saveFailed: 'Save failed',
        networkError: 'Network error',
        unknownError: 'Unknown error',
        pageNotFound: 'Page not found',
        pageNotFoundDescription: 'We are sorry but this page could not be found.'
      },
      templates: {
        title: 'PDF Template Gallery',
        description: 'Choose a template to start creating your PDF document',
        preview: 'Preview',
        copy: 'Copy Template',
        types: {
          simple: 'Simple Template',
          invoice: 'Invoice Template',
          report: 'Report Template',
          letter: 'Letter Template'
        },
        T01: {
          name: 'Simple Template',
          description: 'A basic PDF template, perfect for quick start'
        },
        T02: {
          name: 'Invoice Template',
          description: 'Professional invoice template with complete invoice information and tables'
        }
      }
    }
  }
}))
