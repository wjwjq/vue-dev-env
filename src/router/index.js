import routes from './config.js';
import VueRouter from 'vue-router';

const routerConfig = {
    mode: 'history',
    routes: routes,
    base: __dirname
};

const router = new VueRouter(routerConfig);

router.beforeEach((to, from, next) => {
    next();
});

export default router;