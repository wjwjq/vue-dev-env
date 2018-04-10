class CanvasLayer {
  constructor(options) {
    this.options = options || {};
    this.zIndex = this.options.zIndex || 0;
    this._map = options.map;
    this.canvas = null;
    this.initialize();
  }

  initialize() {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "migration-map";
    const ctx = this.ctx = this.canvas.getContext("2d");

    this.canvas = document.createElement("canvas");

    this.canvas.width = this._map.getSize().width;
    this.canvas.height = this._map.getSize().height;
    this.adjustSize();
    this.adjustRatio(ctx);

    this._map.plugin(["AMap.CustomLayer"], () => {
      const cus = new AMap.CustomLayer(this.canvas, {
        zoom: [4, 8],
        zIndex: 12
      });
      cus.render = () => this.draw();
      cus.setMap(this._map);
    });

    return this.canvas;
  }

  adjustRatio(ctx) {
    var backingStore = ctx.backingStorePixelRatio ||
      ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio || 1;
    var pixelRatio = (window.devicePixelRatio || 1) / backingStore;
    var canvasWidth = ctx.canvas.width;
    var canvasHeight = ctx.canvas.height;
    ctx.canvas.width = canvasWidth * pixelRatio;
    ctx.canvas.height = canvasHeight * pixelRatio;
    ctx.canvas.style.width = canvasWidth + "px";
    ctx.canvas.style.height = canvasHeight + "px";
    ctx.scale(pixelRatio, pixelRatio);
  }

  adjustSize() {
    var size = this._map.getSize();
    var canvas = this.canvas;
    canvas.width = size.width;
    canvas.height = size.height;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
  }

  draw() {
    this.options.update && this.options.update();
  }

  getContainer() {
    return this.canvas;
  }


  show = function () {
    this.canvas.style.display = "block";
  }
}

export default CanvasLayer;