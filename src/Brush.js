const SmoothPointer = require('./SmoothPointer.js');
const canvasutils = require('./canvasutils.js');

class Brush 
{
  constructor(canvas) {
    this._ctx = canvas.getContext('2d');
    this._tex = new Image();
    this._tempCanvas = document.createElement('canvas');
    this._tempCtx = this._tempCanvas.getContext('2d');

    this.minSize = 2;
    this.erase = false;
    this.alpha = 255;
    this.pressureSensitivity = 0;
    this.angleSensitivity = 15;
    this.speedSensitivity = 0;
    this.speedScale = 200;
    this.calligAngle = 135;
    this.hasSymmetricalEmphasis = false;

    this.setBrushImage(document.getElementById('brush-shape-bristles'));
    this.setBrushColor([127,127,127,this.alpha]);

    this.pointer = new SmoothPointer(canvas, {
      minDistance: 2,
      steps: 15,
      down: e => {
        if (this.erase) _ctx.globalCompositeOperation = 'destination-out';
        this._drawBrush(e, [e.offsetX, e.offsetY]);
      },
      move: e => this._drawBrush(e, e.pts),
      up: e => this._ctx.globalCompositeOperation = 'source-over'
    });
  }

  setBrushImage (brushImg) {
    this.brushImg = brushImg;
    this._tex.width = brushImg.width;
    this._tex.height = brushImg.height;
    this._tempCanvas.width = brushImg.width;
    this._tempCanvas.height = brushImg.height;
  }

  //color array is rgba, all in the range of 0-255;
  setBrushColor (colorArray) {
    const inBrushImg = this.brushImg;
    const ctx = this._tempCtx;
    ctx.drawImage(inBrushImg, 0,0);
    
    const outBrushImg = ctx.getImageData(0,0,inBrushImg.width,inBrushImg.height);
    for (let i = 0, ii = outBrushImg.data.length; i < ii; i+=4) {
      outBrushImg.data[i + 0] = colorArray[0];
      outBrushImg.data[i + 1] = colorArray[1];
      outBrushImg.data[i + 2] = colorArray[2];
      outBrushImg.data[i + 3] *= colorArray[3] / 255;
    }

    ctx.putImageData(outBrushImg,0,0);
    this._tex.src = this._tempCanvas.toDataURL('image/png');
  }
  
  _drawBrush (e, pts) {
    var s = Math.sqrt(e.squaredSpeed);
    var symm = this.hasSymmetricalEmphasis ? 2 : 1;
    
    var size = this.minSize + Math.max( 0,
        this.speedSensitivity    * s/(s+this.speedScale)
      + this.pressureSensitivity * e.pressure
      + this.angleSensitivity    * (
          Math.cos((Math.PI - e.direction + this.calligAngle)*symm) *.5 +.5
        )
    );

    for (var i = 0, ii = pts.length; i<ii; i+=2) {
      canvasutils.drawTexture(
        this._ctx  , this._tex,
        pts[i]    , pts[i + 1],
        size      , size,
        2 * Math.PI * Math.random()
      );
    }
  }
}

module.exports = Brush;