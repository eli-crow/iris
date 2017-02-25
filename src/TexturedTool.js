const Tool = require('./Tool.js');

module.exports = class TexturedTool extends Tool
{
	constructor(surface, options) {
		super(surface, options);

		this._brushImg = null;
		this._texture = new Image();
		this._tempCanvas = document.createElement('canvas');
		this._tempCtx = this._tempCanvas.getContext('2d');
		this._color = [127,127,127,255];
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
}