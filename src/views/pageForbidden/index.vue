<template>
  <div class="error-page">
    <div class="error-page-left">
      <img :src="errorImg" alt="404">
    </div>
    <div class="error-page-right">
      <h3>禁止访问 <span>HTTP错误403</span></h3>
      <p>服务器拒绝了您的请求,请确认您拥有所需的访问权限</p>
      <div class="count-down">{{count}}秒之后会自动跳转，您可以通过以下方式继续访问...</div>
      <router-link to="/" class="back-home">返回首页</router-link>
    </div>
  </div>
</template>

<script>

import errorImg from 'images/403.png';
import error403Style from './index.less';

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