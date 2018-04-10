<template>
    <road-map :data="data" />
</template>

<script>
import RoadMap from "components/RoadMap";

import data from "./route_data.json";

export default {
  name: "RoadMapView",  
  
  components: {
    "road-map": RoadMap
  },

  data() {
    return {
      data: data
    };
  }
};
</script>

