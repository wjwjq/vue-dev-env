<template>
    <div class="content-box">
        <div class="content-box-title">
            <div class="content-box-title-item content-box-title-left"/>
            <div class="content-box-title-item content-box-title-top"/>
            <div class="content-box-title-item content-box-title-sloping"/>
            <div class="content-box-title-item content-box-title-bottom"/>
            <div class="content-box-title-item content-box-title-point"/>
            <div class="content-box-title-arrow"/>
        </div>

        <div class="box-border-top"/>
        <div class="box-border-right"/>
        <div class="box-border-bottom"/>
        <div class="box-border-left"/>

        <slot/>
    </div>
</template>

<script>
import "./index.less";

export default {
  data() {
    return {};
  }
};
</script>

