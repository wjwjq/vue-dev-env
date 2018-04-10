<template>
    <div class="map" >
        <h2 class="road-map-title">
            <strong>{{ title.ch }}</strong> <small>{{ title.en }}</small> 
        </h2>
        <div id="container" />
        <div class="road-panel" >
            <h3>{{ title.ch }}Top{{ limit }}</h3>
            <ul>
                <li 
                    v-for="item in data"
                    :key="item.name" 
                    :class="{'panel-item': true, active: activeItem === item.name}"
                    @click="handleItemClick(item)" >
                    <span>{{ item.name }}</span>
                    <i>{{ item.pre }}</i>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import "./index.less";

export default {
  name: "RoadMap",

  props: {

    //视图标题
    title: {
      default: () => ({
        ch: "高速来源占比",
        en: "High speed source ratio"
      }),
      type: Object
    },

    //top数
    limit: {
      default: 10,
      type: Number
    },

    //数据
    data: {
      default: () => [],
      type: Array  
    }
  },

  data() {
    return {
      map: null,
      infoWindow: null,
      driving: null,
      activeItem: "",
      activeColor:  "#de3de0",
      colors: [
        "#2c7ebd",
        "#a3d07a",
        "#de3de0",
        "#63d3b7",
        "#2ca3bd",
        "#215cbe",
        "#6246ee",
        "#a859ec",
        "#ffa84b",
        "#e42424",
        "#ff6b33",
        "#ffd971",
        "#10d4ec"
      ],

      stokeStyle: {
        strokeOpacity: 1, //线透明度
        strokeWeight: 10, //线宽
        strokeStyle: "solid", //线样式
        strokeColor: "transparent",
        fillColor: "transparent",
        strokeDasharray: [10, 5] //补充线样式
      },

      roadPolygons:[],

      prevActivedRoad: null
    };
  },

  mounted() {
    this.init();
  },
  
  beforeDestroy() {
    this.map.destroy();
  },

  methods: {
    handleItemClick(item) {
      const { name } = item;

      const activedRoad = this.roadPolygons.filter(polygon => polygon.name === name);

      if (this.prevActivedRoad) {
        this.prevActivedRoad.map(item => {
          item.polygon.setOptions({
            strokeColor: item.originColor
          });
        });
      }

      activedRoad.map(item => {
        item.polygon.setOptions({
          strokeColor: this.activeColor
        });

        // if (!this.infoWindow) {
        //   this.infoWindow = new AMap.InfoWindow({ autoMove: true });
        // }
        // const content = `<div class="heatmap-marker-over">
        //                 <span>${name}</span>
        //               </div>`;

        // this.infoWindow.setContent(content);
        // this.infoWindow.open(this.map, item.polygon.getBounds().getCenter());
      });

      this.prevActivedRoad = activedRoad;

      this.activeItem = name;
    },
    init() {
      //基本地图加载
      this.map = new AMap.Map("container", {
        resizeEnable: true,
        center: [106.937265, 27.706626],
        mapStyle: "amap://styles/fbabe76c43f93ba1604cf85c361b0ede",
        zoom: 11 //地图显示的缩放级别
      });

      this.data.map((item, idx) => this.roadPolygons.push(this.drawRoad(item, idx)));
    },

    drawRoad(item) {
      const { id, name, paths } = item;

      const polygon = new AMap.Polyline({
        ...this.stokeStyle,
        id,
        map: this.map,
        path: paths.map(item => new AMap.LngLat(item.lng, item.lat)) //设置线覆盖物路径
      });
      
      polygon.on("click", this.clickPolygon);
      
      return {
        id,
        name,
        polygon,
        originColor: "transparent"
      };
    },

    clickPolygon(params) {
      console.info(params);
      
    }
  }
};
</script>
