<template>
    <div :style="getStyle" class="content-block">
        <div class="content-block-border-top" />
        <div class="content-block-border-right" />
        <div class="content-block-border-bottom" />
        <div class="content-block-border-left" />

        <slot/>
    </div>
</template>

<script>
import "./index.less";

export default {
  props: {
    width: {
      type: [String, Number],
      default: "auto"
    },

    height: {
      type: [String, Number],
      default: "auto"
    },

    top: {
      type: [String, Number],
      default: undefined
    },

    right: {
      type: [String, Number],
      default: undefined
    },

    bottom: {
      type: [String, Number],
      default: undefined
    },

    left: {
      type: [String, Number],
      default: undefined
    },

    zIndex: {
      type: [String, Number],
      default: 1
    }
  },

  data() {
    return {};
  },

  computed: {
    getStyle() {
      let result = {
        width: this.width,
        height: this.height,
        zIndex: this.zIndex
      };

      if (this.top !== undefined) {
        result.top = this.top;
      }

      if (this.right !== undefined) {
        result.right = this.right;
      }

      if (this.bottom !== undefined) {
        result.bottom = this.bottom;
      }

      if (this.left !== undefined) {
        result.left = this.left;
      }

      return result;
    }
  },

  mounted() {
    if (this.width !== "auto") {
      let widthType = this.width.indexOf("%") > 0 ? "%" : "px";

      this.width = parseFloat(this.width) + widthType;
    }

    if (this.height !== "auto") {
      let heightType = this.height.indexOf("%") > 0 ? "%" : "px";

      this.height = parseFloat(this.height) + heightType;
    }

    if (this.top !== undefined) {
      let topType = this.top.indexOf("%") > 0 ? "%" : "px";

      this.top = parseFloat(this.top) + topType;
    }

    if (this.right !== undefined) {
      let rightType = this.right.indexOf("%") > 0 ? "%" : "px";

      this.right = parseFloat(this.right) + rightType;
    }

    if (this.bottom !== undefined) {
      let bottomType = this.bottom.indexOf("%") > 0 ? "%" : "px";

      this.bottom = parseFloat(this.bottom) + bottomType;
    }

    if (this.left !== undefined) {
      let leftType = this.left.indexOf("%") > 0 ? "%" : "px";

      this.left = parseFloat(this.left) + leftType;
    }
  }
};
</script>
