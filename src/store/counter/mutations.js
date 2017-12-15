import { INCREASE, DECREASE } from "./constant";

export default {
  [INCREASE](state, { payload }) {
    state.counter += 1;
    state.message = payload.message; 
  },

  [DECREASE](state, { payload }) {
    state.counter -= 1;
    state.message = payload.message; 
  }
};