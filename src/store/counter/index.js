//compose module
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

const initialState = {
  counter: 0,
  message: ""
};

export default {
  state: Object.assign({}, initialState),
  mutations,
  actions,
  getters
};