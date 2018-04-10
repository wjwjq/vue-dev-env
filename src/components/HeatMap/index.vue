<template>
    <div class="map" >
        <map-title :title="{zh: cityName + name + '热力图'}"/>
        <div id="container" />
        <div 
            class="heatmap-panel" >
            <div class="panel-title">
                <div class="gear-box">
                    <div class="gear gear-1"/>
                    <div class="gear gear-2"/>
                    <div class="gear gear-3"/>
                </div>
                <h3>
                    {{ sourceName }}Top{{ topNum }}
                </h3>
            </div>
            <div class="panel-box">
                <div class="panel-box-scroll">
                    <ul>
                        <li 
                            v-for="(item, idx) in topData"
                            :key="item.id" 
                            :class="{'panel-item': true, active: activeItem === item.id}"
                            @click="handleItemClick(item)" >
                            <small class="order">{{ idx }}</small>
                            <span>{{ item.name }}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import MapTitle from "components/MapTitle";

import data from "./traffic_data.json";

const center = [106.937265, 27.706626];
const heatmapData = new Array(100).fill("").map((item, idx) => ({
  name: `点位${idx}`,
  lng:
    center[0] +
    (Math.random() > 0.5
      ? Math.random() * Math.random()
      : -Math.random() * Math.random()),
  lat:
    center[1] +
    (Math.random() > 0.5
      ? Math.random() * Math.random()
      : -Math.random() * Math.random()),
  count: Math.random() * 1000
}));

export default {
  name: "HeatMap",

  components: {
    "map-title": MapTitle
  },

  data() {
    return {
      city: "遵义市",
      cityName: "遵义市",
      name: "收费站",
      message: "页面2",
      sourceName: "高速来源",
      activeItem: "",
      topNum: 10,
      map: null,
      infoWindow: null,
      heatmapData: [],
      heatmap: null,
      topData: [],
      heatmapMarkers: [],
      popMarkers: []
    };
  },

  mounted() {
    // console.info( this.$router.currentRoute.params.id);
    this.dealData();
    this.$nextTick(() => {
      this.init();
    });
  },
  
  beforeDestroy() {
    this.map.destroy();
  },

  methods: {
    init() {
      if (!this.map) {
        this.map = new AMap.Map("container", {
          resizeEnable: true,
          center: [106.937265, 27.706626],
          mapStyle: "amap://styles/fbabe76c43f93ba1604cf85c361b0ede",
          zoom: 10
        });
      }

      this.renderHeatmap();
    },

    dealData() {
      this.topData = heatmapData.sort((a, b) => b.count - a.count).slice(0, 10);
      this.heatmapData = heatmapData;
    },

    renderHeatmap() {
      if (!isSupportCanvas()) {
        alert(
          "热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试~"
        );
      }
      this.map.plugin(["AMap.Heatmap"], () => {
        //初始化heatmap对象
        this.heatmap = new AMap.Heatmap(this.map, {
          radius: 20, //给定半径
          opacity: [0, 0.8]
          /*,gradient:{
             0.5: 'blue',
             0.65: 'rgb(117,211,248)',
             0.7: 'rgb(0, 255, 0)',
             0.9: '#ffea00',
             1.0: 'red'
             }*/
        });
        
        //设置数据集
        this.setHeatMapData();
        
      });

      function isSupportCanvas() {
        var elem = document.createElement("canvas");
        return !!(elem.getContext && elem.getContext("2d"));
      }
    },

    setHeatMapData() {
      this.heatmap.setDataSet({
        data: this.heatmapData
      });
      this.drawHeatMapRaplaceMaker();
      this.topData.map(item => this.radit(item));
    },

    drawHeatMapRaplaceMaker() {
      this.heatmapData.map(item => this.drawMarker(item));
    },

    drawMarker(item) {
      const heatmapMarker = new AMap.Marker({
        map: this.map,
        content: '<div class="heatmap-marker"></div>',
        position: new AMap.LngLat(item.lng, item.lat),
        offset: new AMap.Pixel(-11, -11)
      });

      heatmapMarker.on("mouseout", evt => this.markerMouseout(item, evt));
      heatmapMarker.on("mouseover", evt => this.markerMouseover(item, evt));

      const result = {
        ...item,
        target: heatmapMarker
      };

      this.heatmapMarkers.push(result);

      return result;
    },

    markerMouseout(item) {
      if (this.infoWindow) {
        this.infoWindow.close();
      }
    },

    hideAllPopMarkers() {
      this.popMarkers.map(item => item.target.hide());
    },

    markerMouseover(item) {
      if (!this.infoWindow) {
        this.infoWindow = new AMap.InfoWindow({ autoMove: true });
      }
      const content = `<div class="heatmap-marker-over">
                        <span>${item.name}</span>
                        :
                        <i>${item.count}</i>
                      </div>`;

      this.infoWindow.setContent(content);
      this.infoWindow.open(this.map, new AMap.LngLat(item.lng, item.lat));
    },

    handleItemClick(item) {
      this.hideAllPopMarkers();
      this.markerMouseover(item);
      const pos = new AMap.LngLat(item.lng, item.lat);
      //不在地图视野内
      if (!this.map.getBounds().contains(pos)) {
        //移动到中心
        this.map.setCenter(pos);
      }

      marker.show();
    },

    radit(item) {
      const content = `<div class="area-box active">
                        <span class="dot"></span>
                        <span class="pulse delay-01"></span>
                        <span class="pulse delay-02"></span>
                        <span class="pulse delay-03"></span>
                      </div>`;

      new AMap.Marker({
        map: this.map,
        content: content,
        position: new AMap.LngLat(item.lng, item.lat),
        offset: new AMap.Pixel(-11, -11)
      });

    },

    drawCircle(item) {
      var canvas = document.createElement("canvas");
      canvas.width = canvas.height = 240;
      var context = canvas.getContext("2d");

      context.globalAlpha = 1;
      context.lineWidth = 2;
      var radious = 0;
        
      var draw = function () {
        context.clearRect(0, 0, 240, 240);
        radious = (radious + 1) % 60;
        // context.globalAlpha = (context.globalAlpha - 0.01 + 1) % 1;
        
        context.fillStyle = "purple";
        context.strokeStyle = "purple";
        context.beginPath();
        context.arc(120, 120, 10, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
        context.alpha = 1;
        
        context.fillStyle = "transparent";
        context.strokeStyle = "purple";
        context.beginPath();
        context.arc(120, 120, radious, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
        context.alpha = (context.alpha - 0.01 + 1) % 1;
        
        context.beginPath();
        context.arc(120, 120, radious + 10, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
        context.alpha = (context.alpha - 0.01 + 1) % 1;

        context.beginPath();
        context.arc(120, 120, radious + 20, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
        context.alpha = (context.alpha - 0.01 + 1) % 1;

        CanvasLayer.reFresh(); //2D视图时可以省略
        AMap.Util.requestAnimFrame(draw);
      };

      var CanvasLayer = new AMap.CanvasLayer({
        canvas: canvas,
        bounds: new AMap.Bounds(
          [item.lng - 0.025, item.lat - 0.025],
          [item.lng + 0.025, item.lat + 0.025]
        ),
        zooms: [3, 18]
      });

      CanvasLayer.setMap(this.map);

      CanvasLayer.on("mouseover", e => console.info(e));
      draw();
    }
  }
};
</script>