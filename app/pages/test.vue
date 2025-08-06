<!--
@license
[report-make-template] 版权所有 (c) seavan-ning <seavan093@gmail.com>
基于 MIT 许可证开源（完整协议见项目根目录 LICENSE 文件）
允许修改/商用，但需保留本声明及作者联系方式

项目地址：
 github：https://github.com/seavan-ning/report-make-template
 gitcode：https://gitcode.com/seavan_ning/report-make-template
-->
<template>
  <div class="p-8 space-y-6 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold text-red-500">
      Nuxt UI 组件测试
    </h1>

    <!-- Tailwind CSS 测试区域 -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4 text-blue-600">
        Tailwind CSS 样式测试
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-red-100 p-4 rounded border-l-4 border-red-500">
          <p class="text-red-700 font-medium">
            红色主题卡片
          </p>
          <p class="text-red-600 text-sm">
            这是一个红色主题的测试卡片
          </p>
        </div>
        <div class="bg-green-100 p-4 rounded border-l-4 border-green-500">
          <p class="text-green-700 font-medium">
            绿色主题卡片
          </p>
          <p class="text-green-600 text-sm">
            这是一个绿色主题的测试卡片
          </p>
        </div>
        <div class="bg-blue-100 p-4 rounded border-l-4 border-blue-500">
          <p class="text-blue-700 font-medium">
            蓝色主题卡片
          </p>
          <p class="text-blue-600 text-sm">
            这是一个蓝色主题的测试卡片
          </p>
        </div>
      </div>

      <!-- 响应式测试 -->
      <div class="mt-6">
        <h3 class="text-lg font-medium mb-3 text-purple-600">
          响应式布局测试
        </h3>
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1 bg-purple-50 p-4 rounded">
            <p class="text-purple-700">
              在小屏幕上垂直排列
            </p>
          </div>
          <div class="flex-1 bg-purple-50 p-4 rounded">
            <p class="text-purple-700">
              在大屏幕上水平排列
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 按钮测试 -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">
        按钮组件
      </h2>
      <div class="flex gap-4">
        <UButton>默认按钮</UButton>
        <UButton color="primary">
          主要按钮
        </UButton>
        <UButton color="error">
          红色按钮
        </UButton>
        <UButton variant="outline">
          轮廓按钮
        </UButton>
        <UButton variant="ghost">
          幽灵按钮
        </UButton>
      </div>
    </div>

    <!-- 输入框测试 -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">
        输入框组件
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UInput placeholder="请输入文本" />
        <UInput placeholder="带图标的输入框" icon="i-heroicons-magnifying-glass" />
        <UTextarea placeholder="多行文本输入" />
        <USelect
          :options="selectOptions"
          placeholder="选择一个选项"
        />
      </div>
    </div>

    <!-- 卡片测试 -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">
        卡片组件
      </h2>
      <UCard class="max-w-md">
        <template #header>
          <h3 class="text-lg font-semibold">
            卡片标题
          </h3>
        </template>

        <p class="text-gray-600">
          这是一个测试卡片的内容区域。Nuxt UI 提供了丰富的组件库。
        </p>

        <template #footer>
          <div class="flex justify-end">
            <UButton size="sm">
              操作按钮
            </UButton>
          </div>
        </template>
      </UCard>
    </div>

    <!-- 通知测试 -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">
        通知组件
      </h2>
      <div class="flex gap-4">
        <UButton @click="showSuccessToast">
          成功通知
        </UButton>
        <UButton color="error" @click="showErrorToast">
          错误通知
        </UButton>
        <UButton color="warning" @click="showWarningToast">
          警告通知
        </UButton>
      </div>
    </div>

    <!-- 徽章和标签测试 -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">
        徽章和标签
      </h2>
      <div class="flex gap-4 items-center">
        <UBadge>默认徽章</UBadge>
        <UBadge color="success">
          成功
        </UBadge>
        <UBadge color="error">
          错误
        </UBadge>
        <UBadge color="warning">
          警告
        </UBadge>
        <UBadge variant="outline">
          轮廓徽章
        </UBadge>
      </div>
    </div>

    <!-- 开关和复选框测试 -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">
        开关和复选框
      </h2>
      <div class="space-y-2">
        <UToggle v-model="toggleValue" />
        <UCheckbox v-model="checkboxValue" label="复选框选项" />
        <URadio v-model="radioValue" value="option1" label="单选选项 1" />
        <URadio v-model="radioValue" value="option2" label="单选选项 2" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const toast = useToast()

// 响应式数据
const toggleValue = ref(false)
const checkboxValue = ref(false)
const radioValue = ref('option1')

// 选择框选项
const selectOptions = [
  { label: '选项 1', value: 'option1' },
  { label: '选项 2', value: 'option2' },
  { label: '选项 3', value: 'option3' }
]

// 通知方法
const showSuccessToast = () => {
  toast.add({
    title: '成功',
    description: '这是一个成功通知',
    color: 'success'
  })
}

const showErrorToast = () => {
  toast.add({
    title: '错误',
    description: '这是一个错误通知',
    color: 'error'
  })
}

const showWarningToast = () => {
  toast.add({
    title: '警告',
    description: '这是一个警告通知',
    color: 'warning'
  })
}
</script>
