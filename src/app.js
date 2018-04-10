import "styles/index.less";

import Vue from "vue";
// import {
//   Tabs,
//   TabPane,
//   Table,
//   TableColumn,
//   Tooltip,
//   Button
// } from "element-ui";

import router from "router/";
import store from "store/";
import app from "views/Layout/";

// Vue.component(Tabs.name, Tabs);
// Vue.component(TabPane.name, TabPane);
// Vue.component(Table.name, Table);
// Vue.component(TableColumn.name, TableColumn);
// Vue.component(Tooltip.name, Tooltip);
// Vue.component(Button.name, Button);

new Vue({
  el: "#app",
  render: h => h(app),
  router,
  store
});