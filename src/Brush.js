const Tool = require('./Tool.js');
const canvasutils = require('./canvasutils.js');

module.exports = class Brush extends Tool
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

    this._brushImg = null;
    this._texture = new Image();
    this._tempCanvas = document.createElement('canvas');
    this._tempCtx = this._tempCanvas.getContext('2d');
    this._color = [127,127,127,255];
  }

  set (prop, val) {
    this[prop] = val;
    this._reactor.dispatchEvent('changeend');
  }

  setImage (brushImg) {
    this._brushImg = brushImg;
    this._texture.width = brushImg.width;
    this._texture.height = brushImg.height;
    this._tempCanvas.width = brushImg.width;
    this._tempCanvas.height = brushImg.height;
    this.setColor(this._color);
    this.dispatch('changeend');
  }

  //color array is rgba, all in the range of 0-255;
  setColor (colorArray) {
    const inBrushImg = this._brushImg;
    const ctx = this._tempCtx;

    ctx.drawImage(inBrushImg, 0,0);
    const out = ctx.getImageData(0,0,inBrushImg.width,inBrushImg.height);

    for (let i = 0, ii = out.data.length; i < ii; i+=4) {
      out.data[i + 0] = colorArray[0];
      out.data[i + 1] = colorArray[1];
      out.data[i + 2] = colorArray[2];
      out.data[i + 3] *= colorArray[3] / 255;
    }

    ctx.putImageData(out,0,0);
    this._texture.src = this._tempCanvas.toDataURL('image/png');
    this._color = colorArray;
    this.dispatch('changeend');
  }

  draw (ctx, e, pts) {
    let size = this.minSize;
    for (var i = 0, ii = this._effectors.length; i < ii; i++) {
      size += this._effectors[i].transform(this, e);
    };

    for (let i = 0, ii = pts.definedLength; i<ii; i+=e.nComponents) {
      let smoothSize = size;
      for (let j = 0, jj = this._smoothedEffectors.length; j < jj; j++) {
        smoothSize += this._smoothedEffectors[j].transform(this, e);
      };
      smoothSize = Math.max(smoothSize, 0)

      canvasutils.drawTexture(ctx, this._texture,
        pts[i], pts[i + 1],
        smoothSize, smoothSize,
        2 * Math.PI * Math.random()
      );
    }
  }

  onDown (ctx, e) {
    this.draw(ctx, e, [e.offsetX, e.offsetY]);
  }
  onMove (ctx, e) {
    this.draw(ctx, e, e.pts);
  }
  onUp (ctx, e) {
  
  }
}

module.exports.EffectorTypes = {
  size: 'size'
}