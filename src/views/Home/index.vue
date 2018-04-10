<template>
    <div class="home">
        <div 
            ref="mainHeader"
            :style="{height: headerHeight + 'px'}" 
            class="main-header" >
            <main-nav />
        </div>
        
        <div 
            :style="{height: bodyHeight + 'px'}"
            class="main-body">
            <keep-alive>
                <router-view />
            </keep-alive>
        </div>
    </div>
    
</template>

<script>
import MainNav from "components/Nav";

export default {
  name: "Layout",

  components: {
    "main-nav": MainNav
  },

  props: {
    height: {
      default: 0,
      type: Number
    }
  },

  data() {
    return {
      headerHeight: 120,
      bodyHeight: 0
    };
  },


  watch: {
    $route(nv, ov) {
      if (nv.path !== ov.path) {
        this.setHeight();
      }
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.setHeight();

      document.addEventListener("webkitfullscreenchange", this.onFullcreenChange);

      document.addEventListener("keydown", this.onF11Keydown );
    });
  },
  
  beforeDestroy() {
    document.removeEventListener("webkitfullscreenchange", this.onFullscreenChange);
    document.removeEventListener("keydown", this.onF11Keydown);
  },

  methods: {
    onFullscreenChange() {
      this.setHeightDealy();
    },
    
    onF11Keydown(e) {
      if (e.keyCode === 122) {
        this.setHeightDealy();
      }
    },

    setHeightDealy() {
      window.setTimeout(() => this.setHeight(), 300);
    },

    setHeight() {
      this.headerHeight = this.$route.path === "/" ? 120 : 180;
      this.bodyHeight = document.documentElement.clientHeight - this.headerHeight; //this.$refs.mainHeader.clientHeight;
    }
  }
};
</script>