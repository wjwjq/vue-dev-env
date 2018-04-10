<template>
    <div class="error-page">
        <div class="error-page-left">
            <img :src="data.img['src']" :alt="data.img['alt']">
        </div>
        <div class="error-page-right">
            <div v-if="data['title'] && Array.isArray(data['title'])">
                <h3
                    v-for="title in data.title" 
                    :key="title"
                    v-html="title" />
            </div>
            <div v-else>
                <h3 v-html="data['title']" />
            </div>
            <p>{{ data['desc'] }}</p>
            <div class="count-down">{{ count }} 秒之后会自动跳转，您可以通过以下方式继续访问...</div>
            <router-link to="/" class="back-home">返回首页</router-link>
        </div>
    </div>
</template>


<script>

export default {
  props: {
    data: {
      default: () => ({}),
      type: Object,
      required: true
    }
  },

  data() {
    return {
      count: 10
    };
  },

  mounted() {
    this.countDown();
  },

  beforeDestroy() {
    window.clearInterval(this.timer);
    this.timer = null;
  },

  methods: {
    countDown() {
      this.timer = window.setInterval(() => {
        this.count--;

        if (this.count === 0) {
          this.$router.push({ path: "/" });
        }
      }, 1000);
    }
  }
};
</script>