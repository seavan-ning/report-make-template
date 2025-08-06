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
 gitee：https://gitee.com/louisxc/report-make-template
-->
<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">PDFObject 测试页面</h1>
    
    <div class="space-y-4 mb-8">
      <button 
        @click="testPDFObject" 
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        测试 PDFObject
      </button>
      
      <button 
        @click="clearContainer" 
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        清空容器
      </button>
    </div>

    <div class="mb-4">
      <p><strong>PDFObject 支持状态:</strong> {{ pdfSupport ? '支持' : '不支持' }}</p>
      <p><strong>测试结果:</strong> {{ testResult }}</p>
    </div>

    <!-- PDF 容器 -->
    <div 
      id="pdf-test-container" 
      class="w-full h-96 border border-gray-300 rounded-lg bg-gray-50"
    >
      <p class="text-center text-gray-500 pt-20">PDF 将在这里显示</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import PDFObject from 'pdfobject'

const pdfSupport = ref(false)
const testResult = ref('未测试')

// 检查 PDFObject 支持
onMounted(() => {
  pdfSupport.value = PDFObject.supportsPDFs
  console.log('PDFObject support:', pdfSupport.value)
})

const testPDFObject = () => {
  const container = document.getElementById('pdf-test-container')
  if (!container) {
    testResult.value = '容器未找到'
    return
  }

  // 清空容器
  container.innerHTML = ''

  // 使用一个示例 PDF URL（您可以替换为实际的 PDF URL）
  const pdfUrl = '/api/pdf/sample.pdf' // 这需要是一个实际存在的 PDF 文件

  const options = {
    height: '100%',
    width: '100%',
    fallbackLink: '<p>您的浏览器不支持 PDF 预览。</p>',
    pdfOpenParams: {
      view: 'FitH',
      pagemode: 'none',
      toolbar: '1'
    }
  }

  try {
    const success = PDFObject.embed(pdfUrl, '#pdf-test-container', options)
    testResult.value = success ? 'PDFObject 嵌入成功' : 'PDFObject 嵌入失败，使用回退方案'
    
    if (!success) {
      // 回退到 iframe
      container.innerHTML = `
        <iframe 
          src="${pdfUrl}" 
          style="width: 100%; height: 100%; border: none;"
          frameborder="0">
        </iframe>
      `
    }
  } catch (error) {
    console.error('PDFObject error:', error)
    testResult.value = `错误: ${error}`
  }
}

const clearContainer = () => {
  const container = document.getElementById('pdf-test-container')
  if (container) {
    container.innerHTML = '<p class="text-center text-gray-500 pt-20">PDF 将在这里显示</p>'
    testResult.value = '容器已清空'
  }
}

// 页面元数据
useHead({
  title: 'PDFObject 测试页面'
})
</script>
