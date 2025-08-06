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
  <div class="invoice-template">
    <div class="header">
      <h1>发票模板</h1>
      <p>发票号: {{ invoiceNumber }}</p>
      <p>日期: {{ date }}</p>
    </div>

    <div class="invoice-details">
      <h3>收款方:</h3>
      <p>{{ customerName }}</p>
      <p>{{ customerAddress }}</p>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>项目描述</th>
          <th>数量</th>
          <th>单价</th>
          <th>总计</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ getItemDescription(item.description) }}</td>
          <td>{{ item.quantity }}</td>
          <td>¥{{ item.price }}</td>
          <td>¥{{ item.total }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="total">
          <td colspan="3">
            总金额:
          </td>
          <td>¥{{ totalAmount }}</td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup lang="ts">
interface InvoiceItem {
  id: number
  description: string
  quantity: number
  price: number
  total: number
}

interface InvoiceData {
  invoiceNumber: string
  date: string
  customerName: string
  customerAddress: string
  items: InvoiceItem[]
  totalAmount: number
}

// 示例数据
const invoiceData: InvoiceData = {
  invoiceNumber: 'INV-2024-001',
  date: '2024-01-15',
  customerName: '张三公司',
  customerAddress: '北京市朝阳区某某街道123号',
  items: [
    { id: 1, description: '产品A', quantity: 2, price: 100, total: 200 },
    { id: 2, description: '产品B', quantity: 1, price: 150, total: 150 },
    { id: 3, description: '服务费', quantity: 1, price: 50, total: 50 }
  ],
  totalAmount: 400
}

// 解构数据
const { invoiceNumber, date, customerName, customerAddress, items, totalAmount } = invoiceData

// 获取项目描述
const getItemDescription = (description: string) => {
  return description
}
</script>

<style scoped>
.invoice-template {
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: white;
}

.header {
  text-align: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #333;
  padding-bottom: 20px;
}

.header h1 {
  color: #333;
  margin-bottom: 10px;
}

.invoice-details {
  margin-bottom: 20px;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.items-table th,
.items-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.items-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.total {
  font-weight: bold;
  background-color: #f9f9f9;
}
</style>
