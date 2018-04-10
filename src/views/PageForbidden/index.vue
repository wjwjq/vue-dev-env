<template>
    <page-error :data="config" />
</template>

<script>
import PageError from "components/PageError";

import errorImg from "images/403.png";

export default {
  name: "PageForbidden",
  
  components: {
    PageError
  },

  data() {
    return {
      config: {
        img: {
          src: errorImg,
          alt: "403"
        },
        title: "禁止访问 <span>HTTP错误403</span>",
        desc: "服务器拒绝了您的请求,请确认您拥有所需的访问权限"
      }
    };
  }
};
</script>