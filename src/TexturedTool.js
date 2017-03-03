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

		if (options['shape']) this.setShape(options['shape']);
	}

	setShape (url) {
		this._brushImg.src = url;
	}

	//color array is rgba, all in the range of 0-255;
	setColor (colorArray) {
	  this._resetTempCanvas();

	  const out = this._textureCtx.getImageData(0, 0, this._texture.width, this._texture.height);
	  for (let data = out.data, i = 0, ii = data.length; i < ii; i+=4) {
	    data[i + 0] = colorArray[0];
	    data[i + 1] = colorArray[1];
	    data[i + 2] = colorArray[2];
	  }

	  this._textureCtx.putImageData(out,0,0);
	  this._color = colorArray;
	  this.emit('changeend');
	}

	_resetTempCanvas () {
		this._textureCtx.clearRect(0, 0, this._texture.width, this._texture.height);
		this._textureCtx.drawImage(this._brushImg, 0, 0);
	}

	_resizeTempCanvas() {
		const brushImg = this._brushImg;
	  this._texture.width = brushImg.width;
	  this._texture.height = brushImg.height;
		this.setColor(this._color);
	}
}