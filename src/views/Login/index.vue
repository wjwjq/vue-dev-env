<template>
    <div class="login-page">
        
        <img :src="logo.src" class="login-page-logo" >
        <div class="left">
            <div class="left-content">
                <div class="left-content-title">客户画像交互系统</div>
                <div class="left-content-item">
                    <i class="left-content-item-point"/>
                    <label class="left-content-item-text">解构数据，辅助决策，站位客户角度，洞察客户需求</label>
                </div>

                <div class="left-content-item">
                    <i class="left-content-item-point"/>
                    <label class="left-content-item-text">全客层分析，增量研判，构建竞争体系，赋能定位智慧</label>
                </div>
            
                <div class="left-content-item">
                    <i class="left-content-item-point"/>
                    <label class="left-content-item-text">本地挖掘，异地拓客，优化渠道，迭代智能营销</label>
                </div>

            </div>
        </div>

        <div class="right">
            <div class="login-box">
                <div class="login-box-top-left"/>
                <div class="login-box-top-right"/>
                <div class="login-box-bottom-left"/>
                <div class="login-box-bottom-right"/>

                <div class="login-content">
                    <div class="login-content-title">客户画像报告登录</div>
                    <div/>
                    <input 
                        v-model="account"
                        class="login-content-account" 
                        type="text" 
                        placeholder="邀请码/账号"
                        @keyup.enter="login" >
                    <div/>
                    <button class="login-content-button" @click="login">登    录</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import "./index.less";
import logoSrc from "images/logo.png";

const account = ["admin"];

export default {
  data() {
    return {
      logo: {
        src: logoSrc
      },
      account: ""
    };
  },

  methods: {
    login() {
      if (account.indexOf(this.account) > -1) {
        this.$router.push("/");
      }
    }
  }
};
</script>
