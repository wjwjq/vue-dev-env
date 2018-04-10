<template>
    <div class="map-title">
        <div class="main-title-bar main-title-bar-top"/>
        <div class="main-title-bar main-title-bar-bottom"/>
        <h2>
            <span>{{ title.zh }}</span>
            <i v-if="title.en">{{ title.en }}</i>
        </h2>
    </div>
</template>

<script>

export default {
  name: "MapTitle",

  props: {
    title: {
      default: () => ({
        zh: "",
        en: ""
      }),
      type: Object,
      required: true
    }
  }
};
</script>