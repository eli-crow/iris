const Emitter = require('./Emitter.js');
const listenerutils = require('./listenerutils.js');
const fnutils = require('./fnutils.js');
const canvasutils = require('./canvasutils.js');
const Tool = require('./Tool.js');

const BlendMode = {
	Normal: 'source-over',
	Filter: 'multiply',
	Inside: 'source-atop',
	Hide: 'destination-out',
	Mask: 'destination-out'
}

//an abstraction layer for canvas.
module.exports = class Surface extends Emitter
{
	constructor(canvas, name) {
		super(['sample', 'load']);

		this.canvas = canvas || document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.position = [0,0];
		this.name = name || 'surface';
		this.blendMode = BlendMode.Normal;

		this._tempCanvas = document.createElement('canvas');
		this._tempCtx = this._tempCanvas.getContext('2d');
		//todo: add a defined bounds based on where a marking tool has touched

		//init
		this.canvas.oncontextmenu = () => false;
	}

	clear () { 
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); 
	}

	setPosition (x, y) {
		this.position = [x, y];
	}

	resize(w,h,x = 0,y = 0) {
		const canvas = this.canvas;
		
		this._tempCanvas.width = canvas.width;
		this._tempCanvas.height = canvas.height;
		this._tempCtx.drawImage(canvas, 0, 0);
		canvas.width = w;
		canvas.height = h;
		this.ctx.drawImage(this._tempCanvas, x, y);
	}

	get width () { return this.canvas.width }
	get height () { return this.canvas.height }

	//todo: make this the primary way of resizing
	resizeToSurface(surface) {
		const sa = this.getBounds();
		const sb = surface.getBounds();

		const l = Math.min(sa.left, sb.left);
		const t = Math.min(sa.top, sb.top);
		const r = Math.max(sa.right, sb.right);
		const b = Math.max(sa.bottom, sb.bottom);

		const x = sb.left - sa.left;
		const y = sb.top - sa.top;

		this.setPosition(x, y);
		this.resize(r - l, b - t, x, y);
	}

	appendTo (element) {
		element.appendChild(this.canvas);
	}

	getDataURL (filename) {
		return this.canvas.toDataURL();
	}

	getBounds () {
		const self = this;
		return {
			left:   self.position[0], 
			right:  self.position[0] + self.width,
			top:    self.position[1], 
			bottom: self.position[1] + self.height
		};
	}

	static fromDataUrl (url, name) {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		const surface = new Surface(canvas, name);

		const img = new Image();
		img.onload = () => {
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);
			surface.name = name || 'surface name';
			surface.emit('load');
		}
		img.src = url;

		return surface;
	}
}

module.exports.BlendMode = BlendMode;