<template>
    <div class="header">
        <router-link 
            to="/" 
            class="header-title">
            <strong>
                <img 
                    :src="info.logo.src"
                    :alt="info.logo.alt" >
            </strong>
            <span>{{ info.name }}</span>
        </router-link>

        <div class="nav">
            <ul class="main-nav">
                <li 
                    v-for="mainItem in configs"
                    :key="mainItem.index"
                    :class="{'main-nav-item': true, active: activeIndex === mainItem.index}"
                    @click.stop="handleClick(mainItem)"
                >
                    <div class="text">
                        {{ mainItem.title }}
                    </div>
                    <ul 
                        v-if="mainItem.children && mainItem.children.length"
                        class="sub-nav" >
                        <li
                            v-for="item in mainItem.children"
                            :key="item.index"
                            :class="{'sub-nav-item': true, active: activeSubIndex === item.index, disabled: !item.path}" 
                            @click.stop="handleClick(item)"
                        >
                            <div class="text">{{ item.title }}</div>
                            <ul class="third-nav">
                                <li 
                                    v-for="item in item.children"
                                    :key="item.index"
                                    class="third-nav-items">
                                    {{ item.title }}
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import "./index.less";
import logoSrc from "images/logo.png";

const configs = [
  {
    title: "首页",
    path: "/",
    param: "",
    children: []
  },
  {
    title: "现状客户",
    path: "",
    param: "",
    children: [
      {
        title: "客户结构与面积需求",
        path: "/consumptionLevel",
        param: ""
      },
      {
        title: "客户类型需求",
        path: "/familyStructure",
        param: ""
      },
      {
        title: "客户来源",
        path: "/income-statistics",
        param: ""
      },
      {
        title: "返乡客来源",
        path: "/migrate-map",
        param: ""
      },
      {
        title: "职业特征",
        path: "/districtHeatmap",
        param: ""
      },
      {
        title: "潜客偏好特征",
        path: "/tgi",
        param: ""
      }
      // {
      //   title: "ChartTgi",
      //   path: "/ChartTgi",
      //   param: ""
      // },
      // {
      //   title: "产业能级",
      //   path: "",
      //   param: ""
      // },
      // {
      //   title: "总结",
      //   path: "",
      //   param: ""
      // }
    ]
  },
  {
    title: "增量机会",
    path: "",
    param: "",
    children: [
      {
        title: "潜客容量",
        path: "",
        param: ""
      },
      {
        title: "潜客面积需求",
        path: "",
        param: ""
      },
      {
        title: "潜客套型需求",
        path: "",
        param: ""
      },
      {
        title: "潜客居住认知",
        path: "",
        param: ""
      },
      {
        title: "潜客成长性",
        path: "",
        param: ""
      },
      {
        title: "客户竞争力模型",
        path: "",
        param: ""
      }
    ]
  }
];

const generateOrder = (routes, parentIndex = "") => {
  let index, childRoute;
  return routes.map((route, idx) => {
    index = parentIndex ? `${parentIndex}-${idx}` : `${idx}`;
    childRoute = route.children;
    if (childRoute && childRoute.length) {
      let children = generateOrder(childRoute, index);
      return Object.assign(route, { index, parentIndex: index }, { children });
    } else {
      return Object.assign(route, { index, parentIndex });
    }
  });
};

export const queryRouteRecurse = (routes, key, compareValue, parentIndex) => {
  for (let i = 0; i < routes.length; i++) {
    let route = routes[i];
    let idx = parentIndex ? `${parentIndex}-${i}` : `${i}`;

    if (route[key] && route[key] === compareValue) {
      route.index = idx;
      return route;
    } else {
      let children = route["children"];

      if (children && Array.isArray(children) && children.length) {
        let childRoute = queryRouteRecurse(children, key, compareValue, idx);

        if (childRoute) {
          return childRoute;
        }
      }
    }
  }
};

export const calculateCurrActiveRouteIndex = (routes, path) => {
  let route = queryRouteRecurse(routes, "path", path);

  return route ? route["index"] : "";
};


const navConfigs = generateOrder(configs);

export default {
  name: "Nav",

  data() {
    return {
      configs: [],

      info: {
        logo: {
          src: logoSrc,
          alt: "logo"
        },
        name: "客户画像交互系统1.0"
      },

      activedSubItems: [],
      activeIndex: "",
      activeSubIndex: ""
    };
  },

  watch: {
    $route(to, from) {
      if (to.path !== from.path) {
        this.setActive(to.path);
      }
    }
  },

  mounted() {
    this.configs = navConfigs;
    this.setActive(this.$route.path);
  },

  methods: {
    setActive(path) {
      const item = queryRouteRecurse(navConfigs, "path", path);
      if (item) {

        const { parentIndex, index } = item;

        if (parentIndex) {
          this.activeIndex = parentIndex;
          this.activeSubIndex = index;
        } else {
          this.activeIndex = index;
          this.activeSubIndex = "";
        }

      }
    },

    handleClick(item) {
      const { path, param, children } = item;

      if (children && children.length) {
        let firstPath = children.find(item => item.path);
        let p =  `${firstPath.path}${firstPath.param ? "/" + firstPath.param : ""}`;
        this.$router.push({ path: p });
        return;
      }
    
      if (path) {
        this.$router.push({ path: `${path}${param ? "/" + param : ""}` });
      }
    }
  }
};
</script>
