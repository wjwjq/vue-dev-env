// import Home from "views/Home";

const Main = () => import(/* webpackChunkName: "Main" */ "views/Main");

//按需引入
const PageForbidden = () => import(/* webpackChunkName: "PageForbidden" */ "views/PageForbidden/");
const PageNotFound = () => import(/* webpackChunkName: "PageNotFound" */ "views/PageNotFound/");

const RoadMap = () => import(/* webpackChunkName: "RoadMap" */ "views/RoadMap");
const HeatMap = () => import(/* webpackChunkName: "HeatMap" */ "views/HeatMap");
const MigrationMap = () => import(/* webpackChunkName: "MigrationMap" */ "views/MigrationMap");

/**迁徙图 - 刘宇来 */
const MigrateMap = () => import(/* webpackChunkName: "MigrateMap" */ "views/MigrateMap");
const DistrictHeatMap = () => import(/* webpackChunkName: "DistrictHeatMap" */ "views/DistrictHeatMap");

/**漏斗图表分组联动*/
const FunnelChart = () => import(/* webpackChunkName: "FunnelChart" */ "views/ChartGrouping/FunnelChart");
/**TGI 表*/
const ChartTgi = () => import(/* webpackChunkName: "ChartTgi" */ "views/ChartGrouping/ChartTgi");
const TGI = () => import(/* webpackChunkName: "TGI" */ "views/ChartGrouping/TGI");

/**图表-消费能力水平*/
const ConsumptionLevel = () => import(/* webpackChunkName: "ConsumptionLevel" */ "views/ConsumptionLevel");
/**图表-家庭结构*/
const FamilyStructure = () => import(/* webpackChunkName: "ConsumptionLevel" */ "views/FamilyStructure");

/**版块管理 */
const AreaManage = () => import(/* webpackChunkName: "AreaManage" */ "views/AreaManage");

const IncomeStatistics = () => import(/* webpackChunkName: "IncomeStatistics" */ "views/IncomeStatistics");

const Login = () => import(/* webpackChunkName: "AreaManage" */ "views/Login");

const mainRoutes = [
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/",
    name: "home",
    component: Main
  },
  {
    path: "/main",
    name: "main",
    component: Main
  },
  {
    path: "/roadmap",
    name: "roadmap",
    component: RoadMap
  },
  {
    path: "/heatmap",
    name: "heatmap",
    component: HeatMap
  },
  {
    path: "/districtHeatmap",
    name: "districtHeatmap",
    component: DistrictHeatMap
  },
  {
    path: "/roadmap/:id",
    name: "roadmapid",
    component: RoadMap
  },
  {
    path: "/heatmap/:id",
    name: "heatmapid",
    component: HeatMap
  },
  {
    path: "/districtHeatmap/:id",
    name: "districtHeatmapid",
    component: DistrictHeatMap
  },

  {
    path: "/migrationMap",
    name: "migrationMap",
    component: MigrationMap
  },

  /**迁徙图 - 刘宇来 */
  {
    path: "/migrate-map",
    name: "migrate-map",
    component: MigrateMap
  },

  /**图表分组联动  */
  {
    path: "/funnelChart",
    name: "funnelChart",
    component: FunnelChart
  },
  /**图表-tgi值  */
  {
    path: "/chartTgi",
    name: "chartTgi",
    component: ChartTgi
  },
  /**图表-tgi值  */
  {
    path: "/tgi",
    name: "tgi",
    component: TGI
  },
  /**图表-消费能力水平  */
  {
    path: "/consumptionLevel",
    name: "consumptionLevel",
    component: ConsumptionLevel
  },
  /**图表-消费能力水平  */
  {
    path: "/familyStructure",
    name: "familyStructure",
    component: FamilyStructure
  },
  {
    path: "/income-statistics",
    name: "income-statistics",
    component: IncomeStatistics
  },

  /**版块管理 */
  {
    path: "/areaManage",//"/YXJlYS1tYW5hZ2U=",
    name: "areaManage",
    component: AreaManage
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