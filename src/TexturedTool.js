import Tool from './Tool.js';
import Spacer from './Spacer.js';
import ToolShapeSelector from './ToolShapeSelector.js';

const __shapeUrls = [
	'./img/brush_smooth.png',
	'./img/brush.png',
	'./img/brush_inky.png'
];

export default class TexturedTool extends Tool
{
	constructor(events, options) {
		super(events, options);

		this._sizeRatio = 1;

		this._texture = document.createElement('canvas');
		this._textureCtx = this._texture.getContext('2d');
		this._color = [190,190,190,255];
		this._brushImg = new Image();
		this._shapeSelector = new ToolShapeSelector(__shapeUrls);

		this._brushImg.onload = () => this._redrawTexture(this._color);
		this._shapeSelector.on(['changeend', 'load'], shape => this.setShape(shape));
	}

	setShape (brushShape) {
		this._brushImg.src = brushShape.brushSrc;
		this._sizeRatio = brushShape.ratio;
	}

	setColor(colorData) {
		this._color = colorData.rgba;
		this._redrawTexture(this._color);
	}

	getInputs () {
		if (this._inputs) {
			return this._inputs;
		}
		
		const inputs = super.getInputs();
		inputs.base = [ this._shapeSelector, this._shapeSelector.getInputs(), new Spacer()].concat(inputs.base);
		return inputs;
	}

	_resetTempCanvas () {
		this._textureCtx.clearRect(0, 0, this._texture.width, this._texture.height);
		this._textureCtx.drawImage(this._brushImg, 0, 0);
	}

	_redrawTexture(rgba) {
		const b = this._brushImg;
		const t = this._texture;
		const ctx = this._textureCtx;

	  t.width = b.width;
	  t.height = b.height;

		this._resetTempCanvas();

		const out = ctx.getImageData(0, 0, t.width, t.height);
		for (let data = out.data, i = 0, ii = data.length; i < ii; i+=4) {
		  data[i + 0] = rgba[0];
		  data[i + 1] = rgba[1];
		  data[i + 2] = rgba[2];
		}

		ctx.putImageData(out,0,0);
		this._color = rgba;
		this.emit('changeend');
	}
}