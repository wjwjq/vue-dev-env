import home from "views/home";
const tab1 = () => import("views/tab1");
const tab2 = () => import("views/tab2");

const routes = [
  {
    path: "/", 
    name: "home",
    component: home, 
    children: [
      {
        path: "/home1",
        name: "home1",
        component: home
      },
      {
        path: "/home2",
        name: "home2",
        component: home
      }
    ]
  },{
    path: "/tab1",
    name: "tab1",
    component: tab1
  },{
    path: "/tab2",
    name: "tab2",
    component: tab2
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

export default  generateMainRoutes(routes);