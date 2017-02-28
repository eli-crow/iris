const Tool = require('./Tool.js');

module.exports = class TexturedTool extends Tool
{
	constructor(surface, options) {
		super(surface, options);

		this._texture = document.createElement('canvas');
		this._textureCtx = this._texture.getContext('2d');
		this._color = [127,127,127,255];
		this._brushImg = new Image();
		this._brushImg.onload = () => this._resizeTempCanvas();
	}

	setImage (url) {
		this._brushImg.src = url;
	}

	_resizeTempCanvas() {
		const brushImg = this._brushImg;
	  this._texture.width = brushImg.width;
	  this._texture.height = brushImg.height;
		this.setColor(this._color);
	}

	//color array is rgba, all in the range of 0-255;
	setColor (colorArray) {
	  const inBrushImg = this._brushImg;
	  const canvas = this._texture;
	  const ctx = this._textureCtx;

	  const w = canvas.width | 0;
	  const h = canvas.height | 0;
	  
	  ctx.clearRect(0, 0, w, h);
	  ctx.drawImage(inBrushImg, 0,0);
	  const out = ctx.getImageData(0,0,w,h);
	  const data = out.data;

	  for (let i = 0, ii = data.length; i < ii; i+=4) {
	    data[i + 0] = colorArray[0];
	    data[i + 1] = colorArray[1];
	    data[i + 2] = colorArray[2];
	    //alpha should be left alone
	  }

	  ctx.putImageData(out,0,0);
	  this._color = colorArray;
	  this.emit('changeend');
	}
}