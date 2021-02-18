<template xmlns:el-col="http://www.w3.org/1999/html">

    <div>
        <el-row :gutter="20">
            <el-col :lg="6" :md="8" :sm="8">
                <el-card class="bg-primary dashbox">
                    <div>
                        <h3>今日入库数</h3>
                        <p>{{todayStocksIn}}</p>
                    </div>
                    <i class="fa fa-line-chart"></i>
                </el-card>
            </el-col>
            <el-col :lg="6" :md="8" :sm="8">
                <el-card class="bg-warning dashbox">
                    <div>
                        <h3>今日出库数</h3>
                        <p>{{todayStocksOut}}</p>
                    </div>
                    <i class="fa fa-line-chart"></i>
                </el-card>
            </el-col>
            <el-col :lg="6" :md="8" :sm="8">
                <el-card class="bg-success dashbox">
                    <div>
                        <h3>今日销售额</h3>
                        <p>{{todaySales}}</p>
                    </div>
                    <i class="fa fa-rmb"></i>
                </el-card>
            </el-col>
            <el-col :lg="6" :md="8" :sm="8">
                <el-card class="bg-danger dashbox">
                    <div>
                        <h3>今日退货数</h3>
                        <p>{{todayReturn}}</p>
                    </div>
                    <i class="fa fa-shopping-cart"></i>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px">
            <el-col :md="12">
                <el-card>
                    <div slot="header">
                        今日销售统计
                    </div>
                    <div ref="sale" style="height: 350px;"></div>
                </el-card>
            </el-col>
            <el-col :md="12">

                <el-card>
                    <div slot="header">
                        今日库存统计
                    </div>
                    <div ref="stock" style="height: 350px;"></div>
                </el-card>
            </el-col>
        </el-row>
    </div>

</template>

<script>
    export default {
        name: "Dashboard",
        data: () => ({
            todayStocksIn: 2350, // 今日入库数量
            todayStocksOut: 1147, // 今日出库数量
            todaySales: 11452, // 今日销售金额
            todayReturn: 0, // 今日退货数量
        }),
        mounted() {
            this.drawSaleLine();
            this.drawStockPie();
        },
        methods: {
            drawSaleLine() {
                let sale = this.$echarts.init(this.$refs.sale);
                // 指定图表的配置项和数据
                var option = {
                    title: {
                        text: '销售统计'
                    },
                    tooltip: {},
                    legend: {
                        data: ['销量']
                    },
                    xAxis: {
                        data: ["酒", "珠宝首饰", "手表", "箱包"]
                    },
                    yAxis: {},
                    series: [{
                        name: '销量',
                        type: 'bar',
                        data: [5, 20, 36, 10, 10, 20]
                    }]
                };

                // 使用刚指定的配置项和数据显示图表。
                sale.setOption(option);
            },
            drawStockPie() {
                const stock = this.$echarts.init(this.$refs.stock);

                stock.setOption({
                    roseType: 'angle',
                    title: {
                        text: '库存统计'
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '55%',
                            data: [
                                {value: 235, name: '手表'},
                                {value: 274, name: '珠宝首饰'},
                                {value: 310, name: '箱包'},
                                {value: 335, name: '酒'}
                            ]
                        }
                    ],
                    itemStyle: {
                        emphasis: {
                            // 阴影的大小
                            shadowBlur: 200,
                            // 阴影水平方向上的偏移
                            shadowOffsetX: 0,
                            // 阴影垂直方向上的偏移
                            shadowOffsetY: 0,
                            // 阴影颜色
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>