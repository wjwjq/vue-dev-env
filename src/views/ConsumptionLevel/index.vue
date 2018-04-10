<template>
    <div class="consumption-level">
        <div class="title">
            消费能力水平
            <div class="title-icon"/>
        </div>
        <div class="content">
            <div class="content-circle" style="width: 459px;height: 727px;"></div>
            <div class="content-table">
                <div class="content-table-back">
                    <div
                            v-for="(item,index) in tableData"
                            :key="index"
                            class="content-table-back-row"
                            :class="{ 'active':index === active} "
                            @mouseover="enlargeTr(index)"
                            @mouseout="narrowTr">{{item}}</div>
                </div>
                <div class="content-table-left-piece"></div>
                <div class="content-table-right-piece">
                    <div class="content-table-right-piece-tr1">
                        <div class="content-table-cell">
                            刚需<br>80㎡以下
                        </div>
                        <div>
                            <div class="content-table-cell">
                                低改<br>80-90㎡
                            </div>
                            <div class="content-table-cell">
                                中改<br>90-110㎡以下
                            </div>
                            <div class="content-table-cell">
                                高改<br>110-130㎡以下
                            </div>
                        </div>
                        <div class="content-table-cell">
                            高端<br>130㎡以上
                        </div>
                    </div>
                    <table>
                        <tr>
                            <td class="content-table-cell"></td>
                            <td class="content-table-cell content-table-tr1-special"></td>
                            <td class="content-table-cell content-table-tr1-special"></td>
                            <td class="content-table-cell content-table-tr1-special"></td>
                            <td class="content-table-cell content-table-tr1-special"></td>
                        </tr>
                        <tr>
                            <td class="content-table-cell"></td>
                            <td class="content-table-cell content-table-tr2-special"></td>
                            <td class="content-table-cell content-table-tr2-special"></td>
                            <td class="content-table-cell content-table-tr2-special"></td>
                            <td class="content-table-cell content-table-tr2-special"></td>
                        </tr>
                        <tr>
                            <td class="content-table-cell content-table-tr3-special"></td>
                            <td class="content-table-cell content-table-tr3-special"></td>
                            <td class="content-table-cell content-table-tr3-special"></td>
                            <td class="content-table-cell content-table-tr3-special"></td>
                            <td class="content-table-cell"></td>
                        </tr>
                        <tr>
                            <td class="content-table-cell content-table-tr4-special"></td>
                            <td class="content-table-cell content-table-tr4-special"></td>
                            <td class="content-table-cell content-table-tr4-special"></td>
                            <td class="content-table-cell"></td>
                            <td class="content-table-cell"></td>
                        </tr>
                        <tr>
                            <td class="content-table-cell content-table-tr5-special"></td>
                            <td class="content-table-cell content-table-tr5-special"></td>
                            <td class="content-table-cell"></td>
                            <td class="content-table-cell"></td>
                            <td class="content-table-cell"></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import "./index.less";
import echarts from "echarts"
import data from "./ChartIncome-tu1.json"

export default {
  data() {
    return {
        isHover: false,
        active: "",
        chart: null,
        option: {
            tooltip: {
                trigger: 'item'
            },
            color: ["#FF2D1E","#01CC9D","#0193E8"],
            series: [
                {
                    name:'消费能力水平',
                    type:'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[]
                }
            ]
        },
        tableData: []
    };
  },

  mounted() {
      console.log(data)
    this.initChart();

    this.chart.setOption(this.option);

    this.dealData()
  },

  methods: {
    initChart() {
        if(!this.chart){
            this.chart = echarts.init(this.$el.querySelector(".content-circle"));
        }
    },

    enlargeTr(index) {
       this.active = index;
    },

    narrowTr() {
        this.active = "";
    },

    dealData() {
        this.option.series[0].data = data.chart.map(item => {
            return {
                value: item.value,
                name: item.name
            }
        });

        this.chart.setOption(this.option);

        let tableData = [];

        data.body.forEach(parent => {
            parent.datas.forEach(child => {
                tableData.push(child.pre)
            })
        });

        this.tableData = tableData;
    }
  }
};
</script>