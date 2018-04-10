<template>
    <div class="box-frame">
        <div :style="{ padding:boxPadding }" class="frame-box" >
            <slot/>
            <img :src="leftTop" class="box-left-top">
            <img :src="rightTop" class="box-right-top">
            <img :src="leftBottom" class="box-left-bottom">
            <img :src="rightBottom" class="box-right-bottom">
        </div>
    </div>
</template>

<script>
import leftTop from "./../../assets/images/box-left-top.png";
import rightTop from "./../../assets/images/box-right-top.png";
import leftBottom from "./../../assets/images/box-left-bottom.png";
import rightBottom from "./../../assets/images/box-right-bottom.png";

import "./index.less";

export default {
  props: {
    padding: {
      type: [String, Number],
      default: 0
    }
  },

  data() {
    return {
      boxPadding: 0,
      leftTop: leftTop,
      rightTop: rightTop,
      leftBottom: leftBottom,
      rightBottom: rightBottom
    };
  },

  mounted() {
    this.boxPadding = parseInt(this.padding) + "px";
  }
};
</script>

