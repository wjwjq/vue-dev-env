<template>
    <div class="map" >
        <map-title :title="{zh: title.main}"/>
        <a 
            v-show="level" 
            class="back-top"
            href="javascript: void(0)" 
            @click="handleBackTopLevel">
            <span 
                v-for="font in backButton.text.split('')" 
                :key="font">
                {{ font }}
            </span>
        </a>
        <div id="container" />
        <div 
            v-show="!level"
            :class="{'heatmap-panel': true, fold: !isOpen, open: isOpen}" >
            <div 
                class="panel-fold" 
                @click="handleFold"/>
            <div class="panel-title">
                <div class="gear-box">
                    <div class="gear gear-1"/>
                    <div class="gear gear-2"/>
                    <div class="gear gear-3"/>
                </div>
                <h3>
                    {{ level ? title.subList : title.list ? title.list : city.name + '各区县分布' }}
                </h3>
            </div>
            <div class="panel-box">
                <div class="panel-box-scroll">
                    <ul>
                        <li 
                            v-for="(item, idx) in zoneList"
                            :key="item.id"
                            :class="{'panel-item': true, active: activeItem === item.id}"
                            @click="handleItemClick(item)" 
                            @mouseover="handleItemMouseOver(item)"
                            @mouseout="handleItemMouseOut(item)" 
                        >
                            <small class="order">{{ idx + 1 }}</small>
                            <span>{{ item.name }}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import MapTitle from "../MapTitle";
import "./index.less";

export default {
  name: "DistrictHeatMap",

  components: {
    MapTitle
  },

  props: {
    //热力图数据和指定区域数据
    data: {
      default: () => [],
      type: Array,
      required: true
    },

    //城市信息
    city: {
      default: () => ({
        name: "",
        adcode: "",
        center: []
      }),
      type: Object,
      required: true
    },

    //返回按钮
    backButton: {
      default: () => ({
        text: "返回"
      }),
      type: Object
    },

    title: {
      default: () => ({
        main: "",
        list: "",
        subList: ""
      }),
      type: Object
    }
  },

  data() {
    return {
      activeItem: "",
      limit: 10,
      results: [],

      map: null,
      districtExplorer: null,
      tipMarker: null,
      infoWindow: null,
      heatmap: null,

      heatmapMarkers: [],
      popMarkers: [],
      specifyZonePloygons: [],
      zoneList: [],

      areaNode: [],

      isOpen: true,
      level: null
    };
  },

  mounted() {
    this.dealData(this.data);
    this.$nextTick(() => {
      this.init();
    });
  },

  beforeDestroy() {
    this.map.destroy();
  },

  methods: {
    init() {
      this.level = null;

      if (!this.map) {
        this.map = new AMap.Map("container", {
          resizeEnable: true,
          center: this.city.center,
          mapStyle: "amap://styles/fbabe76c43f93ba1604cf85c361b0ede",
          zoom: 9
        });

        //创建一个辅助Marker，提示鼠标内容
        this.tipMarker = new AMap.Marker({
          //启用冒泡，否则click事件会被marker自己拦截
          content: "<div></div>",
          bubble: true
        });
      }
      this.renderHeatmap();
      this.renderDistrict();
    },

    dealData(data) {
      this.data = data;
      const heatmap = this.data.reduce(
        (acc, item) => acc.concat(item.poi),
        []
      );
      this.topData = heatmap.sort((a, b) => b.count - a.count).slice(0, 10);
      this.results = heatmap;
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
          opacity: [0, 0.8],
          zIndex: 111
          /*,gradient:{
             0.5: 'blue',
             0.65: 'rgb(117,211,248)',
             0.7: 'rgb(0, 255, 0)',
             0.9: '#ffea00',
             1.0: 'red'
             }*/
        });

        this.setHeatmapDataSet();
      });

      function isSupportCanvas() {
        var elem = document.createElement("canvas");
        return !!(elem.getContext && elem.getContext("2d"));
      }
    },

    setHeatmapDataSet() {
      this.heatmap.setOptions({
        radius: 15 //!this.level ? 50 : 20 //给定半径
      });

      //设置数据集
      this.heatmap.setDataSet({
        data: this.results
      });

      console.info(1);

      // this.results.map(item => this.drawMarker(item));
    },

    drawMarker(item) {
      const content = `<div class="heatmap-marker">
            <div class="heatmap-marker-inner"> 
            </div>
          </div>`;
      // ${!this.level ? `<span>${item.name}</span><i>${parseInt(item.count)}</i>` : ``}

      const heatmapMarker = new AMap.Marker({
        content,
        map: this.map,
        position: new AMap.LngLat(item.lng, item.lat),
        offset: new AMap.Pixel(-7, -7),
        bubble: true
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
                        <span>${item.name}</span>:<i>${parseInt(item.count)}</i>
                      </div>`;

      this.infoWindow.setContent(content);
      this.infoWindow.open(this.map, new AMap.LngLat(item.lng, item.lat));
    },

    renderDistrict() {
      //加载DistrictExplorer，loadUI的路径参数为模块名中 'ui/' 之后的部分
      AMapUI.loadUI(["geo/DistrictExplorer"], DistrictExplorer => {
        //启动页面
        this.districtExplorer = new DistrictExplorer({
          map: this.map, //关联的地图实例
          eventSupport: true,
          subdistrict: 3
        });

        this.loadAreaNode(this.city.adcode);
      });
    },

    loadAreaNode(adcode) {
      this.districtExplorer.loadAreaNode(adcode, (error, areaNode) => {
        if (error) {
          console.error(error);
          return;
        }

        //获取当前区域的 子区域
        const zoneList = areaNode.getSubFeatures().map(item => item.properties);
        this.zoneList = zoneList;
        this.areaNode = areaNode;

        //绘制载入的区划节点
        this.renderAreaNode(areaNode);
      });
    },

    renderAreaNode(areaNode) {
      //清除已有的绘制内容
      this.districtExplorer.clearFeaturePolygons();

      //绘制子级区划
      this.districtExplorer.renderSubFeatures(areaNode, feature => {
        return {
          cursor: "default",
          bubble: true,
          strokeColor: "#00ffe4", //线颜色
          strokeOpacity: 1, //线透明度
          strokeWeight: 1, //线宽
          fillColor: "#3366cc", //填充色
          fillOpacity: 0.35 //填充透明度
        };
      });

      //绘制父级区划，仅用黑色描边
      // this.districtExplorer.renderParentFeature(areaNode, {
      //   cursor: "default",
      //   bubble: true,
      //   strokeColor: "black", //线颜色
      //   fillColor: null,
      //   strokeWeight: 3 //线宽
      // });

      //监听feature的hover事件
      this.districtExplorer.on("featureMouseout featureMouseover", (e, feature) => {
        
        const props = feature.properties;
        var isHover = e.type === "featureMouseover";
        //更新相关多边形的样式
        var polys = this.districtExplorer.findFeaturePolygonsByAdcode(
          props.adcode
        );
        if (!this.level) {
          for (var i = 0, len = polys.length; i < len; i++) {
            polys[i].setOptions({
              fillColor: isHover ? "#19aaab" : "#3366cc",
              fillOpacity: isHover ? 0.58 : 0.35
            });
          }
        }

        if (!isHover || this.level) {
          this.tipMarker.setMap(null);
          return;
        }

        this.tipMarker.setPosition((e && e.originalEvent && e.originalEvent.lnglat) || new AMap.LngLat(props.center[0], props.center[1]));

        this.tipMarker.setLabel({
          offset: new AMap.Pixel(20, 20),
          content: props.name
        });

        this.tipMarker.setMap(this.map);
      }
      );

      //监听鼠标在feature上滑动
      this.districtExplorer.on("featureMousemove", e => {
        //更新提示位置
        this.tipMarker.setPosition(e.originalEvent.lnglat);
      });

      //feature被点击
      this.districtExplorer.on("featureClick", (e, feature) => {
        const { properties: props } = feature;

        //如果存在子节点
        if (props.childrenNum > 0) {
          //切换聚焦区域
          loadAreaNode(props.adcode);
        } else {
        }
      });

      //外部区域被点击
      this.districtExplorer.on("outsideClick", function (e) {
        console.info("区域外点击", e);
      });

      //更新地图视野以适合区划面
      this.map.setFitView(this.districtExplorer.getAllFeaturePolygons());
    },

    featureClick(item) {
      const { id, center, adcode } = item;

      const od = this.data.find(item => item.adcode.toString() === adcode.toString());
      const { block, poi } = od;

      if (poi.length) {
        this.results = poi;
      }

      this.districtExplorer.getAllFeaturePolygons().map(poly =>
        poly.setOptions({
          strokeColor: "transparent", //线颜色
          fillColor: "transparent"
        })
      );

      const polys = this.districtExplorer.findFeaturePolygonsByAdcode(adcode);

      polys.map(item =>
        item.setOptions({
          strokeColor: "#00ffe4", //线颜色
          fillColor: "#3366cc"
        })
      );

      this.heatmapMarkers.map(marker => marker.target.setMap(null));
      this.heatmapMarkers = [];

      this.level = "second";

      this.setHeatmapDataSet();

      // this.districtExplorer.clearFeaturePolygons();

      this.renderSpecifyZone(block);

      //更新地图视野以适合区划面
      this.map.setFitView(polys);
      this.map.setCenter(polys[0].getBounds().getCenter());
      this.map.setZoom(11);
    },

    renderSpecifyZone(specifyZone) {
      this.specifyZonePloygons = specifyZone.map(item =>  new AMap.Polygon({
        map: this.map,
        strokeOpacity: 1, //线透明度
        strokeWeight: 1, //线宽
        strokeStyle: "solid", //线样式
        strokeColor: "#000",
        fillColor: "#eb503a",
        fillOpacity: .8,
        strokeDasharray: [10, 5], //补充线样式
        path: item.datas.map(path => new AMap.LngLat(path.lng, path.lat))
      }));
    },

    handleBackTopLevel() {
      this.heatmapMarkers.map(item => item.target.setMap(null));
      this.heatmapMarkers = [];
      this.specifyZonePloygons.map(item => item.setMap(null));
      this.popMarkers = [];
      this.level = null;

      this.map.setCenter(new AMap.LngLat(this.city.center[0], this.city.center[1]) );
      this.map.setZoom(9);

      this.districtExplorer.getAllFeaturePolygons().map(poly =>
        poly.setOptions({
          strokeColor: "#00ffe4", //线颜色
          fillColor: "#3366cc"
        })
      );

      this.dealData(this.data);
      this.setHeatmapDataSet();
    },

    handleItemClick(item) {
      if (this.level) {
        this.hideAllPopMarkers();
        this.markerMouseover(item);
        const pos = new AMap.LngLat(item.lng, item.lat);
        //不在地图视野内
        if (!this.map.getBounds().contains(pos)) {
          //移动到中心
          this.map.setCenter(pos);
        }
      } else {
        this.featureClick(item);
      }
    },

    handleItemMouseOver(item) {
      const { adcode } = item;
    

      this.districtExplorer.setHoverFeature( this.areaNode.getSubFeatureByAdcode(adcode));
    },

    handleItemMouseOut() {
      this.districtExplorer.setHoverFeature(null);
    },

    handleFold() {
      this.isOpen = !this.isOpen;
    }
  }
};
</script>
