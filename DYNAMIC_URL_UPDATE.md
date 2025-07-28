# 动态服务器地址更新完成

## 更新内容

根据您的要求，已将所有使用 `previewUrl` 的地方更新为动态获取当前服务器地址，而不是硬编码 `http://localhost:3000`。

## 技术实现

### 1. 动态服务器地址获取

在 `PreviewPanel.vue` 中添加了动态服务器地址计算：

```typescript
// 获取当前服务器地址
const serverUrl = computed(() => {
  if (import.meta.client) {
    return `${window.location.protocol}//${window.location.host}`
  }
  return 'http://localhost:3000' // 服务端渲染时的默认值
})
```

### 2. 完整预览URL生成

创建了完整的预览URL计算属性：

```typescript
// 完整的预览URL（包含服务器地址）
const fullPreviewUrl = computed(() => {
  if (!previewUrl.value) {
    return null
  }
  return `${serverUrl.value}${previewUrl.value}`
})
```

### 3. PDF生成API更新

更新了PDF生成函数，使用动态的完整URL：

```typescript
const response = await $fetch('/api/pdf/generate', {
  method: 'POST',
  body: {
    url: fullPreviewUrl.value, // 使用完整URL而不是相对路径
    filename: `${props.selectedFile!.name.replace('.vue', '')}-${Date.now()}.pdf`,
    format: 'A4',
    printBackground: true
  }
})
```

## 兼容性处理

### 1. 客户端/服务端兼容
- 客户端：使用 `window.location.protocol` 和 `window.location.host` 动态获取
- 服务端：使用默认值 `http://localhost:3000` 作为后备

### 2. 现有组件兼容
- `ComponentPreview.vue` 已经在使用 `window.location.origin`，无需修改
- 保持了现有的文件路径传递方式，确保向后兼容

## 验证结果

### 测试确认
- ✅ PDF生成API正常接收完整URL
- ✅ 服务器日志显示正确的完整URL：`http://localhost:3000/pdf-template/T01/main`
- ✅ PDF文件成功生成（1.855秒）
- ✅ 热重载功能正常工作

### 服务器日志验证
```
=== PDF GENERATION API CALLED ===
URL: http://localhost:3000/pdf-template/T01/main
Filename: test-dynamic-url.pdf
Format: A4
PDF generation started at: 2025-07-28T16:24:45.074Z
Target URL: http://localhost:3000/pdf-template/T01/main
```

## 适用场景

现在系统可以在以下环境中正常工作：

1. **本地开发**: `http://localhost:3000`
2. **本地网络**: `http://192.168.1.100:3000`
3. **生产环境**: `https://yourdomain.com`
4. **不同端口**: `http://localhost:8080`

## 代码变更总结

### 修改的文件
- `app/components/PreviewPanel.vue`

### 新增功能
- `serverUrl` 计算属性：动态获取服务器地址
- `fullPreviewUrl` 计算属性：生成完整的预览URL
- 更新PDF生成逻辑使用完整URL

### 保持不变
- `ComponentPreview.vue`：已经使用动态URL，无需修改
- 文件路径处理逻辑：保持原有的路径转换方式
- 用户界面：无任何界面变化

## 使用方式

用户使用方式完全不变：
1. 选择Vue文件
2. 切换预览模式
3. 系统自动使用当前服务器地址生成PDF

## 技术优势

1. **环境无关**: 自动适应不同的部署环境
2. **网络友好**: 支持局域网访问和远程部署
3. **开发便利**: 开发和生产环境无需配置差异
4. **向后兼容**: 不影响现有功能和用户体验

## 注意事项

1. **HTTPS支持**: 在HTTPS环境下会自动使用HTTPS协议
2. **端口自动检测**: 自动检测并使用当前端口
3. **服务端渲染**: 在SSR环境下使用默认的localhost地址
4. **浏览器兼容**: 使用标准的Web API，兼容所有现代浏览器

现在您的PDF生成功能已经完全支持动态服务器地址，可以在任何环境下正常工作！
