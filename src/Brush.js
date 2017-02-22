const SmoothPointer = require('./SmoothPointer.js');
const canvasutils = require('./canvasutils.js');

const SPEED_SCALE = 200;
var sin = Math.sin,
    cos = Math.cos,
    abs = Math.abs,
    PI = Math.PI,
    max = Math.max,
    min = Math.min,
    sqrt = Math.sqrt,
    pow = Math.pow,
    atan2 = Math.atan2,
    random = Math.random,
    sign = Math.sign;

class Brush 
{
  constructor(canvas) {
    this._ctx = canvas.getContext('2d');

    this.pressureSensitivity = 0;
    this.speedSensitivity = 0;
    this.angleSensitivity = 15;
    this.minSize = 2;
    this.calligAngle = 135;
    this.erase = false;
    this.maxSize = 20;
    this.hasSymmetricalEmphasis = false;
    this.alpha = 255;
    
    //offscreen canvas to maniupulate and read brush image data.
    this.tempCanvas = document.createElement('canvas');
    this.tempCtx = this.tempCanvas.getContext('2d');

    this.setBrushImage(document.getElementById('brush-shape-bristles'));

    // tex is the result of manipulation
    this._tex = new Image();
    this._tex.width = this.brushImg.width;
    this._tex.height = this.brushImg.height;

    this.setBrushColor([127,127,127,this.alpha]);
    this.pointer = new SmoothPointer(canvas, {
      minDistance: 2,
      steps: 20,
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
    this.tempCanvas.width = brushImg.width;
    this.tempCanvas.height = brushImg.height;
  }

  //render the brush offscreen so we can manipulate the color/data, store in this._tex
  //color array is rgba, all in the range of 0-255;
  setBrushColor (colorArray) {
    const img = this.brushImg;
    const tempCanvas = this.tempCanvas;
    const ctx = this.tempCtx;

    ctx.drawImage(img, 0,0);
    const image = ctx.getImageData(0,0,img.width,img.height);
    for (let i = 0, ii = image.data.length; i < ii; i+=4) {
      image.data[i + 0] = colorArray[0];
      image.data[i + 1] = colorArray[1];
      image.data[i + 2] = colorArray[2];
      image.data[i + 3] *= colorArray[3] / 255;
    }

    ctx.putImageData(image,0,0);
    this._tex.src = tempCanvas.toDataURL('image/png');
  }
  
  _drawBrush (e, pts) {
    var s = Math.sqrt(e.squaredSpeed);
    var symm = this.hasSymmetricalEmphasis ? 2 : 1;
    
    var size = this.minSize + max( 0,
        this.speedSensitivity    * s/(s+SPEED_SCALE)
      + this.pressureSensitivity * e.pressure
      + this.angleSensitivity    * (
          cos((Math.PI - e.direction + this.calligAngle)*symm) *.5 +.5
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