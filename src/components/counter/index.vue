<template>
  <div>
    <div>state counter: {{ counter().counter }}</div>
    <div>query counter: {{ queryCounter() }}</div>
    <div>counter msg: {{ counterMsg }}</div>
    <div>
      <button @click="handleIncrease">+</button>
      <button
        @click="handleDecrease" 
        style="margin-left: 30px;">
        -
      </button>
    </div>
  </div>
</template>

<style scoped>
button {
  width: 40px;
  padding: 0;
  font-size: 14px;
  line-height: 2;
  height: 28px;
}
</style>


<script>
import { mapState, mapActions, mapGetters } from "vuex";
import * as counter from "store/counter/constant";
export default {
  data() {
    return {
      counterMsg: ""
    };
  },
  computed: {
    getCounterMsg() {
      return this.$store.state.counter.message;
    }
  },
  watch: {
    getCounterMsg(msg) {
      this.counterMsg = msg;
    }
  },
  methods: {
    ...mapState({
      counter: state => state.counter
    }),

    ...mapActions({
      INCREASE: counter.INCREASE,
      DECREASE: counter.DECREASE
    }),

    ...mapGetters({
      queryCounter: "queryCounter"
    }),
    
    handleIncrease() {
      this.INCREASE();
    },

    handleDecrease() {
      this.DECREASE();
    }
  }
};
</script>
