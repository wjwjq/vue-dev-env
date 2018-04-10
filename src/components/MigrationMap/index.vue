<template>
    <div class="map" >
        <div id="container"/>  
    </div>
</template>

<script>
import MoveLine from "./MoveLine";

const data = [
  {
    from: {
      city: "广州",
      lnglat: [113.264385, 23.129112]
    },
    to: {
      city: "成都",
      lnglat: [104.066143, 30.573095]
    }
  },
  {
    from: {
      city: "广州",
      lnglat: [113.264385, 23.129112]
    },
    to: {
      city: "北京",
      lnglat: [116.397477, 39.908692]
    }
  },
  {
    from: {
      city: "广州",
      lnglat: [113.264385, 23.129112]
    },
    to: {
      city: "三亚",
      lnglat: [109.508268, 18.247872]
    }
  },
  {
    from: {
      city: "广州",
      lnglat: [113.264385, 23.129112]
    },
    to: {
      city: "上海",
      lnglat: [121.473658, 31.230378]
    }
  },
  {
    from: {
      city: "广州",
      lnglat: [113.264385, 23.129112]
    },
    to: {
      city: "韶关",
      lnglat: [113.591544, 24.801322]
    }
  }
];

export default {
  name: "MigrationMap",

  mounted() {
    this.init();
  },

  methods: {
    init() {
      const map = new AMap.Map("container", {
        resizeEnable: true,
        center: [112.03956, 26.063677], //[106.937265, 27.706626],
        mapStyle: "amap://styles/fbabe76c43f93ba1604cf85c361b0ede",
        zoom: 4
      });

      new MoveLine(map, {
        //marker点半径
        markerRadius: 2,
        //marker点颜色,为空或null则默认取线条颜色
        markerColor: null,
        //线条类型 solid、dashed、dotted
        lineType: "solid",
        //线条宽度
        lineWidth: 2,
        //线条颜色
        colors: [
          "#F9815C",
          "#F8AB60",
          "#EDCC72",
          "#E2F194",
          "#94E08A",
          "#4ECDA5"
        ],
        //移动点半径
        moveRadius: 5,
        //移动点颜色
        fillColor: "#f0e536",
        //移动点阴影颜色
        shadowColor: "#fff",
        //移动点阴影大小
        shadowBlur: 10,

        data: data
      });
    }
  }
};
</script>