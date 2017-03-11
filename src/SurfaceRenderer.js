const Surface = require('./Surface.js');
const Emitter = require('./Emitter.js');

// the final drawing surface, combines and displays surfaces. 
module.exports = class SurfaceRenderer extends Emitter
{
	constructor (containerElement) {
		super(['drawend'])

		this._element = containerElement || document.createElement('div');
		this._compositeCanvas = document.createElement('canvas');
		this._compositeCtx = this._compositeCanvas.getContext('2d');

		//init
		this._element.appendChild(this._compositeCanvas);
	}

	draw (surfaces) {
		for (var i = 0, ii = surfaces.length; i < ii; i++) {
			surfaces[i];
		}
	}

	compose (canvas, compositeOperation) {
		const ctx = this._compositeCtx;
		ctx.save();
		ctx.globalCompositeOperation = compositeOperation;
		ctx.drawImage(canvas);
		ctx.restore();
	}
}