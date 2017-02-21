const SmoothPointer = require('./SmoothPointer.js');

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

function drawTexture(context, img, x, y, width, height, rotation) {
  context.translate(x,y);
  context.rotate(rotation);
  context.drawImage(img, -width/2, -height/2, width, height);
  context.rotate(-rotation);
  context.translate(-x,-y);
};

function Brush (canvas) 
{
  var canvas = canvas;
  var _ctx = canvas.getContext('2d');
  this.pressureSensitivity = 0;
  this.speedSensitivity = 0;
  this.angleSensitivity = 15;
  this.minSize = 2;
  this.calligAngle = 135;
  this.erase = false;
  this.maxSize = 20;
  this.hasSymmetricalEmphasis = false;
  this.alpha = 127;
  
  var _tex = document.createElement('img');
  var tempCanvas = document.createElement('canvas');
  var tempCtx = tempCanvas.getContext('2d');
  var brushImg = document.getElementById('brush-shape-bristles')
  _tex.width = brushImg.width;
  _tex.height = brushImg.height;
  this.setBrushColor = function(colorArray) {
    tempCanvas.width = brushImg.width;
    tempCanvas.height = brushImg.height;
    tempCtx.drawImage(brushImg, 0,0);
    var data = tempCtx.getImageData(0,0,brushImg.width,brushImg.height);
    for (var i = 0, ii = data.data.length; i < ii; i+=4) {
      data.data[i + 0] = colorArray[0];
      data.data[i + 1] = colorArray[1];
      data.data[i + 2] = colorArray[2];
      // data.data[i + 3] = data.data[i + 3] * colorArray[3] /255;
      //leave alpha alone
    }
    tempCtx.putImageData(data,0,0);
    _tex.src = tempCanvas.toDataURL('image/png');
  }
  this.setBrushColor([127,127,127,this.alpha]);
  
  this.pointer = new SmoothPointer(canvas, {
    minDistance: 2,
    steps: 20
  });
  this.pointer.on('down', e => {
    if (this.erase) {
      _ctx.globalCompositeOperation = 'destination-out';
    }
    var size = this.minSize + this.pressureSensitivity * e.pressure;
    drawTexture(
      _ctx      , _tex,
      e.offsetX , e.offsetY,
      size      , size,
      2 * PI * random()
    );
  })
  this.pointer.on('move', e => {
    var s = sqrt(e.squaredSpeed);
    var diff = this.maxSize - this.minSize;
    var symm = this.hasSymmetricalEmphasis ? 2 : 1;
    
    var influence = max(0,
        this.speedSensitivity    * s/(s+SPEED_SCALE)
      + this.pressureSensitivity * e.pressure
      + this.angleSensitivity    * (
          cos((PI - e.direction + this.calligAngle)*symm) *.5 +.5
        )
    );
    var size = this.minSize + influence;
    
    for (var i = 0, ii = e.pts.length; i<ii; i+=2) {
      drawTexture(
        _ctx, _tex,
        e.pts[i], e.pts[i+1],
        size, size,
        2 * PI * random()
      );
    }
  });
  this.pointer.on('up', e => {
    _ctx.globalCompositeOperation = 'source-over';
  });
}

module.exports = Brush;