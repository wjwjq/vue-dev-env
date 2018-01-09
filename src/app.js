import Vue from "vue";
import {
  Tabs,
  TabPane
} from "element-ui";
import router from "router/";
import store from "store/";
import app from "views/layout/";

import "styles/";

Vue.component(Tabs.name, Tabs);
Vue.component(TabPane.name, TabPane);

new Vue({
  el: "#app",
  render: h => h(app),
  router,
  store
});