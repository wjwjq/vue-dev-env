import CanvasLayer from "./CanvasLayer";
import MarkLine from "./MarkLine";
import MarkPoint from "./MarkPoint";

/* var global = typeof window === "undefined" ? {} : window;

window.requestAnimationFrame = global.requestAnimationFrame ||
    global.mozRequestAnimationFrame ||
    global.webkitRequestAnimationFrame ||
    global.msRequestAnimationFrame ||
    function (callback) {
      return global.setTimeout(callback, 1000 / 60);
    };

window.cancelAnimationFrame = global.cancelAnimationFrame ||
    global.mozCancelAnimationFrame ||
    global.webkitCancelAnimationFrame ||
    global.msCancelAnimationFrame ||
    function (id) {
      clearTimeout(id);
    };
 */

class MoveLine {

  options = {
    //marker点半径
    markerRadius: 3,
    //marker点颜色,为空或null则默认取线条颜色
    markerColor: "#fff",
    //线条类型 solid、dashed、dotted
    lineType: "solid",
    //线条宽度
    lineWidth: 1,
    //线条颜色
    colors: ["#F9815C", "#F8AB60", "#EDCC72", "#E2F194", "#94E08A", "#4ECDA5"],
    //移动点半径
    moveRadius: 2,
    //移动点颜色
    fillColor: "#fff",
    //移动点阴影颜色
    shadowColor: "#fff",
    //移动点阴影大小
    shadowBlur: 5
  };

  animationFlag = true;

  markLines = [];

  constructor(map, userOptions) {
    this.merge(userOptions);

    this.width = map.getSize().width;
    this.height = map.getSize().height;

    this._map = map;

    this.baseLayer = new CanvasLayer({
      map: map,
      update: () => this.brush()
    });

    this.animationLayer = new CanvasLayer({
      map: map,
      update: () => this.render()
    });

    this.mouseInteract();

    this.drawFrame();
  }

  //参数合并
  merge(userOptions) {
    Object.keys(userOptions).forEach(key => {
      this.options[key] = userOptions[key];
    });
  }

  //底层canvas渲染，标注，线条
  brush() {
    var baseCtx = this.baseLayer.canvas.getContext("2d");
    baseCtx.clearRect(0, 0, this.width, this.height);

    if (!baseCtx) {
      return;
    }
    this.addMarkLine();

    this.markLines.forEach(line => {
      line.drawMarker(baseCtx);
      line.drawLinePath(baseCtx);
    });
  }

  //上层canvas渲染，动画效果
  render() {

    var animationCtx = this.animationLayer.canvas.getContext("2d");

    if (!animationCtx) {
      return;
    }

    if (!this.animationFlag) {
      animationCtx.clearRect(0, 0, this.width, this.height);
      return;
    }

    animationCtx.fillStyle = "rgba(0,0,0,.93)";
    var prev = animationCtx.globalCompositeOperation;
    animationCtx.globalCompositeOperation = "destination-in";
    animationCtx.fillRect(0, 0, this.width, this.height);
    animationCtx.globalCompositeOperation = prev;

    for (var i = 0; i < this.markLines.length; i++) {
      var markLine = this.markLines[i];
      markLine.drawMoveCircle(animationCtx); //移动圆点
    }
  }

  //鼠标事件
  mouseInteract() {
    this._map.on("movestart", () => {
      this.animationFlag = false;
    });

    this._map.on("dragstart", () => {
      this.animationFlag = false;
    });

    this._map.on("zoomstart", () => {
      this.animationFlag = false;
    });

    this._map.on("moveend ", () => {
      this.animationFlag = true;
      this.markLines = [];
    });

    this._map.on("zoomend", () => {
      this.animationFlag = true;
      this.markLines = [];
    });

    this._map.on("dragend", () => {
      this.animationFlag = true;
      this.markLines = [];
    });
  }

  addMarkLine() {
    this.markLines = [];

    this.options.data.forEach((line, i) => {
      this.markLines.push(new MarkLine(this._map, {
        id: i,
        config: this.options,
        from: new MarkPoint(this._map, {
          city: line.from.city,
          location: [line.from.lnglat[0], line.from.lnglat[1]],
          markerRadius: this.options.markerRadius,
          markerColor: this.options.markerColor || this.options.colors[i]
        }),
        to: new MarkPoint(this._map, {
          city: line.to.city,
          location: [line.to.lnglat[0], line.to.lnglat[1]],
          markerRadius: this.options.markerRadius,
          markerColor: this.options.markerColor || this.options.colors[i]
        })
      }));
    });

  }

  update(resetOpts) {
    for (var key in resetOpts) {
      this.options[key] = resetOpts[key];
    }
  }

  drawFrame() {
    requestAnimationFrame(() => this.drawFrame());
    this.render();
  }
}


export default MoveLine;