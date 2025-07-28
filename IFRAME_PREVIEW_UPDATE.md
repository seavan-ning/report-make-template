# PDF预览模式改为iframe预览

## 更新内容

根据您的要求，已将PDF预览模式改为使用iframe直接预览页面，而不是生成PDF文件。现在两种模式都使用相同的iframe预览方式，提供更快的预览体验。

## 主要变更

### 1. 预览方式统一
- **开发模式**: 使用iframe预览Vue页面
- **PDF模式**: 同样使用iframe预览Vue页面（不再生成PDF文件）

### 2. 简化的用户界面
- 保留了模式切换按钮（开发模式/PDF模式）
- 简化了工具栏，只保留刷新按钮
- 移除了PDF生成、下载等按钮
- 更新了状态栏显示

### 3. 代码优化
- 移除了PDF生成相关的状态管理
- 简化了组件逻辑
- 统一了预览组件的使用

## 技术实现

### PreviewPanel.vue 更新

#### 移除的功能
- PDF生成逻辑 (`generatePdf`, `downloadPdf`)
- PDF相关状态 (`isGeneratingPdf`, `currentPdfUrl`, `pdfGenerationError`)
- PDF查看器组件 (`PdfViewer`)
- 复杂的URL拼接逻辑

#### 保留的功能
- 模式切换 (`setMode`)
- iframe预览 (`ComponentPreview`)
- 刷新功能 (`refreshPreview`)
- 基本的路径转换

#### 新的组件结构
```vue
<template>
  <!-- 模式切换按钮 -->
  <div class="header">
    <button @click="setMode('development')">开发模式</button>
    <button @click="setMode('pdf')">PDF模式</button>
    <button @click="refreshPreview">刷新</button>
  </div>
  
  <!-- 统一的iframe预览 -->
  <div class="content">
    <ComponentPreview :file-path="selectedFile.path" />
  </div>
</template>
```

### editor.vue 更新

#### 更新的调用
- 保存文件后调用 `refreshPreview()` 而不是 `refreshPdf()`
- 刷新按钮调用 `refreshPreview()` 而不是 `refreshPdf()`

## 用户体验改进

### 1. 更快的预览速度
- 不需要等待PDF生成（之前需要1-6秒）
- 即时显示页面内容
- 实时反映代码变更

### 2. 统一的预览体验
- 两种模式使用相同的预览方式
- 减少了用户的学习成本
- 简化了界面操作

### 3. 保持模式概念
- 保留了"开发模式"和"PDF模式"的概念
- 为将来可能的功能扩展预留空间
- 用户可以根据需要选择不同的预览模式

## 功能对比

### 更新前
```
开发模式: iframe预览
PDF模式:  生成PDF → 显示PDF查看器
```

### 更新后
```
开发模式: iframe预览
PDF模式:  iframe预览（与开发模式相同）
```

## 代码变更总结

### 删除的代码
- PDF生成API调用逻辑
- PDF文件状态管理
- PDF查看器组件导入
- 复杂的URL拼接逻辑
- PDF下载功能

### 保留的代码
- 模式切换逻辑
- ComponentPreview组件
- 基本的路径转换
- 刷新功能

### 简化的状态管理
```typescript
// 之前
const isGeneratingPdf = ref(false)
const currentPdfUrl = ref<string | null>(null)
const pdfGenerationError = ref<string | null>(null)

// 现在
const componentPreviewRef = ref<any>(null)
```

## 向后兼容性

- 保持了相同的组件接口
- 保留了模式切换功能
- 用户操作方式基本不变
- 只是预览方式更加统一

## 性能优势

1. **即时预览**: 无需等待PDF生成
2. **资源节省**: 不消耗PDF生成的CPU和内存
3. **网络优化**: 减少了PDF文件的网络传输
4. **存储节省**: 不再生成临时PDF文件

## 使用方式

用户使用方式保持不变：
1. 选择Vue文件
2. 选择预览模式（开发模式/PDF模式）
3. 查看iframe预览
4. 使用刷新按钮更新预览

## 注意事项

1. **模式区别**: 虽然两种模式现在都使用iframe，但保留了模式概念以便将来扩展
2. **刷新功能**: 统一使用 `refreshPreview()` 方法
3. **组件引用**: 使用 `componentPreviewRef` 来访问预览组件
4. **状态显示**: 底部状态栏显示当前选择的文件名

现在您的预览功能更加简洁高效，两种模式都提供快速的iframe预览体验！
