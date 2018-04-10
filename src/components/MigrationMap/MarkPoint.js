//标记点
export default class MarkPoint {
  constructor(map, opts) {
    this.city = opts.city;
    this.location = opts.location;
    this.markerColor = opts.markerColor;
    this.markerRadius = opts.markerRadius;
    this.pixel = {};
    this._map = map;
  }

  draw(context) {
    const pixel = this.pixel = this._map.lngLatToContainer(this.location);

    context.save();
    context.beginPath();

    context.fillStyle = this.markerColor;

    context.arc(pixel.x, pixel.y, this.markerRadius, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();

    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "12px Microsoft YaHei";
    context.fillStyle = this.markerColor;

    context.fillText(this.city, pixel.x, pixel.y - 10);
    context.restore();
  }
}