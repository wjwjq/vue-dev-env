<template>
    <div class="main-page">
        <map-title :title="{zh: `西安人群大数据`, en: `Large data of Xi'an population`}" />

        <div class="population-info">
            <div class="population-info-item">
                <label>大数据识别人口 : </label>
                <label class="info-content">114.39</label>
                <label>万人</label>
            </div>
            <div class="population-info-item">
                <label>西安市常住城镇人口 : </label>
                <label class="info-content">136.65</label>
                <label>万人</label>
            </div>
        </div>

        <content-block 
            top="310px"
            left="47px"
            z-index="10">
            <div class="population-info-ex">
                <img :src="headSrc">
                <label class="population-info-ex-label">主力销售项目人群识别 : 2.15万人</label>
            </div>
        </content-block>

        <div class="main-sale-project">
            <div class="title">主力销售项目</div>
            <div class="project-content">
                <div 
                    v-for="(item,index) in project"
                    :key="index"
                    class="project-item">
                    <div class="project-item-point"/>
                    <div class="project-item-label">{{ item.name }}</div>
                </div>
            </div>
        </div>

        <div class="main-info">
            <div class="gear-box">
                <div class="gear gear-1"/>
                <div class="gear gear-2"/>
                <div class="gear gear-3"/>
            </div>
            <div class="box-icon"/>
            <div class="main-info-title">客户画像交互系统</div>
            <div class="main-info-item">
                <i class="main-info-item-point"/>
                <label class="main-info-item-text">解构数据，辅助决策，站位客户角度，洞察客户需求</label>
            </div>

            <div class="main-info-item">
                <i class="main-info-item-point"/>
                <label class="main-info-item-text">全客层分析，增量研判，构建竞争体系，赋能定位智慧</label>
            </div>
            
            <div class="main-info-item">
                <i class="main-info-item-point"/>
                <label class="main-info-item-text">本地挖掘，异地拓客，优化渠道，迭代智能营销</label>
            </div>
        </div>

        <div id="main-page-map"/>
    </div>
</template>

<script>
import "./index.less";
import MapTitle from "components/MapTitle";
import contentBlock from "components/ContentBlock";
import headSrc from "./../../assets/images/head-recognition.png";

export default {
  components: {
    "map-title": MapTitle,
    "content-block": contentBlock
  },

  data() {
    return {
      map: null,
      /**行政区划插件的对象 */
      districtExplorer: null,
      /**当前聚焦的区域 */
      currentAreaNode: null,
      provinceData: [],
      tipMarker: null,
      colors: [
        "#3366cc",
        "#dc3912",
        "#ff9900",
        "#109618",
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
      ],
      project: [
        { name: "远达 · 龙湖领域" },
        { name: "中港 · 燊海森林" },
        { name: "紫荆城邦" },
        { name: "瑞和 · 盛景" },
        { name: "正黄 · 翡翠公园" },
        { name: "晶泽 · W公馆" },
        { name: "恒大名都" }
      ],
      headSrc: headSrc
    };
  },

  mounted() {
    this.initMap();
  },

  methods: {
    initMap() {
      this.map = new AMap.Map(
        this.$el.querySelector("#main-page-map"),
        this.getMapOptions()
      );

      this.drawAdminDevisions();
    },

    getMapOptions() {
      return {
        zoom: 8,
        zooms: [8, 13],
        mapStyle: "amap://styles/fa9626f285c5f24f97233f059191ac70",
        // features: ["bg","point", "building"],
        center: [108.93977, 34.341574]
      };
    },

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
        this.switch2AreaNode(610100);
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

      if (isHover) {
        //更新提示内容
        this.tipMarker.setContent(
          `<div class='tip-marker tip-marker-top'>${props.name}</div>`
        );
        //更新位置
        this.tipMarker.setPosition(position || props.center);
      }

      //更新相关多边形的样式
      let polys = this.districtExplorer.findFeaturePolygonsByAdcode(
        props.adcode
      );

      for (let i = 0, len = polys.length; i < len; i++) {
        polys[i].setOptions({
          fillOpacity: isHover ? 0.65 : 0.45
        });
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
      this.districtExplorer.renderSubFeatures(areaNode, () => {
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

      //绘制父区域
      this.districtExplorer.renderParentFeature(areaNode, {
        cursor: "default",
        bubble: true,
        strokeColor: "#00ffe4", //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 1, //线宽
        fillColor: null, //填充色
        fillOpacity: 0.45 //填充透明度
      });
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
     * @param {Function} callback 加载完的回调
     */
    switch2AreaNode(adcode, callback) {
      if (
        this.currentAreaNode &&
        "" + this.currentAreaNode.getAdcode() === "" + adcode
      )
        return;

      this.loadAreaNode(adcode, (error, areaNode) => {
        if (error) {
          if (callback) {
            callback(error);
          }

          return;
        }

        this.currentAreaNode = areaNode;

        //设置当前使用的定位用节点
        this.districtExplorer.setAreaNodesForLocating([this.currentAreaNode]);

        this.refreshAreaNode(areaNode);

        if (callback) {
          callback(null, areaNode);
        }
      });
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
    }
  }
};
</script>