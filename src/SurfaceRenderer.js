const Surface = require('./Surface.js');
const Emitter = require('./Emitter.js');

const __defaults = {
	width: 800,
	height: 1200
}

// the final drawing surface, combines and displays surfaces. 
module.exports = class SurfaceRenderer extends Emitter
{
	constructor (containerElement, options) {
		super(['draw'])

		this._element = containerElement || document.createElement('div');
		this._compositeCanvas = document.createElement('canvas');
		this._compositeCtx = this._compositeCanvas.getContext('2d');

		this.width = options.width || __defaults.width;
		this.height = options.height || __defaults.height;

		//init
		this._element.appendChild(this._compositeCanvas);
		this._compositeCanvas.width = this.width;
		this._compositeCanvas.height = this.height;
		this._compositeCanvas.classList.add('iris-surface');
	}

	draw (surfaces) {
		const ctx = this._compositeCtx;
		for (let i = 0, ii = surfaces.length; i < ii; i++) {
			const surface = surfaces[i];
			ctx.drawImage(surface.canvas, surface.position[0], surface.position[1]);
		}

		this.emit('draw', this._compositeCanvas);
	}

	static compose (ctx, surface, compositeOperation) {
		ctx.save();
		ctx.globalCompositeOperation = compositeOperation;
		ctx.drawImage(canvas);
		ctx.restore();
	}
}