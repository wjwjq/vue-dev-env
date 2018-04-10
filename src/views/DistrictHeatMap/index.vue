<template>
    <district-heatmap 
        :data="data"
        :city="city"
        :title="title"
    />
</template>

<script>
import DistrictHeatMap from "components/DistrictHeatMap";

/* const geRandom = () =>
  Math.random() > 0.5
    ? Math.random() * Math.random() * Math.random() * Math.random() * Math.random() * Math.random() * Math.random() * Math.random()
    : -Math.random() * Math.random() * Math.random() * Math.random() * Math.random() * Math.random() * Math.random() * Math.random();

const districtData = [
  {
    id: 610102,
    adcode: 610102,
    name: "新城区",
    lng: 108.959903,
    lat: 34.26927,
    count: 100
  },
  {
    id: 610103,
    adcode: 610103,
    name: "碑林区",
    lng: 108.946994,
    lat: 34.251061,
    count: 300
  },
  {
    id: 610104,
    adcode: 610104,
    name: "莲湖区",
    lng: 108.933194,
    lat: 34.2656,
    count: 500
  },
  {
    id: 610111,
    adcode: 610111,
    name: "灞桥区",
    lng: 109.067261,
    lat: 34.267453,
    count: 10
  },
  {
    id: 610112,
    adcode: 610112,
    name: "未央区",
    lng: 108.946022,
    lat: 34.30823,
    count: 50
  },
  {
    id: 610113,
    adcode: 610113,
    name: "雁塔区",
    lng: 108.926593,
    lat: 34.213389,
    count: 40
  },
  {
    id: 610114,
    adcode: 610114,
    name: "阎良区",
    lng: 109.22802,
    lat: 34.662141,
    count: 100
  },
  {
    id: 610115,
    adcode: 610115,
    name: "临潼区",
    lng: 109.213986,
    lat: 34.372065,
    count: 100
  },
  {
    id: 610116,
    adcode: 610116,
    name: "长安区",
    lng: 108.941579,
    lat: 34.157097,
    count: 200
  },
  {
    id: 610117,
    adcode: 610117,
    name: "高陵区",
    lng: 109.088896,
    lat: 34.535065,
    count: 100
  },
  {
    id: 610122,
    adcode: 610122,
    name: "蓝田县",
    lng: 109.317634,
    lat: 34.156189,
    count: 300
  },
  {
    id: 610124,
    adcode: 610124,
    name: "周至县",
    lng: 108.216465,
    lat: 34.161532,
    count: 500
  },
  {
    id: 610118,
    adcode: 610118,
    name: "鄠邑区",
    lng: 108.607385,
    lat: 34.108668,
    count: 100
  }
];
const data = districtData.map(item => {
  const poi = new Array(Math.floor(Math.random() * 25 + 5))
    .fill("")
    .map((citem, idx) => ({
      id: item.id + "-" + idx,
      name: `点位${idx}`,
      lng: item.lng + geRandom(),
      lat: item.lat + geRandom(),
      count: Math.random() * 1000,
      adcode: item.adcode
    }));

  const block = new Array(2).fill("").map((citem, idx) => ({
    name: `指定区域${idx}`,
    datas: new Array(Math.floor(Math.random() * 5)).fill("").map(() => ({
      lng: item.lng + geRandom(),
      lat: item.lat + geRandom()
    }))
  }));

  return {
    ...item,
    poi,
    block
  };
}); */

import data from "./ChartPoi.json";

export default {
  name: "RoadMapView",

  components: {
    "district-heatmap": DistrictHeatMap
  },

  data() {
    return {
      data,
      city: {
        name: "西安市",
        adcode: 610100,
        center: [108.939621, 34.343147]
      },
      title: {
        main: "本地客公司、企业职员及管理层主导",
        list: "",
        sub: ""
      }
    };
  }
};
</script>

