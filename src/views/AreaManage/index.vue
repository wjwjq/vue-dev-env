<template>
    <div class="area-manage">
        <div class="area-manage-map">          
            <div id="area-manage-map"/>
            <div class="map-tools">
                <div 
                    class="tools-button" 
                    @click="addBlock">
                    新增版块
                </div>
                <div 
                    class="tools-button"
                    @click="deleteBlock">
                    删除版块
                </div>
            </div>
        </div>
        <div class="area-manage-result">
            <div class="result-content" >
                <div class="result-content-title">坐标：</div>
                <div
                    v-for="(path,index) in currentBlock.path" 
                    :key="index" 
                    class="path-item">
                    {{ path }},
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import "./index.less";
import MyAMap from "./amap.js";

export default {
  data() {
    return {
      blocks: [],
      blockData: [],
      isEdit: false,

      currentBlock: null,

      style: {
        contentHeight: "0"
      }
    };
  },

  created() {
    this.currentBlock = this.initCurrentBlockData();
  },

  mounted() {
    /**初始化地图 */
    this.initMap();
  },

  methods: {
    initCurrentBlockData() {
      return {
        path: [],
        name: "",
        id: "",
        polygon: null
      };
    },

    /**
     * 初始化地图
     */
    initMap() {
      this.amap = new MyAMap(this.getMapOption());

      this.map = this.amap.init();
    },

    getMapOption() {
      return {
        container: "area-manage-map",
        resizeEnable: true,
        center: [108.93977, 34.341574],
        polygon: {
          editable: true,
          clickFun: (e, polygon, polygons, prePolygon) => {
            this.handleSelect(polygon, prePolygon);
          },
          editChange: res => {
            this.currentBlock.path = this.handlePolygonPath(res);
          },
          cancelEdit: () => {
            this.currentBlock.path = [];
          },
          onDrawed: polygon => {
            this.setBlockChoosed(polygon);

            polygon.isNew = true;
          }
        },
        zoom: 8,
        minZoom: 13
      };
    },

    getPolygonOption() {
      return {
        options: {
          showName: true
        },
        polygons: this.blockData
      };
    },

    handlePolygonPath(paths) {
      var result = [];

      paths.forEach(item => {
        result.push({
          x: item.lng,
          y: item.lat
        });
      });

      return result;
    },

    setBlockChoosed(polygon) {
      /**查找点击的版块在地图上对应的版块 */
      this.currentBlock = {
        path: this.handlePolygonPath(polygon.polygon.getPath()),
        name: polygon.name,
        id: polygon.id,
        polygon: polygon
      };
    },

    /**
     * 右侧输入框，选中版块后的处理
     * @param {Object} polygon 被选中的版块
     */
    handleSelect(polygon, prevPolygon) {
      if (polygon.name === this.currentBlock.name) return;

      if (this.isEdit) {
        let msg = prevPolygon.isNew
          ? "您确定要放弃新增的版块吗？"
          : "您确定要退出编辑当前版块吗？";

        if (confirm(msg)) {
          if (prevPolygon) {
            if (prevPolygon.isNew) {
              this.amap.removePolygon(prevPolygon);
            } else {
              this.amap.cancelPolygonsEdit(prevPolygon);
            }
          }

          this.setBlockChoosed(polygon);
        }
      } else {
        this.setBlockChoosed(polygon);

        this.isEdit = true;
      }
    },

    addBlock() {
      if (this.isEdit) {
        let name = this.currentBlock.name;

        if (confirm(`您正在编辑${name}版块，确定要退出编辑${name}版块吗?`)) {
          this.amap.cancelPolygonsEdit(this.currentBlock.polygon);

          this.startNewPolygon();
        }
      } else {
        this.startNewPolygon();
      }
    },

    startNewPolygon() {
      this.isEdit = true;

      this.amap.startDrawPolygonSelfDef();
    },

    deleteBlock() {
      if (!this.currentBlock.id) {
        alert("请选择要删除的版块！");

        return;
      }

      if (confirm("您确定要删除该版块吗？删除后将不可恢复！")) {
        this.amap.removePolygon(
          this.amap.polygons.filter(item => {
            return item.id === this.currentBlock.id;
          })[0]
        );

        this.currentBlock = this.initCurrentBlockData();
        this.isEdit = false;
      }
    }
  }
};
</script>
