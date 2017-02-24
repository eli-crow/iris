const TexturedTool = require('./TexturedTool.js');
const canvasutils = require('./canvasutils.js');

module.exports = class Brush extends TexturedTool
{
  constructor() {
    super();

    this.minSize = 2;
    this.erase = false;
    this.flow = 255;
    this.pressureSensitivity = 0;
    this.angleSensitivity = 15;
    this.speedSensitivity = 0;
    this.speedScale = 200;
    this.calligAngle = 135;
    this.hasSymmetricalEmphasis = false;
  }

  draw (ctx, e, pts) {
    let size = this.minSize + this.getEffectorSum(this._effectors, e);

    for (let i = 0, ii = pts.definedLength; i<ii; i+=e.nComponents) {
      let smoothSize = Math.max(0, size + this.getEffectorSum(this._smoothedEffectors, e) );
      canvasutils.drawTexture(
        ctx, this._texture,
        pts[i], pts[i + 1],
        smoothSize, smoothSize,
        2 * Math.PI * Math.random()
      );
    }
  }

  onDown (ctx, e) { this.draw(ctx, e, [e.offsetX, e.offsetY]); }
  onMove (ctx, e) { this.draw(ctx, e, e.pts); }
  onUp (ctx, e)   {}
}

module.exports.EffectorTypes = {
  size: 'size'
}