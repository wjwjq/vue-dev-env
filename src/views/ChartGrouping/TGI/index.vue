<template>
    <div class="tgi">
        <div class="tgi-left">
            <h3 class="tgi-title">阅读偏好 TGI</h3>
            <ul class="tgi-list">
                <li 
                    v-for="(item, idx) in data"
                    :key="item.name"
                    :style="{'background-color': rgbToHex(idx)}"
                >
                    {{ item.name + ' : ' +item.value }}
                    <!-- <span class="tgi-pop">{{ `TGI值：${item.value}` }}</span> -->
                </li>
            </ul>
        </div>
        <div class="tgi-right">
            <ul class="list">
                <li 
                    v-for="(item, idx) in list"
                    :key="idx">
                    <img :src="item.src" :alt="item.alt">
                    <p>{{ item.text }}</p>
                </li>
            </ul>
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

import "./index.less";

import icon1 from "images/tgi_icon_new_1.png";
import icon2 from "images/tgi_icon_new_2.png";
import icon3 from "images/tgi_icon_new_3.png";
import icon4 from "images/tgi_icon_new_4.png";
import icon5 from "images/tgi_icon_new_5.png";

const list = [
  {
    src: icon1,
    alt: "",
    text: "知识型"
  },
  {
    src: icon2,
    alt: "",
    text: "自由、享乐"
  },
  {
    src: icon3,
    alt: "",
    text: "新兴事物的探索与关注"
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
  name: "TGI",

  data() {
    return {
      data: [],
      list: [],
      rightList: [],
      colors: [
        "#1b2094",
        "#262bab",
        "#2e3d9d",
        "#2e4895",
        "#2f4ea0",
        "#3459b6",
        "#3a63c3",
        "#4470d2",
        "#4a84e2",
        "#4797e8",
        "#68b0fa",
        "#8fccff"
      ]
    };
  },

  mounted() {
    this.data = data;
    this.list = list;
    this.rightList = rightList;
  },

  methods: {
    rgbToHex(idx) {
      let hex = this.colors[idx];
      
      var rgb = [];
      
      hex = hex.substr(1);//去除前缀 # 号

      if (hex.length === 3) { // 处理 "#abc" 成 "#aabbcc"
        hex = hex.replace(/(.)/g, "$1$1");
      }

      hex.replace(/../g, function (color) {
        rgb.push(parseInt(color, 0x10));//按16进制将字符串转换为数字
      });

      return `rgb(${rgb.join(",")} ,.8)`;
    }
  }
};
</script>