export default class MarkLine {
  constructor(map, opts) {
    this.options = opts.config;
    this.from = opts.from;
    this.to = opts.to;
    this.id = opts.id;
    this.step = 0;
    this._map = map;
  }

  getPointList(from, to) {
    let points = [
      [from.x, from.y],
      [to.x, to.y]
    ];

    let ex = points[1][0];
    let ey = points[1][1];
    points[3] = [ex, ey];
    points[1] = this.getOffsetPoint(points[0], points[3]);
    points[2] = this.getOffsetPoint(points[3], points[0]);
    points = this.smoothSpline(points, false);
    //修正最后一点在插值产生的偏移
    points[points.length - 1] = [ex, ey];

    return points;
  }

  getOffsetPoint(start, end) {
    let distance = this.getDistance(start, end) / 3; //除以3？
    let angle, dX, dY;
    let mp = [start[0], start[1]];
    let deltaAngle = -0.2; //偏移0.2弧度
    if (start[0] !== end[0] && start[1] !== end[1]) { //斜率存在
      let k = (end[1] - start[1]) / (end[0] - start[0]);
      angle = Math.atan(k);
    } else if (start[0] === end[0]) { //垂直线
      angle = (start[1] <= end[1] ? 1 : -1) * Math.PI / 2;
    } else { //水平线
      angle = 0;
    }
    if (start[0] <= end[0]) {
      angle -= deltaAngle;
      dX = Math.round(Math.cos(angle) * distance);
      dY = Math.round(Math.sin(angle) * distance);
      mp[0] += dX;
      mp[1] += dY;
    } else {
      angle += deltaAngle;
      dX = Math.round(Math.cos(angle) * distance);
      dY = Math.round(Math.sin(angle) * distance);
      mp[0] -= dX;
      mp[1] -= dY;
    }
    return mp;
  }

  smoothSpline(points, isLoop) {
    let len = points.length;
    let ret = [];
    let distance = 0;
    for (let i = 1; i < len; i++) {
      distance += this.getDistance(points[i - 1], points[i]);
    }
    let segs = distance / 2;
    segs = segs < len ? len : segs;
    for (let i = 0; i < segs; i++) {
      let pos = i / (segs - 1) * (isLoop ? len : len - 1);
      let idx = Math.floor(pos);
      let w = pos - idx;
      let p0;
      let p1 = points[idx % len];
      let p2;
      let p3;
      if (!isLoop) {
        p0 = points[idx === 0 ? idx : idx - 1];
        p2 = points[idx > len - 2 ? len - 1 : idx + 1];
        p3 = points[idx > len - 3 ? len - 1 : idx + 2];
      } else {
        p0 = points[(idx - 1 + len) % len];
        p2 = points[(idx + 1) % len];
        p3 = points[(idx + 2) % len];
      }
      let w2 = w * w;
      let w3 = w * w2;

      ret.push([
        this.interpolate(p0[0], p1[0], p2[0], p3[0], w, w2, w3),
        this.interpolate(p0[1], p1[1], p2[1], p3[1], w, w2, w3)
      ]);
    }
    return ret;
  }

  interpolate(p0, p1, p2, p3, t, t2, t3) {
    let v0 = (p2 - p0) * 0.5;
    let v1 = (p3 - p1) * 0.5;
    return (2 * (p1 - p2) + v0 + v1) * t3 + (-3 * (p1 - p2) - 2 * v0 - v1) * t2 + v0 * t + p1;
  }

  getDistance(p1, p2) {
    return Math.sqrt(
      (p1[0] - p2[0]) * (p1[0] - p2[0]) +
      (p1[1] - p2[1]) * (p1[1] - p2[1])
    );
  }

  drawMarker(context) {
    this.from.draw(context);
    this.to.draw(context);
  }

  drawLinePath(context) {
    let pointList = this.path = this.getPointList(this._map.lngLatToContainer(this.from.location), this._map.lngLatToContainer(this.to.location));
    let len = pointList.length;
    context.save();
    context.beginPath();
    context.lineWidth = this.options.lineWidth;
    context.strokeStyle = this.options.colors[this.id];

    if (!this.options.lineType || this.options.lineType === "solid") {
      context.moveTo(pointList[0][0], pointList[0][1]);
      for (let i = 0; i < len; i++) {
        context.lineTo(pointList[i][0], pointList[i][1]);
      }
    } else if (this.options.lineType === "dashed" || this.options.lineType === "dotted") {
      for (let i = 1; i < len; i += 2) {
        context.moveTo(pointList[i - 1][0], pointList[i - 1][1]);
        context.lineTo(pointList[i][0], pointList[i][1]);
      }
    }
    context.stroke();
    context.restore();
    this.step = 0; //缩放地图时重新绘制动画
  }

  drawMoveCircle(context) {
    let pointList = this.path || this.getPointList(this._map.lngLatToContainer(this.from.location), this._map.lngLatToContainer(this.to.location));
    context.save();
    context.fillStyle = this.options.fillColor;
    context.shadowColor = this.options.shadowColor;
    context.shadowBlur = this.options.shadowBlur;
    context.beginPath();
    context.arc(pointList[this.step][0], pointList[this.step][1], this.options.moveRadius, 0, Math.PI * 2, true);
    context.fill();
    context.closePath();
    context.restore();
    this.step += 1;
    if (this.step >= pointList.length) {
      this.step = 0;
    }
  }
}
