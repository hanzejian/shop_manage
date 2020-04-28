<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 2.为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 1. 导入 echarts
import echarts from "echarts";

export default {
  data() {
    return {
      // 指定图表的配置项和数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    };
  },

  created() {},

  // Dom元素已挂载，可调用
  async mounted() {
    // 3. 基于准备好的dom，初始化 echarts 实例
    let myChart = echarts.init(document.getElementById("main"));

    const {data: res} = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('获取折线图数据失败！')
    }

    // 4.准备数据和配置项
    // 合并两个数据项
    // const result = { ...res.data, ...this.options }
    // 使用刚指定的配置项和数据显示图表

    myChart.setOption(res.data)
  }
};
</script>

<style lang="less" scope>
</style>