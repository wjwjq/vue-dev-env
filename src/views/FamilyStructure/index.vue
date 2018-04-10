<template>
    <div class="family-structure">
        <div class="content">
            <div class="content-left">
                <div class="content-left-legend">
                    <ul>
                        <li>
                            <span style="background-color: #6A37A9"></span>
                            <span>未婚</span>
                        </li>
                        <li>
                            <span style="background-color: #2468C5"></span>
                            <span>已婚有子女</span>
                        </li>
                        <li>
                            <span style="background-color: #2D957B"></span>
                            <span>未婚无子女</span>
                        </li>
                    </ul>
                </div>
                <div class="content-left-row">
                    <div class="content-left-row-title">
                        <span>高</span>
                        <span>13%</span>
                    </div>
                    <div class="content-left-row-chart high" style="height: 187px;width: 794px;"></div>
                </div>
                <div class="content-left-row">
                    <div class="content-left-row-title">
                        <span>中</span>
                        <span>13%</span>
                    </div>
                    <div class="content-left-row-chart medium" style="height: 187px;width: 794px;"></div>
                </div>
                <div class="content-left-row">
                    <div class="content-left-row-title">
                        <span>低</span>
                        <span>13%</span>
                    </div>
                    <div class="content-left-row-chart low" style="height: 187px;width: 794px;"></div>
                </div>
            </div>
            <div class="content-right">
                <div class="content-right-title">
                    <div>家庭结构</div>
                    <div>套型需求</div>
                </div>
                <ul>
                    <li>
                        <div class="bg-line"></div>
                        <div>
                            <div>
                                <div>
                                    主导 : 三口/二胎/三代
                                </div>
                                <div>
                                    辅助 : 空巢
                                </div>
                            </div>
                            <div>
                                <div>
                                    主导 : 三口/二胎/三代
                                </div>
                                <div>
                                    辅助 : 空巢
                                </div>
                            </div>
                        </div>
                        <div>
                            <div>
                                <div>高改or高端</div>
                                <div>套三双/套四双</div>
                            </div>
                            <div>
                                <div>一步到位中改</div>
                                <div>套三双/套四双</div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="bg-line"></div>
                        <div>
                            <div>
                                <div>
                                    主导 : 三口/二胎/三代
                                </div>
                                <div>
                                    辅助 : 三口之家
                                </div>
                            </div>
                            <div>
                                <div>
                                    主导 : 单身/二人世界
                                </div>
                                <div>
                                    辅助 : 空巢
                                </div>
                            </div>
                        </div>
                        <div>
                            <div>
                                <div>中改or高改</div>
                                <div>套三双/套四双</div>
                            </div>
                            <div>
                                <div>低改or一步到位中改</div>
                                <div>套三双/套四双</div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="bg-line"></div>
                        <div>
                            <div>
                                <div>
                                    主导 : 三口/二胎/三代
                                </div>
                                <div>
                                    辅助 : 空巢
                                </div>
                            </div>
                            <div>
                                <div>
                                    主导 : 单身/二人世界
                                </div>
                                <div>
                                    辅助 : 三口之家
                                </div>
                            </div>
                        </div>
                        <div>
                            <div>
                                <div>中改or高改</div>
                                <div>套三双/套四双</div>
                            </div>
                            <div>
                                <div>低改or一步到位中改</div>
                                <div>套三双/套四双</div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import "./index.less"
    import echarts from "echarts"
    import data from "./ChartIncomeMarriage-tu2.json"

    export default {
        data() {
            return {
                chart1: null,
                chart2: null,
                chart3: null,
                option1: {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        },
                        formatter: '{b}<br />{a0}: {c0}<br />{a1}: {c1}<br />{a2}: {c2}'
                    },
                    grid: {
                        x: 0,
                        x2: 0,
                        y: 0,
                        y2: 0
                    },
                    color: ["#6A37A9", "#2468C5", "#2D957B"],
                    xAxis: {
                        type: 'value',
                        show: false
                    },
                    yAxis: {
                        type: 'category',
                        axisLabel: {
                            inside: true,
                            fontSize: 16,
                            color: "#00FFF6"
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        data: ['>46岁', '26-35岁', '36-45岁', '<25岁']
                    },
                    series: [
                        {
                            name: '未婚',
                            type: 'bar',
                            stack: '高',
                            barWidth: 10,
                            barGap: 35,
                            data: [-120, -132, -101, -134]
                        },
                        {
                            name: '已婚有子女',
                            type: 'bar',
                            stack: '高',
                            barWidth: 10,
                            data: [320, 302, 341, 374]
                        },
                        {
                            name: '已婚无子女',
                            type: 'bar',
                            stack: '高',
                            barWidth: 10,
                            data: [320, 302, 341, 374]
                        }
                    ]
                },
                option2: {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        },
                        formatter: '{b}<br />{a0}: {c0}<br />{a1}: {c1}<br />{a2}: {c2}'
                    },
                    grid: {
                        x: 0,
                        x2: 0,
                        y: 0,
                        y2: 0
                    },
                    color: ["#6A37A9", "#2468C5", "#2D957B"],
                    xAxis: {
                        type: 'value',
                        show: false
                    },
                    yAxis: {
                        type: 'category',
                        axisLabel: {
                            inside: true,
                            fontSize: 16,
                            color: "#00FFF6"
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        data: ['>46岁', '26-35岁', '36-45岁', '<25岁']
                    },
                    series: [
                        {
                            name: '未婚',
                            type: 'bar',
                            stack: '中',
                            barWidth: 10,
                            barGap: 35,
                            data: [-120, -132, -101, -134]
                        },
                        {
                            name: '已婚有子女',
                            type: 'bar',
                            stack: '中',
                            barWidth: 10,
                            data: [320, 302, 341, 374]
                        },
                        {
                            name: '已婚无子女',
                            type: 'bar',
                            stack: '中',
                            barWidth: 10,
                            data: [320, 302, 341, 374]
                        }
                    ]
                },
                option3: {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        },
                        formatter: '{b}<br />{a0}: {c0}<br />{a1}: {c1}<br />{a2}: {c2}'
                    },
                    grid: {
                        x: 0,
                        x2: 0,
                        y: 0,
                        y2: 0
                    },
                    color: ["#6A37A9", "#2468C5", "#2D957B"],
                    xAxis: {
                        type: 'value',
                        show: false
                    },
                    yAxis: {
                        type: 'category',
                        inverse: true,
                        axisLabel: {
                            inside: true,
                            fontSize: 16,
                            color: "#00FFF6"
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        data: ['>46岁', '26-35岁', '36-45岁', '<25岁']
                    },
                    series: [
                        {
                            name: '未婚',
                            type: 'bar',
                            stack: '低',
                            barWidth: 10,
                            barGap: 35,
                            data: [-120, -132, -101, -134]
                        },
                        {
                            name: '已婚有子女',
                            type: 'bar',
                            stack: '低',
                            barWidth: 10,
                            data: [320, 302, 341, 374]
                        },
                        {
                            name: '已婚无子女',
                            type: 'bar',
                            stack: '低',
                            barWidth: 10,
                            data: [320, 302, 341, 374]
                        }
                    ]
                }
            }
        },

        mounted() {
//            this.$nextTick(() => {
                this.dealData();
//            });
        },

        methods: {
            initChart() {
                if (!this.chart1) {
                    this.chart1 = echarts.init(this.$el.querySelector(".high"))
                }

                if (!this.chart2) {
                    this.chart2 = echarts.init(this.$el.querySelector(".medium"))
                }

                if (!this.chart3) {
                    this.chart3 = echarts.init(this.$el.querySelector(".low"))
                }
            },

            dealData() {
                let options = [];

                data.forEach((item1,idx1) => {
                    options.push({
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            },
                            formatter: params => {
                                return params[0].name + '<br/>'
                                    + params[0].seriesName + ' : ' + (0 - params[0].value) + '%<br/>'
                                    + params[1].seriesName + ' : ' + (params[1].value) + '%<br/>'
                                    + params[2].seriesName + ' : ' + (params[2].value) + "%";
                            }
                        },
                        grid: {
                            x: 0,
                            x2: 0,
                            y: 0,
                            y2: 0
                        },
                        color: ["#6A37A9", "#2468C5", "#2D957B"],
                        xAxis: {
                            min: -60,
                            max: 100,
                            type: 'value',
                            show: false
                        },
                        yAxis: {
                            type: 'category',
                            inverse: true,
                            axisLabel: {
                                inside: true,
                                fontSize: 16,
                                color: "#00FFF6"
                            },
                            axisTick: {
                                show: false
                            },
                            axisLine: {
                                show: false
                            },
                            data: ['>46岁', '26-35岁', '36-45岁', '<25岁']
                        },
                        series: []
                    });
                    item1.datas.forEach((item2,idx2) => {
                        options[idx1].series.push({
                            name: item2.name,
                            type: 'bar',
                            stack: item1.name,
                            barWidth: 10,
                            barGap: 35,
                            data: []
                        });
                        item2.datas.forEach((item3) => {
                            if(item2.name === "未婚"){
                                options[idx1].series[idx2].data.push(0 - item3.pre.substring(0,item3.pre.length - 1))
                            }else {
                                options[idx1].series[idx2].data.push(item3.pre.substring(0,item3.pre.length - 1))
                            }
                        });
                    });
                });

                this.initChart();

                this.chart1.setOption(options[0]);
                this.chart2.setOption(options[1]);
                this.chart3.setOption(options[2])
            }
        }
    }
</script>