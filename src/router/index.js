import Vue from "vue";
import routes from "./configs.js";
import VueRouter from "vue-router";

const routerConfig = {
  mode: "history",
  routes: routes,
  base: __dirname
};

Vue.use(VueRouter);
const router = new VueRouter(routerConfig);

router.beforeEach((to, from, next) => {
  next();
});

export default router;