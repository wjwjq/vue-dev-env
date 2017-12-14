<template>
  <div>
    <div>{{message}}</div>
    <counter />
  </div>
</template>
<script>
import counter from "components/counter";
export default {
  components: {
    counter
  },
  data() {
    return {
      message: "首页"
    };
  }
};
</script>

