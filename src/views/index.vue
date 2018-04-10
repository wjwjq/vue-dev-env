<template>
    <div
        class="layout"
        style="height: 100%;min-height:100%;">
        <home v-if="homeShow"/>

        <keep-alive v-else>
            <router-view/>
        </keep-alive>
    </div>
</template>

<script>
import home from "@/views/home/";

export default {
  components: {
    home
  },

  data() {
    return {
      homeShow: false
    };
  },

  watch: {
    $route(to) {
      this.homeShow = to.path === "/";
    }
  },

  mounted() {
    this.homeShow = this.$route.path === "/";
  }
};
</script>
