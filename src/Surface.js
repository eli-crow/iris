const Emitter = require('./Emitter.js');
const listenerutils = require('./listenerutils.js');
const fnutils = require('./fnutils.js');
const canvasutils = require('./canvasutils.js');
const Tool = require('./Tool.js');

//an abstraction layer for canvas.
module.exports = class Surface extends Emitter
{
	constructor(canvas) {
		super(['sample', 'load']);

		this.canvas = canvas || document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.position = [0,0];

		this._tempCanvas = document.createElement('canvas');
		this._tempCtx = this._tempCanvas.getContext('2d');

		//init
		this.canvas.oncontextmenu = () => false;
	}

	clear () { 
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); 
	}

	resize(w,h) {
		const canvas = this.canvas;
		
		this._tempCanvas.width = canvas.width;
		this._tempCanvas.height = canvas.height;
		this._tempCtx.drawImage(canvas, 0, 0);
		canvas.width = w;
		canvas.height = h;
		this.ctx.drawImage(this._tempCanvas, 0, 0);
	}

	appendTo (element) {
		element.appendChild(this.canvas);
	}

	getDataURL (filename) {
		return this.canvas.toDataURL();
	}

	static fromDataUrl (url) {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		const surface = new Surface(canvas, true);

		const img = new Image();
		img.onload = () => {
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);
			surface.emit('load');
		}
		img.src = url;

		return surface;
	}
}