import home from "views/home";
const tab1 = () => import("views/tab1");
const tab2 = () => import("views/tab2");

export default [{
  index: "0",
  path: "/",
  name: "home",
  component: home
},{
  index: "0",
  path: "/tab1",
  name: "nav",
  component: tab1
},{
  index: "0",
  path: "/tab2",
  name: "nav",
  component: tab2
}];