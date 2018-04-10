<template>
    <box-frame :padding="35">
        <content-box>
            <div class="income-statistics">
                <div class="income-left">
                    <div class="income-pie" style="width:100%;height:100%;"/>
                </div>
                <div class="income-right">
                    <div class="income-right-legend">
                        <div class="income-legend-item">
                            <i class="legend-item-color color1"/>
                            <label>低收入</label>
                        </div>
                        <div class="income-legend-item">
                            <i class="legend-item-color color2"/>
                            <label>中收入</label>
                        </div>
                        <div class="income-legend-item">
                            <i class="legend-item-color color3"/>
                            <label>高收入</label>
                        </div>
                    </div>
                    <div :class="{ 'item-hover' : isHoverBar1 }" class="income-bar1" />
                    <div :class="{ 'item-hover' : isHoverBar2 }" class="income-bar2"/>
                </div>
            </div>
        </content-box>
    </box-frame>
</template>

<script>
import "./index.less";
import dataSource from "./data.js";
import boxFrame from "./../../components/BoxFrame";
import contentBox from "./../../components/ContentBox";

export default {
  name: "IncomeStatistics",

  components: {
    "box-frame": boxFrame,
    "content-box": contentBox
  },

  data() {
    return {
      isHoverBar1: false,
      isHoverBar2: false,
      pieData: [],
      bar1Data: [],
      bar2Data: [],
      chart: {
        pie: null,
        bar1: null,
        bar2: null
      },
      chartSeries: {
        xData: [],
        pie: [
          {
            name: "收入比例",
            type: "pie",
            radius: ["58%", "70%"],
            avoidLabelOverlap: false,
            startAngle: 180,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                color: "#01152C",
                textBorderColor: "#0093EA",
                textBorderWidth: 3,
                textShadowOffsetX: 1,
                textShadowOffsetY: 1,
                show: true,
                textStyle: {
                  fontWeight: 600,
                  fontSize: "22"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: []
          }
        ],
        bar1: [
          /**低收入 */
          {
            name: "低收入",
            type: "bar",
            barWidth: "30px",
            barGap: 0,
            zlevel: 1,
            label: {
              normal: {
                color: "#efefef",
                formatter: a => {
                  return a.value + "%";
                }
              }
            },
            itemStyle: {
              normal: {
                color: "#6b02ec"
              }
            },
            data: []
          },
          /**中收入 */
          {
            name: "中收入",
            type: "bar",
            barWidth: "30px",
            barGap: 0,
            label: {
              normal: {
                color: "#efefef",
                formatter: a => {
                  return a.value + "%";
                }
              }
            },
            itemStyle: {
              normal: {
                color: "#156ce4"
              }
            },
            data: []
          },
          /**高收入 */
          {
            name: "高收入",
            type: "bar",
            barWidth: "30px",
            barGap: 0,
            label: {
              normal: {
                color: "#efefef",
                formatter: a => {
                  return a.value + "%";
                }
              }
            },
            itemStyle: {
              normal: {
                color: "#17aab6"
              }
            },
            data: []
          }
        ],
        bar2: [
          {
            name: "低收入",
            type: "bar",
            barWidth: "30px",
            barGap: 0,
            zlevel: 1,
            label: {
              normal: {
                color: "#efefef",
                formatter: a => {
                  return a.value + "%";
                }
              }
            },
            itemStyle: {
              normal: {
                color: "#6b02ec"
              }
            },
            data: []
          },
          {
            name: "中收入",
            type: "bar",
            barWidth: "30px",
            barGap: 0,
            label: {
              normal: {
                color: "#efefef",
                formatter: a => {
                  return a.value + "%";
                }
              }
            },
            itemStyle: {
              normal: {
                color: "#156ce4"
              }
            },
            data: []
          },
          {
            name: "高收入",
            type: "bar",
            barWidth: "30px",
            barGap: 0,
            label: {
              normal: {
                color: "#efefef",
                formatter: a => {
                  return a.value + "%";
                }
              }
            },
            itemStyle: {
              normal: {
                color: "#17aab6"
              }
            },
            data: []
          }
        ]
      }
    };
  },

  mounted() {
    this.handleData();
    this.initData();

    setTimeout(() => {
      this.initChart();
      this.setBarOption();
      this.bindChartEvent();
    }, 200);
  },

  beforeDestroy() {
    this.chart.pie.clear();
    this.chart.bar1.clear();
    this.chart.bar2.clear();

    this.chart.pie.dispose();
    this.chart.bar1.dispose();
    this.chart.bar2.dispose();

    this.chart.pie = null;
    this.chart.bar1 = null;
    this.chart.bar2 = null;
  },

  methods: {
    handleData() {
      this.handlePieData();
      this.handleBar1Data();
      this.handleBar2Data();
    },

    handlePieData() {
      let data = [];

      dataSource.pie.forEach(item => {
        data.push({
          name: item.name,
          value: item.value
        });
      });

      this.pieData = data;
    },

    handleBar1Data() {
      let data = [];
      let xData = [];

      let tempData = dataSource.columnar[1].datas,
        dataArray = Object.keys(tempData);

      for (let i = 0; i < dataArray.length; i++) {
        data.push([]);
      }

      dataArray.forEach(key => {
        xData.push(tempData[key].name);

        let datas = tempData[key].datas,
          len = datas.length;

        for (let j = 0; j < len; j++) {
          data[j].push(parseFloat(datas[j].pre));
        }
      });

      this.chartSeries.xData = xData;
      this.bar1Data = data;
    },

    handleBar2Data() {
      let data = [];

      let tempData = dataSource.columnar[0].datas,
        dataArray = Object.keys(tempData);

      for (let i = 0; i < dataArray.length; i++) {
        data.push([]);
      }

      dataArray.forEach(key => {
        let datas = tempData[key].datas,
          len = datas.length;

        for (let j = 0; j < len; j++) {
          data[j].push(parseFloat(datas[j].pre));
        }
      });

      this.bar2Data = data;
    },

    initData() {
      this.chartSeries.xData = [];

      this.chartSeries.pie[0].data = [];

      this.chartSeries.bar1[0].data = [];
      this.chartSeries.bar1[1].data = [];
      this.chartSeries.bar1[2].data = [];

      this.chartSeries.bar2[0].data = [];
      this.chartSeries.bar2[1].data = [];
      this.chartSeries.bar2[2].data = [];

      this.setXData();
      this.setPieData();
      this.setBar1Data();
      this.setBar2Data();
    },

    initChart() {
      if (!this.chart.pie) {
        this.chart.pie = echarts.init(this.$el.querySelector(".income-pie"));
      }

      if (!this.chart.bar1) {
        this.chart.bar1 = echarts.init(this.$el.querySelector(".income-bar1"));
      }

      if (!this.chart.bar2) {
        this.chart.bar2 = echarts.init(this.$el.querySelector(".income-bar2"));
      }
    },

    setXData() {
      this.chartSeries.xData = ["25岁以下", "26-35岁", "36-45岁", "46岁以上"];
    },

    setPieData() {
      this.chartSeries.pie[0].data = this.pieData;
    },

    setBar1Data() {
      this.chartSeries.bar1[0].data = this.bar1Data[0];
      this.chartSeries.bar1[1].data = this.bar1Data[1];
      this.chartSeries.bar1[2].data = this.bar1Data[2];
    },

    setBar2Data() {
      this.chartSeries.bar2[0].data = this.bar2Data[0];
      this.chartSeries.bar2[1].data = this.bar2Data[1];
      this.chartSeries.bar2[2].data = this.bar2Data[2];
    },

    setBarOption() {
      this.chart.pie && this.chart.pie.setOption(this.getPieOption());
      this.chart.bar1 && this.chart.bar1.setOption(this.getBar1Option());
      this.chart.bar2 && this.chart.bar2.setOption(this.getBar2Option());
    },

    getPieOption() {
      return {
        tooltip: {
          trigger: "item",
          backgroundColor: "none",
          formatter: a => {
            return `<div class="pie-tooltip">${a.data.name} : ${
              a.data.value
            }( ${a.percent}% )</div>`;
          }
        },
        color: ["#FF2D1D", "#0093E7"],
        grid: {
          top: 60,
          left: 60,
          bottom: 60,
          right: 60
        },
        series: this.chartSeries.pie
      };
    },

    getBar1Option() {
      return {
        title: {
          text: "本地客统计",
          textStyle: {
            fontSize: 20,
            fontWeight: "normal",
            color: "#efefef"
          },
          top: 5,
          left: "6.5%"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            shadowStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(5, 48, 97,0.1)"
                  },
                  {
                    offset: 0.5,
                    color: "rgba(5, 48, 97,0.8)"
                  },
                  {
                    offset: 1,
                    color: "rgba(5, 48, 97,0.1)"
                  }
                ]
              }
            }
          },
          formatter: a => {
            return this.formatTooltipContent(a);
          }
        },
        grid: {
          left: "8%",
          right: "4%",
          bottom: "15%"
        },
        xAxis: {
          type: "category",
          axisLine: {
            lineStyle: {
              color: "#305269"
            }
          },
          axisLabel: {
            fontSize: "14",
            color: "#efefef"
          },
          splitLine: {
            lineStyle: {
              color: ["#305269"]
            }
          },
          data: this.chartSeries.xData
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#305269"
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            // fontWeight: "14",
            // color: "#efefef"
            show: false
          },
          splitLine: {
            lineStyle: {
              color: ["#305269"]
            }
          }
        },
        series: this.chartSeries.bar1
      };
    },

    getBar2Option() {
      return {
        title: {
          text: "外地客统计",
          textStyle: {
            fontSize: 20,
            fontWeight: "normal",
            color: "#efefef"
          },
          top: 5,
          left: "6.5%"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            shadowStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(5, 48, 97,0.1)"
                  },
                  {
                    offset: 0.5,
                    color: "rgba(5, 48, 97,0.8)"
                  },
                  {
                    offset: 1,
                    color: "rgba(5, 48, 97,0.1)"
                  }
                ]
              }
            }
          },
          formatter: a => {
            return this.formatTooltipContent(a);
          }
        },
        grid: {
          left: "8%",
          right: "4%",
          bottom: "15%"
        },
        xAxis: {
          type: "category",
          axisLine: {
            lineStyle: {
              color: "#305269"
            }
          },
          axisLabel: {
            fontSize: "14",
            color: "#efefef"
          },
          splitLine: {
            lineStyle: {
              color: ["#305269"]
            }
          },
          data: this.chartSeries.xData
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#305269"
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            // fontWeight: "14",
            // color: "#efefef"
            show: false
          },
          splitLine: {
            lineStyle: {
              color: ["#305269"]
            }
          }
        },
        series: this.chartSeries.bar2
      };
    },

    bindChartEvent() {
      this.chart.pie.on("mouseover", param => {
        let name = param.name;

        if (name === "本地客") {
          this.isHoverBar1 = true;
          this.isHoverBar2 = false;
        } else if (name === "外地客") {
          this.isHoverBar1 = false;
          this.isHoverBar2 = true;
        }
      });

      this.chart.pie.on("mouseout", () => {
        this.isHoverBar1 = false;
        this.isHoverBar2 = false;
      });
    },

    formatTooltipContent(data) {
      // console.log(data);
      let html = `<div class="tooltip-header">${data[0].axisValueLabel}</div>`;

      data.forEach(item => {
        html += `<div class="tooltip-item">
        ${item.marker}
        <label>${item.seriesName}: </label>
        <label>${item.value}%</label>
        </div>`;
      });

      return html;
    }
  }
};
</script>
