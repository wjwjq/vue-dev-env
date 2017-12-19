import { INCREASE, DECREASE } from "./constant";

export default {
  [INCREASE]({ commit }) {
    commit({
      type: INCREASE,
      payload: {
        message: "counter + 1"
      }
    });
  },

  [DECREASE]({ commit }) {
    commit({
      type: DECREASE,
      payload: {
        message: "counter - 1"
      }
    });
  }
};