<template>
    <div class="charts" @mouseover="getY($event)">
        <div class="funnel"/>
        <div class="table">
            <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                    prop="date"
                    label="刚需80㎡以下"
                    width="180"/>
                <el-table-column
                    prop="name"
                    label="低改80-90㎡"
                    width="180"/>
                <el-table-column
                    prop="address"
                    label="中改90-110㎡"/>
                <el-table-column
                    prop="address"
                    label="高改110-130㎡"/>
                <el-table-column
                    prop="address"
                    label="高端130㎡以上"/>
            </el-table>
        </div>
        <div class="floatBox">
            <div
                v-for="(item,index) in tableData"
                :key="index" 
                :class="{'default-class': true, 'active-class': active === index}" >
                <!--我是第{{index +1 }}行-->
            </div>
        </div>
    </div>
</template>

<script>
import echarts from "echarts";
import "./index.less";

export default {
  data() {
    return {
      active: "",
      option: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}%"
        },
        //        legend: {
        //          orient: "vertical",
        //          left: "left",
        //          data: ["展现","点击","访问","咨询","订单"]
        //        },
        calculable: true,
        series: [
          {
            name: "金字塔",
            type: "funnel",
            width: "40%",
            height: "45%",
            left: "5%",
            top: "5%",
            sort: "ascending",
            label: {
              normal: {
                position: "center"
              }
            },
            data: [{ value: 60, name: "访问" }, { value: 30, name: "咨询" }]
          },
          {
            name: "漏斗图",
            type: "funnel",
            width: "40%",
            height: "45%",
            left: "5%",
            top: "50%",
            label: {
              normal: {
                position: "center"
              }
            },
            data: [{ value: 60, name: "访问" }, { value: 30, name: "咨询" }]
          }
        ]
      },
      tableData: [{}, {}, {}, {}, {}],

      chart: null
    };
  },
  mounted() {
    this.chart = echarts.init(this.$el.querySelector(".funnel"));
    this.chart.setOption(this.option);
  },

  methods: {
    getY(event) {
      this.active = parseInt(event.layerY / 44);
    }
  }
};
</script>