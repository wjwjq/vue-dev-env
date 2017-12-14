<template>
  <div class="error-page">
    <div class="error-page-left">
      <img :src="errorImg" alt="404">
    </div>
    <div class="error-page-right">
      <h3>抱歉,</h3>
      <h3>您访问的页面地址有误或该页面不存在</h3>
      <div class="count-down">{{count}}秒之后会自动跳转，您可以通过以下方式继续访问...</div>
      <router-link to="/" class="back-home">返回首页</router-link>
    </div>
  </div>
</template>

<script>

import errorImg from 'images/404.png';
import error404Style from './index.less';

export default {
  data() {
    return {
      count: 10,
      errorImg
    }
  },
  methods: {
    countDown() {
      this.timer = window.setInterval(() => {
        this.count--;
        if(this.count === 0){
          this.$router.push({path: '/'})
        }
      }, 1000)
    }
  },

  mounted() {
    this.countDown();
  },
  beforeDestory(){
    window.clearInterval(this.timer);
    this.timer = null;
  }
}
</script>
