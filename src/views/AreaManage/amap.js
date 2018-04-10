import lib from "./lib.js";

function MyAMap(opts) {
  this.setting = {
    container: "",
    resizeEnable: true,
    zoom: 5,
    mapEvent: {},
    mapStyle: "",
    alert: this.showAlert,
    searchSetting: {
      pageSize: 100,
      pageIndex: 1,
      city: "成都",
      citylimit: true,
      extensions: "all",
      type: "",
      autoFitView: false,
      showCover: false
    },
    polygon: {
      /**禁用polygon的事件 */
      disable: false,
      /**禁用鼠标点击polygon的事件 */
      disableClick: false,
      /**禁用鼠标滑过polygon的事件 */
      disableHover: false,
      /**是否允许编辑 */
      editable: false,
      /**点击后的颜色 */
      clickedColor: "#528984",
      /**点击过后的透明度 */
      clickedOpacity: 0.7,
      /**鼠标经过的颜色 */
      hoverColor: "#5ea0cf",
      /**鼠标经过版块的透明度 */
      hoverOpacity: 0.7,
      /**默认颜色 */
      fillColor: "#84ccc9",
      /**默认透明度 */
      fillOpacity: 0.5,
      /**边界颜色 */
      strokeColor: "#f7f5e7",
      /**边界透明度 */
      strokeOpacity: 0.5,
      /**边界线宽度 */
      strokeWeight: 3,
      /**是否支持多选 */
      multipleSelect: false,
      /**标题的位置 (middle|top) */
      titlePosition: "middle",
      /**名字的颜色 */
      nameColor: "#333",
      /**多边形的点击的回调 */
      clickFun: null,
      /**编辑模式下， 多边形坐标发生变化的回调 */
      editChange: null,
      /**退出编辑的回调方法 */
      cancelEdit: null,
      /**是否默认展示标题 */
      showTitle: true,
      /**多选时允许的最大多选数量 */
      maxSelect: 0
    },
    circle: {
      /**点击后的颜色 */
      clickedColor: "#639cc3",
      /**鼠标经过的颜色 */
      hoverColor: "#639cc3",
      /**默认颜色 */
      fillColor: "#84ccc9",
      /**默认透明度 */
      fillOpacity: 0.35,
      /**边界颜色 */
      strokeColor: "#fff",
      /**边界透明度 */
      strokeOpacity: 0.2,
      /**边界线宽度 */
      strokeWeight: 3
    },
    line: {},
    marker: {
      showTitle: false
    },
    heatmap: {
      opacity: [0, 0.8],
      radius: 25,
      max: 100
    },
    massmarks: {
      opacity: 0.8,
      zIndex: 200,
      cursor: "pointer",
      style: {
        url: "http://a.amap.com/jsapi_demos/static/images/mass1.png",
        anchor: new AMap.Pixel(4, 4),
        size: new AMap.Size(7, 7)
      }
    },
    legend: {},
    initHeatmap: false,
    searchResultContainer: "",
    features: ["bg", "point", "building", "road"],
    onReady: function () { console.log("地图加载完毕！"); }
  };

  this.legendBox = null;
  this.prevPolygon = null;
  this.prevMarker = null;
  this.markers = [];
  this.circles = [];
  this.polygons = [];
  this.heatmap = null;
  this.massmarks = null;
  this.lines = [];
  this.infoWindow = {};
  this.elem = {};
  this.placeSearch = null;
  this.mouseTool = null;
  this.chosedPolygon = [];
  this.editor = {
    polygon: {},
    circle: {},
    marker: {},
    line: {}
  };

  this.setting = lib.extend(this.setting, opts || {}, true);
}

Object.defineProperties(MyAMap.prototype, {
  init: {
    value() {
      if (!this.setting.container || !document.querySelector("#" + this.setting.container)) {
        console.error("请设置正确的地图容器！");

        return;
      }

      var mapOption = {
        resizeEnable: this.setting.resizeEnable,
        zoom: this.setting.zoom,
        center: this.setting.center,
        features: this.setting.features
      };

      if (this.setting.mapStyle) {
        mapOption.mapStyle = this.setting.mapStyle;
      }

      if (this.setting.center) {
        mapOption.center = this.setting.center;
      }

      this.map = new AMap.Map(this.setting.container, mapOption);

      /**绑定地图加载完毕的事件 */
      this.bindOnMapLoaded();

      /**初始化地图工具 */
      this.initTool();

      /**初始化鼠标工具 */
      this.initMouseTool();

      /**初始化搜索 */
      this.initSearch();

      /**地图级别发生变化时 */
      this.onMapZoomChange();

      /**初始化热力图 */
      this.initHeatmap();

      /**初始化地图的事件 */
      this.initMapEvent();

      return this.map;
    }
  },
  initMapEvent: {
    value() {
      this.map.on("dragging", () => {
        this.clearInfoWindow();
      });
      // if (!lib.isNullOrEmpty(this.setting.mapEvent)) {
      //   Object.keys(this.setting.mapEvent).forEach(evt => {
      //     this.map.on(evt, (e) => {
      //       this.setting.mapEvent[evt](e);
      //     })
      //   });
      // }
    }
  },
  initTool: {
    value() {
      this.map.plugin(["AMap.ToolBar"], () => {
        this.map.addControl(new AMap.ToolBar());
      });
    }
  },
  initMouseTool: {
    value() {
      this.mouseTool = new AMap.MouseTool(this.map);

      this.onDrawed();
    }
  },
  initSearch: {
    value() {
      AMap.service(["AMap.PlaceSearch"], () => {
        this.placeSearch = new AMap.PlaceSearch(this.getSearchOption());
      });
    }
  },
  initHeatmap: {
    value() {
      if (this.setting.initHeatmap) {
        var _this = this;

        this.map.plugin(["AMap.Heatmap"], function () {
          let heatmap = null;

          heatmap = new AMap.Heatmap(_this.map, {
            radius: _this.setting.heatmap.radius,
            opacity: _this.setting.heatmap.opacity,
            gradient: {
              0.5: "blue",
              0.65: "rgb(117,211,248)",
              0.7: "rgb(0, 255, 0)",
              0.9: "#ffea00",
              1.0: "red"
            }
          });

          _this.heatmap = heatmap;
        });
      }
    }
  },
  initMassMarks: {
    value(data, style) {
      var mass = new AMap.MassMarks(data, {
        opacity: this.setting.massmarks.opacity,
        zIndex: this.setting.massmarks.zIndex,
        cursor: this.setting.massmarks.cursor,
        style: style
      });

      mass.setMap(this.map);

      mass.on("mouseover", e => {
        this.openInfoWindow({
          content: e.data.content,
          id: e.data.id,
          position: e.data.position,
          y: e.data.popY || -35,
          x: e.data.popX || -1
        });
      });

      mass.on("mouseout", e => {
        this.closeInfoWindow(e.data.id);
      });

      return mass;
    }
  },
  showAlert: {
    value(msg) {
      alert(msg);
    }
  },
  doSearch: {
    value(keywords, option, callback) {
      if (option) {
        if (option.pageSize) {
          this.placeSearch.setPageSize(option.pageSize);
        }
        else {
          this.placeSearch.setPageSize(this.setting.searchSetting.pageSize);
        }

        if (option.pageIndex) {
          this.placeSearch.setPageIndex(option.pageIndex);
        }
        else {
          this.placeSearch.setPageIndex(this.setting.searchSetting.pageIndex);
        }

        if (option.type) {
          this.placeSearch.setType(option.type);
        }
        else {
          this.placeSearch.setType("");
        }
      }

      return new Promise((resolve, reject) => {
        this.placeSearch.search(keywords, (state, res) => {
          if (res.info && res.info.toLowerCase() === "ok") {
            resolve(res.poiList);
          }
          else {
            reject(res);
          }
        });
      });
    }
  },
  searchNearBy: {
    value(option) {
      if (!option || !option.center || !option.radius) {
        console.error("配置不正确！");

        return;
      }

      if (option) {
        if (option.pageSize) {
          this.placeSearch.setPageSize(option.pageSize);
        }
        else {
          this.placeSearch.setPageSize(this.setting.searchSetting.pageSize);
        }

        if (option.pageIndex) {
          this.placeSearch.setPageIndex(option.pageIndex);
        }
        else {
          this.placeSearch.setPageIndex(this.setting.searchSetting.pageIndex);
        }

        if (option.type) {
          this.placeSearch.setType(option.type);
        }
        else {
          this.placeSearch.setType("");
        }
      }

      return new Promise((resolve, reject) => {
        this.placeSearch.searchNearBy("", option.center, option.radius, (status, result) => {
          if (lib.isEmptyObject(result)) {
            resolve({ pois: [] });
          }
          else if (result.info && result.info.toLowerCase() === "ok") {
            resolve(result.poiList);
          }
          else {
            reject(result);
          }
        });
      });
    }
  },
  setSearchMap: {
    value(map) {

    }
  },
  getSearchOption: {
    value() {
      return {
        pageSize: this.setting.searchSetting.pageSize,
        pageIndex: this.setting.searchSetting.pageIndex,
        city: this.setting.searchSetting.city,
        type: this.setting.searchSetting.type,
        extensions: this.setting.searchSetting.extensions,
        citylimit: this.setting.searchSetting.citylimit,
        // map: this.map,
        panel: this.setting.searchResultContainer,
        autoFitView: this.setting.searchSetting.autoFitView,
        showCover: this.setting.searchSetting.showCover
      };
    }
  },
  initSearchContent: {
    value(circle) {
      this.placeSearch.searchNearBy(
        this.setting.searchSetting.type,
        circle.getCenter(),
        parseInt(circle.getRadius()),
        (status, result) => {
          // console.log(result);
        }
      );
    }
  },
  /**
   * 使地图适配当前最大尺寸
   */
  setFitView: {
    value() {
      this.map.setFitView();
    }
  },
  setSearchType: {
    value(type) {
      this.setting.searchSetting.type = type;
    }
  },
  setCenter: {
    value(center) {
      if (!center) {
        console.error("请设置正确的中心点！");

        return;
      }

      this.map.setCenter(center);
    }
  },
  getSearchType: {
    value() {
      return this.setting.searchSetting.type;
    }
  },
  setFeatures: {
    value(features) {
      this.map.setFeatures(features);
    }
  },
  setMapStyle: {
    value(url) {
      this.map.setMapStyle(url);
    }
  },
  setZoom: {
    value(zoom) {
      this.map.setZoom(zoom || this.setting.zoom);
    }
  },
  onMapZoomChange: {
    value() {
      this.map.on("zoomchange", () => {
        var zoom = this.map.getZoom();

        if (zoom < this.setting.minZoom) {
          this.hidePolygonName();
        }
        else {
          this.showPolygonName();
        }
      });
    }
  },
  openInfoWindow: {
    value(opts) {
      var infoWindow = new AMap.InfoWindow({
        isCustom: true,  //使用自定义窗体
        content: opts.content || "<label>信息</label>",
        autoMove: false,
        offset: new AMap.Pixel(opts.x || 15, opts.y || -15)
      });
      let _id = opts.id || ("_" + Math.random());

      if (this.infoWindow && this.infoWindow[_id]) {
        this.infoWindow[_id].infoWindow = infoWindow;
        this.infoWindow[_id].close = infoWindow.close.bind(infoWindow);
      }
      else {
        this.infoWindow[_id] = {};
        this.infoWindow[_id].id = _id;
        this.infoWindow[_id].infoWindow = infoWindow;
        this.infoWindow[_id].close = infoWindow.close.bind(infoWindow);
      }

      infoWindow.open(this.map, opts.position);
    }
  },
  closeInfoWindow: {
    value(id) {
      this.infoWindow[id] && this.infoWindow[id].close();
    }
  },
  clearInfoWindow: {
    value() {
      this.map.clearInfoWindow();
    }
  },
  /**
   * 设定圆圈
   * @param {Array} opts 所有圆圈的配置
   */
  drawCircles: {
    value(opts) {
      var circles = [];

      opts.forEach(item => {
        let circle = new AMap.Circle({
          map: this.map,
          center: item.center,//设置线覆盖物路径
          radius: 1500,
          strokeColor: item.strokeColor || this.setting.circle.strokeColor,//边框线颜色
          strokeOpacity: item.strokeOpacity || this.setting.circle.strokeOpacity || item.fillOpacity,//边框线透明度
          strokeWeight: item.strokeWeight || this.setting.circle.strokeWeight,//边框线宽
          fillColor: item.fillColor || this.setting.circle.fillColor,//填充色
          fillOpacity: item.fillOpacity || this.setting.circle.fillOpacity//填充透明度
        });

        circles.push({
          id: item.id || ("_" + Math.random()),
          circle: circle
        });
      });

      return (this.circles = [this.circles, ...circles]);
    }
  },
  /**
   * 画自定义的圆
   */
  drawCircleSelfDef: {
    value(opts) {
      this.startDrawCircleSelfDef(opts);
    }
  },
  setCircle: {
    value(circle, editable, callCallback) {
      this.onCircleDrawed(circle, editable, callCallback);
    }
  },
  onCircleDrawed: {
    value(circle, editable, callCallback) {
      this.endDrawCircleSelfDef();

      let circleId = "_" + Math.random();

      circle.setMap(this.map);

      if (callCallback && this.setting.onCircleDrawed) {
        this.setting.onCircleDrawed({
          circle: circle,
          id: circleId
        });
      }

      this.circles.push({
        id: circleId,
        circle: circle,
        type: "selfDef"
      });

      if (editable) {
        let circleEditor = new AMap.CircleEditor(this.map, circle);

        this.editor.circle = {
          id: circleId,
          editor: circleEditor,
          circle: circle
        };

        circleEditor.open();

        setTimeout(() => {
          Array.prototype.slice.call(document.querySelectorAll(".amap-icon img")).forEach(item => {
            item.addEventListener("mouseup", () => {
              if (this.setting.onCircleChanged) {
                this.setting.onCircleChanged({
                  circle: circle,
                  id: circleId
                });
              }
            });
          });
        }, 200);
      }
    }
  },
  onDrawed: {
    value() {
      this.mouseTool.on("draw", res => {
        let drawedObj = res.obj;

        var type = drawedObj.CLASS_NAME.split(".")[1];

        switch (type.toLowerCase()) {
          case "circle":
            this.onCircleDrawed(drawedObj, true, true);
            break;
          case "marker":
            this.onMarkerDrawed(drawedObj);
            break;
          case "polygon":
            this.onPolygonDrawed(drawedObj);
            break;
        }
      });
    }
  },
  setPolygonEditable: {
    value(editable) {
      this.setting.polygon.editable = editable;
    }
  },
  /**
   * 开始自定义画多边形
   */
  startDrawPolygonSelfDef: {
    value() {
      this.mouseTool.polygon();
      this.map.setDefaultCursor("pointer");
    }
  },
  /**
   * 自定义画多边形结束
   */
  endDrawPolygonSelfDef: {
    value() {
      this.mouseTool.close();
      this.map.setDefaultCursor("url(http://webapi.amap.com/theme/v1.3/openhand.cur),default");
    }
  },
  cancelPolygonsEdit: {
    value(polygon) {
      this.editor.polygon.polygonEditor.close();

      this.cancelPolygonChosed(polygon || this.editor.polygon);

      this.editor.polygon = null;

      if (this.setting.polygon.cancelEdit) {
        this.setting.polygon.cancelEdit(polygon);
      }
    }
  },
  /**
   * 退出自定义画圆
   */
  cancelCircleSelfDef: {
    value(clearCircle) {
      clearCircle = clearCircle === undefined ? true : clearCircle;

      this.editor.circle && this.editor.circle.editor && this.editor.circle.editor.close(clearCircle);
    }
  },
  /**
   * 开始绘制自定义的圆
   */
  startDrawCircleSelfDef: {
    value() {
      this.mouseTool.circle();
      this.map.setDefaultCursor("crosshair");
    }
  },
  /**
   * 结束绘制自定义的圆
   */
  endDrawCircleSelfDef: {
    value() {
      this.mouseTool.close();
      this.map.setDefaultCursor("url(http://webapi.amap.com/theme/v1.3/openhand.cur),default");
    }
  },
  /**
   * 设定标记点
   * @param {Array} opts 所有标记点的配置
   * @param {Boolean} noCache 是否缓存
   */
  drawMarkers: {
    value(opts, noCache) {
      var markers = [],
        marker = null;

      opts.forEach(item => {
        let itemId = item.id || ("_" + Math.random());
        let markerOption = {
          map: this.map,
          icon: item.icon || "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
          position: item.position,
          content: item.content,
          title: item.name || "",
          zIndex: item.zIndex || 100,
          draggable: item.draggable
        };

        if (!this.setting.marker.showTitle) {
          delete markerOption.title;
        }

        let offset = null;

        if (item.x || item.y) {
          offset = new AMap.Pixel(item.x || -10, item.y || -33);

          markerOption.offset = offset;
        }

        if (item.noOffset) {
          markerOption.offset = new AMap.Pixel(0, 0);
        }

        marker = new AMap.Marker(markerOption);

        let tMarker = null;

        /**如果是要保存到内存的标记点 */
        if (!noCache) {
          tMarker = {
            id: itemId,
            index: item.index,
            name: item.name || "",
            marker: marker
          };
        }

        if (tMarker) {
          markers.push(tMarker);
        }

        marker.on("click", () => {
          if (item.clickFun) {
            item.clickFun(tMarker);
          }

          this.prevMarker = tMarker;

          if (!item.hideName && (item.name || item.detail)) {
            this.openInfoWindow({
              content: item.name ? `<div class='map-info-window'>${item.name}</div>` : item.detail || "",
              id: itemId,
              position: item.position,
              y: item.popY || -35,
              x: item.popX || -1
            });
          }
        });

        if (item.draggable) {
          marker.on("dragend", res => {
            if (this.setting.onMarkerChanged) {
              this.setting.onMarkerChanged({
                marker: marker,
                id: itemId
              });
            }
          });
        }

        marker.on("mouseover", () => {
          if (item.showDetail) {
            this.openInfoWindow({
              content: item.contentType === "no-border" ? (item.detail || item.name || "") : `<div class='map-info-window'>${(item.detail || item.name || "")}</div>`,
              id: itemId,
              position: item.position,
              y: item.popY || -35,
              x: item.popX || -1
            });
          }
        });

        marker.on("mouseout", () => {
          if (item.showDetail) {
            this.closeInfoWindow(itemId);
          }
        });
      });

      if (noCache) {
        return marker;
      }

      if (!this.markers) {
        this.markers = [];
      }

      this.markers = this.markers.concat(markers);

      return markers;
    }
  },
  setPrevMarker: {
    value(marker) {
      this.prevMarker = marker;
    }
  },
  onMarkerDrawed: {
    value(marker) {
      this.endDrawMarkerSelfDef();

      let markerId = "_" + Math.random();

      if (this.setting.onMarkerDrawed) {
        this.setting.onMarkerDrawed({
          marker: marker,
          id: markerId
        });
      }

      this.markers.push({
        id: markerId,
        marker: marker,
        type: "selfDef"
      });
    }
  },
  drawMarkerSelfDef: {
    value() {
      this.mouseTool.marker();
      this.map.setDefaultCursor("pointer");
    }
  },
  endDrawMarkerSelfDef: {
    value() {
      this.mouseTool.close();
      this.map.setDefaultCursor("url(http://webapi.amap.com/theme/v1.3/openhand.cur),default");
    }
  },
  onPolygonDrawed: {
    value(polygon) {
      this.endDrawPolygonSelfDef();

      let _id = "_" + Math.random();

      let center = polygon.getBounds().getCenter();
      let marker = null;

      let polygonOption = {
        id: _id,
        name: "",
        polygon: polygon,
        center: [center.lng, center.lat],
        clicked: false,
        showTitle: this.setting.polygon.showTitle,
        clickFun: this.setting.polygon.clickFun,
        mouseoutFun: this.setting.polygon.mouseoutFun,
        mouseoverFun: this.setting.polygon.mouseoverFun,
        style: {
          clickedColor: this.setting.polygon.clickedColor,
          clickedOpacity: this.setting.polygon.clickedOpacity,
          hoverColor: this.setting.polygon.hoverColor,
          hoverOpacity: this.setting.polygon.hoverOpacity,
          strokeColor: this.setting.polygon.strokeColor, //线颜色
          strokeOpacity: this.setting.polygon.strokeOpacity, //线透明度
          strokeWeight: this.setting.polygon.strokeWeight,
          fillColor: this.setting.polygon.fillColor, //填充色
          fillOpacity: this.setting.polygon.fillOpacity//填充透明度
        },
        type: "selfDef",
        setOptions: polygon.setOptions.bind(polygon)
      };

      if (this.setting.polygon.titlePosition === "top") {
        let result = [];

        polygon.getPath().forEach(item => {
          result.push({
            x: item.lng,
            y: item.lat
          });
        });

        polygonOption.top = this.getPolygonPathTopPoint(result);
      }

      if (!this.setting.polygon.disableClick) {
        this.bindPolygonClickEvent(polygonOption);
      }

      if (!this.setting.polygon.disableHover) {
        this.bindPolygonMouseoverEvent(polygonOption);
        this.bindPolygonMouseoutEvent(polygonOption);
      }

      if (this.setting.polygon.onDrawed) {
        this.setting.polygon.onDrawed(polygonOption);
      }

      if (this.setting.polygon.editable) {
        this.prevPolygon = polygonOption;

        this.setPolygonChosed(polygonOption);
        this.editPolygon(polygonOption);
      }

      this.polygons.push(polygonOption);
    }
  },
  setPolygonName: {
    value(polygon, name) {
      polygon.name = name;

      let center = polygon.polygon.getBounds().getCenter();
      let marker = null;

      marker = this.drawMarkers([{
        map: this.map,
        position: center,
        content: `<div class="myamap-area-name" style="color:${this.setting.polygon.nameColor}">${name}</div>`
      }], true);

      polygon.marker = marker;

      if (this.map.getZoom() < this.setting.minZoom) {
        marker.hide();
      }
    }
  },
  setPolygonData: {
    value(polygon, data) {
      polygon.data = data;
    }
  },
  /**
   * 设定自定义区域
   * @param {Array} opts 所有自定义区域的配置
   */
  drawPolygons: {
    value(opts) {
      var polygons = [];

      opts.polygons.forEach(item => {
        let polygon = new AMap.Polygon({
          map: this.map,
          path: item.path,//设置多边形边界路径
          strokeColor: item.strokeColor || this.setting.polygon.strokeColor, //线颜色
          strokeOpacity: item.strokeOpacity || this.setting.polygon.strokeOpacity || item.fillOpacity, //线透明度
          strokeWeight: item.strokeWeight || this.setting.polygon.strokeWeight,    //线宽
          fillColor: item.fillColor || this.setting.polygon.fillColor, //填充色
          fillOpacity: item.fillOpacity || this.setting.polygon.fillOpacity//填充透明度
        });

        let center = polygon.getBounds().getCenter();
        let marker = null;

        marker = this.drawMarkers([{
          map: this.map,
          position: center,
          content: `<div class="myamap-area-name" style="color:${this.setting.polygon.nameColor}">${item.name}</div>`
        }], true);

        let polygonOption = {
          id: item.id || ("_" + Math.random()),
          name: item.name || "",
          data: item,
          polygon: polygon,
          center: [center.lng, center.lat],
          clicked: false,
          title: item.title,
          showTitle: item.showTitle || this.setting.polygon.showTitle,
          clickFun: item.clickFun || this.setting.polygon.clickFun,
          mouseoutFun: item.mouseoutFun || this.setting.polygon.mouseoutFun,
          mouseoverFun: item.mouseoverFun || this.setting.polygon.mouseoverFun,
          disableClick: item.disableClick === undefined ? false : true,
          style: {
            clickedColor: item.clickedColor || this.setting.polygon.clickedColor,
            clickedOpacity: item.clickedOpacity || this.setting.polygon.clickedOpacity,
            hoverColor: item.hoverColor || this.setting.polygon.hoverColor,
            hoverOpacity: item.hoverOpacity || this.setting.polygon.hoverOpacity,
            strokeColor: item.strokeColor || this.setting.polygon.strokeColor, //线颜色
            strokeOpacity: item.strokeOpacity || this.setting.polygon.strokeOpacity || item.fillOpacity, //线透明度
            strokeWeight: item.strokeWeight || this.setting.polygon.strokeWeight,
            fillColor: item.fillColor || this.setting.polygon.fillColor, //填充色
            fillOpacity: item.fillOpacity || this.setting.polygon.fillOpacity//填充透明度
          },
          marker: marker,
          setOptions: polygon.setOptions.bind(polygon)
        };

        if (this.setting.polygon.titlePosition === "top") {
          polygonOption.top = this.getPolygonPathTopPoint(item.path);
        }

        polygons.push(polygonOption);

        if (this.map.getZoom() < this.setting.minZoom) {
          marker.hide();
        }

        if (item.clicked) {
          this.setPolygonChosed(polygonOption);
        }
      });

      if (!this.polygons) {
        this.polygons = [];
      }

      this.polygons = this.polygons.concat(polygons);

      if (!this.setting.polygon.disable) {
        this.bindPolygonEvent();
      }

      this.setting.legend = opts.legend;

      this.drawLegend(opts.legend);

      return polygons;
    }
  },
  /**
   * 为覆盖物添加图例
   * @param {Object} opts 图例的属性
   */
  drawLegend: {
    value(legend) {
      if (!legend) return;

      if (!legend.style) {
        legend.style = {};
      }

      if (this.elem.legendBox) {
        this.elem.legendBox.parentNode.removeChild(this.elem.legendBox);
        this.elem.legendBox = null;
      }

      this.constructLegendBox(legend);

      legend.data.forEach(item => {
        item && this.constructLegendItem(item, legend);
      });

      if (legend.button) {
        this.constructLegendButton(legend.button);
      }
    }
  },
  constructLegendBox: {
    value(legend) {
      var elem = document.createElement("div");

      elem.className = "map-legend";

      elem.style.zIndex = legend.style.zIndex || 1;
      elem.style.fontSize = legend.style.fontSize || "12px";

      switch (legend.style.align) {
        case "left":
          elem.style.left = "20px";
          elem.style.right = "inherit";
          break;
        case "center":
          break;
        case "right":
          elem.style.left = "inherit";
          elem.style.right = "20px";
          break;
      }

      switch (legend.style.verticalAlign) {
        case "top":
          elem.style.bottom = "inherit";
          elem.style.top = "20px";
          break;
        case "middle":
          break;
        case "bottom":
          elem.style.top = "inherit";
          elem.style.bottom = "20px";
          break;
      }

      this.elem.legendBox = elem;

      document.querySelector("#" + this.setting.container).appendChild(elem);
    }
  },
  constructLegendItem: {
    value(data, legend) {
      var elemLegend = document.createElement("div"),
        elemName = document.createElement("div"),
        elemColor = document.createElement("div");

      elemLegend.className = "legend-item";
      elemName.className = "legend-item-name";
      elemColor.className = "legend-item-color";

      elemName.textContent = data.name;
      elemColor.style.backgroundColor = data.color;
      elemColor.style.radius = legend.style.itemRadius || 0;
      elemColor.style.width = legend.style.itemWidth || "30px";
      elemColor.style.height = legend.style.itemHeight || "15px";

      if (legend.style.textPosition === "right") {
        elemName.style.paddingLeft = "10px";
        elemName.style.paddingRight = "0";


        elemLegend.appendChild(elemColor);
        elemLegend.appendChild(elemName);
      }
      else {
        elemLegend.appendChild(elemName);
        elemLegend.appendChild(elemColor);
      }

      this.elem.legendBox.appendChild(elemLegend);

      if (legend.clickFun) {
        elemLegend.style.cursor = "pointer";

        elemLegend.onclick = e => {
          legend.clickFun(data, e);
        };

        elemLegend.onmouseover = e => {
          elemLegend.style.backgroundColor = "#eee";
        };

        elemLegend.onmouseout = e => {
          elemLegend.style.backgroundColor = "#fff";
        };
      }
    }
  },
  constructLegendButton: {
    value(option) {
      var elem = document.createElement("div");
      var button = document.createElement("button");

      elem.className = "map-legend-bottom";
      button.className = "legend-bottom-button";

      if (option.class) {
        button.classList.add(option.class);
      }

      button.textContent = option.name || "点击";

      if (option.clickFun) {
        button.onclick = this.setting.legend.button.clickFun;
      }

      elem.appendChild(button);

      this.elem.legendBox.appendChild(elem);
    }
  },
  setLegendButtonIsDisable: {
    value(disable) {
      var button = this.elem.legendBox.querySelector(".legend-bottom-button");

      if (disable) {
        button.classList.add("element-disabled");

        button.onclick = null;

        // button.removeEventLisenter("click", this.setting.legend.button.clickFun);
      }
      else {
        button.classList.remove("element-disabled");

        button.onclick = this.setting.legend.button.clickFun;
      }
    }
  },
  showLegendButton: {
    value() {
      this.elem.legendBox.querySelector(".map-legend-bottom").style.display = "block";
    }
  },
  hideLegendButton: {
    value() {
      this.elem.legendBox.querySelector(".map-legend-bottom").style.display = "none";
    }
  },
  removeCircle: {
    /**
     * 移除指定的圆
     * @param {Object} circle 圆的对象
     * @param {String} id 圆的ID
     */
    value(circle, id) {
      var type = lib.getObjType(circle);
      var _index = 0;

      if (type === "string") {
        this.map.remove(this.circles.filter((item, index) => {
          if (item.id === id) {
            _index = index;
          }

          return item.id === id;
        }));

        this.editor.circle.editor.close();

        this.circles.splice(_index, 1);
        this.editor.circle = {};
      }
      else if (type === "object") {
        this.circles.forEach((item, index) => {
          if (item.circle === circle) {
            _index = index;
          }
        });

        this.map.remove([circle]);
        this.circles.splice(_index, 1);
        this.editor.circle = {};
      }
      else if (type === "array") {
        this.circles.forEach(item => {
          this.removeCircle(item);
        });
      }
      else {
        console.error("请指定要删除的圆！");
      }
    }
  },
  removeMarkers: {
    /**
     * 移除指定的点
     * @param {Array} markers 点的描述，可以使点的ID，也可以是点的对象，也可以是点的对象数组，也可以是点的id数组，或者ID与对象的数组组合
     */
    value(markers) {
      var type = lib.getObjType(markers);
      var _index = 0;

      if (type === "string" || type === "number") {
        this.map.remove(this.markers.filter((item, index) => {
          if (item.id == markers) {
            _index = index;
          }

          return item.id == markers;
        })[0].marker);

        this.markers.splice(_index, 1);
      }
      else if (type === "object") {
        this.markers.forEach((item, index) => {
          if (item.marker === markers) {
            _index = index;
          }
        });

        this.map.remove([markers.marker]);
        this.markers.splice(_index, 1);
      }
      else if (type === "array") {
        this.markers.forEach(item => {
          this.removeMarkers(item.id);
        });
      }
      else {
        console.error("请指定要删除的点！");
      }
    }
  },
  /**
   * 绑定地图加载完成的事件
   */
  bindOnMapLoaded: {
    value() {
      this.map.on("complete", e => {
        this.setting.onReady(e);
      });
    }
  },
  setPolygonDisable: {
    value(disable) {

    }
  },
  /**
   * 为所有的多边形绑定事件
   */
  bindPolygonEvent: {
    value() {
      this.polygons.forEach(polygon => {
        if (!this.setting.polygon.disableClick) {
          this.bindPolygonClickEvent(polygon);
        }

        if (!this.setting.polygon.disableHover) {
          this.bindPolygonMouseoverEvent(polygon);
          this.bindPolygonMouseoutEvent(polygon);
        }
      });
    }
  },
  bindPolygonClickEvent: {
    value(polygonObj) {
      polygonObj.polygon.on("click", e => {
        this.setPolygonClicked(polygonObj, e, true);
      });
    }
  },
  setPolygonClicked: {
    value(polygon, e, callCallback) {
      this.polygonClickFun(polygon, e, callCallback);

      if (callCallback && this.setting.polygon.editable) {
        if (polygon.isEdit) return;

        this.editPolygon(polygon);
      }
    }
  },
  polygonClickFun: {
    value(polygonObj, e, callCallback) {
      if (polygonObj.disableClick) return;

      let prevPolygon = this.prevPolygon;

      /**如果不允许多选多边形 */
      if (!this.setting.polygon.multipleSelect) {
        this.setPolygonChosed(polygonObj);

        if (this.prevPolygon) {
          if (this.prevPolygon.id !== polygonObj.id) {
            this.prevPolygon.clicked = false;
            this.prevPolygon.setOptions({
              fillColor: polygonObj.style.fillColor || this.setting.polygon.fillColor,
              fillOpacity: polygonObj.style.fillOpacity || this.setting.polygon.fillOpacity
            });
          }
        }

        this.prevPolygon = polygonObj;
      }
      /**如果允许多选，且已经被选中了，则取消选中 */
      else if (polygonObj.clicked) {
        this.cancelPolygonChosed(polygonObj);
      }
      else {
        if (this.setting.polygon.maxSelect) {
          if (this.chosedPolygon.length >= this.setting.polygon.maxSelect) {
            this.setting.alert(`最多只能同时选择${this.setting.polygon.maxSelect}个版块！`);

            return;
          }
        }

        this.setPolygonChosed(polygonObj);
      }

      if (callCallback) {
        if (this.setting.polygon.clickFun) {
          this.setting.polygon.clickFun(e, polygonObj, this.chosedPolygon, prevPolygon);
        }
        else if (polygonObj.clickFun) {
          polygonObj.clickFun(e, polygonObj, this.chosedPolygon, prevPolygon);
        }
      }
    }
  },
  bindPolygonMouseoverEvent: {
    value(polygonObj) {
      polygonObj.polygon.on("mouseover", e => {
        if (polygonObj.disableHover) return;

        if (polygonObj.showTitle) {
          let title = polygonObj.title || polygonObj.name;
          let titleHtml = "",
            x = 0,
            y = 0;

          if (title) {
            if (polygonObj.title) {
              titleHtml = title;
            }
            else {
              titleHtml = `<div class='map-info-window'>${title}</div>`;
            }

            this.openInfoWindow({
              content: titleHtml,
              id: polygonObj.id,
              position: this.setting.polygon.titlePosition === "middle" ? polygonObj.center : polygonObj.top,
              x: 5,
              y: -10
            });
          }
        }

        if (polygonObj.clicked) return;

        polygonObj.setOptions({
          fillColor: polygonObj.style.hoverColor || this.setting.polygon.hoverColor,
          fillOpacity: polygonObj.style.hoverOpacity || this.setting.polygon.hoverOpacity
        });

        if (polygonObj.clicked) return;

        polygonObj.setOptions({
          fillColor: polygonObj.style.hoverColor || this.setting.polygon.hoverColor,
          fillOpacity: polygonObj.style.hoverOpacity || this.setting.polygon.hoverOpacity
        });

        if (polygonObj.mouseoverFun) {
          polygonObj.mouseoverFun(e, polygonObj);
        }
      });
    }
  },
  bindPolygonMouseoutEvent: {
    value(polygonObj) {
      polygonObj.polygon.on("mouseout", e => {
        if (polygonObj.showTitle) {
          this.closeInfoWindow(polygonObj.id);
        }

        if (polygonObj.clicked) return;

        polygonObj.setOptions({
          fillColor: polygonObj.style.fillColor || this.setting.polygon.fillColor,
          fillOpacity: polygonObj.style.fillOpacity || this.setting.polygon.fillOpacity
        });

        if (polygonObj.mouseoutFun) {
          polygonObj.mouseoutFun(e, polygonObj);
        }
      });
    }
  },
  editPolygon: {
    value(polygon) {
      var polygonEditor = new AMap.PolyEditor(this.map, polygon.polygon);

      this.editor.polygon = {
        id: polygon.id || Math.random(),
        polygonEditor: polygonEditor,
        polygon: polygon,
        editing: true
      };

      if (this.prevPolygon) {
        this.prevPolygon.isEdit = false;
      }

      polygon.isEdit = true;

      polygonEditor.open();

      this.bindPolygonEditorEvent(polygonEditor);
    }
  },
  /**移除某一个多边形 */
  removePolygon: {
    value(polygonObj) {
      var polygonArr = [polygonObj.polygon];

      if (polygonObj.marker) {
        polygonArr.push(polygonObj.marker);
      }

      if (this.editor.polygon) {
        this.editor.polygon.polygonEditor.close();
      }

      this.map.remove(polygonArr);
    }
  },
  bindPolygonEditorEvent: {
    value(editor) {
      this.bindPolygonEditorAddNode(editor);
      this.bindPolygonEditorRemovedNode(editor);
      this.bindPolygonEditorAdjust(editor);
    }
  },
  bindPolygonEditorAddNode: {
    value(editor) {
      editor.on("addnode", res => {
        this.polygonChange(res);
      });
    }
  },
  bindPolygonEditorRemovedNode: {
    value(editor) {
      editor.on("removenode", res => {
        this.polygonChange(res);
      });
    }
  },
  bindPolygonEditorAdjust: {
    value(editor) {
      editor.on("adjust", res => {
        this.polygonChange(res);
      });
    }
  },
  polygonChange: {
    value(res) {
      if (this.setting.polygon.editChange) {
        this.setting.polygon.editChange(res.target.getPath());
      }
    }
  },
  getPolygonPathTopPoint: {
    value(paths) {
      var max = 0,
        _index = 0;

      paths.forEach((item, index) => {
        if (item.lat > max) {
          max = item.lat;
          _index = index;
        }
      });

      return [paths[_index].lng, paths[_index].lat];
    }
  },
  /**
   * 隐藏所有的多边形
   */
  hideAllPolygons: {
    value() {
      this.polygons && this.polygons.forEach(item => {
        item.polygon && item.polygon.hide();
      });
    }
  },
  /**
   * 显示所有的多边形
   */
  showAllPolygons: {
    value() {
      this.polygons && this.polygons.forEach(item => {
        item.polygon && item.polygon.show();
      });
    }
  },
  /**
   * 隐藏所有的多边形的名称
   */
  hidePolygonName: {
    value() {
      this.polygons && this.polygons.forEach(item => {
        item.marker && item.marker.hide();
      });
    }
  },
  /**
   * 显示所有多边形的名称
   */
  showPolygonName: {
    value() {
      this.polygons && this.polygons.forEach(item => {
        item.marker && item.marker.show();
      });
    }
  },
  /**
   * 处理所有多边形的路径，组成一个二维数组
   * @param {Array} path 多边形的路径数组
   */
  handlePolygonPath: {
    value(path) {
      var ret = [];

      path.forEach(item => {
        ret.push([item.lng, item.lat].join(","));
      });

      return ret;
    }
  },
  removeAllCircles: {
    value() {
      var _circles = [];

      this.circles.forEach(item => {
        if (item.circle) {
          _circles.push(item.circle);
        }
      });

      if (_circles.length > 0) {
        this.map.remove(_circles);
        this.circles = [];
      }
    }
  },
  removeAllMarkers: {
    value() {
      var _markers = [];

      this.markers.forEach(item => {
        if (item.marker) {
          _markers.push(item.marker);
        }
      });

      if (_markers.length > 0) {
        this.map.remove(_markers);
        this.markers = [];
      }
    }
  },
  getChosedPolygon: {
    value() {
      return this.chosedPolygon;
    }
  },
  setPolygonChosed: {
    value(polygon) {
      if (polygon) {
        polygon.clicked = true;
        polygon.setOptions({
          fillColor: polygon.style && polygon.style.clickedColor || this.setting.polygon.clickedColor,
          fillOpacity: polygon.style && polygon.style.clickedOpacity || this.setting.polygon.clickedOpacity
        });

        /**如果允许多选 */
        if (this.setting.polygon.multipleSelect) {
          if (!this.chosedPolygon.some(item => { return item.id === polygon.id; })) {
            this.chosedPolygon.push(polygon);
          }
        }
      }
    }
  },
  cancelPolygonChosed: {
    value(polygon) {
      if (polygon) {
        polygon.clicked = false;
        polygon.setOptions({
          fillColor: polygon.style && polygon.style.fillColor || this.setting.polygon.fillColor,
          fillOpacity: polygon.style && polygon.style.fillOpacity || this.setting.polygon.fillOpacity
        });

        /**如果允许多选 */
        if (this.setting.polygon.multipleSelect) {
          this.chosedPolygon.splice(this.chosedPolygon.findIndex(item => {
            return item.id === polygon.id;
          }), 1);
        }
      }
    }
  },
  clearChosedPolygon: {
    value() {
      this.chosedPolygon.forEach(item => {
        item.setOptions({
          fillColor: item.style.fillColor || this.setting.polygon.fillColor,
          fillOpacity: item.style.fillOpacity || this.setting.polygon.fillOpacity
        });

        item.clicked = false;
      });

      this.chosedPolygon = [];
    }
  },
  clearMap: {
    value() {
      this.map.clearMap();

      if (this.elem.legendBox) {
        this.elem.legendBox.parentNode.removeChild(this.elem.legendBox);
      }

      if (this.massmarks) {
        this.massmarks.clear();
      }

      this.markers = [];
      this.prevMarker = null;
      this.circles = [];
      this.polygons = [];
      this.lines = [];
      this.infoWindow = {};
      this.elem = {};
      this.chosedPolygon = [];
      this.editor = {
        polygon: {},
        circle: {},
        marker: {},
        line: {}
      };
      this.heatmap = null;
      this.massmarks = null;
    }
  },
  /** 更改地图默认配置项 eg: 可用于 切换板块单选和多选模式 */
  changeSettings: {
    value(newSettings) {
      this.setting = lib.extend(this.setting, newSettings || {}, true);
    }
  },
  setHeatmapData: {
    value(data) {
      this.heatmap.setDataSet({
        data: data || [],
        max: this.setting.heatmap.max
      });
    }
  },
  hideHeatmap: {
    value() {
      this.heatmap.hide();
    }
  },
  showHeatmap: {
    value() {
      this.heatmap.show();
    }
  },
  setMassMarksData: {
    value(data) {
      var _data = [];
      var _styles = [];

      if (data) {
        data.forEach((item, index) => {
          _styles.push({
            url: this.setting.massmarks.style.url,
            anchor: new AMap.Pixel(4, 4),
            size: item.size ? new AMap.Size(item.size[0], item.size[1]) : new AMap.Size(7, 7)
          });

          _data.push({
            lnglat: new AMap.LngLat(item.position[0], item.position[1]),
            content: item.content,
            position: item.position,
            popY: item.popY || -15,
            style: index,
            id: item.id
          });
        });
      }

      if (this.massmarks) {
        this.massmarks.setStyle(_styles);
        this.massmarks.setData(_data);
      }
      else {
        this.massmarks = this.initMassMarks(_data, _styles);
      }
    }
  },
  hideMassMarks: {
    value() {
      this.massmarks.hide();
    }
  },
  showMassMarks: {
    value() {
      this.massmarks.show();
    }
  },
  destroy: {
    value() {
      this.markers = [];
      this.prevMarker = null;
      this.circles = [];
      this.polygons = [];
      this.lines = [];
      this.infoWindow = {};
      this.elem = {};
      this.chosedPolygon = [];
      this.editor = {
        polygon: {},
        circle: {},
        marker: {},
        line: {}
      };
      this.heatmap = null;
      this.massmarks = null;

      this.destroyMapInstance();
    }
  },
  destroyMapInstance: {
    value() {
      this.map.destroy();
    }
  }
});

export default MyAMap;
