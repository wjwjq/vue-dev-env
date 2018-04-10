<template>
    <page-error :data="config" />
</template>

<script>
import PageError from "../../components/PageError";

import errorImg from "images/404.png";

export default {
  name: "PageNotFound",
  
  components: {
    PageError
  },

  data() {
    return {
      config: {
        img: {
          src: errorImg,
          alt: "404"
        },
        title: ["抱歉,", "您访问的页面地址有误或该页面不存在"]
      }
    };
  }
};
</script>