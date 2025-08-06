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
    <div class="bg-white">


        <!-- 封面页 -->
        <div class="page-content">
            <div class="text-center" style="margin-top: 200px;">
                <h1 style="font-size: 48px; color: #1f2937; margin-bottom: 30px; font-weight: bold;">
                    PDF 性能测试报告
                </h1>
                <h2 style="font-size: 24px; color: #6b7280; margin-bottom: 50px;">
                    大容量数据处理与转换性能分析
                </h2>
                <div style="font-size: 18px; color: #374151; line-height: 1.8;">
                    <p><strong>文档版本:</strong> v2.0.0</p>
                    <p><strong>生成时间:</strong> {{ currentTime }}</p>
                    <p><strong>总页数:</strong> 100页</p>
                    <p><strong>测试类型:</strong> 性能压力测试</p>
                </div>
                <div
                    style="margin-top: 100px; padding: 30px; background-color: #fef3c7; border-radius: 10px; border-left: 5px solid #f59e0b;">
                    <p style="color: #92400e; font-size: 16px; margin: 0;">
                        ⚠️ 本文档包含大量数据和图表，用于测试PDF生成器的性能极限
                    </p>
                </div>
            </div>
            <div class="footer">
                封面页 | 生成时间: {{ formatDateTime(new Date()) }}
            </div>
        </div>
        <div class="page-break"></div>

        <!-- 目录页 -->
        <div class="page-content">
            <div class="header">
                <h1 style="color: #1f2937; font-size: 32px; margin: 0;">目录</h1>
            </div>

            <div style="font-size: 16px; line-height: 2;">
                <div v-for="(section, index) in tableOfContents" :key="index"
                    style="display: flex; justify-content: space-between; border-bottom: 1px dotted #d1d5db; padding: 8px 0;">
                    <span>{{ section.title }}</span>
                    <span>{{ section.page }}</span>
                </div>
            </div>

            <div class="footer">
                目录页 | 第 2 页
            </div>
        </div>
        <div class="page-break"></div>

        <!-- 生成98页内容页 -->
        <template v-for="pageNum in 98" :key="pageNum">
            <div class="page-content">
                <div class="header">
                    <h1 style="color: #1f2937; font-size: 28px; margin: 0;">
                        第{{ pageNum }}章 - {{ getChapterTitle(pageNum) }}
                    </h1>
                    <p style="color: #6b7280; margin: 5px 0 0 0;">
                        {{ getChapterSubtitle(pageNum) }}
                    </p>
                </div>

                <!-- 章节介绍 -->
                <div class="content-section">
                    <h2 style="color: #374151; font-size: 20px; margin-bottom: 15px;">
                        {{ pageNum }}.1 概述
                    </h2>
                    <p style="line-height: 1.6; color: #4b5563; text-align: justify;">
                        {{ getChapterIntro(pageNum) }}
                    </p>
                </div>

                <!-- 数据表格 -->
                <div class="content-section">
                    <h2 style="color: #374151; font-size: 20px; margin-bottom: 15px;">
                        {{ pageNum }}.2 数据分析
                    </h2>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>序号</th>
                                <th>指标名称</th>
                                <th>数值</th>
                                <th>单位</th>
                                <th>状态</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in 8" :key="row">
                                <td>{{ pageNum }}-{{ row }}</td>
                                <td>{{ getMetricName(pageNum, row) }}</td>
                                <td>{{ getRandomValue(pageNum, row) }}</td>
                                <td>{{ getUnit(row) }}</td>
                                <td>
                                    <span :style="{ color: getStatusColor(pageNum, row) }">
                                        {{ getStatus(pageNum, row) }}
                                    </span>
                                </td>
                                <td>{{ getNote(pageNum, row) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- 图表占位符 -->
                <div class="content-section">
                    <h2 style="color: #374151; font-size: 20px; margin-bottom: 15px;">
                        {{ pageNum }}.3 可视化图表
                    </h2>
                    <div class="chart-placeholder">
                        📊 图表 {{ pageNum }}: {{ getChartTitle(pageNum) }}
                    </div>
                </div>

                <!-- 详细说明 -->
                <div class="content-section">
                    <h2 style="color: #374151; font-size: 20px; margin-bottom: 15px;">
                        {{ pageNum }}.4 详细说明
                    </h2>
                    <div style="columns: 2; column-gap: 30px; text-align: justify; line-height: 1.6; color: #4b5563;">
                        <p>{{ getDetailedDescription(pageNum, 1) }}</p>
                        <p>{{ getDetailedDescription(pageNum, 2) }}</p>
                        <p>{{ getDetailedDescription(pageNum, 3) }}</p>
                    </div>
                </div>

                <!-- 关键指标卡片 -->
                <div class="content-section">
                    <h2 style="color: #374151; font-size: 20px; margin-bottom: 15px;">
                        {{ pageNum }}.5 关键指标
                    </h2>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                        <div v-for="metric in 3" :key="metric"
                            style="padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #f9fafb;">
                            <h3 style="color: #1f2937; font-size: 16px; margin: 0 0 10px 0;">
                                {{ getKeyMetricName(pageNum, metric) }}
                            </h3>
                            <p style="font-size: 24px; font-weight: bold; color: #3b82f6; margin: 0;">
                                {{ getKeyMetricValue(pageNum, metric) }}
                            </p>
                            <p style="font-size: 12px; color: #6b7280; margin: 5px 0 0 0;">
                                {{ getKeyMetricChange(pageNum, metric) }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="footer">
                    第{{ pageNum + 2 }}页 | {{ getChapterTitle(pageNum) }} | 生成时间: {{ formatDateTime(new Date()) }}
                </div>
            </div>

            <!-- 每页后添加分页符，除了最后一页 -->
            <div v-if="pageNum < 98" class="page-break"></div>
        </template>
    </div>
</template>

<script setup lang="ts">
// 当前时间
const currentTime = ref('')

// 更新当前时间
const updateTime = () => {
    currentTime.value = new Date().toLocaleString('zh-CN')
}

// 格式化日期时间
const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
}

// 目录数据
const tableOfContents = computed(() => {
    const contents = []
    for (let i = 1; i <= 98; i++) {
        contents.push({
            title: `第${i}章 - ${getChapterTitle(i)}`,
            page: i + 2
        })
    }
    return contents
})

// 章节标题生成器
const getChapterTitle = (pageNum: number) => {
    const titles = [
        '系统架构设计', '数据库优化策略', '缓存机制实现', '负载均衡配置',
        '安全防护体系', '监控告警系统', '日志分析平台', '自动化部署',
        '容器化技术', '微服务架构', '消息队列设计', '分布式存储',
        '性能调优方案', '故障恢复机制', '数据备份策略', '网络安全防护',
        '用户权限管理', 'API接口设计', '前端优化技术', '移动端适配',
        '搜索引擎优化', '数据可视化', '机器学习应用', '人工智能集成',
        '区块链技术', '物联网平台', '云计算服务', '边缘计算',
        '大数据处理', '实时数据流', '数据挖掘算法', '预测分析模型'
    ]

    const baseTitle = titles[(pageNum - 1) % titles.length]
    const suffix = Math.floor((pageNum - 1) / titles.length) + 1
    return suffix > 1 ? `${baseTitle} (${suffix})` : baseTitle
}

// 章节副标题生成器
const getChapterSubtitle = (pageNum: number) => {
    const subtitles = [
        '深入分析与实践指南', '最佳实践与案例研究', '技术原理与应用场景',
        '实施方案与效果评估', '关键技术与发展趋势', '解决方案与优化建议',
        '核心概念与实际应用', '设计模式与架构思考', '性能优化与扩展性',
        '安全考虑与风险控制', '运维管理与监控策略', '成本控制与资源优化'
    ]
    return subtitles[(pageNum - 1) % subtitles.length]
}

// 章节介绍生成器
const getChapterIntro = (pageNum: number) => {
    const intros = [
        '在现代软件开发中，系统架构的设计直接影响到应用的性能、可维护性和扩展性。本章将深入探讨如何构建高效、稳定的系统架构，包括模块化设计、服务拆分、数据流设计等关键要素。通过实际案例分析，我们将展示不同架构模式的优缺点，帮助开发者选择最适合的解决方案。',

        '数据库作为系统的核心组件，其性能直接决定了整个应用的响应速度和并发能力。本章将详细介绍数据库优化的各种策略，包括索引设计、查询优化、分库分表、读写分离等技术。我们还将探讨不同数据库类型的特点和适用场景，为选择合适的数据存储方案提供指导。',

        '缓存技术是提升系统性能的重要手段，合理的缓存策略可以显著减少数据库压力，提高用户体验。本章将全面介绍缓存的实现原理、常见的缓存模式、缓存一致性问题的解决方案，以及如何根据业务特点设计高效的缓存架构。',

        '随着业务规模的扩大，单台服务器往往无法满足高并发的需求，负载均衡技术应运而生。本章将深入分析各种负载均衡算法的原理和适用场景，包括轮询、加权轮询、最少连接数等策略，同时介绍硬件负载均衡器和软件负载均衡的实现方案。',

        '网络安全是系统设计中不可忽视的重要环节，一个完善的安全防护体系需要从多个层面进行考虑。本章将介绍常见的安全威胁和防护措施，包括身份认证、授权控制、数据加密、防火墙配置等技术，帮助构建安全可靠的系统环境。'
    ]

    const baseIntro = intros[(pageNum - 1) % intros.length]
    return `${baseIntro} 本章编号：${pageNum}，包含详细的技术分析和实践案例，为读者提供全面的技术指导。`
}

// 指标名称生成器
const getMetricName = (pageNum: number, row: number) => {
    const metrics = [
        'CPU使用率', '内存占用', '磁盘I/O', '网络带宽', '响应时间',
        '并发用户数', '错误率', '吞吐量', '可用性', '延迟时间'
    ]
    return `${metrics[(row - 1) % metrics.length]}_${pageNum}`
}

// 随机数值生成器
const getRandomValue = (pageNum: number, row: number) => {
    const seed = pageNum * 100 + row
    const random = (seed * 9301 + 49297) % 233280 / 233280

    if (row <= 2) return (random * 100).toFixed(1)
    if (row <= 4) return (random * 1000).toFixed(0)
    if (row <= 6) return (random * 10000).toFixed(0)
    return (random * 1000000).toFixed(0)
}

// 单位生成器
const getUnit = (row: number) => {
    const units = ['%', 'MB', 'ms', 'req/s', 'GB', 'KB/s', 'count', 'score']
    return units[(row - 1) % units.length]
}

// 状态生成器
const getStatus = (pageNum: number, row: number) => {
    const statuses = ['正常', '警告', '异常', '优秀', '良好']
    return statuses[(pageNum + row) % statuses.length]
}

// 状态颜色生成器
const getStatusColor = (pageNum: number, row: number) => {
    const colors = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6']
    return colors[(pageNum + row) % colors.length]
}

// 备注生成器
const getNote = (pageNum: number, row: number) => {
    const notes = [
        '正常范围内', '需要关注', '超出阈值', '表现优异', '有待改进',
        '符合预期', '波动较大', '趋势良好', '需要优化', '稳定运行'
    ]
    return notes[(pageNum * row) % notes.length]
}

// 图表标题生成器
const getChartTitle = (pageNum: number) => {
    const chartTypes = [
        '性能趋势分析图', '资源使用率统计', '错误分布饼图', '响应时间柱状图',
        '并发量变化曲线', '系统负载热力图', '用户行为漏斗图', '数据流向图'
    ]
    return chartTypes[(pageNum - 1) % chartTypes.length]
}

// 详细描述生成器
const getDetailedDescription = (pageNum: number, section: number) => {
    const descriptions = [
        '通过深入的技术分析，我们发现当前系统在处理高并发请求时表现出色，但在某些特定场景下仍有优化空间。建议采用更加精细化的资源管理策略，以进一步提升系统的整体性能表现。',

        '数据显示，系统的稳定性指标持续改善，这得益于我们在架构设计上的持续优化。通过引入先进的监控机制和自动化运维工具，系统的可靠性得到了显著提升。',

        '从用户体验的角度来看，当前的优化措施已经取得了明显的效果。响应时间的缩短和错误率的降低，直接提升了用户的满意度和系统的商业价值。',

        '技术团队在实施过程中积累了丰富的经验，这些宝贵的实践经验将为后续的系统升级和扩展提供重要的参考依据。我们将继续关注行业最佳实践，不断完善技术方案。',

        '展望未来，随着业务规模的进一步扩大，我们需要在现有基础上继续深化技术创新，探索更加高效的解决方案。这不仅是技术挑战，也是推动业务发展的重要机遇。'
    ]

    const baseDesc = descriptions[(section - 1) % descriptions.length]
    return `${baseDesc} (第${pageNum}章第${section}节)`
}

// 关键指标名称生成器
const getKeyMetricName = (pageNum: number, metric: number) => {
    const keyMetrics = [
        '系统性能指数', '用户满意度', '业务转化率', '技术债务率',
        '安全风险等级', '运维效率', '成本控制率', '创新指数'
    ]
    return keyMetrics[(pageNum + metric - 1) % keyMetrics.length]
}

// 关键指标数值生成器
const getKeyMetricValue = (pageNum: number, metric: number) => {
    const seed = pageNum * 10 + metric
    const random = (seed * 9301 + 49297) % 233280 / 233280

    if (metric === 1) return (85 + random * 15).toFixed(1) + '%'
    if (metric === 2) return (4.2 + random * 0.8).toFixed(1) + '/5.0'
    return (90 + random * 10).toFixed(0) + '%'
}

// 关键指标变化生成器
const getKeyMetricChange = (pageNum: number, metric: number) => {
    const changes = [
        '↗ 较上月提升 2.3%', '↘ 较上月下降 0.8%', '→ 与上月持平',
        '↗ 较上月提升 5.1%', '↗ 较上月提升 1.7%', '↘ 较上月下降 1.2%'
    ]
    return changes[(pageNum + metric) % changes.length]
}

// 组件挂载时更新时间
onMounted(() => {
    updateTime()
    // 每秒更新一次时间
    setInterval(updateTime, 1000)
})

// 页面元数据
useHead({
    title: 'PDF 性能测试 - 100页大容量文档',
    meta: [
        { name: 'description', content: '这是一个包含100页内容的PDF性能测试文档，用于测试PDF生成器的处理能力' }
    ]
})
</script>

<style scoped>
/* 打印样式优化 */
@media print {
    body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }

    .page-break {
        page-break-after: always;
    }
}

/* 确保在PDF生成时样式正确应用 */
* {
    box-sizing: border-box;
}

.page-content {
    page-break-inside: avoid;
}

@page {
    size: A4;
    margin: 20mm;
}

.page-break {
    page-break-after: always;
}

.page-content {
    min-height: 100vh;
    padding: 20px;
    font-family: 'Arial', sans-serif;
}

.header {
    border-bottom: 3px solid #3b82f6;
    padding-bottom: 10px;
    margin-bottom: 20px;
}

.footer {
    border-top: 1px solid #e5e7eb;
    padding-top: 10px;
    margin-top: 20px;
    text-align: center;
    color: #6b7280;
    font-size: 12px;
}

.content-section {
    margin-bottom: 30px;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
}

.data-table th,
.data-table td {
    border: 1px solid #d1d5db;
    padding: 8px 12px;
    text-align: left;
}

.data-table th {
    background-color: #f3f4f6;
    font-weight: bold;
}

.chart-placeholder {
    width: 100%;
    height: 200px;
    background: linear-gradient(45deg, #f3f4f6 25%, transparent 25%),
        linear-gradient(-45deg, #f3f4f6 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #f3f4f6 75%),
        linear-gradient(-45deg, transparent 75%, #f3f4f6 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
    border: 2px dashed #9ca3af;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    font-weight: bold;
    margin: 20px 0;
}
</style>