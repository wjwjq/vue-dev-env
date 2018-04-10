<template>
    <div class="migrate-map">
        <map-title :title="{zh: '【外省】 沿海城市，或就近省会/直辖市'}" />

        <div id="migrate-map"/>

        <div 
            v-if="showBox && provinceData.length"
            class="privince-data-box" >
            <div class="data-box-title">{{ currentProvince }}各区县 top10</div>
            <div 
                v-for="(item,index) in provinceData"
                :key="index"
                class="data-item">
                <div class="data-item-content">
                    <i class="item-content-point"/>
                    <label>{{ index + 1 }}</label>
                </div>

                <div 
                    :title="item.name" 
                    class="data-item-content content-name">
                    <label>{{ item.name }}</label>
                </div>

                <div class="data-item-content">
                    <label>{{ item.value }}</label>
                </div>

            </div>  
            <div class="box-button-close" @click="closeBox">
                <img :src="closeIcon">
            </div> 
        </div>
    </div> 
</template>

<script>
import "./index.less";
import MoveLine from "./../../components/MigrationMap/MoveLine";
import provinceDatas from "./rankData.js";
import MapTitle from "components/MapTitle";
import closeIcon from "./../../assets/images/close-pop.png";

const colors = [
  "#21437a",
  "#dc3912",
  "#009cff",
  "#4decdb",
  "#990099",
  "#0099c6",
  "#dd4477",
  "#66aa00",
  "#b82e2e",
  "#316395",
  "#994499",
  "#22aa99",
  "#aaaa11",
  "#6633cc",
  "#e67300",
  "#8b0707",
  "#651067",
  "#329262",
  "#5574a6",
  "#3b3eac"
];

export default {
  name: "MigrateMapView",

  components: {
    "map-title": MapTitle
  },

  data() {
    return {
      map: null,
      /**行政区划插件的对象 */
      districtExplorer: null,
      /**当前聚焦的区域 */
      currentAreaNode: null,
      provinces: [],
      /**迁徙线路数据 */
      lineData: [],
      showBox: false,
      currentProvince: "",
      provinceDatas: {},
      provinceData: [],
      tipMarker: null,
      colors: colors,
      closeIcon: closeIcon
    };
  },

  mounted() {
    this.handleProvinceTopData();
    this.initMap();
  },

  methods: {
    handleProvinceTopData() {
      provinceDatas.forEach((item, index) => {
        item.rank = index + 1;

        this.provinceDatas[item.name] = item;

        if (index < 20) {
          this.provinces.push({
            name: item.name,
            value: index + 1
          });
        }
      });
    },

    initMap() {
      this.map = new AMap.Map(
        this.$el.querySelector("#migrate-map"),
        this.getMapOptions()
      );

      this.drawAdminDevisions();

      setTimeout(() => {
        this.drawLines();
      }, 1000);

      setTimeout(() => {}, 3000);
    },

    getMapOptions() {
      return {
        mapStyle: "amap://styles/fbabe76c43f93ba1604cf85c361b0ede",
        zoom: 5,
        zooms: [5, 13]
      };
    },

    /**
     * 画行政区划
     */
    drawAdminDevisions() {
      AMapUI.load(["ui/geo/DistrictExplorer"], DistrictExplorer => {
        //创建一个实例
        this.districtExplorer = new DistrictExplorer({
          eventSupport: true, //打开事件支持
          map: this.map
        });

        //当前聚焦的区域
        this.currentAreaNode = null;

        this.tipMarker = this.getTipMarker();

        this.bindAreaEvent();

        //全国
        this.switch2AreaNode(100000);
      });
    },

    drawLines() {
      new MoveLine(this.map, {
        //marker点半径
        markerRadius: 2,
        //marker点颜色,为空或null则默认取线条颜色
        markerColor: "#FB930D",
        //线条类型 solid、dashed、dotted
        lineType: "solid",
        //线条宽度
        lineWidth: 1,
        //线条颜色
        colors: colors,
        //移动点半径
        moveRadius: 2,
        //移动点颜色
        fillColor: "#F9930E",
        //移动点阴影颜色
        shadowColor: "#fff",
        //移动点阴影大小
        shadowBlur: 2,
        data: this.lineData
      });
    },

    getTipMarker() {
      return new AMap.Marker({
        content: "<div class='tip-marker tip-marker-top'></div>",
        offset: new AMap.Pixel(0, 0),
        bubble: true
      });
    },

    bindAreaEvent() {
      //监听feature的hover事件
      this.bindFeatureHoverEvent();

      //监听feature的鼠标滑动事件
      this.bindFeatureMouseMoveEvent();

      //监听feature的点击事件
      this.bindFeatureCilckEvent();
    },

    /**
     * 监听feature的hover事件
     */
    bindFeatureHoverEvent() {
      this.districtExplorer.on(
        "featureMouseout featureMouseover",
        (e, feature) => {
          this.toggleHoverFeature(
            feature,
            e.type === "featureMouseover",
            e.originalEvent ? e.originalEvent.lnglat : null
          );
        }
      );
    },

    /**
     * 监听feature的鼠标滑动事件
     */
    bindFeatureMouseMoveEvent() {
      this.districtExplorer.on("featureMousemove", e => {
        //更新提示位置
        this.tipMarker.setPosition(e.originalEvent.lnglat);
      });
    },

    /**
     * 监听feature的点击事件
     */
    bindFeatureCilckEvent() {
      this.districtExplorer.on("featureClick", (e, feature) => {
        this.clickProvince(feature.properties);
      });
    },

    /**
     * 根据Hover状态设置相关样式
     * @param {Object} feature
     * @param {Boolean} isHover
     * @param {Object} position
     */
    toggleHoverFeature(feature, isHover, position) {
      this.tipMarker.setMap(isHover ? this.map : null);

      if (!feature) return;

      let props = feature.properties;
      let topValue = feature.topValue ? " Top" + feature.topValue : "";

      if (isHover) {
        //更新提示内容
        this.tipMarker.setContent(
          `<div class='tip-marker tip-marker-top'>${
            props.name
          }${topValue}</div>`
        );

        //更新位置
        this.tipMarker.setPosition(position || props.center);
      }

      //更新相关多边形的样式
      let polys = this.districtExplorer.findFeaturePolygonsByAdcode(
        props.adcode
      );

      let opts = {
        fillOpacity: isHover ? 0.7 : 0.45,
        cursor: isHover ? "pointer" : "default"
      };

      if (feature.topValue <= 5) {
        opts.strokeColor = isHover ? "#01ffde" : "#00d8ff";
      }

      for (let i = 0, len = polys.length; i < len; i++) {
        polys[i].setOptions(opts);
      }
    },

    /**
     * 绘制区域边界
     * @param {Object} areaNode 区域对象
     */
    renderAreaPolygons(areaNode) {
      //更新地图视野
      this.map.setBounds(areaNode.getBounds(), null, null, true);

      //清除已有的绘制内容
      this.districtExplorer.clearFeaturePolygons();

      //绘制子区域
      this.districtExplorer.renderSubFeatures(areaNode, feature => {
        let fillColor = null,
          strokeColor = null;

        let name = feature.properties.name;
        let len = this.provinces.length;

        if (name === "陕西省") return;

        if (this.provinceDatas[name]) {
          feature.topValue = this.provinceDatas[name].rank;
        }

        for (let i = 0; i < len; i++) {
          if (this.provinces[i].name === name) {
            if (this.provinces[i].value > 5) {
              fillColor = "#21437a";
              strokeColor = this.colors[0];
            } else {
              fillColor = "#009cff";
              strokeColor = "#00d8ff";
            }
          }
        }

        return {
          cursor: "default",
          bubble: true,
          strokeColor: strokeColor, //线颜色
          strokeOpacity: 1, //线透明度
          strokeWeight: 1, //线宽
          fillColor: fillColor, //填充色
          fillOpacity: 0.45 //填充透明度
        };
      });

      //绘制父区域
      this.districtExplorer.renderParentFeature(areaNode, {
        cursor: "default",
        bubble: true,
        strokeColor: "black", //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 1, //线宽
        fillColor: null, //填充色
        fillOpacity: 0.45 //填充透明度
      });

      //西安
      this.loadMainCityNode(610100);

      this.map.setCenter([108.93977, 34.341574]);
    },

    /**
     * 切换区域后刷新显示内容
     * @param {Object} areaNode 区域节点的对象
     */
    refreshAreaNode(areaNode) {
      this.districtExplorer.setHoverFeature(null);

      this.renderAreaPolygons(areaNode);
    },

    /**
     * 切换区域
     * @param {Number, String} adcode 区域编码
     */
    switch2AreaNode(adcode) {
      if (
        this.currentAreaNode &&
        "" + this.currentAreaNode.getAdcode() === "" + adcode
      )
        return;

      this.loadAreaNode(adcode, (error, areaNode) => {
        if (error) {
          console.error(error);

          return;
        }

        if (areaNode.adcode === 100000) {
          this.formatProvincesData(areaNode._data.geoData.sub.features);
        }

        this.currentAreaNode = areaNode;

        //设置当前使用的定位用节点
        this.districtExplorer.setAreaNodesForLocating([this.currentAreaNode]);

        this.refreshAreaNode(areaNode);
      });
    },

    formatProvincesData(provinces) {
      let to = {
        city: "西安",
        lnglat: [108.939621, 34.343147]
      };

      let result = [];

      let provinceDatas = Object.keys(this.provinceDatas);
      let len = provinceDatas.length;

      for (let i = 0; i < len; i++) {
        if (i > 20) break;

        provinces.forEach(item => {
          if (
            provinceDatas[i] === item.properties.name &&
            item.properties.name !== "陕西省"
          ) {
            result.push({
              from: {
                city: item.properties.name,
                lnglat: item.properties.center
              },
              to: to
            });
          }
        });
      }

      this.lineData = result;
    },

    /**
     * 加载区域
     * @param {Number, String} adcode 区域编码
     * @param {Function} callback 加载完的回调
     */
    loadAreaNode(adcode, callback) {
      this.districtExplorer.loadAreaNode(adcode, (error, areaNode) => {
        if (error) {
          if (callback) {
            callback(error);
          }

          console.error(error);

          return;
        }

        if (callback) {
          callback(null, areaNode);
        }
      });
    },

    loadMainCityNode(adcode) {
      this.districtExplorer.loadAreaNode(adcode, (error, areaNode) => {
        if (error) {
          console.error(error);

          return;
        }

        this.districtExplorer.renderParentFeature(areaNode, {
          cursor: "default",
          bubble: true,
          strokeColor: "#01ffde", //线颜色
          strokeOpacity: 1, //线透明度
          strokeWeight: 1, //线宽
          fillColor: "#4decdb", //填充色
          fillOpacity: 0.45 //填充透明度
        });
      });
    },

    clickProvince(props) {
      if (props.name === "陕西省") return;

      let data = this.provinceDatas[props.name];

      if (data) {
        this.currentProvince = props.name;
        this.provinceData = [...data.datas].splice(0, 10);
        this.showBox = true;
      }
    },

    closeBox() {
      this.showBox = false;
      this.provinceData = [];
    }
  }
};
</script>
