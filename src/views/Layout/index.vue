<template>
    <div
        ref="layout"
        class="layout" >
        <keep-alive>
            <component :is="comp" />
        </keep-alive>

        <!-- <button 
            class="fullscreen" 
            style="position: absolute; top: 0; left: 0;z-index: 100;" 
            @click="fullscreen"> 进入全屏 </button> -->

        <div class="arc-wrap">
            <div class="arc arc-top-left"/>
            <div class="arc arc-top-right"/>
            <div class="arc arc-bottom-right"/>
            <div class="arc arc-bottom-left"/>
        </div>
    </div>
</template>

<script>
import "./index.less";

import Home from "../Home";
import Login from "../Login";

export default {
  name: "Layout",

  components: {
    Home,
    Login
  },

  data() {
    return {
      height: 500,
      comp: "Home",
      visited: true
    };
  },

  watch: {
    $route(nv, ov) {
      //todos: Authentication
      if (nv.path !== ov.path) {
        this.path2Comp(nv.path);
      }
    }
  },

  mounted() {
  

    this.path2Comp(this.$route.path);

   
  },

  methods: {
    path2Comp(path) {
      // if (!this.visited) {
      //   this.visited = true;
      //   this.$router.push({ path: "/login" });
      // }
      
      this.comp = path === "/login" ? "Login" : "Home";
    },

    fullscreen() {
      this.$refs["layout"].webkitRequestFullscreen();
    }

  }
};
</script>