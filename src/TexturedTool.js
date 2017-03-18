const Tool = require('./Tool.js');
const ToolShapeSelector = require('./ToolShapeSelector.js');

const __shapeUrls = [
	'./img/brush_smooth.png',
	'./img/brush.png',
	'./img/brush_inky.png'
];

module.exports = class TexturedTool extends Tool
{
	constructor(events, options) {
		super(events, options);

		this._sizeRatio = 1;

		this._texture = document.createElement('canvas');
		this._textureCtx = this._texture.getContext('2d');
		this._color = [190,190,190,255];
		this._brushImg = new Image();
		this._shapeSelector = new ToolShapeSelector(__shapeUrls);

		this._brushImg.onload = () => this._redrawTexture();
		this._shapeSelector.on(['changeend', 'load'], data => this.setShape(data));
	}

	setShape (shape) {
		this._brushImg.src = shape.brushSrc;
		this._sizeRatio = shape.ratio;
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

	getInputs () {
		if (this._inputs) {
			return this._inputs;
		}
		
		const inputs = super.getInputs();
		inputs.shape = [ this._shapeSelector, this._shapeSelector.getInputs() ];
		return inputs;
	}

	_resetTempCanvas () {
		this._textureCtx.clearRect(0, 0, this._texture.width, this._texture.height);
		this._textureCtx.drawImage(this._brushImg, 0, 0);
	}

	_redrawTexture() {
		const brushImg = this._brushImg;
	  this._texture.width = brushImg.width;
	  this._texture.height = brushImg.height;
		this.setColor(this._color);
	}
}