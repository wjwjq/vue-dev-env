import Vue from 'vue';
// import ElementUI from 'element-ui';
import router from 'router/';
import store from 'store/';
import app from 'views/layout/';

// import 'element-ui/lib/theme-default/index.css';

// Vue.use(ElementUI);

new Vue({
  el: '#app',
  render: h => h(app),
  router,
  store
})