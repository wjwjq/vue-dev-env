<template>
    <div class="tgi-chart">
        <div class="tgi-chart-left">
            <h3 class="tgi-chart-title">阅读偏好</h3>
            <div class="tgi-chart-left-wrap">
                <div 
                    class="chart-wrapper" >
                    <div class="chart chart-back">
                        <div 
                            id="chart-back-inner" 
                            style="width: 840px; height: 678px;" />
                    </div>
                    <div class="chart chart-front" >
                        <div 
                            id="chart-front-inner" 
                            style="width: 840px; height: 678px;" />
                    </div>
                </div>
                <ul class="list">
                    <li 
                        v-for="(item, idx) in list"
                        :key="idx">
                        <img :src="item.src" :alt="item.alt">
                        <p>{{ item.text }}</p>
                    </li>
                </ul>
            </div>
        </div>
        <div class="tgi-chart-right">
            <ul class="right-list">
                <li 
                    v-for="(item, idx) in rightList"
                    :key="idx">
                    <div>
                        <h4>{{ item.title }}</h4>
                        <p>{{ item.text }}</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import data from "./ChartTgi.json";

import echarts from "echarts";
import "./index.less";

import icon1 from "images/tgi_icon_1.png";
import icon2 from "images/tgi_icon_2.png";
import icon3 from "images/tgi_icon_3.png";
import icon4 from "images/tgi_icon_4.png";
import icon5 from "images/tgi_icon_5.png";

const list = [
  {
    src: icon1,
    alt: "",
    text: "知识型"
  },
  {
    src: icon2,
    alt: "",
    text: "新兴事物的探索与关注"
  },
  {
    src: icon3,
    alt: "",
    text: "自由、享乐"
  },
  {
    src: icon4,
    alt: "",
    text: "资产增值关注"
  },
  {
    src: icon5,
    alt: "",
    text: "健康生活"
  }
];

const rightList = [
  {
    title: "进取型特质:",
    text: "先进文化吸收"
  },
  {
    title: "进取型特质:",
    text: "探索"
  },
  {
    title: "享乐型特质:",
    text: "旅游"
  },
  {
    title: "进取型特质:",
    text: "增值"
  },
  {
    title: "内向型特质:",
    text: "食疗"
  }
];

export default {
  name: "ChartTgi",

  data() {
    return {
      list: [],
      rightList: []
    };
  },

  mounted() {
    this.list = list;
    this.rightList = rightList;
    this.init();
  },

  methods: {
    init() {
      this.frontChart = echarts.init(
        this.$el.querySelector("#chart-front-inner")
      );
      this.frontChart.setOption(this.computedOption());
      this.backChart = echarts.init(
        this.$el.querySelector("#chart-back-inner")
      );
      this.backChart.setOption(this.computedBackOption());
    },

    computedOption() {
      const colors = [
        "#00dcdf",
        "#00b4a1",
        "#11a173",
        "#279857",
        "#56b047",
        "#81b742",
        "#abc23f",
        "#c2ae3f",
        "#b6882f",
        "#db9d4c"
      ].reverse();

      let legend = [],
        series = [],
        supportData = [];

      const len = data.length;

      if (!len) {
        return;
      }

      data.sort((a, b) => a.value - b.value);

      const max = data[len - 1].value + 50;

      const average = max / len;

      data.forEach((item, idx) => {
        legend.push({
          value: item.name,
          textStyle: {
            fontSize: 20,
            color: "red"
          }
        });

        const lineData = new Array(len).fill("").map((value, index) => {
          if (idx === index) {
            return item.value;
          } else {
            return "-";
          }
        });

        supportData.push(average);

        const front = {
          name: item.name,
          type: "bar",
          stack: "总量",
          barWidth: 16,
          label: {
            normal: {
              show: false
            }
          },
          itemStyle: {
            // shadowColor: "rgba(0, 0, 0, 0.5)",
            // shadowBlur: 10,
            color: colors[idx],
            barBorderRadius: [20, 20, 20, 20]
          },
          emphasis: {
            itemStyle: {
              shadowColor: "rgba(255, 255, 255, 0.5)",
              shadowBlur: 20,
              borderWidth: 25,
              color: colors[idx],
              barBorderRadius: [20, 20, 20, 20],
              opacity: 1
            }
          },
          data: lineData
        };
        series.push(front);
      });

      return {
        tooltip: {
          trigger: "axis",
          formatter: function (rest) {
            const result = rest.filter(
              item => item.seriesName !== "辅助" && item.data !== "-"
            );
            return `TGI值：${result[0].value}`;
          },
          axisPointer: {
            type: "shadow",
            label: {
              show: false,
              color: "#2cc5d3",
              fontWeight: "bold",
              fontSize: "14px",
              padding: [20, 10, 20, 0],
              backgroundColor: "transparent"
              // backgroundColor: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              //   {
              //     offset: 0,
              //     color: "rgba(6, 37, 71, .1)"
              //   },
              //   {
              //     offset: 1,
              //     color: "rgba(6, 37, 71, .1)"
              //   }
              // ])
            },
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
                    color: "rgba(6, 37, 71, .1)" // 0% 处的颜色
                  },
                  {
                    offset: 0.3,
                    color: "rgba(17,114,222,.3)" // 100% 处的颜色
                  },
                  {
                    offset: 0.75,
                    color: "rgba(17,114,222,.3)" // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(6, 37, 71, .1)" // 100% 处的颜色
                  }
                ]
              }
            }
          }
        },

        grid: {
          top: "10px",
          left: "54",
          right: "4%",
          bottom: "60px",
          containLabel: true
        },

        xAxis: {
          type: "value",
          max: max + average,
          splitLine: {
            show: false
          },
          axisLine: {
            show: true,
            onZero: false,
            lineStyle: {
              color: "#0172d2"
            }
          },
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          }
        },

        yAxis: [
          {
            type: "category",
            data: legend,
            axisLine: {
              lineStyle: {
                color: "#0172d2"
              }
            },
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              color: "#30c8d3"
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "辅助",
            type: "bar",
            stack: "总量",
            itemStyle: {
              normal: {
                barBorderColor: "rgba(0,0,0,0)",
                color: "rgba(0,0,0,0)"
              },
              emphasis: {
                barBorderColor: "rgba(0,0,0,0)",
                color: "rgba(0,0,0,0)"
              }
            },
            data: supportData
          },
          ...series
        ]
      };
    },

    computedBackOption() {
      let legend = [],
        series = [],
        supportData = [];

      const len = data.length;

      if (!len) {
        return;
      }

      data.sort((a, b) => a.value - b.value);

      const max = data[len - 1].value + 50;

      const average = (max + 50) / len;

      data.forEach((item, idx) => {
        legend.push({
          value: item.name,
          textStyle: {
            fontSize: 20,
            color: "red"
          }
        });

        const lineData = new Array(len).fill("").map((value, index) => {
          if (idx === index) {
            return max;
          } else {
            return "-";
          }
        });

        supportData.push(average);

        const front = {
          name: item.name,
          type: "bar",
          stack: "总量",
          barWidth: 16,
          label: {
            normal: {
              show: false
            }
          },
          itemStyle: {
            color: "#04284a",
            barBorderRadius: [20, 20, 20, 20]
          },
          data: lineData
        };
        series.push(front);
      });

      return {
        tooltip: {
          show: false
        },

        grid: {
          top: "10px",
          left: "54",
          right: "4%",
          bottom: "60px",
          containLabel: true
        },

        xAxis: {
          show: false,
          type: "value",
          max: max + average,
          splitLine: {
            show: false
          },
          axisLine: {
            show: false,
            onZero: false
          },
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          }
        },

        yAxis: [
          {
            type: "category",
            data: legend,
            show: false,
            axisLine: {
              lineStyle: {
                color: "#0172d2"
              }
            },
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              color: "#30c8d3"
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "辅助",
            type: "bar",
            stack: "总量",
            itemStyle: {
              normal: {
                barBorderColor: "rgba(0,0,0,0)",
                color: "rgba(0,0,0,0)"
              },
              emphasis: {
                barBorderColor: "rgba(0,0,0,0)",
                color: "rgba(0,0,0,0)"
              }
            },
            data: supportData
          },
          ...series
        ]
      };
    }
  }
};
</script>