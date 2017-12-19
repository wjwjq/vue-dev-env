import Home from "views/Home";

//按需引入
const PageForbidden = () => import(/* webpackChunkName: "pageForbidden" */ "views/PageForbidden/");
const PageNotFound = () => import(/* webpackChunkName: "pageNotFound" */ "views/PageNotFound/");

const Tab1 = () => import(/* webpackChunkName: "tab1" */ "views/Tab1");
const Tab2 = () => import(/* webpackChunkName: "tab2" */ "views/Tab2");

const mainRoutes = [
  {
    path: "/", 
    name: "home",
    component: Home
  },{
    path: "/tab1",
    name: "tab1",
    component: Tab1
  },{
    path: "/tab2",
    name: "tab2",
    component: Tab2
  }
];

const subRoutes = [
  {
    path: "/403",
    component: PageForbidden
  },
  {
    path: "/404",
    component: PageNotFound
  },
  {
    path: "*",
    redirect: "/404"
  }
];

const generateMainRoutes = (routes, parentIndex) => {
  let index, childRoute;
  return routes.map((route, idx) => {
    index = parentIndex ? `${parentIndex}-${idx}` : `${idx}`;
    childRoute = route.children;
    if (childRoute && childRoute.length) {
      let children = generateMainRoutes(childRoute, index);
      return Object.assign(route, { index }, { children });
    } else {
      return Object.assign(route, { index });
    }
  });
};

export default generateMainRoutes(mainRoutes).concat(subRoutes);